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
exports.GetActivityLogsResponse = exports.GetActivityLogResponse = exports.ActivityLogDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const app_value_dto_1 = require("../../models/dto/app-value-dto");
const user_dto_1 = require("../../models/dto/user-dto");
const base_search_responses_1 = require("../../models/responses/base-search-responses");
const generic_response_1 = require("../../models/responses/generic-response");
class ActivityLogDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ActivityLogDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", user_dto_1.UserDto)
], ActivityLogDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ActivityLogDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", app_value_dto_1.AppValueDto)
], ActivityLogDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ActivityLogDto.prototype, "typeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], ActivityLogDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ActivityLogDto.prototype, "meta", void 0);
exports.ActivityLogDto = ActivityLogDto;
class GetActivityLogResponse extends generic_response_1.GenericResponse {
    constructor() {
        super(...arguments);
        this.log = null;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => ActivityLogDto }),
    __metadata("design:type", ActivityLogDto)
], GetActivityLogResponse.prototype, "log", void 0);
exports.GetActivityLogResponse = GetActivityLogResponse;
class GetActivityLogsResponse extends base_search_responses_1.BaseSearchResponse {
    constructor() {
        super(...arguments);
        this.logs = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => ActivityLogDto, isArray: true }),
    __metadata("design:type", Array)
], GetActivityLogsResponse.prototype, "logs", void 0);
exports.GetActivityLogsResponse = GetActivityLogsResponse;
//# sourceMappingURL=activity-log-dto.js.map