"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateApplicationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("@nestjs/typeorm");
const linqts_1 = require("linqts");
const nextalys_js_helpers_1 = require("nextalys-js-helpers");
const common_file_helpers_1 = require("nextalys-js-helpers/dist/common-file-helpers");
const nextalys_node_helpers_1 = require("nextalys-node-helpers");
const image_helpers_1 = require("nextalys-node-helpers/dist/image-helpers");
const typeorm_2 = require("typeorm");
const candidates_helpers_1 = require("../../../shared/candidates-helpers");
const shared_constants_1 = require("../../../shared/shared-constants");
const shared_service_1 = require("../../../shared/shared-service");
const address_entity_1 = require("../../entities/address.entity");
const environment_1 = require("../../environment/environment");
const app_error_1 = require("../../models/app-error");
const base_search_requests_1 = require("../../models/requests/base-search-requests");
const generic_response_1 = require("../../models/responses/generic-response");
const auth_tools_service_1 = require("../../services/auth-tools.service");
const country_service_1 = require("../../services/country-service");
const roles_guard_1 = require("../../services/guards/roles-guard");
const roles_decorator_1 = require("../../services/roles.decorator");
const file_service_1 = require("../../services/tools/file.service");
const mail_service_1 = require("../../services/tools/mail.service");
const translation_service_1 = require("../../services/translation.service");
const base_controller_1 = require("../../shared/base.controller");
const mail_content_1 = require("../../shared/mail-content");
const socket_gateway_1 = require("../../sockets/socket-gateway");
const candidates_application_jobs_entity_1 = require("../candidate-application-jobs/candidates-application-jobs.entity");
const candidates_service_1 = require("../candidates/candidates.service");
const gcloud_storage_service_1 = require("../gdrive/gcloud-storage-service");
const job_offer_dto_1 = require("../job-offers/job-offer-dto");
const job_offer_entity_1 = require("../job-offers/job-offer.entity");
const job_offers_service_1 = require("../job-offers/job-offers.service");
const candidate_application_dto_1 = require("./candidate-application-dto");
const candidate_application_entity_1 = require("./candidate-application.entity");
const candidate_applications_service_1 = require("./candidate-applications.service");
let CandidateApplicationsController = class CandidateApplicationsController extends base_controller_1.BaseController {
    constructor(candidateApplicationService, mailService, jobOfferService, fileService, socketGateway, candidateService, authToolsService, gCloudStorageService, candidateApplicationJobsRepository) {
        super();
        this.candidateApplicationService = candidateApplicationService;
        this.mailService = mailService;
        this.jobOfferService = jobOfferService;
        this.fileService = fileService;
        this.socketGateway = socketGateway;
        this.candidateService = candidateService;
        this.authToolsService = authToolsService;
        this.gCloudStorageService = gCloudStorageService;
        this.candidateApplicationJobsRepository = candidateApplicationJobsRepository;
    }
    setCandidateApplicationFilters(findOptions, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidateApplicationsFiltersForId = [];
            const payload = this.authToolsService.getCurrentPayload(false);
            if (!payload) {
                throw new app_error_1.AppErrorWithMessage('Invalid input');
            }
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
                        { firstName: (0, typeorm_2.Like)('%' + searchTerm + '%') },
                        { lastName: (0, typeorm_2.Like)('%' + searchTerm + '%') },
                        { email: (0, typeorm_2.Like)('%' + searchTerm + '%') },
                        {
                            firstName: (0, typeorm_2.Like)('%' + firstPart + '%'),
                            lastName: (0, typeorm_2.Like)('%' + secondPart + '%'),
                        },
                        {
                            lastName: (0, typeorm_2.Like)('%' + firstPart + '%'),
                            firstName: (0, typeorm_2.Like)('%' + secondPart + '%'),
                        },
                    ];
                }
                else {
                    findOptions.where = [
                        { firstName: (0, typeorm_2.Like)('%' + searchTerm + '%') },
                        { lastName: (0, typeorm_2.Like)('%' + searchTerm + '%') },
                        { email: (0, typeorm_2.Like)('%' + searchTerm + '%') },
                    ];
                }
            }
            if (!request.disabled) {
                request.disabled = 'false';
            }
            if (request.applyStatus) {
                const statusIds = request.applyStatus.split(',');
                if (statusIds === null || statusIds === void 0 ? void 0 : statusIds.length) {
                    for (const whereFilter of findOptions.where) {
                        whereFilter.applyStatusId = (0, typeorm_2.In)(statusIds);
                    }
                }
            }
            if (request.excludePlaced === 'true') {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                for (const whereFilter of findOptions.where) {
                    whereFilter.applyStatusId = (0, typeorm_2.Not)('d5b37bf7-4dda-4e1d-bcb2-54e0782dda33');
                }
            }
            if (request.jobCategory) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                const jobCategoryIds = request.jobCategory.split(',');
                if (jobCategoryIds.length) {
                    for (const whereFilter of findOptions.where) {
                        whereFilter.professionId = (0, typeorm_2.In)(jobCategoryIds);
                    }
                }
            }
            if (request.jobOfferRef) {
                const jobOffersMatchingRef = yield this.jobOfferService.repository.find({
                    where: { ref: (0, typeorm_2.Like)('%' + request.jobOfferRef + '%') },
                    select: ['id'],
                });
                const jobOffersMatchingRefIds = jobOffersMatchingRef.map((x) => x.id);
                const candidateApplicationJobsTableName = (0, typeorm_2.getManager)().getRepository(candidates_application_jobs_entity_1.CandidateApplicationJobs).metadata
                    .tableName;
                candidateApplicationsFiltersForId.push(`([nxsAliasCandidateApplication] IN (SELECT candidateApplicationId FROM \`${candidateApplicationJobsTableName}\` WHERE jobOfferId IN("${jobOffersMatchingRefIds.join('","')}") ))`);
            }
            if (request.jobOfferId) {
                const candidateApplicationJobsTableName = (0, typeorm_2.getManager)().getRepository(candidates_application_jobs_entity_1.CandidateApplicationJobs).metadata
                    .tableName;
                candidateApplicationsFiltersForId.push(`([nxsAliasCandidateApplication] IN (SELECT candidateApplicationId FROM \`${candidateApplicationJobsTableName}\` WHERE jobOfferId="${request.jobOfferId}" ))`);
            }
            if (request.candidateStatus && request.onlyNewCandidate !== 'true') {
                const candidateStatusIds = request.candidateStatus.split(',');
                if (candidateStatusIds.length) {
                    const candidateTableName = (0, typeorm_2.getManager)().getRepository('Candidate').metadata.tableName;
                    candidateApplicationsFiltersForId.push(`([nxsAliasCandidateApplication] IN (SELECT id FROM \`${this.candidateApplicationService.getRepository()
                        .metadata.tableName}\` WHERE candidateId IN (SELECT id FROM \`${candidateTableName}\` WHERE candidateStatusId IN("${candidateStatusIds.join('","')}"))))`);
                }
            }
            if (request.applyInCouple) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                if (request.applyInCouple === 'true') {
                    for (const whereFilter of findOptions.where) {
                        whereFilter.inCouple = true;
                    }
                }
                else if (request.applyInCouple === 'false') {
                    for (const whereFilter of findOptions.where) {
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
            for (const whereFilter of findOptions.where) {
                whereFilter.disabled = request.disabled === 'true';
            }
            if (request.includeDisabled === 'true') {
                for (const whereFilter of findOptions.where) {
                    delete whereFilter.disabled;
                }
            }
            if (request.showOnlyUnSeen) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                if (request.showOnlyUnSeen === 'true') {
                    for (const whereFilter of findOptions.where) {
                        whereFilter.seen = false;
                    }
                }
            }
            if (request.spontaneousApplication === 'true') {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                for (const whereFilter of findOptions.where) {
                    whereFilter.spontaneousApplication = true;
                }
            }
            if (request.hideSpontaneousApplications === 'true') {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                for (const whereFilter of findOptions.where) {
                    whereFilter.spontaneousApplication = false;
                }
            }
            if (request.onlyNewCandidate === 'true') {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                for (const whereFilter of findOptions.where) {
                    whereFilter.candidateId = (0, typeorm_2.Raw)((alias) => `${alias} IS NULL`);
                }
            }
            if (request.consultantIds) {
                const consultantIds = nextalys_js_helpers_1.MainHelpers.replaceAll(request.consultantIds, ',', "','");
                const candidateApplicationJobsTableName = (0, typeorm_2.getManager)().getRepository(candidates_application_jobs_entity_1.CandidateApplicationJobs).metadata
                    .tableName;
                const jobOffersTableName = (0, typeorm_2.getManager)().getRepository(job_offer_entity_1.JobOffer).metadata.tableName;
                const candidateApplicationTableName = (0, typeorm_2.getManager)().getRepository(candidate_application_entity_1.CandidateApplication).metadata
                    .tableName;
                candidateApplicationsFiltersForId.push(`(
                [nxsAliasCandidateApplication] IN (SELECT candidateApplicationId FROM \`${candidateApplicationJobsTableName}\` WHERE jobOfferId
                    IN(SELECT id FROM \`${jobOffersTableName}\` WHERE consultantId IN('${consultantIds}')))
                OR [nxsAliasCandidateApplication] IN (SELECT id FROM \`${candidateApplicationTableName}\` WHERE spontaneousApplication = 1)
            )`);
            }
            if (request.city || request.locations || request.department) {
                const addressTableName = (0, typeorm_2.getManager)().getRepository(address_entity_1.Address).metadata.tableName;
                const locationConditions = [];
                if (request.city) {
                    const cities = request.city
                        .split(',')
                        .map((c) => c.trim())
                        .filter((c) => c);
                    if (cities.length) {
                        const citiesEscaped = cities
                            .map((c) => nextalys_js_helpers_1.MainHelpers.replaceAll(c, "'", "\\'"))
                            .join("','");
                        locationConditions.push(`city IN('${citiesEscaped}')`);
                    }
                }
                if (request.locations) {
                    const countries = request.locations.split(',').filter((c) => c);
                    if (countries.length) {
                        locationConditions.push(`country IN('${countries.join("','")}')`);
                    }
                }
                if (request.department) {
                    const departmentEscaped = nextalys_js_helpers_1.MainHelpers.replaceAll(request.department, "'", "\\'");
                    locationConditions.push(`department LIKE '%${departmentEscaped}%'`);
                }
                if (locationConditions.length) {
                    const locationQuery = locationConditions.join(' AND ');
                    candidateApplicationsFiltersForId.push(`([nxsAliasCandidateApplication] IN (SELECT candidateApplicationId FROM \`${addressTableName}\` WHERE ${locationQuery}))`);
                }
            }
            if (candidateApplicationsFiltersForId === null || candidateApplicationsFiltersForId === void 0 ? void 0 : candidateApplicationsFiltersForId.length) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                for (const whereFilter of findOptions.where) {
                    whereFilter.id = (0, typeorm_2.Raw)((alias) => {
                        const concatQuery = '(' +
                            candidateApplicationsFiltersForId.join(') AND (') +
                            ')';
                        const finalQuery = nextalys_js_helpers_1.MainHelpers.replaceAll(concatQuery, '[nxsAliasCandidateApplication]', alias);
                        return finalQuery;
                    });
                }
            }
            return true;
        });
    }
    getAll(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOptions = base_search_requests_1.BaseSearchRequest.getDefaultFindOptions(request);
            const doSearch = yield this.setCandidateApplicationFilters(findOptions, request);
            if (!doSearch) {
                const response = new candidate_application_dto_1.GetCandidateApplicationsResponse();
                response.success = true;
                response.candidateApplications = [];
                return response;
            }
            const result = yield this.candidateApplicationService.repository.find({
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
            const count = yield this.candidateApplicationService.repository.count({
                where: findOptions.where,
            });
            return {
                candidateApplications: result.map((x) => x.toDto()),
                filteredResults: count,
                success: true,
                handleError: () => __awaiter(this, void 0, void 0, function* () {
                    yield Promise.resolve(console.log('error'));
                }),
            };
        });
    }
    downloadCandidateApplicationFileToBuffer(candidateApplication, filePropertyName) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileObject = candidateApplication[filePropertyName];
            if (fileObject) {
                try {
                    let physicalFilePath;
                    if (!fileObject.physicalName && fileObject.externalFilePath) {
                        let ext = 'txt';
                        if (fileObject.mimeType) {
                            ext = common_file_helpers_1.CommonFileHelpers.getFileExtensionFromMimeType(fileObject.mimeType);
                        }
                        const downloadPhysicalFilePath = this.fileService.joinPaths(environment_1.Environment.UploadedFilesTempDirectory, nextalys_js_helpers_1.MainHelpers.generateGuid() + '.' + ext);
                        const downloadResponse = yield this.gCloudStorageService.downloadFile(fileObject.externalFilePath, downloadPhysicalFilePath);
                        if (downloadResponse.success) {
                            physicalFilePath = downloadPhysicalFilePath;
                        }
                        else {
                            console.error('unable to download candidate application file !');
                        }
                    }
                    else if (!!fileObject.physicalName) {
                        physicalFilePath = this.fileService.joinPaths(environment_1.Environment.CandidateApplicationsDirectory, candidateApplication.id, fileObject.physicalName);
                    }
                    if (!physicalFilePath) {
                        return;
                    }
                    const buffer = (yield nextalys_node_helpers_1.FileHelpers.readFile(physicalFilePath, false));
                    if (!!buffer) {
                        switch (filePropertyName) {
                            case 'mainResumeFile':
                                candidateApplication.resumeFileBase64 =
                                    buffer.toString('base64');
                                candidateApplication.resumeFileBase64MimeType =
                                    fileObject.mimeType;
                                break;
                            case 'partnerResumeFile':
                                candidateApplication.partnerResumeFileBase64 =
                                    buffer.toString('base64');
                                candidateApplication.partnerResumeFileBase64MimeType =
                                    fileObject.mimeType;
                                break;
                        }
                    }
                    else {
                        console.log('buffer not ok');
                    }
                }
                catch (error) {
                    console.log('🚀 ~ error', error);
                }
            }
            else {
                return;
            }
        });
    }
    get(id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const getOneResponse = yield this.candidateApplicationService.findOne({
                where: { id: id },
                relations: ['profession', 'profession.translations'],
            });
            if (getOneResponse.success && (getOneResponse === null || getOneResponse === void 0 ? void 0 : getOneResponse.candidateApplication)) {
                const candidateApplication = getOneResponse.candidateApplication;
                yield this.downloadCandidateApplicationFileToBuffer(candidateApplication, 'mainResumeFile');
                yield this.downloadCandidateApplicationFileToBuffer(candidateApplication, 'partnerResumeFile');
                if (((_a = candidateApplication === null || candidateApplication === void 0 ? void 0 : candidateApplication.photoFile) === null || _a === void 0 ? void 0 : _a.externalFilePath) &&
                    !candidateApplication.photoFile.physicalName) {
                    console.log('downloading photo file from gcloud');
                    let ext = 'txt';
                    if (candidateApplication.photoFile.mimeType) {
                        ext = common_file_helpers_1.CommonFileHelpers.getFileExtensionFromMimeType(candidateApplication.photoFile.mimeType);
                    }
                    const photoPhysicalName = nextalys_js_helpers_1.MainHelpers.generateGuid() + '.' + ext;
                    const publicFolder = this.fileService.joinPaths(environment_1.Environment.CandidateApplicationsPublicDirectory, candidateApplication.id);
                    const filePath = this.fileService.joinPaths(publicFolder, photoPhysicalName);
                    const dlResponse = yield this.gCloudStorageService.downloadFile(candidateApplication.photoFile.externalFilePath, filePath);
                    if (dlResponse.success) {
                        candidateApplication.photoFile.physicalName =
                            photoPhysicalName;
                        yield this.candidateApplicationService.createOrUpdate(candidateApplication);
                    }
                }
            }
            return getOneResponse;
        });
    }
    createOrUpdate(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(request === null || request === void 0 ? void 0 : request.candidateApplication)) {
                throw new app_error_1.AppErrorWithMessage('Invalid Request');
            }
            const filesToHandle = [];
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
            const jobOfferIds = request.candidateApplication.candidateApplicationJobs
                .map((x) => x === null || x === void 0 ? void 0 : x.jobOfferId)
                .filter((x) => !!x);
            if (candidateEmail && (jobOfferIds === null || jobOfferIds === void 0 ? void 0 : jobOfferIds.length)) {
                const candidateApplicationJobsExisting = yield this.candidateApplicationJobsRepository.find({
                    where: {
                        jobOfferId: (0, typeorm_2.In)(jobOfferIds),
                        candidateApplicationId: (0, typeorm_2.Raw)((alias) => `(${alias} IN (SELECT id FROM ` +
                            '`' +
                            this.candidateApplicationService.getRepository()
                                .metadata.tableName +
                            '` WHERE email = :email ))', { email: candidateEmail }),
                    },
                    relations: ['candidateApplication', 'jobOffer'],
                });
                if (candidateApplicationJobsExisting === null || candidateApplicationJobsExisting === void 0 ? void 0 : candidateApplicationJobsExisting.length) {
                    const jobOffersRefList = new linqts_1.List(candidateApplicationJobsExisting.map((x) => x.jobOffer.ref))
                        .Distinct()
                        .ToArray();
                    const msgTranslated = yield translation_service_1.TranslationService.getTranslation(this.authToolsService.getLanguageFromHeader(), 'CandidateApplication.AlreadyAppliedForApplications');
                    throw new app_error_1.AppErrorWithMessage(msgTranslated +
                        ' <br/> - ' +
                        jobOffersRefList.join('<br/> - '));
                }
            }
            else if (candidateEmail &&
                request.candidateApplication.spontaneousApplication) {
                const lastApplicationResponse = yield this.candidateApplicationService.findOne({
                    where: {
                        email: candidateEmail,
                        spontaneousApplication: true,
                    },
                    order: { creationDate: 'DESC' },
                });
                if (lastApplicationResponse === null || lastApplicationResponse === void 0 ? void 0 : lastApplicationResponse.candidateApplication) {
                    const lastApplication = lastApplicationResponse.candidateApplication;
                    const lastApplicationDate = lastApplication.creationDate;
                    const currentDate = new Date();
                    const diffDays = nextalys_js_helpers_1.DateHelpers.daysDiff(lastApplicationDate, currentDate);
                    if (diffDays <= 14) {
                        const msgTranslated = yield translation_service_1.TranslationService.getTranslation(this.authToolsService.getLanguageFromHeader(), 'CandidateApplication.AlreadyAppliedForSpontaneous');
                        throw new app_error_1.AppErrorWithMessage(msgTranslated);
                    }
                }
            }
            let saveResponse = yield this.candidateApplicationService.createOrUpdate(request.candidateApplication);
            if (!saveResponse.success) {
                return saveResponse;
            }
            if (filesToHandle === null || filesToHandle === void 0 ? void 0 : filesToHandle.length) {
                const privateFolder = this.fileService.joinPaths(environment_1.Environment.CandidateApplicationsDirectory, saveResponse.candidateApplication.id);
                const publicFolder = this.fileService.joinPaths(environment_1.Environment.CandidateApplicationsPublicDirectory, saveResponse.candidateApplication.id);
                if (!(yield nextalys_node_helpers_1.FileHelpers.fileExists(privateFolder))) {
                    yield nextalys_node_helpers_1.FileHelpers.createDirectory(privateFolder);
                }
                if (!(yield nextalys_node_helpers_1.FileHelpers.fileExists(publicFolder))) {
                    yield nextalys_node_helpers_1.FileHelpers.createDirectory(publicFolder);
                }
                for (const fileWrapper of filesToHandle) {
                    if (!fileWrapper.file) {
                        continue;
                    }
                    const tempFilePath = this.fileService.joinPaths(environment_1.Environment.UploadedFilesTempDirectory, fileWrapper.file.physicalName);
                    yield this.candidateService.uploadCandidateFilesToGdrive(saveResponse.candidateApplication, tempFilePath, fileWrapper.file, null, fileWrapper.name, 'candidate-applications', true);
                    if (fileWrapper.name === 'photoFile') {
                        const filePath = this.fileService.joinPaths(publicFolder, fileWrapper.file.physicalName);
                        yield image_helpers_1.ImageHelpers.resizeImage(this.fileService.getTempFilePath(fileWrapper.file), { width: 400 }, filePath);
                    }
                    if (fileWrapper.name === 'mainResumeFile' ||
                        fileWrapper.name === 'partnerResumeFile') {
                        const filePath = this.fileService.joinPaths(privateFolder, fileWrapper.file.physicalName);
                        yield nextalys_node_helpers_1.FileHelpers.renameFile(this.fileService.getTempFilePath(fileWrapper.file), filePath);
                    }
                }
            }
            saveResponse = yield this.candidateApplicationService.createOrUpdate(saveResponse.candidateApplication);
            if (saveResponse.success) {
                yield this.socketGateway.sendEventToClient(shared_constants_1.CustomSocketEventType.RefreshUnseenCandidateApplications, {
                    data: {
                        id: saveResponse.candidateApplication.id,
                        type: 'new',
                    },
                });
                const payload = this.authToolsService.getCurrentPayload(false);
                yield this.candidateApplicationService.sendCandidateApplicationReceivedMail(saveResponse.candidateApplication, request, payload === null || payload === void 0 ? void 0 : payload.mail);
            }
            return saveResponse;
        });
    }
    delete(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.candidateApplicationService.delete(ids.split(','));
        });
    }
    archive(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.candidateApplicationService.archive(ids);
        });
    }
    validateCandidateApplication(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!request.id) {
                throw new app_error_1.AppErrorWithMessage('Invalid Request');
            }
            const payload = this.authToolsService.getCurrentPayload(false);
            return yield this.candidateApplicationService.changeCandidateApplicationStatusAndCreateCandidateIfNeeded(request.id, shared_constants_1.ApplyStatus.Validated, true, request.giveAtsAccess, request.candidateCurrentJobIds, request.genderId, payload === null || payload === void 0 ? void 0 : payload.mail, undefined, payload === null || payload === void 0 ? void 0 : payload.id);
        });
    }
    refuseCandidateApplication(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!request.id) {
                throw new app_error_1.AppErrorWithMessage('Invalid Request');
            }
            const payload = this.authToolsService.getCurrentPayload(false);
            return yield this.candidateApplicationService.changeCandidateApplicationStatusAndCreateCandidateIfNeeded(request.id, shared_constants_1.ApplyStatus.Refused, !!request.createCandidate, request.giveAtsAccess, request.candidateCurrentJobIds, request.genderId, payload === null || payload === void 0 ? void 0 : payload.mail, request.isPlatform);
        });
    }
    setCandidateApplicationSeen(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                if (!id) {
                    throw new app_error_1.AppErrorWithMessage('Error occured with id');
                }
                const candidateApplicationResponse = yield this.candidateApplicationService.findOne({
                    where: { id: id },
                });
                if (!candidateApplicationResponse) {
                    throw new common_1.NotFoundException();
                }
                if (candidateApplicationResponse.candidateApplication &&
                    !candidateApplicationResponse.candidateApplication.seen) {
                    candidateApplicationResponse.candidateApplication.seen = true;
                    yield this.candidateApplicationService.createOrUpdate(candidateApplicationResponse.candidateApplication);
                    yield this.socketGateway.sendEventToClient(shared_constants_1.CustomSocketEventType.RefreshUnseenCandidateApplications, { data: { id: id, type: 'seen' } });
                }
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    getUnSeenCandidateApplications() {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = this.authToolsService.getCurrentPayload(false);
            if (!payload) {
                throw new app_error_1.AppErrorWithMessage('Invalid input');
            }
            const where = [{ seen: false }];
            const response = new candidate_application_dto_1.UnSeenCandidateApplicationResponse();
            try {
                if (shared_service_1.SharedService.userHasRole(payload, shared_constants_1.RolesList.Consultant) &&
                    !shared_service_1.SharedService.userHasOneOfRoles(payload, [
                        shared_constants_1.RolesList.Admin,
                        shared_constants_1.RolesList.AdminTech,
                        shared_constants_1.RolesList.RH,
                    ])) {
                    const candidateApplicationJobsTableName = (0, typeorm_2.getManager)().getRepository(candidates_application_jobs_entity_1.CandidateApplicationJobs)
                        .metadata.tableName;
                    const jobOffersTableName = (0, typeorm_2.getManager)().getRepository(job_offer_entity_1.JobOffer).metadata.tableName;
                    const candidateApplicationTableName = (0, typeorm_2.getManager)().getRepository(candidate_application_entity_1.CandidateApplication).metadata
                        .tableName;
                    for (const whereFilter of where) {
                        whereFilter.id = (0, typeorm_2.Raw)((alias) => `(${alias} IN (SELECT candidateApplicationId FROM \`${candidateApplicationJobsTableName}\` WHERE jobOfferId
                IN(SELECT id FROM \`${jobOffersTableName}\` WHERE consultantId = '${payload.id}'))
                OR ${alias} IN (SELECT id FROM \`${candidateApplicationTableName}\` WHERE spontaneousApplication = 1))`);
                    }
                }
                response.unSeenCandidateApplication =
                    yield this.candidateApplicationService
                        .getRepository()
                        .count({ where });
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    createOrUpdateRefCandidateApplication(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                console.log(request);
                if (!request || !request.candidateApplication) {
                    throw new app_error_1.AppErrorWithMessage('Invalid request');
                }
                const candidateResponse = yield this.candidateService.findOne({
                    where: { email: request.candidateApplication.email },
                });
                if (!candidateResponse.candidate) {
                    throw new app_error_1.AppErrorWithMessage("Le candidat avec cet adresse email n'existe pas");
                }
                console.log(candidateResponse);
                request.candidateApplication.candidateId =
                    candidateResponse.candidate.id;
                const updateResponse = yield this.createOrUpdate(request);
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    getMyCandidateApplications(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = this.authToolsService.getCurrentPayload(false);
            if (!(payload === null || payload === void 0 ? void 0 : payload.candidateId)) {
                throw new app_error_1.AppErrorWithMessage('Impossible de récupérer les informations');
            }
            let response = new candidate_application_dto_1.GetCandidateApplicationsResponse();
            try {
                request.candidateId = payload.candidateId;
                response = yield this.getAll(request);
                if (!response.success) {
                    throw new app_error_1.AppErrorWithMessage('error get all : ' + response.message);
                }
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    getMyCandidateApplicationDetail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = this.authToolsService.getCurrentPayload(false);
            if (!(payload === null || payload === void 0 ? void 0 : payload.candidateId)) {
                throw new app_error_1.AppErrorWithMessage('Impossible de récupérer les informations');
            }
            let response = new candidate_application_dto_1.GetCandidateApplicationResponse();
            try {
                response = yield this.get(id);
                if (!response.success) {
                    throw new app_error_1.AppErrorWithMessage('error get all : ' + response.message);
                }
                if (response.candidateApplication.candidateId !==
                    (payload === null || payload === void 0 ? void 0 : payload.candidateId)) {
                    throw new app_error_1.AppErrorWithMessage('Impossible de récupérer les informations');
                }
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    applyToJobOffers(request) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const payload = this.authToolsService.getCurrentPayload(false);
            const applyResponse = yield this.candidateApplicationService.applyToJobOffers(request, payload, this.authToolsService.getLanguageFromHeader());
            if (applyResponse.success) {
                yield this.candidateApplicationService.sendCandidateApplicationReceivedMail(applyResponse.candidateApplication, {
                    language: ((_a = this.authToolsService) === null || _a === void 0 ? void 0 : _a.getLanguageFromHeader()) ||
                        shared_constants_1.defaultAppLanguage,
                }, payload === null || payload === void 0 ? void 0 : payload.mail);
            }
            return applyResponse;
        });
    }
    linkCandidateApplicationToCandidateFromMail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.candidateApplicationService.linkCandidateApplicationToCandidateFromMail(id);
        });
    }
    generateGuidExchangeAndSendEmail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.candidateApplicationService.generateGuidExchangeAndSendEmail(id);
        });
    }
    getCandidateApplicationFromGuid(guid) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.candidateApplicationService.findOne({
                where: { guidExchange: guid },
            });
        });
    }
    sendPrivateExchangeLinkToCandidateApplication(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.candidateApplicationService.sendPrivateExchangeLinkToCandidateApplication(id);
        });
    }
    setCandidateApplicationUnseen(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.candidateApplicationService.setCandidateApplicationUnseen(request.candidateApplicationId);
        });
    }
    sendMailAfterCandidateApplicationRefused(type, id) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            let response = new generic_response_1.GenericResponse();
            try {
                if (!type) {
                    throw new app_error_1.AppErrorWithMessage('Invalid Request');
                }
                const findcaResponse = yield this.candidateApplicationService.findOne({
                    where: { id: id },
                    relations: [
                        'candidateApplicationJobs',
                        'candidateApplicationJobs.jobOffer',
                    ],
                });
                if (!findcaResponse) {
                    return findcaResponse;
                }
                let mailType = null;
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
                    throw new app_error_1.AppErrorWithMessage('Invalid Request');
                }
                console.log('mailType => ', mailType);
                const mailSender = candidates_helpers_1.SharedCandidatesHelpers.getMailSenderFromCandidateApplication(findcaResponse.candidateApplication);
                const countryCode = (_b = (_a = findcaResponse.candidateApplication) === null || _a === void 0 ? void 0 : _a.address) === null || _b === void 0 ? void 0 : _b.country;
                let jobOfferData;
                const firstJobOffer = (_e = (_d = (_c = findcaResponse.candidateApplication) === null || _c === void 0 ? void 0 : _c.candidateApplicationJobs) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.jobOffer;
                if (firstJobOffer) {
                    jobOfferData = {
                        ref: firstJobOffer.ref,
                        title: firstJobOffer.title,
                    };
                }
                const mailContentWrapper = mail_content_1.MailContent.getMailContentAndSubject(mailType, false, null, countryCode, undefined, jobOfferData);
                response = yield this.mailService.sendMailWithGenericTemplate({
                    htmlBody: mailContentWrapper.content,
                    subject: mailContentWrapper.subject,
                    from: { address: mailSender },
                    to: [{ address: findcaResponse.candidateApplication.email }],
                });
            }
            catch (error) {
                response.handleError(error);
            }
            return response;
        });
    }
    isCountryAllowed(ipAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = new country_service_1.IpAllowedResponse();
            try {
                response = yield country_service_1.CountryService.isIpAllowed(ipAddress);
            }
            catch (error) {
                response.handleError(error);
            }
            return response;
        });
    }
    sendPositionFilledEmail(request) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = new candidate_application_dto_1.GetCandidateApplicationsResponse();
            try {
                const findOptions = base_search_requests_1.BaseSearchRequest.getDefaultFindOptions(request);
                const doSearch = yield this.setCandidateApplicationFilters(findOptions, request);
                if (!doSearch) {
                    response = new candidate_application_dto_1.GetCandidateApplicationsResponse();
                    response.success = true;
                    return response;
                }
                const candidateList = yield this.candidateApplicationService.findAll(findOptions);
                candidateList.candidateApplications.forEach((data) => {
                    var _a;
                    let mailType = 'JobOfferPositionIsFilled';
                    const mailSender = 'contact@morganmallet.agency';
                    const countryCode = (_a = data === null || data === void 0 ? void 0 : data.address) === null || _a === void 0 ? void 0 : _a.country;
                    const mailContentWrapper = mail_content_1.MailContent.getMailContentAndSubject(mailType, false, null, countryCode);
                    this.mailService.sendMailWithGenericTemplate({
                        htmlBody: mailContentWrapper.content,
                        subject: mailContentWrapper.subject,
                        from: { address: mailSender },
                        to: [{ address: data.email }],
                    });
                });
                if (!response.success) {
                    throw new app_error_1.AppErrorWithMessage('error get all : ' + response.message);
                }
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    getAllRecruitmentActivities(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOptions = base_search_requests_1.BaseSearchRequest.getDefaultFindOptions(request);
            if (request.status) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                if (request.status === 'true') {
                    for (const whereFilter of findOptions.where) {
                        whereFilter.disabled = false;
                    }
                }
                else if (request.status === 'false') {
                    for (const whereFilter of findOptions.where) {
                        whereFilter.disabled = true;
                    }
                }
            }
            if (request.consultantIds) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                const consultantIds = request.consultantIds.split(',');
                for (const whereFilter of findOptions.where) {
                    whereFilter.consultantId = (0, typeorm_2.In)(consultantIds);
                }
            }
            const result = yield this.jobOfferService.findAll(findOptions);
            for (const data of result.jobOffers) {
                const applicationRequest = new candidate_application_dto_1.GetCandidateApplicationsRequest();
                applicationRequest.jobOfferId = data.id;
                const findOptionsCandidateApplication = base_search_requests_1.BaseSearchRequest.getDefaultFindOptions(applicationRequest);
                const doSearch = yield this.setCandidateApplicationFilters(findOptionsCandidateApplication, applicationRequest);
                const x = yield this.candidateApplicationService.findAll(findOptionsCandidateApplication);
                data.candidateApplications = x.candidateApplications;
            }
            return result;
        });
    }
};
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all candidate applications',
        operationId: 'getAllCandidateApplications',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get all candidates applications',
        type: candidate_application_dto_1.GetCandidateApplicationsResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [candidate_application_dto_1.GetCandidateApplicationsRequest]),
    __metadata("design:returntype", Promise)
], CandidateApplicationsController.prototype, "getAll", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Get)('get/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get candidate application',
        operationId: 'getCandidateApplication',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get candidate application',
        type: candidate_application_dto_1.GetCandidateApplicationResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CandidateApplicationsController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create or update candidate application',
        operationId: 'createOrUpdateCandidateApplication',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Create or update candidate application',
        type: candidate_application_dto_1.GetCandidateApplicationResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [candidate_application_dto_1.SubmitCandidateApplicationFormRequest]),
    __metadata("design:returntype", Promise)
], CandidateApplicationsController.prototype, "createOrUpdate", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.AdminTech),
    (0, common_1.Delete)(':ids'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete candidate applications',
        operationId: 'deleteCandidateApplications',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Delete candidate applications',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CandidateApplicationsController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('archiveCandidateApplication'),
    (0, swagger_1.ApiOperation)({
        summary: 'Archive candidate applications',
        operationId: 'archiveCandidateApplications',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Archive candidate applications',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], CandidateApplicationsController.prototype, "archive", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('validateAndCreateCandidate'),
    (0, swagger_1.ApiOperation)({
        summary: 'Validate candidate application and create candidate',
        operationId: 'validateCandidateApplication',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Validate candidate application',
        type: candidate_application_dto_1.GetCandidateApplicationResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [candidate_application_dto_1.ValidateCandidateApplicationRequest]),
    __metadata("design:returntype", Promise)
], CandidateApplicationsController.prototype, "validateCandidateApplication", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('refuseAndCreateCandidate'),
    (0, swagger_1.ApiOperation)({
        summary: 'Refuse candidate application and create candidate',
        operationId: 'refuseCandidateApplication',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Refuse candidate application',
        type: candidate_application_dto_1.GetCandidateApplicationResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [candidate_application_dto_1.RefuseCandidateApplicationRequest]),
    __metadata("design:returntype", Promise)
], CandidateApplicationsController.prototype, "refuseCandidateApplication", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('infos/setCandidateApplicationSeen/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'set candidate application as seen',
        operationId: 'setCandidateApplicationSeen',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'set candidate application seen',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CandidateApplicationsController.prototype, "setCandidateApplicationSeen", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('infos/getUnSeenCandidateApplications'),
    (0, swagger_1.ApiOperation)({
        summary: 'get unseen candidate application number',
        operationId: 'getUnSeenCandidateApplications',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'get unseen candidate application',
        type: candidate_application_dto_1.UnSeenCandidateApplicationResponse,
    }),
    (0, common_1.HttpCode)(200),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CandidateApplicationsController.prototype, "getUnSeenCandidateApplications", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('candidate/createOrUpdateRefCandidateApplication'),
    (0, swagger_1.ApiOperation)({
        summary: 'create candidate application from ref',
        operationId: 'createOrUpdateRefCandidateApplication',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'create candidate application from ref',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [candidate_application_dto_1.SubmitCandidateApplicationFormRequest]),
    __metadata("design:returntype", Promise)
], CandidateApplicationsController.prototype, "createOrUpdateRefCandidateApplication", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('getMyCandidateApplications'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get candidate applications of the current user',
        operationId: 'getMyCandidateApplications',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get candidate applications of the current user',
        type: candidate_application_dto_1.GetCandidateApplicationsResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [candidate_application_dto_1.GetCandidateApplicationsRequest]),
    __metadata("design:returntype", Promise)
], CandidateApplicationsController.prototype, "getMyCandidateApplications", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Candidate),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('getMyCandidateApplicationDetail/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get candidate application detail of the current user',
        operationId: 'getMyCandidateApplicationDetail',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get candidate application detail of the current user',
        type: candidate_application_dto_1.GetCandidateApplicationResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CandidateApplicationsController.prototype, "getMyCandidateApplicationDetail", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Candidate),
    (0, common_1.Post)('applyToJobOffers'),
    (0, swagger_1.ApiOperation)({
        summary: 'applyToJobOffers',
        operationId: 'applyToJobOffers',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'applyToJobOffers',
        type: candidate_application_dto_1.GetCandidateApplicationResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [candidate_application_dto_1.ApplyToJobOffersRequest]),
    __metadata("design:returntype", Promise)
], CandidateApplicationsController.prototype, "applyToJobOffers", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Post)('linkCandidateApplicationToCandidateFromMail'),
    (0, swagger_1.ApiOperation)({
        summary: 'linkCandidateApplicationToCandidateFromMail',
        operationId: 'linkCandidateApplicationToCandidateFromMail',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'linkCandidateApplicationToCandidateFromMail',
        type: candidate_application_dto_1.GetCandidateApplicationResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CandidateApplicationsController.prototype, "linkCandidateApplicationToCandidateFromMail", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Post)('generateGuidExchangeAndSendEmail/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'generateGuidExchangeAndSendEmail',
        operationId: 'generateGuidExchangeAndSendEmail',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'generateGuidExchangeAndSendEmail',
        type: candidate_application_dto_1.GuidExchangeResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CandidateApplicationsController.prototype, "generateGuidExchangeAndSendEmail", null);
__decorate([
    (0, common_1.Get)('getCandidateApplicationFromGuid/:guid'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get candidate application from guid',
        operationId: 'getCandidateApplicationFromGuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get candidate application from guid',
        type: candidate_application_dto_1.GetCandidateApplicationResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('guid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CandidateApplicationsController.prototype, "getCandidateApplicationFromGuid", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Post)('sendPrivateExchangeLinkToCandidateApplication/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'sendPrivateExchangeLinkToCandidateApplication',
        operationId: 'sendPrivateExchangeLinkToCandidateApplication',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'generateGuidExchangeAndSendEmail',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CandidateApplicationsController.prototype, "sendPrivateExchangeLinkToCandidateApplication", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Post)('setCandidateApplicationUnseen'),
    (0, swagger_1.ApiOperation)({
        summary: 'setCandidateApplicationUnseen',
        operationId: 'setCandidateApplicationUnseen',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'setCandidateApplicationUnseen',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [candidate_application_dto_1.SetCandidateApplicationUnseenRequest]),
    __metadata("design:returntype", Promise)
], CandidateApplicationsController.prototype, "setCandidateApplicationUnseen", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('sendMailAfterCandidateApplicationRefused/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'sendMailAfterCandidateApplicationRefused',
        operationId: 'sendMailAfterCandidateApplicationRefused',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'sendMailAfterCandidateApplicationRefused',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CandidateApplicationsController.prototype, "sendMailAfterCandidateApplicationRefused", null);
__decorate([
    (0, common_1.Post)('isCountryAllowed'),
    (0, swagger_1.ApiOperation)({
        summary: 'isCountryAllowed',
        operationId: 'isCountryAllowed',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'isCountryAllowed',
        type: country_service_1.IpAllowedResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CandidateApplicationsController.prototype, "isCountryAllowed", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Get)('sendPositionFilledEmail'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Send position is filled email',
        operationId: 'sendPositionFilledEmail',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Send position is filled email',
        type: candidate_application_dto_1.GetCandidateApplicationsResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [candidate_application_dto_1.GetCandidateApplicationsRequest]),
    __metadata("design:returntype", Promise)
], CandidateApplicationsController.prototype, "sendPositionFilledEmail", null);
__decorate([
    (0, common_1.Get)('getAllRecruitmentActivities'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all Recruitment Activities',
        operationId: 'getAllRecruitmentActivities',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get All Recruitment Activities',
        type: job_offer_dto_1.GetJobOffersResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [job_offer_dto_1.GetJobOfferRequest]),
    __metadata("design:returntype", Promise)
], CandidateApplicationsController.prototype, "getAllRecruitmentActivities", null);
CandidateApplicationsController = __decorate([
    (0, common_1.Controller)('candidate-applications'),
    (0, swagger_1.ApiTags)('candidate-applications'),
    __param(8, (0, typeorm_1.InjectRepository)(candidates_application_jobs_entity_1.CandidateApplicationJobs)),
    __metadata("design:paramtypes", [candidate_applications_service_1.CandidateApplicationService,
        mail_service_1.MailService,
        job_offers_service_1.JobOfferService,
        file_service_1.FileService,
        socket_gateway_1.SocketGateway,
        candidates_service_1.CandidateService,
        auth_tools_service_1.AuthToolsService,
        gcloud_storage_service_1.GCloudStorageService,
        typeorm_2.Repository])
], CandidateApplicationsController);
exports.CandidateApplicationsController = CandidateApplicationsController;
//# sourceMappingURL=candidate-applications.controller.js.map