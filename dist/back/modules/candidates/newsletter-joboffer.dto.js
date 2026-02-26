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
exports.NewsletterJobOfferDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const job_offer_dto_1 = require("../job-offers/job-offer-dto");
const newsletter_dto_1 = require("../newsletter/newsletter.dto");
class NewsletterJobOfferDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], NewsletterJobOfferDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], NewsletterJobOfferDto.prototype, "newsletterId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], NewsletterJobOfferDto.prototype, "jobofferId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => newsletter_dto_1.NewsletterDto }),
    __metadata("design:type", newsletter_dto_1.NewsletterDto)
], NewsletterJobOfferDto.prototype, "newsletter", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => job_offer_dto_1.JobOfferDto }),
    __metadata("design:type", job_offer_dto_1.JobOfferDto)
], NewsletterJobOfferDto.prototype, "joboffer", void 0);
exports.NewsletterJobOfferDto = NewsletterJobOfferDto;
//# sourceMappingURL=newsletter-joboffer.dto.js.map