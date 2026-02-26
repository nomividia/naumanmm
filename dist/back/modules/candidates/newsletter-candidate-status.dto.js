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
exports.NewsLetterCandidateStatusDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const app_value_dto_1 = require("../../models/dto/app-value-dto");
const newsletter_dto_1 = require("../newsletter/newsletter.dto");
class NewsLetterCandidateStatusDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], NewsLetterCandidateStatusDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], NewsLetterCandidateStatusDto.prototype, "candidateStatusId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], NewsLetterCandidateStatusDto.prototype, "newsletterId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => app_value_dto_1.AppValueDto }),
    __metadata("design:type", app_value_dto_1.AppValueDto)
], NewsLetterCandidateStatusDto.prototype, "candidateStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => newsletter_dto_1.NewsletterDto }),
    __metadata("design:type", newsletter_dto_1.NewsletterDto)
], NewsLetterCandidateStatusDto.prototype, "newsLetter", void 0);
exports.NewsLetterCandidateStatusDto = NewsLetterCandidateStatusDto;
//# sourceMappingURL=newsletter-candidate-status.dto.js.map