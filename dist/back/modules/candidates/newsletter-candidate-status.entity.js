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
exports.NewsLetterCandidateStatus = void 0;
const typeorm_1 = require("typeorm");
const app_value_entity_1 = require("../../entities/app-value.entity");
const base_entity_1 = require("../../entities/base-entity");
const newsletter_entity_1 = require("../newsletter/newsletter.entity");
let NewsLetterCandidateStatus = class NewsLetterCandidateStatus extends base_entity_1.AppBaseEntity {
    toDto() {
        return {
            id: this.id,
            candidateStatusId: this.candidateStatusId,
            newsletterId: this.newsletterId,
            candidateStatus: this.candidateStatus
                ? this.candidateStatus.toDto()
                : null,
            newsLetter: this.newsLetter ? this.newsLetter.toDto() : null,
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.candidateStatusId = dto.candidateStatusId;
        this.newsletterId = this.newsletterId;
        if (!this.id) {
            this.id = undefined;
        }
    }
};
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'candidateStatusId',
        length: 36,
        nullable: false,
    }),
    __metadata("design:type", String)
], NewsLetterCandidateStatus.prototype, "candidateStatusId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_value_entity_1.AppValue, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'candidateStatusId' }),
    __metadata("design:type", app_value_entity_1.AppValue)
], NewsLetterCandidateStatus.prototype, "candidateStatus", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'newsletterId', length: 36, nullable: false }),
    __metadata("design:type", String)
], NewsLetterCandidateStatus.prototype, "newsletterId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => newsletter_entity_1.Newsletter, (newsLetter) => newsLetter.newsLettersCandidateStatus, { onDelete: 'CASCADE', orphanedRowAction: 'delete' }),
    (0, typeorm_1.JoinColumn)({ name: 'newsletterId' }),
    __metadata("design:type", newsletter_entity_1.Newsletter)
], NewsLetterCandidateStatus.prototype, "newsLetter", void 0);
NewsLetterCandidateStatus = __decorate([
    (0, typeorm_1.Entity)({ name: 'newsletter-candidate-status' })
], NewsLetterCandidateStatus);
exports.NewsLetterCandidateStatus = NewsLetterCandidateStatus;
//# sourceMappingURL=newsletter-candidate-status.entity.js.map