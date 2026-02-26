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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shared_constants_1 = require("../../shared/shared-constants");
const auth_requests_1 = require("../models/requests/auth-requests");
const generic_response_1 = require("../models/responses/generic-response");
const auth_tools_service_1 = require("../services/auth-tools.service");
const auth_service_1 = require("../services/auth.service");
const roles_guard_1 = require("../services/guards/roles-guard");
const roles_decorator_1 = require("../services/roles.decorator");
const base_controller_1 = require("../shared/base.controller");
let AuthController = class AuthController extends base_controller_1.BaseController {
    constructor(authService, authToolsService) {
        super();
        this.authService = authService;
        this.authToolsService = authToolsService;
    }
    login(loginViewModel) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authService.login(loginViewModel, null);
        });
    }
    refreshToken(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authService.refreshToken(request);
        });
    }
    register(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authService.register(request);
        });
    }
    socialLogin(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authService.loginWithSocialProvider(request);
        });
    }
    logAs(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authService.logAs(request);
        });
    }
    backToOriginalRequester(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authService.backToOriginalRequester(request);
        });
    }
    changeUserPasswordFromRecoverToken(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authService.changeUserPasswordFromRecoverToken(request.recoverPasswordToken, request.newPassword);
        });
    }
    sendRecoverPasswordMail(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authService.sendRecoverPasswordMail(request.mail);
        });
    }
    getUpdatedAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.authService.getUpdatedAccessToken(this.authToolsService);
        });
    }
    loginWithToken(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authService.login(null, req === null || req === void 0 ? void 0 : req.loginToken);
        });
    }
};
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Login user', operationId: 'login' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Login response',
        type: auth_requests_1.LoginResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_requests_1.LoginViewModel]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh-token'),
    (0, swagger_1.ApiOperation)({ summary: 'refresh token', operationId: 'refreshToken' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Generic Response',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'register', operationId: 'register' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Generic Response',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_requests_1.RegisterRequest]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('social-login'),
    (0, swagger_1.ApiOperation)({ summary: 'register', operationId: 'socialLogin' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Generic Response',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_requests_1.SocialLoginRequest]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "socialLogin", null);
__decorate([
    (0, common_1.Post)('log-as'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin),
    (0, swagger_1.ApiOperation)({ summary: 'logAs', operationId: 'logAs' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Generic Response',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_requests_1.LogAsRequest]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logAs", null);
__decorate([
    (0, common_1.Post)('back-to-original-requester'),
    (0, swagger_1.ApiOperation)({
        summary: 'backToOriginalRequester',
        operationId: 'backToOriginalRequester',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Generic Response',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_requests_1.BackToOriginalRequest]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "backToOriginalRequester", null);
__decorate([
    (0, common_1.Post)('change-user-password-from-recover-token'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update user password',
        operationId: 'changeUserPasswordFromRecoverToken',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Update user password',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_requests_1.UpdateUserPasswordRequest]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changeUserPasswordFromRecoverToken", null);
__decorate([
    (0, common_1.Post)('send-recover-password-mail'),
    (0, swagger_1.ApiOperation)({
        summary: 'Send recover password mail',
        operationId: 'sendRecoverPasswordMail',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Send recover password mail',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_requests_1.SendRecoverPasswordMailRequest]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendRecoverPasswordMail", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Post)('get-updated-access-token'),
    (0, swagger_1.ApiOperation)({
        summary: 'get-updated-access-token',
        operationId: 'getUpdatedAccessToken',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Generic Response',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUpdatedAccessToken", null);
__decorate([
    (0, common_1.Post)('login-with-token'),
    (0, swagger_1.ApiOperation)({
        summary: 'Login user with token',
        operationId: 'loginWithToken',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Login response',
        type: auth_requests_1.LoginResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_requests_1.LoginWithTokenRequest]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginWithToken", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, swagger_1.ApiTags)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        auth_tools_service_1.AuthToolsService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map