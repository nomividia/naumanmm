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
exports.GetNotificationsResponse = exports.GetNotificationResponse = exports.NotificationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_search_responses_1 = require("../responses/base-search-responses");
const generic_response_1 = require("../responses/generic-response");
const user_dto_1 = require("./user-dto");
class NotificationDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], NotificationDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => user_dto_1.UserDto, isArray: false }),
    __metadata("design:type", user_dto_1.UserDto)
], NotificationDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NotificationDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], NotificationDto.prototype, "creationDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NotificationDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], NotificationDto.prototype, "seen", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], NotificationDto.prototype, "url", void 0);
exports.NotificationDto = NotificationDto;
class GetNotificationResponse extends generic_response_1.GenericResponse {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => NotificationDto, isArray: false }),
    __metadata("design:type", NotificationDto)
], GetNotificationResponse.prototype, "notification", void 0);
exports.GetNotificationResponse = GetNotificationResponse;
class GetNotificationsResponse extends base_search_responses_1.BaseSearchResponse {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => NotificationDto, isArray: true }),
    __metadata("design:type", Array)
], GetNotificationsResponse.prototype, "notifications", void 0);
exports.GetNotificationsResponse = GetNotificationsResponse;
//# sourceMappingURL=notification-dto.js.map