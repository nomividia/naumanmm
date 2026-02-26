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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCandidateApplicationJobsResponse = exports.GetCandidateApplicationJobResponse = exports.CandidateApplicationJobsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_search_responses_1 = require("../../models/responses/base-search-responses");
const generic_response_1 = require("../../models/responses/generic-response");
const candidate_application_dto_1 = require("../candidates-application/candidate-application-dto");
const job_offer_dto_1 = require("../job-offers/job-offer-dto");
class CandidateApplicationJobsDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateApplicationJobsDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], CandidateApplicationJobsDto.prototype, "creationDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], CandidateApplicationJobsDto.prototype, "modifDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateApplicationJobsDto.prototype, "candidateApplicationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => candidate_application_dto_1.CandidateApplicationDto }),
    __metadata("design:type", candidate_application_dto_1.CandidateApplicationDto)
], CandidateApplicationJobsDto.prototype, "candidateApplication", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateApplicationJobsDto.prototype, "jobOfferId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => job_offer_dto_1.JobOfferDto }),
    __metadata("design:type", job_offer_dto_1.JobOfferDto)
], CandidateApplicationJobsDto.prototype, "jobOffer", void 0);
exports.CandidateApplicationJobsDto = CandidateApplicationJobsDto;
class GetCandidateApplicationJobResponse extends generic_response_1.GenericResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => CandidateApplicationJobsDto }),
    __metadata("design:type", CandidateApplicationJobsDto)
], GetCandidateApplicationJobResponse.prototype, "candidateApplicationJob", void 0);
exports.GetCandidateApplicationJobResponse = GetCandidateApplicationJobResponse;
class GetCandidateApplicationJobsResponse extends base_search_responses_1.BaseSearchResponse {
    constructor() {
        super(...arguments);
        this.candidateApplicationJobs = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => CandidateApplicationJobsDto, isArray: true }),
    __metadata("design:type", Array)
], GetCandidateApplicationJobsResponse.prototype, "candidateApplicationJobs", void 0);
exports.GetCandidateApplicationJobsResponse = GetCandidateApplicationJobsResponse;
//# sourceMappingURL=candidates-application-jobs-dto.js.map