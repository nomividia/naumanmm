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
exports.GetHistoryRequest = exports.GetHistoriesResponse = exports.GetHistoryResponse = exports.HistoryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const user_dto_1 = require("../../models/dto/user-dto");
const base_search_requests_1 = require("../../models/requests/base-search-requests");
const base_search_responses_1 = require("../../models/responses/base-search-responses");
const generic_response_1 = require("../../models/responses/generic-response");
class HistoryDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], HistoryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], HistoryDto.prototype, "entity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], HistoryDto.prototype, "entityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], HistoryDto.prototype, "field", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], HistoryDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], HistoryDto.prototype, "valueBefore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], HistoryDto.prototype, "valueAfter", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], HistoryDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => user_dto_1.UserDto }),
    __metadata("design:type", user_dto_1.UserDto)
], HistoryDto.prototype, "user", void 0);
exports.HistoryDto = HistoryDto;
class GetHistoryResponse extends generic_response_1.GenericResponse {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => HistoryDto }),
    __metadata("design:type", HistoryDto)
], GetHistoryResponse.prototype, "history", void 0);
exports.GetHistoryResponse = GetHistoryResponse;
class GetHistoriesResponse extends base_search_responses_1.BaseSearchResponse {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => HistoryDto, isArray: true }),
    __metadata("design:type", Array)
], GetHistoriesResponse.prototype, "histories", void 0);
exports.GetHistoriesResponse = GetHistoriesResponse;
class GetHistoryRequest extends base_search_requests_1.BaseSearchRequest {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], GetHistoryRequest.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'get history by entityId' }),
    __metadata("design:type", String)
], GetHistoryRequest.prototype, "entityId", void 0);
exports.GetHistoryRequest = GetHistoryRequest;
//# sourceMappingURL=history.dto.js.map