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
exports.GetConsultantMessagesRequest = exports.GetCandidateMessagesRequest = exports.GetCandidateMessagesResponse = exports.GetCandidateMessageResponse = exports.CandidateMessageDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const shared_constants_1 = require("../../../shared/shared-constants");
const user_dto_1 = require("../../models/dto/user-dto");
const base_search_requests_1 = require("../../models/requests/base-search-requests");
const base_search_responses_1 = require("../../models/responses/base-search-responses");
const generic_response_1 = require("../../models/responses/generic-response");
const candidate_dto_1 = require("../candidates/candidate-dto");
class CandidateMessageDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateMessageDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], CandidateMessageDto.prototype, "creationDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], CandidateMessageDto.prototype, "modifDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateMessageDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateMessageDto.prototype, "candidateId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => candidate_dto_1.CandidateDto }),
    __metadata("design:type", candidate_dto_1.CandidateDto)
], CandidateMessageDto.prototype, "candidate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], CandidateMessageDto.prototype, "seen", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateMessageDto.prototype, "senderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => user_dto_1.UserDto }),
    __metadata("design:type", user_dto_1.UserDto)
], CandidateMessageDto.prototype, "sender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    __metadata("design:type", String)
], CandidateMessageDto.prototype, "senderType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], CandidateMessageDto.prototype, "archived", void 0);
exports.CandidateMessageDto = CandidateMessageDto;
class GetCandidateMessageResponse extends generic_response_1.GenericResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => CandidateMessageDto }),
    __metadata("design:type", CandidateMessageDto)
], GetCandidateMessageResponse.prototype, "candidateMessage", void 0);
exports.GetCandidateMessageResponse = GetCandidateMessageResponse;
class GetCandidateMessagesResponse extends base_search_responses_1.BaseSearchResponse {
    constructor() {
        super(...arguments);
        this.candidateMessages = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => CandidateMessageDto, isArray: true }),
    __metadata("design:type", Array)
], GetCandidateMessagesResponse.prototype, "candidateMessages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetCandidateMessagesResponse.prototype, "unSeenMessagesCount", void 0);
exports.GetCandidateMessagesResponse = GetCandidateMessagesResponse;
class GetCandidateMessagesRequest extends base_search_requests_1.BaseSearchRequest {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'filter candidate message by candidate',
    }),
    __metadata("design:type", String)
], GetCandidateMessagesRequest.prototype, "candidateId", void 0);
exports.GetCandidateMessagesRequest = GetCandidateMessagesRequest;
class GetConsultantMessagesRequest extends base_search_requests_1.BaseSearchRequest {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'filter candidate message by candidate',
    }),
    __metadata("design:type", String)
], GetConsultantMessagesRequest.prototype, "consultantId", void 0);
exports.GetConsultantMessagesRequest = GetConsultantMessagesRequest;
//# sourceMappingURL=candidate-message-dto.js.map