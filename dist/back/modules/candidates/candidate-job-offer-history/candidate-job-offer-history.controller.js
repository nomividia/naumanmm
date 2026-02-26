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
exports.CandidateJobOfferHistoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shared_constants_1 = require("../../../../shared/shared-constants");
const roles_guard_1 = require("../../../services/guards/roles-guard");
const roles_decorator_1 = require("../../../services/roles.decorator");
const candidate_job_offer_history_dto_1 = require("./candidate-job-offer-history-dto");
const candidate_job_offer_history_service_1 = require("./candidate-job-offer-history.service");
let CandidateJobOfferHistoryController = class CandidateJobOfferHistoryController {
    constructor(candidateJobOfferHistoryService) {
        this.candidateJobOfferHistoryService = candidateJobOfferHistoryService;
    }
    createHistoryEntry(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.candidateJobOfferHistoryService.createHistoryEntry(request.candidateId, request.jobOfferId, request.action, request.candidateFirstName, request.candidateLastName, request.startDate, request.contractFileId);
        });
    }
    getJobOfferHistory(jobOfferId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            query.jobOfferId = jobOfferId;
            return yield this.candidateJobOfferHistoryService.getJobOfferHistory(query);
        });
    }
    getCandidateHistory(candidateId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            query.candidateId = candidateId;
            return yield this.candidateJobOfferHistoryService.getJobOfferHistory(query);
        });
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new history entry' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'History entry created successfully',
    }),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH, shared_constants_1.RolesList.Consultant),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [candidate_job_offer_history_dto_1.CreateCandidateJobOfferHistoryRequest]),
    __metadata("design:returntype", Promise)
], CandidateJobOfferHistoryController.prototype, "createHistoryEntry", null);
__decorate([
    (0, common_1.Get)('job-offer/:jobOfferId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get history for a specific job offer' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Job offer history retrieved successfully',
    }),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH, shared_constants_1.RolesList.Consultant),
    __param(0, (0, common_1.Param)('jobOfferId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, candidate_job_offer_history_dto_1.GetCandidateJobOfferHistoryRequest]),
    __metadata("design:returntype", Promise)
], CandidateJobOfferHistoryController.prototype, "getJobOfferHistory", null);
__decorate([
    (0, common_1.Get)('candidate/:candidateId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get history for a specific candidate' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Candidate history retrieved successfully',
    }),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.RH, shared_constants_1.RolesList.Consultant),
    __param(0, (0, common_1.Param)('candidateId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, candidate_job_offer_history_dto_1.GetCandidateJobOfferHistoryRequest]),
    __metadata("design:returntype", Promise)
], CandidateJobOfferHistoryController.prototype, "getCandidateHistory", null);
CandidateJobOfferHistoryController = __decorate([
    (0, swagger_1.ApiTags)('Candidate Job Offer History'),
    (0, common_1.Controller)('candidate-job-offer-history'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [candidate_job_offer_history_service_1.CandidateJobOfferHistoryService])
], CandidateJobOfferHistoryController);
exports.CandidateJobOfferHistoryController = CandidateJobOfferHistoryController;
//# sourceMappingURL=candidate-job-offer-history.controller.js.map