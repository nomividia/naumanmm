import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { DateHelpers, MainHelpers } from 'nextalys-js-helpers';
import { FindOneOptions } from 'typeorm';
import { SharedCandidatesHelpers } from '../../shared/candidates-helpers';
import { RoutesList } from '../../shared/routes';
import {
    ActivityLogCode,
    refreshTokenLsKey,
    RolesList,
} from '../../shared/shared-constants';
import { User } from '../entities/user.entity';
import { Environment } from '../environment/environment';
import { AppError, AppErrorWithMessage } from '../models/app-error';
import { GetUserResponse, UserDto } from '../models/dto/user-dto';
import {
    BackToOriginalRequest,
    LogAsRequest,
    LoginResponse,
    LoginViewModel,
    RegisterRequest,
    SocialLoginRequest,
} from '../models/requests/auth-requests';
import { GenericResponse } from '../models/responses/generic-response';
import { ActivityLogsService } from '../modules/activity-logs/activity-logs.service';
import { MailContent } from '../shared/mail-content';
import {
    AuthCustomRules,
    userFieldsForLogin,
    UserRelationsForLogin,
} from './auth-custom-rules';
import { AuthToolsService } from './auth-tools.service';
import { ApplicationBaseService } from './base-service';
import { CookieHelpers } from './tools/cookie-helpers';
import { ApiMainHelpers } from './tools/helpers.service';
import { MailService } from './tools/mail.service';
import { UsersService } from './users.service';

@Injectable()
export class AuthService extends ApplicationBaseService {
    constructor(
        public usersService: UsersService,
        public readonly jwtService: JwtService,
        private readonly activityLogsService: ActivityLogsService,
        private mailService: MailService,
    ) {
        super();
    }

    async login(
        loginViewModel: LoginViewModel,
        loginToken: string,
    ): Promise<LoginResponse> {
        const response = new LoginResponse();
        try {
            if (!loginViewModel && !loginToken) {
                throw AppError.getBadRequestError();
            }
            if (
                loginViewModel &&
                (!loginViewModel.password || !loginViewModel.userName)
            ) {
                throw AppError.getBadRequestError();
            }
            let findUserResponse: GetUserResponse;
            if (loginViewModel) {
                //connexion avec login / mdp
                const findUserWhere = [];
                for (const userField of userFieldsForLogin) {
                    const data = {};
                    data[userField] = loginViewModel.userName;
                    findUserWhere.push(data);
                }
                findUserResponse = await this.usersService.findOne(
                    {
                        where: findUserWhere,
                        relations: UserRelationsForLogin,
                    },
                    true,
                );
            } else {
                //connexion par token dans l'url
                findUserResponse = await this.usersService.findOne(
                    {
                        where: { loginToken: loginToken },
                        relations: UserRelationsForLogin,
                    },
                    true,
                );
            }

            if (!findUserResponse.success)
                throw new AppError(findUserResponse.error);
            if (!findUserResponse.user)
                throw new AppErrorWithMessage(
                    'Utilisateur ou mot de passe incorrect !',
                    403,
                );
            if (findUserResponse.user.disabled)
                throw new AppErrorWithMessage(
                    'Utilisateur désactivé. Impossible de se connecter',
                    403,
                );
            if (loginViewModel) {
                //connexion avec login / mdp
                if (!findUserResponse.user.password)
                    throw new AppErrorWithMessage(
                        'Il semble que vous vous êtes déjà connecté via une connexion sans mot de passe. Veuillez utiliser cette méthode de connexion.',
                        403,
                    );
                if (
                    !(await ApiMainHelpers.comparePasswords(
                        loginViewModel.password,
                        findUserResponse.user.password,
                    ))
                )
                    throw new AppErrorWithMessage(
                        'Utilisateur ou mot de passe incorrect !',
                        403,
                    );
            }
            response.token = AuthToolsService.createUserToken(
                this.jwtService,
                findUserResponse.user,
            );
            response.refreshToken =
                await this.createAndSaveRefreshTokenIfNeeded(
                    findUserResponse.user,
                );
            await this.activityLogsService.addActivityLog(
                findUserResponse.user.id,
                ActivityLogCode.Login,
            );
            response.success = true;
        } catch (err) {
            response.handleError(err, true);
        }
        return response;
    }

    private async createAndSaveRefreshTokenIfNeeded(user: UserDto) {
        if (!!user.refreshToken) return user.refreshToken;
        user.refreshToken = MainHelpers.generateGuid();
        delete user.password;
        delete user.roles; //prevent to save user roles
        const updateUserResponse = await this.usersService.createOrUpdate(user);
        if (!updateUserResponse.success)
            throw new AppError(updateUserResponse.error);
        return user.refreshToken;
    }

    async refreshToken(request: FastifyRequest): Promise<LoginResponse> {
        const response = new LoginResponse();
        try {
            let findUserResponse: GetUserResponse;
            const refreshTokenFromCookie = CookieHelpers.getCookie(
                request,
                refreshTokenLsKey,
            );
            if (refreshTokenFromCookie) {
                findUserResponse = await this.usersService.findOne({
                    where: { refreshToken: refreshTokenFromCookie },
                });
            } else {
                throw new AppError('Invalid request');
            }

            if (!findUserResponse.success) {
                throw new AppError(findUserResponse.error);
            }

            if (!findUserResponse.user) {
                throw new AppErrorWithMessage(
                    'Utilisateur ou mot de passe incorrect !',
                    403,
                );
            }

            if (findUserResponse.user.disabled) {
                throw new AppErrorWithMessage(
                    'Utilisateur désactivé. Impossible de se connecter',
                    403,
                );
            }

            AuthCustomRules(findUserResponse.user);

            await this.activityLogsService.addActivityLog(
                findUserResponse.user.id,
                ActivityLogCode.RefreshToken,
            );

            response.token = AuthToolsService.createUserToken(
                this.jwtService,
                findUserResponse.user,
            );
            response.success = true;
        } catch (err) {
            response.handleError(err, true);
        }
        return response;
    }

    async register(request: RegisterRequest): Promise<GenericResponse> {
        let response: GenericResponse = new GenericResponse();
        try {
            if (!request.mail || !request.password) {
                throw new AppErrorWithMessage(
                    'Impossible de créer un compte sans adresse e-mail ou sans mot de passe.',
                );
            }

            const userResponse = await this.usersService.findOne({
                where: {
                    mail: request.mail,
                },
            });

            if (!userResponse.success) {
                throw new AppError(userResponse.error);
            }

            if (userResponse.user) {
                throw new AppErrorWithMessage(
                    'Un compte mail existe déjà avec cette adresse e-mail !',
                );
            }

            const user = new UserDto();
            user.mail = request.mail;
            user.firstName = request.firstName;
            user.lastName = request.lastName;
            user.password = request.password;
            user.userName = request.mail;
            delete user.roles;
            response = await this.usersService.createOrUpdate(user, true);
        } catch (err) {
            response.handleError(err, true);
        }
        return response;
    }

    async loginWithSocialProvider(
        request: SocialLoginRequest,
    ): Promise<GenericResponse> {
        let response: GenericResponse = new GenericResponse();
        try {
            if (!request.googleUserId && !request.facebookUserId) {
                throw new AppError(
                    'Unable to connect with Google / Facebook without user id',
                );
            }

            let userResponse: GetUserResponse;
            let user: UserDto;
            if (request.mail) {
                userResponse = await this.usersService.findOne({
                    where: [
                        {
                            googleUserId: null,
                            facebookUserId: null,
                            mail: request.mail,
                        },
                        {
                            googleUserId: '',
                            facebookUserId: '',
                            mail: request.mail,
                        },
                    ],
                });
                if (!userResponse.success) {
                    throw new AppError(userResponse.error);
                }

                if (userResponse.user) {
                    //bind user account with social account
                    user = userResponse.user;
                    user.googleUserId = request.googleUserId;
                    user.facebookUserId = request.facebookUserId;
                    delete user.roles;
                    response = await this.usersService.createOrUpdate(
                        user,
                        true,
                    );
                    response.success = true;
                    return response;
                }
            }

            userResponse = await this.usersService.findOne({
                where: [
                    {
                        googleUserId: request.googleUserId
                            ? request.googleUserId
                            : undefined,
                    },
                    {
                        facebookUserId: request.facebookUserId
                            ? request.facebookUserId
                            : undefined,
                    },
                ],
            });

            if (!userResponse.success) {
                throw new AppError(userResponse.error);
            }

            if (userResponse.user) {
                //sign user
                user = userResponse.user;
                response.token = AuthToolsService.createUserToken(
                    this.jwtService,
                    user,
                );
                response.success = true;
            } else {
                //create user
                user = new UserDto();
                user.firstName = request.firstName;
                user.lastName = request.lastName;
                user.googleUserId = request.googleUserId;
                user.facebookUserId = request.facebookUserId;
                user.mail = request.mail;
                if (request.mail) user.userName = request.mail;
                else if (request.facebookUserId)
                    user.userName = request.facebookUserId;
                else if (request.googleUserId)
                    user.userName = request.googleUserId;
                delete user.roles;
                response = await this.usersService.createOrUpdate(user, true);
            }
        } catch (err) {
            response.handleError(err);
        }
        return response;
    }

    public async logAs(request: LogAsRequest) {
        const response: GenericResponse = new GenericResponse();
        try {
            const getUserResponse = await this.usersService.findOne({
                where: { id: request.userId },
                relations: UserRelationsForLogin,
            });

            if (!getUserResponse.success) {
                throw new AppError(getUserResponse.error);
            }

            if (!getUserResponse.user) {
                throw new AppError('User not found !');
            }

            response.token = AuthToolsService.createUserToken(
                this.jwtService,
                getUserResponse.user,
            );
            response.success = true;
        } catch (err) {
            response.handleError(err);
        }
        return response;
    }

    public async backToOriginalRequester(request: BackToOriginalRequest) {
        let response: GenericResponse = new GenericResponse();
        try {
            const decodeResponse = AuthToolsService.decodeToken(
                this.jwtService,
                request.requesterToken,
                false,
            );

            if (
                decodeResponse.payload &&
                decodeResponse.payload.roles.some((x) => x === RolesList.Admin)
            ) {
                response = await this.logAs({
                    userId: decodeResponse.payload.id,
                });
            } else {
                throw new AppError('Incorrect requester token !');
            }
        } catch (err) {
            response.handleError(err);
        }
        return response;
    }

    public async generateRecoverPasswordToken(
        user: UserDto,
        mustGenerateToken: boolean = false,
        expirationInDays: number = 1,
    ) {
        user.recoverToken = MainHelpers.generateGuid();
        user.recoverTokenExpirationDate = DateHelpers.addDaysToDate(
            new Date(),
            expirationInDays,
        );
        delete user.roles;
        return await this.usersService.createOrUpdate(
            user,
            mustGenerateToken,
            null,
        );
    }
    public async sendRecoverPasswordMail(mail: string) {
        let response = new GenericResponse();
        try {
            const findOneOptions: FindOneOptions<User> = {
                where: { mail },
                relations: ['language'],
            };
            let userReponse = await this.usersService.findOne(findOneOptions);

            if (!userReponse.success) {
                throw new AppError(userReponse.message);
            }

            if (!userReponse.user) {
                throw new AppErrorWithMessage(
                    "Aucun utilisateur n'a été trouvé avec cette adresse e-mail.",
                );
            }

            delete userReponse.user.roles;
            const userLanguageCode = userReponse.user?.language?.code;
            userReponse = await this.generateRecoverPasswordToken(
                userReponse.user,
            );

            if (userReponse.success && userReponse.user) {
                let recoverPasswordLink =
                    Environment.BaseURL +
                    '/' +
                    RoutesList.RecoverPassword +
                    '/' +
                    userReponse.user.recoverToken;
                if (userLanguageCode)
                    recoverPasswordLink += '?lang=' + userLanguageCode;
                const mailContentWrapper = MailContent.getMailContentAndSubject(
                    'NewAccountPassword',
                    true,
                    userLanguageCode as any,
                    null,
                    [recoverPasswordLink],
                );
                const mailSender =
                    await SharedCandidatesHelpers.getMailSenderFromCandidate(
                        null,
                        userReponse.user,
                        null,
                        undefined, // No consultant email available in password recovery
                    );
                response = await this.mailService.sendMail({
                    from: { address: mailSender },
                    to: [{ address: mail }],
                    htmlBody: mailContentWrapper.content,
                    subject: mailContentWrapper.subject,
                    templateName: 'mail_auto',
                });
            } else {
                throw new AppErrorWithMessage(
                    "Pas d'utilisateur avec cet email",
                );
            }
        } catch (err) {
            response.handleError(err);
        }
        return response;
    }

    public async changeUserPasswordFromRecoverToken(
        recoverToken: string,
        userPassword: string,
    ) {
        let response = new GenericResponse();

        try {
            const findOneOptions: FindOneOptions<User> = {
                where: { recoverToken: recoverToken },
            };
            const userResponse = await this.usersService.findOne(
                findOneOptions,
            );

            if (!userResponse.success) {
                throw new AppError(userResponse.message);
            }

            if (!userResponse.user) {
                throw new AppErrorWithMessage(
                    "Impossible de trouver l'utilisateur !",
                );
            }
            if (
                !userResponse.user.recoverTokenExpirationDate ||
                userResponse.user.recoverTokenExpirationDate.getTime() <
                    new Date().getTime()
            ) {
                throw new AppErrorWithMessage('Lien expiré.');
            }

            userResponse.user.recoverToken = null;
            userResponse.user.recoverTokenExpirationDate = null;
            userResponse.user.password = userPassword;
            delete userResponse.user.roles;
            response = await this.usersService.createOrUpdate(
                userResponse.user,
            );
        } catch (err) {
            response.handleError(err);
        }
        return response;
    }

    async getUpdatedAccessToken(
        authToolsService: AuthToolsService,
    ): Promise<GenericResponse> {
        const response = new GenericResponse();

        try {
            const payload = authToolsService?.getCurrentPayload(false);
            const userResponse = await this.usersService.findOne({
                where: { id: payload.id },
            });

            if (!userResponse.success) {
                throw new AppError(userResponse.message);
            }

            if (!userResponse.user) {
                throw new AppErrorWithMessage(
                    "Impossible de trouver l'utilisateur !",
                );
            }

            response.token = AuthToolsService.createUserToken(
                this.jwtService,
                userResponse.user,
            );
            response.success = true;
        } catch (err) {
            response.handleError(err);
        }
        return response;
    }

    loginWithToken() {}
}
