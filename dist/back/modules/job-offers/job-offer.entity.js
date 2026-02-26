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
exports.JobOffer = void 0;
const typeorm_1 = require("typeorm");
const app_value_entity_1 = require("../../entities/app-value.entity");
const base_entity_1 = require("../../entities/base-entity");
const user_entity_1 = require("../../entities/user.entity");
const candidates_application_jobs_entity_1 = require("../candidate-application-jobs/candidates-application-jobs.entity");
const customer_entity_1 = require("../customer/customer.entity");
let JobOffer = class JobOffer extends base_entity_1.AppBaseEntity {
    toDto() {
        var _a, _b, _c, _d;
        return {
            id: this.id,
            title: this.title,
            jobDescription: this.jobDescription,
            ref: this.ref,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            city: this.city,
            country: this.country,
            countryCode: this.countryCode,
            consultantId: this.consultantId,
            consultant: (_a = this.consultant) === null || _a === void 0 ? void 0 : _a.toDto(),
            salary: this.salary,
            publicLink: this.publicLink,
            jobId: this.jobId,
            job: (_b = this.job) === null || _b === void 0 ? void 0 : _b.toDto(),
            taskResponsabilitiesDescription: this.taskResponsabilitiesDescription,
            candidateProfileDescription: this.candidateProfileDescription,
            conditionsDescription: this.conditionsDescription,
            applyInCouple: this.applyInCouple,
            contractTypeId: this.contractTypeId,
            contractType: (_c = this.contractType) === null || _c === void 0 ? void 0 : _c.toDto(),
            candidateApplicationJobs: this.candidateApplicationJobs
                ? this.candidateApplicationJobs.map((x) => x.toDto())
                : [],
            disabled: this.disabled,
            customerId: this.customerId,
            customer: (_d = this.customer) === null || _d === void 0 ? void 0 : _d.toDto(),
            stateId: this.stateId,
            state: this.state ? this.state.toDto() : undefined,
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.title = dto.title;
        this.jobDescription = dto.jobDescription;
        this.ref = dto.ref;
        this.city = dto.city;
        this.country = dto.country;
        this.countryCode = dto.countryCode;
        this.consultantId = dto.consultantId;
        this.salary = dto.salary;
        this.publicLink = dto.publicLink;
        this.jobId = dto.jobId;
        this.taskResponsabilitiesDescription =
            dto.taskResponsabilitiesDescription;
        this.candidateProfileDescription = dto.candidateProfileDescription;
        this.conditionsDescription = dto.conditionsDescription;
        this.applyInCouple = dto.applyInCouple;
        this.contractTypeId = dto.contractTypeId;
        this.disabled = dto.disabled;
        this.customerId = dto.customerId;
        this.stateId = dto.stateId;
        if (!this.id) {
            this.id = undefined;
        }
    }
};
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'title', nullable: false }),
    __metadata("design:type", String)
], JobOffer.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'ref',
        unique: true,
        nullable: false,
        length: 50,
    }),
    __metadata("design:type", String)
], JobOffer.prototype, "ref", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'jobDescription', nullable: false }),
    __metadata("design:type", String)
], JobOffer.prototype, "jobDescription", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'city', nullable: true }),
    __metadata("design:type", String)
], JobOffer.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'country', nullable: true }),
    __metadata("design:type", String)
], JobOffer.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'countryCode', nullable: true }),
    __metadata("design:type", String)
], JobOffer.prototype, "countryCode", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'consultantId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], JobOffer.prototype, "consultantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { cascade: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'consultantId' }),
    __metadata("design:type", user_entity_1.User)
], JobOffer.prototype, "consultant", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'salary', nullable: true }),
    __metadata("design:type", String)
], JobOffer.prototype, "salary", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'publicLink', nullable: true }),
    __metadata("design:type", String)
], JobOffer.prototype, "publicLink", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'jobId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], JobOffer.prototype, "jobId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_value_entity_1.AppValue),
    (0, typeorm_1.JoinColumn)({ name: 'jobId' }),
    __metadata("design:type", app_value_entity_1.AppValue)
], JobOffer.prototype, "job", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'taskResponsabilitiesDescription', nullable: true }),
    __metadata("design:type", String)
], JobOffer.prototype, "taskResponsabilitiesDescription", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'candidateProfileDescription', nullable: true }),
    __metadata("design:type", String)
], JobOffer.prototype, "candidateProfileDescription", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'conditionsDescription', nullable: true }),
    __metadata("design:type", String)
], JobOffer.prototype, "conditionsDescription", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'applyInCouple', nullable: true, default: 0 }),
    __metadata("design:type", Boolean)
], JobOffer.prototype, "applyInCouple", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'contractTypeId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], JobOffer.prototype, "contractTypeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_value_entity_1.AppValue),
    (0, typeorm_1.JoinColumn)({ name: 'contractTypeId' }),
    __metadata("design:type", app_value_entity_1.AppValue)
], JobOffer.prototype, "contractType", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => candidates_application_jobs_entity_1.CandidateApplicationJobs, (candidateApplicationJobs) => candidateApplicationJobs.jobOffer),
    __metadata("design:type", Array)
], JobOffer.prototype, "candidateApplicationJobs", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'customerId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], JobOffer.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, { cascade: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'customerId' }),
    __metadata("design:type", customer_entity_1.Customer)
], JobOffer.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'stateId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], JobOffer.prototype, "stateId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_value_entity_1.AppValue),
    (0, typeorm_1.JoinColumn)({ name: 'stateId' }),
    __metadata("design:type", app_value_entity_1.AppValue)
], JobOffer.prototype, "state", void 0);
JobOffer = __decorate([
    (0, typeorm_1.Entity)({ name: 'job-offers' })
], JobOffer);
exports.JobOffer = JobOffer;
//# sourceMappingURL=job-offer.entity.js.map