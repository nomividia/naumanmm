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
exports.Address = void 0;
const typeorm_1 = require("typeorm");
const candidate_application_entity_1 = require("../modules/candidates-application/candidate-application.entity");
const candidate_entity_1 = require("../modules/candidates/candidate.entity");
const customer_entity_1 = require("../modules/customer/customer.entity");
const job_reference_entity_1 = require("../modules/job-references/job-reference.entity");
const base_entity_1 = require("./base-entity");
let Address = class Address extends base_entity_1.AppBaseEntity {
    toDto() {
        return {
            id: this.id,
            lineOne: this.lineOne,
            lineTwo: this.lineTwo,
            postalCode: this.postalCode,
            department: this.department,
            city: this.city,
            country: this.country,
            candidateId: this.candidateId,
            customerId: this.customerId,
            label: this.label,
            candidateApplicationId: this.candidateApplicationId,
            jobReferenceId: this.jobReferenceId,
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.lineOne = dto.lineOne;
        this.lineTwo = dto.lineTwo;
        this.department = dto.department;
        this.postalCode = dto.postalCode;
        this.city = dto.city;
        this.country = dto.country;
        this.candidateId = dto.candidateId;
        this.label = dto.label;
        this.customerId = dto.customerId;
        this.candidateApplicationId = dto.candidateApplicationId;
        this.jobReferenceId = dto.jobReferenceId;
        if (!dto.id)
            this.id = undefined;
    }
};
__decorate([
    (0, typeorm_1.Column)('text', { name: 'line1', nullable: true }),
    __metadata("design:type", String)
], Address.prototype, "lineOne", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'label', nullable: true }),
    __metadata("design:type", String)
], Address.prototype, "label", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'line2', nullable: true }),
    __metadata("design:type", String)
], Address.prototype, "lineTwo", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'department', nullable: true, length: 50 }),
    __metadata("design:type", String)
], Address.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'postalCode', nullable: true, length: 10 }),
    __metadata("design:type", String)
], Address.prototype, "postalCode", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'country', nullable: true, length: 100 }),
    __metadata("design:type", String)
], Address.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'city', nullable: true, length: 100 }),
    __metadata("design:type", String)
], Address.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'candidateId', nullable: true }),
    __metadata("design:type", String)
], Address.prototype, "candidateId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'customerId', nullable: true }),
    __metadata("design:type", String)
], Address.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => candidate_entity_1.Candidate, (candidate) => candidate.addresses, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'candidateId' }),
    __metadata("design:type", candidate_entity_1.Candidate)
], Address.prototype, "candidate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, (customer) => customer.addresses, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'customerId' }),
    __metadata("design:type", customer_entity_1.Customer)
], Address.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'candidateApplicationId', nullable: true }),
    __metadata("design:type", String)
], Address.prototype, "candidateApplicationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => candidate_application_entity_1.CandidateApplication, (candidateApplication) => candidateApplication.addresses, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'candidateApplicationId' }),
    __metadata("design:type", candidate_application_entity_1.CandidateApplication)
], Address.prototype, "candidateApplication", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'jobReferenceId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], Address.prototype, "jobReferenceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => job_reference_entity_1.JobReference, (jobReference) => jobReference.addresses, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'jobReferenceId' }),
    __metadata("design:type", job_reference_entity_1.JobReference)
], Address.prototype, "jobReference", void 0);
Address = __decorate([
    (0, typeorm_1.Entity)('address')
], Address);
exports.Address = Address;
//# sourceMappingURL=address.entity.js.map