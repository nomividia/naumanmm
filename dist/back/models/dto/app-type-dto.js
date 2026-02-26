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
exports.GetAppTypeRequest = exports.GetTypeValuesRequest = exports.FindAppTypesRequest = exports.GetAppTypeResponse = exports.GetAppTypesResponse = exports.AppTypeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_search_requests_1 = require("../requests/base-search-requests");
const generic_response_1 = require("../responses/generic-response");
const app_value_dto_1 = require("./app-value-dto");
const translation_dto_1 = require("./translation-dto");
class AppTypeDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], AppTypeDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AppTypeDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AppTypeDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => app_value_dto_1.AppValueDto, isArray: true }),
    __metadata("design:type", Array)
], AppTypeDto.prototype, "appValues", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => translation_dto_1.TranslationDto, isArray: true }),
    __metadata("design:type", Array)
], AppTypeDto.prototype, "translations", void 0);
exports.AppTypeDto = AppTypeDto;
class GetAppTypesResponse extends generic_response_1.GenericResponse {
    constructor() {
        super(...arguments);
        this.appTypes = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => AppTypeDto, isArray: true }),
    __metadata("design:type", Array)
], GetAppTypesResponse.prototype, "appTypes", void 0);
exports.GetAppTypesResponse = GetAppTypesResponse;
class GetAppTypeResponse extends generic_response_1.GenericResponse {
    constructor() {
        super(...arguments);
        this.appType = null;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => AppTypeDto }),
    __metadata("design:type", AppTypeDto)
], GetAppTypeResponse.prototype, "appType", void 0);
exports.GetAppTypeResponse = GetAppTypeResponse;
class FindAppTypesRequest extends base_search_requests_1.BaseSearchRequest {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Get with AppTypesCodes',
        required: true,
        type: String,
    }),
    __metadata("design:type", String)
], FindAppTypesRequest.prototype, "appTypesCodes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], FindAppTypesRequest.prototype, "includeTranslations", void 0);
exports.FindAppTypesRequest = FindAppTypesRequest;
class GetTypeValuesRequest extends base_search_requests_1.BaseSearchRequest {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetTypeValuesRequest.prototype, "appTypeCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], GetTypeValuesRequest.prototype, "alsoDisabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], GetTypeValuesRequest.prototype, "includeTranslations", void 0);
exports.GetTypeValuesRequest = GetTypeValuesRequest;
class GetAppTypeRequest {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    __metadata("design:type", String)
], GetAppTypeRequest.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    __metadata("design:type", String)
], GetAppTypeRequest.prototype, "includeDisabled", void 0);
exports.GetAppTypeRequest = GetAppTypeRequest;
//# sourceMappingURL=app-type-dto.js.map