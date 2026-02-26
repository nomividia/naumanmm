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
exports.CandidatesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const swagger_1 = require("@nestjs/swagger");
const shared_constants_1 = require("../../../shared/shared-constants");
const app_error_1 = require("../../models/app-error");
const user_dto_1 = require("../../models/dto/user-dto");
const generic_response_1 = require("../../models/responses/generic-response");
const auth_custom_rules_1 = require("../../services/auth-custom-rules");
const auth_tools_service_1 = require("../../services/auth-tools.service");
const roles_guard_1 = require("../../services/guards/roles-guard");
const roles_decorator_1 = require("../../services/roles.decorator");
const users_service_1 = require("../../services/users.service");
const base_controller_1 = require("../../shared/base.controller");
const note_item_file_dto_1 = require("../../models/dto/note-item-file.dto");
const candidate_dto_1 = require("./candidate-dto");
const candidates_service_1 = require("./candidates.service");
let CandidatesController = class CandidatesController extends base_controller_1.BaseController {
    constructor(candidateService, authToolsService, userService, jwtService) {
        super();
        this.candidateService = candidateService;
        this.authToolsService = authToolsService;
        this.userService = userService;
        this.jwtService = jwtService;
    }
    getAll(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.candidateService.findAllForList(request);
        });
    }
    get(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.candidateService.findOneWithRequest(request, id);
        });
    }
    createOrUpdate(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(request === null || request === void 0 ? void 0 : request.candidate)) {
                throw new app_error_1.AppErrorWithMessage('Invalid Request');
            }
            const payload = this.authToolsService.getCurrentPayload(false);
            return yield this.candidateService.createOrUpdate(request.candidate, true, request, payload);
        });
    }
    delete(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.candidateService.delete(ids.split(','));
        });
    }
    archive(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.candidateService.archive(ids);
        });
    }
    getMyDossier(request) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const payload = this.authToolsService.getCurrentPayload(false);
            if (!(payload === null || payload === void 0 ? void 0 : payload.candidateId)) {
                throw new app_error_1.AppErrorWithMessage('Impossible de récupérer le dossier');
            }
            const response = yield this.candidateService.findOneWithRequest(request, payload.candidateId);
            const candidateDossier = response.candidate;
            if (candidateDossier) {
                candidateDossier.candidateAdvancementPercent =
                    (_a = this.candidateService.getPercentageOfAdvancement(response.candidate)) === null || _a === void 0 ? void 0 : _a.percentage;
                candidateDossier.candidateApplicationsLength = (_b = (yield this.candidateService.getCandidateApplicationsLength(response.candidate.id))) === null || _b === void 0 ? void 0 : _b.applications;
            }
            return response;
        });
    }
    saveMyDossier(request) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const payload = this.authToolsService.getCurrentPayload(false);
            if (!(payload === null || payload === void 0 ? void 0 : payload.candidateId)) {
                throw new app_error_1.AppErrorWithMessage('Invalid input');
            }
            if (!((_a = request === null || request === void 0 ? void 0 : request.candidate) === null || _a === void 0 ? void 0 : _a.id) ||
                request.candidate.id !== payload.candidateId) {
                throw new app_error_1.AppErrorWithMessage('Invalid Request');
            }
            const saveResponse = yield this.createOrUpdate(request);
            if ((_b = saveResponse.candidate) === null || _b === void 0 ? void 0 : _b.id) {
                const getUserResponse = yield this.userService.findOne({
                    where: { candidateId: saveResponse.candidate.id },
                    relations: auth_custom_rules_1.UserRelationsForLogin,
                });
                if (!getUserResponse.success) {
                    saveResponse.message = getUserResponse.message;
                    saveResponse.success = false;
                    return saveResponse;
                }
                saveResponse.token = auth_tools_service_1.AuthToolsService.createUserToken(this.jwtService, getUserResponse.user);
            }
            return saveResponse;
        });
    }
    createUserFromCandidate(candidateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const getCandidateResponse = yield this.candidateService.findOne({
                where: { id: candidateId },
                relations: [
                    'candidateLanguages',
                    'candidateLanguages.levelLanguage',
                    'candidateJobs',
                    'candidateJobs.job',
                    'candidateJobs.job.appType',
                ],
            });
            const payload = this.authToolsService.getCurrentPayload(false);
            return yield this.candidateService.createUserFromCandidate(getCandidateResponse.candidate, payload, true, false);
        });
    }
    sendMailAccessToCandidate(candidateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userResponse = yield this.userService.findOne({
                where: { candidateId: candidateId },
            });
            const candidateResponse = yield this.candidateService.findOne({
                where: { id: candidateId },
                relations: [
                    'candidateLanguages',
                    'candidateLanguages.levelLanguage',
                ],
            });
            const payload = this.authToolsService.getCurrentPayload(false);
            return yield this.candidateService.sendEmailAccessToCandidate(userResponse === null || userResponse === void 0 ? void 0 : userResponse.user, candidateResponse === null || candidateResponse === void 0 ? void 0 : candidateResponse.candidate, 'NewCandidateAccount', payload === null || payload === void 0 ? void 0 : payload.mail);
        });
    }
    getCandidateJobsConditions() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const payload = this.authToolsService.getCurrentPayload(false);
            if (!(payload === null || payload === void 0 ? void 0 : payload.candidateId)) {
                throw new app_error_1.AppErrorWithMessage('Impossible de récupérer les informations');
            }
            const candidateJobsConditionResponse = new candidate_dto_1.GetCandidateJobsConditionResponse();
            try {
                const candidateResponse = yield this.candidateService.repository.findOne(payload.candidateId, {
                    relations: [
                        'candidateJobs',
                        'contractType',
                        'addresses',
                    ],
                });
                if (candidateResponse) {
                    const jobsResponse = candidateResponse.toDto().candidateJobs;
                    if (jobsResponse) {
                        candidateJobsConditionResponse.candidateJobIds =
                            jobsResponse
                                .filter((x) => x.inActivity)
                                .map((x) => x.jobId);
                    }
                    candidateJobsConditionResponse.applyInCouple =
                        candidateResponse.inCouple;
                    candidateJobsConditionResponse.contractTypeId =
                        candidateResponse.contractTypeId;
                    candidateJobsConditionResponse.city =
                        ((_b = (_a = candidateResponse === null || candidateResponse === void 0 ? void 0 : candidateResponse.addresses) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.city) || null;
                }
                candidateJobsConditionResponse.success = true;
            }
            catch (err) {
                candidateJobsConditionResponse.handleError(err);
            }
            return candidateJobsConditionResponse;
        });
    }
    getCandidateHasImageProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.candidateService.getCandidateHasImageProfile(id);
        });
    }
    sendCandidateFolderByMail(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = this.authToolsService.getCurrentPayload(false);
            return yield this.candidateService.sendCandidateFolderByMail(request, payload === null || payload === void 0 ? void 0 : payload.mail);
        });
    }
    getCandidateMainLanguage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.candidateService.getCandidateMainLanguage(id);
        });
    }
    updateCandidateJobsStatus(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(request === null || request === void 0 ? void 0 : request.candidateId) || !(request === null || request === void 0 ? void 0 : request.candidateJobUpdates)) {
                throw new app_error_1.AppErrorWithMessage('Invalid Request');
            }
            const payload = this.authToolsService.getCurrentPayload(false);
            return yield this.candidateService.updateCandidateJobsStatus(request.candidateId, request.candidateJobUpdates, payload);
        });
    }
    saveNoteItemFile(noteItemId, fileDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.candidateService.saveNoteItemFile(noteItemId, fileDto);
        });
    }
    deleteNoteItemFile(noteItemFileId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.candidateService.deleteNoteItemFile(noteItemFileId);
        });
    }
};
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Post)('getAll'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all candidates',
        operationId: 'getAllCandidates',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get all candidates',
        type: candidate_dto_1.GetCandidatesResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [candidate_dto_1.GetCandidatesRequest]),
    __metadata("design:returntype", Promise)
], CandidatesController.prototype, "getAll", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Get)('get/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get candidate', operationId: 'getCandidate' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get candidate',
        type: candidate_dto_1.GetCandidateResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, candidate_dto_1.GetCandidateRequest]),
    __metadata("design:returntype", Promise)
], CandidatesController.prototype, "get", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Post)('createOrUpdate'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create or update candidate',
        operationId: 'createOrUpdateCandidate',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Create or update candidate',
        type: candidate_dto_1.GetCandidateResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [candidate_dto_1.SaveCandidateRequest]),
    __metadata("design:returntype", Promise)
], CandidatesController.prototype, "createOrUpdate", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.AdminTech),
    (0, common_1.Delete)('delete/:ids'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete candidates',
        operationId: 'deleteCandidates',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Delete candidates',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CandidatesController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.AdminTech),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('archiveCandidate'),
    (0, swagger_1.ApiOperation)({
        summary: 'Archive candidates',
        operationId: 'archiveCandidates',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Archive candidates',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], CandidatesController.prototype, "archive", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Candidate),
    (0, common_1.Get)('getMyDossier'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get current candidate dossier',
        operationId: 'getMyDossier',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get current candidate dossier',
        type: candidate_dto_1.GetCandidateResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [candidate_dto_1.GetCandidateRequest]),
    __metadata("design:returntype", Promise)
], CandidatesController.prototype, "getMyDossier", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Candidate),
    (0, common_1.Post)('saveMyDossier'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Save dossier of the current candidate',
        operationId: 'saveMyDossier',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Save dossier of the current candidate',
        type: candidate_dto_1.GetCandidateResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [candidate_dto_1.SaveCandidateRequest]),
    __metadata("design:returntype", Promise)
], CandidatesController.prototype, "saveMyDossier", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Post)('createUserFromCandidate/:candidateId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create user from candidate',
        operationId: 'createUserFromCandidate',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Create user from candidate',
        type: user_dto_1.GetUserResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('candidateId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CandidatesController.prototype, "createUserFromCandidate", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Post)('sendMailAccessToCandidate/:candidateId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'send email access to candidate',
        operationId: 'sendMailAccessToCandidate',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'send email access to candidate',
        type: user_dto_1.GetUserResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('candidateId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CandidatesController.prototype, "sendMailAccessToCandidate", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Candidate),
    (0, common_1.Get)('getCandidateJobsConditions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get current candidate jobs conditions',
        operationId: 'getCandidateJobsConditions',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get current candidate jobs conditions',
        type: candidate_dto_1.GetCandidateJobsConditionResponse,
    }),
    (0, common_1.HttpCode)(200),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CandidatesController.prototype, "getCandidateJobsConditions", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(),
    (0, common_1.Get)('getCandidateHasImageProfile/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get get candidate image',
        operationId: 'getCandidateHasImageProfile',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get get candidate image',
        type: candidate_dto_1.GetCandidateImageResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CandidatesController.prototype, "getCandidateHasImageProfile", null);
__decorate([
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.RH),
    (0, common_1.Post)('sendCandidateFolderByMail'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'send candidate folder by email',
        operationId: 'sendCandidateFolderByMail',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'send candidate folder by email',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [candidate_dto_1.SendCandidateByEmailRequest]),
    __metadata("design:returntype", Promise)
], CandidatesController.prototype, "sendCandidateFolderByMail", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(),
    (0, common_1.Get)('getCandidateMainLanguage/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get get candidate main language',
        operationId: 'getCandidateMainLanguage',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get get candidate main language',
        type: candidate_dto_1.GetCandidateLanguageResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CandidatesController.prototype, "getCandidateMainLanguage", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Post)('updateCandidateJobsStatus'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update candidate jobs status in bulk',
        operationId: 'updateCandidateJobsStatus',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Update candidate jobs status',
        type: candidate_dto_1.GetCandidateResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [candidate_dto_1.UpdateCandidateJobsStatusRequest]),
    __metadata("design:returntype", Promise)
], CandidatesController.prototype, "updateCandidateJobsStatus", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Post)('saveNoteItemFile/:noteItemId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Save a file attached to a note item',
        operationId: 'saveNoteItemFile',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Save note item file',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('noteItemId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, note_item_file_dto_1.NoteItemFileDto]),
    __metadata("design:returntype", Promise)
], CandidatesController.prototype, "saveNoteItemFile", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Delete)('deleteNoteItemFile/:noteItemFileId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a file attached to a note item',
        operationId: 'deleteNoteItemFile',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Delete note item file',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('noteItemFileId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CandidatesController.prototype, "deleteNoteItemFile", null);
CandidatesController = __decorate([
    (0, common_1.Controller)('candidates'),
    (0, swagger_1.ApiTags)('candidates'),
    __metadata("design:paramtypes", [candidates_service_1.CandidateService,
        auth_tools_service_1.AuthToolsService,
        users_service_1.UsersService,
        jwt_1.JwtService])
], CandidatesController);
exports.CandidatesController = CandidatesController;
//# sourceMappingURL=candidates.controller.js.map