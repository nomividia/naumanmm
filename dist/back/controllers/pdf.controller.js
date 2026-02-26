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
exports.PdfController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shared_constants_1 = require("../../shared/shared-constants");
const generic_response_1 = require("../models/responses/generic-response");
const roles_guard_1 = require("../services/guards/roles-guard");
const roles_decorator_1 = require("../services/roles.decorator");
const pdf_service_1 = require("../services/tools/pdf.service");
const base_controller_1 = require("../shared/base.controller");
let PdfController = class PdfController extends base_controller_1.BaseController {
    constructor(pdfService) {
        super();
        this.pdfService = pdfService;
    }
    generatePdfTest() {
        return __awaiter(this, void 0, void 0, function* () {
            const services = [
                { name: 'service1', qty: 3, price: 10 },
                { name: 'service2', qty: 5, price: 20 },
                { name: 'service3', qty: 7, price: 15 },
            ];
            const pdfResponse = yield this.pdfService.generatePdf('devis.html', 'test.pdf', { firstName: 'prénom', lastName: 'nom', services: services });
            delete pdfResponse.fullLocalPath;
            return pdfResponse;
        });
    }
    servePdfFile(res, pdfFile, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pdfService.servePdfFile(pdfFile, res, fileName);
        });
    }
};
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin),
    (0, common_1.Post)('generate-pdf'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'generate pdf', operationId: 'generate-pdf' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'generate pdf',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PdfController.prototype, "generatePdfTest", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin),
    (0, common_1.Get)('pdf'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Header)('Content-Type', 'application/pdf'),
    (0, swagger_1.ApiOperation)({ summary: 'get pdf', operationId: 'getPdf' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'get pdf', type: Object }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('pdfFile')),
    __param(2, (0, common_1.Query)('fileName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PdfController.prototype, "servePdfFile", null);
PdfController = __decorate([
    (0, common_1.Controller)('pdf'),
    (0, swagger_1.ApiTags)('pdf'),
    __metadata("design:paramtypes", [pdf_service_1.PdfService])
], PdfController);
exports.PdfController = PdfController;
//# sourceMappingURL=pdf.controller.js.map