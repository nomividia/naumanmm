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
exports.MultipleAppValuesRequest = exports.GetAppValueResponse = exports.GetAppValuesResponse = exports.AppValueDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const generic_response_1 = require("../responses/generic-response");
const app_type_dto_1 = require("./app-type-dto");
const translation_dto_1 = require("./translation-dto");
class AppValueDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], AppValueDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AppValueDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], AppValueDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AppValueDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => app_type_dto_1.AppTypeDto }),
    __metadata("design:type", app_type_dto_1.AppTypeDto)
], AppValueDto.prototype, "appType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AppValueDto.prototype, "appTypeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], AppValueDto.prototype, "enabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => translation_dto_1.TranslationDto, isArray: true }),
    __metadata("design:type", Array)
], AppValueDto.prototype, "translations", void 0);
exports.AppValueDto = AppValueDto;
class GetAppValuesResponse extends generic_response_1.GenericResponse {
    constructor() {
        super(...arguments);
        this.appValues = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => AppValueDto, isArray: true }),
    __metadata("design:type", Array)
], GetAppValuesResponse.prototype, "appValues", void 0);
exports.GetAppValuesResponse = GetAppValuesResponse;
class GetAppValueResponse extends generic_response_1.GenericResponse {
    constructor() {
        super(...arguments);
        this.appValue = null;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => AppValueDto }),
    __metadata("design:type", AppValueDto)
], GetAppValueResponse.prototype, "appValue", void 0);
exports.GetAppValueResponse = GetAppValueResponse;
class MultipleAppValuesRequest {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, isArray: true }),
    __metadata("design:type", Array)
], MultipleAppValuesRequest.prototype, "ids", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, isArray: true }),
    __metadata("design:type", Array)
], MultipleAppValuesRequest.prototype, "codes", void 0);
exports.MultipleAppValuesRequest = MultipleAppValuesRequest;
//# sourceMappingURL=app-value-dto.js.map