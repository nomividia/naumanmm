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
exports.GetAnonymousExchangeForCandidateApplicationRequest = exports.GetAnonymousExchangesForCandidateApplicationResponse = exports.GetAnonymousExchangeForCandidateApplicationResponse = exports.AnonymousExchangeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const shared_constants_1 = require("../../../shared/shared-constants");
const app_file_dto_1 = require("../../models/dto/app-file-dto");
const base_dto_1 = require("../../models/dto/base.dto");
const user_dto_1 = require("../../models/dto/user-dto");
const base_search_requests_1 = require("../../models/requests/base-search-requests");
const base_search_responses_1 = require("../../models/responses/base-search-responses");
const candidate_application_dto_1 = require("../candidates-application/candidate-application-dto");
class AnonymousExchangeDto extends base_dto_1.BaseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AnonymousExchangeDto.prototype, "candidateApplicationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => candidate_application_dto_1.CandidateApplicationDto }),
    __metadata("design:type", candidate_application_dto_1.CandidateApplicationDto)
], AnonymousExchangeDto.prototype, "candidateApplication", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], AnonymousExchangeDto.prototype, "consultantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => user_dto_1.UserDto }),
    __metadata("design:type", user_dto_1.UserDto)
], AnonymousExchangeDto.prototype, "consultant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AnonymousExchangeDto.prototype, "messageContent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], AnonymousExchangeDto.prototype, "seen", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: shared_constants_1.AnonymousMessageSenderType,
        enumName: 'AnonymousMessageSenderType',
    }),
    __metadata("design:type", String)
], AnonymousExchangeDto.prototype, "senderType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], AnonymousExchangeDto.prototype, "fileId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => app_file_dto_1.AppFileDto }),
    __metadata("design:type", app_file_dto_1.AppFileDto)
], AnonymousExchangeDto.prototype, "file", void 0);
exports.AnonymousExchangeDto = AnonymousExchangeDto;
class GetAnonymousExchangeForCandidateApplicationResponse extends base_search_responses_1.BaseSearchResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => AnonymousExchangeDto }),
    __metadata("design:type", AnonymousExchangeDto)
], GetAnonymousExchangeForCandidateApplicationResponse.prototype, "exchange", void 0);
exports.GetAnonymousExchangeForCandidateApplicationResponse = GetAnonymousExchangeForCandidateApplicationResponse;
class GetAnonymousExchangesForCandidateApplicationResponse extends base_search_responses_1.BaseSearchResponse {
    constructor() {
        super(...arguments);
        this.exchanges = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => AnonymousExchangeDto, isArray: true }),
    __metadata("design:type", Array)
], GetAnonymousExchangesForCandidateApplicationResponse.prototype, "exchanges", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetAnonymousExchangesForCandidateApplicationResponse.prototype, "unSeenMessagesCount", void 0);
exports.GetAnonymousExchangesForCandidateApplicationResponse = GetAnonymousExchangesForCandidateApplicationResponse;
class GetAnonymousExchangeForCandidateApplicationRequest extends base_search_requests_1.BaseSearchRequest {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'filter anonymous exchange by candidate application',
    }),
    __metadata("design:type", String)
], GetAnonymousExchangeForCandidateApplicationRequest.prototype, "candidateApplicationId", void 0);
exports.GetAnonymousExchangeForCandidateApplicationRequest = GetAnonymousExchangeForCandidateApplicationRequest;
//# sourceMappingURL=anonymous-exchange.dto.js.map