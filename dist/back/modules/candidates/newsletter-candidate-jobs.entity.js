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
exports.NewsLetterCandidateJobs = void 0;
const typeorm_1 = require("typeorm");
const app_value_entity_1 = require("../../entities/app-value.entity");
const base_entity_1 = require("../../entities/base-entity");
const newsletter_entity_1 = require("../newsletter/newsletter.entity");
let NewsLetterCandidateJobs = class NewsLetterCandidateJobs extends base_entity_1.AppBaseEntity {
    toDto() {
        return {
            id: this.id,
            jobTypeId: this.jobTypeId,
            newsLetterId: this.newsLetterId,
            jobType: this.jobType ? this.jobType.toDto() : null,
            newsLetter: this.newsLetter ? this.newsLetter.toDto() : null,
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.jobTypeId = dto.jobTypeId;
        this.newsLetterId = dto.newsLetterId;
        if (!this.id) {
            this.id = undefined;
        }
    }
};
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'jobTypeId', length: 36, nullable: false }),
    __metadata("design:type", String)
], NewsLetterCandidateJobs.prototype, "jobTypeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_value_entity_1.AppValue, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'jobTypeId' }),
    __metadata("design:type", app_value_entity_1.AppValue)
], NewsLetterCandidateJobs.prototype, "jobType", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'newsLetterId', length: 36, nullable: false }),
    __metadata("design:type", String)
], NewsLetterCandidateJobs.prototype, "newsLetterId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => newsletter_entity_1.Newsletter, (newsLetter) => newsLetter.newsLettersCandidateJobs, { onDelete: 'CASCADE', orphanedRowAction: 'delete' }),
    (0, typeorm_1.JoinColumn)({ name: 'newsLetterId' }),
    __metadata("design:type", newsletter_entity_1.Newsletter)
], NewsLetterCandidateJobs.prototype, "newsLetter", void 0);
NewsLetterCandidateJobs = __decorate([
    (0, typeorm_1.Entity)({ name: 'newsletter-candidate-jobs' })
], NewsLetterCandidateJobs);
exports.NewsLetterCandidateJobs = NewsLetterCandidateJobs;
//# sourceMappingURL=newsletter-candidate-jobs.entity.js.map