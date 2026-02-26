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
exports.CandidateApplicationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const linqts_1 = require("linqts");
const nextalys_js_helpers_1 = require("nextalys-js-helpers");
const excel_1 = require("nextalys-js-helpers/dist/excel");
const nextalys_node_helpers_1 = require("nextalys-node-helpers");
const excel_helpers_exceljs_1 = require("nextalys-node-helpers/dist/helpers/excel-helpers/impl/excel-helpers-exceljs");
const typeorm_2 = require("typeorm");
const candidates_helpers_1 = require("../../../shared/candidates-helpers");
const routes_1 = require("../../../shared/routes");
const shared_constants_1 = require("../../../shared/shared-constants");
const shared_service_1 = require("../../../shared/shared-service");
const candidate_job_status_type_1 = require("../../../shared/types/candidate-job-status.type");
const candidate_job_type_1 = require("../../../shared/types/candidate-job-type");
const address_entity_1 = require("../../entities/address.entity");
const environment_1 = require("../../environment/environment");
const app_error_1 = require("../../models/app-error");
const generic_response_1 = require("../../models/responses/generic-response");
const base_model_service_1 = require("../../services/base-model.service");
const referential_service_1 = require("../../services/referential.service");
const file_service_1 = require("../../services/tools/file.service");
const mail_service_1 = require("../../services/tools/mail.service");
const translation_service_1 = require("../../services/translation.service");
const mail_content_1 = require("../../shared/mail-content");
const candidates_application_jobs_entity_1 = require("../candidate-application-jobs/candidates-application-jobs.entity");
const candidate_dto_1 = require("../candidates/candidate-dto");
const candidates_service_1 = require("../candidates/candidates.service");
const gcloud_storage_service_1 = require("../gdrive/gcloud-storage-service");
const candidate_application_dto_1 = require("./candidate-application-dto");
const candidate_application_entity_1 = require("./candidate-application.entity");
let CandidateApplicationService = class CandidateApplicationService extends base_model_service_1.ApplicationBaseModelService {
    constructor(repository, candidateService, referentialService, fileService, mailService, gCloudStorageService, candidateApplicationJobsRepository) {
        super();
        this.repository = repository;
        this.candidateService = candidateService;
        this.referentialService = referentialService;
        this.fileService = fileService;
        this.mailService = mailService;
        this.gCloudStorageService = gCloudStorageService;
        this.candidateApplicationJobsRepository = candidateApplicationJobsRepository;
        this.modelOptions = {
            getManyResponse: candidate_application_dto_1.GetCandidateApplicationsResponse,
            getOneResponse: candidate_application_dto_1.GetCandidateApplicationResponse,
            getManyResponseField: 'candidateApplications',
            getOneResponseField: 'candidateApplication',
            getManyRelations: [
                'applyStatus',
                'applyStatus.translations',
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
                'photoFile',
                'mainResumeFile',
                'partnerResumeFile',
                'candidateApplicationJobs',
                'candidateApplicationJobs.jobOffer',
                'anonymousExchanges',
                'anonymousExchanges.consultant',
                'anonymousExchanges.file',
                'candidateCountries',
                'candidateDepartments',
            ],
            repository: this.repository,
            entity: candidate_application_entity_1.CandidateApplication,
            archiveField: 'disabled',
            archiveFieldValue: true,
        };
    }
    changeCandidateApplicationStatusAndCreateCandidateIfNeeded(id, statusCode, createCandidate, giveAtsAccess = false, currentJobsId, genderId, consultantEmail, isPlatform, consultantId) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            let response = new candidate_application_dto_1.GetCandidateApplicationResponse();
            try {
                const candidateApplication = yield this.repository.findOne({
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
                if (!candidateApplication) {
                    throw new app_error_1.AppErrorWithMessage('Impossible de récupérer la candidature');
                }
                if (genderId) {
                    candidateApplication.genderId = genderId;
                }
                if (createCandidate && !candidateApplication.candidateId) {
                    response = yield this.createCandidateFromCandidateApplication(candidateApplication, currentJobsId, consultantId);
                    if (!response.success) {
                        if (response.originalError)
                            throw response.originalError;
                        throw new app_error_1.AppErrorWithMessage(response.message);
                    }
                }
                if (statusCode === shared_constants_1.ApplyStatus.Validated &&
                    consultantId &&
                    candidateApplication.candidateId) {
                    const existingCandidate = yield this.candidateService.findOne({
                        where: { id: candidateApplication.candidateId },
                    });
                    if (existingCandidate.success &&
                        existingCandidate.candidate &&
                        !existingCandidate.candidate.consultantId) {
                        existingCandidate.candidate.consultantId = consultantId;
                        yield this.candidateService.createOrUpdate(existingCandidate.candidate, false, {});
                    }
                }
                const getStatusRefusedCandidateApplication = yield this.referentialService.getOneAppValue(statusCode);
                candidateApplication.applyStatusId =
                    getStatusRefusedCandidateApplication.appValue.id;
                yield this.repository.save(candidateApplication);
                if (!isPlatform) {
                    const mailSender = candidates_helpers_1.SharedCandidatesHelpers.getMailSenderFromCandidateApplication(candidateApplication, undefined, consultantEmail);
                    const countryCode = (_b = (_a = candidateApplication === null || candidateApplication === void 0 ? void 0 : candidateApplication.addresses) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.country;
                    let mailType = 'CandidateApplicationAccepted';
                    if (statusCode === shared_constants_1.ApplyStatus.Refused) {
                        mailType = createCandidate
                            ? 'CandidateApplicationRefusedCreateCandidate'
                            : 'CandidateApplicationRefused';
                    }
                    let jobOfferData;
                    const firstJobOffer = (_d = (_c = candidateApplication.candidateApplicationJobs) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.jobOffer;
                    if (firstJobOffer) {
                        jobOfferData = {
                            ref: firstJobOffer.ref,
                            title: firstJobOffer.title,
                        };
                    }
                    const mailContentWrapper = mail_content_1.MailContent.getMailContentAndSubject(mailType, false, null, countryCode, undefined, jobOfferData);
                    const sendMailResponse = yield this.mailService.sendMailWithGenericTemplate({
                        htmlBody: mailContentWrapper.content,
                        subject: mailContentWrapper.subject,
                        from: { address: mailSender },
                        to: [{ address: candidateApplication.email }],
                    });
                    if (!sendMailResponse.success) {
                        throw new app_error_1.AppErrorWithMessage("Une erreur s'est produite lors de l'envoi du mail");
                    }
                }
                if (giveAtsAccess && createCandidate) {
                    const fetchedCandidate = yield this.candidateService.findOne({
                        where: { id: candidateApplication.candidateId },
                    });
                    if (!fetchedCandidate.success) {
                        throw new app_error_1.AppErrorWithMessage("Impossible de créer un utilisateur pour le candidat, lenvoi du mail d'accès à l'ATS à echoué");
                    }
                    yield this.candidateService.createUserFromCandidate(fetchedCandidate.candidate, { roles: [shared_constants_1.RolesList.Candidate] }, true, false);
                }
                response.candidateApplication = candidateApplication.toDto();
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    createCandidateFromCandidateApplication(candidateApplication, currentJobsId, consultantId) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new candidate_application_dto_1.GetCandidateApplicationResponse();
            try {
                if (!candidateApplication) {
                    throw new app_error_1.AppError("Une erreur s'est produite");
                }
                const candidateToBeRefStatusId = yield this.referentialService.getOneAppValue(shared_constants_1.CandidateStatus.ToBeReferenced);
                if (!candidateToBeRefStatusId.success) {
                    throw new app_error_1.AppError("Une erreur s'est produite lors de la création du candidat");
                }
                response.candidateApplication = {};
                const jobResponse = yield this.referentialService.getTypeValues({
                    appTypeCode: shared_constants_1.AppTypes.JobCategoryCode,
                });
                if (!jobResponse.success) {
                    throw new app_error_1.AppError('Une erreur est survenue lors de la validation de la candidature');
                }
                const candidate = new candidate_dto_1.CandidateDto();
                candidate.addresses = [];
                candidate.firstName = candidateApplication.firstName;
                candidate.lastName = candidateApplication.lastName;
                candidate.genderId = candidateApplication.genderId;
                candidate.birthDate = candidateApplication.birthDate;
                if (!((_a = candidate.candidateJobs) === null || _a === void 0 ? void 0 : _a.length))
                    candidate.candidateJobs = [];
                candidate.candidateJobs.push({
                    candidateId: candidate.id,
                    jobId: candidateApplication.professionId,
                    status: candidate_job_status_type_1.CandidateJobStatus.PENDING,
                    type: candidate_job_type_1.CandidateJobType.JOB,
                });
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
                    candidate.partnerPhone = nextalys_js_helpers_1.MainHelpers.shorten(candidateApplication.partnerPhone, 27, 0);
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
                if (!((_b = candidate.candidateCurrentJobs) === null || _b === void 0 ? void 0 : _b.length))
                    candidate.candidateCurrentJobs = [];
                if (currentJobsId === null || currentJobsId === void 0 ? void 0 : currentJobsId.length) {
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
                const normalizedEmail = (_c = candidate.email) === null || _c === void 0 ? void 0 : _c.toLowerCase().trim();
                if (!normalizedEmail) {
                    throw new app_error_1.AppErrorWithMessage("L'adresse e-mail est requise pour créer un candidat");
                }
                candidate.email = normalizedEmail;
                const candidateResponse = yield this.candidateService.findOne({
                    where: { email: normalizedEmail },
                });
                if (candidateResponse.success && candidateResponse.candidate) {
                    throw new app_error_1.AppErrorWithMessage('Un candidat existe déjà avec cette adresse e-mail !');
                }
                if (candidateResponse.success && !candidateResponse.candidate) {
                    candidate.files = [];
                    const createCandidateResponse = yield this.candidateService.createOrUpdate(candidate, false, {
                        includeAddresses: 'true',
                        includeFiles: 'true',
                        includeCandidateJobs: 'true',
                    });
                    if (!createCandidateResponse.success) {
                        throw new app_error_1.AppError("Une erreur s'est produite lors de la création du candidat");
                    }
                    candidate.files = [];
                    const copyCandidateApplicationFilesResponse = yield this.copyCandidateApplicationFilesToCandidate(candidateApplication, createCandidateResponse.candidate);
                    yield this.candidateService.createMandatoryCandidateFilesForCandidate(copyCandidateApplicationFilesResponse.candidate);
                    candidateApplication.candidateId =
                        createCandidateResponse.candidate.id;
                    const responseSave = yield this.repository.save(candidateApplication);
                    response.candidateApplication = responseSave.toDto();
                }
                else {
                }
                response.success = true;
            }
            catch (err) {
                console.log(err);
                response.handleError(err);
            }
            return response;
        });
    }
    updateExistingCandidateFilesFromApplication(candidateApplication) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __awaiter(this, void 0, void 0, function* () {
            const candidateResponse = yield this.candidateService.findOne({
                where: { id: candidateApplication.candidateId },
                relations: ['files', 'files.fileType'],
            });
            if (!candidateResponse.success || !candidateResponse.candidate) {
                return;
            }
            const candidateDto = candidateResponse.candidate;
            const fileTypes = yield this.referentialService.getTypeValues({
                appTypeCode: shared_constants_1.AppTypes.CandidateFileType,
            });
            const filesToUpdate = [];
            if (candidateApplication.mainResumeFile) {
                filesToUpdate.push({
                    file: candidateApplication.mainResumeFile,
                    fileTypeId: (_b = (_a = fileTypes === null || fileTypes === void 0 ? void 0 : fileTypes.appType) === null || _a === void 0 ? void 0 : _a.appValues.find((x) => x.code === shared_constants_1.CandidateFileType.MainResume)) === null || _b === void 0 ? void 0 : _b.id,
                });
            }
            if (candidateApplication.partnerResumeFile) {
                filesToUpdate.push({
                    file: candidateApplication.partnerResumeFile,
                    fileTypeId: (_d = (_c = fileTypes === null || fileTypes === void 0 ? void 0 : fileTypes.appType) === null || _c === void 0 ? void 0 : _c.appValues.find((x) => x.code === shared_constants_1.CandidateFileType.PartnerResume)) === null || _d === void 0 ? void 0 : _d.id,
                });
            }
            if (candidateApplication.photoFile) {
                filesToUpdate.push({
                    file: candidateApplication.photoFile,
                    fileTypeId: (_f = (_e = fileTypes === null || fileTypes === void 0 ? void 0 : fileTypes.appType) === null || _e === void 0 ? void 0 : _e.appValues.find((x) => x.code === shared_constants_1.CandidateFileType.MainPhoto)) === null || _f === void 0 ? void 0 : _f.id,
                });
            }
            for (const fileToUpdate of filesToUpdate) {
                if (!fileToUpdate.fileTypeId) {
                    continue;
                }
                yield this.candidateService.uploadCandidateFilesToGdrive(candidateDto, null, fileToUpdate.file, fileToUpdate.fileTypeId, null, 'candidates', false);
            }
            if ((_g = candidateApplication.photoFile) === null || _g === void 0 ? void 0 : _g.physicalName) {
                const candidatePublicFolder = this.fileService.joinPaths(environment_1.Environment.CandidatesPublicDirectory, candidateDto.id);
                if (!(yield nextalys_node_helpers_1.FileHelpers.fileExists(candidatePublicFolder))) {
                    yield nextalys_node_helpers_1.FileHelpers.createDirectory(candidatePublicFolder);
                }
                const sourceFile = this.fileService.joinPaths(environment_1.Environment.CandidateApplicationsPublicDirectory, candidateApplication.id, (_h = candidateApplication.photoFile) === null || _h === void 0 ? void 0 : _h.physicalName);
                if (yield nextalys_node_helpers_1.FileHelpers.fileExists(sourceFile)) {
                    yield nextalys_node_helpers_1.FileHelpers.copyFile(sourceFile, this.fileService.joinPaths(candidatePublicFolder, (_j = candidateApplication.photoFile) === null || _j === void 0 ? void 0 : _j.physicalName));
                }
            }
            const response = yield this.candidateService.createOrUpdate(candidateDto, false, {
                includeFiles: 'true',
            });
            console.log('response', response);
        });
    }
    copyCandidateApplicationFilesToCandidate(candidateApplication, candidateDto) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __awaiter(this, void 0, void 0, function* () {
            const filesToHandle = [];
            const fileTypes = yield this.referentialService.getTypeValues({
                appTypeCode: shared_constants_1.AppTypes.CandidateFileType,
            });
            if (candidateApplication.photoFile) {
                filesToHandle.push({
                    file: candidateApplication.photoFile,
                    fileTypeId: (_b = (_a = fileTypes === null || fileTypes === void 0 ? void 0 : fileTypes.appType) === null || _a === void 0 ? void 0 : _a.appValues.find((x) => x.code === shared_constants_1.CandidateFileType.MainPhoto)) === null || _b === void 0 ? void 0 : _b.id,
                });
            }
            if (candidateApplication.mainResumeFile) {
                filesToHandle.push({
                    file: candidateApplication.mainResumeFile,
                    fileTypeId: (_d = (_c = fileTypes === null || fileTypes === void 0 ? void 0 : fileTypes.appType) === null || _c === void 0 ? void 0 : _c.appValues.find((x) => x.code === shared_constants_1.CandidateFileType.MainResume)) === null || _d === void 0 ? void 0 : _d.id,
                });
            }
            if (candidateApplication.partnerResumeFile) {
                filesToHandle.push({
                    file: candidateApplication.partnerResumeFile,
                    fileTypeId: (_f = (_e = fileTypes === null || fileTypes === void 0 ? void 0 : fileTypes.appType) === null || _e === void 0 ? void 0 : _e.appValues.find((x) => x.code === shared_constants_1.CandidateFileType.PartnerResume)) === null || _f === void 0 ? void 0 : _f.id,
                });
            }
            for (const fileToHandle of filesToHandle) {
                if (!fileToHandle.fileTypeId) {
                    continue;
                }
                yield this.candidateService.uploadCandidateFilesToGdrive(candidateDto, null, fileToHandle.file, fileToHandle.fileTypeId, null, 'candidates', false);
            }
            if ((_g = candidateApplication.photoFile) === null || _g === void 0 ? void 0 : _g.physicalName) {
                const candidatePublicFolder = this.fileService.joinPaths(environment_1.Environment.CandidatesPublicDirectory, candidateDto.id);
                if (!(yield nextalys_node_helpers_1.FileHelpers.fileExists(candidatePublicFolder))) {
                    yield nextalys_node_helpers_1.FileHelpers.createDirectory(candidatePublicFolder);
                }
                const sourceFile = this.fileService.joinPaths(environment_1.Environment.CandidateApplicationsPublicDirectory, candidateApplication.id, (_h = candidateApplication.photoFile) === null || _h === void 0 ? void 0 : _h.physicalName);
                if (yield nextalys_node_helpers_1.FileHelpers.fileExists(sourceFile)) {
                    yield nextalys_node_helpers_1.FileHelpers.copyFile(sourceFile, this.fileService.joinPaths(candidatePublicFolder, (_j = candidateApplication.photoFile) === null || _j === void 0 ? void 0 : _j.physicalName));
                }
            }
            return yield this.candidateService.createOrUpdate(candidateDto, false, {
                includeFiles: 'true',
            });
        });
    }
    createOrUpdate(dto, ...toDtoParameters) {
        const _super = Object.create(null, {
            createOrUpdate: { get: () => super.createOrUpdate }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (!dto.candidateId && dto.email) {
                const emailToLower = dto.email.toLowerCase().trim();
                const findCandidateByEmail = yield this.candidateService.findOne({
                    where: { email: emailToLower },
                });
                if (findCandidateByEmail.candidate) {
                    dto.candidateId = findCandidateByEmail.candidate.id;
                }
            }
            return yield _super.createOrUpdate.call(this, dto, toDtoParameters);
        });
    }
    delete(ids) {
        const _super = Object.create(null, {
            delete: { get: () => super.delete }
        });
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function* () {
            let response = new generic_response_1.GenericResponse();
            try {
                const candidatesApplicationsToRemoveResponse = yield this.findAll({
                    where: { id: (0, typeorm_2.In)(ids) },
                    relations: ['mainResumeFile', 'photoFile', 'partnerResumeFile'],
                });
                if ((_a = candidatesApplicationsToRemoveResponse === null || candidatesApplicationsToRemoveResponse === void 0 ? void 0 : candidatesApplicationsToRemoveResponse.candidateApplications) === null || _a === void 0 ? void 0 : _a.length) {
                    const candidatesApplicationsFilesIds = new linqts_1.List(candidatesApplicationsToRemoveResponse.candidateApplications)
                        .SelectMany((x) => new linqts_1.List([
                        x.photoFileId,
                        x.mainResumeFileId,
                        x.partnerResumeFileId,
                    ]))
                        .Where((x) => !!x)
                        .ToArray();
                    for (const candidateApplicationToRemove of candidatesApplicationsToRemoveResponse.candidateApplications) {
                        const candidateApplicationFolderPath = this.fileService.joinPaths(environment_1.Environment.CandidateApplicationsDirectory, candidateApplicationToRemove.id);
                        const candidateApplicationPrivateFolderPath = this.fileService.joinPaths(environment_1.Environment.CandidateApplicationsPublicDirectory, candidateApplicationToRemove.id);
                        if (yield nextalys_node_helpers_1.FileHelpers.isDirectory(candidateApplicationFolderPath)) {
                            yield nextalys_node_helpers_1.FileHelpers.removeDirectoryRecursive(candidateApplicationFolderPath);
                        }
                        if (yield nextalys_node_helpers_1.FileHelpers.isDirectory(candidateApplicationPrivateFolderPath)) {
                            yield nextalys_node_helpers_1.FileHelpers.removeDirectoryRecursive(candidateApplicationPrivateFolderPath);
                        }
                        if (((_b = candidateApplicationToRemove === null || candidateApplicationToRemove === void 0 ? void 0 : candidateApplicationToRemove.mainResumeFile) === null || _b === void 0 ? void 0 : _b.externalFilePath) &&
                            environment_1.Environment.EnvName === 'production') {
                            const deleteGCloudFileResponse = yield this.gCloudStorageService.deleteFile((_c = candidateApplicationToRemove === null || candidateApplicationToRemove === void 0 ? void 0 : candidateApplicationToRemove.mainResumeFile) === null || _c === void 0 ? void 0 : _c.externalFilePath);
                            const test = '';
                        }
                        if (((_d = candidateApplicationToRemove === null || candidateApplicationToRemove === void 0 ? void 0 : candidateApplicationToRemove.photoFile) === null || _d === void 0 ? void 0 : _d.externalFilePath) &&
                            environment_1.Environment.EnvName === 'production') {
                            const deleteGCloudFileResponse = yield this.gCloudStorageService.deleteFile((_e = candidateApplicationToRemove === null || candidateApplicationToRemove === void 0 ? void 0 : candidateApplicationToRemove.photoFile) === null || _e === void 0 ? void 0 : _e.externalFilePath);
                            const test = '';
                        }
                        if (((_f = candidateApplicationToRemove === null || candidateApplicationToRemove === void 0 ? void 0 : candidateApplicationToRemove.partnerResumeFile) === null || _f === void 0 ? void 0 : _f.externalFilePath) &&
                            environment_1.Environment.EnvName === 'production') {
                            const deleteGCloudFileResponse = yield this.gCloudStorageService.deleteFile((_g = candidateApplicationToRemove === null || candidateApplicationToRemove === void 0 ? void 0 : candidateApplicationToRemove.partnerResumeFile) === null || _g === void 0 ? void 0 : _g.externalFilePath);
                            const test = '';
                        }
                    }
                    response = yield _super.delete.call(this, ids);
                    if (candidatesApplicationsFilesIds.length) {
                        yield this.fileService.delete(candidatesApplicationsFilesIds);
                    }
                }
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    deleteAllCandidateApplications() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse(true);
            const candidatesApplicationsToRemoveResponse = yield this.findAll();
            if ((_a = candidatesApplicationsToRemoveResponse === null || candidatesApplicationsToRemoveResponse === void 0 ? void 0 : candidatesApplicationsToRemoveResponse.candidateApplications) === null || _a === void 0 ? void 0 : _a.length) {
                yield this.delete(candidatesApplicationsToRemoveResponse.candidateApplications.map((x) => x.id));
            }
            return response;
        });
    }
    applyToJobOffers(request, payload, langCode) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new candidate_application_dto_1.GetCandidateApplicationResponse();
            try {
                if (!(payload === null || payload === void 0 ? void 0 : payload.candidateId)) {
                    throw new app_error_1.AppError('Unauthorized');
                }
                if (!((_a = request.jobOfferIds) === null || _a === void 0 ? void 0 : _a.length)) {
                    throw new app_error_1.AppError('Invalid request');
                }
                const candidateApplicationJobsExisting = yield this.candidateApplicationJobsRepository.find({
                    where: {
                        jobOfferId: (0, typeorm_2.In)(request.jobOfferIds),
                        candidateApplicationId: (0, typeorm_2.Raw)((alias) => `(${alias} IN (SELECT id FROM ` +
                            '`' +
                            this.getRepository().metadata.tableName +
                            '` WHERE candidateId = :candidateId ))', { candidateId: payload.candidateId }),
                    },
                    relations: ['candidateApplication', 'jobOffer'],
                });
                if (candidateApplicationJobsExisting === null || candidateApplicationJobsExisting === void 0 ? void 0 : candidateApplicationJobsExisting.length) {
                    const jobOffersRefList = new linqts_1.List(candidateApplicationJobsExisting.map((x) => x.jobOffer.ref))
                        .Distinct()
                        .ToArray();
                    const msgTranslated = yield translation_service_1.TranslationService.getTranslation(langCode, 'CandidateApplication.AlreadyAppliedForApplications');
                    throw new app_error_1.AppErrorWithMessage(msgTranslated +
                        ' <br/> - ' +
                        jobOffersRefList.join('<br/> - '));
                }
                let newApplication = new candidate_application_entity_1.CandidateApplication();
                const applyStatusPending = yield this.referentialService.getOneAppValue(shared_constants_1.ApplyStatus.Pending);
                const candidate = yield this.candidateService
                    .getRepository()
                    .findOne({
                    where: { id: payload.candidateId },
                    relations: ['addresses'],
                });
                newApplication.candidateId = payload.candidateId;
                newApplication.firstName = candidate === null || candidate === void 0 ? void 0 : candidate.firstName;
                newApplication.lastName = candidate === null || candidate === void 0 ? void 0 : candidate.lastName;
                newApplication.email = candidate === null || candidate === void 0 ? void 0 : candidate.email;
                newApplication.birthDate = candidate === null || candidate === void 0 ? void 0 : candidate.birthDate;
                newApplication.phone = candidate === null || candidate === void 0 ? void 0 : candidate.phone;
                newApplication.phoneSecondary = candidate === null || candidate === void 0 ? void 0 : candidate.phoneSecondary;
                newApplication.genderId = candidate === null || candidate === void 0 ? void 0 : candidate.genderId;
                newApplication.inCouple = candidate === null || candidate === void 0 ? void 0 : candidate.inCouple;
                newApplication.relationshipStatusId =
                    candidate === null || candidate === void 0 ? void 0 : candidate.relationshipStatusId;
                newApplication.seen = false;
                newApplication.applyStatusId = (_b = applyStatusPending.appValue) === null || _b === void 0 ? void 0 : _b.id;
                newApplication.disabled = false;
                if ((_c = candidate === null || candidate === void 0 ? void 0 : candidate.addresses) === null || _c === void 0 ? void 0 : _c.length) {
                    newApplication.addresses = [];
                    for (const address of candidate === null || candidate === void 0 ? void 0 : candidate.addresses) {
                        const newAddress = new address_entity_1.Address();
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
                    request.jobOfferIds.map((x) => {
                        const candidateApplicationJobs = new candidates_application_jobs_entity_1.CandidateApplicationJobs();
                        candidateApplicationJobs.jobOfferId = x;
                        return candidateApplicationJobs;
                    });
                newApplication.linkedToCandidate = true;
                newApplication = yield this.repository.save(newApplication);
                response.candidateApplication = newApplication.toDto();
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    linkCandidateApplicationToCandidateFromMail(id) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new candidate_application_dto_1.GetCandidateApplicationResponse();
            try {
                if (!id) {
                    throw new app_error_1.AppErrorWithMessage('Invalid request');
                }
                const getCandidateApplicationResponse = yield this.findOneWithoutRelations({ where: { id: id } });
                if (!(getCandidateApplicationResponse === null || getCandidateApplicationResponse === void 0 ? void 0 : getCandidateApplicationResponse.candidateApplication)) {
                    throw new app_error_1.AppErrorWithMessage('Impossible de trouver la candidature');
                }
                if ((_a = getCandidateApplicationResponse === null || getCandidateApplicationResponse === void 0 ? void 0 : getCandidateApplicationResponse.candidateApplication) === null || _a === void 0 ? void 0 : _a.candidateId) {
                    throw new app_error_1.AppErrorWithMessage('Candidate application already linked to a candidate');
                }
                if (!((_b = getCandidateApplicationResponse === null || getCandidateApplicationResponse === void 0 ? void 0 : getCandidateApplicationResponse.candidateApplication) === null || _b === void 0 ? void 0 : _b.email)) {
                    throw new app_error_1.AppErrorWithMessage("Pas d'e-mail sur cette candidature");
                }
                const getCandidateResponse = yield this.candidateService.findOne({
                    where: {
                        email: getCandidateApplicationResponse === null || getCandidateApplicationResponse === void 0 ? void 0 : getCandidateApplicationResponse.candidateApplication.email,
                    },
                });
                if ((_c = getCandidateResponse.candidate) === null || _c === void 0 ? void 0 : _c.id) {
                    getCandidateApplicationResponse.candidateApplication.candidateId =
                        getCandidateResponse.candidate.id;
                    yield this.getRepository().update({
                        id: (_d = getCandidateApplicationResponse === null || getCandidateApplicationResponse === void 0 ? void 0 : getCandidateApplicationResponse.candidateApplication) === null || _d === void 0 ? void 0 : _d.id,
                    }, { candidateId: getCandidateResponse.candidate.id });
                }
                response.candidateApplication = {
                    id: (_e = getCandidateApplicationResponse === null || getCandidateApplicationResponse === void 0 ? void 0 : getCandidateApplicationResponse.candidateApplication) === null || _e === void 0 ? void 0 : _e.id,
                    candidateId: getCandidateApplicationResponse.candidateApplication
                        .candidateId,
                };
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    generateGuidExchangeAndSendEmail(candidateApplicationId) {
        const _super = Object.create(null, {
            findOne: { get: () => super.findOne },
            createOrUpdate: { get: () => super.createOrUpdate }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const response = new candidate_application_dto_1.GuidExchangeResponse();
            try {
                const getApplication = yield _super.findOne.call(this, {
                    where: { id: candidateApplicationId },
                });
                if (!getApplication.success) {
                    throw new app_error_1.AppErrorWithMessage('Unable to find candidate application');
                }
                const applicationDto = getApplication.candidateApplication;
                applicationDto.guidExchange = nextalys_js_helpers_1.MainHelpers.generateGuid();
                const save = yield _super.createOrUpdate.call(this, applicationDto);
                if (!save.success) {
                    throw new app_error_1.AppErrorWithMessage(save.message);
                }
                yield this.sendPrivateExchangeLinkToCandidateApplication(null, applicationDto);
                response.guid = applicationDto.guidExchange;
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    sendPrivateExchangeLinkToCandidateApplication(candidateApplicationId, candidateApplication) {
        const _super = Object.create(null, {
            findOne: { get: () => super.findOne }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                let applicationDto = new candidate_application_dto_1.CandidateApplicationDto();
                if (!candidateApplicationId && (candidateApplication === null || candidateApplication === void 0 ? void 0 : candidateApplication.id)) {
                    applicationDto = candidateApplication;
                }
                else {
                    const getApplication = yield _super.findOne.call(this, {
                        where: { id: candidateApplicationId },
                        relations: ['addresses'],
                    });
                    if (!getApplication.success ||
                        !getApplication.candidateApplication) {
                        throw new app_error_1.AppErrorWithMessage('Unable to find candidate application');
                    }
                    applicationDto = getApplication.candidateApplication;
                }
                if (!(applicationDto === null || applicationDto === void 0 ? void 0 : applicationDto.email)) {
                    throw new common_1.InternalServerErrorException('Cannot send mail for job application exchange : no email');
                }
                if (!(applicationDto === null || applicationDto === void 0 ? void 0 : applicationDto.guidExchange)) {
                    throw new common_1.InternalServerErrorException('Unable to find guid');
                }
                const candidateLanguageCode = candidates_helpers_1.SharedCandidatesHelpers.getLanguageFromCandidateApplication(applicationDto);
                const generatedLink = environment_1.Environment.BaseURL +
                    '/' +
                    routes_1.RoutesList.AnonymousExchange +
                    '/p/' +
                    applicationDto.guidExchange;
                const mailData = {
                    from: { address: environment_1.Environment.MailSender },
                    to: [
                        {
                            address: applicationDto.email,
                            contactFirstName: applicationDto.firstName,
                            contactLastName: applicationDto.lastName,
                            contactPhone: applicationDto.phone,
                            name: applicationDto.firstName +
                                ' ' +
                                applicationDto.lastName,
                        },
                    ],
                    subject: yield translation_service_1.TranslationService.getTranslation(candidateLanguageCode, 'Email.AnonymousExchangeSubject'),
                    templateName: 'mail_private_exchange.mjml',
                    templateValues: {
                        link: generatedLink,
                        language: candidateLanguageCode,
                    },
                    useHandleBars: true,
                    compileMjmlTemplate: true,
                };
                const sendMailResponse = yield this.mailService.sendMail(mailData);
                if (!sendMailResponse.success) {
                    throw new app_error_1.AppErrorWithMessage(sendMailResponse.message);
                }
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    setCandidateApplicationUnseen(candidateApplicationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse(true);
            try {
                const candidate = yield this.repository.findOne({
                    where: { id: candidateApplicationId },
                });
                if (!candidate) {
                    throw new app_error_1.AppErrorWithMessage('Invalid candidateApplicationId');
                }
                candidate.seen = false;
                this.repository.save(candidate);
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    sendCandidateApplicationReceivedMail(candidateApplication, request, consultantEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(candidateApplication === null || candidateApplication === void 0 ? void 0 : candidateApplication.email)) {
                return;
            }
            if (!request) {
                request = { language: 'en' };
            }
            if (request.language !== 'fr' && request.language !== 'en') {
                request.language = 'en';
            }
            const mailContentWrapper = mail_content_1.MailContent.getMailContentAndSubject('NewCandidateApplication', false, request.language);
            const mailSender = candidates_helpers_1.SharedCandidatesHelpers.getMailSenderFromCandidateApplication(candidateApplication, request.language, consultantEmail);
            let recipientName = (candidateApplication.firstName || '') +
                ' ' +
                (candidateApplication.lastName || '');
            recipientName = recipientName.trim();
            if (!recipientName) {
                recipientName = candidateApplication.email;
            }
            yield this.mailService.sendMailWithGenericTemplate({
                subject: mailContentWrapper.subject,
                from: { address: mailSender },
                to: [{ address: candidateApplication.email, name: recipientName }],
                htmlBody: mailContentWrapper.content,
                templateValues: { language: request.language },
            });
        });
    }
    getIsoDateFileName(date) {
        let isoDate = nextalys_js_helpers_1.DateHelpers.formatDateISO8601(date, false);
        isoDate = nextalys_js_helpers_1.MainHelpers.replaceAll(isoDate, 'T', '-');
        isoDate = nextalys_js_helpers_1.MainHelpers.replaceAll(isoDate, ':', '-');
        return isoDate;
    }
    exportNanniesApplicationsBase(sendMail, minDate, maxDate) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
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
                const codes = [shared_constants_1.ApplyStatus.Refused];
                const codesValues = yield this.referentialService.getAppValues({
                    where: [
                        { code: (0, typeorm_2.In)(codes) },
                    ],
                });
                if (((_a = codesValues === null || codesValues === void 0 ? void 0 : codesValues.appValues) === null || _a === void 0 ? void 0 : _a.length) !== 1) {
                    return;
                }
                const applicationRefusedValue = codesValues.appValues.find((x) => x.code === shared_constants_1.ApplyStatus.Refused);
                if (!(applicationRefusedValue === null || applicationRefusedValue === void 0 ? void 0 : applicationRefusedValue.id)) {
                    return;
                }
                const whereObj = {
                    professionId: (0, typeorm_2.In)(jobsIds),
                    email: (0, typeorm_2.Not)((0, typeorm_2.IsNull)()),
                    newsletterUnsubscribed: false,
                    applyStatusId: applicationRefusedValue.id,
                };
                if (minDate && maxDate) {
                    whereObj.creationDate = (0, typeorm_2.Raw)((alias) => `(${alias} >= :minDate AND ${alias} <= :maxDate)`, { minDate: minDate, maxDate: maxDate });
                }
                let candidateApplicationsEntities = yield this.repository.find({
                    where: whereObj,
                    relations: ['addresses'],
                });
                candidateApplicationsEntities =
                    candidateApplicationsEntities.filter((x) => {
                        var _a;
                        return shared_service_1.SharedService.emailCanBeSent(x.email) &&
                            ((_a = x.addresses) === null || _a === void 0 ? void 0 : _a.some((y) => { var _a; return ((_a = y === null || y === void 0 ? void 0 : y.country) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'fr'; }));
                    });
                const candidateApplicationsEntitiesCopy = candidateApplicationsEntities;
                candidateApplicationsEntities = [];
                for (const candidateApplicationItem of candidateApplicationsEntitiesCopy) {
                    if (!(candidateApplicationsEntities === null || candidateApplicationsEntities === void 0 ? void 0 : candidateApplicationsEntities.some((x) => {
                        var _a, _b, _c, _d, _e, _f;
                        return ((_a = x.firstName) === null || _a === void 0 ? void 0 : _a.toLowerCase()) ===
                            ((_b = candidateApplicationItem.firstName) === null || _b === void 0 ? void 0 : _b.toLowerCase()) &&
                            ((_c = x.lastName) === null || _c === void 0 ? void 0 : _c.toLowerCase()) ===
                                ((_d = candidateApplicationItem.lastName) === null || _d === void 0 ? void 0 : _d.toLowerCase()) &&
                            ((_e = x.email) === null || _e === void 0 ? void 0 : _e.toLowerCase()) ===
                                ((_f = candidateApplicationItem.email) === null || _f === void 0 ? void 0 : _f.toLowerCase());
                    }))) {
                        candidateApplicationsEntities.push(candidateApplicationItem);
                    }
                }
                const candidateApplications = candidateApplicationsEntities.map((x) => x.toDto());
                const excelData = candidateApplications.map((x) => [
                    x.firstName,
                    x.lastName,
                    x.email,
                    x.phone,
                ]);
                excelData.unshift(['FIRSTNAME', 'LASTNAME', 'EMAIL', 'PHONE']);
                const outputFile = nextalys_node_helpers_1.FileHelpers.joinPaths(environment_1.Environment.UploadedFilesTempDirectory, nextalys_js_helpers_1.MainHelpers.generateGuid() + '.xlsx');
                excel_1.ExcelHelpers.initWithProvider(new excel_helpers_exceljs_1.ExcelHelpersExcelJs());
                const exportResponse = yield excel_1.ExcelHelpers.generateExcel({
                    output: outputFile,
                    data: excelData,
                    generationType: 'file',
                    worksheetName: 'nanny-candidatures-refusees',
                });
                if (sendMail) {
                    let mailSubject = 'Export candidatures refusées';
                    if (minDate && maxDate) {
                        mailSubject += ` du ${nextalys_js_helpers_1.DateHelpers.formatDate(minDate)} au ${nextalys_js_helpers_1.DateHelpers.formatDate(maxDate)}`;
                    }
                    let htmlBody = "Bonjour,<br/><br/>Veuillez trouver en pièce jointe l'export des candidatures refusées qui concernent les postes de Nanny.<br/>";
                    if (minDate && maxDate) {
                        htmlBody += `<br/>• Période : du ${nextalys_js_helpers_1.DateHelpers.formatDate(minDate)} au ${nextalys_js_helpers_1.DateHelpers.formatDate(maxDate)}`;
                    }
                    htmlBody += `<br/>• Nombre de candidatures : ${candidateApplications.length}`;
                    let attachmentFileName = 'candidatures-refusees-nanny.xlsx';
                    if (minDate && maxDate) {
                        attachmentFileName = `candidatures-refusees-nanny-${this.getIsoDateFileName(minDate)}_${this.getIsoDateFileName(maxDate)}.xlsx`;
                    }
                    const base64 = yield nextalys_node_helpers_1.FileHelpers.base64Encode(outputFile);
                    if (base64) {
                        const sendMailResponse = yield this.mailService.sendMailWithGenericTemplate({
                            subject: mailSubject,
                            htmlBody: htmlBody,
                            attachments: [
                                {
                                    base64Content: base64,
                                    name: attachmentFileName,
                                },
                            ],
                            from: { address: shared_constants_1.AppMainSender },
                            to: [{ address: 'olivier@morganmallet.agency' }],
                            cci: [{ address: 'david.kessas@nextalys.com' }],
                            templateValues: { language: 'fr' },
                        });
                        if (sendMailResponse.success) {
                            response.success = true;
                        }
                        else {
                            response.message = sendMailResponse.message;
                        }
                    }
                    if (yield nextalys_node_helpers_1.FileHelpers.fileExists(outputFile)) {
                        yield nextalys_node_helpers_1.FileHelpers.removeFile(outputFile);
                    }
                }
                console.log('Log ~ exportNannies ~ exportResponse:', exportResponse);
                response.success = true;
            }
            catch (error) {
                console.log('Log ~ exportNanniesApplications ~ error:', error);
                response.handleError(error);
            }
            return response;
        });
    }
    exportNanniesApplicationsLastWeek() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const lastWeek = nextalys_js_helpers_1.DateHelpers.addDaysToDate(now, -7);
            const firstDayLastWeek = nextalys_js_helpers_1.DateHelpers.getFirstDayOfWeek(lastWeek);
            const lastDayLastWeek = nextalys_js_helpers_1.DateHelpers.getLastDayOfWeek(lastWeek, true);
            return yield this.exportNanniesApplicationsBase(true, firstDayLastWeek, lastDayLastWeek);
        });
    }
    exportNanniesApplications() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.exportNanniesApplicationsBase(false, null, null);
        });
    }
};
CandidateApplicationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(candidate_application_entity_1.CandidateApplication)),
    __param(6, (0, typeorm_1.InjectRepository)(candidates_application_jobs_entity_1.CandidateApplicationJobs)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        candidates_service_1.CandidateService,
        referential_service_1.ReferentialService,
        file_service_1.FileService,
        mail_service_1.MailService,
        gcloud_storage_service_1.GCloudStorageService,
        typeorm_2.Repository])
], CandidateApplicationService);
exports.CandidateApplicationService = CandidateApplicationService;
//# sourceMappingURL=candidate-applications.service.js.map