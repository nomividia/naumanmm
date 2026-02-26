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
exports.MailController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shared_constants_1 = require("../../../shared/shared-constants");
const environment_1 = require("../../environment/environment");
const generic_response_1 = require("../../models/responses/generic-response");
const roles_guard_1 = require("../../services/guards/roles-guard");
const roles_decorator_1 = require("../../services/roles.decorator");
const mail_service_1 = require("../../services/tools/mail.service");
const base_controller_1 = require("../../shared/base.controller");
const mail_requests_1 = require("./mail-requests");
const mail_dto_1 = require("./mail.dto");
let MailController = class MailController extends base_controller_1.BaseController {
    constructor(mailService) {
        super();
        this.mailService = mailService;
    }
    sendTestEmail(req) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!(req === null || req === void 0 ? void 0 : req.recipients)) {
                return new generic_response_1.GenericResponse(false, 'Vous devez renseigner une adresse e-mail (destinataire)');
            }
            if (!(req === null || req === void 0 ? void 0 : req.from)) {
                return new generic_response_1.GenericResponse(false, 'Vous devez renseigner une adresse e-mail (expéditeur)');
            }
            return yield this.mailService.sendMailWithGenericTemplate({
                to: (_a = req === null || req === void 0 ? void 0 : req.recipients) === null || _a === void 0 ? void 0 : _a.split(',').filter((x) => !!x).map((x) => ({ address: x })),
                from: { address: req.from },
                subject: 'Email de test',
                htmlBody: 'Ceci est un e-mail de test',
            });
        });
    }
    getMailConfig() {
        const response = new mail_dto_1.GetMailConfigResponse();
        try {
            response.mailProvider = environment_1.Environment.MailProvider;
            response.host = environment_1.Environment.SmtpHost;
            response.username = environment_1.Environment.SmtpUser;
            response.password = environment_1.Environment.SmtpPassword;
            response.secure = environment_1.Environment.SmtpSecure;
            response.port = environment_1.Environment.SmtpPort;
            response.mailSender = environment_1.Environment.MailSender;
            response.success = true;
        }
        catch (err) {
            response.handleError(err);
        }
        return response;
    }
    sendJobOfferByMail(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.mailService.sendMail({
                to: [{ address: request.email }],
                htmlBody: request.content,
                subject: request.object,
                from: { address: request.sender },
            });
        });
    }
};
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.AdminTech),
    (0, common_1.Post)('sendTestEmail'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'sendTestEmail', operationId: 'sendTestEmail' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'sendTestEmail',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mail_dto_1.SendTestEmailRequest]),
    __metadata("design:returntype", Promise)
], MailController.prototype, "sendTestEmail", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.AdminTech),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('getMailConfig'),
    (0, swagger_1.ApiOperation)({ summary: 'getMailConfig', operationId: 'getMailConfig' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'getMailConfig',
        type: mail_dto_1.GetMailConfigResponse,
    }),
    (0, common_1.HttpCode)(200),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", mail_dto_1.GetMailConfigResponse)
], MailController.prototype, "getMailConfig", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('sendMail'),
    (0, swagger_1.ApiOperation)({ summary: 'Send email', operationId: 'sendMail' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Send by email',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mail_requests_1.MailRequest]),
    __metadata("design:returntype", Promise)
], MailController.prototype, "sendJobOfferByMail", null);
MailController = __decorate([
    (0, common_1.Controller)('mail'),
    (0, swagger_1.ApiTags)('mail'),
    __metadata("design:paramtypes", [mail_service_1.MailService])
], MailController);
exports.MailController = MailController;
//# sourceMappingURL=mail.controller.js.map