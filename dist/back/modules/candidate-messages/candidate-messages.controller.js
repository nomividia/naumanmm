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
exports.CandidateMessagesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const shared_constants_1 = require("../../../shared/shared-constants");
const shared_service_1 = require("../../../shared/shared-service");
const app_error_1 = require("../../models/app-error");
const base_search_requests_1 = require("../../models/requests/base-search-requests");
const generic_response_1 = require("../../models/responses/generic-response");
const auth_tools_service_1 = require("../../services/auth-tools.service");
const roles_guard_1 = require("../../services/guards/roles-guard");
const roles_decorator_1 = require("../../services/roles.decorator");
const base_controller_1 = require("../../shared/base.controller");
const socket_gateway_1 = require("../../sockets/socket-gateway");
const candidate_dto_1 = require("../candidates/candidate-dto");
const candidate_message_dto_1 = require("./candidate-message-dto");
const candidate_messages_service_1 = require("./candidate-messages.service");
let CandidateMessagesController = class CandidateMessagesController extends base_controller_1.BaseController {
    constructor(candidateMessagesService, authToolsService, socketGateway) {
        super();
        this.candidateMessagesService = candidateMessagesService;
        this.authToolsService = authToolsService;
        this.socketGateway = socketGateway;
    }
    getAll(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = this.authToolsService.getCurrentPayload(false);
            if (!payload) {
                throw new app_error_1.AppErrorWithMessage('Invalid input');
            }
            const findOptions = base_search_requests_1.BaseSearchRequest.getDefaultFindOptions(request);
            if (request.search) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                findOptions.where = [
                    {
                        content: (0, typeorm_1.Like)('%' + request.search + '%'),
                    },
                ];
            }
            if (request.candidateId) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                if (request.candidateId) {
                    for (const whereFilter of findOptions.where) {
                        whereFilter.candidateId = request.candidateId;
                    }
                }
            }
            if (!findOptions.order) {
                findOptions.order = { creationDate: 'ASC' };
            }
            const response = yield this.candidateMessagesService.findAll(findOptions);
            const unSeenCandidateMessages = response.candidateMessages.filter((x) => !x.seen && x.senderId !== payload.id);
            yield this.p_setCandidatesMessagesToSeen(unSeenCandidateMessages);
            const unseenMessagesResponse = yield this.getUnSeenMessagesCount();
            if (unseenMessagesResponse.success) {
                response.unSeenMessagesCount =
                    unseenMessagesResponse.unSeenMessagesCount;
            }
            return response;
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.candidateMessagesService.findOne({
                where: { id: id },
            });
        });
    }
    createOrUpdate(candidateMessageDto) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!candidateMessageDto) {
                throw new app_error_1.AppErrorWithMessage('Invalid Request');
            }
            const response = yield this.candidateMessagesService.createOrUpdate(candidateMessageDto);
            if (response.success) {
                yield this.socketGateway.sendEventToClient(shared_constants_1.CustomSocketEventType.NewCandidateMessage, { data: candidateMessageDto.candidateId });
            }
            return response;
        });
    }
    delete(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.candidateMessagesService.delete(ids.split(','));
        });
    }
    archive(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.candidateMessagesService.archive(ids);
        });
    }
    getMyCandidateMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = this.authToolsService.getCurrentPayload(false);
            if (!(payload === null || payload === void 0 ? void 0 : payload.candidateId)) {
                throw new app_error_1.AppErrorWithMessage('Invalid input');
            }
            const response = yield this.getAll({
                candidateId: payload.candidateId,
            });
            const unSeenCandidateMessages = response.candidateMessages.filter((x) => !x.seen && x.senderId !== payload.id);
            yield this.p_setCandidatesMessagesToSeen(unSeenCandidateMessages);
            return response;
        });
    }
    sendNewCandidateMessage(candidateMessageDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = this.authToolsService.getCurrentPayload(false);
            if (!payload) {
                throw new app_error_1.AppErrorWithMessage('Invalid input');
            }
            if (!candidateMessageDto) {
                throw new app_error_1.AppErrorWithMessage('Invalid Request');
            }
            return yield this.createOrUpdate(candidateMessageDto);
        });
    }
    setCandidatesMessagesToSeen(candidateId) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = new candidate_dto_1.GetUnseenMessagesCountResponse();
            try {
                if (!candidateId) {
                    throw new app_error_1.AppErrorWithMessage('Invalid request');
                }
                yield this.candidateMessagesService
                    .getRepository()
                    .update({ id: candidateId, seen: false }, { seen: true });
                response = yield this.getUnSeenMessagesCount();
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    p_setCandidatesMessagesToSeen(unSeenCandidateMessages) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const item of unSeenCandidateMessages) {
                item.seen = true;
            }
            yield this.candidateMessagesService.repository.save(unSeenCandidateMessages);
        });
    }
    getCandidatesForMessaging(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.candidateMessagesService.getCandidateForMessaging(request.consultantId);
        });
    }
    getUnSeenMessagesCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new candidate_dto_1.GetUnseenMessagesCountResponse();
            try {
                const payload = this.authToolsService.getCurrentPayload(false);
                const where = { seen: false };
                if (shared_service_1.SharedService.userIsConsultant(payload) ||
                    shared_service_1.SharedService.userIsAdmin(payload) ||
                    shared_service_1.SharedService.userIsAdminTech(payload)) {
                    where.senderType = shared_constants_1.CandidateMessageSenderType.Candidate;
                }
                else if (shared_service_1.SharedService.userIsCandidate(payload)) {
                    where.senderType = shared_constants_1.CandidateMessageSenderType.Consultant;
                    where.candidateId = payload.candidateId;
                }
                else {
                    throw new app_error_1.AppErrorWithMessage('Forbidden');
                }
                response.unSeenMessagesCount =
                    yield this.candidateMessagesService.repository.count({
                        where: where,
                    });
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    archiveAllCandidateMessages(candidateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                const archiveMessagesResponse = yield this.candidateMessagesService.archiveOrRemoveAllCandidateMessage(candidateId, false);
                if (archiveMessagesResponse.success) {
                    response.success = true;
                }
            }
            catch (err) {
                throw new app_error_1.AppErrorWithMessage(err);
            }
            return response;
        });
    }
    deleteAllCandidateMessages(candidateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                const deleteMessagesResponse = yield this.candidateMessagesService.archiveOrRemoveAllCandidateMessage(candidateId, true);
                if (deleteMessagesResponse.success) {
                    response.success = true;
                }
            }
            catch (err) {
                throw new app_error_1.AppErrorWithMessage(err);
            }
            return response;
        });
    }
};
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Get)('getAll'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all candidate messages',
        operationId: 'getAllCandidateMessages',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get all candidate messages',
        type: candidate_message_dto_1.GetCandidateMessagesResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [candidate_message_dto_1.GetCandidateMessagesRequest]),
    __metadata("design:returntype", Promise)
], CandidateMessagesController.prototype, "getAll", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Get)('get/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get candidate message',
        operationId: 'getCandidateMessage',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get candidate message',
        type: candidate_message_dto_1.GetCandidateMessageResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CandidateMessagesController.prototype, "get", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Post)('createOrUpdate'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create or update candidate message',
        operationId: 'createOrUpdateCandidateMessage',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Create or update candidate message',
        type: candidate_message_dto_1.GetCandidateMessageResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [candidate_message_dto_1.CandidateMessageDto]),
    __metadata("design:returntype", Promise)
], CandidateMessagesController.prototype, "createOrUpdate", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Delete)('delete/:ids'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete candidate messages',
        operationId: 'deleteCandidateMessages',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Delete candidate messages',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CandidateMessagesController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('archive'),
    (0, swagger_1.ApiOperation)({
        summary: 'Archive candidate messages',
        operationId: 'archiveCandidateMessages',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Archive candidate messages',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], CandidateMessagesController.prototype, "archive", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Candidate),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('getMyCandidateMessages'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get candidate messages of the current candidate',
        operationId: 'getMyCandidateMessages',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get candidate messages of the current candidate',
        type: candidate_message_dto_1.GetCandidateMessagesResponse,
    }),
    (0, common_1.HttpCode)(200),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CandidateMessagesController.prototype, "getMyCandidateMessages", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Candidate, shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Post)('sendNewCandidateMessage'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Send new candidate message',
        operationId: 'sendNewCandidateMessage',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Send new candidate message',
        type: candidate_message_dto_1.GetCandidateMessageResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [candidate_message_dto_1.CandidateMessageDto]),
    __metadata("design:returntype", Promise)
], CandidateMessagesController.prototype, "sendNewCandidateMessage", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech),
    (0, common_1.Post)('setCandidatesMessagesToSeen/:candidateId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'setCandidatesMessagesToSeen',
        operationId: 'setCandidatesMessagesToSeen',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'setCandidatesMessagesToSeen',
        type: candidate_dto_1.GetUnseenMessagesCountResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('candidateId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CandidateMessagesController.prototype, "setCandidatesMessagesToSeen", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Get)('getCandidatesForMessaging'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get candidates for messaging',
        operationId: 'getCandidatesForMessaging',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get candidates for messaging',
        type: candidate_dto_1.GetCandidatesForMessageResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [candidate_message_dto_1.GetConsultantMessagesRequest]),
    __metadata("design:returntype", Promise)
], CandidateMessagesController.prototype, "getCandidatesForMessaging", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Candidate, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Get)('getUnSeenMessagesCount'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get unseen candidate message count',
        operationId: 'getUnSeenMessagesCount',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get candidates for messaging',
        type: candidate_dto_1.GetUnseenMessagesCountResponse,
    }),
    (0, common_1.HttpCode)(200),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CandidateMessagesController.prototype, "getUnSeenMessagesCount", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Post)('archiveAllCandidateMessages/:candidateId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'archive candidate messages',
        operationId: 'archiveAllCandidateMessages',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'archive candidate messages',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('candidateId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CandidateMessagesController.prototype, "archiveAllCandidateMessages", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.AdminTech),
    (0, common_1.Post)('deleteAllCandidateMessages/:candidateId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'delete candidate messages',
        operationId: 'deleteAllCandidateMessages',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'delete candidate messages',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('candidateId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CandidateMessagesController.prototype, "deleteAllCandidateMessages", null);
CandidateMessagesController = __decorate([
    (0, common_1.Controller)('candidate-messages'),
    (0, swagger_1.ApiTags)('candidate-messages'),
    __metadata("design:paramtypes", [candidate_messages_service_1.CandidateMessagesService,
        auth_tools_service_1.AuthToolsService,
        socket_gateway_1.SocketGateway])
], CandidateMessagesController);
exports.CandidateMessagesController = CandidateMessagesController;
//# sourceMappingURL=candidate-messages.controller.js.map