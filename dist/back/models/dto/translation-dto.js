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
exports.TranslationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const app_type_dto_1 = require("./app-type-dto");
const app_value_dto_1 = require("./app-value-dto");
const language_dto_1 = require("./language-dto");
const user_dto_1 = require("./user-dto");
class TranslationDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TranslationDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TranslationDto.prototype, "entityField", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TranslationDto.prototype, "languageId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", language_dto_1.LanguageDto)
], TranslationDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TranslationDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TranslationDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => user_dto_1.UserDto }),
    __metadata("design:type", user_dto_1.UserDto)
], TranslationDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TranslationDto.prototype, "appValueId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => app_value_dto_1.AppValueDto }),
    __metadata("design:type", app_value_dto_1.AppValueDto)
], TranslationDto.prototype, "appValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], TranslationDto.prototype, "appTypeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => app_type_dto_1.AppTypeDto }),
    __metadata("design:type", app_type_dto_1.AppTypeDto)
], TranslationDto.prototype, "appType", void 0);
exports.TranslationDto = TranslationDto;
//# sourceMappingURL=translation-dto.js.map