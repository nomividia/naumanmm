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
exports.CandidateService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const linqts_1 = require("linqts");
const nextalys_js_helpers_1 = require("nextalys-js-helpers");
const excel_1 = require("nextalys-js-helpers/dist/excel");
const nextalys_node_helpers_1 = require("nextalys-node-helpers");
const excel_helpers_exceljs_1 = require("nextalys-node-helpers/dist/helpers/excel-helpers/impl/excel-helpers-exceljs");
const path = require("path");
const typeorm_2 = require("typeorm");
const candidates_helpers_1 = require("../../../shared/candidates-helpers");
const routes_1 = require("../../../shared/routes");
const shared_constants_1 = require("../../../shared/shared-constants");
const shared_service_1 = require("../../../shared/shared-service");
const address_entity_1 = require("../../entities/address.entity");
const note_item_file_entity_1 = require("../../entities/note-item-file.entity");
const note_item_entity_1 = require("../../entities/note-item.entity");
const environment_1 = require("../../environment/environment");
const app_error_1 = require("../../models/app-error");
const user_dto_1 = require("../../models/dto/user-dto");
const generic_response_1 = require("../../models/responses/generic-response");
const auth_service_1 = require("../../services/auth.service");
const base_model_service_1 = require("../../services/base-model.service");
const referential_service_1 = require("../../services/referential.service");
const file_service_1 = require("../../services/tools/file.service");
const helpers_service_1 = require("../../services/tools/helpers.service");
const mail_service_1 = require("../../services/tools/mail.service");
const translation_service_1 = require("../../services/translation.service");
const users_service_1 = require("../../services/users.service");
const mail_content_1 = require("../../shared/mail-content");
const test_types_1 = require("../../test/test-types");
const candidate_resume_service_1 = require("../candidate-resume/candidate-resume.service");
const gcloud_storage_service_1 = require("../gdrive/gcloud-storage-service");
const histories_service_1 = require("../history/histories.service");
const history_entity_1 = require("../history/history.entity");
const notifications_service_1 = require("../notifications/notifications.service");
const candidate_children_entity_1 = require("./candidate-children/candidate-children.entity");
const candidate_contract_entity_1 = require("./candidate-contract.entity");
const candidate_country_entity_1 = require("./candidate-country/candidate-country.entity");
const candidate_current_jobs_entity_1 = require("./candidate-current-jobs/candidate-current-jobs.entity");
const candidate_department_entity_1 = require("./candidate-department/candidate-department.entity");
const candidate_dto_1 = require("./candidate-dto");
const candidate_file_dto_1 = require("./candidate-file-dto");
const candidate_file_entity_1 = require("./candidate-file.entity");
const candidate_job_offer_history_service_1 = require("./candidate-job-offer-history/candidate-job-offer-history.service");
const candidate_jobs_entity_1 = require("./candidate-jobs.entity");
const candidate_language_entity_1 = require("./candidate-language/candidate-language.entity");
const candidate_licences_entity_1 = require("./candidate-licences/candidate-licences.entity");
const candidate_pet_entity_1 = require("./candidate-pets/candidate-pet.entity");
const candidate_readonly_property_entity_1 = require("./candidate-readonly/candidate-readonly-property.entity");
const candidate_entity_1 = require("./candidate.entity");
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
let CandidateService = class CandidateService extends base_model_service_1.ApplicationBaseModelService {
    constructor(repository, noteItemRepository, noteItemFileRepository, candidateJobRepository, candidateLanguageRepository, candidateChildrenRepository, candidateLicenceRepository, candidateFileRepository, candidateReadonlyPropertyRepository, candidatePetRepository, referentialService, fileService, gCloudStorageService, userService, mailService, authService, notificationsService, candidateCountryRepository, candidateDepartmentRepository, candidateContractsRepository, candidateResumeService, historiesService, historyRepository, candidateCurrentJobRepository, candidateJobOfferHistoryService) {
        super();
        this.repository = repository;
        this.noteItemRepository = noteItemRepository;
        this.noteItemFileRepository = noteItemFileRepository;
        this.candidateJobRepository = candidateJobRepository;
        this.candidateLanguageRepository = candidateLanguageRepository;
        this.candidateChildrenRepository = candidateChildrenRepository;
        this.candidateLicenceRepository = candidateLicenceRepository;
        this.candidateFileRepository = candidateFileRepository;
        this.candidateReadonlyPropertyRepository = candidateReadonlyPropertyRepository;
        this.candidatePetRepository = candidatePetRepository;
        this.referentialService = referentialService;
        this.fileService = fileService;
        this.gCloudStorageService = gCloudStorageService;
        this.userService = userService;
        this.mailService = mailService;
        this.authService = authService;
        this.notificationsService = notificationsService;
        this.candidateCountryRepository = candidateCountryRepository;
        this.candidateDepartmentRepository = candidateDepartmentRepository;
        this.candidateContractsRepository = candidateContractsRepository;
        this.candidateResumeService = candidateResumeService;
        this.historiesService = historiesService;
        this.historyRepository = historyRepository;
        this.candidateCurrentJobRepository = candidateCurrentJobRepository;
        this.candidateJobOfferHistoryService = candidateJobOfferHistoryService;
        this.modelOptions = {
            getManyResponse: candidate_dto_1.GetCandidatesResponse,
            getOneResponse: candidate_dto_1.GetCandidateResponse,
            getManyResponseField: 'candidates',
            getOneResponseField: 'candidate',
            getManyRelations: [
                'candidateStatus',
                'candidateStatus.translations',
                'gender',
            ],
            getOneRelations: [
                'relationshipStatus',
                'relationshipStatus.translations',
                'gender',
                'gender.translations',
                'candidateStatus',
                'candidateStatus.translations',
                'contractType',
                'partnerGender',
                'candidateReadonlyProperties',
            ],
            repository: this.repository,
            entity: candidate_entity_1.Candidate,
            archiveField: 'disabled',
            archiveFieldValue: true,
        };
        if (!this.authService.usersService && this.userService) {
            this.authService.usersService = this.userService;
        }
    }
    revertExpiredInProcessStatuses() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                const statusType = yield this.referentialService.getTypeValues({
                    appTypeCode: shared_constants_1.AppTypes.CandidateStatusCode,
                    includeTranslations: 'false',
                });
                const statusValues = ((_a = statusType === null || statusType === void 0 ? void 0 : statusType.appType) === null || _a === void 0 ? void 0 : _a.appValues) || [];
                const codeToId = new Map();
                for (const v of statusValues) {
                    if ((v === null || v === void 0 ? void 0 : v.code) && (v === null || v === void 0 ? void 0 : v.id))
                        codeToId.set(v.code, v.id);
                }
                const inProcessId = codeToId.get(shared_constants_1.CandidateStatus.InProcess);
                if (!inProcessId) {
                    response.success = true;
                    return response;
                }
                const inProcessCandidates = yield this.repository.find({
                    select: ['id', 'candidateStatusId'],
                    where: { candidateStatusId: inProcessId },
                });
                if (!(inProcessCandidates === null || inProcessCandidates === void 0 ? void 0 : inProcessCandidates.length)) {
                    response.success = true;
                    return response;
                }
                const now = new Date();
                let revertedCount = 0;
                for (const c of inProcessCandidates) {
                    const lastHistory = yield this.historyRepository.findOne({
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
                    if (lastHistory.valueAfter !== shared_constants_1.CandidateStatus.InProcess) {
                        continue;
                    }
                    const daysSince = nextalys_js_helpers_1.DateHelpers.daysDiff(lastHistory.date, now);
                    if (daysSince < 14) {
                        continue;
                    }
                    let revertCode = lastHistory.valueBefore;
                    if (!revertCode || revertCode === shared_constants_1.CandidateStatus.InProcess) {
                        revertCode = shared_constants_1.CandidateStatus.ToBeReferenced;
                    }
                    const revertId = codeToId.get(revertCode);
                    const fallbackId = codeToId.get(shared_constants_1.CandidateStatus.ToBeReferenced);
                    if (!revertId && !fallbackId) {
                        continue;
                    }
                    c.candidateStatusId = revertId || fallbackId;
                    yield this.repository.save(c);
                    const history = {
                        date: nextalys_js_helpers_1.DateHelpers.convertUTCDateToLocalDate(new Date()),
                        entity: 'candidate',
                        entityId: c.id,
                        field: 'candidateStatus',
                        valueBefore: shared_constants_1.CandidateStatus.InProcess,
                        valueAfter: revertCode,
                        userId: null,
                    };
                    yield this.historiesService.createOrUpdate(history);
                    revertedCount++;
                }
                response.success = true;
                response.revertedCount = revertedCount;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    uploadCandidateFilesToGdrive(dto, file, fileDto, fileTypeId, dtoField, type, upload) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let gdriveUploadResponse = new candidate_dto_1.UploadCandidateFilesToGdriveResponse();
            try {
                const targetFile = type + '/' + dto.id + '/' + fileDto.physicalName;
                if (true) {
                    if (upload) {
                        gdriveUploadResponse =
                            yield this.gCloudStorageService.uploadFile(file, null, targetFile);
                    }
                    else {
                        gdriveUploadResponse =
                            yield this.gCloudStorageService.copyFile(fileDto.externalFilePath, targetFile);
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
                    }
                    else if (type === 'candidates') {
                        const candidateDto = dto;
                        if (!candidateDto.files) {
                            candidateDto.files = [];
                        }
                        let candidateFileToUpdate = (_a = candidateDto.files) === null || _a === void 0 ? void 0 : _a.find((x) => x.file === fileDto);
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
            }
            catch (err) {
                gdriveUploadResponse.handleError(err);
            }
            return gdriveUploadResponse;
        });
    }
    createUserFromCandidate(candidate, payload, sendMail, mailCanBeNull) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let userResponse = new user_dto_1.GetUserResponse();
            try {
                if (!candidate) {
                    throw new app_error_1.AppErrorWithMessage('Impossible de trouver le candidat !');
                }
                const existingUserForCandidate = yield this.userService.usersRepository.findOne({
                    where: { candidateId: candidate.id },
                });
                if (existingUserForCandidate) {
                    if (sendMail && candidate.email) {
                        userResponse = yield this.sendEmailAccessToCandidate(existingUserForCandidate.toDto(), candidate);
                    }
                    else {
                        userResponse.success = true;
                        userResponse.user = existingUserForCandidate.toDto();
                    }
                    return userResponse;
                }
                const getCandidateOrUserMainLanguageResponse = yield candidates_helpers_1.SharedCandidatesHelpers.getCandidateOrUserMainLanguage(candidate, null, this.referentialService);
                const candidateLanguage = getCandidateOrUserMainLanguageResponse.language;
                const userDto = {
                    firstName: candidate.firstName,
                    lastName: candidate.lastName,
                    languageId: candidateLanguage === null || candidateLanguage === void 0 ? void 0 : candidateLanguage.id,
                    mail: candidate.email,
                    phone: candidate.phone,
                    roles: [
                        {
                            enabled: true,
                            role: shared_constants_1.RolesList.Candidate,
                            label: shared_constants_1.RolesList.Candidate,
                        },
                    ],
                    userName: null,
                    password: null,
                    disabled: false,
                    candidateId: candidate.id,
                    genderId: candidate.genderId,
                    imageId: (_b = (_a = candidate === null || candidate === void 0 ? void 0 : candidate.files) === null || _a === void 0 ? void 0 : _a.find((x) => { var _a; return ((_a = x.fileType) === null || _a === void 0 ? void 0 : _a.code) === shared_constants_1.CandidateFileType.MainPhoto; })) === null || _b === void 0 ? void 0 : _b.fileId,
                };
                if (!candidate.email && !mailCanBeNull) {
                    throw new app_error_1.AppErrorWithMessage('The user must have a valid e-mail address !');
                }
                if (candidate.email) {
                    const userRes = yield this.userService.usersRepository.findOne({
                        where: { mail: candidate.email },
                        select: ['id'],
                    });
                    if (userRes) {
                        throw new app_error_1.AppErrorWithMessage('User with email already exist');
                    }
                }
                userResponse = yield this.userService.createOrUpdate(userDto, false, payload);
                if (userResponse.success && candidate.email && sendMail) {
                    userResponse = yield this.sendEmailAccessToCandidate(userResponse.user, candidate);
                }
            }
            catch (err) {
                userResponse.handleError(err);
            }
            return userResponse;
        });
    }
    sendEmailAccessToCandidate(userDto, candidateDto, mailType = 'NewCandidateAccount', consultantEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = new user_dto_1.GetUserResponse();
            try {
                if (!userDto) {
                    throw new app_error_1.AppErrorWithMessage('User not found');
                }
                delete userDto.roles;
                response = yield this.authService.generateRecoverPasswordToken(userDto, false, 100);
                if (!response.success) {
                    throw new app_error_1.AppErrorWithMessage(response.message);
                }
                const getCandidateOrUserMainLanguageResponse = yield candidates_helpers_1.SharedCandidatesHelpers.getCandidateOrUserMainLanguage(candidateDto, userDto, this.referentialService);
                const candidateLanguage = getCandidateOrUserMainLanguageResponse.language;
                const mailSender = yield candidates_helpers_1.SharedCandidatesHelpers.getMailSenderFromCandidate(candidateDto, userDto, this.referentialService, consultantEmail);
                let recoverPasswordLink = environment_1.Environment.BaseURL +
                    '/' +
                    routes_1.RoutesList.RecoverPassword +
                    '/' +
                    userDto.recoverToken +
                    '?passwordcreation=1';
                if (candidateLanguage === null || candidateLanguage === void 0 ? void 0 : candidateLanguage.code) {
                    recoverPasswordLink += '?lang=' + (candidateLanguage === null || candidateLanguage === void 0 ? void 0 : candidateLanguage.code);
                }
                const mailContentWrapper = mail_content_1.MailContent.getMailContentAndSubject(mailType, true, candidateLanguage === null || candidateLanguage === void 0 ? void 0 : candidateLanguage.code, null, [recoverPasswordLink]);
                console.log('emailsend', {
                    subject: mailContentWrapper.subject,
                    from: { address: mailSender },
                    to: [{ address: userDto.mail, name: userDto.firstName }],
                    htmlBody: mailContentWrapper.content,
                    templateName: 'mail_auto',
                });
                const sendMail = yield this.mailService.sendMail({
                    subject: mailContentWrapper.subject,
                    from: { address: mailSender },
                    to: [{ address: userDto.mail, name: userDto.firstName }],
                    htmlBody: mailContentWrapper.content,
                    templateName: 'mail_auto',
                });
                if (!sendMail.success) {
                    throw new app_error_1.AppErrorWithMessage("Une erreur s'est produite lors de l'envoi du mail");
                }
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    pushRelationsListFromRequest(relations, request) {
        if (!request) {
            return relations;
        }
        if (request.includeFiles === 'true') {
        }
        if (request.includeLicences === 'true') {
            relations.push(...['candidateLicences', 'candidateLicences.licence']);
        }
        if (request.includeAddresses === 'true') {
            relations.push('addresses');
        }
        if (request.includeNoteItems === 'true') {
            relations.push(...[
                'noteItems',
                'noteItems.consultant',
                'noteItems.files',
                'noteItems.files.file',
            ]);
        }
        if (request.includeCandidateJobs === 'true') {
        }
        if (request.includeLanguages === 'true') {
            relations.push(...[
                'candidateLanguages',
                'candidateLanguages.levelLanguage',
                'candidateLanguages.levelLanguage.translations',
            ]);
        }
        if (request.includeChildren === 'true') {
            relations.push('candidateChildrens');
        }
        if (request.includeConsultant === 'true') {
            relations.push(...['consultant', 'consultant.image']);
        }
        if (request.includePets === 'true') {
            relations.push('candidatePets');
        }
        if (request.includeContracts === 'true') {
            relations.push(...[
                'candidateContracts',
                'candidateContracts.contractType',
                'candidateContracts.contractType.translations',
            ]);
        }
        if (request.includeCountries === 'true') {
        }
        if (request.includeCurrentJobs === 'true') {
            relations.push(...[
                'candidateCurrentJobs',
                'candidateCurrentJobs.currentJob',
                'candidateCurrentJobs.currentJob.translations',
                'candidateCurrentJobs.currentJob.appType',
            ]);
        }
        relations = new linqts_1.List(relations).Distinct().ToArray();
        return relations;
    }
    findOneWithRequest(request, id) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let response = new candidate_dto_1.GetCandidateResponse();
            try {
                let relations = ['gender'];
                if (request === null || request === void 0 ? void 0 : request.specificRelations) {
                    relations = request === null || request === void 0 ? void 0 : request.specificRelations.split(',');
                }
                relations = this.pushRelationsListFromRequest(relations, request);
                response = yield this.findOne({ where: { id }, relations });
                if (response.success && ((_a = response.candidate) === null || _a === void 0 ? void 0 : _a.id)) {
                    yield this.setCandidateFieldsDelayedQueries(null, response.candidate, request);
                    if ((_c = (_b = response.candidate) === null || _b === void 0 ? void 0 : _b.files) === null || _c === void 0 ? void 0 : _c.length) {
                        for (const file of response.candidate.files) {
                            if (!!(file === null || file === void 0 ? void 0 : file.file) && !file.file.name) {
                                file.file.name =
                                    candidates_helpers_1.SharedCandidatesHelpers.generateCandidateFileName(file, response.candidate, true);
                            }
                        }
                    }
                }
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    setCandidateFieldsDelayedQueries(candidate, candidateDto, getRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidateId = (candidate === null || candidate === void 0 ? void 0 : candidate.id) || (candidateDto === null || candidateDto === void 0 ? void 0 : candidateDto.id);
            if (!candidateId) {
                return;
            }
            if ((getRequest === null || getRequest === void 0 ? void 0 : getRequest.includeFiles) === 'true') {
                const candidateFiles = yield this.candidateFileRepository.find({
                    where: { candidateId: candidateId },
                    relations: ['file', 'fileType'],
                });
                if (candidate) {
                    candidate.files = candidateFiles;
                }
                if (candidateDto) {
                    candidateDto.files = candidateFiles === null || candidateFiles === void 0 ? void 0 : candidateFiles.map((x) => x.toDto());
                }
            }
            if ((getRequest === null || getRequest === void 0 ? void 0 : getRequest.includeCountries) === 'true') {
                const candidateCountries = yield this.candidateCountryRepository.find({
                    where: { candidateId: candidateId },
                });
                if (candidate) {
                    candidate.candidateCountries = candidateCountries;
                }
                if (candidateDto) {
                    candidateDto.candidateCountries = candidateCountries === null || candidateCountries === void 0 ? void 0 : candidateCountries.map((x) => x.toDto());
                }
            }
            if ((getRequest === null || getRequest === void 0 ? void 0 : getRequest.includeDepartments) === 'true') {
                const candidateDepartments = yield this.candidateDepartmentRepository.find({
                    where: { candidateId: candidateId },
                });
                if (candidate) {
                    candidate.candidateDepartments = candidateDepartments;
                }
                if (candidateDto) {
                    candidateDto.candidateDepartments = candidateDepartments === null || candidateDepartments === void 0 ? void 0 : candidateDepartments.map((x) => x.toDto());
                }
            }
            if ((getRequest === null || getRequest === void 0 ? void 0 : getRequest.includeCandidateJobs) === 'true') {
                const candidateJobs = yield this.candidateJobRepository.find({
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
                    candidateDto.candidateJobs = candidateJobs === null || candidateJobs === void 0 ? void 0 : candidateJobs.map((x) => x.toDto());
                }
            }
        });
    }
    createOrUpdate(dto, createDefaultMandatoryFiles, getRequest, payload) {
        const _super = Object.create(null, {
            createOrUpdate: { get: () => super.createOrUpdate }
        });
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
        return __awaiter(this, void 0, void 0, function* () {
            let saveResponse = new candidate_dto_1.GetCandidateResponse();
            try {
                let relations = [
                    'candidateContracts',
                    'addresses',
                    'relationshipStatus',
                    'candidateChildrens',
                    'gender',
                ];
                relations = this.pushRelationsListFromRequest(relations, getRequest);
                let candidateEntity = new candidate_entity_1.Candidate();
                let appFilesToRemove = [];
                let percentageBeforeSave;
                let isNewCandidate = false;
                const includeFiles = (getRequest === null || getRequest === void 0 ? void 0 : getRequest.includeFiles) === 'true';
                if (!includeFiles) {
                    delete dto.files;
                }
                if (dto.id) {
                    if (includeFiles) {
                        candidateEntity = yield this.repository.findOne({
                            where: { id: dto.id },
                            relations: relations,
                        });
                        yield this.setCandidateFieldsDelayedQueries(candidateEntity, null, getRequest);
                        percentageBeforeSave = this.getPercentageOfAdvancement(candidateEntity.toDto());
                        const allFilesInDb = new linqts_1.List(candidateEntity.files)
                            .Where((x) => !!x.fileId && !!x.file)
                            .Select((x) => x.fileId)
                            .Distinct()
                            .ToList();
                        if (allFilesInDb.Count() > 0) {
                            const allFilesFromFront = new linqts_1.List(dto.files)
                                .Where((x) => !!x.fileId)
                                .Select((x) => x.fileId)
                                .Distinct()
                                .ToList();
                            const fileIdsToRemove = allFilesInDb.Except(allFilesFromFront);
                            if (fileIdsToRemove.Count() > 0) {
                                appFilesToRemove = new linqts_1.List(candidateEntity.files)
                                    .Where((x) => {
                                    var _a;
                                    return fileIdsToRemove.Contains(x.fileId) &&
                                        !!((_a = x.file) === null || _a === void 0 ? void 0 : _a.externalFilePath);
                                })
                                    .Select((x) => x.file.toDto())
                                    .ToArray();
                            }
                        }
                    }
                }
                else {
                    isNewCandidate = true;
                    const toBeReferencedStatutId = yield this.referentialService.getOneAppValue(shared_constants_1.CandidateStatus.ToBeReferenced, shared_constants_1.AppTypes.CandidateStatusCode);
                    if (!toBeReferencedStatutId.success) {
                        throw new app_error_1.AppErrorWithMessage(toBeReferencedStatutId.message);
                    }
                    if (!dto.candidateStatusId) {
                        dto.candidateStatusId = (_a = toBeReferencedStatutId.appValue) === null || _a === void 0 ? void 0 : _a.id;
                    }
                    if (createDefaultMandatoryFiles) {
                        yield this.createMandatoryCandidateFilesForCandidate(dto, true);
                    }
                }
                const getMainPhotoTypeResponse = yield this.referentialService.getAppValues({
                    where: { code: shared_constants_1.CandidateFileType.MainPhoto },
                });
                const mainPhotoType = getMainPhotoTypeResponse.appValues.find((x) => x.code === shared_constants_1.CandidateFileType.MainPhoto);
                let hasNewMainPhoto = false;
                if (dto.id &&
                    getRequest.includeFiles === 'true' &&
                    ((_b = dto.files) === null || _b === void 0 ? void 0 : _b.length)) {
                    for (const fileWrapper of dto.files) {
                        if (fileWrapper.file &&
                            !fileWrapper.file.physicalName &&
                            !fileWrapper.file.name &&
                            !fileWrapper.file.externalFilePath &&
                            !fileWrapper.file.size) {
                            fileWrapper.file = null;
                        }
                        if ((fileWrapper === null || fileWrapper === void 0 ? void 0 : fileWrapper.file) && !fileWrapper.file.mimeType) {
                            fileWrapper.file.mimeType = 'text/plain';
                        }
                        if (!fileWrapper.fileId &&
                            ((_c = fileWrapper.file) === null || _c === void 0 ? void 0 : _c.physicalName) &&
                            fileWrapper.fileTypeId) {
                            const tempFilePath = this.fileService.joinPaths(environment_1.Environment.UploadedFilesTempDirectory, (_d = fileWrapper.file) === null || _d === void 0 ? void 0 : _d.physicalName);
                            if (!(yield nextalys_node_helpers_1.FileHelpers.fileExists(tempFilePath))) {
                                continue;
                            }
                            const uploadOnGDriveResponse = yield this.uploadCandidateFilesToGdrive(dto, tempFilePath, fileWrapper.file, null, null, 'candidates', true);
                            if (!uploadOnGDriveResponse.success) {
                                throw new app_error_1.AppErrorWithMessage(uploadOnGDriveResponse.message);
                            }
                            if (fileWrapper.fileTypeId !== mainPhotoType.id) {
                                yield nextalys_node_helpers_1.FileHelpers.removeFile(tempFilePath);
                            }
                            hasNewMainPhoto =
                                fileWrapper.fileTypeId === mainPhotoType.id;
                        }
                    }
                }
                if (dto.id && ((_e = dto.noteItems) === null || _e === void 0 ? void 0 : _e.length)) {
                    for (const noteItem of dto.noteItems) {
                        if ((_f = noteItem.files) === null || _f === void 0 ? void 0 : _f.length) {
                            for (const noteItemFile of noteItem.files) {
                                if (!((_g = noteItemFile.file) === null || _g === void 0 ? void 0 : _g.physicalName) ||
                                    ((_h = noteItemFile.file) === null || _h === void 0 ? void 0 : _h.externalFilePath) ||
                                    noteItemFile.fileId) {
                                    continue;
                                }
                                const tempFilePath = this.fileService.joinPaths(environment_1.Environment.UploadedFilesTempDirectory, noteItemFile.file.physicalName);
                                if (!(yield nextalys_node_helpers_1.FileHelpers.fileExists(tempFilePath))) {
                                    continue;
                                }
                                const targetFile = `note-item-files/${dto.id}/${noteItemFile.file.physicalName}`;
                                const uploadResponse = yield this.gCloudStorageService.uploadFile(tempFilePath, null, targetFile);
                                if (!uploadResponse.success) {
                                    throw new app_error_1.AppErrorWithMessage(uploadResponse.message);
                                }
                                noteItemFile.file.externalFilePath =
                                    uploadResponse.file.name;
                                yield nextalys_node_helpers_1.FileHelpers.removeFile(tempFilePath);
                            }
                        }
                    }
                }
                saveResponse = yield _super.createOrUpdate.call(this, dto);
                if (saveResponse.success) {
                    if (includeFiles) {
                        const candidateOldEntity = {
                            id: candidateEntity.id,
                            mainPhoto: (_k = (_j = candidateEntity.files) === null || _j === void 0 ? void 0 : _j.find((x) => x.fileTypeId === mainPhotoType.id)) === null || _k === void 0 ? void 0 : _k.file,
                            mainPhotoId: (_o = (_m = (_l = candidateEntity.files) === null || _l === void 0 ? void 0 : _l.find((x) => x.fileTypeId === mainPhotoType.id)) === null || _m === void 0 ? void 0 : _m.file) === null || _o === void 0 ? void 0 : _o.id,
                        };
                        const dtoTest = {
                            id: dto.id,
                            mainPhoto: (_q = (_p = dto.files) === null || _p === void 0 ? void 0 : _p.find((x) => x.fileTypeId === mainPhotoType.id)) === null || _q === void 0 ? void 0 : _q.file,
                            mainPhotoId: (_t = (_s = (_r = dto.files) === null || _r === void 0 ? void 0 : _r.find((x) => x.fileTypeId === mainPhotoType.id)) === null || _s === void 0 ? void 0 : _s.file) === null || _t === void 0 ? void 0 : _t.id,
                        };
                        this.fileService.handleFileUpload(candidateOldEntity, dtoTest, 'mainPhoto', path.join(environment_1.Environment.CandidatesPublicDirectory, saveResponse.candidate.id));
                    }
                    if (saveResponse.success) {
                        saveResponse.candidate.userAlreadyExist =
                            dto.userAlreadyExist;
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
                            yield helpers_service_1.ApiMainHelpers.removeOrphanChildren(repository, 'candidateId');
                        }
                        yield helpers_service_1.ApiMainHelpers.removeOrphanChildren(this.candidateFileRepository, 'fileTypeId');
                        if (saveResponse.candidate) {
                            saveResponse.candidate.candidateAdvancementPercent =
                                this.getPercentageOfAdvancement(saveResponse.candidate).percentage;
                            saveResponse.candidate.candidateFieldsMiss =
                                this.getPercentageOfAdvancement(saveResponse.candidate).fieldsMissed;
                        }
                    }
                    if (appFilesToRemove === null || appFilesToRemove === void 0 ? void 0 : appFilesToRemove.length) {
                        if (environment_1.Environment.EnvName === 'production') {
                            for (const appFileDto of appFilesToRemove.filter((x) => !!x.externalFilePath)) {
                                yield this.gCloudStorageService.deleteFile(appFileDto.externalFilePath);
                            }
                        }
                        yield this.fileService
                            .getRepository()
                            .delete(appFilesToRemove.map((x) => x.id));
                    }
                    if (!isNewCandidate &&
                        percentageBeforeSave &&
                        percentageBeforeSave.percentage !==
                            saveResponse.candidate.candidateAdvancementPercent &&
                        saveResponse.candidate.candidateAdvancementPercent >= 100) {
                        let notifReceiverId = saveResponse.candidate.consultantId;
                        if (!notifReceiverId) {
                        }
                        if (notifReceiverId) {
                            let languageCode = shared_constants_1.defaultAppLanguage;
                            yield this.notificationsService.sendNotification(translation_service_1.TranslationService.getTranslation(languageCode, 'Menu.Candidate') +
                                (saveResponse.candidate.firstName || '') +
                                ' ' +
                                (saveResponse.candidate.lastName || '') +
                                translation_service_1.TranslationService.getTranslation(languageCode, 'Global.HasCompletedFile'), [notifReceiverId], [], false, '/candidats/' + saveResponse.candidate.id);
                        }
                    }
                    if (includeFiles) {
                        const candidateFilesToDelete = [];
                        for (const file of dto.files) {
                            if (!file.isMandatory &&
                                (!file.fileId ||
                                    ((file === null || file === void 0 ? void 0 : file.file) &&
                                        !((_u = file === null || file === void 0 ? void 0 : file.file) === null || _u === void 0 ? void 0 : _u.externalFilePath) &&
                                        !((_v = file === null || file === void 0 ? void 0 : file.file) === null || _v === void 0 ? void 0 : _v.physicalName) &&
                                        !((_w = file === null || file === void 0 ? void 0 : file.file) === null || _w === void 0 ? void 0 : _w.externalId)))) {
                                candidateFilesToDelete.push(file);
                            }
                        }
                        if (candidateFilesToDelete.length) {
                            yield this.candidateFileRepository.delete(candidateFilesToDelete.map((x) => x.id));
                        }
                        dto.files = dto.files.filter((x) => !candidateFilesToDelete.some((y) => y.id === x.id));
                    }
                    if (dto.candidateStatus &&
                        dto.candidateStatus.code !==
                            ((_y = (_x = saveResponse.candidate) === null || _x === void 0 ? void 0 : _x.candidateStatus) === null || _y === void 0 ? void 0 : _y.code) &&
                        !!(payload === null || payload === void 0 ? void 0 : payload.id)) {
                        const now = new Date();
                        const history = {
                            date: nextalys_js_helpers_1.DateHelpers.convertUTCDateToLocalDate(now),
                            entity: 'candidate',
                            entityId: dto.id,
                            field: 'candidateStatus',
                            valueBefore: dto.candidateStatus.code,
                            valueAfter: saveResponse.candidate.candidateStatus.code,
                            userId: payload.id,
                        };
                        const historyResponse = yield this.historiesService.createOrUpdate(history);
                    }
                }
                if (saveResponse.success) {
                    const getCandidateResponse = yield this.findOneWithRequest(getRequest, saveResponse.candidate.id);
                    saveResponse.candidate = getCandidateResponse.candidate;
                }
                saveResponse.hasNewMainPhoto = hasNewMainPhoto;
            }
            catch (err) {
                saveResponse.handleError(err);
            }
            return saveResponse;
        });
    }
    setCandidateFilters(request, findOptions) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const candidateFiltersById = [];
            const candidateFiltersByIdParams = {};
            if (request.search) {
                if (!findOptions.where || !findOptions.where.length) {
                    findOptions.where = [];
                }
                const searchTrimmed = request.search.trim();
                if (searchTrimmed) {
                    findOptions.where.push({
                        lastName: (0, typeorm_2.Like)('%' + searchTrimmed + '%'),
                    });
                    findOptions.where.push({
                        firstName: (0, typeorm_2.Like)('%' + searchTrimmed + '%'),
                    });
                    findOptions.where.push({
                        email: (0, typeorm_2.Like)('%' + searchTrimmed + '%'),
                    });
                }
            }
            if (!findOptions.where || !findOptions.where.length) {
                findOptions.where = [{}];
            }
            if (request.candidateMinYear && request.candidateMaxYear) {
                for (const whereFilter of findOptions.where) {
                    whereFilter.birthDate = (0, typeorm_2.Raw)((alias) => `(${alias} <= '${nextalys_js_helpers_1.DateHelpers.formatDateISO8601(request.candidateMinYear, false)}' AND ${alias} >= '${nextalys_js_helpers_1.DateHelpers.formatDateISO8601(request.candidateMaxYear)}' )`);
                }
            }
            if (request.candidateStatut) {
                const statusIds = request.candidateStatut.split(',');
                if (statusIds.length) {
                    for (const whereFilter of findOptions.where) {
                        whereFilter.candidateStatusId = (0, typeorm_2.In)(statusIds);
                    }
                }
            }
            if (request.jobIds) {
                const jobIds = request.jobIds.split(',');
                if (jobIds.length) {
                    candidateFiltersById.push(`([nxsAliasCandidateId] IN (SELECT candidateId FROM \`candidate-current-jobs\` WHERE currentJobId IN ("${jobIds.join('","')}")))`);
                }
            }
            if (request.candidateLocation) {
                const locationCode = request.candidateLocation.split(',');
                if (locationCode.length) {
                    const addressTableName = (0, typeorm_2.getManager)().getRepository(address_entity_1.Address).metadata.tableName;
                    candidateFiltersById.push(`([nxsAliasCandidateId] IN (SELECT candidateId FROM \`${addressTableName}\` WHERE country IN("${locationCode.join('","')}") ))`);
                }
            }
            if (request.city) {
                const addressTableName = (0, typeorm_2.getManager)().getRepository(address_entity_1.Address).metadata.tableName;
                let cityArray;
                if (Array.isArray(request.city)) {
                    cityArray = request.city;
                }
                else if (typeof request.city === 'string') {
                    cityArray = request.city
                        .split(',')
                        .filter((city) => city.trim());
                }
                else {
                    cityArray = [];
                }
                if (cityArray.length > 0) {
                    const cityConditions = cityArray
                        .map((city) => `city LIKE '%${city.trim()}%'`)
                        .join(' OR ');
                    candidateFiltersById.push(`([nxsAliasCandidateId]  IN (SELECT candidateId FROM \`${addressTableName}\` WHERE (${cityConditions})  ))`);
                }
            }
            if (request.department) {
                const addressTableName = (0, typeorm_2.getManager)().getRepository(address_entity_1.Address).metadata.tableName;
                candidateFiltersById.push(`([nxsAliasCandidateId]  IN (SELECT candidateId FROM \`${addressTableName}\` WHERE ((department LIKE :reqDptLike) OR (SUBSTRING(postalCode,1,2)=:reqDptExact))   ))`);
                candidateFiltersByIdParams.reqDptLike =
                    '%' + request.department + '%';
                candidateFiltersByIdParams.reqDptExact = request.department;
            }
            if (request.candidateGender) {
                if (request.candidateGender) {
                    for (const whereFilter of findOptions.where) {
                        whereFilter.genderId = request.candidateGender;
                    }
                }
            }
            if (request.candidateNationality) {
                for (const whereFilter of findOptions.where) {
                    whereFilter.nationality = (0, typeorm_2.Like)('%' + request.candidateNationality + '%');
                }
            }
            if (request.jobHoused) {
                for (const whereFilter of findOptions.where) {
                    whereFilter.isJobHoused = request.jobHoused;
                }
            }
            if (request.driverLicence) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                if (request.driverLicence === 'true') {
                    for (const whereFilter of findOptions.where) {
                        whereFilter.hasLicenceDriver = true;
                    }
                }
                else {
                    for (const whereFilter of findOptions.where) {
                        whereFilter.hasLicenceDriver = false;
                    }
                }
            }
            if (request.mobilityCountries) {
                const countryCode = request.mobilityCountries.split(',');
                if (countryCode.length) {
                    const candidateCountryTableName = (0, typeorm_2.getManager)().getRepository(candidate_country_entity_1.CandidateCountry).metadata
                        .tableName;
                    candidateFiltersById.push(`(
                    ([nxsAliasCandidateId] IN (SELECT id FROM \`${this.getRepository().metadata.tableName}\` WHERE globalMobility = 1))
                    OR
                    ([nxsAliasCandidateId] IN (SELECT candidateId FROM \`${candidateCountryTableName}\` WHERE country IN("${countryCode.join('","')}")))
                    )`);
                }
            }
            if (request.mobilityDepartments) {
                const departments = request.mobilityDepartments.split(',');
                const firstDpt = departments === null || departments === void 0 ? void 0 : departments[0];
                if (firstDpt) {
                    const candidateDepartmentTableName = (0, typeorm_2.getManager)().getRepository(candidate_department_entity_1.CandidateDepartment).metadata
                        .tableName;
                    const addressTableName = (0, typeorm_2.getManager)().getRepository(address_entity_1.Address).metadata.tableName;
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
                    for (const whereFilter of findOptions.where) {
                        whereFilter.isAvailable = true;
                    }
                }
                else {
                    for (const whereFilter of findOptions.where) {
                        whereFilter.isAvailable = false;
                    }
                }
            }
            if (request.pets) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                if (request.pets === 'true') {
                    for (const whereFilter of findOptions.where) {
                        whereFilter.animal = true;
                    }
                }
                else {
                    for (const whereFilter of findOptions.where) {
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
                    const getCandidateContracts = yield this.candidateContractsRepository.find({
                        where: { contractTypeId: (0, typeorm_2.In)(statusIds) },
                    });
                    const candidateIds = getCandidateContracts.map((x) => x.candidateId);
                    if (!(candidateIds === null || candidateIds === void 0 ? void 0 : candidateIds.length)) {
                        return false;
                    }
                    candidateFiltersById.push(`([nxsAliasCandidateId] IN ('${candidateIds.join("','")}'))`);
                }
            }
            if (request.licencesIds) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                const licenceIds = request.licencesIds.split(',');
                if (licenceIds.length) {
                    candidateFiltersById.push(`([nxsAliasCandidateId] IN (SELECT candidateId FROM \`candidate-licences\` WHERE licenceId IN("${licenceIds.join('","')}") ))`);
                }
            }
            if (request.languagesIds) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                const languagesIds = request.languagesIds.split(',');
                if (languagesIds.length) {
                    candidateFiltersById.push(`([nxsAliasCandidateId] IN (SELECT candidateId FROM \`candidate-language\` WHERE languageCode IN ("${languagesIds.join('","')}")))`);
                }
            }
            if ((_a = request.languages) === null || _a === void 0 ? void 0 : _a.length) {
                const where = [];
                for (const item of request.languages) {
                    const whereToPush = {
                        languageCode: item.language,
                    };
                    if (item.level) {
                        whereToPush.levelLanguageId = item.level;
                    }
                    where.push(whereToPush);
                }
                const candidateLanguages = yield this.candidateLanguageRepository.find({ where });
                const candidateLanguageCandidateIds = [
                    ...candidateLanguages.map((x) => x.candidateId),
                ];
                if (candidateLanguageCandidateIds === null || candidateLanguageCandidateIds === void 0 ? void 0 : candidateLanguageCandidateIds.length) {
                    candidateFiltersById.push(`([nxsAliasCandidateId] IN ("${candidateLanguageCandidateIds.join('","')}"))`);
                }
                else {
                    return false;
                }
            }
            if (request.childrenMinAge || request.childrenMaxAge) {
                if (request.childrenMinAge && request.childrenMaxAge) {
                    candidateFiltersById.push(`([nxsAliasCandidateId] IN (SELECT candidateId FROM \`candidate-children\` WHERE age >= '${request.childrenMinAge}' AND age <= '${request.childrenMaxAge}'))`);
                }
                else if (request.childrenMinAge && !request.childrenMaxAge) {
                    candidateFiltersById.push(`([nxsAliasCandidateId] IN (SELECT candidateId FROM \`candidate-children\` WHERE age >= '${request.childrenMinAge}'))`);
                }
            }
            if (!request.childrenMinAge && request.childrenMaxAge === '0') {
                findOptions.where = [{ hasNoChildren: true }];
            }
            if (request.isVehicle) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                if (request.isVehicle === 'true') {
                    for (const whereFilter of findOptions.where) {
                        whereFilter.isVehicle = true;
                    }
                }
                else {
                    for (const whereFilter of findOptions.where) {
                        whereFilter.isVehicle = false;
                    }
                }
            }
            if (request.consultantIds) {
                const consultantIds = request.consultantIds.split(',');
                if (consultantIds === null || consultantIds === void 0 ? void 0 : consultantIds.length) {
                    if (!findOptions.where) {
                        findOptions.where = [{}];
                    }
                    if (request.includeUnassignedCandidates === 'true') {
                        const existingWhereConditions = [
                            ...findOptions.where,
                        ];
                        findOptions.where = [];
                        for (const existingCondition of existingWhereConditions) {
                            findOptions.where.push(Object.assign(Object.assign({}, existingCondition), { consultantId: (0, typeorm_2.In)(consultantIds) }));
                            findOptions.where.push(Object.assign(Object.assign({}, existingCondition), { consultantId: (0, typeorm_2.IsNull)() }));
                        }
                    }
                    else {
                        for (const whereFilter of findOptions.where) {
                            whereFilter.consultantId = (0, typeorm_2.In)(consultantIds);
                        }
                    }
                }
            }
            if (request.candidateIdsFromReferences) {
                const ids = request.candidateIdsFromReferences.split(',');
                if (ids === null || ids === void 0 ? void 0 : ids.length) {
                    candidateFiltersById.push(`([nxsAliasCandidateId] IN ('${ids.join("','")}') )`);
                }
            }
            if (request.globalMobility) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                if (request.globalMobility === 'true') {
                    for (const whereFilter of findOptions.where) {
                        whereFilter.globalMobility = true;
                    }
                }
                else {
                    for (const whereFilter of findOptions.where) {
                        whereFilter.globalMobility = false;
                    }
                }
            }
            if (request.note) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                for (const whereFilter of findOptions.where) {
                    whereFilter.note = request.note;
                }
            }
            if (request.hasManyTravel) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                if (request.hasManyTravel === 'true') {
                    for (const whereFilter of findOptions.where) {
                        whereFilter.hasManyTravel = true;
                    }
                }
                else {
                    for (const whereFilter of findOptions.where) {
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
            for (const whereFilter of findOptions.where) {
                whereFilter.disabled = request.disabled === 'true';
            }
            if (candidateFiltersById === null || candidateFiltersById === void 0 ? void 0 : candidateFiltersById.length) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                for (const whereFilter of findOptions.where) {
                    whereFilter.id = (0, typeorm_2.Raw)((alias) => {
                        const concatQuery = '(' + candidateFiltersById.join(') AND (') + ')';
                        const finalQuery = nextalys_js_helpers_1.MainHelpers.replaceAll(concatQuery, '[nxsAliasCandidateId]', alias);
                        return finalQuery;
                    }, candidateFiltersByIdParams);
                }
            }
            return true;
        });
    }
    findAllForList(request) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new candidate_dto_1.GetCandidatesResponse();
            try {
                let queryBuilder = this.repository
                    .createQueryBuilder('candidate')
                    .leftJoinAndSelect('candidate.candidateStatus', 'candidateStatus')
                    .leftJoinAndSelect('candidate.addresses', 'addresses')
                    .leftJoinAndSelect('candidate.candidateCurrentJobs', 'candidateCurrentJobs')
                    .leftJoinAndSelect('candidateCurrentJobs.currentJob', 'currentJob')
                    .leftJoinAndSelect('currentJob.translations', 'currentJobTranslations')
                    .leftJoinAndSelect('candidate.noteItems', 'noteItems')
                    .leftJoinAndSelect('noteItems.consultant', 'noteConsultant')
                    .leftJoinAndSelect('noteItems.files', 'noteItemFiles')
                    .leftJoinAndSelect('noteItemFiles.file', 'noteItemFile');
                queryBuilder = yield this.applyOptimizedFilters(queryBuilder, request);
                if (!queryBuilder) {
                    response.success = true;
                    response.candidates = [];
                    return response;
                }
                const orderBy = request.orderby || 'creationDate';
                const order = ((_a = request.order) === null || _a === void 0 ? void 0 : _a.toUpperCase()) === 'ASC' ? 'ASC' : 'DESC';
                queryBuilder.orderBy(`candidate.${orderBy}`, order);
                const start = request.start || 0;
                const length = request.length || 50;
                queryBuilder.skip(start).take(length);
                const [candidates, totalCount] = yield queryBuilder.getManyAndCount();
                response.filteredResults = totalCount;
                if (totalCount === 0) {
                    response.success = true;
                    response.candidates = [];
                    return response;
                }
                const candidatesIds = candidates.map((x) => x.id);
                if (candidatesIds === null || candidatesIds === void 0 ? void 0 : candidatesIds.length) {
                    const jobsList = yield this.candidateJobRepository.find({
                        where: { candidateId: (0, typeorm_2.In)(candidatesIds), inActivity: true },
                        relations: ['job'],
                    });
                    const filesList = yield this.candidateFileRepository.find({
                        where: { candidateId: (0, typeorm_2.In)(candidatesIds) },
                        relations: ['fileType', 'file'],
                    });
                    for (const candidate of candidates) {
                        const candidateJobs = jobsList.filter((x) => x.candidateId === candidate.id);
                        const candidateFiles = filesList.filter((x) => x.candidateId === candidate.id);
                        candidate.candidateJobs = candidateJobs;
                        candidate.files = candidateFiles;
                    }
                }
                response.candidates = candidates.map((x) => x.toDto());
                response.success = true;
                return response;
            }
            catch (err) {
                response.handleError(err);
                return response;
            }
        });
    }
    applyOptimizedFilters(queryBuilder, request) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const disabled = request.disabled === 'true';
            queryBuilder.andWhere('candidate.disabled = :disabled', { disabled });
            if (request.search && request.search.trim()) {
                const searchTrimmed = request.search.trim();
                queryBuilder.andWhere(`(candidate.lastName LIKE :search
                  OR candidate.firstName LIKE :search
                  OR candidate.email LIKE :search
                  OR candidate.additionalEmails LIKE :search
                  OR CONCAT(candidate.firstName, ' ', candidate.lastName) LIKE :search
                  OR CONCAT(candidate.lastName, ' ', candidate.firstName) LIKE :search)`, { search: `%${searchTrimmed}%` });
            }
            if (request.candidateStatut) {
                const statusIds = request.candidateStatut.split(',');
                queryBuilder.andWhere('candidate.candidateStatusId IN (:...statusIds)', { statusIds });
            }
            if (request.candidateGender) {
                queryBuilder.andWhere('candidate.genderId = :genderId', {
                    genderId: request.candidateGender,
                });
            }
            if (request.candidateNationality) {
                queryBuilder.andWhere('candidate.nationality LIKE :nationality', {
                    nationality: `%${request.candidateNationality}%`,
                });
            }
            if (request.candidateMinYear && request.candidateMaxYear) {
                queryBuilder.andWhere('candidate.birthDate <= :minYear AND candidate.birthDate >= :maxYear', {
                    minYear: request.candidateMinYear,
                    maxYear: request.candidateMaxYear,
                });
            }
            if (request.jobHoused) {
                queryBuilder.andWhere('candidate.isJobHoused = :jobHoused', {
                    jobHoused: request.jobHoused,
                });
            }
            if (request.driverLicence) {
                queryBuilder.andWhere('candidate.hasLicenceDriver = :driverLicence', {
                    driverLicence: request.driverLicence === 'true',
                });
            }
            if (request.isAvailable) {
                queryBuilder.andWhere('candidate.isAvailable = :isAvailable', {
                    isAvailable: request.isAvailable === 'true',
                });
            }
            if (request.pets) {
                queryBuilder.andWhere('candidate.animal = :animal', {
                    animal: request.pets === 'true',
                });
            }
            if (request.isVehicle) {
                queryBuilder.andWhere('candidate.isVehicle = :isVehicle', {
                    isVehicle: request.isVehicle === 'true',
                });
            }
            if (request.consultantIds) {
                const consultantIds = request.consultantIds.split(',');
                if (request.includeUnassignedCandidates === 'true') {
                    queryBuilder.andWhere('(candidate.consultantId IN (:...consultantIds) OR candidate.consultantId IS NULL)', { consultantIds });
                }
                else {
                    queryBuilder.andWhere('candidate.consultantId IN (:...consultantIds)', { consultantIds });
                }
            }
            if (request.globalMobility) {
                queryBuilder.andWhere('candidate.globalMobility = :globalMobility', {
                    globalMobility: request.globalMobility === 'true',
                });
            }
            if (request.note) {
                queryBuilder.andWhere('candidate.note = :note', {
                    note: request.note,
                });
            }
            if (request.hasManyTravel &&
                (request.hasManyTravel === 'true' ||
                    request.hasManyTravel === 'false')) {
                queryBuilder.andWhere('candidate.hasManyTravel = :hasManyTravel', {
                    hasManyTravel: request.hasManyTravel === 'true',
                });
            }
            if (request.candidateLocation) {
                const locationCodes = request.candidateLocation.split(',');
                queryBuilder.andWhere('addresses.country IN (:...locationCodes)', {
                    locationCodes,
                });
            }
            if (request.city) {
                let cityArray;
                if (Array.isArray(request.city)) {
                    cityArray = request.city;
                }
                else if (typeof request.city === 'string') {
                    cityArray = request.city
                        .split(',')
                        .filter((city) => city.trim());
                }
                else {
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
            if (request.department) {
                queryBuilder.andWhere('(addresses.department LIKE :deptLike OR SUBSTRING(addresses.postalCode, 1, 2) = :deptExact)', {
                    deptLike: `%${request.department}%`,
                    deptExact: request.department,
                });
            }
            if (request.jobIds) {
                const jobIds = request.jobIds.split(',');
                queryBuilder
                    .innerJoin('candidate.candidateCurrentJobs', 'filterCurrentJobs')
                    .andWhere('filterCurrentJobs.currentJobId IN (:...jobIds)', {
                    jobIds,
                });
            }
            if (request.childrenMinAge || request.childrenMaxAge) {
                if (request.childrenMinAge && request.childrenMaxAge) {
                    queryBuilder.andWhere(`candidate.id IN (SELECT candidateId FROM \`candidate-children\` WHERE age >= :childrenMinAge AND age <= :childrenMaxAge)`, {
                        childrenMinAge: request.childrenMinAge,
                        childrenMaxAge: request.childrenMaxAge,
                    });
                }
                else if (request.childrenMinAge && !request.childrenMaxAge) {
                    queryBuilder.andWhere(`candidate.id IN (SELECT candidateId FROM \`candidate-children\` WHERE age >= :childrenMinAge)`, { childrenMinAge: request.childrenMinAge });
                }
            }
            if (!request.childrenMinAge && request.childrenMaxAge === '0') {
                queryBuilder.andWhere('candidate.hasNoChildren = :hasNoChildren', {
                    hasNoChildren: true,
                });
            }
            if (request.contractType) {
                const statusIds = request.contractType.split(',');
                const getCandidateContracts = yield this.candidateContractsRepository.find({
                    where: { contractTypeId: (0, typeorm_2.In)(statusIds) },
                });
                const candidateIds = getCandidateContracts.map((x) => x.candidateId);
                if (!(candidateIds === null || candidateIds === void 0 ? void 0 : candidateIds.length)) {
                    return null;
                }
                queryBuilder.andWhere('candidate.id IN (:...contractCandidateIds)', {
                    contractCandidateIds: candidateIds,
                });
            }
            if (request.licencesIds) {
                const licenceIds = request.licencesIds.split(',');
                queryBuilder.andWhere(`candidate.id IN (SELECT candidateId FROM \`candidate-licences\` WHERE licenceId IN (:...licenceIds))`, { licenceIds });
            }
            if ((_a = request.languages) === null || _a === void 0 ? void 0 : _a.length) {
                const where = [];
                for (const item of request.languages) {
                    const whereToPush = { languageCode: item.language };
                    if (item.level) {
                        whereToPush.levelLanguageId = item.level;
                    }
                    where.push(whereToPush);
                }
                const candidateLanguages = yield this.candidateLanguageRepository.find({ where });
                const candidateLanguageCandidateIds = [
                    ...candidateLanguages.map((x) => x.candidateId),
                ];
                if (candidateLanguageCandidateIds === null || candidateLanguageCandidateIds === void 0 ? void 0 : candidateLanguageCandidateIds.length) {
                    queryBuilder.andWhere('candidate.id IN (:...languageCandidateIds)', {
                        languageCandidateIds: candidateLanguageCandidateIds,
                    });
                }
                else {
                    return null;
                }
            }
            if (request.mobilityCountries) {
                const countryCode = request.mobilityCountries.split(',');
                queryBuilder.andWhere(`(candidate.globalMobility = 1 OR candidate.id IN (SELECT candidateId FROM \`candidate-country\` WHERE country IN (:...mobCountries)))`, { mobCountries: countryCode });
            }
            if (request.mobilityDepartments) {
                const departments = request.mobilityDepartments.split(',');
                const firstDpt = departments === null || departments === void 0 ? void 0 : departments[0];
                if (firstDpt) {
                    queryBuilder.andWhere(`(candidate.id IN (SELECT candidateId FROM \`candidate-department\` WHERE department = :mobDept) OR candidate.id IN (SELECT candidateId FROM \`address\` WHERE department LIKE :mobDeptLike OR SUBSTRING(postalCode, 1, 2) = :mobDept))`, { mobDept: firstDpt, mobDeptLike: `%${firstDpt}%` });
                }
            }
            return queryBuilder;
        });
    }
    findAll(conditions, useGetOneRelations, additionalRelations, ...toDtoParameters) {
        const _super = Object.create(null, {
            findAll: { get: () => super.findAll }
        });
        return __awaiter(this, void 0, void 0, function* () {
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
                conditions.relations.push(...additionalRelations);
            }
            const response = yield _super.findAll.call(this, conditions, toDtoParameters);
            return response;
        });
    }
    getPercentageOfAdvancement(candidate) {
        var _a, _b, _c, _d;
        const percentageAndFieldsToReturn = {
            fieldsMissed: [],
            percentage: 0,
        };
        let fieldsToSetHelp = [];
        if (!candidate) {
            return null;
        }
        const requiredFields = [
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
        const requiredFiles = (_a = candidate.files) === null || _a === void 0 ? void 0 : _a.filter((x) => x.isMandatory);
        if (requiredFiles === null || requiredFiles === void 0 ? void 0 : requiredFiles.length) {
            nbTotalOfRequiredField += requiredFiles.length;
            for (const file of requiredFiles) {
                if (file.fileId) {
                    percentageOfAdvancement += 100 / nbTotalOfRequiredField;
                }
                else {
                    fieldsToSetHelp.push((_b = file.fileType) === null || _b === void 0 ? void 0 : _b.label);
                }
            }
        }
        nbTotalOfRequiredField++;
        if (candidate.hasNoChildren || ((_c = candidate.candidateChildrens) === null || _c === void 0 ? void 0 : _c.length)) {
            percentageOfAdvancement += 100 / nbTotalOfRequiredField;
        }
        for (const item of requiredFields) {
            let set = false;
            if (typeof candidate[item] === 'number' ||
                typeof candidate[item] === 'boolean') {
                if (candidate[item] !== null && candidate[item] !== undefined) {
                    percentageOfAdvancement += 100 / nbTotalOfRequiredField;
                    set = true;
                }
            }
            else if (Array.isArray(candidate[item])) {
                if ((_d = candidate[item]) === null || _d === void 0 ? void 0 : _d.length) {
                    percentageOfAdvancement += 100 / nbTotalOfRequiredField;
                    set = true;
                }
            }
            else {
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
        percentageAndFieldsToReturn.percentage = parseInt(percentageOfAdvancement.toFixed(), 10);
        percentageAndFieldsToReturn.fieldsMissed = fieldsToSetHelp;
        return percentageAndFieldsToReturn;
    }
    createMandatoryCandidateFilesForCandidate(candidateDto, skipSave) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fileTypesResponse = yield this.referentialService.getTypeValues({
                    appTypeCode: shared_constants_1.AppTypes.CandidateFileType,
                });
                const fileTypes = fileTypesResponse.appType.appValues;
                const mandatoriesFilesTypes = [
                    shared_constants_1.CandidateFileType.MainResume,
                    shared_constants_1.CandidateFileType.MainPhoto,
                    shared_constants_1.CandidateFileType.IdentityCard,
                    shared_constants_1.CandidateFileType.LastThreeWorkCertificates,
                    shared_constants_1.CandidateFileType.CriminalRecord,
                    shared_constants_1.CandidateFileType.SalarySheets,
                ];
                if (candidateDto.inCouple) {
                    mandatoriesFilesTypes.push(shared_constants_1.CandidateFileType.PartnerResume);
                }
                if (!candidateDto.files || !candidateDto.files.length) {
                    candidateDto.files = [];
                }
                for (const mandatoryFileType of mandatoriesFilesTypes) {
                    const mandatoryFileTypeId = (_a = fileTypes.find((x) => x.code === mandatoryFileType)) === null || _a === void 0 ? void 0 : _a.id;
                    const file = candidateDto.files.find((x) => x.fileTypeId === mandatoryFileTypeId);
                    if (file) {
                        file.isMandatory = true;
                    }
                    else {
                        const candidateFile = new candidate_file_dto_1.CandidateFileDto();
                        candidateFile.fileTypeId = mandatoryFileTypeId;
                        candidateFile.isMandatory = true;
                        candidateDto.files.push(candidateFile);
                    }
                }
                if (!skipSave) {
                    yield this.repository.save(candidateDto);
                }
            }
            catch (err) {
                throw new app_error_1.AppErrorWithMessage(err);
            }
        });
    }
    setExistantFileTypeToMandatory(fileTypesDto, candidateFiles) {
        var _a;
        for (const fileTypeDto of fileTypesDto) {
            for (const candidateFile of candidateFiles) {
                if (((_a = candidateFile.fileType) === null || _a === void 0 ? void 0 : _a.code) === fileTypeDto.code) {
                    candidateFile.isMandatory = true;
                }
            }
        }
        console.log('🚀 ~ CandidateService ~ setExistantFileTypeToMandatory ~ candidateFiles', candidateFiles);
        return candidateFiles;
    }
    getCandidateApplicationsLength(id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new candidate_dto_1.GetCandidateApplicationsLength();
            try {
                const candidate = yield this.repository.findOne({
                    where: { id: id },
                    relations: ['candidateApplications'],
                });
                if (!candidate) {
                    throw new app_error_1.AppErrorWithMessage('Unable to get candidate');
                }
                response.applications =
                    ((_a = candidate === null || candidate === void 0 ? void 0 : candidate.candidateApplications) === null || _a === void 0 ? void 0 : _a.length) || 0;
                response.success = true;
            }
            catch (error) {
                throw new app_error_1.AppErrorWithMessage(error);
            }
            return response;
        });
    }
    deleteAllCandidates() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse(true);
            const candidatesToRemoveResponse = yield this.findAll(null, false, []);
            if ((_a = candidatesToRemoveResponse === null || candidatesToRemoveResponse === void 0 ? void 0 : candidatesToRemoveResponse.candidates) === null || _a === void 0 ? void 0 : _a.length) {
                yield this.delete(candidatesToRemoveResponse.candidates.map((x) => x.id));
            }
            return response;
        });
    }
    delete(ids) {
        const _super = Object.create(null, {
            delete: { get: () => super.delete }
        });
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            let response = new generic_response_1.GenericResponse();
            try {
                const usersToDeleteResponse = yield this.userService.findAll({
                    where: { candidateId: (0, typeorm_2.In)(ids) },
                    select: ['id'],
                });
                if ((_a = usersToDeleteResponse === null || usersToDeleteResponse === void 0 ? void 0 : usersToDeleteResponse.users) === null || _a === void 0 ? void 0 : _a.length) {
                    const usersToDeleteIds = usersToDeleteResponse.users.map((x) => x.id);
                    yield this.userService.delete(usersToDeleteIds);
                }
                const candidatesToRemoveResponse = yield this.findAll({ where: { id: (0, typeorm_2.In)(ids) }, relations: ['files'] }, false, []);
                if ((_b = candidatesToRemoveResponse === null || candidatesToRemoveResponse === void 0 ? void 0 : candidatesToRemoveResponse.candidates) === null || _b === void 0 ? void 0 : _b.length) {
                    const candidatesFilesIds = [];
                    for (const candidateToRemove of candidatesToRemoveResponse.candidates) {
                        if (candidateToRemove.email) {
                            yield this.mailService.deleteBrevoContact(candidateToRemove.email);
                        }
                    }
                    for (const candidateToRemove of candidatesToRemoveResponse.candidates) {
                        if (!((_c = candidateToRemove.files) === null || _c === void 0 ? void 0 : _c.length))
                            continue;
                        for (const candidateFile of (_d = candidateToRemove.files) === null || _d === void 0 ? void 0 : _d.filter((x) => !!x && !!x.fileId)) {
                            if (candidatesFilesIds.indexOf(candidateFile.fileId) ===
                                -1) {
                                candidatesFilesIds.push(candidateFile.fileId);
                            }
                        }
                    }
                    for (const candidateToRemove of candidatesToRemoveResponse.candidates) {
                        const candidateFolderPath = this.fileService.joinPaths(environment_1.Environment.CandidatesPublicDirectory, candidateToRemove.id);
                        const candidatePrivateFolderPath = this.fileService.joinPaths(environment_1.Environment.CandidatesDirectory, candidateToRemove.id);
                        if (yield nextalys_node_helpers_1.FileHelpers.isDirectory(candidateFolderPath)) {
                            yield nextalys_node_helpers_1.FileHelpers.removeDirectoryRecursive(candidateFolderPath);
                        }
                        if (yield nextalys_node_helpers_1.FileHelpers.isDirectory(candidatePrivateFolderPath)) {
                            yield nextalys_node_helpers_1.FileHelpers.removeDirectoryRecursive(candidatePrivateFolderPath);
                        }
                        for (const candidateFile of candidateToRemove.files) {
                            if (((_e = candidateFile === null || candidateFile === void 0 ? void 0 : candidateFile.file) === null || _e === void 0 ? void 0 : _e.externalFilePath) &&
                                environment_1.Environment.EnvName === 'production') {
                                const deleteGCloudFileResponse = yield this.gCloudStorageService.deleteFile((_f = candidateFile === null || candidateFile === void 0 ? void 0 : candidateFile.file) === null || _f === void 0 ? void 0 : _f.externalFilePath);
                                const test = '';
                            }
                        }
                    }
                    if (candidatesFilesIds === null || candidatesFilesIds === void 0 ? void 0 : candidatesFilesIds.length) {
                        yield this.fileService.delete(candidatesFilesIds);
                    }
                    response = yield _super.delete.call(this, ids);
                }
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    archive(ids) {
        const _super = Object.create(null, {
            archive: { get: () => super.archive }
        });
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let response = new generic_response_1.GenericResponse();
            try {
                const usersToArchiveResponse = yield this.userService.findAll({
                    where: { candidateId: (0, typeorm_2.In)(ids) },
                    select: ['id'],
                });
                if ((_a = usersToArchiveResponse === null || usersToArchiveResponse === void 0 ? void 0 : usersToArchiveResponse.users) === null || _a === void 0 ? void 0 : _a.length) {
                    const usersToArchiveIds = usersToArchiveResponse.users.map((x) => x.id);
                    yield this.userService.archive(usersToArchiveIds);
                }
                response = yield _super.archive.call(this, ids);
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    getCandidateHasImageProfile(id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new candidate_dto_1.GetCandidateImageResponse();
            try {
                const relations = ['files', 'files.fileType'];
                const candidate = yield this.repository.findOne({
                    where: { id: id },
                    relations,
                });
                response.candidateHasImage = false;
                if (candidate) {
                    for (const file of candidate.files) {
                        if (((_a = file.fileType) === null || _a === void 0 ? void 0 : _a.code) === shared_constants_1.CandidateFileType.MainPhoto &&
                            file.fileId) {
                            response.candidateHasImage = true;
                            break;
                        }
                    }
                }
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    sendCandidateFolderByMail(request, consultantEmail) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                if (request.mode === 'sendCandidate') {
                    const getUserResponse = yield this.userService.findOneWithoutRelations({
                        where: { id: request.candidateId },
                    });
                    if (!getUserResponse.success) {
                        throw new app_error_1.AppErrorWithMessage(getUserResponse.message);
                    }
                    const attachmentsEmail = [];
                    const candidate = yield this.repository.findOne({
                        where: { id: request.candidateId },
                        relations: [
                            'candidateCurrentJobs',
                            'candidateCurrentJobs.currentJob',
                            'candidateCurrentJobs.currentJob.appType',
                        ],
                    });
                    if (!candidate) {
                        throw new app_error_1.AppErrorWithMessage('Unable to get candidate !');
                    }
                    const filesToRemove = [];
                    for (const candidateFile of request.candidateFiles) {
                        if (!((_a = candidateFile.file) === null || _a === void 0 ? void 0 : _a.externalFilePath)) {
                            continue;
                        }
                        const target = nextalys_node_helpers_1.FileHelpers.joinPaths(environment_1.Environment.UploadedFilesTempDirectory, nextalys_js_helpers_1.MainHelpers.generateGuid() +
                            '.' +
                            nextalys_node_helpers_1.FileHelpers.getExtensionFromMimeType(candidateFile.file.mimeType));
                        const downloadResponse = yield this.gCloudStorageService.downloadFile(candidateFile.file.externalFilePath, target);
                        if (!downloadResponse.success) {
                            throw new app_error_1.AppErrorWithMessage('File download error');
                        }
                        const base64 = yield nextalys_node_helpers_1.FileHelpers.base64Encode(target);
                        attachmentsEmail.push({
                            base64Content: base64,
                            name: candidate.firstName +
                                '-' +
                                candidate.lastName +
                                '_' +
                                nextalys_js_helpers_1.MainHelpers.formatToUrl(((_b = candidateFile.file) === null || _b === void 0 ? void 0 : _b.name) || 'attachment') +
                                '.' +
                                nextalys_node_helpers_1.FileHelpers.getExtensionFromMimeType(candidateFile.file.mimeType),
                        });
                        if (target) {
                            filesToRemove.push(target);
                        }
                    }
                    const mailSender = yield candidates_helpers_1.SharedCandidatesHelpers.getMailSenderFromCandidate(candidate.toDto(), null, this.referentialService, consultantEmail);
                    const sendMailResponse = yield this.mailService.sendMailWithGenericTemplate({
                        from: { address: mailSender },
                        to: [
                            { address: request.to, name: request.customerName },
                        ],
                        subject: request.subject,
                        htmlBody: nextalys_js_helpers_1.MainHelpers.replaceAll(request.body, '\n', '<br/>'),
                        attachments: attachmentsEmail,
                    });
                    if (!sendMailResponse.success) {
                        throw new app_error_1.AppErrorWithMessage(sendMailResponse.message);
                    }
                    for (const fileToRemove of filesToRemove) {
                        if (yield nextalys_node_helpers_1.FileHelpers.fileExists(fileToRemove)) {
                            yield nextalys_node_helpers_1.FileHelpers.removeFile(fileToRemove);
                        }
                    }
                }
                if (request.mode === 'sendResumes') {
                    if (!request.candidatesIds) {
                        throw new app_error_1.AppErrorWithMessage('No candidates IDs provided');
                    }
                    const candidateIds = request.candidatesIds.split(',');
                    const attachmentsEmail = [];
                    const getCandidatesResponse = yield this.findAll({
                        where: { id: (0, typeorm_2.In)(candidateIds) },
                        relations: [
                            'candidateCurrentJobs',
                            'candidateCurrentJobs.currentJob',
                        ],
                    }, null, null);
                    if (!(getCandidatesResponse === null || getCandidatesResponse === void 0 ? void 0 : getCandidatesResponse.candidates.length)) {
                        throw new app_error_1.AppErrorWithMessage('Unable to find candidates');
                    }
                    for (const candidate of getCandidatesResponse.candidates) {
                        try {
                            const candidateOptions = (_c = request.candidateResumeOptions) === null || _c === void 0 ? void 0 : _c.find((opt) => opt.candidateId === candidate.id);
                            const selectedJobId = (candidateOptions === null || candidateOptions === void 0 ? void 0 : candidateOptions.selectedJobId) ||
                                ((_f = (_e = (_d = candidate.candidateCurrentJobs) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.currentJob) === null || _f === void 0 ? void 0 : _f.id) ||
                                '';
                            const isUSCandidate = candidate.nationality === 'US' ||
                                ((_g = candidate.addresses) === null || _g === void 0 ? void 0 : _g.some((addr) => addr.country === 'US'));
                            const resumeData = yield this.candidateResumeService.generateCandidateResume(candidate.id, {
                                language: (candidateOptions === null || candidateOptions === void 0 ? void 0 : candidateOptions.language) || 'fr',
                                showAge: isUSCandidate
                                    ? false
                                    : ((_h = candidateOptions === null || candidateOptions === void 0 ? void 0 : candidateOptions.showAge) !== null && _h !== void 0 ? _h : true),
                                showNationality: isUSCandidate
                                    ? false
                                    : ((_j = candidateOptions === null || candidateOptions === void 0 ? void 0 : candidateOptions.showNationality) !== null && _j !== void 0 ? _j : true),
                                selectedJobId: selectedJobId,
                            });
                            attachmentsEmail.push({
                                base64Content: resumeData.buffer.toString('base64'),
                                name: `${candidate.firstName}_${candidate.lastName}_resume.pdf`,
                            });
                        }
                        catch (error) {
                            console.error(`Failed to generate resume for candidate ${candidate.id}:`, error);
                        }
                    }
                    if (attachmentsEmail.length === 0) {
                        throw new app_error_1.AppErrorWithMessage('No resumes could be generated');
                    }
                    const firstCandidate = getCandidatesResponse.candidates[0];
                    const mailSender = yield candidates_helpers_1.SharedCandidatesHelpers.getMailSenderFromCandidate(firstCandidate, null, this.referentialService, consultantEmail);
                    const sendMailResponse = yield this.mailService.sendMailWithGenericTemplate({
                        from: { address: mailSender },
                        to: [
                            { address: request.to, name: request.customerName },
                        ],
                        subject: request.subject,
                        htmlBody: nextalys_js_helpers_1.MainHelpers.replaceAll(request.body, '\n', '<br/>'),
                        attachments: attachmentsEmail,
                    });
                    if (!sendMailResponse.success) {
                        throw new app_error_1.AppErrorWithMessage(sendMailResponse.message);
                    }
                }
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    getCandidateMainLanguage(candidateId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new candidate_dto_1.GetCandidateLanguageResponse();
            try {
                const candidate = yield this.repository.findOne({
                    where: { id: candidateId },
                    relations: ['addresses', 'candidateLanguages'],
                });
                const getCandidateOrUserMainLanguageResponse = yield candidates_helpers_1.SharedCandidatesHelpers.getCandidateOrUserMainLanguage(candidate.toDto(), undefined, this.referentialService);
                response.isDefaultLanguage =
                    getCandidateOrUserMainLanguageResponse.isDefaultLanguage;
                const candidateLanguageSimple = getCandidateOrUserMainLanguageResponse.language;
                if (!candidateLanguageSimple) {
                    throw new app_error_1.AppErrorWithMessage('candidate language error');
                }
                const getLanguages = yield ((_a = this.referentialService) === null || _a === void 0 ? void 0 : _a.getAllLanguages());
                if (!getLanguages.success) {
                    throw new app_error_1.AppErrorWithMessage('get language error');
                }
                const candidateLanguage = getLanguages.languages.find((x) => x.code === candidateLanguageSimple.code);
                if (!candidateLanguage) {
                    throw new app_error_1.AppErrorWithMessage('candidate language error');
                }
                response.language = candidateLanguage;
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    exportAssistantes() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                const assistantJobCode = 'jobcategory_assistant-e-personnel-le-';
                const codes = [shared_constants_1.CandidateStatus.NotSelected, assistantJobCode];
                const codesValues = yield this.referentialService.getAppValues({
                    where: { code: (0, typeorm_2.In)(codes) },
                });
                if (((_a = codesValues === null || codesValues === void 0 ? void 0 : codesValues.appValues) === null || _a === void 0 ? void 0 : _a.length) !== 2) {
                    return;
                }
                const jobValue = codesValues.appValues.find((x) => x.code === assistantJobCode);
                if (!(jobValue === null || jobValue === void 0 ? void 0 : jobValue.id)) {
                    return;
                }
                const notSelectedStatus = codesValues.appValues.find((x) => x.code === shared_constants_1.CandidateStatus.NotSelected);
                if (!(notSelectedStatus === null || notSelectedStatus === void 0 ? void 0 : notSelectedStatus.id)) {
                    return;
                }
                const currentJobsEntities = yield this.candidateCurrentJobRepository.find({
                    where: { currentJobId: jobValue.id },
                });
                let candidateIds = currentJobsEntities.map((x) => x.candidateId);
                if (!(candidateIds === null || candidateIds === void 0 ? void 0 : candidateIds.length)) {
                    return;
                }
                candidateIds = new test_types_1.NxsList(candidateIds).Distinct().ToArray();
                let candidatesEntities = yield this.repository.find({
                    where: {
                        id: (0, typeorm_2.In)(candidateIds),
                        candidateStatusId: (0, typeorm_2.Not)(notSelectedStatus.id),
                        email: (0, typeorm_2.Not)((0, typeorm_2.IsNull)()),
                        newsletterUnsubscribed: false,
                    },
                    relations: ['addresses'],
                });
                candidatesEntities = candidatesEntities.filter((x) => {
                    var _a;
                    return shared_service_1.SharedService.emailCanBeSent(x.email) &&
                        ((_a = x.addresses) === null || _a === void 0 ? void 0 : _a.some((y) => { var _a; return ((_a = y === null || y === void 0 ? void 0 : y.country) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'fr'; }));
                });
                const candidates = candidatesEntities.map((x) => x.toDto());
                const excelData = candidates.map((x) => [
                    x.firstName,
                    x.lastName,
                    x.email,
                    x.phone,
                ]);
                excelData.unshift(['FIRSTNAME', 'LASTNAME', 'EMAIL', 'PHONE']);
                excel_1.ExcelHelpers.initWithProvider(new excel_helpers_exceljs_1.ExcelHelpersExcelJs());
                const exportResponse = yield excel_1.ExcelHelpers.generateExcel({
                    output: 'assistants.xlsx',
                    data: excelData,
                    generationType: 'file',
                    worksheetName: 'assistants',
                });
                console.log('Log ~ CandidateService ~ exportAssistantes ~ exportResponse:', exportResponse);
                response.success = true;
            }
            catch (error) {
                response.handleError(error);
            }
            return response;
        });
    }
    createCandidateJobOfferHistoryEntry(candidateId, jobOfferId, action, candidateFirstName, candidateLastName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.candidateJobOfferHistoryService.createHistoryEntry(candidateId, jobOfferId, action, candidateFirstName, candidateLastName);
            }
            catch (error) {
                console.error('Error creating candidate job offer history entry:', error);
            }
        });
    }
    updateCandidateJobsStatus(candidateId, candidateJobUpdates, payload) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new candidate_dto_1.GetCandidateResponse();
            try {
                const candidate = yield this.repository.findOne({
                    where: { id: candidateId },
                    relations: ['candidateJobs'],
                });
                if (!candidate) {
                    throw new app_error_1.AppErrorWithMessage('Candidate not found');
                }
                for (const update of candidateJobUpdates) {
                    const candidateJob = (_a = candidate.candidateJobs) === null || _a === void 0 ? void 0 : _a.find((job) => job.id === update.candidateJobId);
                    if (candidateJob) {
                        const previousStatus = candidateJob.status;
                        candidateJob.status = update.status;
                        if (previousStatus !== update.status && (payload === null || payload === void 0 ? void 0 : payload.id)) {
                            const now = new Date();
                            const history = {
                                date: nextalys_js_helpers_1.DateHelpers.convertUTCDateToLocalDate(now),
                                entity: 'candidateJob',
                                entityId: candidateJob.id,
                                field: 'status',
                                valueBefore: previousStatus,
                                valueAfter: update.status,
                                userId: payload.id,
                            };
                            yield this.historiesService.createOrUpdate(history);
                        }
                    }
                }
                yield this.repository.save(candidate);
                const updatedCandidate = yield this.repository.findOne({
                    where: { id: candidateId },
                    relations: [
                        'candidateJobs',
                        'candidateJobs.job',
                        'candidateJobs.jobReference',
                        'candidateJobs.jobReference.addresses',
                    ],
                });
                if (updatedCandidate) {
                    response.candidate = updatedCandidate.toDto();
                    response.success = true;
                }
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    saveNoteItemFile(noteItemId, fileDto) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                const noteItem = yield this.noteItemRepository.findOne({
                    where: { id: noteItemId },
                    relations: ['files', 'files.file'],
                });
                if (!noteItem) {
                    throw new app_error_1.AppErrorWithMessage('Note item not found');
                }
                if (((_a = fileDto.file) === null || _a === void 0 ? void 0 : _a.physicalName) && !((_b = fileDto.file) === null || _b === void 0 ? void 0 : _b.externalFilePath)) {
                    const tempFilePath = this.fileService.getTempFilePath(fileDto.file);
                    if (!(yield nextalys_node_helpers_1.FileHelpers.fileExists(tempFilePath))) {
                        throw new app_error_1.AppErrorWithMessage('The uploaded file could not be found on the server. This can happen in clustered environments. Please try uploading the file again.');
                    }
                    const targetFile = `note-item-files/${noteItemId}/${fileDto.file.physicalName}`;
                    const uploadResponse = yield this.gCloudStorageService.uploadFile(tempFilePath, null, targetFile);
                    if (!uploadResponse.success) {
                        throw new app_error_1.AppErrorWithMessage(uploadResponse.message);
                    }
                    fileDto.file.externalFilePath = uploadResponse.file.name;
                    yield nextalys_node_helpers_1.FileHelpers.removeFile(tempFilePath);
                }
                const noteItemFile = new note_item_file_entity_1.NoteItemFile();
                noteItemFile.fromDto(fileDto);
                noteItemFile.noteItemId = noteItemId;
                yield this.noteItemFileRepository.save(noteItemFile);
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    deleteNoteItemFile(noteItemFileId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                const noteItemFile = yield this.noteItemFileRepository.findOne({
                    where: { id: noteItemFileId },
                    relations: ['file'],
                });
                if (!noteItemFile) {
                    throw new app_error_1.AppErrorWithMessage('Note item file not found');
                }
                if ((_a = noteItemFile.file) === null || _a === void 0 ? void 0 : _a.externalFilePath) {
                    yield this.gCloudStorageService.deleteFile(noteItemFile.file.externalFilePath);
                }
                yield this.noteItemFileRepository.delete(noteItemFileId);
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
};
CandidateService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(candidate_entity_1.Candidate)),
    __param(1, (0, typeorm_1.InjectRepository)(note_item_entity_1.NoteItem)),
    __param(2, (0, typeorm_1.InjectRepository)(note_item_file_entity_1.NoteItemFile)),
    __param(3, (0, typeorm_1.InjectRepository)(candidate_jobs_entity_1.CandidateJob)),
    __param(4, (0, typeorm_1.InjectRepository)(candidate_language_entity_1.CandidateLanguage)),
    __param(5, (0, typeorm_1.InjectRepository)(candidate_children_entity_1.CandidateChildren)),
    __param(6, (0, typeorm_1.InjectRepository)(candidate_licences_entity_1.CandidateLicence)),
    __param(7, (0, typeorm_1.InjectRepository)(candidate_file_entity_1.CandidateFile)),
    __param(8, (0, typeorm_1.InjectRepository)(candidate_readonly_property_entity_1.CandidateReadonlyProperty)),
    __param(9, (0, typeorm_1.InjectRepository)(candidate_pet_entity_1.CandidatePet)),
    __param(13, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __param(15, (0, common_1.Inject)((0, common_1.forwardRef)(() => auth_service_1.AuthService))),
    __param(17, (0, typeorm_1.InjectRepository)(candidate_country_entity_1.CandidateCountry)),
    __param(18, (0, typeorm_1.InjectRepository)(candidate_department_entity_1.CandidateDepartment)),
    __param(19, (0, typeorm_1.InjectRepository)(candidate_contract_entity_1.CandidateContract)),
    __param(22, (0, typeorm_1.InjectRepository)(history_entity_1.History)),
    __param(23, (0, typeorm_1.InjectRepository)(candidate_current_jobs_entity_1.CandidateCurrentJob)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        referential_service_1.ReferentialService,
        file_service_1.FileService,
        gcloud_storage_service_1.GCloudStorageService,
        users_service_1.UsersService,
        mail_service_1.MailService,
        auth_service_1.AuthService,
        notifications_service_1.NotificationsService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        candidate_resume_service_1.CandidateResumeService,
        histories_service_1.HistoriesService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        candidate_job_offer_history_service_1.CandidateJobOfferHistoryService])
], CandidateService);
exports.CandidateService = CandidateService;
//# sourceMappingURL=candidates.service.js.map