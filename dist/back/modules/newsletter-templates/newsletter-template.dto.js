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
exports.GetNewsletterTemplatesRequest = exports.GetNewsletterTemplatesResponse = exports.GetNewsletterTemplateResponse = exports.NewsletterTemplateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_dto_1 = require("../../models/dto/base.dto");
const base_search_requests_1 = require("../../models/requests/base-search-requests");
const base_search_responses_1 = require("../../models/responses/base-search-responses");
const generic_response_1 = require("../../models/responses/generic-response");
class NewsletterTemplateDto extends base_dto_1.BaseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NewsletterTemplateDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NewsletterTemplateDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], NewsletterTemplateDto.prototype, "subject", void 0);
exports.NewsletterTemplateDto = NewsletterTemplateDto;
class GetNewsletterTemplateResponse extends generic_response_1.GenericResponse {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => NewsletterTemplateDto }),
    __metadata("design:type", NewsletterTemplateDto)
], GetNewsletterTemplateResponse.prototype, "newsletterTemplate", void 0);
exports.GetNewsletterTemplateResponse = GetNewsletterTemplateResponse;
class GetNewsletterTemplatesResponse extends base_search_responses_1.BaseSearchResponse {
    constructor() {
        super(...arguments);
        this.newsletterTemplates = [];
    }
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => NewsletterTemplateDto, isArray: true }),
    __metadata("design:type", Array)
], GetNewsletterTemplatesResponse.prototype, "newsletterTemplates", void 0);
exports.GetNewsletterTemplatesResponse = GetNewsletterTemplatesResponse;
class GetNewsletterTemplatesRequest extends base_search_requests_1.BaseSearchRequest {
}
exports.GetNewsletterTemplatesRequest = GetNewsletterTemplatesRequest;
//# sourceMappingURL=newsletter-template.dto.js.map