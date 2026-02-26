import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MainHelpers } from 'nextalys-js-helpers';
import * as path from 'path';
import {
    FindOneOptions,
    getManager,
    In,
    IsNull,
    Not,
    Repository,
} from 'typeorm';
import { JwtPayload } from '../../shared/jwt-payload';
import {
    CandidateFileType,
    CandidateStatus,
    RolesList,
} from '../../shared/shared-constants';
import { SharedService } from '../../shared/shared-service';
import { User } from '../entities/user.entity';
import { Environment } from '../environment/environment';
import { AppErrorWithMessage } from '../models/app-error';
import {
    GetConnectedConsultantsResponse,
    GetUserResponse,
    GetUsersResponse,
    GetUserStatsResponse,
    UserDto,
} from '../models/dto/user-dto';
import { UserRoleDto } from '../models/dto/user-role-dto';
import { BaseSearchRequest } from '../models/requests/base-search-requests';
import { FindUsersRequest } from '../models/requests/user-requests';
import { GenericResponse } from '../models/responses/generic-response';
import { CandidateService } from '../modules/candidates/candidates.service';
import { JobOfferService } from '../modules/job-offers/job-offers.service';
import { SocketData } from '../sockets/socket-data';
import { userRolesRules } from './auth-custom-rules';
import { AuthToolsService } from './auth-tools.service';
import {
    ApplicationBaseModelService,
    LinqQueryWrapper,
} from './base-model.service';
import { ReferentialService } from './referential.service';
import { FileService } from './tools/file.service';
import { ApiMainHelpers } from './tools/helpers.service';
import { UserRoleService } from './user-roles.service';

//Warning : IN Node template dot not change if not in template
@Injectable()
export class UsersService extends ApplicationBaseModelService<
    User,
    UserDto,
    GetUserResponse,
    GetUsersResponse
> {
    constructor(
        @InjectRepository(User)
        public readonly usersRepository: Repository<User>,
        private readonly userRoleService: UserRoleService,
        public readonly jwtService: JwtService,
        private fileService: FileService,
        @Inject(forwardRef(() => CandidateService))
        private candidateService: CandidateService,
        @Inject(forwardRef(() => JobOfferService))
        private jobOfferService: JobOfferService,
        private referentialService: ReferentialService,
    ) {
        super();
        this.modelOptions = {
            getManyResponse: GetUsersResponse,
            getOneResponse: GetUserResponse,
            getManyResponseField: 'users',
            getOneResponseField: 'user',
            repository: this.usersRepository,
            getManyRelations: ['roles', 'image', 'gender'],
            getOneRelations: ['roles', 'image', 'gender'],
            entity: User,
            getManyRelationsLinq: [{ include: (x) => x.roles }],
            getOneRelationsLinq: [{ include: (x) => x.roles }],
            archiveField: 'disabled',
            archiveFieldValue: true,
        };
    }

    async getUsers(request: FindUsersRequest): Promise<GetUsersResponse> {
        let response = new GetUsersResponse();

        try {
            const findOptions = BaseSearchRequest.getDefaultFindOptions<User>(
                request,
                ['language'],
            );
            // if (request.order && request.orderby) { //TODO : test in typeorm 0.3.0
            //     if (request.orderby === 'language')
            //         (findOptions.order as any)[request.orderby] = { label: request.order.toUpperCase() };
            // }

            let rolesList: UserRoleDto[] = [];

            if (!!request.roles?.length) {
                const rolesCodesList = request.roles.split(',');
                if (rolesCodesList.some((x) => !!x)) {
                    const rolesResponse = await this.userRoleService.findAll({
                        where: { role: In(rolesCodesList) },
                    });

                    if (rolesResponse.userRoles?.length) {
                        rolesList = rolesResponse.userRoles;
                    }
                }
            }

            // console.log("Log ~ file: users.service.ts ~ line 70 ~ UsersService ~ getUsers ~ rolesList", rolesList);
            let baseQuery = this.usersRepository.createQueryBuilder('users');

            if (request.includeImage === 'true') {
                baseQuery = baseQuery.leftJoinAndSelect('users.image', 'image');
            }

            if (request.includeGender === 'true') {
                baseQuery = baseQuery.leftJoinAndSelect(
                    'users.gender',
                    'gender',
                );
            }

            if (request.includeCandidate === 'true') {
                baseQuery = baseQuery.leftJoinAndSelect(
                    'users.candidate',
                    'candidate',
                );
                baseQuery = baseQuery.leftJoinAndSelect(
                    'candidate.files',
                    'files',
                );
                baseQuery = baseQuery.leftJoinAndSelect('files.file', 'file');
                baseQuery = baseQuery.leftJoinAndSelect(
                    'files.fileType',
                    'fileType',
                );
            }

            const parameters: { search?: string; roleIds?: number[] } = {};

            if (rolesList?.length) {
                parameters.roleIds = rolesList.map((x) => x.id);
                baseQuery = baseQuery.innerJoinAndSelect(
                    'users.roles',
                    'userRole',
                    'userRole.id IN (:...roleIds)',
                );
            } else if (request.includeRoles === 'true') {
                baseQuery = baseQuery.leftJoinAndSelect(
                    'users.roles',
                    'userRole',
                );
            }

            if (request.search) {
                parameters.search = `%${request.search}%`;
                baseQuery = baseQuery.andWhere(
                    '(users.userName LIKE :search OR users.firstName LIKE :search OR users.lastName LIKE :search OR CONCAT(users.firstName, " ",users.lastName) LIKE :search' +
                        ' OR CONCAT(users.lastName, " ",users.firstName) LIKE :search)',
                );
            }

            if (request.includeDisabled !== 'true') {
                baseQuery = baseQuery.andWhere('(users.disabled = 0)');
            }

            baseQuery.setParameters(parameters);

            if (request.order && request.orderby) {
                baseQuery = baseQuery.orderBy(
                    'users.' + request.orderby,
                    request.order.toUpperCase() as 'ASC' | 'DESC',
                );
            }

            // console.log("🚀 ~ getUsers ~ baseQuery", baseQuery)

            response.filteredResults = await baseQuery.getCount();
            baseQuery = baseQuery.skip(findOptions.skip).take(findOptions.take);
            const users = await baseQuery.getMany();
            response.users = users.map((x) => x.toDto());

            const userIds = response.users.map((x) => x.id);

            if (userIds?.length && request.includeRoles === 'true') {
                const manager = getManager();
                const userRolesRelations = (await manager.query(
                    'select * from user_roles where usersId IN (?);',
                    [userIds],
                )) as { rolesId: number; usersId: string }[];
                if (userRolesRelations?.length) {
                    const userRolesList = await this.userRoleService.findAll({
                        where: {
                            id: In(userRolesRelations.map((x) => x.rolesId)),
                        },
                    });

                    if (userRolesList.userRoles?.length) {
                        for (const userRolesRelation of userRolesRelations) {
                            const user = response.users.find(
                                (x) => x.id === userRolesRelation.usersId,
                            );

                            if (
                                user &&
                                !user.roles.some(
                                    (x) => x.id === userRolesRelation.rolesId,
                                )
                            ) {
                                const userRoleDto =
                                    userRolesList.userRoles.find(
                                        (x) =>
                                            x.id === userRolesRelation.rolesId,
                                    );

                                if (userRoleDto) {
                                    user.roles.push(userRoleDto);
                                }
                            }
                        }
                    }
                }
            }

            if (response.users?.length) {
                for (const user of response.users) {
                    if (user.candidate?.files?.length) {
                        const mainPhotoFile = user.candidate.files.find(
                            (x) =>
                                x.fileType &&
                                x.fileType.code === CandidateFileType.MainPhoto,
                        )?.file;

                        if (mainPhotoFile) {
                            user.image = mainPhotoFile;
                        }
                    }
                }
            }
            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    async findOne(
        conditions: FindOneOptions<User> | LinqQueryWrapper<User>,
        getPassword: boolean = false,
    ): Promise<GetUserResponse> {
        return super.findOne(conditions, getPassword);
    }

    private generateUserNameFromUser(user: UserDto) {
        let userName = MainHelpers.formatToUrl(
            (user.firstName ? user.firstName + '-' : '') +
                (user.lastName ?? ''),
        );
        if (!userName) userName = MainHelpers.formatToUrl(user.mail);
        if (userName && userName.endsWith('-'))
            userName = userName.substring(0, userName.length - 1);
        if (userName && userName.length > 30) {
            userName = userName.substring(0, 30);
        }
        return userName;
    }

    async createOrUpdate(
        user: UserDto,
        mustGenerateToken: boolean = false,
        currentPayload: JwtPayload = null,
    ): Promise<GetUserResponse> {
        const response = new GetUserResponse();

        try {
            let userEntity = await this.usersRepository.findOne({
                id: user.id,
            });

            if (!userEntity) {
                userEntity = new User();
            }

            if (user.password) {
                userEntity.password = await ApiMainHelpers.hashPassword(
                    user.password,
                );
            }

            if (user.id) {
                await this.fileService.handleFileUpload(
                    userEntity,
                    user,
                    'image',
                    path.join(Environment.UserPublicFilesDirectory, user.id),
                );
            }

            for (const userRolesRule of userRolesRules) {
                if (
                    user?.roles?.some(
                        (x) => x.role === userRolesRule.roleToAdd,
                    ) &&
                    !SharedService.userHasOneOfRoles(
                        currentPayload,
                        userRolesRule.allowedRoles,
                    )
                ) {
                    user.roles = user.roles.filter(
                        (x) => x.role !== userRolesRule.roleToAdd,
                    );
                }
            }

            userEntity.fromDto(user);

            if (userEntity?.roles?.length) {
                for (const role of userEntity.roles) {
                    const roleResponse = await this.userRoleService.findOne({
                        where: { role: role.role },
                    });

                    if (roleResponse.success && roleResponse.userRole) {
                        role.id = roleResponse.userRole.id;
                    }
                }
            }

            if (!userEntity.userName) {
                let userName = this.generateUserNameFromUser(user);

                if (!userName) {
                    throw new AppErrorWithMessage(
                        "Impossible de générer le nom d'utilisateur !",
                    );
                }

                const usersWithSameUserName = await this.usersRepository.find({
                    where: { userName: userName },
                    select: ['userName'],
                });

                if (usersWithSameUserName.length) {
                    let userNameTmp = userName;
                    let userNameSuffixCount = 2;

                    while (
                        usersWithSameUserName.some(
                            (x) => x.userName === userNameTmp,
                        )
                    ) {
                        userNameTmp = userName + '-' + userNameSuffixCount;
                        userNameSuffixCount++;
                    }
                    userName = userNameTmp;
                }

                userEntity.userName = userName;
            }

            //  console.log('userEntity', userEntity);
            userEntity = await this.usersRepository.save(userEntity);
            const getUserResponse = await this.findOne({
                where: { id: userEntity.id },
            });

            if (getUserResponse.success && getUserResponse.user) {
                response.user = getUserResponse.user;
            }

            if (mustGenerateToken) {
                response.token = AuthToolsService.createUserToken(
                    this.jwtService,
                    response.user,
                );
            }

            response.success = true;
        } catch (err) {
            if (
                err &&
                err.message &&
                err.message.indexOf('Duplicate entry') !== -1
            ) {
                //duplicate user
                err = new AppErrorWithMessage(
                    'Cet identifiant utilisateur est déjà utilisé !',
                );
            }

            response.handleError(err);
        }

        return response;
    }

    async getConsultantStats(userId: string): Promise<GetUserStatsResponse> {
        const response = new GetUserStatsResponse();

        try {
            const appValueResponse =
                await this.referentialService.getOneAppValue(
                    CandidateStatus.Placed,
                );

            response.candidatePlaced = await this.candidateService
                .getRepository()
                .count({
                    where: {
                        consultantId: userId,
                        candidateStatusId: appValueResponse.appValue.id,
                    },
                });

            response.jobOfferLinked = await this.jobOfferService
                .getRepository()
                .count({ where: { consultantId: userId, disabled: false } });

            response.candidateLinked = await this.candidateService
                .getRepository()
                .count({ where: { consultantId: userId } });

            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    async getConnectedConsultants(): Promise<GetConnectedConsultantsResponse> {
        const response = new GetConnectedConsultantsResponse();

        try {
            const connectionsList = SocketData.UserConnectionsList;

            if (!connectionsList?.length) {
                response.success = true;
                return response;
            }

            const usersResponse = await this.usersRepository.find({
                where: {
                    id: In(
                        connectionsList
                            .filter((z) => !!z.connections?.length)
                            .map((x) => x.userId),
                    ),
                },
                select: ['id'],
                relations: ['roles'],
            });

            if (usersResponse?.length) {
                response.connectedConsultants = usersResponse.filter((x) =>
                    x.roles.some((y) => y.role === RolesList.Consultant),
                ).length;
            }

            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    async setUsersLanguagesJob(): Promise<GenericResponse> {
        const response = new GenericResponse();

        try {
            const getLanguagesResponse =
                await this.referentialService.getAllLanguages();
            const languageFR = getLanguagesResponse.languages.find(
                (x) => x.code === 'fr',
            );
            const languageEN = getLanguagesResponse.languages.find(
                (x) => x.code === 'en',
            );
            const maxUpdate = 6000;
            const users = await this.usersRepository.find({
                where: { languageId: IsNull(), candidateId: Not(IsNull()) },
                relations: ['candidate', 'candidate.addresses'],
                order: { creationDate: 'DESC' },
            });
            let index = 0;

            for (const user of users) {
                const candidateAdresse = user.candidate?.addresses?.[0];
                if (
                    !candidateAdresse?.country ||
                    candidateAdresse.country.toLowerCase() === 'fr'
                ) {
                    user.languageId = languageFR.id;
                } else {
                    user.languageId = languageEN.id;
                }

                await this.usersRepository.update(
                    { id: user.id },
                    { languageId: user.languageId },
                );

                index++;

                if (index >= maxUpdate) {
                    break;
                }
            }

            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }
}
