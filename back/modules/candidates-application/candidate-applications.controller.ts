import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Ip,
    NotFoundException,
    Param,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from 'linqts';
import { DateHelpers, MainHelpers } from 'nextalys-js-helpers';
import { CommonFileHelpers } from 'nextalys-js-helpers/dist/common-file-helpers';
import { FileHelpers } from 'nextalys-node-helpers';
import { ImageHelpers } from 'nextalys-node-helpers/dist/image-helpers';
import {
    FindConditions,
    FindManyOptions,
    getManager,
    In,
    Like,
    Not,
    Raw,
    Repository,
} from 'typeorm';
import { SharedCandidatesHelpers } from '../../../shared/candidates-helpers';
import {
    ApplyStatus,
    CandidateApplicationFileType,
    CustomSocketEventType,
    defaultAppLanguage,
    RolesList,
} from '../../../shared/shared-constants';
import { SharedService } from '../../../shared/shared-service';
import { Address } from '../../entities/address.entity';
import { Environment } from '../../environment/environment';
import { AppErrorWithMessage } from '../../models/app-error';
import { AppFileDto } from '../../models/dto/app-file-dto';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { GenericResponse } from '../../models/responses/generic-response';
import { AuthToolsService } from '../../services/auth-tools.service';
import {
    CountryService,
    IpAllowedResponse,
} from '../../services/country-service';
import { RolesGuard } from '../../services/guards/roles-guard';
import { Roles } from '../../services/roles.decorator';
import { FileService } from '../../services/tools/file.service';
import { MailService } from '../../services/tools/mail.service';
import { TranslationService } from '../../services/translation.service';
import { BaseController } from '../../shared/base.controller';
import {
    AppMailType,
    JobOfferMailData,
    MailContent,
} from '../../shared/mail-content';
import { SocketGateway } from '../../sockets/socket-gateway';
import { CandidateApplicationJobs } from '../candidate-application-jobs/candidates-application-jobs.entity';
import { CandidateService } from '../candidates/candidates.service';
import { GCloudStorageService } from '../gdrive/gcloud-storage-service';
import {
    GetJobOfferRequest,
    GetJobOffersResponse,
} from '../job-offers/job-offer-dto';
import { JobOffer } from '../job-offers/job-offer.entity';
import { JobOfferService } from '../job-offers/job-offers.service';
import {
    ApplyToJobOffersRequest,
    CandidateApplicationDto,
    GetCandidateApplicationResponse,
    GetCandidateApplicationsRequest,
    GetCandidateApplicationsResponse,
    GuidExchangeResponse,
    RefuseCandidateApplicationRequest,
    SetCandidateApplicationUnseenRequest,
    SubmitCandidateApplicationFormRequest,
    UnSeenCandidateApplicationResponse,
    ValidateCandidateApplicationRequest,
} from './candidate-application-dto';
import { CandidateApplication } from './candidate-application.entity';
import { CandidateApplicationService } from './candidate-applications.service';
@Controller('candidate-applications')
@ApiTags('candidate-applications')
export class CandidateApplicationsController extends BaseController {
    constructor(
        private readonly candidateApplicationService: CandidateApplicationService,
        private readonly mailService: MailService,
        public readonly jobOfferService: JobOfferService,
        private fileService: FileService,
        private socketGateway: SocketGateway,
        private candidateService: CandidateService,
        private authToolsService: AuthToolsService,
        private gCloudStorageService: GCloudStorageService,
        @InjectRepository(CandidateApplicationJobs)
        private readonly candidateApplicationJobsRepository: Repository<CandidateApplicationJobs>,
    ) {
        super();
    }

    private async setCandidateApplicationFilters(
        findOptions: FindManyOptions<CandidateApplication>,
        request: GetCandidateApplicationsRequest,
    ) {
        const candidateApplicationsFiltersForId: string[] = [];

        const payload = this.authToolsService.getCurrentPayload(false);

        if (!payload) {
            throw new AppErrorWithMessage('Invalid input');
        }

        // findOptions.relations = ['candidate'];
        if (!findOptions.where) {
            findOptions.where = [{}];
        }

        if (request.search) {
            const searchTerm = request.search.trim();
            const searchParts = searchTerm
                .split(/\s+/)
                .filter((part) => part.length > 0);

            if (searchParts.length >= 2) {
                const firstPart = searchParts[0];
                const secondPart = searchParts.slice(1).join(' ');

                findOptions.where = [
                    { firstName: Like('%' + searchTerm + '%') },
                    { lastName: Like('%' + searchTerm + '%') },
                    { email: Like('%' + searchTerm + '%') },
                    {
                        firstName: Like('%' + firstPart + '%'),
                        lastName: Like('%' + secondPart + '%'),
                    },
                    {
                        lastName: Like('%' + firstPart + '%'),
                        firstName: Like('%' + secondPart + '%'),
                    },
                ];
            } else {
                findOptions.where = [
                    { firstName: Like('%' + searchTerm + '%') },
                    { lastName: Like('%' + searchTerm + '%') },
                    { email: Like('%' + searchTerm + '%') },
                ];
            }
        }

        if (!request.disabled) {
            request.disabled = 'false';
        }

        if (request.applyStatus) {
            const statusIds = request.applyStatus.split(',');

            if (statusIds?.length) {
                for (const whereFilter of findOptions.where as FindConditions<CandidateApplication>[]) {
                    whereFilter.applyStatusId = In(statusIds);
                }
            }
        }

        if (request.excludePlaced === 'true') {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            for (const whereFilter of findOptions.where as FindConditions<CandidateApplication>[]) {
                whereFilter.applyStatusId = Not(
                    'd5b37bf7-4dda-4e1d-bcb2-54e0782dda33',
                );
            }
        }

        if (request.jobCategory) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            const jobCategoryIds = request.jobCategory.split(',');

            if (jobCategoryIds.length) {
                for (const whereFilter of findOptions.where as FindConditions<CandidateApplication>[]) {
                    whereFilter.professionId = In(jobCategoryIds);
                }
            }
        }

        if (request.jobOfferRef) {
            const jobOffersMatchingRef =
                await this.jobOfferService.repository.find({
                    where: { ref: Like('%' + request.jobOfferRef + '%') },
                    select: ['id'],
                });
            const jobOffersMatchingRefIds = jobOffersMatchingRef.map(
                (x) => x.id,
            );

            const candidateApplicationJobsTableName =
                getManager().getRepository(CandidateApplicationJobs).metadata
                    .tableName;
            candidateApplicationsFiltersForId.push(
                `([nxsAliasCandidateApplication] IN (SELECT candidateApplicationId FROM \`${candidateApplicationJobsTableName}\` WHERE jobOfferId IN("${jobOffersMatchingRefIds.join(
                    '","',
                )}") ))`,
            );
        }

        if (request.jobOfferId) {
            const candidateApplicationJobsTableName =
                getManager().getRepository(CandidateApplicationJobs).metadata
                    .tableName;
            candidateApplicationsFiltersForId.push(
                `([nxsAliasCandidateApplication] IN (SELECT candidateApplicationId FROM \`${candidateApplicationJobsTableName}\` WHERE jobOfferId="${request.jobOfferId}" ))`,
            );
        }

        // if (SharedService.userHasRole(payload, RolesList.Consultant) && !SharedService.userHasOneOfRoles(payload, [RolesList.Admin, RolesList.AdminTech])) {
        //     const candidateApplicationJobsTableName = getManager().getRepository(CandidateApplicationJobs).metadata.tableName;
        //     const jobOffersTableName = getManager().getRepository(JobOffer).metadata.tableName;
        //     candidateApplicationsFiltersForId.push(`([nxsAliasCandidateApplication] IN (SELECT candidateApplicationId FROM \`${candidateApplicationJobsTableName}\` WHERE jobOfferId
        //         IN(SELECT id FROM \`${jobOffersTableName}\` WHERE consultantId = '${payload.id}')))`);
        // }

        // Filter the candidate status which is inside the candidate object
        // Note: candidateStatus and onlyNewCandidate are mutually exclusive
        // onlyNewCandidate filters for candidateId IS NULL, while candidateStatus requires candidateId
        if (request.candidateStatus && request.onlyNewCandidate !== 'true') {
            const candidateStatusIds = request.candidateStatus.split(',');
            if (candidateStatusIds.length) {
                const candidateTableName =
                    getManager().getRepository('Candidate').metadata.tableName;
                candidateApplicationsFiltersForId.push(
                    `([nxsAliasCandidateApplication] IN (SELECT id FROM \`${
                        this.candidateApplicationService.getRepository()
                            .metadata.tableName
                    }\` WHERE candidateId IN (SELECT id FROM \`${candidateTableName}\` WHERE candidateStatusId IN("${candidateStatusIds.join(
                        '","',
                    )}"))))`,
                );
            }
        }

        if (request.applyInCouple) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            if (request.applyInCouple === 'true') {
                for (const whereFilter of findOptions.where as FindConditions<CandidateApplication>[]) {
                    whereFilter.inCouple = true;
                }
            } else if (request.applyInCouple === 'false') {
                for (const whereFilter of findOptions.where as FindConditions<CandidateApplication>[]) {
                    whereFilter.inCouple = false;
                }
            }
        }

        if (request.candidateId) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            findOptions.where = [
                {
                    candidateId: request.candidateId,
                },
            ];
        }

        for (const whereFilter of findOptions.where as FindConditions<CandidateApplication>[]) {
            whereFilter.disabled = request.disabled === 'true';
        }

        if (request.includeDisabled === 'true') {
            for (const whereFilter of findOptions.where as FindConditions<CandidateApplication>[]) {
                delete whereFilter.disabled;
            }
        }

        if (request.showOnlyUnSeen) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            if (request.showOnlyUnSeen === 'true') {
                for (const whereFilter of findOptions.where as FindConditions<CandidateApplication>[]) {
                    whereFilter.seen = false;
                }
            }
        }

        if (request.spontaneousApplication === 'true') {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            for (const whereFilter of findOptions.where as FindConditions<CandidateApplication>[]) {
                whereFilter.spontaneousApplication = true;
            }
        }

        if (request.hideSpontaneousApplications === 'true') {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            for (const whereFilter of findOptions.where as FindConditions<CandidateApplication>[]) {
                whereFilter.spontaneousApplication = false;
            }
        }

        if (request.onlyNewCandidate === 'true') {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            for (const whereFilter of findOptions.where as FindConditions<CandidateApplication>[]) {
                whereFilter.candidateId = Raw((alias) => `${alias} IS NULL`);
            }
        }

        if (request.consultantIds) {
            const consultantIds = MainHelpers.replaceAll(
                request.consultantIds,
                ',',
                "','",
            );
            const candidateApplicationJobsTableName =
                getManager().getRepository(CandidateApplicationJobs).metadata
                    .tableName;
            const jobOffersTableName =
                getManager().getRepository(JobOffer).metadata.tableName;
            const candidateApplicationTableName =
                getManager().getRepository(CandidateApplication).metadata
                    .tableName;
            candidateApplicationsFiltersForId.push(`(
                [nxsAliasCandidateApplication] IN (SELECT candidateApplicationId FROM \`${candidateApplicationJobsTableName}\` WHERE jobOfferId
                    IN(SELECT id FROM \`${jobOffersTableName}\` WHERE consultantId IN('${consultantIds}')))
                OR [nxsAliasCandidateApplication] IN (SELECT id FROM \`${candidateApplicationTableName}\` WHERE spontaneousApplication = 1)
            )`);
        }

        // Location filters - filter by address (city, country, department)
        if (request.city || request.locations || request.department) {
            const addressTableName =
                getManager().getRepository(Address).metadata.tableName;
            const locationConditions: string[] = [];

            if (request.city) {
                const cities = request.city
                    .split(',')
                    .map((c) => c.trim())
                    .filter((c) => c);
                if (cities.length) {
                    const citiesEscaped = cities
                        .map((c) => MainHelpers.replaceAll(c, "'", "\\'"))
                        .join("','");
                    locationConditions.push(`city IN('${citiesEscaped}')`);
                }
            }

            if (request.locations) {
                const countries = request.locations.split(',').filter((c) => c);
                if (countries.length) {
                    locationConditions.push(
                        `country IN('${countries.join("','")}')`,
                    );
                }
            }

            if (request.department) {
                const departmentEscaped = MainHelpers.replaceAll(
                    request.department,
                    "'",
                    "\\'",
                );
                locationConditions.push(
                    `department LIKE '%${departmentEscaped}%'`,
                );
            }

            if (locationConditions.length) {
                const locationQuery = locationConditions.join(' AND ');
                candidateApplicationsFiltersForId.push(
                    `([nxsAliasCandidateApplication] IN (SELECT candidateApplicationId FROM \`${addressTableName}\` WHERE ${locationQuery}))`,
                );
            }
        }

        if (candidateApplicationsFiltersForId?.length) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            for (const whereFilter of findOptions.where as FindConditions<CandidateApplication>[]) {
                whereFilter.id = Raw((alias) => {
                    const concatQuery =
                        '(' +
                        candidateApplicationsFiltersForId.join(') AND (') +
                        ')';
                    const finalQuery = MainHelpers.replaceAll(
                        concatQuery,
                        '[nxsAliasCandidateApplication]',
                        alias,
                    );
                    //  console.log("Log ~ file: candidates.service.ts ~ line 514 ~ CandidateService ~ whereFilter.id=Raw ~ finalQuery", finalQuery);

                    return finalQuery;
                });
            }
        }

        return true;
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Get()
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get all candidate applications',
        operationId: 'getAllCandidateApplications',
    })
    @ApiResponse({
        status: 200,
        description: 'Get all candidates applications',
        type: GetCandidateApplicationsResponse,
    })
    @HttpCode(200)
    async getAll(
        @Query() request: GetCandidateApplicationsRequest,
    ): Promise<GetCandidateApplicationsResponse> {
        const findOptions =
            BaseSearchRequest.getDefaultFindOptions<CandidateApplication>(
                request,
            );
        const doSearch = await this.setCandidateApplicationFilters(
            findOptions,
            request,
        );

        if (!doSearch) {
            const response = new GetCandidateApplicationsResponse();
            response.success = true;
            response.candidateApplications = [];
            return response;
        }

        const result = await this.candidateApplicationService.repository.find({
            where: findOptions.where,
            order: findOptions.order,
            take: findOptions.take,
            skip: findOptions.skip,
            relations: [
                'candidateApplicationJobs',
                'candidateApplicationJobs.jobOffer',
                'candidate',
                'candidate.candidateStatus',
                'photoFile',
                'profession',
                'profession.translations',
                'addresses',
                'applyStatus',
                'applyStatus.translations',
            ],
            select: [
                'id',
                'seen',
                'creationDate',
                'lastName',
                'firstName',
                'birthDate',
                'spontaneousApplication',
            ],
        });

        // const resultWithCandidateStatus = result.map((x) => {
        //     return {
        //         ...x,
        //         candidateStatus: x.candidate.candidateStatus,
        //     };
        // });

        // console.log(
        //     'resultWithCandidateStatus',
        //     resultWithCandidateStatus[0].candidate?.candidateStatus,
        // );

        const count = await this.candidateApplicationService.repository.count({
            where: findOptions.where,
        });

        return {
            candidateApplications: result.map((x) => x.toDto()),
            filteredResults: count,
            success: true,
            handleError: async () => {
                await Promise.resolve(console.log('error'));
            },
        } as GetCandidateApplicationsResponse;
    }

    private async downloadCandidateApplicationFileToBuffer(
        candidateApplication: CandidateApplicationDto,
        filePropertyName: 'mainResumeFile' | 'partnerResumeFile',
    ) {
        // console.log("Log ~ file: candidate-applications.controller.ts ~ line 165 ~ CandidateApplicationsController ~ downloadCandidateApplicationFileToBuffer ~ filePropertyName", filePropertyName);
        const fileObject: AppFileDto = candidateApplication[filePropertyName];
        // console.log("Log ~ file: candidate-applications.controller.ts ~ line 167 ~ CandidateApplicationsController ~ downloadCandidateApplicationFileToBuffer ~ fileObject", fileObject);

        if (fileObject) {
            try {
                let physicalFilePath: string;

                if (!fileObject.physicalName && fileObject.externalFilePath) {
                    let ext = 'txt';

                    if (fileObject.mimeType) {
                        ext = CommonFileHelpers.getFileExtensionFromMimeType(
                            fileObject.mimeType,
                        );
                    }

                    const downloadPhysicalFilePath = this.fileService.joinPaths(
                        Environment.UploadedFilesTempDirectory,
                        MainHelpers.generateGuid() + '.' + ext,
                    );
                    // console.log("Log ~ file: candidate-applications.controller.ts ~ line 177 ~ CandidateApplicationsController ~ downloadCandidateApplicationFileToBuffer ~ downloadPhysicalFilePath", downloadPhysicalFilePath);
                    const downloadResponse =
                        await this.gCloudStorageService.downloadFile(
                            fileObject.externalFilePath,
                            downloadPhysicalFilePath,
                        );
                    // console.log("Log ~ file: candidate-applications.controller.ts ~ line 179 ~ CandidateApplicationsController ~ downloadCandidateApplicationFileToBuffer ~ downloadResponse", downloadResponse);

                    if (downloadResponse.success) {
                        physicalFilePath = downloadPhysicalFilePath;
                    } else {
                        console.error(
                            'unable to download candidate application file !',
                        );
                    }
                } else if (!!fileObject.physicalName) {
                    physicalFilePath = this.fileService.joinPaths(
                        Environment.CandidateApplicationsDirectory,
                        candidateApplication.id,
                        fileObject.physicalName,
                    );
                }

                if (!physicalFilePath) {
                    return;
                }

                const buffer = (await FileHelpers.readFile(
                    physicalFilePath,
                    false,
                )) as Buffer;

                if (!!buffer) {
                    // console.log("Log ~ file: candidate-applications.controller.ts ~ line 193 ~ CandidateApplicationsController ~ downloadCandidateApplicationFileToBuffer ~ filePropertyName", filePropertyName);
                    switch (filePropertyName) {
                        case 'mainResumeFile':
                            candidateApplication.resumeFileBase64 =
                                buffer.toString('base64');
                            candidateApplication.resumeFileBase64MimeType =
                                fileObject.mimeType;
                            // console.log('set main resume buffer');
                            break;
                        case 'partnerResumeFile':
                            candidateApplication.partnerResumeFileBase64 =
                                buffer.toString('base64');
                            candidateApplication.partnerResumeFileBase64MimeType =
                                fileObject.mimeType;
                            // console.log('set partner resume buffer');
                            break;
                    }
                    // console.log("Log ~ file: candidate-applications.controller.ts ~ line 196 ~ CandidateApplicationsController ~ downloadCandidateApplicationFileToBuffer ~ candidateApplication", candidateApplication);
                } else {
                    console.log('buffer not ok');
                }
            } catch (error) {
                console.log('🚀 ~ error', error);
            }
        } else {
            return;
        }
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Get('get/:id')
    @ApiOperation({
        summary: 'Get candidate application',
        operationId: 'getCandidateApplication',
    })
    @ApiResponse({
        status: 200,
        description: 'Get candidate application',
        type: GetCandidateApplicationResponse,
    })
    @HttpCode(200)
    async get(
        @Param('id') id: string,
    ): Promise<GetCandidateApplicationResponse> {
        // console.log("Log ~ file: candidate-applications.controller.ts ~ line 225 ~ CandidateApplicationsController ~ get ~ id", id);
        const getOneResponse = await this.candidateApplicationService.findOne({
            where: { id: id },
            relations: ['profession', 'profession.translations'],
        });

        if (getOneResponse.success && getOneResponse?.candidateApplication) {
            const candidateApplication = getOneResponse.candidateApplication;
            await this.downloadCandidateApplicationFileToBuffer(
                candidateApplication,
                'mainResumeFile',
            );
            await this.downloadCandidateApplicationFileToBuffer(
                candidateApplication,
                'partnerResumeFile',
            );

            if (
                candidateApplication?.photoFile?.externalFilePath &&
                !candidateApplication.photoFile.physicalName
            ) {
                console.log('downloading photo file from gcloud');
                let ext = 'txt';

                if (candidateApplication.photoFile.mimeType) {
                    ext = CommonFileHelpers.getFileExtensionFromMimeType(
                        candidateApplication.photoFile.mimeType,
                    );
                }

                const photoPhysicalName =
                    MainHelpers.generateGuid() + '.' + ext;
                const publicFolder = this.fileService.joinPaths(
                    Environment.CandidateApplicationsPublicDirectory,
                    candidateApplication.id,
                );
                const filePath = this.fileService.joinPaths(
                    publicFolder,
                    photoPhysicalName,
                );
                const dlResponse = await this.gCloudStorageService.downloadFile(
                    candidateApplication.photoFile.externalFilePath,
                    filePath,
                );

                if (dlResponse.success) {
                    candidateApplication.photoFile.physicalName =
                        photoPhysicalName;
                    await this.candidateApplicationService.createOrUpdate(
                        candidateApplication,
                    );
                }
            }
        }

        return getOneResponse;
    }

    // @Recaptcha({ response: req => req.body.recaptchaToken, action: 'candidateApplicationFormSubmit', score: 0.5 })
    @Post()
    @ApiOperation({
        summary: 'Create or update candidate application',
        operationId: 'createOrUpdateCandidateApplication',
    })
    @ApiResponse({
        status: 200,
        description: 'Create or update candidate application',
        type: GetCandidateApplicationResponse,
    })
    @HttpCode(200)
    async createOrUpdate(
        @Body() request: SubmitCandidateApplicationFormRequest,
        // ,@RecaptchaResult() recaptchaResult?: RecaptchaVerificationResult
    ): Promise<GetCandidateApplicationResponse> {
        // console.log(`Action: ${recaptchaResult?.action} Score: ${recaptchaResult?.score}`);
        if (!request?.candidateApplication) {
            throw new AppErrorWithMessage('Invalid Request');
        }
        // if (recaptchaResult && !recaptchaResult.success) {
        //     throw new AppErrorWithMessage('Vous avez été bloqué par l\'outil de détection de robots de Google');
        // }

        const filesToHandle: {
            file: AppFileDto;
            name: CandidateApplicationFileType;
        }[] = [];

        if (request.candidateApplication.photoFile) {
            filesToHandle.push({
                file: request.candidateApplication.photoFile,
                name: 'photoFile',
            });
        }

        if (request.candidateApplication.mainResumeFile) {
            filesToHandle.push({
                file: request.candidateApplication.mainResumeFile,
                name: 'mainResumeFile',
            });
        }

        if (request.candidateApplication.partnerResumeFile) {
            filesToHandle.push({
                file: request.candidateApplication.partnerResumeFile,
                name: 'partnerResumeFile',
            });
        }

        request.candidateApplication.photoFile = undefined;
        request.candidateApplication.mainResumeFile = undefined;
        request.candidateApplication.partnerResumeFile = undefined;

        let candidateEmail = request.candidateApplication.email;

        if (candidateEmail) {
            candidateEmail = candidateEmail.trim().toLowerCase();
        }

        const jobOfferIds =
            request.candidateApplication.candidateApplicationJobs
                .map((x) => x?.jobOfferId)
                .filter((x) => !!x);

        if (candidateEmail && jobOfferIds?.length) {
            const candidateApplicationJobsExisting =
                await this.candidateApplicationJobsRepository.find({
                    where: {
                        // jobOfferId: request.candidateApplication.candidateApplicationJobs[0].jobOfferId,
                        jobOfferId: In(jobOfferIds),
                        candidateApplicationId: Raw(
                            (alias) =>
                                `(${alias} IN (SELECT id FROM ` +
                                '`' +
                                this.candidateApplicationService.getRepository()
                                    .metadata.tableName +
                                '` WHERE email = :email ))',
                            { email: candidateEmail },
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
                //TODO : mettre en commun avec candidateApplicationService.applyToJobOffers
                const jobOffersRefList = new List(
                    candidateApplicationJobsExisting.map((x) => x.jobOffer.ref),
                )
                    .Distinct()
                    .ToArray();
                const msgTranslated = await TranslationService.getTranslation(
                    this.authToolsService.getLanguageFromHeader(),
                    'CandidateApplication.AlreadyAppliedForApplications',
                );
                throw new AppErrorWithMessage(
                    msgTranslated +
                        ' <br/> - ' +
                        jobOffersRefList.join('<br/> - '),
                );
            }
        } else if (
            candidateEmail &&
            request.candidateApplication.spontaneousApplication
        ) {
            const lastApplicationResponse =
                await this.candidateApplicationService.findOne({
                    where: {
                        email: candidateEmail,
                        spontaneousApplication: true,
                    },
                    order: { creationDate: 'DESC' },
                });
            // console.log("Log ~ @RecaptchaResult ~ lastApplicationResponse:", lastApplicationResponse);

            if (lastApplicationResponse?.candidateApplication) {
                const lastApplication =
                    lastApplicationResponse.candidateApplication;
                const lastApplicationDate = lastApplication.creationDate;
                const currentDate = new Date();
                const diffDays = DateHelpers.daysDiff(
                    lastApplicationDate,
                    currentDate,
                );
                // console.log("Log ~ @RecaptchaResult ~ diffDays:", diffDays);
                if (diffDays <= 14) {
                    const msgTranslated =
                        await TranslationService.getTranslation(
                            this.authToolsService.getLanguageFromHeader(),
                            'CandidateApplication.AlreadyAppliedForSpontaneous',
                        );
                    throw new AppErrorWithMessage(msgTranslated);
                }
            }
        }

        let saveResponse =
            await this.candidateApplicationService.createOrUpdate(
                request.candidateApplication,
            );

        if (!saveResponse.success) {
            return saveResponse;
        }

        if (filesToHandle?.length) {
            const privateFolder = this.fileService.joinPaths(
                Environment.CandidateApplicationsDirectory,
                saveResponse.candidateApplication.id,
            );
            const publicFolder = this.fileService.joinPaths(
                Environment.CandidateApplicationsPublicDirectory,
                saveResponse.candidateApplication.id,
            );

            if (!(await FileHelpers.fileExists(privateFolder))) {
                await FileHelpers.createDirectory(privateFolder);
            }

            if (!(await FileHelpers.fileExists(publicFolder))) {
                await FileHelpers.createDirectory(publicFolder);
            }

            for (const fileWrapper of filesToHandle) {
                // console.log("Log ~ file: candidate-applications.controller.ts ~ line 184 ~ CandidateApplicationsController ~ createOrUpdate ~ fileWrapper", fileWrapper);
                if (!fileWrapper.file) {
                    continue;
                }

                const tempFilePath = this.fileService.joinPaths(
                    Environment.UploadedFilesTempDirectory,
                    fileWrapper.file.physicalName,
                );

                await this.candidateService.uploadCandidateFilesToGdrive(
                    saveResponse.candidateApplication,
                    tempFilePath,
                    fileWrapper.file,
                    null,
                    fileWrapper.name,
                    'candidate-applications',
                    true,
                );

                if (fileWrapper.name === 'photoFile') {
                    const filePath = this.fileService.joinPaths(
                        publicFolder,
                        fileWrapper.file.physicalName,
                    );
                    await ImageHelpers.resizeImage(
                        this.fileService.getTempFilePath(fileWrapper.file),
                        { width: 400 },
                        filePath,
                    );
                }

                if (
                    fileWrapper.name === 'mainResumeFile' ||
                    fileWrapper.name === 'partnerResumeFile'
                ) {
                    const filePath = this.fileService.joinPaths(
                        privateFolder,
                        fileWrapper.file.physicalName,
                    );
                    await FileHelpers.renameFile(
                        this.fileService.getTempFilePath(fileWrapper.file),
                        filePath,
                    );
                }
            }
        }
        // console.log("Log ~ file: candidate-applications.controller.ts ~ line 136 ~ CandidateApplicationsController ~ createOrUpdate ~   saveResponse.candidateApplication", saveResponse.candidateApplication.photoFile);
        saveResponse = await this.candidateApplicationService.createOrUpdate(
            saveResponse.candidateApplication,
        );

        if (saveResponse.success) {
            await this.socketGateway.sendEventToClient(
                CustomSocketEventType.RefreshUnseenCandidateApplications,
                {
                    data: {
                        id: saveResponse.candidateApplication.id,
                        type: 'new',
                    },
                },
            );
            const payload = this.authToolsService.getCurrentPayload(false);
            await this.candidateApplicationService.sendCandidateApplicationReceivedMail(
                saveResponse.candidateApplication,
                request,
                payload?.mail,
            );
        }

        return saveResponse;
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin, RolesList.AdminTech)
    @Delete(':ids')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Delete candidate applications',
        operationId: 'deleteCandidateApplications',
    })
    @ApiResponse({
        status: 200,
        description: 'Delete candidate applications',
        type: GenericResponse,
    })
    @HttpCode(200)
    async delete(@Param('ids') ids: string): Promise<GenericResponse> {
        return await this.candidateApplicationService.delete(ids.split(','));
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin, RolesList.AdminTech, RolesList.RH)
    @ApiBearerAuth()
    @Post('archiveCandidateApplication')
    @ApiOperation({
        summary: 'Archive candidate applications',
        operationId: 'archiveCandidateApplications',
    })
    @ApiResponse({
        status: 200,
        description: 'Archive candidate applications',
        type: GenericResponse,
    })
    @HttpCode(200)
    async archive(@Body() ids: string[]): Promise<GenericResponse> {
        return await this.candidateApplicationService.archive(ids);
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @ApiBearerAuth()
    @Post('validateAndCreateCandidate')
    @ApiOperation({
        summary: 'Validate candidate application and create candidate',
        operationId: 'validateCandidateApplication',
    })
    @ApiResponse({
        status: 200,
        description: 'Validate candidate application',
        type: GetCandidateApplicationResponse,
    })
    @HttpCode(200)
    async validateCandidateApplication(
        @Body() request: ValidateCandidateApplicationRequest,
    ): Promise<GetCandidateApplicationResponse> {
        if (!request.id) {
            throw new AppErrorWithMessage('Invalid Request');
        }

        const payload = this.authToolsService.getCurrentPayload(false);
        return await this.candidateApplicationService.changeCandidateApplicationStatusAndCreateCandidateIfNeeded(
            request.id,
            ApplyStatus.Validated,
            true,
            request.giveAtsAccess,
            request.candidateCurrentJobIds,
            request.genderId,
            payload?.mail,
            undefined,
            payload?.id,
        );
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @ApiBearerAuth()
    @Post('refuseAndCreateCandidate')
    @ApiOperation({
        summary: 'Refuse candidate application and create candidate',
        operationId: 'refuseCandidateApplication',
    })
    @ApiResponse({
        status: 200,
        description: 'Refuse candidate application',
        type: GetCandidateApplicationResponse,
    })
    @HttpCode(200)
    async refuseCandidateApplication(
        @Body() request: RefuseCandidateApplicationRequest,
    ): Promise<GetCandidateApplicationResponse> {
        // console.log("🚀 ~ file: candidate-applications.controller.ts ~ line 158 ~ CandidateApplicationsController ~ refuseCandidateApplication ~ request", request);
        if (!request.id) {
            throw new AppErrorWithMessage('Invalid Request');
        }

        const payload = this.authToolsService.getCurrentPayload(false);
        return await this.candidateApplicationService.changeCandidateApplicationStatusAndCreateCandidateIfNeeded(
            request.id,
            ApplyStatus.Refused,
            !!request.createCandidate,
            request.giveAtsAccess,
            request.candidateCurrentJobIds,
            request.genderId,
            payload?.mail,
            request.isPlatform,
        );
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @ApiBearerAuth()
    @Post('infos/setCandidateApplicationSeen/:id')
    @ApiOperation({
        summary: 'set candidate application as seen',
        operationId: 'setCandidateApplicationSeen',
    })
    @ApiResponse({
        status: 200,
        description: 'set candidate application seen',
        type: GenericResponse,
    })
    @HttpCode(200)
    async setCandidateApplicationSeen(
        @Param('id') id: string,
    ): Promise<GenericResponse> {
        const response = new GenericResponse();

        try {
            if (!id) {
                throw new AppErrorWithMessage('Error occured with id');
            }
            const candidateApplicationResponse =
                await this.candidateApplicationService.findOne({
                    where: { id: id },
                });

            if (!candidateApplicationResponse) {
                throw new NotFoundException();
            }

            if (
                candidateApplicationResponse.candidateApplication &&
                !candidateApplicationResponse.candidateApplication.seen
            ) {
                candidateApplicationResponse.candidateApplication.seen = true;
                await this.candidateApplicationService.createOrUpdate(
                    candidateApplicationResponse.candidateApplication,
                );
                await this.socketGateway.sendEventToClient(
                    CustomSocketEventType.RefreshUnseenCandidateApplications,
                    { data: { id: id, type: 'seen' } },
                );
            }

            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @ApiBearerAuth()
    @Get('infos/getUnSeenCandidateApplications')
    @ApiOperation({
        summary: 'get unseen candidate application number',
        operationId: 'getUnSeenCandidateApplications',
    })
    @ApiResponse({
        status: 200,
        description: 'get unseen candidate application',
        type: UnSeenCandidateApplicationResponse,
    })
    @HttpCode(200)
    async getUnSeenCandidateApplications(): Promise<UnSeenCandidateApplicationResponse> {
        const payload = this.authToolsService.getCurrentPayload(false);

        if (!payload) {
            throw new AppErrorWithMessage('Invalid input');
        }

        const where: FindConditions<CandidateApplication>[] = [{ seen: false }];

        const response = new UnSeenCandidateApplicationResponse();

        try {
            if (
                SharedService.userHasRole(payload, RolesList.Consultant) &&
                !SharedService.userHasOneOfRoles(payload, [
                    RolesList.Admin,
                    RolesList.AdminTech,
                    RolesList.RH,
                ])
            ) {
                const candidateApplicationJobsTableName =
                    getManager().getRepository(CandidateApplicationJobs)
                        .metadata.tableName;
                const jobOffersTableName =
                    getManager().getRepository(JobOffer).metadata.tableName;
                const candidateApplicationTableName =
                    getManager().getRepository(CandidateApplication).metadata
                        .tableName;

                for (const whereFilter of where) {
                    // Include applications linked to consultant's job offers OR spontaneous applications
                    whereFilter.id = Raw(
                        (
                            alias,
                        ) => `(${alias} IN (SELECT candidateApplicationId FROM \`${candidateApplicationJobsTableName}\` WHERE jobOfferId
                IN(SELECT id FROM \`${jobOffersTableName}\` WHERE consultantId = '${payload.id}'))
                OR ${alias} IN (SELECT id FROM \`${candidateApplicationTableName}\` WHERE spontaneousApplication = 1))`,
                    );
                }
            }

            response.unSeenCandidateApplication =
                await this.candidateApplicationService
                    .getRepository()
                    .count({ where });

            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @ApiBearerAuth()
    @Post('candidate/createOrUpdateRefCandidateApplication')
    @ApiOperation({
        summary: 'create candidate application from ref',
        operationId: 'createOrUpdateRefCandidateApplication',
    })
    @ApiResponse({
        status: 200,
        description: 'create candidate application from ref',
        type: GenericResponse,
    })
    @HttpCode(200)
    async createOrUpdateRefCandidateApplication(
        @Body() request: SubmitCandidateApplicationFormRequest,
    ): Promise<GenericResponse> {
        const response = new GenericResponse();

        try {
            console.log(request);
            if (!request || !request.candidateApplication) {
                throw new AppErrorWithMessage('Invalid request');
            }

            // const appTypeResponse = await this.referentialService.getTypeValues({ appTypeCode : AppTypes.CandidateStatusCode });
            // if(!appTypeResponse.success)
            //     throw new AppErrorWithMessage('Error when loading AppValues')

            const candidateResponse = await this.candidateService.findOne({
                where: { email: request.candidateApplication.email },
            });

            if (!candidateResponse.candidate) {
                throw new AppErrorWithMessage(
                    "Le candidat avec cet adresse email n'existe pas",
                );
            }

            console.log(candidateResponse);

            request.candidateApplication.candidateId =
                candidateResponse.candidate.id;

            const updateResponse = await this.createOrUpdate(request);

            // console.log(updateResponse)

            response.success = true;
        } catch (err) {
            response.handleError(err);
        }
        return response;
    }

    @ApiBearerAuth()
    @Get('getMyCandidateApplications')
    @ApiOperation({
        summary: 'Get candidate applications of the current user',
        operationId: 'getMyCandidateApplications',
    })
    @ApiResponse({
        status: 200,
        description: 'Get candidate applications of the current user',
        type: GetCandidateApplicationsResponse,
    })
    @HttpCode(200)
    async getMyCandidateApplications(
        @Query() request: GetCandidateApplicationsRequest,
    ): Promise<GetCandidateApplicationsResponse> {
        const payload = this.authToolsService.getCurrentPayload(false);

        if (!payload?.candidateId) {
            throw new AppErrorWithMessage(
                'Impossible de récupérer les informations',
            );
        }

        let response = new GetCandidateApplicationsResponse();

        try {
            request.candidateId = payload.candidateId;
            response = await this.getAll(request);

            if (!response.success) {
                throw new AppErrorWithMessage(
                    'error get all : ' + response.message,
                );
            }
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Candidate)
    @ApiBearerAuth()
    @Get('getMyCandidateApplicationDetail/:id')
    @ApiOperation({
        summary: 'Get candidate application detail of the current user',
        operationId: 'getMyCandidateApplicationDetail',
    })
    @ApiResponse({
        status: 200,
        description: 'Get candidate application detail of the current user',
        type: GetCandidateApplicationResponse,
    })
    @HttpCode(200)
    async getMyCandidateApplicationDetail(
        @Param('id') id: string,
    ): Promise<GetCandidateApplicationResponse> {
        const payload = this.authToolsService.getCurrentPayload(false);

        if (!payload?.candidateId) {
            throw new AppErrorWithMessage(
                'Impossible de récupérer les informations',
            );
        }

        let response = new GetCandidateApplicationResponse();

        try {
            response = await this.get(id);

            if (!response.success) {
                throw new AppErrorWithMessage(
                    'error get all : ' + response.message,
                );
            }

            if (
                response.candidateApplication.candidateId !==
                payload?.candidateId
            ) {
                throw new AppErrorWithMessage(
                    'Impossible de récupérer les informations',
                );
            }
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Candidate)
    @Post('applyToJobOffers')
    @ApiOperation({
        summary: 'applyToJobOffers',
        operationId: 'applyToJobOffers',
    })
    @ApiResponse({
        status: 200,
        description: 'applyToJobOffers',
        type: GetCandidateApplicationResponse,
    })
    @HttpCode(200)
    async applyToJobOffers(
        @Body() request: ApplyToJobOffersRequest,
    ): Promise<GetCandidateApplicationResponse> {
        const payload = this.authToolsService.getCurrentPayload(false);
        const applyResponse =
            await this.candidateApplicationService.applyToJobOffers(
                request,
                payload,
                this.authToolsService.getLanguageFromHeader(),
            );

        if (applyResponse.success) {
            await this.candidateApplicationService.sendCandidateApplicationReceivedMail(
                applyResponse.candidateApplication,
                {
                    language:
                        this.authToolsService?.getLanguageFromHeader() ||
                        defaultAppLanguage,
                },
                payload?.mail,
            );
        }

        return applyResponse;
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Post('linkCandidateApplicationToCandidateFromMail')
    @ApiOperation({
        summary: 'linkCandidateApplicationToCandidateFromMail',
        operationId: 'linkCandidateApplicationToCandidateFromMail',
    })
    @ApiResponse({
        status: 200,
        description: 'linkCandidateApplicationToCandidateFromMail',
        type: GetCandidateApplicationResponse,
    })
    @HttpCode(200)
    async linkCandidateApplicationToCandidateFromMail(
        @Query('id') id: string,
    ): Promise<GetCandidateApplicationResponse> {
        return await this.candidateApplicationService.linkCandidateApplicationToCandidateFromMail(
            id,
        );
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Post('generateGuidExchangeAndSendEmail/:id')
    @ApiOperation({
        summary: 'generateGuidExchangeAndSendEmail',
        operationId: 'generateGuidExchangeAndSendEmail',
    })
    @ApiResponse({
        status: 200,
        description: 'generateGuidExchangeAndSendEmail',
        type: GuidExchangeResponse,
    })
    @HttpCode(200)
    async generateGuidExchangeAndSendEmail(
        @Param('id') id: string,
    ): Promise<GuidExchangeResponse> {
        return await this.candidateApplicationService.generateGuidExchangeAndSendEmail(
            id,
        );
    }

    @Get('getCandidateApplicationFromGuid/:guid')
    @ApiOperation({
        summary: 'Get candidate application from guid',
        operationId: 'getCandidateApplicationFromGuid',
    })
    @ApiResponse({
        status: 200,
        description: 'Get candidate application from guid',
        type: GetCandidateApplicationResponse,
    })
    @HttpCode(200)
    async getCandidateApplicationFromGuid(
        @Param('guid') guid: string,
    ): Promise<GetCandidateApplicationResponse> {
        return await this.candidateApplicationService.findOne({
            where: { guidExchange: guid },
        });
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Post('sendPrivateExchangeLinkToCandidateApplication/:id')
    @ApiOperation({
        summary: 'sendPrivateExchangeLinkToCandidateApplication',
        operationId: 'sendPrivateExchangeLinkToCandidateApplication',
    })
    @ApiResponse({
        status: 200,
        description: 'generateGuidExchangeAndSendEmail',
        type: GenericResponse,
    })
    @HttpCode(200)
    async sendPrivateExchangeLinkToCandidateApplication(
        @Param('id') id: string,
    ): Promise<GenericResponse> {
        return await this.candidateApplicationService.sendPrivateExchangeLinkToCandidateApplication(
            id,
        );
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Post('setCandidateApplicationUnseen')
    @ApiOperation({
        summary: 'setCandidateApplicationUnseen',
        operationId: 'setCandidateApplicationUnseen',
    })
    @ApiResponse({
        status: 200,
        description: 'setCandidateApplicationUnseen',
        type: GenericResponse,
    })
    @HttpCode(200)
    async setCandidateApplicationUnseen(
        @Body() request: SetCandidateApplicationUnseenRequest,
    ): Promise<GenericResponse> {
        return await this.candidateApplicationService.setCandidateApplicationUnseen(
            request.candidateApplicationId,
        );
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @ApiBearerAuth()
    @Post('sendMailAfterCandidateApplicationRefused/:id')
    @ApiOperation({
        summary: 'sendMailAfterCandidateApplicationRefused',
        operationId: 'sendMailAfterCandidateApplicationRefused',
    })
    @ApiResponse({
        status: 200,
        description: 'sendMailAfterCandidateApplicationRefused',
        type: GenericResponse,
    })
    @HttpCode(200)
    async sendMailAfterCandidateApplicationRefused(
        @Query('type') type: string,
        @Param('id') id: string,
    ): Promise<GenericResponse> {
        let response = new GenericResponse();

        try {
            if (!type) {
                throw new AppErrorWithMessage('Invalid Request');
            }

            const findcaResponse =
                await this.candidateApplicationService.findOne({
                    where: { id: id },
                    relations: [
                        'candidateApplicationJobs',
                        'candidateApplicationJobs.jobOffer',
                    ],
                });

            if (!findcaResponse) {
                return findcaResponse;
            }

            let mailType: AppMailType = null;

            switch (type) {
                case 'CandidateApplicationRefusedCoupleFormation':
                    mailType = type;
                    break;
                case 'CandidateApplicationRefusedCandidatesPlatform':
                    mailType = type;
                    break;
                case 'CandidateApplicationRefusedCreateCandidate':
                    mailType = type;
                    break;
            }

            if (!mailType) {
                throw new AppErrorWithMessage('Invalid Request');
            }

            console.log('mailType => ', mailType);

            const mailSender =
                SharedCandidatesHelpers.getMailSenderFromCandidateApplication(
                    findcaResponse.candidateApplication,
                );
            const countryCode =
                findcaResponse.candidateApplication?.address?.country;

            // Extract job offer info from the first linked job offer (if any)
            let jobOfferData: JobOfferMailData | undefined;
            const firstJobOffer =
                findcaResponse.candidateApplication
                    ?.candidateApplicationJobs?.[0]?.jobOffer;
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

            response = await this.mailService.sendMailWithGenericTemplate({
                htmlBody: mailContentWrapper.content,
                subject: mailContentWrapper.subject,
                from: { address: mailSender },
                to: [{ address: findcaResponse.candidateApplication.email }],
            });
        } catch (error) {
            response.handleError(error);
        }

        return response;
    }

    @Post('isCountryAllowed')
    @ApiOperation({
        summary: 'isCountryAllowed',
        operationId: 'isCountryAllowed',
    })
    @ApiResponse({
        status: 200,
        description: 'isCountryAllowed',
        type: IpAllowedResponse,
    })
    @HttpCode(200)
    async isCountryAllowed(
        @Ip() ipAddress: string,
    ): Promise<IpAllowedResponse> {
        let response = new IpAllowedResponse();

        try {
            response = await CountryService.isIpAllowed(ipAddress);
        } catch (error) {
            response.handleError(error);
        }

        return response;
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Get('sendPositionFilledEmail')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Send position is filled email',
        operationId: 'sendPositionFilledEmail',
    })
    @ApiResponse({
        status: 200,
        description: 'Send position is filled email',
        type: GetCandidateApplicationsResponse,
    })
    @HttpCode(200)
    async sendPositionFilledEmail(
        @Query() request: GetCandidateApplicationsRequest,
    ): Promise<GetCandidateApplicationsResponse> {
        let response = new GetCandidateApplicationsResponse();

        try {
            const findOptions =
                BaseSearchRequest.getDefaultFindOptions<CandidateApplication>(
                    request,
                );

            const doSearch = await this.setCandidateApplicationFilters(
                findOptions,
                request,
            );

            if (!doSearch) {
                response = new GetCandidateApplicationsResponse();
                response.success = true;
                return response;
            }

            const candidateList =
                await this.candidateApplicationService.findAll(findOptions);

            candidateList.candidateApplications.forEach((data) => {
                // data.email

                let mailType: AppMailType = 'JobOfferPositionIsFilled';

                const mailSender = 'contact@morganmallet.agency';
                const countryCode = data?.address?.country;
                const mailContentWrapper = MailContent.getMailContentAndSubject(
                    mailType,
                    false,
                    null,
                    countryCode,
                );
                this.mailService.sendMailWithGenericTemplate({
                    htmlBody: mailContentWrapper.content,
                    subject: mailContentWrapper.subject,
                    from: { address: mailSender },
                    to: [{ address: data.email }],
                });
            });

            if (!response.success) {
                throw new AppErrorWithMessage(
                    'error get all : ' + response.message,
                );
            }
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    @Get('getAllRecruitmentActivities')
    @ApiOperation({
        summary: 'Get all Recruitment Activities',
        operationId: 'getAllRecruitmentActivities',
    })
    @ApiResponse({
        status: 200,
        description: 'Get All Recruitment Activities',
        type: GetJobOffersResponse,
    })
    @HttpCode(200)
    async getAllRecruitmentActivities(
        @Query() request: GetJobOfferRequest,
    ): Promise<GetJobOffersResponse> {
        const findOptions =
            BaseSearchRequest.getDefaultFindOptions<JobOffer>(request);

        if (request.status) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            if (request.status === 'true') {
                for (const whereFilter of findOptions.where as FindConditions<JobOffer>[]) {
                    whereFilter.disabled = false;
                }
            } else if (request.status === 'false') {
                for (const whereFilter of findOptions.where as FindConditions<JobOffer>[]) {
                    whereFilter.disabled = true;
                }
            }
        }

        if (request.consultantIds) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            const consultantIds = request.consultantIds.split(',');

            for (const whereFilter of findOptions.where as FindConditions<JobOffer>[]) {
                whereFilter.consultantId = In(consultantIds);
            }
        }

        const result = await this.jobOfferService.findAll(findOptions);

        for (const data of result.jobOffers) {
            const applicationRequest = new GetCandidateApplicationsRequest();
            applicationRequest.jobOfferId = data.id;

            const findOptionsCandidateApplication =
                BaseSearchRequest.getDefaultFindOptions<CandidateApplication>(
                    applicationRequest,
                );

            const doSearch = await this.setCandidateApplicationFilters(
                findOptionsCandidateApplication,
                applicationRequest,
            );

            const x = await this.candidateApplicationService.findAll(
                findOptionsCandidateApplication,
            );
            data.candidateApplications = x.candidateApplications;
        }

        return result;
    }
}
