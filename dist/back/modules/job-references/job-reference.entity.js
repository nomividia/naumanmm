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
exports.JobReference = void 0;
const typeorm_1 = require("typeorm");
const address_entity_1 = require("../../entities/address.entity");
const app_value_entity_1 = require("../../entities/app-value.entity");
const base_entity_1 = require("../../entities/base-entity");
const candidate_jobs_entity_1 = require("../candidates/candidate-jobs.entity");
let JobReference = class JobReference extends base_entity_1.AppBaseEntity {
    toDto() {
        return {
            id: this.id,
            email: this.email,
            phone: this.phone,
            addresses: this.addresses
                ? this.addresses.map((x) => x.toDto())
                : undefined,
            jobRefFunctionId: this.jobRefFunctionId,
            jobRefFunction: this.jobRefFunction
                ? this.jobRefFunction.toDto()
                : undefined,
            otherFunction: this.otherFunction,
            candidateAcceptContact: this.candidateAcceptContact,
            isCompany: this.isCompany,
            isPrivatePerson: this.isPrivatePerson,
            companyName: this.companyName,
            privatePersonFirstName: this.privatePersonFirstName,
            privatePersonLastName: this.privatePersonLastName,
            note: this.note,
            disabled: this.disabled,
            customerHasBeenCreated: this.customerHasBeenCreated,
            contactFullName: this.contactFullName,
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.email = dto.email;
        this.phone = dto.phone;
        this.jobRefFunctionId = dto.jobRefFunctionId;
        this.otherFunction = dto.otherFunction;
        this.candidateAcceptContact = dto.candidateAcceptContact;
        this.isCompany = dto.isCompany;
        this.isPrivatePerson = dto.isPrivatePerson;
        this.privatePersonFirstName = dto.privatePersonFirstName;
        this.privatePersonLastName = dto.privatePersonLastName;
        this.companyName = dto.companyName;
        this.note = dto.note;
        this.disabled = dto.disabled;
        this.customerHasBeenCreated = dto.customerHasBeenCreated;
        this.contactFullName = dto.contactFullName;
        if (dto.addresses) {
            this.addresses = [];
            for (const address of dto.addresses) {
                const addrEntity = new address_entity_1.Address();
                addrEntity.fromDto(address);
                this.addresses.push(addrEntity);
            }
        }
        if (!this.id) {
            this.id = undefined;
        }
    }
};
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'email', length: 80, nullable: true }),
    __metadata("design:type", String)
], JobReference.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'phone', length: 50, nullable: true }),
    __metadata("design:type", String)
], JobReference.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => address_entity_1.Address, (address) => address.jobReference, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], JobReference.prototype, "addresses", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'jobRefFunctionId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], JobReference.prototype, "jobRefFunctionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_value_entity_1.AppValue),
    (0, typeorm_1.JoinColumn)({ name: 'jobRefFunctionId' }),
    __metadata("design:type", app_value_entity_1.AppValue)
], JobReference.prototype, "jobRefFunction", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'otherFunction', length: 50, nullable: true }),
    __metadata("design:type", String)
], JobReference.prototype, "otherFunction", void 0);
__decorate([
    (0, typeorm_1.Column)('bool', { name: 'candidateAcceptContact', default: false }),
    __metadata("design:type", Boolean)
], JobReference.prototype, "candidateAcceptContact", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => candidate_jobs_entity_1.CandidateJob, (candidateJobs) => candidateJobs.jobReference),
    __metadata("design:type", Array)
], JobReference.prototype, "candidateJobs", void 0);
__decorate([
    (0, typeorm_1.Column)('bool', {
        name: 'isPrivatePerson',
        nullable: false,
        default: false,
    }),
    __metadata("design:type", Boolean)
], JobReference.prototype, "isPrivatePerson", void 0);
__decorate([
    (0, typeorm_1.Column)('bool', { name: 'isCompany', nullable: false, default: true }),
    __metadata("design:type", Boolean)
], JobReference.prototype, "isCompany", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'privatePersonFirstName',
        length: 50,
        nullable: true,
    }),
    __metadata("design:type", String)
], JobReference.prototype, "privatePersonFirstName", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'privatePersonLastName',
        length: 50,
        nullable: true,
    }),
    __metadata("design:type", String)
], JobReference.prototype, "privatePersonLastName", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'companyName', length: 200, nullable: true }),
    __metadata("design:type", String)
], JobReference.prototype, "companyName", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'note', nullable: true }),
    __metadata("design:type", String)
], JobReference.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)('bool', {
        name: 'customerHasBeenCreated',
        nullable: false,
        default: false,
    }),
    __metadata("design:type", Boolean)
], JobReference.prototype, "customerHasBeenCreated", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'contactFullName', length: 50, nullable: true }),
    __metadata("design:type", String)
], JobReference.prototype, "contactFullName", void 0);
JobReference = __decorate([
    (0, typeorm_1.Entity)({ name: 'job-references' })
], JobReference);
exports.JobReference = JobReference;
//# sourceMappingURL=job-reference.entity.js.map