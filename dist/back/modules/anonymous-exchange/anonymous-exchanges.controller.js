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
exports.AnonymousExchangesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shared_constants_1 = require("../../../shared/shared-constants");
const app_error_1 = require("../../models/app-error");
const base_search_requests_1 = require("../../models/requests/base-search-requests");
const roles_guard_1 = require("../../services/guards/roles-guard");
const roles_decorator_1 = require("../../services/roles.decorator");
const base_controller_1 = require("../../shared/base.controller");
const socket_gateway_1 = require("../../sockets/socket-gateway");
const anonymous_exchange_dto_1 = require("./anonymous-exchange.dto");
const anonymous_exchanges_service_1 = require("./anonymous-exchanges.service");
let AnonymousExchangesController = class AnonymousExchangesController extends base_controller_1.BaseController {
    constructor(anonymousExchangeService, socketGateway) {
        super();
        this.anonymousExchangeService = anonymousExchangeService;
        this.socketGateway = socketGateway;
    }
    getAll(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOptions = base_search_requests_1.BaseSearchRequest.getDefaultFindOptions(request);
            if (request.candidateApplicationId) {
                if (!findOptions.where) {
                    findOptions.where = [{}];
                }
                if (request.candidateApplicationId) {
                    for (const whereFilter of findOptions.where) {
                        whereFilter.candidateApplicationId =
                            request.candidateApplicationId;
                    }
                }
            }
            if (!findOptions.order) {
                findOptions.order = { creationDate: 'ASC' };
            }
            return yield this.anonymousExchangeService.findAll(findOptions);
        });
    }
    createAnonymousExchange(anonymousExchangeDto) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!anonymousExchangeDto) {
                throw new app_error_1.AppErrorWithMessage('Invalid Request');
            }
            const filesToHandle = [];
            if (anonymousExchangeDto.file) {
                filesToHandle.push({
                    file: anonymousExchangeDto.file,
                    name: 'shared-upload',
                });
            }
            const response = yield this.anonymousExchangeService.createOrUpdate(anonymousExchangeDto);
            if (filesToHandle === null || filesToHandle === void 0 ? void 0 : filesToHandle.length) {
                const handleFileResponse = yield this.anonymousExchangeService.handleFileAndSaveExchange(response.exchange, filesToHandle);
                if (!handleFileResponse.success) {
                    throw new app_error_1.AppErrorWithMessage(handleFileResponse.message);
                }
                response.exchange = handleFileResponse.exchange;
            }
            if (response.success) {
                yield this.socketGateway.sendEventToClient(shared_constants_1.CustomSocketEventType.NewAnonymousMessage, { data: anonymousExchangeDto.candidateApplicationId });
            }
            return response;
        });
    }
    getAnonymousExchangeFromApplicationId(candidateApplicationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.anonymousExchangeService.findAll({
                relations: ['candidateApplication'],
                where: { candidateApplicationId: candidateApplicationId },
                order: { creationDate: 'ASC' },
            });
        });
    }
    sendNewCandidateMessage(anonymousExchangeDto) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!anonymousExchangeDto) {
                throw new app_error_1.AppErrorWithMessage('Invalid Request');
            }
            return yield this.createAnonymousExchange(anonymousExchangeDto);
        });
    }
    servePdfFile(res, fileId, exchangeGuid) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.anonymousExchangeService.serveFile(res, fileId, exchangeGuid);
        });
    }
};
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.RH, shared_constants_1.RolesList.AdminTech),
    (0, common_1.Get)('getAll'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all anonymous exchanges',
        operationId: 'getAllAnonymousExchanges',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get all anonymous exchanges response',
        type: anonymous_exchange_dto_1.GetAnonymousExchangesForCandidateApplicationResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [anonymous_exchange_dto_1.GetAnonymousExchangeForCandidateApplicationRequest]),
    __metadata("design:returntype", Promise)
], AnonymousExchangesController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)('createAnonymousExchange'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create anonymous message',
        operationId: 'createAnonymousExchange',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Create anonymous message',
        type: anonymous_exchange_dto_1.GetAnonymousExchangeForCandidateApplicationResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [anonymous_exchange_dto_1.AnonymousExchangeDto]),
    __metadata("design:returntype", Promise)
], AnonymousExchangesController.prototype, "createAnonymousExchange", null);
__decorate([
    (0, common_1.Get)('getAnonymousExchangeFromApplicationId/:candidateApplicationId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get anonymous exchange from guid',
        operationId: 'getAnonymousExchangeFromApplicationId',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get anonymous exchange from guid',
        type: anonymous_exchange_dto_1.GetAnonymousExchangesForCandidateApplicationResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('candidateApplicationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnonymousExchangesController.prototype, "getAnonymousExchangeFromApplicationId", null);
__decorate([
    (0, common_1.Post)('sendNewAnonymousExchange'),
    (0, swagger_1.ApiOperation)({
        summary: 'Send new anonymous message',
        operationId: 'sendNewAnonymousExchange',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Send new anonymous message',
        type: anonymous_exchange_dto_1.GetAnonymousExchangeForCandidateApplicationResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [anonymous_exchange_dto_1.AnonymousExchangeDto]),
    __metadata("design:returntype", Promise)
], AnonymousExchangesController.prototype, "sendNewCandidateMessage", null);
__decorate([
    (0, common_1.Get)('exchange-file'),
    (0, swagger_1.ApiOperation)({
        summary: 'get exchange pdf',
        operationId: 'getExchangePdf',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'get exchange pdf', type: Object }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('fileId')),
    __param(2, (0, common_1.Query)('exchangeGuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AnonymousExchangesController.prototype, "servePdfFile", null);
AnonymousExchangesController = __decorate([
    (0, common_1.Controller)('anonymous-exchanges'),
    (0, swagger_1.ApiTags)('anonymous-exchanges'),
    __metadata("design:paramtypes", [anonymous_exchanges_service_1.AnonymousExchangesService,
        socket_gateway_1.SocketGateway])
], AnonymousExchangesController);
exports.AnonymousExchangesController = AnonymousExchangesController;
//# sourceMappingURL=anonymous-exchanges.controller.js.map