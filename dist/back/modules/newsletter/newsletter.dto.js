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
exports.SendNewsletterWithContactsResponse = exports.UnsubscribeFromNewsletterRequest = exports.GetNewsletterCandidateApplicationsResponse = exports.GetCandidatesCountResponse = exports.GetNewsletterCandidateApplicationsRequest = exports.GetCandidatesCountRequest = exports.GetNewslettersRequest = exports.GetNewslettersResponse = exports.GetNewsletterResponse = exports.NewsletterDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const shared_constants_1 = require("../../../shared/shared-constants");
const app_value_dto_1 = require("../../models/dto/app-value-dto");
const base_dto_1 = require("../../models/dto/base.dto");
const base_search_requests_1 = require("../../models/requests/base-search-requests");
const base_search_responses_1 = require("../../models/responses/base-search-responses");
const generic_response_1 = require("../../models/responses/generic-response");
const types_1 = require("../../shared/types");
const candidate_application_dto_1 = require("../candidates-application/candidate-application-dto");
const candidate_department_dto_1 = require("../candidates/candidate-department/candidate-department.dto");
const candidate_dto_1 = require("../candidates/candidate-dto");
const newsletter_candidate_jobs_dto_1 = require("../candidates/newsletter-candidate-jobs.dto");
const newsletter_candidate_status_dto_1 = require("../candidates/newsletter-candidate-status.dto");
const newsletter_joboffer_dto_1 = require("../candidates/newsletter-joboffer.dto");
class NewsletterDto extends base_dto_1.BaseDto {
    constructor() {
        super(...arguments);
        this.type = shared_constants_1.NewsletterType.Email;
    }
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], NewsletterDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], NewsletterDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], NewsletterDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], NewsletterDto.prototype, "sender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], NewsletterDto.prototype, "newsletterStatusId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", app_value_dto_1.AppValueDto)
], NewsletterDto.prototype, "newsletterStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], NewsletterDto.prototype, "sendDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], NewsletterDto.prototype, "candidatesCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], NewsletterDto.prototype, "candidateApplicationsCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => newsletter_candidate_status_dto_1.NewsLetterCandidateStatusDto,
        isArray: true,
    }),
    __metadata("design:type", Array)
], NewsletterDto.prototype, "newsLettersCandidateStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => newsletter_candidate_jobs_dto_1.NewsLetterCandidateJobsDto,
        isArray: true,
    }),
    __metadata("design:type", Array)
], NewsletterDto.prototype, "newsLettersJob", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => newsletter_joboffer_dto_1.NewsletterJobOfferDto, isArray: true }),
    __metadata("design:type", Array)
], NewsletterDto.prototype, "newslettersJobOffer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], NewsletterDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], NewsletterDto.prototype, "newsletterSibId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], NewsletterDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], NewsletterDto.prototype, "newsletterListSibId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number }),
    __metadata("design:type", Number)
], NewsletterDto.prototype, "sentCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number }),
    __metadata("design:type", Number)
], NewsletterDto.prototype, "deliveredCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number }),
    __metadata("design:type", Number)
], NewsletterDto.prototype, "answeredCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number }),
    __metadata("design:type", Number)
], NewsletterDto.prototype, "unsubscriptionsCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number }),
    __metadata("design:type", Number)
], NewsletterDto.prototype, "openedCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number }),
    __metadata("design:type", Number)
], NewsletterDto.prototype, "clickedCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], NewsletterDto.prototype, "htmlFullContent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], NewsletterDto.prototype, "includeCandidateApplications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => candidate_department_dto_1.CandidateDepartmentDto, isArray: true }),
    __metadata("design:type", Array)
], NewsletterDto.prototype, "candidateDepartments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    __metadata("design:type", Array)
], NewsletterDto.prototype, "cityFilter", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], NewsletterDto.prototype, "countriesFilter", void 0);
exports.NewsletterDto = NewsletterDto;
class GetNewsletterResponse extends generic_response_1.GenericResponse {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => NewsletterDto }),
    __metadata("design:type", NewsletterDto)
], GetNewsletterResponse.prototype, "newsletter", void 0);
exports.GetNewsletterResponse = GetNewsletterResponse;
class GetNewslettersResponse extends base_search_responses_1.BaseSearchResponse {
    constructor() {
        super(...arguments);
        this.newsletters = [];
    }
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => NewsletterDto, isArray: true }),
    __metadata("design:type", Array)
], GetNewslettersResponse.prototype, "newsletters", void 0);
exports.GetNewslettersResponse = GetNewslettersResponse;
class GetNewslettersRequest extends base_search_requests_1.BaseSearchRequest {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter newsletter date' }),
    __metadata("design:type", String)
], GetNewslettersRequest.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter newsletter by statusId' }),
    __metadata("design:type", String)
], GetNewslettersRequest.prototype, "statusIdList", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter by year' }),
    __metadata("design:type", String)
], GetNewslettersRequest.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter by month' }),
    __metadata("design:type", String)
], GetNewslettersRequest.prototype, "month", void 0);
exports.GetNewslettersRequest = GetNewslettersRequest;
class GetCandidatesCountRequest {
    constructor() {
        this.isNewsletterFrench = 'false';
        this.newsletterType = shared_constants_1.NewsletterType.Email;
    }
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter newsletter by statusId' }),
    __metadata("design:type", String)
], GetCandidatesCountRequest.prototype, "statusIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter newsletter by jobIds' }),
    __metadata("design:type", String)
], GetCandidatesCountRequest.prototype, "jobIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'filter newsletter by cities',
        type: [String],
    }),
    __metadata("design:type", Array)
], GetCandidatesCountRequest.prototype, "cityFilter", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter newsletter by country' }),
    __metadata("design:type", String)
], GetCandidatesCountRequest.prototype, "countriesFilter", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'filter newsletter by candidate location',
    }),
    __metadata("design:type", String)
], GetCandidatesCountRequest.prototype, "isNewsletterFrench", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], GetCandidatesCountRequest.prototype, "newsletterType", void 0);
exports.GetCandidatesCountRequest = GetCandidatesCountRequest;
class GetNewsletterCandidateApplicationsRequest {
    constructor() {
        this.isNewsletterFrench = 'false';
        this.newsletterType = shared_constants_1.NewsletterType.Email;
    }
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'filter newsletter by candidate location',
    }),
    __metadata("design:type", String)
], GetNewsletterCandidateApplicationsRequest.prototype, "isNewsletterFrench", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'candidate adresses already loaded' }),
    __metadata("design:type", Array)
], GetNewsletterCandidateApplicationsRequest.prototype, "candidateAdressesAlreadyLoaded", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], GetNewsletterCandidateApplicationsRequest.prototype, "newsletterType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter newsletter by jobIds' }),
    __metadata("design:type", String)
], GetNewsletterCandidateApplicationsRequest.prototype, "jobIds", void 0);
exports.GetNewsletterCandidateApplicationsRequest = GetNewsletterCandidateApplicationsRequest;
class GetCandidatesCountResponse extends generic_response_1.GenericResponse {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], GetCandidatesCountResponse.prototype, "candidatesCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => candidate_dto_1.CandidateDto, isArray: true }),
    __metadata("design:type", Array)
], GetCandidatesCountResponse.prototype, "candidates", void 0);
exports.GetCandidatesCountResponse = GetCandidatesCountResponse;
class GetNewsletterCandidateApplicationsResponse extends generic_response_1.GenericResponse {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], GetNewsletterCandidateApplicationsResponse.prototype, "candidateApplicationsCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => candidate_application_dto_1.CandidateApplicationDto, isArray: true }),
    __metadata("design:type", Array)
], GetNewsletterCandidateApplicationsResponse.prototype, "candidateApplications", void 0);
exports.GetNewsletterCandidateApplicationsResponse = GetNewsletterCandidateApplicationsResponse;
class UnsubscribeFromNewsletterRequest {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UnsubscribeFromNewsletterRequest.prototype, "guid", void 0);
exports.UnsubscribeFromNewsletterRequest = UnsubscribeFromNewsletterRequest;
class SendNewsletterWithContactsResponse extends types_1.SendNewsletterResponse {
}
exports.SendNewsletterWithContactsResponse = SendNewsletterWithContactsResponse;
//# sourceMappingURL=newsletter.dto.js.map