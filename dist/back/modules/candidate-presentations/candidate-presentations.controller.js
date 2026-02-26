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
exports.CandidatePresentationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const candidate_presentation_dto_1 = require("./candidate-presentation-dto");
const candidate_presentations_service_1 = require("./candidate-presentations.service");
const roles_guard_1 = require("../../services/guards/roles-guard");
const shared_constants_1 = require("../../../shared/shared-constants");
const roles_decorator_1 = require("../../services/roles.decorator");
const base_controller_1 = require("../../shared/base.controller");
let CandidatePresentationsController = class CandidatePresentationsController extends base_controller_1.BaseController {
    constructor(candidatePresentationsService) {
        super();
        this.candidatePresentationsService = candidatePresentationsService;
    }
    getDefaultPresentation(candidateId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.candidatePresentationsService.getDefaultPresentation(candidateId);
        });
    }
    findAllByCandidateId(candidateId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.candidatePresentationsService.findAllByCandidateId(candidateId);
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.candidatePresentationsService.findOne(id);
        });
    }
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.candidatePresentationsService.create(dto);
        });
    }
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.candidatePresentationsService.update(id, dto);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.candidatePresentationsService.delete(id);
        });
    }
    setAsDefault(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.candidatePresentationsService.setAsDefault(id);
        });
    }
};
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Get)('candidate/:candidateId/default'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get the default presentation for a candidate',
        operationId: 'getDefaultPresentation',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns the default presentation or null',
        type: candidate_presentation_dto_1.CandidatePresentationDto,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('candidateId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CandidatePresentationsController.prototype, "getDefaultPresentation", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Get)('candidate/:candidateId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all presentations for a candidate',
        operationId: 'findAllByCandidateId',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns all presentations for the candidate',
        type: [candidate_presentation_dto_1.CandidatePresentationDto],
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('candidateId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CandidatePresentationsController.prototype, "findAllByCandidateId", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a single presentation by ID',
        operationId: 'findOne',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns the presentation',
        type: candidate_presentation_dto_1.CandidatePresentationDto,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CandidatePresentationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new presentation',
        operationId: 'create',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The presentation has been created',
        type: candidate_presentation_dto_1.CandidatePresentationDto,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [candidate_presentation_dto_1.CandidatePresentationDto]),
    __metadata("design:returntype", Promise)
], CandidatePresentationsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a presentation',
        operationId: 'update',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The presentation has been updated',
        type: candidate_presentation_dto_1.CandidatePresentationDto,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, candidate_presentation_dto_1.CandidatePresentationDto]),
    __metadata("design:returntype", Promise)
], CandidatePresentationsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a presentation (soft delete)',
        operationId: 'delete',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The presentation has been deleted',
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CandidatePresentationsController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Consultant, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH),
    (0, common_1.Post)(':id/set-default'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Set a presentation as default',
        operationId: 'setAsDefault',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The presentation has been set as default',
        type: candidate_presentation_dto_1.CandidatePresentationDto,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CandidatePresentationsController.prototype, "setAsDefault", null);
CandidatePresentationsController = __decorate([
    (0, swagger_1.ApiTags)('candidate-presentations'),
    (0, common_1.Controller)('candidate-presentations'),
    __metadata("design:paramtypes", [candidate_presentations_service_1.CandidatePresentationsService])
], CandidatePresentationsController);
exports.CandidatePresentationsController = CandidatePresentationsController;
//# sourceMappingURL=candidate-presentations.controller.js.map