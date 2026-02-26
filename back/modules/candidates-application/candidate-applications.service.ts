import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from 'linqts';
import { DateHelpers, MainHelpers } from 'nextalys-js-helpers';
import { ExcelHelpers } from 'nextalys-js-helpers/dist/excel';
import { FileHelpers } from 'nextalys-node-helpers';
import { ExcelHelpersExcelJs } from 'nextalys-node-helpers/dist/helpers/excel-helpers/impl/excel-helpers-exceljs';
import { FindConditions, In, IsNull, Not, Raw, Repository } from 'typeorm';
import { SharedCandidatesHelpers } from '../../../shared/candidates-helpers';
import { JwtPayload } from '../../../shared/jwt-payload';
import { RoutesList } from '../../../shared/routes';
import {
    ApplyStatus,
    AppMainSender,
    AppTypes,
    CandidateFileType,
    CandidateStatus,
    RolesList,
} from '../../../shared/shared-constants';
import { SharedService } from '../../../shared/shared-service';
import { CandidateJobStatus } from '../../../shared/types/candidate-job-status.type';
import { CandidateJobType } from '../../../shared/types/candidate-job-type';
import { Address } from '../../entities/address.entity';
import { Environment } from '../../environment/environment';
import { AppError, AppErrorWithMessage } from '../../models/app-error';
import { AppFileDto } from '../../models/dto/app-file-dto';
import { GenericResponse } from '../../models/responses/generic-response';
import { ApplicationBaseModelService } from '../../services/base-model.service';
import { ReferentialService } from '../../services/referential.service';
import { FileService } from '../../services/tools/file.service';
import {
    EmailDataWithTemplate,
    MailService,
} from '../../services/tools/mail.service';
import { TranslationService } from '../../services/translation.service';
import { AppMailType, JobOfferMailData, MailContent } from '../../shared/mail-content';
import { CandidateApplicationJobs } from '../candidate-application-jobs/candidates-application-jobs.entity';
import { CandidateDto } from '../candidates/candidate-dto';
import { CandidateService } from '../candidates/candidates.service';
import { GCloudStorageService } from '../gdrive/gcloud-storage-service';
import {
    ApplyToJobOffersRequest,
    CandidateApplicationDto,
    GetCandidateApplicationResponse,
    GetCandidateApplicationsResponse,
    GuidExchangeResponse,
} from './candidate-application-dto';
import { CandidateApplication } from './candidate-application.entity';

@Injectable()
export class CandidateApplicationService extends ApplicationBaseModelService<
    CandidateApplication,
    CandidateApplicationDto,
    GetCandidateApplicationResponse,
    GetCandidateApplicationsResponse
> {
    constructor(
        @InjectRepository(CandidateApplication)
        public readonly repository: Repository<CandidateApplication>,
        private candidateService: CandidateService,
        private referentialService: ReferentialService,
        // private gdriveService: GDriveService,
        private fileService: FileService,
        private mailService: MailService,
        private gCloudStorageService: GCloudStorageService,
        @InjectRepository(CandidateApplicationJobs)
        private readonly candidateApplicationJobsRepository: Repository<CandidateApplicationJobs>,
    ) {
        super();
        this.modelOptions = {
            getManyResponse: GetCandidateApplicationsResponse,
            getOneResponse: GetCandidateApplicationResponse,
            getManyResponseField: 'candidateApplications',
            getOneResponseField: 'candidateApplication',
            getManyRelations: [
                // 'relationshipStatus',
                //  'gender',
                'applyStatus',
                'applyStatus.translations',
                //  'profession',
                // 'jobOfferLinked',
                // 'jobOfferLinked.consultant',
                'photoFile',
                'candidateApplicationJobs',
                'candidateApplicationJobs.jobOffer',
                'profession',
                'profession.translations',
                'candidate',
                'candidate.candidateStatus',
                'candidate.candidateStatus.translations',
                'addresses',
            ],
            getOneRelations: [
                'relationshipStatus',
                'relationshipStatus.translations',
                'gender',
                'gender.translations',
                'applyStatus',
                'applyStatus.translations',
                'profession',
                'partnerGender',
                'addresses',
                // 'jobOfferLinked',
                //  'jobOfferLinked.consultant',
                'photoFile',
                'mainResumeFile',
                'partnerResumeFile',
                'candidateApplicationJobs',
                'candidateApplicationJobs.jobOffer',
                'anonymousExchanges',
                'anonymousExchanges.consultant',
                'anonymousExchanges.file',
                // 'candidate',
                // 'candidate.candidateStatus',
                // 'candidate.candidateStatus.translations',
                'candidateCountries',
                'candidateDepartments',
            ],
            repository: this.repository,
            entity: CandidateApplication,
            archiveField: 'disabled',
            archiveFieldValue: true,
        };
    }

    async changeCandidateApplicationStatusAndCreateCandidateIfNeeded(
        id: string,
        statusCode: ApplyStatus,
        createCandidate: boolean,
        giveAtsAccess: boolean = false,
        currentJobsId?: string[],
        genderId?: string,
        consultantEmail?: string,
        isPlatform?: boolean,
        consultantId?: string,
    ): Promise<GetCandidateApplicationResponse> {
        let response = new GetCandidateApplicationResponse();

        try {
            const candidateApplication = await this.repository.findOne({
                where: { id: id },
                relations: [
                    'addresses',
                    'photoFile',
                    'mainResumeFile',
                    'partnerResumeFile',
                    'profession',
                    'profession.appType',
                    'candidateDepartments',
                    'candidateCountries',
                    'candidateApplicationJobs',
                    'candidateApplicationJobs.jobOffer',
                ],
            });

            // const candidateApplicationResponse = await this.findOne({ where: { id: id } });
            if (!candidateApplication) {
                throw new AppErrorWithMessage(
                    'Impossible de récupérer la candidature',
                );
            }

            if (genderId) {
                candidateApplication.genderId = genderId;
            }

            if (createCandidate && !candidateApplication.candidateId) {
                response = await this.createCandidateFromCandidateApplication(
                    candidateApplication,
                    currentJobsId,
                    consultantId,
                );
                if (!response.success) {
                    if (response.originalError) throw response.originalError;
                    throw new AppErrorWithMessage(response.message);
                }
            } /* else if (createCandidate && candidateApplication.candidateId) {
                // If candidate already exists, update their files from the application
                await this.updateExistingCandidateFilesFromApplication(
                    candidateApplication,
                );
            } */

            // Auto-assign consultant to existing candidate if not already assigned
            if (
                statusCode === ApplyStatus.Validated &&
                consultantId &&
                candidateApplication.candidateId
            ) {
                const existingCandidate = await this.candidateService.findOne({
                    where: { id: candidateApplication.candidateId },
                });
                if (
                    existingCandidate.success &&
                    existingCandidate.candidate &&
                    !existingCandidate.candidate.consultantId
                ) {
                    existingCandidate.candidate.consultantId = consultantId;
                    await this.candidateService.createOrUpdate(
                        existingCandidate.candidate,
                        false,
                        {},
                    );
                }
            }

            // const candidateApplication = candidateApplicationResponse.candidateApplication;
            const getStatusRefusedCandidateApplication =
                await this.referentialService.getOneAppValue(statusCode);
            candidateApplication.applyStatusId =
                getStatusRefusedCandidateApplication.appValue.id;

            await this.repository.save(candidateApplication);

            if (!isPlatform) {
                const mailSender =
                    SharedCandidatesHelpers.getMailSenderFromCandidateApplication(
                        candidateApplication,
                        undefined,
                        consultantEmail,
                    );

                const countryCode =
                    candidateApplication?.addresses?.[0]?.country;

                let mailType: AppMailType = 'CandidateApplicationAccepted';
                if (statusCode === ApplyStatus.Refused) {
                    mailType = createCandidate
                        ? 'CandidateApplicationRefusedCreateCandidate'
                        : 'CandidateApplicationRefused';
                }

                // Extract job offer info from the first linked job offer (if any)
                let jobOfferData: JobOfferMailData | undefined;
                const firstJobOffer =
                    candidateApplication.candidateApplicationJobs?.[0]?.jobOffer;
                if (firstJobOffer) {
                    jobOfferData = {
                        ref: firstJobOffer.ref,
                        title: firstJobOffer.title,
                    };
                }

                const mailContentWrapper = MailContent.getMailContentAndSubject(
                    mailType,
                    false,
                    null,
                    countryCode,
                    undefined,
                    jobOfferData,
                );

                const sendMailResponse =
                    await this.mailService.sendMailWithGenericTemplate({
                        htmlBody: mailContentWrapper.content,
                        subject: mailContentWrapper.subject,
                        from: { address: mailSender },
                        to: [{ address: candidateApplication.email }],
                    });

                if (!sendMailResponse.success) {
                    throw new AppErrorWithMessage(
                        "Une erreur s'est produite lors de l'envoi du mail",
                    );
                }
            }

            if (giveAtsAccess && createCandidate) {
                const fetchedCandidate = await this.candidateService.findOne({
                    where: { id: candidateApplication.candidateId },
                });

                if (!fetchedCandidate.success) {
                    throw new AppErrorWithMessage(
                        "Impossible de créer un utilisateur pour le candidat, lenvoi du mail d'accès à l'ATS à echoué",
                    );
                }

                await this.candidateService.createUserFromCandidate(
                    fetchedCandidate.candidate,
                    { roles: [RolesList.Candidate] } as any,
                    true,
                    false,
                );
            }

            response.candidateApplication = candidateApplication.toDto();
            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    async createCandidateFromCandidateApplication(
        candidateApplication: CandidateApplication,
        currentJobsId?: string[],
        consultantId?: string,
    ): Promise<GetCandidateApplicationResponse> {
        const response = new GetCandidateApplicationResponse();

        try {
            if (!candidateApplication) {
                throw new AppError("Une erreur s'est produite");
            }

            const candidateToBeRefStatusId =
                await this.referentialService.getOneAppValue(
                    CandidateStatus.ToBeReferenced,
                );

            if (!candidateToBeRefStatusId.success) {
                throw new AppError(
                    "Une erreur s'est produite lors de la création du candidat",
                );
            }

            response.candidateApplication = {} as any;

            const jobResponse = await this.referentialService.getTypeValues({
                appTypeCode: AppTypes.JobCategoryCode,
            });

            if (!jobResponse.success) {
                throw new AppError(
                    'Une erreur est survenue lors de la validation de la candidature',
                );
            }

            const candidate = new CandidateDto();
            // candidate.newsletterUnsubscribedGuid = MainHelpers.generateGuid();
            candidate.addresses = [];
            candidate.firstName = candidateApplication.firstName;
            candidate.lastName = candidateApplication.lastName;
            candidate.genderId = candidateApplication.genderId;
            candidate.birthDate = candidateApplication.birthDate;
            if (!candidate.candidateJobs?.length) candidate.candidateJobs = [];
            candidate.candidateJobs.push({
                candidateId: candidate.id,
                jobId: candidateApplication.professionId,
                status: CandidateJobStatus.PENDING,
                type: CandidateJobType.JOB,
            });
            // candidate.candidateJobs = [jobResponse.appType.appValues.find(x => x.id === candidateApplication.professionId)];
            candidate.phone = candidateApplication.phone;
            candidate.phoneSecondary = candidateApplication.phoneSecondary;
            candidate.email = candidateApplication.email;
            candidate.addresses.push(...candidateApplication.addresses);
            candidate.skills = candidateApplication.skills;
            candidate.relationshipStatusId =
                candidateApplication.relationshipStatusId;
            candidate.inCouple = candidateApplication.inCouple;
            candidate.candidateStatusId = candidateToBeRefStatusId.appValue.id;
            candidate.files = [];

            candidate.allowed_to_work_us =
                candidateApplication.allowed_to_work_us;
            candidate.require_sponsorship_us =
                candidateApplication.require_sponsorship_us;

            candidate.partnerFirstName = candidateApplication.partnerFirstName;
            candidate.partnerLastName = candidateApplication.partnerLastName;
            candidate.partnerBirthDate = candidateApplication.partnerBirthDate;
            candidate.partnerEmail = candidateApplication.partnerEmail;
            if (candidateApplication.partnerPhone) {
                candidate.partnerPhone = MainHelpers.shorten(
                    candidateApplication.partnerPhone,
                    27,
                    0,
                );
            }
            candidate.partnerGenderId = candidateApplication.partnerGenderId;
            candidate.candidateCountries = [];
            for (const item of candidateApplication.candidateCountries) {
                candidate.candidateCountries.push({
                    country: item.country,
                });
            }
            candidate.candidateDepartments = [];
            for (const item of candidateApplication.candidateDepartments) {
                candidate.candidateDepartments.push({
                    department: item.department,
                });
            }
            if (!candidate.candidateCurrentJobs?.length)
                candidate.candidateCurrentJobs = [];

            if (currentJobsId?.length) {
                for (const currentJobId of currentJobsId) {
                    candidate.candidateCurrentJobs.push({
                        currentJobId: currentJobId,
                    });
                }
            }

            candidate.isAvailable = true;

            if (consultantId) {
                candidate.consultantId = consultantId;
            }

            candidate.addresses.forEach((x) => {
                delete x.id;
                delete x.candidateApplicationId;
            });

            // Normalize email to lowercase and trim to avoid duplicates
            const normalizedEmail = candidate.email?.toLowerCase().trim();
            if (!normalizedEmail) {
                throw new AppErrorWithMessage(
                    "L'adresse e-mail est requise pour créer un candidat",
                );
            }
            candidate.email = normalizedEmail;

            const candidateResponse = await this.candidateService.findOne({
                where: { email: normalizedEmail },
            });

            if (candidateResponse.success && candidateResponse.candidate) {
                throw new AppErrorWithMessage(
                    'Un candidat existe déjà avec cette adresse e-mail !',
                );
            }

            if (candidateResponse.success && !candidateResponse.candidate) {
                candidate.files = [];
                const createCandidateResponse =
                    await this.candidateService.createOrUpdate(
                        candidate,
                        false,
                        {
                            includeAddresses: 'true',
                            includeFiles: 'true',
                            includeCandidateJobs: 'true',
                        },
                    );
                // console.log("Log ~ file: candidate-applications.service.ts ~ line 179 ~ CandidateApplicationService ~ createCandidateFromCandidateApplication ~ createCandidateResponse", createCandidateResponse);

                if (!createCandidateResponse.success) {
                    throw new AppError(
                        "Une erreur s'est produite lors de la création du candidat",
                    );
                }

                candidate.files = [];

                const copyCandidateApplicationFilesResponse =
                    await this.copyCandidateApplicationFilesToCandidate(
                        candidateApplication,
                        createCandidateResponse.candidate,
                    );

                await this.candidateService.createMandatoryCandidateFilesForCandidate(
                    copyCandidateApplicationFilesResponse.candidate,
                );

                candidateApplication.candidateId =
                    createCandidateResponse.candidate.id;
                const responseSave = await this.repository.save(
                    candidateApplication,
                );
                response.candidateApplication = responseSave.toDto();
            } else {
                //TODO
            }

            response.success = true;
        } catch (err) {
            console.log(err);
            response.handleError(err);
        }

        return response;
    }

    private async updateExistingCandidateFilesFromApplication(
        candidateApplication: CandidateApplication,
    ): Promise<void> {
        // Fetch the existing candidate with files
        const candidateResponse = await this.candidateService.findOne({
            where: { id: candidateApplication.candidateId },
            relations: ['files', 'files.fileType'],
        });

        if (!candidateResponse.success || !candidateResponse.candidate) {
            return;
        }

        const candidateDto = candidateResponse.candidate;
        const fileTypes = await this.referentialService.getTypeValues({
            appTypeCode: AppTypes.CandidateFileType,
        });

        const filesToUpdate: { file: AppFileDto; fileTypeId: string }[] = [];

        // Check if there's a new main resume
        if (candidateApplication.mainResumeFile) {
            filesToUpdate.push({
                file: candidateApplication.mainResumeFile,
                fileTypeId: fileTypes?.appType?.appValues.find(
                    (x) => x.code === CandidateFileType.MainResume,
                )?.id,
            });
        }

        // Check if there's a new partner resume
        if (candidateApplication.partnerResumeFile) {
            filesToUpdate.push({
                file: candidateApplication.partnerResumeFile,
                fileTypeId: fileTypes?.appType?.appValues.find(
                    (x) => x.code === CandidateFileType.PartnerResume,
                )?.id,
            });
        }

        // Check if there's a new photo
        if (candidateApplication.photoFile) {
            filesToUpdate.push({
                file: candidateApplication.photoFile,
                fileTypeId: fileTypes?.appType?.appValues.find(
                    (x) => x.code === CandidateFileType.MainPhoto,
                )?.id,
            });
        }

        // Update each file on the candidate
        for (const fileToUpdate of filesToUpdate) {
            if (!fileToUpdate.fileTypeId) {
                continue;
            }

            await this.candidateService.uploadCandidateFilesToGdrive(
                candidateDto,
                null,
                fileToUpdate.file,
                fileToUpdate.fileTypeId,
                null,
                'candidates',
                false,
            );
        }

        // Copy photo file to candidate public folder if needed
        if (candidateApplication.photoFile?.physicalName) {
            const candidatePublicFolder = this.fileService.joinPaths(
                Environment.CandidatesPublicDirectory,
                candidateDto.id,
            );
            if (!(await FileHelpers.fileExists(candidatePublicFolder))) {
                await FileHelpers.createDirectory(candidatePublicFolder);
            }

            const sourceFile = this.fileService.joinPaths(
                Environment.CandidateApplicationsPublicDirectory,
                candidateApplication.id,
                candidateApplication.photoFile?.physicalName,
            );

            if (await FileHelpers.fileExists(sourceFile)) {
                await FileHelpers.copyFile(
                    sourceFile,
                    this.fileService.joinPaths(
                        candidatePublicFolder,
                        candidateApplication.photoFile?.physicalName,
                    ),
                );
            }
        }

        // Save the updated candidate
        const response = await this.candidateService.createOrUpdate(
            candidateDto,
            false,
            {
                includeFiles: 'true',
            },
        );
        console.log('response', response);
    }

    private async copyCandidateApplicationFilesToCandidate(
        candidateApplication: CandidateApplication,
        candidateDto: CandidateDto,
    ) {
        const filesToHandle: { file: AppFileDto; fileTypeId: string }[] = [];
        const fileTypes = await this.referentialService.getTypeValues({
            appTypeCode: AppTypes.CandidateFileType,
        });

        if (candidateApplication.photoFile) {
            filesToHandle.push({
                file: candidateApplication.photoFile,
                fileTypeId: fileTypes?.appType?.appValues.find(
                    (x) => x.code === CandidateFileType.MainPhoto,
                )?.id,
            });
        }

        if (candidateApplication.mainResumeFile) {
            filesToHandle.push({
                file: candidateApplication.mainResumeFile,
                fileTypeId: fileTypes?.appType?.appValues.find(
                    (x) => x.code === CandidateFileType.MainResume,
                )?.id,
            });
        }

        if (candidateApplication.partnerResumeFile) {
            filesToHandle.push({
                file: candidateApplication.partnerResumeFile,
                fileTypeId: fileTypes?.appType?.appValues.find(
                    (x) => x.code === CandidateFileType.PartnerResume,
                )?.id,
            });
        }

        for (const fileToHandle of filesToHandle) {
            if (!fileToHandle.fileTypeId) {
                continue;
            }

            await this.candidateService.uploadCandidateFilesToGdrive(
                candidateDto,
                null,
                fileToHandle.file,
                fileToHandle.fileTypeId,
                null,
                'candidates',
                false,
            );
        }

        if (candidateApplication.photoFile?.physicalName) {
            const candidatePublicFolder = this.fileService.joinPaths(
                Environment.CandidatesPublicDirectory,
                candidateDto.id,
            );
            if (!(await FileHelpers.fileExists(candidatePublicFolder))) {
                await FileHelpers.createDirectory(candidatePublicFolder);
            }

            const sourceFile = this.fileService.joinPaths(
                Environment.CandidateApplicationsPublicDirectory,
                candidateApplication.id,
                candidateApplication.photoFile?.physicalName,
            );

            if (await FileHelpers.fileExists(sourceFile)) {
                await FileHelpers.copyFile(
                    sourceFile,
                    this.fileService.joinPaths(
                        candidatePublicFolder,
                        candidateApplication.photoFile?.physicalName,
                    ),
                );
            }
        }

        return await this.candidateService.createOrUpdate(candidateDto, false, {
            includeFiles: 'true',
        });
    }

    async createOrUpdate(
        dto: CandidateApplicationDto,
        ...toDtoParameters: any
    ): Promise<GetCandidateApplicationResponse> {
        if (!dto.candidateId && dto.email) {
            const emailToLower = dto.email.toLowerCase().trim();
            const findCandidateByEmail = await this.candidateService.findOne({
                where: { email: emailToLower },
            });

            if (findCandidateByEmail.candidate) {
                dto.candidateId = findCandidateByEmail.candidate.id;
            }
        }

        return await super.createOrUpdate(dto, toDtoParameters);
    }

    public async delete(ids: string[]) {
        let response = new GenericResponse();

        try {
            const candidatesApplicationsToRemoveResponse = await this.findAll({
                where: { id: In(ids) },
                relations: ['mainResumeFile', 'photoFile', 'partnerResumeFile'],
            });

            if (
                candidatesApplicationsToRemoveResponse?.candidateApplications
                    ?.length
            ) {
                const candidatesApplicationsFilesIds = new List(
                    candidatesApplicationsToRemoveResponse.candidateApplications,
                )
                    .SelectMany(
                        (x) =>
                            new List([
                                x.photoFileId,
                                x.mainResumeFileId,
                                x.partnerResumeFileId,
                            ]),
                    )
                    .Where((x) => !!x)
                    .ToArray();

                for (const candidateApplicationToRemove of candidatesApplicationsToRemoveResponse.candidateApplications) {
                    const candidateApplicationFolderPath =
                        this.fileService.joinPaths(
                            Environment.CandidateApplicationsDirectory,
                            candidateApplicationToRemove.id,
                        );
                    const candidateApplicationPrivateFolderPath =
                        this.fileService.joinPaths(
                            Environment.CandidateApplicationsPublicDirectory,
                            candidateApplicationToRemove.id,
                        );

                    if (
                        await FileHelpers.isDirectory(
                            candidateApplicationFolderPath,
                        )
                    ) {
                        await FileHelpers.removeDirectoryRecursive(
                            candidateApplicationFolderPath,
                        );
                    }

                    if (
                        await FileHelpers.isDirectory(
                            candidateApplicationPrivateFolderPath,
                        )
                    ) {
                        await FileHelpers.removeDirectoryRecursive(
                            candidateApplicationPrivateFolderPath,
                        );
                    }

                    if (
                        candidateApplicationToRemove?.mainResumeFile
                            ?.externalFilePath &&
                        Environment.EnvName === 'production'
                    ) {
                        const deleteGCloudFileResponse =
                            await this.gCloudStorageService.deleteFile(
                                candidateApplicationToRemove?.mainResumeFile
                                    ?.externalFilePath,
                            );
                        const test = '';
                    }

                    if (
                        candidateApplicationToRemove?.photoFile
                            ?.externalFilePath &&
                        Environment.EnvName === 'production'
                    ) {
                        const deleteGCloudFileResponse =
                            await this.gCloudStorageService.deleteFile(
                                candidateApplicationToRemove?.photoFile
                                    ?.externalFilePath,
                            );
                        const test = '';
                    }

                    if (
                        candidateApplicationToRemove?.partnerResumeFile
                            ?.externalFilePath &&
                        Environment.EnvName === 'production'
                    ) {
                        const deleteGCloudFileResponse =
                            await this.gCloudStorageService.deleteFile(
                                candidateApplicationToRemove?.partnerResumeFile
                                    ?.externalFilePath,
                            );
                        const test = '';
                    }
                }

                // const buffer = await FileHelpers.readFile(filePath, false) as Buffer;
                response = await super.delete(ids);

                if (candidatesApplicationsFilesIds.length) {
                    await this.fileService.delete(
                        candidatesApplicationsFilesIds,
                    );
                }
            }
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    public async deleteAllCandidateApplications() {
        const response = new GenericResponse(true);
        const candidatesApplicationsToRemoveResponse = await this.findAll();

        if (
            candidatesApplicationsToRemoveResponse?.candidateApplications
                ?.length
        ) {
            await this.delete(
                candidatesApplicationsToRemoveResponse.candidateApplications.map(
                    (x) => x.id,
                ),
            );
        }

        return response;
    }

    async applyToJobOffers(
        request: ApplyToJobOffersRequest,
        payload: JwtPayload,
        langCode: 'en' | 'fr',
    ): Promise<GetCandidateApplicationResponse> {
        const response = new GetCandidateApplicationResponse();
        try {
            if (!payload?.candidateId) {
                throw new AppError('Unauthorized');
            }

            if (!request.jobOfferIds?.length) {
                throw new AppError('Invalid request');
            }

            const candidateApplicationJobsExisting =
                await this.candidateApplicationJobsRepository.find({
                    where: {
                        //pas ok : une seule offre testée
                        // jobOfferId: request.candidateApplication.candidateApplicationJobs[0].jobOfferId,
                        jobOfferId: In(request.jobOfferIds),
                        candidateApplicationId: Raw(
                            (alias) =>
                                `(${alias} IN (SELECT id FROM ` +
                                '`' +
                                this.getRepository().metadata.tableName +
                                '` WHERE candidateId = :candidateId ))',
                            { candidateId: payload.candidateId },
                        ),
                    },
                    // select:['candidateApplication']
                    relations: ['candidateApplication', 'jobOffer'],
                });

            if (candidateApplicationJobsExisting?.length) {
                // && candidateApplicationJobs.some(x => x.candidateApplication.email === request.candidateApplication.email)) {
                //wording incorrect
                // throw new AppErrorWithMessage('Vous avez déjà postuler à cette offre');
                //TODO : traduire
                const jobOffersRefList = new List(
                    candidateApplicationJobsExisting.map((x) => x.jobOffer.ref),
                )
                    .Distinct()
                    .ToArray();
                const msgTranslated = await TranslationService.getTranslation(
                    langCode,
                    'CandidateApplication.AlreadyAppliedForApplications',
                );
                throw new AppErrorWithMessage(
                    msgTranslated +
                        ' <br/> - ' +
                        jobOffersRefList.join('<br/> - '),
                );
            }

            let newApplication = new CandidateApplication();
            const applyStatusPending =
                await this.referentialService.getOneAppValue(
                    ApplyStatus.Pending,
                );

            const candidate = await this.candidateService
                .getRepository()
                .findOne({
                    where: { id: payload.candidateId },
                    relations: ['addresses'],
                });

            newApplication.candidateId = payload.candidateId;
            newApplication.firstName = candidate?.firstName;
            newApplication.lastName = candidate?.lastName;
            newApplication.email = candidate?.email;
            newApplication.birthDate = candidate?.birthDate;
            newApplication.phone = candidate?.phone;
            newApplication.phoneSecondary = candidate?.phoneSecondary;
            newApplication.genderId = candidate?.genderId;
            newApplication.inCouple = candidate?.inCouple;
            newApplication.relationshipStatusId =
                candidate?.relationshipStatusId;
            newApplication.seen = false;
            newApplication.applyStatusId = applyStatusPending.appValue?.id;
            newApplication.disabled = false;

            if (candidate?.addresses?.length) {
                newApplication.addresses = [];
                for (const address of candidate?.addresses) {
                    const newAddress = new Address();
                    newAddress.city = address.city;
                    newAddress.lineOne = address.lineOne;
                    newAddress.lineTwo = address.lineTwo;
                    newAddress.postalCode = address.postalCode;
                    newAddress.country = address.country;
                    newAddress.department = address.department;
                    newApplication.addresses.push(newAddress);
                }
            }

            newApplication.candidateApplicationJobs =
                request.jobOfferIds.map<CandidateApplicationJobs>((x) => {
                    const candidateApplicationJobs =
                        new CandidateApplicationJobs();
                    candidateApplicationJobs.jobOfferId = x;
                    return candidateApplicationJobs;
                });
            newApplication.linkedToCandidate = true;
            newApplication = await this.repository.save(newApplication);
            response.candidateApplication = newApplication.toDto();
            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    async linkCandidateApplicationToCandidateFromMail(
        id: string,
    ): Promise<GetCandidateApplicationResponse> {
        const response = new GetCandidateApplicationResponse();

        try {
            if (!id) {
                throw new AppErrorWithMessage('Invalid request');
            }

            const getCandidateApplicationResponse =
                await this.findOneWithoutRelations({ where: { id: id } });

            if (!getCandidateApplicationResponse?.candidateApplication) {
                throw new AppErrorWithMessage(
                    'Impossible de trouver la candidature',
                );
            }

            if (
                getCandidateApplicationResponse?.candidateApplication
                    ?.candidateId
            ) {
                throw new AppErrorWithMessage(
                    'Candidate application already linked to a candidate',
                );
            }

            if (!getCandidateApplicationResponse?.candidateApplication?.email) {
                throw new AppErrorWithMessage(
                    "Pas d'e-mail sur cette candidature",
                );
            }

            const getCandidateResponse = await this.candidateService.findOne({
                where: {
                    email: getCandidateApplicationResponse?.candidateApplication
                        .email,
                },
            });

            if (getCandidateResponse.candidate?.id) {
                getCandidateApplicationResponse.candidateApplication.candidateId =
                    getCandidateResponse.candidate.id;
                await this.getRepository().update(
                    {
                        id: getCandidateApplicationResponse
                            ?.candidateApplication?.id,
                    },
                    { candidateId: getCandidateResponse.candidate.id },
                );
            }

            response.candidateApplication = {
                id: getCandidateApplicationResponse?.candidateApplication?.id,
                candidateId:
                    getCandidateApplicationResponse.candidateApplication
                        .candidateId,
            } as any;

            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    async generateGuidExchangeAndSendEmail(
        candidateApplicationId: string,
    ): Promise<GuidExchangeResponse> {
        const response = new GuidExchangeResponse();

        try {
            const getApplication = await super.findOne({
                where: { id: candidateApplicationId },
            });

            if (!getApplication.success) {
                throw new AppErrorWithMessage(
                    'Unable to find candidate application',
                );
            }

            const applicationDto = getApplication.candidateApplication;

            applicationDto.guidExchange = MainHelpers.generateGuid();

            const save = await super.createOrUpdate(applicationDto);

            if (!save.success) {
                throw new AppErrorWithMessage(save.message);
            }

            await this.sendPrivateExchangeLinkToCandidateApplication(
                null,
                applicationDto,
            );

            response.guid = applicationDto.guidExchange;
            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    async sendPrivateExchangeLinkToCandidateApplication(
        candidateApplicationId?: string,
        candidateApplication?: CandidateApplicationDto,
    ): Promise<GenericResponse> {
        const response = new GenericResponse();

        try {
            let applicationDto = new CandidateApplicationDto();

            if (!candidateApplicationId && candidateApplication?.id) {
                applicationDto = candidateApplication;
            } else {
                const getApplication = await super.findOne({
                    where: { id: candidateApplicationId },
                    relations: ['addresses'],
                });

                if (
                    !getApplication.success ||
                    !getApplication.candidateApplication
                ) {
                    throw new AppErrorWithMessage(
                        'Unable to find candidate application',
                    );
                }

                applicationDto = getApplication.candidateApplication;
            }

            if (!applicationDto?.email) {
                throw new InternalServerErrorException(
                    'Cannot send mail for job application exchange : no email',
                );
            }

            if (!applicationDto?.guidExchange) {
                throw new InternalServerErrorException('Unable to find guid');
            }

            const candidateLanguageCode =
                SharedCandidatesHelpers.getLanguageFromCandidateApplication(
                    applicationDto,
                );
            const generatedLink =
                Environment.BaseURL +
                '/' +
                RoutesList.AnonymousExchange +
                '/p/' +
                applicationDto.guidExchange;

            const mailData: EmailDataWithTemplate = {
                from: { address: Environment.MailSender },
                to: [
                    {
                        address: applicationDto.email,
                        contactFirstName: applicationDto.firstName,
                        contactLastName: applicationDto.lastName,
                        contactPhone: applicationDto.phone,
                        name:
                            applicationDto.firstName +
                            ' ' +
                            applicationDto.lastName,
                    },
                ],
                subject: await TranslationService.getTranslation(
                    candidateLanguageCode,
                    'Email.AnonymousExchangeSubject',
                ),
                templateName: 'mail_private_exchange.mjml',
                templateValues: {
                    link: generatedLink,
                    language: candidateLanguageCode,
                },
                useHandleBars: true,
                compileMjmlTemplate: true,
            };

            const sendMailResponse = await this.mailService.sendMail(mailData);

            if (!sendMailResponse.success) {
                throw new AppErrorWithMessage(sendMailResponse.message);
            }

            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    async setCandidateApplicationUnseen(
        candidateApplicationId: string,
    ): Promise<GenericResponse> {
        const response = new GenericResponse(true);

        try {
            const candidate = await this.repository.findOne({
                where: { id: candidateApplicationId },
            });

            if (!candidate) {
                throw new AppErrorWithMessage('Invalid candidateApplicationId');
            }

            candidate.seen = false;

            this.repository.save(candidate);

            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    public async sendCandidateApplicationReceivedMail(
        candidateApplication: CandidateApplicationDto,
        request: { language: 'fr' | 'en' },
        consultantEmail?: string,
    ) {
        if (!candidateApplication?.email) {
            return;
        }

        if (!request) {
            request = { language: 'en' };
        }

        if (request.language !== 'fr' && request.language !== 'en') {
            request.language = 'en';
        }

        const mailContentWrapper = MailContent.getMailContentAndSubject(
            'NewCandidateApplication',
            false,
            request.language,
        );

        const mailSender =
            SharedCandidatesHelpers.getMailSenderFromCandidateApplication(
                candidateApplication,
                request.language,
                consultantEmail,
            );

        let recipientName =
            (candidateApplication.firstName || '') +
            ' ' +
            (candidateApplication.lastName || '');

        recipientName = recipientName.trim();

        if (!recipientName) {
            recipientName = candidateApplication.email;
        }

        await this.mailService.sendMailWithGenericTemplate({
            subject: mailContentWrapper.subject,
            from: { address: mailSender },
            to: [{ address: candidateApplication.email, name: recipientName }],
            htmlBody: mailContentWrapper.content,
            templateValues: { language: request.language },
        });
    }

    private getIsoDateFileName(date: Date) {
        let isoDate = DateHelpers.formatDateISO8601(date, false);
        isoDate = MainHelpers.replaceAll(isoDate, 'T', '-');
        isoDate = MainHelpers.replaceAll(isoDate, ':', '-');

        return isoDate;
    }

    async exportNanniesApplicationsBase(
        sendMail: boolean,
        minDate: Date,
        maxDate: Date,
    ) {
        const response = new GenericResponse();

        try {
            const jobsIds = [
                '0b9e26a6-6a5b-48e0-a5a8-613ca7c6138d',
                '0da9e6c7-9b25-452a-843b-4fa9764c01e0',
                '4573ac94-c9fa-4248-9332-bf4b1f85d9a8',
                '8c5aee3a-427b-469e-9f85-a9bd6f11b552',
                'b1128151-7c2b-488f-976e-d352aa6a8109',
                'dfc78fe6-6036-4d84-8386-8ad56a8c64d1',
                'e9e717a3-b9ad-4a8e-a5f5-cbf8fc8404f5',
            ];

            const codes = [ApplyStatus.Refused];
            const codesValues = await this.referentialService.getAppValues({
                where: [
                    { code: In(codes) },
                    // { id: In(jobsIds) },
                ],
            });
            // console.log("Log ~ exportNanniesApplications ~ codesValues:", codesValues);
            if (codesValues?.appValues?.length !== 1) {
                return;
            }

            // const jobValues = codesValues.appValues.filter(x => x.code !== CandidateStatus.NotSelected && x.code !== ApplyStatus.Refused);
            // // console.log("Log ~ exportNanniesApplications ~ jobValues:", jobValues);
            // if (jobValues?.filter(x => x.id)?.length !== 7) {
            //     return;
            // }

            const applicationRefusedValue = codesValues.appValues.find(
                (x) => x.code === ApplyStatus.Refused,
            );

            if (!applicationRefusedValue?.id) {
                return;
            }

            const whereObj: FindConditions<CandidateApplication> = {
                professionId: In(jobsIds),
                email: Not(IsNull()),
                newsletterUnsubscribed: false,
                applyStatusId: applicationRefusedValue.id,
            };

            if (minDate && maxDate) {
                whereObj.creationDate = Raw(
                    (alias) =>
                        `(${alias} >= :minDate AND ${alias} <= :maxDate)`,
                    { minDate: minDate, maxDate: maxDate },
                );
            }
            // console.log("Log ~ exportNanniesApplicationsBase ~ whereObj:", whereObj);

            let candidateApplicationsEntities = await this.repository.find({
                where: whereObj,
                relations: ['addresses'],
            });

            candidateApplicationsEntities =
                candidateApplicationsEntities.filter(
                    (x) =>
                        SharedService.emailCanBeSent(x.email) &&
                        x.addresses?.some(
                            (y) => y?.country?.toLowerCase() === 'fr',
                        ),
                );

            const candidateApplicationsEntitiesCopy =
                candidateApplicationsEntities;
            candidateApplicationsEntities = [];

            for (const candidateApplicationItem of candidateApplicationsEntitiesCopy) {
                if (
                    !candidateApplicationsEntities?.some(
                        (x) =>
                            x.firstName?.toLowerCase() ===
                                candidateApplicationItem.firstName?.toLowerCase() &&
                            x.lastName?.toLowerCase() ===
                                candidateApplicationItem.lastName?.toLowerCase() &&
                            x.email?.toLowerCase() ===
                                candidateApplicationItem.email?.toLowerCase(),
                    )
                ) {
                    candidateApplicationsEntities.push(
                        candidateApplicationItem,
                    );
                }
            }

            const candidateApplications = candidateApplicationsEntities.map(
                (x) => x.toDto(),
            );

            const excelData = candidateApplications.map((x) => [
                x.firstName,
                x.lastName,
                x.email,
                x.phone,
            ]);

            excelData.unshift(['FIRSTNAME', 'LASTNAME', 'EMAIL', 'PHONE']);

            const outputFile = FileHelpers.joinPaths(
                Environment.UploadedFilesTempDirectory,
                MainHelpers.generateGuid() + '.xlsx',
            );

            ExcelHelpers.initWithProvider(new ExcelHelpersExcelJs() as any);
            const exportResponse = await ExcelHelpers.generateExcel({
                output: outputFile,
                data: excelData,
                generationType: 'file',
                worksheetName: 'nanny-candidatures-refusees',
            });

            if (sendMail) {
                let mailSubject = 'Export candidatures refusées';

                if (minDate && maxDate) {
                    mailSubject += ` du ${DateHelpers.formatDate(
                        minDate,
                    )} au ${DateHelpers.formatDate(maxDate)}`;
                }

                let htmlBody =
                    "Bonjour,<br/><br/>Veuillez trouver en pièce jointe l'export des candidatures refusées qui concernent les postes de Nanny.<br/>";

                if (minDate && maxDate) {
                    htmlBody += `<br/>• Période : du ${DateHelpers.formatDate(
                        minDate,
                    )} au ${DateHelpers.formatDate(maxDate)}`;
                }

                htmlBody += `<br/>• Nombre de candidatures : ${candidateApplications.length}`;

                let attachmentFileName = 'candidatures-refusees-nanny.xlsx';

                if (minDate && maxDate) {
                    attachmentFileName = `candidatures-refusees-nanny-${this.getIsoDateFileName(
                        minDate,
                    )}_${this.getIsoDateFileName(maxDate)}.xlsx`;
                }

                const base64 = await FileHelpers.base64Encode(outputFile);

                if (base64) {
                    const sendMailResponse =
                        await this.mailService.sendMailWithGenericTemplate({
                            subject: mailSubject,
                            htmlBody: htmlBody,
                            attachments: [
                                {
                                    base64Content: base64,
                                    name: attachmentFileName,
                                },
                            ],
                            from: { address: AppMainSender },
                            to: [{ address: 'olivier@morganmallet.agency' }],
                            cci: [{ address: 'david.kessas@nextalys.com' }],
                            templateValues: { language: 'fr' },
                        });

                    if (sendMailResponse.success) {
                        response.success = true;
                    } else {
                        response.message = sendMailResponse.message;
                    }
                }

                if (await FileHelpers.fileExists(outputFile)) {
                    await FileHelpers.removeFile(outputFile);
                }
            }

            console.log(
                'Log ~ exportNannies ~ exportResponse:',
                exportResponse,
            );
            response.success = true;
        } catch (error) {
            console.log('Log ~ exportNanniesApplications ~ error:', error);
            response.handleError(error);
        }

        return response;
    }

    async exportNanniesApplicationsLastWeek() {
        const now = new Date();
        const lastWeek = DateHelpers.addDaysToDate(now, -7);
        const firstDayLastWeek = DateHelpers.getFirstDayOfWeek(lastWeek);
        const lastDayLastWeek = DateHelpers.getLastDayOfWeek(lastWeek, true);

        return await this.exportNanniesApplicationsBase(
            true,
            firstDayLastWeek,
            lastDayLastWeek,
        );
    }

    async exportNanniesApplications() {
        return await this.exportNanniesApplicationsBase(false, null, null);
    }
}
