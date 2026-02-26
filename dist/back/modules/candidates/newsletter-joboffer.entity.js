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
exports.NewsletterJobOffer = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../entities/base-entity");
const job_offer_entity_1 = require("../job-offers/job-offer.entity");
const newsletter_entity_1 = require("../newsletter/newsletter.entity");
let NewsletterJobOffer = class NewsletterJobOffer extends base_entity_1.AppBaseEntity {
    toDto() {
        return {
            id: this.id,
            jobofferId: this.jobOfferId,
            newsletterId: this.newsletterId,
            joboffer: this.jobOffer ? this.jobOffer.toDto() : null,
            newsletter: this.newsletter ? this.newsletter.toDto() : null,
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.newsletterId = dto.newsletterId;
        this.jobOfferId = dto.jobofferId;
        if (!dto.id) {
            this.id = undefined;
        }
    }
};
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'jobOfferId', length: 36, nullable: false }),
    __metadata("design:type", String)
], NewsletterJobOffer.prototype, "jobOfferId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'newsletterId', length: 36, nullable: false }),
    __metadata("design:type", String)
], NewsletterJobOffer.prototype, "newsletterId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => job_offer_entity_1.JobOffer, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'jobOfferId' }),
    __metadata("design:type", job_offer_entity_1.JobOffer)
], NewsletterJobOffer.prototype, "jobOffer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => newsletter_entity_1.Newsletter, (newsletter) => newsletter.newslettersJobOffer, { onDelete: 'CASCADE', orphanedRowAction: 'delete' }),
    (0, typeorm_1.JoinColumn)({ name: 'newsletterId' }),
    __metadata("design:type", newsletter_entity_1.Newsletter)
], NewsletterJobOffer.prototype, "newsletter", void 0);
NewsletterJobOffer = __decorate([
    (0, typeorm_1.Entity)({ name: 'newsletter-joboffer' })
], NewsletterJobOffer);
exports.NewsletterJobOffer = NewsletterJobOffer;
//# sourceMappingURL=newsletter-joboffer.entity.js.map