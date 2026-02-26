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
exports.GetInterviewsRequest = exports.CheckCandidatesInterviewEligibilityResponse = exports.CandidateInterviewEligibility = exports.CheckCandidatesInterviewEligibilityRequest = exports.GetInterviewsResponse = exports.SaveInterviewResponseResponse = exports.GetInterviewResponse = exports.InterviewDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const shared_constants_1 = require("../../../shared/shared-constants");
const user_dto_1 = require("../../models/dto/user-dto");
const base_search_requests_1 = require("../../models/requests/base-search-requests");
const base_search_responses_1 = require("../../models/responses/base-search-responses");
const generic_response_1 = require("../../models/responses/generic-response");
const candidate_dto_1 = require("../candidates/candidate-dto");
class InterviewDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], InterviewDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], InterviewDto.prototype, "creationDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], InterviewDto.prototype, "modifDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], InterviewDto.prototype, "candidateId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => candidate_dto_1.CandidateDto }),
    __metadata("design:type", candidate_dto_1.CandidateDto)
], InterviewDto.prototype, "candidate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, format: 'date-time' }),
    __metadata("design:type", Date)
], InterviewDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], InterviewDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], InterviewDto.prototype, "comment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], InterviewDto.prototype, "consultantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => user_dto_1.UserDto }),
    __metadata("design:type", user_dto_1.UserDto)
], InterviewDto.prototype, "consultant", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], InterviewDto.prototype, "guid", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], InterviewDto.prototype, "candidateResponse", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], InterviewDto.prototype, "agencyPlace", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether the candidate did not show up to the interview' }),
    __metadata("design:type", Boolean)
], InterviewDto.prototype, "noShow", void 0);
exports.InterviewDto = InterviewDto;
class GetInterviewResponse extends generic_response_1.GenericResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => InterviewDto }),
    __metadata("design:type", InterviewDto)
], GetInterviewResponse.prototype, "interview", void 0);
exports.GetInterviewResponse = GetInterviewResponse;
class SaveInterviewResponseResponse extends GetInterviewResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SaveInterviewResponseResponse.prototype, "alreadyAccepted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SaveInterviewResponseResponse.prototype, "alreadyRefused", void 0);
exports.SaveInterviewResponseResponse = SaveInterviewResponseResponse;
class GetInterviewsResponse extends base_search_responses_1.BaseSearchResponse {
    constructor() {
        super(...arguments);
        this.interviews = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => InterviewDto, isArray: true }),
    __metadata("design:type", Array)
], GetInterviewsResponse.prototype, "interviews", void 0);
exports.GetInterviewsResponse = GetInterviewsResponse;
class CheckCandidatesInterviewEligibilityRequest {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of candidate IDs to check', type: [String] }),
    __metadata("design:type", Array)
], CheckCandidatesInterviewEligibilityRequest.prototype, "candidateIds", void 0);
exports.CheckCandidatesInterviewEligibilityRequest = CheckCandidatesInterviewEligibilityRequest;
class CandidateInterviewEligibility {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The candidate ID' }),
    __metadata("design:type", String)
], CandidateInterviewEligibility.prototype, "candidateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the candidate is eligible (has recent interview with current consultant)' }),
    __metadata("design:type", Boolean)
], CandidateInterviewEligibility.prototype, "isEligible", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date of the last interview with current consultant', required: false }),
    __metadata("design:type", Date)
], CandidateInterviewEligibility.prototype, "lastInterviewDate", void 0);
exports.CandidateInterviewEligibility = CandidateInterviewEligibility;
class CheckCandidatesInterviewEligibilityResponse extends generic_response_1.GenericResponse {
    constructor() {
        super(...arguments);
        this.eligibilities = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => CandidateInterviewEligibility, isArray: true }),
    __metadata("design:type", Array)
], CheckCandidatesInterviewEligibilityResponse.prototype, "eligibilities", void 0);
exports.CheckCandidatesInterviewEligibilityResponse = CheckCandidatesInterviewEligibilityResponse;
class GetInterviewsRequest extends base_search_requests_1.BaseSearchRequest {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter interviews by candidate' }),
    __metadata("design:type", String)
], GetInterviewsRequest.prototype, "candidateId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter interview by month' }),
    __metadata("design:type", String)
], GetInterviewsRequest.prototype, "interviewFilterMonth", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter interview by year' }),
    __metadata("design:type", String)
], GetInterviewsRequest.prototype, "interviewFilterYear", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'filter interview by a date',
    }),
    __metadata("design:type", String)
], GetInterviewsRequest.prototype, "interviewCurrentDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'filter interview by place',
    }),
    __metadata("design:type", String)
], GetInterviewsRequest.prototype, "interviewPlace", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'filter by interview confirmation status',
    }),
    __metadata("design:type", String)
], GetInterviewsRequest.prototype, "interviewConfirmationStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Boolean,
        description: 'filter by no-show status',
    }),
    __metadata("design:type", Boolean)
], GetInterviewsRequest.prototype, "noShow", void 0);
exports.GetInterviewsRequest = GetInterviewsRequest;
//# sourceMappingURL=interview-dto.js.map