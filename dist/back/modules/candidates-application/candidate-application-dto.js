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
exports.SetCandidateApplicationUnseenRequest = exports.GuidExchangeResponse = exports.ApplyToJobOffersRequest = exports.UnSeenCandidateApplicationResponse = exports.ValidateCandidateApplicationRequest = exports.RefuseCandidateApplicationRequest = exports.SubmitCandidateApplicationFormRequest = exports.GetCandidateApplicationsRequest = exports.GetCandidateApplicationsResponse = exports.GetCandidateApplicationResponse = exports.CandidateApplicationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const address_dto_1 = require("../../models/dto/address-dto");
const app_file_dto_1 = require("../../models/dto/app-file-dto");
const app_value_dto_1 = require("../../models/dto/app-value-dto");
const base_search_requests_1 = require("../../models/requests/base-search-requests");
const base_search_responses_1 = require("../../models/responses/base-search-responses");
const generic_response_1 = require("../../models/responses/generic-response");
const anonymous_exchange_dto_1 = require("../anonymous-exchange/anonymous-exchange.dto");
const candidates_application_jobs_dto_1 = require("../candidate-application-jobs/candidates-application-jobs-dto");
const candidate_country_dto_1 = require("../candidates/candidate-country/candidate-country.dto");
const candidate_department_dto_1 = require("../candidates/candidate-department/candidate-department.dto");
const candidate_dto_1 = require("../candidates/candidate-dto");
class CandidateApplicationDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateApplicationDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateApplicationDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateApplicationDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateApplicationDto.prototype, "genderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => app_value_dto_1.AppValueDto }),
    __metadata("design:type", app_value_dto_1.AppValueDto)
], CandidateApplicationDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], CandidateApplicationDto.prototype, "birthDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateApplicationDto.prototype, "partnerFirstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateApplicationDto.prototype, "partnerLastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateApplicationDto.prototype, "partnerGenderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => app_value_dto_1.AppValueDto }),
    __metadata("design:type", app_value_dto_1.AppValueDto)
], CandidateApplicationDto.prototype, "partnerGender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], CandidateApplicationDto.prototype, "partnerBirthDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateApplicationDto.prototype, "partnerEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateApplicationDto.prototype, "partnerPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateApplicationDto.prototype, "professionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => app_value_dto_1.AppValueDto }),
    __metadata("design:type", app_value_dto_1.AppValueDto)
], CandidateApplicationDto.prototype, "profession", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => address_dto_1.AddressDto }),
    __metadata("design:type", address_dto_1.AddressDto)
], CandidateApplicationDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateApplicationDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateApplicationDto.prototype, "phoneSecondary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateApplicationDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateApplicationDto.prototype, "skills", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateApplicationDto.prototype, "relationshipStatusId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => app_value_dto_1.AppValueDto }),
    __metadata("design:type", app_value_dto_1.AppValueDto)
], CandidateApplicationDto.prototype, "relationshipStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], CandidateApplicationDto.prototype, "creationDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], CandidateApplicationDto.prototype, "modifDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => app_value_dto_1.AppValueDto }),
    __metadata("design:type", app_value_dto_1.AppValueDto)
], CandidateApplicationDto.prototype, "applyStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateApplicationDto.prototype, "applyStatusId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], CandidateApplicationDto.prototype, "inCouple", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], CandidateApplicationDto.prototype, "spontaneousApplication", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateApplicationDto.prototype, "candidateId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateApplicationDto.prototype, "mainPhotoBase64", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateApplicationDto.prototype, "mainPhotoBase64MimeType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateApplicationDto.prototype, "photoFileId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => app_file_dto_1.AppFileDto }),
    __metadata("design:type", app_file_dto_1.AppFileDto)
], CandidateApplicationDto.prototype, "photoFile", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateApplicationDto.prototype, "mainResumeFileId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => app_file_dto_1.AppFileDto }),
    __metadata("design:type", app_file_dto_1.AppFileDto)
], CandidateApplicationDto.prototype, "mainResumeFile", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateApplicationDto.prototype, "resumeFileBase64", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateApplicationDto.prototype, "resumeFileBase64MimeType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateApplicationDto.prototype, "partnerResumeFileId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => app_file_dto_1.AppFileDto }),
    __metadata("design:type", app_file_dto_1.AppFileDto)
], CandidateApplicationDto.prototype, "partnerResumeFile", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateApplicationDto.prototype, "partnerResumeFileBase64", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateApplicationDto.prototype, "partnerResumeFileBase64MimeType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], CandidateApplicationDto.prototype, "seen", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => candidates_application_jobs_dto_1.CandidateApplicationJobsDto,
        isArray: true,
    }),
    __metadata("design:type", Array)
], CandidateApplicationDto.prototype, "candidateApplicationJobs", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], CandidateApplicationDto.prototype, "disabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateApplicationDto.prototype, "jobOfferLinkedRef", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], CandidateApplicationDto.prototype, "linkedToCandidate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => candidate_dto_1.CandidateDto }),
    __metadata("design:type", candidate_dto_1.CandidateDto)
], CandidateApplicationDto.prototype, "candidate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateApplicationDto.prototype, "guidExchange", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => anonymous_exchange_dto_1.AnonymousExchangeDto, isArray: true }),
    __metadata("design:type", Array)
], CandidateApplicationDto.prototype, "anonymousExchanges", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], CandidateApplicationDto.prototype, "newsletterUnsubscribed", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateApplicationDto.prototype, "newsletterUnsubscribedGuid", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => candidate_department_dto_1.CandidateDepartmentDto, isArray: true }),
    __metadata("design:type", Array)
], CandidateApplicationDto.prototype, "candidateDepartments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => candidate_country_dto_1.CandidateCountryDto, isArray: true }),
    __metadata("design:type", Array)
], CandidateApplicationDto.prototype, "candidateCountries", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], CandidateApplicationDto.prototype, "allowed_to_work_us", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], CandidateApplicationDto.prototype, "require_sponsorship_us", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], CandidateApplicationDto.prototype, "usTermsAcceptedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateApplicationDto.prototype, "usTermsVersion", void 0);
exports.CandidateApplicationDto = CandidateApplicationDto;
class GetCandidateApplicationResponse extends generic_response_1.GenericResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => CandidateApplicationDto }),
    __metadata("design:type", CandidateApplicationDto)
], GetCandidateApplicationResponse.prototype, "candidateApplication", void 0);
exports.GetCandidateApplicationResponse = GetCandidateApplicationResponse;
class GetCandidateApplicationsResponse extends base_search_responses_1.BaseSearchResponse {
    constructor() {
        super(...arguments);
        this.candidateApplications = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => CandidateApplicationDto, isArray: true }),
    __metadata("design:type", Array)
], GetCandidateApplicationsResponse.prototype, "candidateApplications", void 0);
exports.GetCandidateApplicationsResponse = GetCandidateApplicationsResponse;
class GetCandidateApplicationsRequest extends base_search_requests_1.BaseSearchRequest {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'select candidates-applications with status selected',
    }),
    __metadata("design:type", String)
], GetCandidateApplicationsRequest.prototype, "applyStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'select candidates-applications with status selected',
    }),
    __metadata("design:type", String)
], GetCandidateApplicationsRequest.prototype, "candidateStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'select candidates-applications with relationship selected',
    }),
    __metadata("design:type", String)
], GetCandidateApplicationsRequest.prototype, "applyInCouple", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'select candidates-applications with job offer reference',
    }),
    __metadata("design:type", String)
], GetCandidateApplicationsRequest.prototype, "jobOfferRef", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'select candidates-applications with job category',
    }),
    __metadata("design:type", String)
], GetCandidateApplicationsRequest.prototype, "jobCategory", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'select candidates-applications with candidate id',
    }),
    __metadata("design:type", String)
], GetCandidateApplicationsRequest.prototype, "candidateId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'filter by status archive or not',
        type: String,
    }),
    __metadata("design:type", String)
], GetCandidateApplicationsRequest.prototype, "disabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'filter by status archive or not',
        type: String,
    }),
    __metadata("design:type", String)
], GetCandidateApplicationsRequest.prototype, "includeDisabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter by seen or not', type: String }),
    __metadata("design:type", String)
], GetCandidateApplicationsRequest.prototype, "showOnlyUnSeen", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'filter spontxsaneous application',
        type: String,
    }),
    __metadata("design:type", String)
], GetCandidateApplicationsRequest.prototype, "spontaneousApplication", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'hide spontaneous applications',
        type: String,
    }),
    __metadata("design:type", String)
], GetCandidateApplicationsRequest.prototype, "hideSpontaneousApplications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'filter only new candidates (not linked to existing candidate)',
        type: String,
    }),
    __metadata("design:type", String)
], GetCandidateApplicationsRequest.prototype, "onlyNewCandidate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter by consultant', type: String }),
    __metadata("design:type", String)
], GetCandidateApplicationsRequest.prototype, "consultantIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'select candidates-applications with job offer id',
    }),
    __metadata("design:type", String)
], GetCandidateApplicationsRequest.prototype, "jobOfferId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Exclude placed candidate',
        type: String,
    }),
    __metadata("design:type", String)
], GetCandidateApplicationsRequest.prototype, "excludePlaced", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by city (comma-separated list)',
        type: String,
    }),
    __metadata("design:type", String)
], GetCandidateApplicationsRequest.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by country codes (comma-separated list)',
        type: String,
    }),
    __metadata("design:type", String)
], GetCandidateApplicationsRequest.prototype, "locations", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by department',
        type: String,
    }),
    __metadata("design:type", String)
], GetCandidateApplicationsRequest.prototype, "department", void 0);
exports.GetCandidateApplicationsRequest = GetCandidateApplicationsRequest;
class SubmitCandidateApplicationFormRequest {
    constructor() {
        this.language = 'en';
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => CandidateApplicationDto }),
    __metadata("design:type", CandidateApplicationDto)
], SubmitCandidateApplicationFormRequest.prototype, "candidateApplication", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SubmitCandidateApplicationFormRequest.prototype, "recaptchaToken", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], SubmitCandidateApplicationFormRequest.prototype, "language", void 0);
exports.SubmitCandidateApplicationFormRequest = SubmitCandidateApplicationFormRequest;
class RefuseCandidateApplicationRequest {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'candidate application id' }),
    __metadata("design:type", String)
], RefuseCandidateApplicationRequest.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'create candidate or not' }),
    __metadata("design:type", Boolean)
], RefuseCandidateApplicationRequest.prototype, "createCandidate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => String,
        isArray: true,
        description: 'candidate current job',
    }),
    __metadata("design:type", Array)
], RefuseCandidateApplicationRequest.prototype, "candidateCurrentJobIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'give ats access' }),
    __metadata("design:type", Boolean)
], RefuseCandidateApplicationRequest.prototype, "giveAtsAccess", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'candidate gender id' }),
    __metadata("design:type", String)
], RefuseCandidateApplicationRequest.prototype, "genderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'is platform' }),
    __metadata("design:type", Boolean)
], RefuseCandidateApplicationRequest.prototype, "isPlatform", void 0);
exports.RefuseCandidateApplicationRequest = RefuseCandidateApplicationRequest;
class ValidateCandidateApplicationRequest {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'candidate application id' }),
    __metadata("design:type", String)
], ValidateCandidateApplicationRequest.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => String,
        isArray: true,
        description: 'candidate current job',
    }),
    __metadata("design:type", Array)
], ValidateCandidateApplicationRequest.prototype, "candidateCurrentJobIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'give ats access' }),
    __metadata("design:type", Boolean)
], ValidateCandidateApplicationRequest.prototype, "giveAtsAccess", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'candidate gender id' }),
    __metadata("design:type", String)
], ValidateCandidateApplicationRequest.prototype, "genderId", void 0);
exports.ValidateCandidateApplicationRequest = ValidateCandidateApplicationRequest;
class UnSeenCandidateApplicationResponse extends generic_response_1.GenericResponse {
    constructor() {
        super(...arguments);
        this.unSeenCandidateApplication = 0;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UnSeenCandidateApplicationResponse.prototype, "unSeenCandidateApplication", void 0);
exports.UnSeenCandidateApplicationResponse = UnSeenCandidateApplicationResponse;
class ApplyToJobOffersRequest {
}
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: String }),
    __metadata("design:type", Array)
], ApplyToJobOffersRequest.prototype, "jobOfferIds", void 0);
exports.ApplyToJobOffersRequest = ApplyToJobOffersRequest;
class GuidExchangeResponse extends generic_response_1.GenericResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], GuidExchangeResponse.prototype, "guid", void 0);
exports.GuidExchangeResponse = GuidExchangeResponse;
class SetCandidateApplicationUnseenRequest {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], SetCandidateApplicationUnseenRequest.prototype, "candidateApplicationId", void 0);
exports.SetCandidateApplicationUnseenRequest = SetCandidateApplicationUnseenRequest;
//# sourceMappingURL=candidate-application-dto.js.map