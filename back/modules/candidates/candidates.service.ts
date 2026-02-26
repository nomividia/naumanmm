/* eslint-disable max-len */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from 'linqts';
import { DateHelpers, MainHelpers } from 'nextalys-js-helpers';
import { ExcelHelpers } from 'nextalys-js-helpers/dist/excel';
import { FileHelpers, NxsEmailAttachment } from 'nextalys-node-helpers';
import { ExcelHelpersExcelJs } from 'nextalys-node-helpers/dist/helpers/excel-helpers/impl/excel-helpers-exceljs';
import * as path from 'path';
import {
    FindConditions,
    FindManyOptions,
    getManager,
    In,
    IsNull,
    Like,
    Not,
    Raw,
    Repository,
} from 'typeorm';
import { SharedCandidatesHelpers } from '../../../shared/candidates-helpers';
import { JwtPayload } from '../../../shared/jwt-payload';
import { RoutesList } from '../../../shared/routes';
import {
    AppTypes,
    CandidateApplicationFileType,
    CandidateFileType,
    CandidateStatus,
    defaultAppLanguage,
    RolesList,
} from '../../../shared/shared-constants';
import { SharedService } from '../../../shared/shared-service';
import { Address } from '../../entities/address.entity';
import { NoteItemFile } from '../../entities/note-item-file.entity';
import { NoteItem } from '../../entities/note-item.entity';
import { Environment } from '../../environment/environment';
import { AppErrorWithMessage } from '../../models/app-error';
import { AppFileDto } from '../../models/dto/app-file-dto';
import { AppValueDto } from '../../models/dto/app-value-dto';
import { NoteItemFileDto } from '../../models/dto/note-item-file.dto';
import { GetUserResponse, UserDto } from '../../models/dto/user-dto';
import { GenericResponse } from '../../models/responses/generic-response';
import { AuthService } from '../../services/auth.service';
import {
    ApplicationBaseModelService,
    LinqMultipleQueryWrapper,
} from '../../services/base-model.service';
import { ReferentialService } from '../../services/referential.service';
import { FileService } from '../../services/tools/file.service';
import { ApiMainHelpers } from '../../services/tools/helpers.service';
import { MailService } from '../../services/tools/mail.service';
import { TranslationService } from '../../services/translation.service';
import { UsersService } from '../../services/users.service';
import { MailContent } from '../../shared/mail-content';
import { NxsList } from '../../test/test-types';
import { CandidateResumeService } from '../candidate-resume/candidate-resume.service';
import { CandidateApplicationDto } from '../candidates-application/candidate-application-dto';
import { GCloudStorageService } from '../gdrive/gcloud-storage-service';
import { HistoriesService } from '../history/histories.service';
import { HistoryDto } from '../history/history.dto';
import { History } from '../history/history.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { CandidateChildren } from './candidate-children/candidate-children.entity';
import { CandidateContract } from './candidate-contract.entity';
import { CandidateCountry } from './candidate-country/candidate-country.entity';
import { CandidateCurrentJob } from './candidate-current-jobs/candidate-current-jobs.entity';
import { CandidateDepartment } from './candidate-department/candidate-department.entity';
import {
    CandidateDto,
    GetCandidateApplicationsLength,
    GetCandidateImageResponse,
    GetCandidateLanguageResponse,
    GetCandidateRequest,
    GetCandidateResponse,
    GetCandidatesRequest,
    GetCandidatesResponse,
    SendCandidateByEmailRequest,
    UpdateCandidateJobStatusDto,
    UploadCandidateFilesToGdriveResponse,
} from './candidate-dto';
import { CandidateFileDto } from './candidate-file-dto';
import { CandidateFile } from './candidate-file.entity';
import { CandidateJobOfferAction } from './candidate-job-offer-history/candidate-job-offer-history.entity';
import { CandidateJobOfferHistoryService } from './candidate-job-offer-history/candidate-job-offer-history.service';
import { CandidateJob } from './candidate-jobs.entity';
import { CandidateLanguage } from './candidate-language/candidate-language.entity';
import { CandidateLicence } from './candidate-licences/candidate-licences.entity';
import { CandidatePet } from './candidate-pets/candidate-pet.entity';
import { CandidateReadonlyProperty } from './candidate-readonly/candidate-readonly-property.entity';
import { Candidate } from './candidate.entity';

export interface PercentageAndFieldMissedWrapper {
    percentage: number;
    fieldsMissed: string[];
}

const fieldFrenchLabel = {
    firstName: 'Prénom',
    lastName: 'Nom de famille',
    gender: 'Sexe',
    birthDate: 'Date de naissance',
    relationshipStatus: 'Situation familiale',
    nationality: 'Nationalité',
    animal: 'Animaux',
    phone: 'Numéro de téléphone',
    email: 'Adressse email',
    addresses: 'Adresses',
    isJobHoused: 'Logement',
    candidateContracts: 'Type de contrat',
    skills: 'Compétences',
};

@Injectable()
export class CandidateService extends ApplicationBaseModelService<
    Candidate,
    CandidateDto,
    GetCandidateResponse,
    GetCandidatesResponse
> {
    constructor(
        @InjectRepository(Candidate)
        public readonly repository: Repository<Candidate>,
        @InjectRepository(NoteItem)
        public readonly noteItemRepository: Repository<NoteItem>,
        @InjectRepository(NoteItemFile)
        public readonly noteItemFileRepository: Repository<NoteItemFile>,
        @InjectRepository(CandidateJob)
        public readonly candidateJobRepository: Repository<CandidateJob>,
        @InjectRepository(CandidateLanguage)
        public readonly candidateLanguageRepository: Repository<CandidateLanguage>,
        @InjectRepository(CandidateChildren)
        public readonly candidateChildrenRepository: Repository<CandidateChildren>,
        @InjectRepository(CandidateLicence)
        public readonly candidateLicenceRepository: Repository<CandidateLicence>,
        @InjectRepository(CandidateFile)
        public readonly candidateFileRepository: Repository<CandidateFile>,
        @InjectRepository(CandidateReadonlyProperty)
        public readonly candidateReadonlyPropertyRepository: Repository<CandidateReadonlyProperty>,
        @InjectRepository(CandidatePet)
        public readonly candidatePetRepository: Repository<CandidatePet>,
        private referentialService: ReferentialService,
        private fileService: FileService,
        private gCloudStorageService: GCloudStorageService,
        @Inject(forwardRef(() => UsersService))
        private userService: UsersService,
        private mailService: MailService,
        @Inject(forwardRef(() => AuthService))
        private authService: AuthService,
        private notificationsService: NotificationsService,
        @InjectRepository(CandidateCountry)
        public readonly candidateCountryRepository: Repository<CandidateCountry>,
        @InjectRepository(CandidateDepartment)
        public readonly candidateDepartmentRepository: Repository<CandidateDepartment>,
        @InjectRepository(CandidateContract)
        public readonly candidateContractsRepository: Repository<CandidateContract>,
        private readonly candidateResumeService: CandidateResumeService,
        private readonly historiesService: HistoriesService,
        @InjectRepository(History)
        private readonly historyRepository: Repository<History>,
        @InjectRepository(CandidateCurrentJob)
        public readonly candidateCurrentJobRepository: Repository<CandidateCurrentJob>,
        private readonly candidateJobOfferHistoryService: CandidateJobOfferHistoryService,
    ) {
        super();

        this.modelOptions = {
            getManyResponse: GetCandidatesResponse,
            getOneResponse: GetCandidateResponse,
            getManyResponseField: 'candidates',
            getOneResponseField: 'candidate',
            getManyRelations: [
                'candidateStatus',
                'candidateStatus.translations',
                // 'files', 'files.fileType',
                // 'files.file',
                // 'candidateJobs', 'candidateJobs.job',
                'gender',
                //   'candidateResume',
                //   'candidateResume.file',
            ],
            getOneRelations: [
                // 'files',
                // 'files.fileType',
                // 'files.file',

                // 'candidateLicences',
                // 'candidateLicences.licence',

                'relationshipStatus',
                'relationshipStatus.translations',

                'gender',
                'gender.translations',

                // 'addresses',

                'candidateStatus',
                'candidateStatus.translations',

                'contractType',

                //   'noteItems', 'noteItems.consultant',

                // 'candidateJobs',
                // 'candidateJobs.job',

                // 'candidateLanguages',
                // 'candidateLanguages.levelLanguage',
                // 'candidateLanguages.levelLanguage.translations',

                // 'candidateChildrens',

                'partnerGender',

                // 'candidateResume', 'candidateResume.file',

                'candidateReadonlyProperties',

                // 'consultant',
                // 'consultant.image',

                // 'candidatePets',

                // 'candidateJobs.jobReference',
                //  'candidateJobs.jobReference.addresses',
                // 'candidateJobs.jobReference.jobRefFunction',

                // 'candidateContracts',
                // 'candidateContracts.contractType',
                // 'candidateContracts.contractType.translations',

                // 'candidateCountries',

                // 'candidateCurrentJobs',
                // 'candidateCurrentJobs.currentJob', 'candidateCurrentJobs.currentJob.translations',
                // 'candidateCurrentJobs.currentJob.appType',
            ],
            repository: this.repository,
            entity: Candidate,
            archiveField: 'disabled',
            archiveFieldValue: true,
        };

        if (!this.authService.usersService && this.userService) {
            this.authService.usersService = this.userService;
        }
    }

    public async revertExpiredInProcessStatuses(): Promise<GenericResponse> {
        const response = new GenericResponse();

        try {
            const statusType = await this.referentialService.getTypeValues({
                appTypeCode: AppTypes.CandidateStatusCode,
                includeTranslations: 'false',
            });

            const statusValues = statusType?.appType?.appValues || [];
            const codeToId = new Map<string, string>();
            for (const v of statusValues) {
                if (v?.code && v?.id) codeToId.set(v.code, v.id);
            }

            const inProcessId = codeToId.get(CandidateStatus.InProcess);
            if (!inProcessId) {
                response.success = true;
                return response;
            }

            const inProcessCandidates = await this.repository.find({
                select: ['id', 'candidateStatusId'],
                where: { candidateStatusId: inProcessId },
            });

            if (!inProcessCandidates?.length) {
                response.success = true;
                return response;
            }

            const now = new Date();
            let revertedCount = 0;

            for (const c of inProcessCandidates) {
                const lastHistory = await this.historyRepository.findOne({
                    where: {
                        entity: 'candidate',
                        entityId: c.id,
                        field: 'candidateStatus',
                    },
                    order: { date: 'DESC' },
                });

                if (!lastHistory) {
                    continue;
                }

                if (lastHistory.valueAfter !== CandidateStatus.InProcess) {
                    continue;
                }

                const daysSince = DateHelpers.daysDiff(lastHistory.date, now);
                if (daysSince < 14) {
                    continue;
                }

                let revertCode = lastHistory.valueBefore;
                if (!revertCode || revertCode === CandidateStatus.InProcess) {
                    revertCode = CandidateStatus.ToBeReferenced;
                }

                const revertId = codeToId.get(revertCode);
                const fallbackId = codeToId.get(CandidateStatus.ToBeReferenced);

                if (!revertId && !fallbackId) {
                    continue;
                }

                c.candidateStatusId = revertId || fallbackId;
                await this.repository.save(c);

                const history: HistoryDto = {
                    date: DateHelpers.convertUTCDateToLocalDate(new Date()),
                    entity: 'candidate',
                    entityId: c.id,
                    field: 'candidateStatus',
                    valueBefore: CandidateStatus.InProcess,
                    valueAfter: revertCode,
                    userId: null,
                } as any;

                await this.historiesService.createOrUpdate(history);
                revertedCount++;
            }

            response.success = true;
            (response as any).revertedCount = revertedCount;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    async uploadCandidateFilesToGdrive(
        dto: CandidateApplicationDto | CandidateDto,
        file: string,
        fileDto: AppFileDto,
        fileTypeId: string,
        dtoField: CandidateApplicationFileType,
        type: 'candidate-applications' | 'candidates',
        upload: boolean,
    ) {
        let gdriveUploadResponse: UploadCandidateFilesToGdriveResponse =
            new UploadCandidateFilesToGdriveResponse();

        try {
            const targetFile = type + '/' + dto.id + '/' + fileDto.physicalName;

            if (true) {
                if (upload) {
                    gdriveUploadResponse =
                        await this.gCloudStorageService.uploadFile(
                            file,
                            null,
                            targetFile,
                        );
                } else {
                    gdriveUploadResponse =
                        await this.gCloudStorageService.copyFile(
                            fileDto.externalFilePath,
                            targetFile,
                        );
                }
            }

            if (gdriveUploadResponse.success) {
                if (upload) {
                    fileDto.externalFilePath = gdriveUploadResponse.file.name;
                }

                if (type === 'candidate-applications') {
                    dto[dtoField] = fileDto;
                    gdriveUploadResponse.newCandidateApplicationFileDto =
                        fileDto;
                } else if (type === 'candidates') {
                    const candidateDto = dto as CandidateDto;

                    if (!candidateDto.files) {
                        candidateDto.files = [];
                    }

                    // Find existing file by fileTypeId to replace it, not by reference
                    let candidateFileToUpdate: CandidateFileDto =
                        candidateDto.files?.find((x) => x.file === fileDto);

                    if (!candidateFileToUpdate) {
                        candidateFileToUpdate = {
                            candidateId: candidateDto.id,
                            fileTypeId: fileTypeId,
                        };
                        candidateDto.files.push(candidateFileToUpdate);
                    }

                    candidateFileToUpdate.file = {
                        mimeType: fileDto.mimeType,
                        name: fileDto.name,
                        externalFilePath: gdriveUploadResponse.file.name,
                        physicalName: fileDto.physicalName,
                        size: fileDto.size,
                    };
                    gdriveUploadResponse.newCandidateFileDto =
                        candidateFileToUpdate;
                }
            }
        } catch (err) {
            gdriveUploadResponse.handleError(err);
        }

        return gdriveUploadResponse;
    }

    public async createUserFromCandidate(
        candidate: CandidateDto,
        payload: JwtPayload,
        sendMail: boolean,
        mailCanBeNull: boolean,
    ): Promise<GetUserResponse> {
        let userResponse = new GetUserResponse();

        try {
            if (!candidate) {
                throw new AppErrorWithMessage(
                    'Impossible de trouver le candidat !',
                );
            }

            const existingUserForCandidate =
                await this.userService.usersRepository.findOne({
                    where: { candidateId: candidate.id },
                });

            if (existingUserForCandidate) {
                if (sendMail && candidate.email) {
                    userResponse = await this.sendEmailAccessToCandidate(
                        existingUserForCandidate.toDto(),
                        candidate,
                    );
                } else {
                    userResponse.success = true;
                    userResponse.user = existingUserForCandidate.toDto();
                }
                return userResponse;
            }

            const getCandidateOrUserMainLanguageResponse =
                await SharedCandidatesHelpers.getCandidateOrUserMainLanguage(
                    candidate,
                    null,
                    this.referentialService,
                );
            const candidateLanguage =
                getCandidateOrUserMainLanguageResponse.language;
            const userDto: UserDto = {
                firstName: candidate.firstName,
                lastName: candidate.lastName,
                languageId: candidateLanguage?.id,
                mail: candidate.email,
                phone: candidate.phone,
                roles: [
                    {
                        enabled: true,
                        role: RolesList.Candidate,
                        label: RolesList.Candidate,
                    },
                ],
                userName: null,
                password: null,
                disabled: false,
                candidateId: candidate.id,
                genderId: candidate.genderId,
                imageId: candidate?.files?.find(
                    (x) => x.fileType?.code === CandidateFileType.MainPhoto,
                )?.fileId,
            };

            if (!candidate.email && !mailCanBeNull) {
                throw new AppErrorWithMessage(
                    'The user must have a valid e-mail address !',
                );
            }

            if (candidate.email) {
                const userRes = await this.userService.usersRepository.findOne({
                    where: { mail: candidate.email },
                    select: ['id'],
                });

                if (userRes) {
                    throw new AppErrorWithMessage(
                        'User with email already exist',
                    );
                }
            }

            userResponse = await this.userService.createOrUpdate(
                userDto,
                false,
                payload,
            );

            if (userResponse.success && candidate.email && sendMail) {
                userResponse = await this.sendEmailAccessToCandidate(
                    userResponse.user,
                    candidate,
                );
            }
        } catch (err) {
            userResponse.handleError(err);
        }

        return userResponse;
    }

    async sendEmailAccessToCandidate(
        userDto: UserDto,
        candidateDto: CandidateDto,
        mailType:
            | 'NewAccountAfterJobAdderMigration'
            | 'NewCandidateAccount' = 'NewCandidateAccount',
        consultantEmail?: string,
    ): Promise<GetUserResponse> {
        let response = new GetUserResponse();

        try {
            if (!userDto) {
                throw new AppErrorWithMessage('User not found');
            }

            delete userDto.roles;

            response = await this.authService.generateRecoverPasswordToken(
                userDto,
                false,
                100,
            ); //create new token for set paassword

            if (!response.success) {
                throw new AppErrorWithMessage(response.message);
            }

            const getCandidateOrUserMainLanguageResponse =
                await SharedCandidatesHelpers.getCandidateOrUserMainLanguage(
                    candidateDto,
                    userDto,
                    this.referentialService,
                );
            const candidateLanguage =
                getCandidateOrUserMainLanguageResponse.language;
            const mailSender =
                await SharedCandidatesHelpers.getMailSenderFromCandidate(
                    candidateDto,
                    userDto,
                    this.referentialService,
                    consultantEmail,
                );
            let recoverPasswordLink =
                Environment.BaseURL +
                '/' +
                RoutesList.RecoverPassword +
                '/' +
                userDto.recoverToken +
                '?passwordcreation=1';

            if (candidateLanguage?.code) {
                recoverPasswordLink += '?lang=' + candidateLanguage?.code;
            }

            const mailContentWrapper = MailContent.getMailContentAndSubject(
                mailType,
                true,
                candidateLanguage?.code as any,
                null,
                [recoverPasswordLink],
            );

            console.log('emailsend', {
                subject: mailContentWrapper.subject,
                from: { address: mailSender },
                to: [{ address: userDto.mail, name: userDto.firstName }],
                htmlBody: mailContentWrapper.content,
                templateName: 'mail_auto',
            });

            const sendMail = await this.mailService.sendMail({
                subject: mailContentWrapper.subject,
                from: { address: mailSender },
                to: [{ address: userDto.mail, name: userDto.firstName }],
                htmlBody: mailContentWrapper.content,
                templateName: 'mail_auto',
            });

            if (!sendMail.success) {
                throw new AppErrorWithMessage(
                    "Une erreur s'est produite lors de l'envoi du mail",
                );
            }

            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    private pushRelationsListFromRequest(
        relations: string[],
        request: GetCandidateRequest,
    ) {
        if (!request) {
            return relations;
        }

        if (request.includeFiles === 'true') {
            // relations.push(...['files', 'files.fileType', 'files.file']);
        }

        if (request.includeLicences === 'true') {
            relations.push(
                ...['candidateLicences', 'candidateLicences.licence'],
            );
        }

        if (request.includeAddresses === 'true') {
            relations.push('addresses');
        }

        if (request.includeNoteItems === 'true') {
            relations.push(
                ...[
                    'noteItems',
                    'noteItems.consultant',
                    'noteItems.files',
                    'noteItems.files.file',
                ],
            );
        }

        // candidateJobs is now loaded separately in setCandidateFieldsDelayedQueries
        // to avoid cartesian product explosion when candidates have many jobs
        if (request.includeCandidateJobs === 'true') {
            // Loaded separately for performance
        }

        if (request.includeLanguages === 'true') {
            relations.push(
                ...[
                    'candidateLanguages',
                    'candidateLanguages.levelLanguage',
                    'candidateLanguages.levelLanguage.translations',
                ],
            );
        }

        if (request.includeChildren === 'true') {
            relations.push('candidateChildrens');
        }

        // if (request.includeResume === 'true') {
        //     relations.push(...['candidateResume', 'candidateResume.file']);
        // }

        if (request.includeConsultant === 'true') {
            relations.push(...['consultant', 'consultant.image']);
        }

        if (request.includePets === 'true') {
            relations.push('candidatePets');
        }

        if (request.includeContracts === 'true') {
            relations.push(
                ...[
                    'candidateContracts',
                    'candidateContracts.contractType',
                    'candidateContracts.contractType.translations',
                ],
            );
        }

        if (request.includeCountries === 'true') {
            // relations.push('candidateCountries');
        }

        if (request.includeCurrentJobs === 'true') {
            relations.push(
                ...[
                    'candidateCurrentJobs',
                    'candidateCurrentJobs.currentJob',
                    'candidateCurrentJobs.currentJob.translations',
                    'candidateCurrentJobs.currentJob.appType',
                ],
            );
        }
        relations = new List(relations).Distinct().ToArray();

        return relations;
    }

    public async findOneWithRequest(request: GetCandidateRequest, id: string) {
        let response = new GetCandidateResponse();

        try {
            let relations = ['gender'];

            if (request?.specificRelations) {
                relations = request?.specificRelations.split(',');
            }

            relations = this.pushRelationsListFromRequest(relations, request);

            response = await this.findOne({ where: { id }, relations });

            if (response.success && response.candidate?.id) {
                await this.setCandidateFieldsDelayedQueries(
                    null,
                    response.candidate,
                    request,
                );

                if (response.candidate?.files?.length) {
                    for (const file of response.candidate.files) {
                        if (!!file?.file && !file.file.name) {
                            file.file.name =
                                SharedCandidatesHelpers.generateCandidateFileName(
                                    file,
                                    response.candidate,
                                    true,
                                );
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

    private async setCandidateFieldsDelayedQueries(
        candidate: Candidate,
        candidateDto: CandidateDto,
        getRequest: GetCandidateRequest,
    ) {
        const candidateId = candidate?.id || candidateDto?.id;

        if (!candidateId) {
            return;
        }

        if (getRequest?.includeFiles === 'true') {
            // relations.push(...['files', 'files.fileType', 'files.file']);
            const candidateFiles = await this.candidateFileRepository.find({
                where: { candidateId: candidateId },
                relations: ['file', 'fileType'],
            });

            if (candidate) {
                candidate.files = candidateFiles;
            }

            if (candidateDto) {
                candidateDto.files = candidateFiles?.map((x) => x.toDto());
            }
        }

        if (getRequest?.includeCountries === 'true') {
            const candidateCountries =
                await this.candidateCountryRepository.find({
                    where: { candidateId: candidateId },
                });

            if (candidate) {
                candidate.candidateCountries = candidateCountries;
            }

            if (candidateDto) {
                candidateDto.candidateCountries = candidateCountries?.map((x) =>
                    x.toDto(),
                );
            }
        }

        if (getRequest?.includeDepartments === 'true') {
            const candidateDepartments =
                await this.candidateDepartmentRepository.find({
                    where: { candidateId: candidateId },
                });

            if (candidate) {
                candidate.candidateDepartments = candidateDepartments;
            }

            if (candidateDto) {
                candidateDto.candidateDepartments = candidateDepartments?.map(
                    (x) => x.toDto(),
                );
            }
        }

        // Load candidateJobs separately to avoid cartesian product explosion
        // This is much more efficient than loading via relations when candidates have many jobs
        if (getRequest?.includeCandidateJobs === 'true') {
            const candidateJobs = await this.candidateJobRepository.find({
                where: { candidateId: candidateId },
                relations: [
                    'job',
                    'job.translations',
                    'jobReference',
                    'jobReference.addresses',
                    'jobReference.jobRefFunction',
                ],
            });

            if (candidate) {
                candidate.candidateJobs = candidateJobs;
            }

            if (candidateDto) {
                candidateDto.candidateJobs = candidateJobs?.map((x) =>
                    x.toDto(),
                );
            }
        }
    }

    async createOrUpdate(
        dto: CandidateDto,
        createDefaultMandatoryFiles: boolean,
        getRequest: GetCandidateRequest,
        payload?: JwtPayload,
    ): Promise<GetCandidateResponse> {
        let saveResponse = new GetCandidateResponse();

        try {
            let relations = [
                'candidateContracts',
                'addresses',
                'relationshipStatus',
                'candidateChildrens',
                'gender',
            ];
            relations = this.pushRelationsListFromRequest(
                relations,
                getRequest,
            );
            // console.log("Log ~ file: candidates.service.ts ~ line 420 ~ CandidateService ~ createOrUpdate ~ relations", relations);

            let candidateEntity: Candidate = new Candidate();
            // let externalFilePathListToRemove: string[] = [];
            let appFilesToRemove: AppFileDto[] = [];
            let percentageBeforeSave: PercentageAndFieldMissedWrapper;
            let isNewCandidate = false;
            const includeFiles = getRequest?.includeFiles === 'true';

            if (!includeFiles) {
                delete dto.files;
            }

            if (dto.id) {
                if (includeFiles) {
                    candidateEntity = await this.repository.findOne({
                        where: { id: dto.id },
                        relations: relations,
                    });

                    await this.setCandidateFieldsDelayedQueries(
                        candidateEntity,
                        null,
                        getRequest,
                    );

                    percentageBeforeSave = this.getPercentageOfAdvancement(
                        candidateEntity.toDto(),
                    );

                    const allFilesInDb = new List(candidateEntity.files)
                        .Where((x) => !!x.fileId && !!x.file)
                        .Select((x) => x.fileId)
                        .Distinct()
                        .ToList();

                    if (allFilesInDb.Count() > 0) {
                        const allFilesFromFront = new List(dto.files)
                            .Where((x) => !!x.fileId)
                            .Select((x) => x.fileId)
                            .Distinct()
                            .ToList();
                        const fileIdsToRemove =
                            allFilesInDb.Except(allFilesFromFront);

                        if (fileIdsToRemove.Count() > 0) {
                            appFilesToRemove = new List(candidateEntity.files)
                                .Where(
                                    (x) =>
                                        fileIdsToRemove.Contains(x.fileId) &&
                                        !!x.file?.externalFilePath,
                                )
                                .Select((x) => x.file.toDto())
                                .ToArray();
                        }
                    }
                }
            } else {
                isNewCandidate = true;
                // dto.newsletterUnsubscribedGuid = MainHelpers.generateGuid();
                // New Candidate
                const toBeReferencedStatutId =
                    await this.referentialService.getOneAppValue(
                        CandidateStatus.ToBeReferenced,
                        AppTypes.CandidateStatusCode,
                    );

                if (!toBeReferencedStatutId.success) {
                    throw new AppErrorWithMessage(
                        toBeReferencedStatutId.message,
                    );
                }
                if (!dto.candidateStatusId) {
                    dto.candidateStatusId = toBeReferencedStatutId.appValue?.id;
                }
                if (createDefaultMandatoryFiles) {
                    await this.createMandatoryCandidateFilesForCandidate(
                        dto,
                        true,
                    );
                }
            }

            const getMainPhotoTypeResponse =
                await this.referentialService.getAppValues({
                    where: { code: CandidateFileType.MainPhoto },
                });
            const mainPhotoType = getMainPhotoTypeResponse.appValues.find(
                (x) => x.code === CandidateFileType.MainPhoto,
            );
            let hasNewMainPhoto = false;

            if (
                dto.id &&
                getRequest.includeFiles === 'true' &&
                dto.files?.length
            ) {
                // console.log("Log ~ file: candidates.service.ts ~ line 233 ~ CandidateService ~ createOrUpdate ~ dto.file", dto.files);
                for (const fileWrapper of dto.files) {
                    if (
                        fileWrapper.file &&
                        !fileWrapper.file.physicalName &&
                        !fileWrapper.file.name &&
                        !fileWrapper.file.externalFilePath &&
                        !fileWrapper.file.size
                    ) {
                        fileWrapper.file = null;
                    }

                    if (fileWrapper?.file && !fileWrapper.file.mimeType) {
                        fileWrapper.file.mimeType = 'text/plain';
                    }

                    // console.log("Log ~ file: candidates.service.ts ~ line 261 ~ CandidateService ~ createOrUpdate ~ fileWrapper", fileWrapper);
                    if (
                        !fileWrapper.fileId &&
                        fileWrapper.file?.physicalName &&
                        fileWrapper.fileTypeId
                    ) {
                        // console.log("🚀 ~ CandidateService ~ createOrUpdate ~ fileWrapper", fileWrapper);
                        const tempFilePath = this.fileService.joinPaths(
                            Environment.UploadedFilesTempDirectory,
                            fileWrapper.file?.physicalName,
                        );
                        // console.log("Log ~ file: candidates.service.ts ~ line 240 ~ CandidateService ~ createOrUpdate ~ tempFilePath", tempFilePath);
                        if (!(await FileHelpers.fileExists(tempFilePath))) {
                            continue;
                        }

                        const uploadOnGDriveResponse =
                            await this.uploadCandidateFilesToGdrive(
                                dto,
                                tempFilePath,
                                fileWrapper.file,
                                null,
                                null,
                                'candidates',
                                true,
                            );

                        if (!uploadOnGDriveResponse.success) {
                            throw new AppErrorWithMessage(
                                uploadOnGDriveResponse.message,
                            );
                        }

                        if (fileWrapper.fileTypeId !== mainPhotoType.id) {
                            await FileHelpers.removeFile(tempFilePath);
                        }

                        hasNewMainPhoto =
                            fileWrapper.fileTypeId === mainPhotoType.id;
                    }
                }
            }

            // Handle note item files - upload to GCloud before saving
            if (dto.id && dto.noteItems?.length) {
                for (const noteItem of dto.noteItems) {
                    if (noteItem.files?.length) {
                        for (const noteItemFile of noteItem.files) {
                            // Skip if already uploaded to GCloud or no physicalName
                            if (
                                !noteItemFile.file?.physicalName ||
                                noteItemFile.file?.externalFilePath ||
                                noteItemFile.fileId
                            ) {
                                continue;
                            }

                            const tempFilePath = this.fileService.joinPaths(
                                Environment.UploadedFilesTempDirectory,
                                noteItemFile.file.physicalName,
                            );

                            if (!(await FileHelpers.fileExists(tempFilePath))) {
                                continue;
                            }

                            // Upload to GCloud storage
                            const targetFile = `note-item-files/${dto.id}/${noteItemFile.file.physicalName}`;
                            const uploadResponse =
                                await this.gCloudStorageService.uploadFile(
                                    tempFilePath,
                                    null,
                                    targetFile,
                                );

                            if (!uploadResponse.success) {
                                throw new AppErrorWithMessage(
                                    uploadResponse.message,
                                );
                            }

                            noteItemFile.file.externalFilePath =
                                uploadResponse.file.name;

                            // Remove temp file
                            await FileHelpers.removeFile(tempFilePath);
                        }
                    }
                }
            }

            // console.log("Log ~ file: candidates.service.ts ~ line 475 ~ CandidateService ~ createOrUpdate ~ dto", dto);
            saveResponse = await super.createOrUpdate(dto);
            if (saveResponse.success) {
                if (includeFiles) {
                    // Handle photo file
                    const candidateOldEntity = {
                        id: candidateEntity.id,
                        mainPhoto: candidateEntity.files?.find(
                            (x) => x.fileTypeId === mainPhotoType.id,
                        )?.file,
                        mainPhotoId: candidateEntity.files?.find(
                            (x) => x.fileTypeId === mainPhotoType.id,
                        )?.file?.id,
                    };
                    const dtoTest = {
                        id: dto.id,
                        mainPhoto: dto.files?.find(
                            (x) => x.fileTypeId === mainPhotoType.id,
                        )?.file,
                        mainPhotoId: dto.files?.find(
                            (x) => x.fileTypeId === mainPhotoType.id,
                        )?.file?.id,
                    };

                    this.fileService.handleFileUpload(
                        candidateOldEntity,
                        dtoTest,
                        'mainPhoto',
                        path.join(
                            Environment.CandidatesPublicDirectory,
                            saveResponse.candidate.id,
                        ),
                    );
                }

                // console.log("Log ~ file: candidates.service.ts ~ line 277 ~ CandidateService ~ createOrUpdate ~ saveResponse", saveResponse);
                if (saveResponse.success) {
                    saveResponse.candidate.userAlreadyExist =
                        dto.userAlreadyExist;

                    // TODO : set candidateId non nullable et enlever les removeOrphanChildren

                    for (const repository of [
                        this.candidateLicenceRepository,
                        this.candidateFileRepository,
                        this.noteItemRepository,
                        this.candidateJobRepository,
                        this.candidateChildrenRepository,
                        this.candidateLanguageRepository,
                        this.candidateReadonlyPropertyRepository,
                        this.candidatePetRepository,
                        this.candidateCountryRepository,
                        this.candidateCurrentJobRepository,
                    ]) {
                        await ApiMainHelpers.removeOrphanChildren(
                            repository,
                            'candidateId',
                        );
                    }

                    await ApiMainHelpers.removeOrphanChildren(
                        this.candidateFileRepository,
                        'fileTypeId',
                    );

                    if (saveResponse.candidate) {
                        saveResponse.candidate.candidateAdvancementPercent =
                            this.getPercentageOfAdvancement(
                                saveResponse.candidate,
                            ).percentage;
                        saveResponse.candidate.candidateFieldsMiss =
                            this.getPercentageOfAdvancement(
                                saveResponse.candidate,
                            ).fieldsMissed;
                    }
                }

                if (appFilesToRemove?.length) {
                    if (Environment.EnvName === 'production') {
                        for (const appFileDto of appFilesToRemove.filter(
                            (x) => !!x.externalFilePath,
                        )) {
                            await this.gCloudStorageService.deleteFile(
                                appFileDto.externalFilePath,
                            );
                        }
                    }

                    await this.fileService
                        .getRepository()
                        .delete(appFilesToRemove.map((x) => x.id));
                }

                if (
                    !isNewCandidate &&
                    percentageBeforeSave &&
                    percentageBeforeSave.percentage !==
                        saveResponse.candidate.candidateAdvancementPercent &&
                    saveResponse.candidate.candidateAdvancementPercent >= 100
                ) {
                    let notifReceiverId = saveResponse.candidate.consultantId;

                    if (!notifReceiverId) {
                        //TODO : set admin id
                    }

                    if (notifReceiverId) {
                        //TODO : traduire
                        let languageCode = defaultAppLanguage;
                        //todo : set language depending on receiver language
                        await this.notificationsService.sendNotification(
                            TranslationService.getTranslation(
                                languageCode,
                                'Menu.Candidate',
                            ) +
                                (saveResponse.candidate.firstName || '') +
                                ' ' +
                                (saveResponse.candidate.lastName || '') +
                                TranslationService.getTranslation(
                                    languageCode,
                                    'Global.HasCompletedFile',
                                ),
                            [notifReceiverId],
                            [],
                            false,
                            '/candidats/' + saveResponse.candidate.id,
                        );
                    }
                }

                if (includeFiles) {
                    //clean files
                    const candidateFilesToDelete: CandidateFileDto[] = [];

                    for (const file of dto.files) {
                        if (
                            !file.isMandatory &&
                            (!file.fileId ||
                                (file?.file &&
                                    !file?.file?.externalFilePath &&
                                    !file?.file?.physicalName &&
                                    !file?.file?.externalId))
                        ) {
                            candidateFilesToDelete.push(file);
                        }
                    }

                    if (candidateFilesToDelete.length) {
                        await this.candidateFileRepository.delete(
                            candidateFilesToDelete.map((x) => x.id),
                        );
                    }

                    dto.files = dto.files.filter(
                        (x) =>
                            !candidateFilesToDelete.some((y) => y.id === x.id),
                    );
                    // console.log("Log ~ file: candidates.service.ts:588 ~ CandidateService ~ createOrUpdate ~ candidateFilesToDelete", candidateFilesToDelete);
                }

                //Save history status modification
                if (
                    dto.candidateStatus &&
                    dto.candidateStatus.code !==
                        saveResponse.candidate?.candidateStatus?.code &&
                    !!payload?.id
                ) {
                    const now = new Date();
                    const history: HistoryDto = {
                        date: DateHelpers.convertUTCDateToLocalDate(now),
                        entity: 'candidate',
                        entityId: dto.id,
                        field: 'candidateStatus',
                        valueBefore: dto.candidateStatus.code,
                        valueAfter: saveResponse.candidate.candidateStatus.code,
                        userId: payload.id,
                    };
                    // console.log("🚀 ~ createOrUpdate ~ history", history);
                    const historyResponse =
                        await this.historiesService.createOrUpdate(history);
                }
            }

            if (saveResponse.success) {
                const getCandidateResponse = await this.findOneWithRequest(
                    getRequest,
                    saveResponse.candidate.id,
                );
                saveResponse.candidate = getCandidateResponse.candidate;
            }

            saveResponse.hasNewMainPhoto = hasNewMainPhoto;
        } catch (err) {
            saveResponse.handleError(err);
        }

        return saveResponse;
    }

    private async setCandidateFilters(
        request: GetCandidatesRequest,
        findOptions: FindManyOptions<Candidate>,
    ): Promise<boolean> {
        const candidateFiltersById: string[] = [];
        const candidateFiltersByIdParams: any = {};

        if (request.search) {
            if (!findOptions.where || !(findOptions.where as any[]).length) {
                findOptions.where = [];
            }

            const searchTrimmed = request.search.trim();

            if (searchTrimmed) {
                // Handle search with spaces (compound names like "de oliveira")
                // Search for the full string in lastName using LIKE
                (findOptions.where as any).push({
                    lastName: Like('%' + searchTrimmed + '%'),
                });

                // Search in firstName
                (findOptions.where as any).push({
                    firstName: Like('%' + searchTrimmed + '%'),
                });

                // Search in email
                (findOptions.where as any).push({
                    email: Like('%' + searchTrimmed + '%'),
                });

                // Combined firstName + lastName search is handled in applyOptimizedFilters
                // using CONCAT for database-level searching
            }
        }

        if (!findOptions.where || !(findOptions.where as any[]).length) {
            findOptions.where = [{}];
        }

        if (request.candidateMinYear && request.candidateMaxYear) {
            for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
                whereFilter.birthDate = Raw(
                    (alias) =>
                        `(${alias} <= '${DateHelpers.formatDateISO8601(
                            request.candidateMinYear,
                            false,
                        )}' AND ${alias} >= '${DateHelpers.formatDateISO8601(
                            request.candidateMaxYear,
                        )}' )`,
                );
            }
        }

        if (request.candidateStatut) {
            const statusIds = request.candidateStatut.split(',');

            if (statusIds.length) {
                for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
                    whereFilter.candidateStatusId = In(statusIds);
                }
            }
        }

        //Si aucun statut selectionne : ne pas prendre en compte les not selected
        // else {
        //     const candidateStatus = await this.referentialService.getTypeValues({ appTypeCode: AppTypes.CandidateStatusCode });
        //     const statusFiltered = candidateStatus.appType?.appValues?.filter(x => x.code !== CandidateStatus.NotSelected);
        //     const statusIds = statusFiltered.map(x => x.id);
        //     if (statusIds.length) {
        //         for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
        //             whereFilter.candidateStatusId = In(statusIds);
        //         }
        //     }
        // }

        if (request.jobIds) {
            const jobIds = request.jobIds.split(',');

            if (jobIds.length) {
                candidateFiltersById.push(
                    `([nxsAliasCandidateId] IN (SELECT candidateId FROM \`candidate-current-jobs\` WHERE currentJobId IN ("${jobIds.join(
                        '","',
                    )}")))`,
                );

                // for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {

                //     whereFilter.id = Raw(alias => `(${alias} IN (SELECT candidateId FROM \`candidate-current-jobs\` WHERE currentJobId IN ("${jobIds.join('","')}")))`);
                // }
            }
        }

        if (request.candidateLocation) {
            const locationCode = request.candidateLocation.split(',');

            if (locationCode.length) {
                const addressTableName =
                    getManager().getRepository(Address).metadata.tableName;

                candidateFiltersById.push(
                    `([nxsAliasCandidateId] IN (SELECT candidateId FROM \`${addressTableName}\` WHERE country IN("${locationCode.join(
                        '","',
                    )}") ))`,
                );
                // for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
                //     whereFilter.id = Raw(alias => `(${alias} IN (SELECT candidateId FROM \`${addressTableName}\` WHERE country IN("${locationCode.join('","')}") ))`);
                // }
            }
        }

        if (request.city) {
            const addressTableName =
                getManager().getRepository(Address).metadata.tableName;

            // Handle both string and array inputs for backward compatibility
            let cityArray: string[];
            if (Array.isArray(request.city)) {
                cityArray = request.city;
            } else if (typeof request.city === 'string') {
                cityArray = (request.city as string)
                    .split(',')
                    .filter((city) => city.trim());
            } else {
                cityArray = [];
            }

            if (cityArray.length > 0) {
                const cityConditions = cityArray
                    .map((city) => `city LIKE '%${city.trim()}%'`)
                    .join(' OR ');
                candidateFiltersById.push(
                    `([nxsAliasCandidateId]  IN (SELECT candidateId FROM \`${addressTableName}\` WHERE (${cityConditions})  ))`,
                );
            }
        }

        if (request.department) {
            const addressTableName =
                getManager().getRepository(Address).metadata.tableName;
            candidateFiltersById.push(
                `([nxsAliasCandidateId]  IN (SELECT candidateId FROM \`${addressTableName}\` WHERE ((department LIKE :reqDptLike) OR (SUBSTRING(postalCode,1,2)=:reqDptExact))   ))`,
            );
            candidateFiltersByIdParams.reqDptLike =
                '%' + request.department + '%';
            candidateFiltersByIdParams.reqDptExact = request.department;
            // for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
            //     whereFilter.id = Raw(alias => `(${alias} IN (SELECT candidateId FROM \`${addressTableName}\` WHERE department LIKE '%${request.department}%'  ))`);
            // }
        }

        if (request.candidateGender) {
            if (request.candidateGender) {
                for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
                    whereFilter.genderId = request.candidateGender;
                }
            }
        }

        if (request.candidateNationality) {
            for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
                whereFilter.nationality = Like(
                    '%' + request.candidateNationality + '%',
                );
            }
        }

        if (request.jobHoused) {
            //TODO : changer cette partie :
            // il faudra apasser dans les filtres les 3 valeurs possibles (oui,non, peu importe) + la valeur null (pas de filtre sur ce champ, on récupère tout)
            for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
                whereFilter.isJobHoused = request.jobHoused;
            }
        }

        if (request.driverLicence) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            if (request.driverLicence === 'true') {
                for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
                    whereFilter.hasLicenceDriver = true;
                }
            } else {
                for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
                    whereFilter.hasLicenceDriver = false;
                }
            }
        }

        if (request.mobilityCountries) {
            const countryCode = request.mobilityCountries.split(',');

            if (countryCode.length) {
                const candidateCountryTableName =
                    getManager().getRepository(CandidateCountry).metadata
                        .tableName;

                candidateFiltersById.push(`(
                    ([nxsAliasCandidateId] IN (SELECT id FROM \`${
                        this.getRepository().metadata.tableName
                    }\` WHERE globalMobility = 1))
                    OR
                    ([nxsAliasCandidateId] IN (SELECT candidateId FROM \`${candidateCountryTableName}\` WHERE country IN("${countryCode.join(
                        '","',
                    )}")))
                    )`);

                // for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
                //     // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                //     whereFilter.id = Raw(alias => `(${alias} IN (SELECT candidateId FROM \`${candidateTableName}\` WHERE country IN("${countryCode.join(',')}") ))`);
                // }
            }
        }

        if (request.mobilityDepartments) {
            const departments = request.mobilityDepartments.split(',');
            const firstDpt = departments?.[0];

            if (firstDpt) {
                const candidateDepartmentTableName =
                    getManager().getRepository(CandidateDepartment).metadata
                        .tableName;
                const addressTableName =
                    getManager().getRepository(Address).metadata.tableName;

                // candidateFiltersById.push(`(
                //     ([nxsAliasCandidateId] IN (SELECT id FROM \`${this.getRepository().metadata.tableName}\` WHERE globalMobility = 1))
                //     OR
                //     ([nxsAliasCandidateId] IN (SELECT candidateId FROM \`${candidateDepartmentTableName}\` WHERE department IN("${departments.join('","')}")))
                //     OR
                //     ([nxsAliasCandidateId]  IN (SELECT candidateId FROM \`${addressTableName}\` WHERE ((department LIKE :reqDptLike) OR (SUBSTRING(postalCode,1,2)=:reqDptExact))   ))
                //     )`);

                // candidateFiltersById.push(`(
                //         ([nxsAliasCandidateId] IN (SELECT candidateId FROM \`${candidateDepartmentTableName}\` WHERE department IN("${departments.join('","')}")))
                //         OR
                //         ([nxsAliasCandidateId]  IN (SELECT candidateId FROM \`${addressTableName}\` WHERE ((department LIKE :reqDptLike) OR (SUBSTRING(postalCode,1,2)=:reqDptExact))   ))
                //         )`);

                candidateFiltersById.push(`(
                            ([nxsAliasCandidateId] IN (SELECT candidateId FROM \`${candidateDepartmentTableName}\` WHERE department=:reqDptExact))
                            OR
                            ([nxsAliasCandidateId]  IN (SELECT candidateId FROM \`${addressTableName}\` WHERE ((department LIKE :reqDptLike) OR (SUBSTRING(postalCode,1,2)=:reqDptExact))))
                            )`);

                candidateFiltersByIdParams.reqDptLike = '%' + firstDpt + '%';
                candidateFiltersByIdParams.reqDptExact = firstDpt;
            }
        }

        if (request.isAvailable) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            if (request.isAvailable === 'true') {
                for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
                    whereFilter.isAvailable = true;
                }
            } else {
                for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
                    whereFilter.isAvailable = false;
                }
            }
        }

        // if (request.dependantChildren) {
        //     if (!findOptions.where)
        //         findOptions.where = [{}];
        //     if (request.dependantChildren === 'true') {
        //         for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
        //             whereFilter.dependentChildren = MoreThanOrEqual(1);
        //         }
        //     } else if (request.dependantChildren === 'false') {
        //         for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
        //             whereFilter.dependentChildren = LessThan(1);
        //         }
        //     }
        // }

        if (request.pets) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            if (request.pets === 'true') {
                for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
                    whereFilter.animal = true;
                }
            } else {
                for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
                    whereFilter.animal = false;
                }
            }
        }

        if (request.contractType) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            const statusIds = request.contractType.split(',');

            if (statusIds.length) {
                const getCandidateContracts =
                    await this.candidateContractsRepository.find({
                        where: { contractTypeId: In(statusIds) },
                    });
                const candidateIds = getCandidateContracts.map(
                    (x) => x.candidateId,
                );

                if (!candidateIds?.length) {
                    return false;
                }

                candidateFiltersById.push(
                    `([nxsAliasCandidateId] IN ('${candidateIds.join(
                        "','",
                    )}'))`,
                );
                // for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
                //     whereFilter.id = In(candidateIds);
                // }
            }
        }

        if (request.licencesIds) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            const licenceIds = request.licencesIds.split(',');

            if (licenceIds.length) {
                candidateFiltersById.push(
                    `([nxsAliasCandidateId] IN (SELECT candidateId FROM \`candidate-licences\` WHERE licenceId IN("${licenceIds.join(
                        '","',
                    )}") ))`,
                );
                // for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
                //     whereFilter.id = Raw(alias => `(${alias} IN (SELECT candidateId FROM \`candidate-licences\` WHERE licenceId IN("${licenceIds.join('","')}") ))`);
                // }
            }
        }

        if (request.languagesIds) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            const languagesIds = request.languagesIds.split(',');

            if (languagesIds.length) {
                candidateFiltersById.push(
                    `([nxsAliasCandidateId] IN (SELECT candidateId FROM \`candidate-language\` WHERE languageCode IN ("${languagesIds.join(
                        '","',
                    )}")))`,
                );
                // for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
                //     whereFilter.id = Raw(alias => `(${alias} IN (SELECT candidateId FROM \`candidate-language\` WHERE languageCode IN ("${languagesIds.join('","')}")))`);
                // }
            }
        }

        if (request.languages?.length) {
            const where: FindConditions<CandidateLanguage>[] = [];

            for (const item of request.languages) {
                const whereToPush: FindConditions<CandidateLanguage> = {
                    languageCode: item.language,
                };

                if (item.level) {
                    whereToPush.levelLanguageId = item.level;
                }

                where.push(whereToPush);
            }

            const candidateLanguages =
                await this.candidateLanguageRepository.find({ where });
            const candidateLanguageCandidateIds = [
                ...candidateLanguages.map((x) => x.candidateId),
            ];

            if (candidateLanguageCandidateIds?.length) {
                candidateFiltersById.push(
                    `([nxsAliasCandidateId] IN ("${candidateLanguageCandidateIds.join(
                        '","',
                    )}"))`,
                );
                // candidateFiltersById.push(`([nxsAliasCandidateId] IN (SELECT candidateId FROM \`candidate-language\` WHERE \`candidate-language\`.\`id\` IN ("${candidateLanguageIds.join('","')}")))`);

                // for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
                //     whereFilter.id = Raw(alias => `(${alias} IN (SELECT candidateId FROM \`candidate-language\` WHERE \`candidate-language\`.\`id\` IN ("${candidateLanguageIds.join('","')}")))`);
                // }
            } else {
                return false;
            }
        }

        if (request.childrenMinAge || request.childrenMaxAge) {
            if (request.childrenMinAge && request.childrenMaxAge) {
                candidateFiltersById.push(
                    `([nxsAliasCandidateId] IN (SELECT candidateId FROM \`candidate-children\` WHERE age >= '${request.childrenMinAge}' AND age <= '${request.childrenMaxAge}'))`,
                );
            } else if (request.childrenMinAge && !request.childrenMaxAge) {
                candidateFiltersById.push(
                    `([nxsAliasCandidateId] IN (SELECT candidateId FROM \`candidate-children\` WHERE age >= '${request.childrenMinAge}'))`,
                );
            }

            // for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
            //     if (request.childrenMinAge && request.childrenMaxAge) {
            //         whereFilter.id = Raw(alias => `(${alias} IN (SELECT candidateId FROM \`candidate-children\` WHERE age >= '${request.childrenMinAge}' AND age <= '${request.childrenMaxAge}'))`);
            //     } else if (request.childrenMinAge && !request.childrenMaxAge) {
            //         whereFilter.id = Raw(alias => `(${alias} IN (SELECT candidateId FROM \`candidate-children\` WHERE age >= '${request.childrenMinAge}'))`);
            //     }
            // }
        }

        if (!request.childrenMinAge && request.childrenMaxAge === '0') {
            findOptions.where = [{ hasNoChildren: true }];
        }

        if (request.isVehicle) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            if (request.isVehicle === 'true') {
                for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
                    whereFilter.isVehicle = true;
                }
            } else {
                for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
                    whereFilter.isVehicle = false;
                }
            }
        }
        if (request.consultantIds) {
            const consultantIds = request.consultantIds.split(',');

            if (consultantIds?.length) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }

                if (request.includeUnassignedCandidates === 'true') {
                    // Include candidates with specified consultant OR no consultant assigned
                    const existingWhereConditions = [
                        ...(findOptions.where as FindConditions<Candidate>[]),
                    ];
                    findOptions.where = [];

                    for (const existingCondition of existingWhereConditions) {
                        // Add condition for matching consultant IDs
                        (findOptions.where as FindConditions<Candidate>[]).push(
                            {
                                ...existingCondition,
                                consultantId: In(consultantIds),
                            },
                        );
                        // Add condition for unassigned candidates
                        (findOptions.where as FindConditions<Candidate>[]).push(
                            {
                                ...existingCondition,
                                consultantId: IsNull(),
                            },
                        );
                    }
                } else {
                    for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
                        whereFilter.consultantId = In(consultantIds);
                    }
                }
            }
        }

        if (request.candidateIdsFromReferences) {
            const ids = request.candidateIdsFromReferences.split(',');

            if (ids?.length) {
                candidateFiltersById.push(
                    `([nxsAliasCandidateId] IN ('${ids.join("','")}') )`,
                );
                // for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
                //     whereFilter.id = In(ids);
                // }
            }
        }

        if (request.globalMobility) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            if (request.globalMobility === 'true') {
                for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
                    whereFilter.globalMobility = true;
                }
            } else {
                for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
                    whereFilter.globalMobility = false;
                }
            }
        }

        if (request.note) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
                whereFilter.note = request.note;
            }
        }

        if (request.hasManyTravel) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            // console.log("Log ~ CandidateService ~ setCandidateFilters ~ request.hasManyTravel:", request.hasManyTravel);
            if (request.hasManyTravel === 'true') {
                for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
                    whereFilter.hasManyTravel = true;
                }
            } else {
                for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
                    whereFilter.hasManyTravel = false;
                }
            }
        }

        if (!findOptions.where) {
            findOptions.where = [{}];
        }

        if (!request.disabled) {
            request.disabled = 'false';
        }

        for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
            whereFilter.disabled = request.disabled === 'true';
        }

        if (candidateFiltersById?.length) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            for (const whereFilter of findOptions.where as FindConditions<Candidate>[]) {
                whereFilter.id = Raw((alias) => {
                    const concatQuery =
                        '(' + candidateFiltersById.join(') AND (') + ')';
                    const finalQuery = MainHelpers.replaceAll(
                        concatQuery,
                        '[nxsAliasCandidateId]',
                        alias,
                    );
                    // console.log("Log ~ file: candidates.service.ts ~ line 514 ~ CandidateService ~ whereFilter.id=Raw ~ finalQuery", finalQuery);
                    return finalQuery;
                }, candidateFiltersByIdParams);
            }
        }
        // console.log("Log ~ file: candidates.service.ts ~ line 811 ~ CandidateService ~ setCandidateFilters ~ findOptions.where", findOptions.where);
        return true;
    }

    async findAllForList(request: GetCandidatesRequest) {
        // console.log("🚀 ~ getAll ~ request", request);

        // OPTIMIZED VERSION: Use QueryBuilder to fetch everything in one query
        const response = new GetCandidatesResponse();

        try {
            // Build the base query with minimal joins to avoid Cartesian product
            let queryBuilder = this.repository
                .createQueryBuilder('candidate')
                .leftJoinAndSelect(
                    'candidate.candidateStatus',
                    'candidateStatus',
                )
                .leftJoinAndSelect('candidate.addresses', 'addresses')
                .leftJoinAndSelect(
                    'candidate.candidateCurrentJobs',
                    'candidateCurrentJobs',
                )
                .leftJoinAndSelect(
                    'candidateCurrentJobs.currentJob',
                    'currentJob',
                )
                .leftJoinAndSelect(
                    'currentJob.translations',
                    'currentJobTranslations',
                )
                .leftJoinAndSelect('candidate.noteItems', 'noteItems')
                .leftJoinAndSelect('noteItems.consultant', 'noteConsultant')
                .leftJoinAndSelect('noteItems.files', 'noteItemFiles')
                .leftJoinAndSelect('noteItemFiles.file', 'noteItemFile');

            // Apply filters using the optimized filter builder
            queryBuilder = await this.applyOptimizedFilters(
                queryBuilder,
                request,
            );

            if (!queryBuilder) {
                response.success = true;
                response.candidates = [];
                return response;
            }

            // Apply ordering
            const orderBy = request.orderby || 'creationDate';
            const order =
                request.order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
            queryBuilder.orderBy(`candidate.${orderBy}`, order);

            // Apply pagination
            const start = request.start || 0;
            const length = request.length || 50;
            queryBuilder.skip(start).take(length);

            // OPTIMIZED: Use getManyAndCount to get both results and count in a more optimized way
            // TypeORM will still run 2 queries, but they're optimized and run in parallel
            const [candidates, totalCount] =
                await queryBuilder.getManyAndCount();

            response.filteredResults = totalCount;

            if (totalCount === 0) {
                response.success = true;
                response.candidates = [];
                return response;
            }

            // Now fetch jobs and files ONLY for the paginated results (much faster than joining)
            const candidatesIds = candidates.map((x) => x.id);

            if (candidatesIds?.length) {
                // Fetch candidate jobs in one query
                const jobsList = await this.candidateJobRepository.find({
                    where: { candidateId: In(candidatesIds), inActivity: true },
                    relations: ['job'],
                });

                // Fetch files in one query
                const filesList = await this.candidateFileRepository.find({
                    where: { candidateId: In(candidatesIds) },
                    relations: ['fileType', 'file'],
                });

                // Map jobs and files to candidates
                for (const candidate of candidates) {
                    const candidateJobs = jobsList.filter(
                        (x) => x.candidateId === candidate.id,
                    );
                    const candidateFiles = filesList.filter(
                        (x) => x.candidateId === candidate.id,
                    );

                    candidate.candidateJobs = candidateJobs;
                    candidate.files = candidateFiles;
                }
            }

            // Convert to DTOs
            response.candidates = candidates.map((x) => x.toDto());
            response.success = true;

            return response;
        } catch (err) {
            response.handleError(err);
            return response;
        }
    }

    // NEW: Optimized filter application method using QueryBuilder
    private async applyOptimizedFilters(
        queryBuilder: any,
        request: GetCandidatesRequest,
    ): Promise<any> {
        // Always filter by disabled status
        const disabled = request.disabled === 'true';
        queryBuilder.andWhere('candidate.disabled = :disabled', { disabled });

        // Search filter (name, email, combined firstName+lastName)
        if (request.search && request.search.trim()) {
            const searchTrimmed = request.search.trim();
            // Support searching by:
            // - lastName only
            // - firstName only
            // - email
            // - combined "firstName lastName" (e.g., "John Doe")
            // - combined "lastName firstName" (e.g., "Doe John")
            queryBuilder.andWhere(
                `(candidate.lastName LIKE :search
                  OR candidate.firstName LIKE :search
                  OR candidate.email LIKE :search
                  OR candidate.additionalEmails LIKE :search
                  OR CONCAT(candidate.firstName, ' ', candidate.lastName) LIKE :search
                  OR CONCAT(candidate.lastName, ' ', candidate.firstName) LIKE :search)`,
                { search: `%${searchTrimmed}%` },
            );
        }

        // Candidate status filter
        if (request.candidateStatut) {
            const statusIds = request.candidateStatut.split(',');
            queryBuilder.andWhere(
                'candidate.candidateStatusId IN (:...statusIds)',
                { statusIds },
            );
        }

        // Gender filter
        if (request.candidateGender) {
            queryBuilder.andWhere('candidate.genderId = :genderId', {
                genderId: request.candidateGender,
            });
        }

        // Nationality filter
        if (request.candidateNationality) {
            queryBuilder.andWhere('candidate.nationality LIKE :nationality', {
                nationality: `%${request.candidateNationality}%`,
            });
        }

        // Birth date (age range) filter
        if (request.candidateMinYear && request.candidateMaxYear) {
            queryBuilder.andWhere(
                'candidate.birthDate <= :minYear AND candidate.birthDate >= :maxYear',
                {
                    minYear: request.candidateMinYear,
                    maxYear: request.candidateMaxYear,
                },
            );
        }

        // Job housed filter
        if (request.jobHoused) {
            queryBuilder.andWhere('candidate.isJobHoused = :jobHoused', {
                jobHoused: request.jobHoused,
            });
        }

        // Driver licence filter
        if (request.driverLicence) {
            queryBuilder.andWhere(
                'candidate.hasLicenceDriver = :driverLicence',
                {
                    driverLicence: request.driverLicence === 'true',
                },
            );
        }

        // Available filter
        if (request.isAvailable) {
            queryBuilder.andWhere('candidate.isAvailable = :isAvailable', {
                isAvailable: request.isAvailable === 'true',
            });
        }

        // Pets filter
        if (request.pets) {
            queryBuilder.andWhere('candidate.animal = :animal', {
                animal: request.pets === 'true',
            });
        }

        // Vehicle filter
        if (request.isVehicle) {
            queryBuilder.andWhere('candidate.isVehicle = :isVehicle', {
                isVehicle: request.isVehicle === 'true',
            });
        }

        // Consultant filter
        if (request.consultantIds) {
            const consultantIds = request.consultantIds.split(',');
            if (request.includeUnassignedCandidates === 'true') {
                queryBuilder.andWhere(
                    '(candidate.consultantId IN (:...consultantIds) OR candidate.consultantId IS NULL)',
                    { consultantIds },
                );
            } else {
                queryBuilder.andWhere(
                    'candidate.consultantId IN (:...consultantIds)',
                    { consultantIds },
                );
            }
        }

        // Global mobility filter
        if (request.globalMobility) {
            queryBuilder.andWhere(
                'candidate.globalMobility = :globalMobility',
                {
                    globalMobility: request.globalMobility === 'true',
                },
            );
        }

        // Note filter
        if (request.note) {
            queryBuilder.andWhere('candidate.note = :note', {
                note: request.note,
            });
        }

        // Travel filter
        if (
            request.hasManyTravel &&
            (request.hasManyTravel === 'true' ||
                request.hasManyTravel === 'false')
        ) {
            queryBuilder.andWhere('candidate.hasManyTravel = :hasManyTravel', {
                hasManyTravel: request.hasManyTravel === 'true',
            });
        }

        // OPTIMIZED: Country filter using JOIN instead of subquery
        if (request.candidateLocation) {
            const locationCodes = request.candidateLocation.split(',');
            queryBuilder.andWhere('addresses.country IN (:...locationCodes)', {
                locationCodes,
            });
        }

        // OPTIMIZED: City filter using JOIN instead of subquery
        if (request.city) {
            let cityArray: string[];
            if (Array.isArray(request.city)) {
                cityArray = request.city;
            } else if (typeof request.city === 'string') {
                cityArray = (request.city as string)
                    .split(',')
                    .filter((city) => city.trim());
            } else {
                cityArray = [];
            }

            if (cityArray.length > 0) {
                const cityConditions = cityArray
                    .map((_, index) => `addresses.city LIKE :city${index}`)
                    .join(' OR ');
                const cityParams = {};
                cityArray.forEach((city, index) => {
                    cityParams[`city${index}`] = `%${city.trim()}%`;
                });
                queryBuilder.andWhere(`(${cityConditions})`, cityParams);
            }
        }

        // Department filter
        if (request.department) {
            queryBuilder.andWhere(
                '(addresses.department LIKE :deptLike OR SUBSTRING(addresses.postalCode, 1, 2) = :deptExact)',
                {
                    deptLike: `%${request.department}%`,
                    deptExact: request.department,
                },
            );
        }

        // OPTIMIZED: Job filter using JOIN instead of subquery
        if (request.jobIds) {
            const jobIds = request.jobIds.split(',');
            queryBuilder
                .innerJoin(
                    'candidate.candidateCurrentJobs',
                    'filterCurrentJobs',
                )
                .andWhere('filterCurrentJobs.currentJobId IN (:...jobIds)', {
                    jobIds,
                });
        }

        // Children age filter - still needs subquery for this complex case
        if (request.childrenMinAge || request.childrenMaxAge) {
            if (request.childrenMinAge && request.childrenMaxAge) {
                queryBuilder.andWhere(
                    `candidate.id IN (SELECT candidateId FROM \`candidate-children\` WHERE age >= :childrenMinAge AND age <= :childrenMaxAge)`,
                    {
                        childrenMinAge: request.childrenMinAge,
                        childrenMaxAge: request.childrenMaxAge,
                    },
                );
            } else if (request.childrenMinAge && !request.childrenMaxAge) {
                queryBuilder.andWhere(
                    `candidate.id IN (SELECT candidateId FROM \`candidate-children\` WHERE age >= :childrenMinAge)`,
                    { childrenMinAge: request.childrenMinAge },
                );
            }
        }

        if (!request.childrenMinAge && request.childrenMaxAge === '0') {
            queryBuilder.andWhere('candidate.hasNoChildren = :hasNoChildren', {
                hasNoChildren: true,
            });
        }

        // Contract type filter - fetch IDs first (can't avoid this one easily)
        if (request.contractType) {
            const statusIds = request.contractType.split(',');
            const getCandidateContracts =
                await this.candidateContractsRepository.find({
                    where: { contractTypeId: In(statusIds) },
                });
            const candidateIds = getCandidateContracts.map(
                (x) => x.candidateId,
            );

            if (!candidateIds?.length) {
                return null; // No candidates match
            }

            queryBuilder.andWhere(
                'candidate.id IN (:...contractCandidateIds)',
                {
                    contractCandidateIds: candidateIds,
                },
            );
        }

        // Licences filter - still using subquery but simpler
        if (request.licencesIds) {
            const licenceIds = request.licencesIds.split(',');
            queryBuilder.andWhere(
                `candidate.id IN (SELECT candidateId FROM \`candidate-licences\` WHERE licenceId IN (:...licenceIds))`,
                { licenceIds },
            );
        }

        // Languages filter - fetch IDs first
        if (request.languages?.length) {
            const where: any[] = [];
            for (const item of request.languages) {
                const whereToPush: any = { languageCode: item.language };
                if (item.level) {
                    whereToPush.levelLanguageId = item.level;
                }
                where.push(whereToPush);
            }

            const candidateLanguages =
                await this.candidateLanguageRepository.find({ where });
            const candidateLanguageCandidateIds = [
                ...candidateLanguages.map((x) => x.candidateId),
            ];

            if (candidateLanguageCandidateIds?.length) {
                queryBuilder.andWhere(
                    'candidate.id IN (:...languageCandidateIds)',
                    {
                        languageCandidateIds: candidateLanguageCandidateIds,
                    },
                );
            } else {
                return null; // No candidates match
            }
        }

        // Mobility countries filter
        if (request.mobilityCountries) {
            const countryCode = request.mobilityCountries.split(',');
            queryBuilder.andWhere(
                `(candidate.globalMobility = 1 OR candidate.id IN (SELECT candidateId FROM \`candidate-country\` WHERE country IN (:...mobCountries)))`,
                { mobCountries: countryCode },
            );
        }

        // Mobility departments filter
        if (request.mobilityDepartments) {
            const departments = request.mobilityDepartments.split(',');
            const firstDpt = departments?.[0];
            if (firstDpt) {
                queryBuilder.andWhere(
                    `(candidate.id IN (SELECT candidateId FROM \`candidate-department\` WHERE department = :mobDept) OR candidate.id IN (SELECT candidateId FROM \`address\` WHERE department LIKE :mobDeptLike OR SUBSTRING(postalCode, 1, 2) = :mobDept))`,
                    { mobDept: firstDpt, mobDeptLike: `%${firstDpt}%` },
                );
            }
        }

        return queryBuilder;
    }

    async findAll(
        conditions:
            | FindManyOptions<Candidate>
            | LinqMultipleQueryWrapper<Candidate>,
        useGetOneRelations: boolean,
        additionalRelations: string[],
        ...toDtoParameters: any
    ): Promise<GetCandidatesResponse> {
        if (useGetOneRelations) {
            if (!conditions) {
                conditions = {};
            }

            conditions.relations = this.modelOptions.getOneRelations;
        }

        if (additionalRelations) {
            if (!conditions) {
                conditions = {};
            }

            if (!conditions.relations) {
                conditions.relations = [];
            }

            conditions.relations.push(...(additionalRelations as any[]));
        }

        const response = await super.findAll(conditions, toDtoParameters);

        return response;
    }

    getPercentageOfAdvancement(
        candidate: CandidateDto,
    ): PercentageAndFieldMissedWrapper {
        const percentageAndFieldsToReturn: PercentageAndFieldMissedWrapper = {
            fieldsMissed: [],
            percentage: 0,
        };
        let fieldsToSetHelp = [];

        if (!candidate) {
            return null;
        }

        const requiredFields: (keyof CandidateDto)[] = [
            'firstName',
            'lastName',
            'gender',
            'birthDate',
            'relationshipStatusId',
            'nationality',
            'animal',
            'phone',
            'email',
            'addresses',
            'isJobHoused',
            'candidateContracts',
            'skills',
        ];

        let percentageOfAdvancement = 0;
        let nbTotalOfRequiredField = requiredFields.length;
        const requiredFiles = candidate.files?.filter((x) => x.isMandatory);

        if (requiredFiles?.length) {
            nbTotalOfRequiredField += requiredFiles.length;

            for (const file of requiredFiles) {
                if (file.fileId) {
                    percentageOfAdvancement += 100 / nbTotalOfRequiredField;
                } else {
                    fieldsToSetHelp.push(file.fileType?.label);
                }
            }
        }

        nbTotalOfRequiredField++;

        if (candidate.hasNoChildren || candidate.candidateChildrens?.length) {
            percentageOfAdvancement += 100 / nbTotalOfRequiredField;
        }

        for (const item of requiredFields) {
            let set = false;

            if (
                typeof candidate[item] === 'number' ||
                typeof candidate[item] === 'boolean'
            ) {
                if (candidate[item] !== null && candidate[item] !== undefined) {
                    percentageOfAdvancement += 100 / nbTotalOfRequiredField;
                    set = true;
                }
            } else if (Array.isArray(candidate[item])) {
                if ((candidate[item] as any[])?.length) {
                    percentageOfAdvancement += 100 / nbTotalOfRequiredField;
                    set = true;
                }
            } else {
                if (candidate[item]) {
                    percentageOfAdvancement += 100 / nbTotalOfRequiredField;
                    set = true;
                }
            }

            if (!set) {
                fieldsToSetHelp.push(fieldFrenchLabel[item]);
            }
        }

        if (percentageOfAdvancement > 100) {
            percentageOfAdvancement = 100;
        }

        percentageAndFieldsToReturn.percentage = parseInt(
            percentageOfAdvancement.toFixed(),
            10,
        );

        percentageAndFieldsToReturn.fieldsMissed = fieldsToSetHelp;

        return percentageAndFieldsToReturn;
    }

    public async createMandatoryCandidateFilesForCandidate(
        candidateDto: CandidateDto,
        skipSave?: boolean,
    ) {
        try {
            const fileTypesResponse =
                await this.referentialService.getTypeValues({
                    appTypeCode: AppTypes.CandidateFileType,
                });
            const fileTypes = fileTypesResponse.appType.appValues;

            const mandatoriesFilesTypes: CandidateFileType[] = [
                CandidateFileType.MainResume,
                CandidateFileType.MainPhoto,
                CandidateFileType.IdentityCard,
                CandidateFileType.LastThreeWorkCertificates,
                CandidateFileType.CriminalRecord,
                CandidateFileType.SalarySheets,
            ];

            if (candidateDto.inCouple) {
                mandatoriesFilesTypes.push(CandidateFileType.PartnerResume);
            }

            if (!candidateDto.files || !candidateDto.files.length) {
                candidateDto.files = [];
            }

            for (const mandatoryFileType of mandatoriesFilesTypes) {
                const mandatoryFileTypeId = fileTypes.find(
                    (x) => x.code === mandatoryFileType,
                )?.id;
                const file = candidateDto.files.find(
                    (x) => x.fileTypeId === mandatoryFileTypeId,
                );

                if (file) {
                    // console.log("🚀 ~ CandidateService ~ createMandatoryCandidateFilesForCandidate ~ file", file);
                    file.isMandatory = true;
                } else {
                    const candidateFile = new CandidateFileDto();
                    candidateFile.fileTypeId = mandatoryFileTypeId;
                    candidateFile.isMandatory = true;
                    candidateDto.files.push(candidateFile);
                }
            }

            // console.log("🚀 ~ CandidateService ~ createCandidateFilesForCandidate ~ candidateDto", candidateDto);
            if (!skipSave) {
                await this.repository.save(candidateDto);
            }
        } catch (err) {
            throw new AppErrorWithMessage(err);
        }
    }

    private setExistantFileTypeToMandatory(
        fileTypesDto: AppValueDto[],
        candidateFiles: CandidateFileDto[],
    ) {
        for (const fileTypeDto of fileTypesDto) {
            for (const candidateFile of candidateFiles) {
                if (candidateFile.fileType?.code === fileTypeDto.code) {
                    candidateFile.isMandatory = true;
                }
            }
        }

        console.log(
            '🚀 ~ CandidateService ~ setExistantFileTypeToMandatory ~ candidateFiles',
            candidateFiles,
        );

        return candidateFiles;
    }

    async getCandidateApplicationsLength(id: string) {
        const response = new GetCandidateApplicationsLength();

        try {
            const candidate = await this.repository.findOne({
                where: { id: id },
                relations: ['candidateApplications'],
            });

            if (!candidate) {
                throw new AppErrorWithMessage('Unable to get candidate');
            }

            response.applications =
                candidate?.candidateApplications?.length || 0;
            response.success = true;
        } catch (error) {
            throw new AppErrorWithMessage(error);
        }

        return response;
    }

    public async deleteAllCandidates() {
        const response = new GenericResponse(true);
        const candidatesToRemoveResponse = await this.findAll(null, false, []);

        if (candidatesToRemoveResponse?.candidates?.length) {
            await this.delete(
                candidatesToRemoveResponse.candidates.map((x) => x.id),
            );
        }

        return response;
    }
    public async delete(ids: string[]) {
        let response = new GenericResponse();

        try {
            const usersToDeleteResponse = await this.userService.findAll({
                where: { candidateId: In(ids) },
                select: ['id'],
            });

            if (usersToDeleteResponse?.users?.length) {
                const usersToDeleteIds = usersToDeleteResponse.users.map(
                    (x) => x.id,
                );

                await this.userService.delete(usersToDeleteIds);
            }

            const candidatesToRemoveResponse = await this.findAll(
                { where: { id: In(ids) }, relations: ['files'] },
                false,
                [],
            );

            if (candidatesToRemoveResponse?.candidates?.length) {
                const candidatesFilesIds: string[] = [];

                // Delete candidates from Brevo (SendInBlue) to stop newsletters
                for (const candidateToRemove of candidatesToRemoveResponse.candidates) {
                    if (candidateToRemove.email) {
                        await this.mailService.deleteBrevoContact(
                            candidateToRemove.email,
                        );
                    }
                }

                for (const candidateToRemove of candidatesToRemoveResponse.candidates) {
                    if (!candidateToRemove.files?.length) continue;
                    for (const candidateFile of candidateToRemove.files?.filter(
                        (x) => !!x && !!x.fileId,
                    )) {
                        if (
                            candidatesFilesIds.indexOf(candidateFile.fileId) ===
                            -1
                        ) {
                            candidatesFilesIds.push(candidateFile.fileId);
                        }
                    }
                }

                for (const candidateToRemove of candidatesToRemoveResponse.candidates) {
                    const candidateFolderPath = this.fileService.joinPaths(
                        Environment.CandidatesPublicDirectory,
                        candidateToRemove.id,
                    );
                    const candidatePrivateFolderPath =
                        this.fileService.joinPaths(
                            Environment.CandidatesDirectory,
                            candidateToRemove.id,
                        );

                    if (await FileHelpers.isDirectory(candidateFolderPath)) {
                        await FileHelpers.removeDirectoryRecursive(
                            candidateFolderPath,
                        );
                    }

                    if (
                        await FileHelpers.isDirectory(
                            candidatePrivateFolderPath,
                        )
                    ) {
                        await FileHelpers.removeDirectoryRecursive(
                            candidatePrivateFolderPath,
                        );
                    }

                    for (const candidateFile of candidateToRemove.files) {
                        if (
                            candidateFile?.file?.externalFilePath &&
                            Environment.EnvName === 'production'
                        ) {
                            const deleteGCloudFileResponse =
                                await this.gCloudStorageService.deleteFile(
                                    candidateFile?.file?.externalFilePath,
                                );
                            const test = '';
                        }
                    }
                }

                if (candidatesFilesIds?.length) {
                    await this.fileService.delete(candidatesFilesIds);
                }

                response = await super.delete(ids);
            }
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    public async archive(ids: string[]) {
        let response = new GenericResponse();

        try {
            const usersToArchiveResponse = await this.userService.findAll({
                where: { candidateId: In(ids) },
                select: ['id'],
            });

            if (usersToArchiveResponse?.users?.length) {
                const usersToArchiveIds = usersToArchiveResponse.users.map(
                    (x) => x.id,
                );
                await this.userService.archive(usersToArchiveIds);
            }

            response = await super.archive(ids);
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    public async getCandidateHasImageProfile(id: string) {
        const response = new GetCandidateImageResponse();

        try {
            const relations = ['files', 'files.fileType'];
            const candidate = await this.repository.findOne({
                where: { id: id },
                relations,
            });

            response.candidateHasImage = false;

            if (candidate) {
                for (const file of candidate.files) {
                    if (
                        file.fileType?.code === CandidateFileType.MainPhoto &&
                        file.fileId
                    ) {
                        response.candidateHasImage = true;
                        break;
                    }
                }
            }

            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    public async sendCandidateFolderByMail(
        request: SendCandidateByEmailRequest,
        consultantEmail?: string,
    ): Promise<GenericResponse> {
        const response = new GenericResponse();

        try {
            if (request.mode === 'sendCandidate') {
                const getUserResponse =
                    await this.userService.findOneWithoutRelations({
                        where: { id: request.candidateId },
                    });

                if (!getUserResponse.success) {
                    throw new AppErrorWithMessage(getUserResponse.message);
                }

                const attachmentsEmail: NxsEmailAttachment[] = [];

                const candidate = await this.repository.findOne({
                    where: { id: request.candidateId },
                    relations: [
                        'candidateCurrentJobs',
                        'candidateCurrentJobs.currentJob',
                        'candidateCurrentJobs.currentJob.appType',
                    ],
                });

                if (!candidate) {
                    throw new AppErrorWithMessage('Unable to get candidate !');
                }

                const filesToRemove: string[] = [];

                for (const candidateFile of request.candidateFiles) {
                    if (!candidateFile.file?.externalFilePath) {
                        continue;
                    }

                    const target = FileHelpers.joinPaths(
                        Environment.UploadedFilesTempDirectory,
                        MainHelpers.generateGuid() +
                            '.' +
                            FileHelpers.getExtensionFromMimeType(
                                candidateFile.file.mimeType,
                            ),
                    );
                    // console.log("Log ~ CandidateService ~ sendCandidateFolderByMail ~ target:", target);
                    const downloadResponse =
                        await this.gCloudStorageService.downloadFile(
                            candidateFile.file.externalFilePath,
                            target,
                        );

                    if (!downloadResponse.success) {
                        throw new AppErrorWithMessage('File download error');
                    }

                    const base64 = await FileHelpers.base64Encode(target);
                    // console.log("Log ~ CandidateService ~ sendCandidateFolderByMail ~ base64:", base64);
                    attachmentsEmail.push({
                        base64Content: base64,
                        name:
                            candidate.firstName +
                            '-' +
                            candidate.lastName +
                            '_' +
                            MainHelpers.formatToUrl(
                                candidateFile.file?.name || 'attachment',
                            ) +
                            '.' +
                            FileHelpers.getExtensionFromMimeType(
                                candidateFile.file.mimeType,
                            ),
                    });

                    if (target) {
                        filesToRemove.push(target);
                    }
                }

                const mailSender =
                    await SharedCandidatesHelpers.getMailSenderFromCandidate(
                        candidate.toDto(),
                        null,
                        this.referentialService,
                        consultantEmail,
                    );

                const sendMailResponse =
                    await this.mailService.sendMailWithGenericTemplate({
                        from: { address: mailSender },
                        to: [
                            { address: request.to, name: request.customerName },
                        ],
                        subject: request.subject,
                        htmlBody: MainHelpers.replaceAll(
                            request.body,
                            '\n',
                            '<br/>',
                        ),
                        attachments: attachmentsEmail,
                    });

                if (!sendMailResponse.success) {
                    throw new AppErrorWithMessage(sendMailResponse.message);
                }

                for (const fileToRemove of filesToRemove) {
                    // console.log("Log ~ CandidateService ~ sendCandidateFolderByMail ~ fileToRemove:", fileToRemove);
                    if (await FileHelpers.fileExists(fileToRemove)) {
                        await FileHelpers.removeFile(fileToRemove);
                    }
                }
            }

            if (request.mode === 'sendResumes') {
                if (!request.candidatesIds) {
                    throw new AppErrorWithMessage('No candidates IDs provided');
                }

                const candidateIds = request.candidatesIds.split(',');
                const attachmentsEmail: NxsEmailAttachment[] = [];

                // Get all candidates
                const getCandidatesResponse = await this.findAll(
                    {
                        where: { id: In(candidateIds) },
                        relations: [
                            'candidateCurrentJobs',
                            'candidateCurrentJobs.currentJob',
                        ],
                    },
                    null,
                    null,
                );

                if (!getCandidatesResponse?.candidates.length) {
                    throw new AppErrorWithMessage('Unable to find candidates');
                }

                // Generate resume PDF for each candidate
                for (const candidate of getCandidatesResponse.candidates) {
                    try {
                        // Get resume options for this candidate (if provided)
                        const candidateOptions =
                            request.candidateResumeOptions?.find(
                                (opt) => opt.candidateId === candidate.id,
                            );

                        // Get the first current job for the candidate (or use a default)
                        const selectedJobId =
                            candidateOptions?.selectedJobId ||
                            candidate.candidateCurrentJobs?.[0]?.currentJob
                                ?.id ||
                            '';

                        // Check if candidate is from US (illegal to show age/nationality in US)
                        const isUSCandidate =
                            candidate.nationality === 'US' ||
                            candidate.addresses?.some(
                                (addr) => addr.country === 'US',
                            );

                        // Generate resume PDF with options
                        const resumeData =
                            await this.candidateResumeService.generateCandidateResume(
                                candidate.id,
                                {
                                    language:
                                        candidateOptions?.language || 'fr', // Default to French
                                    showAge: isUSCandidate
                                        ? false
                                        : (candidateOptions?.showAge ?? true),
                                    showNationality: isUSCandidate
                                        ? false
                                        : (candidateOptions?.showNationality ??
                                          true),
                                    selectedJobId: selectedJobId,
                                },
                            );

                        // Add PDF as attachment
                        attachmentsEmail.push({
                            base64Content: resumeData.buffer.toString('base64'),
                            name: `${candidate.firstName}_${candidate.lastName}_resume.pdf`,
                        });
                    } catch (error) {
                        console.error(
                            `Failed to generate resume for candidate ${candidate.id}:`,
                            error,
                        );
                        // Continue with other candidates even if one fails
                    }
                }

                if (attachmentsEmail.length === 0) {
                    throw new AppErrorWithMessage(
                        'No resumes could be generated',
                    );
                }

                // Get mail sender from the first candidate (or use consultant email)
                const firstCandidate = getCandidatesResponse.candidates[0];
                const mailSender =
                    await SharedCandidatesHelpers.getMailSenderFromCandidate(
                        firstCandidate,
                        null,
                        this.referentialService,
                        consultantEmail,
                    );

                // Send email with all resume attachments
                const sendMailResponse =
                    await this.mailService.sendMailWithGenericTemplate({
                        from: { address: mailSender },
                        to: [
                            { address: request.to, name: request.customerName },
                        ],
                        subject: request.subject,
                        htmlBody: MainHelpers.replaceAll(
                            request.body,
                            '\n',
                            '<br/>',
                        ),
                        attachments: attachmentsEmail,
                    });

                if (!sendMailResponse.success) {
                    throw new AppErrorWithMessage(sendMailResponse.message);
                }
            }

            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    public async getCandidateMainLanguage(
        candidateId: string,
    ): Promise<GetCandidateLanguageResponse> {
        const response = new GetCandidateLanguageResponse();

        try {
            const candidate = await this.repository.findOne({
                where: { id: candidateId },
                relations: ['addresses', 'candidateLanguages'],
            });
            const getCandidateOrUserMainLanguageResponse =
                await SharedCandidatesHelpers.getCandidateOrUserMainLanguage(
                    candidate.toDto(),
                    undefined,
                    this.referentialService,
                );

            response.isDefaultLanguage =
                getCandidateOrUserMainLanguageResponse.isDefaultLanguage;

            const candidateLanguageSimple =
                getCandidateOrUserMainLanguageResponse.language;

            if (!candidateLanguageSimple) {
                throw new AppErrorWithMessage('candidate language error');
            }

            const getLanguages =
                await this.referentialService?.getAllLanguages();

            if (!getLanguages.success) {
                throw new AppErrorWithMessage('get language error');
            }

            const candidateLanguage = getLanguages.languages.find(
                (x) => x.code === candidateLanguageSimple.code,
            );

            if (!candidateLanguage) {
                throw new AppErrorWithMessage('candidate language error');
            }

            response.language = candidateLanguage;
            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    async exportAssistantes() {
        const response = new GenericResponse();
        try {
            const assistantJobCode = 'jobcategory_assistant-e-personnel-le-';
            const codes = [CandidateStatus.NotSelected, assistantJobCode];
            const codesValues = await this.referentialService.getAppValues({
                where: { code: In(codes) },
            });

            if (codesValues?.appValues?.length !== 2) {
                return;
            }

            const jobValue = codesValues.appValues.find(
                (x) => x.code === assistantJobCode,
            );

            if (!jobValue?.id) {
                return;
            }

            const notSelectedStatus = codesValues.appValues.find(
                (x) => x.code === CandidateStatus.NotSelected,
            );

            if (!notSelectedStatus?.id) {
                return;
            }

            const currentJobsEntities =
                await this.candidateCurrentJobRepository.find({
                    where: { currentJobId: jobValue.id },
                });

            let candidateIds = currentJobsEntities.map((x) => x.candidateId);

            if (!candidateIds?.length) {
                return;
            }

            candidateIds = new NxsList(candidateIds).Distinct().ToArray();

            let candidatesEntities = await this.repository.find({
                where: {
                    id: In(candidateIds),
                    candidateStatusId: Not(notSelectedStatus.id),
                    email: Not(IsNull()),
                    newsletterUnsubscribed: false,
                },
                relations: ['addresses'],
            });

            candidatesEntities = candidatesEntities.filter(
                (x) =>
                    SharedService.emailCanBeSent(x.email) &&
                    x.addresses?.some(
                        (y) => y?.country?.toLowerCase() === 'fr',
                    ),
            );

            const candidates = candidatesEntities.map((x) => x.toDto());
            const excelData = candidates.map((x) => [
                x.firstName,
                x.lastName,
                x.email,
                x.phone,
            ]);

            excelData.unshift(['FIRSTNAME', 'LASTNAME', 'EMAIL', 'PHONE']);
            ExcelHelpers.initWithProvider(new ExcelHelpersExcelJs() as any);

            const exportResponse = await ExcelHelpers.generateExcel({
                output: 'assistants.xlsx',
                data: excelData,
                generationType: 'file',
                worksheetName: 'assistants',
            });

            console.log(
                'Log ~ CandidateService ~ exportAssistantes ~ exportResponse:',
                exportResponse,
            );

            response.success = true;
        } catch (error) {
            response.handleError(error);
        }

        return response;
    }

    async createCandidateJobOfferHistoryEntry(
        candidateId: string,
        jobOfferId: string,
        action: CandidateJobOfferAction,
        candidateFirstName: string,
        candidateLastName: string,
    ): Promise<void> {
        try {
            await this.candidateJobOfferHistoryService.createHistoryEntry(
                candidateId,
                jobOfferId,
                action,
                candidateFirstName,
                candidateLastName,
            );
        } catch (error) {
            console.error(
                'Error creating candidate job offer history entry:',
                error,
            );
        }
    }

    async updateCandidateJobsStatus(
        candidateId: string,
        candidateJobUpdates: UpdateCandidateJobStatusDto[],
        payload?: JwtPayload,
    ): Promise<GetCandidateResponse> {
        const response = new GetCandidateResponse();

        try {
            // Get the candidate with all candidate jobs
            const candidate = await this.repository.findOne({
                where: { id: candidateId },
                relations: ['candidateJobs'],
            });

            if (!candidate) {
                throw new AppErrorWithMessage('Candidate not found');
            }

            // Update each candidate job status
            for (const update of candidateJobUpdates) {
                const candidateJob = candidate.candidateJobs?.find(
                    (job) => job.id === update.candidateJobId,
                );

                if (candidateJob) {
                    const previousStatus = candidateJob.status;
                    candidateJob.status = update.status;

                    // Save history entry for status change
                    if (previousStatus !== update.status && payload?.id) {
                        const now = new Date();
                        const history: HistoryDto = {
                            date: DateHelpers.convertUTCDateToLocalDate(now),
                            entity: 'candidateJob',
                            entityId: candidateJob.id,
                            field: 'status',
                            valueBefore: previousStatus,
                            valueAfter: update.status,
                            userId: payload.id,
                        };

                        await this.historiesService.createOrUpdate(history);
                    }
                }
            }

            // Save the candidate with updated jobs
            await this.repository.save(candidate);

            // Get the updated candidate with all relations
            const updatedCandidate = await this.repository.findOne({
                where: { id: candidateId },
                relations: [
                    'candidateJobs',
                    'candidateJobs.job',
                    'candidateJobs.jobReference',
                    'candidateJobs.jobReference.addresses',
                    // 'candidateJobs.child',
                ],
            });

            if (updatedCandidate) {
                response.candidate = updatedCandidate.toDto();
                response.success = true;
            }
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    async saveNoteItemFile(
        noteItemId: string,
        fileDto: NoteItemFileDto,
    ): Promise<GenericResponse> {
        const response = new GenericResponse();

        try {
            const noteItem = await this.noteItemRepository.findOne({
                where: { id: noteItemId },
                relations: ['files', 'files.file'],
            });

            if (!noteItem) {
                throw new AppErrorWithMessage('Note item not found');
            }

            // If file has a physicalName, it's a new upload that needs to be moved from temp
            if (fileDto.file?.physicalName && !fileDto.file?.externalFilePath) {
                const tempFilePath = this.fileService.getTempFilePath(
                    fileDto.file,
                );

                // Check if temp file exists (may not exist in clustered deployments if request hits different instance)
                if (!(await FileHelpers.fileExists(tempFilePath))) {
                    throw new AppErrorWithMessage(
                        'The uploaded file could not be found on the server. This can happen in clustered environments. Please try uploading the file again.',
                    );
                }

                // Upload to cloud storage
                const targetFile = `note-item-files/${noteItemId}/${fileDto.file.physicalName}`;
                const uploadResponse =
                    await this.gCloudStorageService.uploadFile(
                        tempFilePath,
                        null,
                        targetFile,
                    );

                if (!uploadResponse.success) {
                    throw new AppErrorWithMessage(uploadResponse.message);
                }

                fileDto.file.externalFilePath = uploadResponse.file.name;

                // Remove temp file
                await FileHelpers.removeFile(tempFilePath);
            }

            // Create or update the note item file
            const noteItemFile = new NoteItemFile();
            noteItemFile.fromDto(fileDto);
            noteItemFile.noteItemId = noteItemId;

            await this.noteItemFileRepository.save(noteItemFile);

            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    async deleteNoteItemFile(noteItemFileId: string): Promise<GenericResponse> {
        const response = new GenericResponse();

        try {
            const noteItemFile = await this.noteItemFileRepository.findOne({
                where: { id: noteItemFileId },
                relations: ['file'],
            });

            if (!noteItemFile) {
                throw new AppErrorWithMessage('Note item file not found');
            }

            // Delete from cloud storage if exists
            if (noteItemFile.file?.externalFilePath) {
                await this.gCloudStorageService.deleteFile(
                    noteItemFile.file.externalFilePath,
                );
            }

            await this.noteItemFileRepository.delete(noteItemFileId);

            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }
}
