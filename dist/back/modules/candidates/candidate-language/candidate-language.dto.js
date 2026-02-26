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
exports.CandidateLanguageDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const app_value_dto_1 = require("../../../models/dto/app-value-dto");
const candidate_dto_1 = require("../candidate-dto");
class CandidateLanguageDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateLanguageDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateLanguageDto.prototype, "languageCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => candidate_dto_1.CandidateDto }),
    __metadata("design:type", candidate_dto_1.CandidateDto)
], CandidateLanguageDto.prototype, "candidate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => app_value_dto_1.AppValueDto }),
    __metadata("design:type", app_value_dto_1.AppValueDto)
], CandidateLanguageDto.prototype, "levelLanguage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateLanguageDto.prototype, "candidateId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateLanguageDto.prototype, "levelLanguageId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateLanguageDto.prototype, "languageString", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], CandidateLanguageDto.prototype, "isPartnerLanguage", void 0);
exports.CandidateLanguageDto = CandidateLanguageDto;
//# sourceMappingURL=candidate-language.dto.js.map