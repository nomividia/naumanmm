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
exports.Newsletter = void 0;
const typeorm_1 = require("typeorm");
const shared_constants_1 = require("../../../shared/shared-constants");
const app_value_entity_1 = require("../../entities/app-value.entity");
const base_entity_1 = require("../../entities/base-entity");
const candidate_department_entity_1 = require("../candidates/candidate-department/candidate-department.entity");
const newsletter_candidate_jobs_entity_1 = require("../candidates/newsletter-candidate-jobs.entity");
const newsletter_candidate_status_entity_1 = require("../candidates/newsletter-candidate-status.entity");
const newsletter_joboffer_entity_1 = require("../candidates/newsletter-joboffer.entity");
let Newsletter = class Newsletter extends base_entity_1.AppBaseEntity {
    toDto() {
        var _a, _b, _c, _d;
        return {
            id: this.id,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            disabled: this.disabled,
            title: this.title,
            content: this.content,
            newsletterStatusId: this.newsletterStatusId,
            newsletterStatus: (_a = this.newsletterStatus) === null || _a === void 0 ? void 0 : _a.toDto(),
            subject: this.subject,
            sendDate: this.sendDate,
            candidatesCount: this.candidatesCount,
            candidateApplicationsCount: this.candidateApplicationsCount,
            newsLettersCandidateStatus: (_b = this.newsLettersCandidateStatus) === null || _b === void 0 ? void 0 : _b.map((x) => x.toDto()),
            newsLettersJob: (_c = this.newsLettersCandidateJobs) === null || _c === void 0 ? void 0 : _c.map((x) => x.toDto()),
            newslettersJobOffer: (_d = this.newslettersJobOffer) === null || _d === void 0 ? void 0 : _d.map((x) => x.toDto()),
            language: this.language,
            sender: this.sender,
            newsletterSibId: this.newsletterSibId,
            type: this.type,
            newsletterListSibId: this.newsletterListSibId,
            clickedCount: this.clickedCount,
            unsubscriptionsCount: this.unsubscriptionsCount,
            sentCount: this.sentCount,
            openedCount: this.openedCount,
            deliveredCount: this.deliveredCount,
            answeredCount: this.answeredCount,
            includeCandidateApplications: this.includeCandidateApplications,
            cityFilter: this.cityFilter,
            countriesFilter: this.countriesFilter,
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.creationDate = dto.creationDate;
        this.modifDate = dto.modifDate;
        this.disabled = dto.disabled;
        this.title = dto.title;
        this.content = dto.content;
        this.newsletterStatusId = dto.newsletterStatusId;
        this.subject = dto.subject;
        this.sendDate = dto.sendDate;
        this.candidatesCount = dto.candidatesCount;
        this.candidateApplicationsCount = dto.candidateApplicationsCount;
        this.language = dto.language;
        this.sender = dto.sender;
        this.newsletterSibId = dto.newsletterSibId;
        this.type = dto.type;
        this.newsletterListSibId = dto.newsletterListSibId;
        this.includeCandidateApplications = dto.includeCandidateApplications;
        this.cityFilter = dto.cityFilter;
        this.countriesFilter = dto.countriesFilter;
        if (dto.newsLettersCandidateStatus) {
            this.newsLettersCandidateStatus =
                dto.newsLettersCandidateStatus.map((x) => {
                    const newsLettersCandidateStatus = new newsletter_candidate_status_entity_1.NewsLetterCandidateStatus();
                    newsLettersCandidateStatus.fromDto(x);
                    return newsLettersCandidateStatus;
                });
        }
        if (dto.newsLettersJob) {
            this.newsLettersCandidateJobs =
                dto.newsLettersJob.map((x) => {
                    const newsLettersCandidateJobs = new newsletter_candidate_jobs_entity_1.NewsLetterCandidateJobs();
                    newsLettersCandidateJobs.fromDto(x);
                    return newsLettersCandidateJobs;
                });
        }
        if (dto.newslettersJobOffer) {
            this.newslettersJobOffer =
                dto.newslettersJobOffer.map((x) => {
                    const newsletterJobOffer = new newsletter_joboffer_entity_1.NewsletterJobOffer();
                    newsletterJobOffer.fromDto(x);
                    return newsletterJobOffer;
                });
        }
        if (!dto.id) {
            this.id = undefined;
        }
    }
};
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'title', nullable: true, length: 100 }),
    __metadata("design:type", String)
], Newsletter.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('longtext', { name: 'content', nullable: true }),
    __metadata("design:type", String)
], Newsletter.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'subject', nullable: true, length: 190 }),
    __metadata("design:type", String)
], Newsletter.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'sender', nullable: true, length: 200 }),
    __metadata("design:type", String)
], Newsletter.prototype, "sender", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'newsletterStatusId',
        nullable: true,
        length: 50,
    }),
    __metadata("design:type", String)
], Newsletter.prototype, "newsletterStatusId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_value_entity_1.AppValue),
    (0, typeorm_1.JoinColumn)({ name: 'newsletterStatusId' }),
    __metadata("design:type", app_value_entity_1.AppValue)
], Newsletter.prototype, "newsletterStatus", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { name: 'sendDate', nullable: true }),
    __metadata("design:type", Date)
], Newsletter.prototype, "sendDate", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'candidatesCount', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Newsletter.prototype, "candidatesCount", void 0);
__decorate([
    (0, typeorm_1.Column)('int', {
        name: 'candidateApplicationsCount',
        nullable: true,
        default: 0,
    }),
    __metadata("design:type", Number)
], Newsletter.prototype, "candidateApplicationsCount", void 0);
__decorate([
    (0, typeorm_1.Column)('enum', {
        name: 'language',
        default: shared_constants_1.NewsletterLanguage.EN,
        enum: shared_constants_1.NewsletterLanguage,
    }),
    __metadata("design:type", String)
], Newsletter.prototype, "language", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => newsletter_candidate_status_entity_1.NewsLetterCandidateStatus, (newsLetterCandidateStatus) => newsLetterCandidateStatus.newsLetter, { cascade: true }),
    __metadata("design:type", Array)
], Newsletter.prototype, "newsLettersCandidateStatus", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => newsletter_candidate_jobs_entity_1.NewsLetterCandidateJobs, (newsLetterCandidateJobs) => newsLetterCandidateJobs.newsLetter, { cascade: true }),
    __metadata("design:type", Array)
], Newsletter.prototype, "newsLettersCandidateJobs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => newsletter_joboffer_entity_1.NewsletterJobOffer, (newslettersJobOffer) => newslettersJobOffer.newsletter, { cascade: true }),
    __metadata("design:type", Array)
], Newsletter.prototype, "newslettersJobOffer", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'newsletterSibId', nullable: true, length: 60 }),
    __metadata("design:type", String)
], Newsletter.prototype, "newsletterSibId", void 0);
__decorate([
    (0, typeorm_1.Column)('enum', {
        name: 'type',
        nullable: false,
        enum: shared_constants_1.NewsletterType,
        default: shared_constants_1.NewsletterType.Email,
    }),
    __metadata("design:type", String)
], Newsletter.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'newsletterListSibId',
        nullable: true,
        length: 60,
    }),
    __metadata("design:type", String)
], Newsletter.prototype, "newsletterListSibId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'sentCount', nullable: true }),
    __metadata("design:type", Number)
], Newsletter.prototype, "sentCount", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'deliveredCount', nullable: true }),
    __metadata("design:type", Number)
], Newsletter.prototype, "deliveredCount", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'answeredCount', nullable: true }),
    __metadata("design:type", Number)
], Newsletter.prototype, "answeredCount", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'unsubscriptionsCount', nullable: true }),
    __metadata("design:type", Number)
], Newsletter.prototype, "unsubscriptionsCount", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'openedCount', nullable: true }),
    __metadata("design:type", Number)
], Newsletter.prototype, "openedCount", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'clickedCount', nullable: true }),
    __metadata("design:type", Number)
], Newsletter.prototype, "clickedCount", void 0);
__decorate([
    (0, typeorm_1.Column)('longtext', { name: 'htmlFullContent', nullable: true }),
    __metadata("design:type", String)
], Newsletter.prototype, "htmlFullContent", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', {
        name: 'includeCandidateApplication',
        nullable: true,
        default: 0,
    }),
    __metadata("design:type", Boolean)
], Newsletter.prototype, "includeCandidateApplications", void 0);
__decorate([
    (0, typeorm_1.Column)('json', {
        name: 'cityFilter',
        nullable: true,
    }),
    __metadata("design:type", Array)
], Newsletter.prototype, "cityFilter", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'countriesFilter',
        nullable: true,
        length: 255,
    }),
    __metadata("design:type", String)
], Newsletter.prototype, "countriesFilter", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => candidate_department_entity_1.CandidateDepartment, (candidateDepartment) => candidateDepartment.newsletter, { cascade: true }),
    __metadata("design:type", Array)
], Newsletter.prototype, "candidateDepartments", void 0);
Newsletter = __decorate([
    (0, typeorm_1.Entity)({ name: 'newsletter' })
], Newsletter);
exports.Newsletter = Newsletter;
//# sourceMappingURL=newsletter.entity.js.map