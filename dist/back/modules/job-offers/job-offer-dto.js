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
exports.SendJobOfferByMailRequest = exports.GetJobOfferRequest = exports.GetJobOffersResponse = exports.GetJobOfferResponse = exports.JobOfferDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const app_value_dto_1 = require("../../models/dto/app-value-dto");
const user_dto_1 = require("../../models/dto/user-dto");
const base_search_requests_1 = require("../../models/requests/base-search-requests");
const base_search_responses_1 = require("../../models/responses/base-search-responses");
const generic_response_1 = require("../../models/responses/generic-response");
const candidates_application_jobs_dto_1 = require("../candidate-application-jobs/candidates-application-jobs-dto");
const candidate_application_dto_1 = require("../candidates-application/candidate-application-dto");
const customer_dto_1 = require("../customer/customer.dto");
class JobOfferDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobOfferDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], JobOfferDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], JobOfferDto.prototype, "jobDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], JobOfferDto.prototype, "ref", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], JobOfferDto.prototype, "creationDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], JobOfferDto.prototype, "modifDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobOfferDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobOfferDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobOfferDto.prototype, "countryCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobOfferDto.prototype, "consultantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => user_dto_1.UserDto }),
    __metadata("design:type", user_dto_1.UserDto)
], JobOfferDto.prototype, "consultant", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobOfferDto.prototype, "salary", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobOfferDto.prototype, "publicLink", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], JobOfferDto.prototype, "jobId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => app_value_dto_1.AppValueDto }),
    __metadata("design:type", app_value_dto_1.AppValueDto)
], JobOfferDto.prototype, "job", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobOfferDto.prototype, "taskResponsabilitiesDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobOfferDto.prototype, "candidateProfileDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobOfferDto.prototype, "conditionsDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], JobOfferDto.prototype, "applyInCouple", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobOfferDto.prototype, "contractTypeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => app_value_dto_1.AppValueDto }),
    __metadata("design:type", app_value_dto_1.AppValueDto)
], JobOfferDto.prototype, "contractType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => candidates_application_jobs_dto_1.CandidateApplicationJobsDto,
        isArray: true,
    }),
    __metadata("design:type", Array)
], JobOfferDto.prototype, "candidateApplicationJobs", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], JobOfferDto.prototype, "disabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobOfferDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => customer_dto_1.CustomerDto }),
    __metadata("design:type", customer_dto_1.CustomerDto)
], JobOfferDto.prototype, "customer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobOfferDto.prototype, "stateId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => app_value_dto_1.AppValueDto }),
    __metadata("design:type", app_value_dto_1.AppValueDto)
], JobOfferDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => candidate_application_dto_1.CandidateApplicationDto, isArray: true }),
    __metadata("design:type", Array)
], JobOfferDto.prototype, "candidateApplications", void 0);
exports.JobOfferDto = JobOfferDto;
class GetJobOfferResponse extends generic_response_1.GenericResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => JobOfferDto }),
    __metadata("design:type", JobOfferDto)
], GetJobOfferResponse.prototype, "jobOffer", void 0);
exports.GetJobOfferResponse = GetJobOfferResponse;
class GetJobOffersResponse extends base_search_responses_1.BaseSearchResponse {
    constructor() {
        super(...arguments);
        this.jobOffers = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => JobOfferDto, isArray: true }),
    __metadata("design:type", Array)
], GetJobOffersResponse.prototype, "jobOffers", void 0);
exports.GetJobOffersResponse = GetJobOffersResponse;
class GetJobOfferRequest extends base_search_requests_1.BaseSearchRequest {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter job offers by jobs' }),
    __metadata("design:type", String)
], GetJobOfferRequest.prototype, "jobIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter job offer by country code' }),
    __metadata("design:type", String)
], GetJobOfferRequest.prototype, "countryCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter job offer by consultant' }),
    __metadata("design:type", String)
], GetJobOfferRequest.prototype, "consultantIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'filter job offer with relationship selected',
    }),
    __metadata("design:type", String)
], GetJobOfferRequest.prototype, "applyInCouple", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter job by status archive or not' }),
    __metadata("design:type", String)
], GetJobOfferRequest.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter by city' }),
    __metadata("design:type", String)
], GetJobOfferRequest.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter by contractType' }),
    __metadata("design:type", String)
], GetJobOfferRequest.prototype, "contractTypeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter by customerIds' }),
    __metadata("design:type", String)
], GetJobOfferRequest.prototype, "customerIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter by contractTypeIds' }),
    __metadata("design:type", String)
], GetJobOfferRequest.prototype, "contractTypeIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter by stateId' }),
    __metadata("design:type", String)
], GetJobOfferRequest.prototype, "stateId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'exclude job offers that already have candidates placed to them',
        type: String,
    }),
    __metadata("design:type", String)
], GetJobOfferRequest.prototype, "excludePlacedJobOffers", void 0);
exports.GetJobOfferRequest = GetJobOfferRequest;
class SendJobOfferByMailRequest {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SendJobOfferByMailRequest.prototype, "object", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SendJobOfferByMailRequest.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SendJobOfferByMailRequest.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SendJobOfferByMailRequest.prototype, "sender", void 0);
exports.SendJobOfferByMailRequest = SendJobOfferByMailRequest;
//# sourceMappingURL=job-offer-dto.js.map