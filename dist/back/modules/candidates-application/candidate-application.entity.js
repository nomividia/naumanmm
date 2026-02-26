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
exports.CandidateApplication = void 0;
const typeorm_1 = require("typeorm");
const address_entity_1 = require("../../entities/address.entity");
const app_file_entity_1 = require("../../entities/app-file.entity");
const app_value_entity_1 = require("../../entities/app-value.entity");
const base_entity_1 = require("../../entities/base-entity");
const anonymous_exchange_entity_1 = require("../anonymous-exchange/anonymous-exchange.entity");
const candidates_application_jobs_entity_1 = require("../candidate-application-jobs/candidates-application-jobs.entity");
const candidate_country_entity_1 = require("../candidates/candidate-country/candidate-country.entity");
const candidate_department_entity_1 = require("../candidates/candidate-department/candidate-department.entity");
const candidate_entity_1 = require("../candidates/candidate.entity");
let CandidateApplication = class CandidateApplication extends base_entity_1.AppBaseEntity {
    toDto() {
        var _a, _b, _c, _d, _e, _f;
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            genderId: this.genderId,
            gender: (_a = this.gender) === null || _a === void 0 ? void 0 : _a.toDto(),
            birthDate: this.birthDate,
            partnerFirstName: this.partnerFirstName,
            partnerLastName: this.partnerLastName,
            partnerGenderId: this.partnerGenderId,
            partnerGender: (_b = this.partnerGender) === null || _b === void 0 ? void 0 : _b.toDto(),
            partnerBirthDate: this.partnerBirthDate,
            professionId: this.professionId,
            profession: (_c = this.profession) === null || _c === void 0 ? void 0 : _c.toDto(),
            relationshipStatusId: this.relationshipStatusId,
            relationshipStatus: (_d = this.relationshipStatus) === null || _d === void 0 ? void 0 : _d.toDto(),
            phone: this.phone,
            email: this.email,
            skills: this.skills,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            applyStatusId: this.applyStatusId,
            applyStatus: (_e = this.applyStatus) === null || _e === void 0 ? void 0 : _e.toDto(),
            inCouple: this.inCouple,
            phoneSecondary: this.phoneSecondary,
            address: !!this.addresses ? (_f = this.addresses) === null || _f === void 0 ? void 0 : _f[0] : undefined,
            spontaneousApplication: this.spontaneousApplication,
            candidateId: this.candidateId,
            photoFile: this.photoFile ? this.photoFile.toDto() : undefined,
            photoFileId: this.photoFileId,
            mainResumeFile: this.mainResumeFile
                ? this.mainResumeFile.toDto()
                : undefined,
            mainResumeFileId: this.mainResumeFileId,
            partnerResumeFile: this.partnerResumeFile
                ? this.partnerResumeFile.toDto()
                : undefined,
            partnerResumeFileId: this.partnerResumeFileId,
            seen: this.seen,
            candidateApplicationJobs: this.candidateApplicationJobs
                ? this.candidateApplicationJobs.map((x) => x.toDto())
                : undefined,
            disabled: this.disabled,
            jobOfferLinkedRef: this.jobOfferLinkedRef,
            linkedToCandidate: !!this.linkedToCandidate,
            candidate: this.candidate ? this.candidate.toDto() : null,
            guidExchange: this.guidExchange,
            anonymousExchanges: this.anonymousExchanges
                ? this.anonymousExchanges.map((x) => x.toDto())
                : undefined,
            newsletterUnsubscribed: this.newsletterUnsubscribed,
            newsletterUnsubscribedGuid: this.newsletterUnsubscribedGuid,
            candidateDepartments: this.candidateDepartments
                ? this.candidateDepartments.map((x) => x.toDto())
                : undefined,
            partnerEmail: this.partnerEmail,
            partnerPhone: this.partnerPhone,
            candidateCountries: this.candidateCountries
                ? this.candidateCountries.map((x) => x.toDto())
                : undefined,
            allowed_to_work_us: this.allowed_to_work_us,
            require_sponsorship_us: this.require_sponsorship_us,
            usTermsAcceptedAt: this.usTermsAcceptedAt,
            usTermsVersion: this.usTermsVersion,
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.linkedToCandidate = !!dto.linkedToCandidate;
        this.firstName = dto.firstName;
        this.lastName = dto.lastName;
        this.genderId = dto.genderId;
        this.birthDate = dto.birthDate;
        this.partnerFirstName = dto.partnerFirstName;
        this.partnerLastName = dto.partnerLastName;
        this.partnerBirthDate = dto.partnerBirthDate;
        this.partnerGenderId = dto.partnerGenderId;
        this.professionId = dto.professionId;
        this.relationshipStatusId = dto.relationshipStatusId;
        this.phone = dto.phone;
        this.email = dto.email;
        this.skills = dto.skills;
        this.applyStatusId = dto.applyStatusId;
        this.inCouple = dto.inCouple;
        this.phoneSecondary = dto.phoneSecondary;
        this.spontaneousApplication = dto.spontaneousApplication;
        this.candidateId = dto.candidateId;
        this.mainResumeFileId = dto.mainResumeFileId;
        this.photoFileId = dto.photoFileId;
        this.partnerResumeFileId = dto.partnerResumeFileId;
        this.seen = dto.seen;
        this.disabled = dto.disabled;
        this.creationDate = dto.creationDate;
        this.jobOfferLinkedRef = dto.jobOfferLinkedRef;
        this.guidExchange = dto.guidExchange;
        this.partnerEmail = dto.partnerEmail;
        this.partnerPhone = dto.partnerPhone;
        this.allowed_to_work_us = dto.allowed_to_work_us;
        this.require_sponsorship_us = dto.require_sponsorship_us;
        this.usTermsAcceptedAt = dto.usTermsAcceptedAt;
        this.usTermsVersion = dto.usTermsVersion;
        if (dto.photoFile) {
            const appFile = new app_file_entity_1.AppFile();
            appFile.fromDto(dto.photoFile);
            this.photoFile = appFile;
        }
        if (dto.mainResumeFile) {
            const appFile = new app_file_entity_1.AppFile();
            appFile.fromDto(dto.mainResumeFile);
            this.mainResumeFile = appFile;
        }
        if (dto.partnerResumeFile) {
            const appFile = new app_file_entity_1.AppFile();
            appFile.fromDto(dto.partnerResumeFile);
            this.partnerResumeFile = appFile;
        }
        if (dto.address) {
            this.addresses = [];
            const address = new address_entity_1.Address();
            address.fromDto(dto.address);
            this.addresses.push(address);
        }
        if (dto.candidateApplicationJobs) {
            this.candidateApplicationJobs = [];
            dto.candidateApplicationJobs.forEach((candidateApplicationJobsDto) => {
                const candidateApplicationJobs = new candidates_application_jobs_entity_1.CandidateApplicationJobs();
                candidateApplicationJobs.fromDto(candidateApplicationJobsDto);
                this.candidateApplicationJobs.push(candidateApplicationJobs);
            });
        }
        if (dto.anonymousExchanges) {
            this.anonymousExchanges = [];
            dto.anonymousExchanges.forEach((anonymousExchangesDto) => {
                const anonymousExchanges = new anonymous_exchange_entity_1.AnonymousExchange();
                anonymousExchanges.fromDto(anonymousExchangesDto);
                this.anonymousExchanges.push(anonymousExchanges);
            });
        }
        if (dto.candidateDepartments) {
            this.candidateDepartments =
                dto.candidateDepartments.map((x) => {
                    const candidateDepartment = new candidate_department_entity_1.CandidateDepartment();
                    candidateDepartment.fromDto(x);
                    return candidateDepartment;
                });
        }
        if (dto.candidateCountries) {
            this.candidateCountries =
                dto.candidateCountries.map((x) => {
                    const candidateCountry = new candidate_country_entity_1.CandidateCountry();
                    candidateCountry.fromDto(x);
                    return candidateCountry;
                });
        }
        if (!this.id) {
            this.id = undefined;
        }
    }
};
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'firstName', nullable: true, length: 60 }),
    __metadata("design:type", String)
], CandidateApplication.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'lastName', nullable: true, length: 60 }),
    __metadata("design:type", String)
], CandidateApplication.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'genderId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], CandidateApplication.prototype, "genderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_value_entity_1.AppValue),
    (0, typeorm_1.JoinColumn)({ name: 'genderId' }),
    __metadata("design:type", app_value_entity_1.AppValue)
], CandidateApplication.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)('date', { name: 'birthDate', nullable: true }),
    __metadata("design:type", Date)
], CandidateApplication.prototype, "birthDate", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'partnerFirstName', nullable: true, length: 30 }),
    __metadata("design:type", String)
], CandidateApplication.prototype, "partnerFirstName", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'partnerLastName', nullable: true, length: 30 }),
    __metadata("design:type", String)
], CandidateApplication.prototype, "partnerLastName", void 0);
__decorate([
    (0, typeorm_1.Column)('date', { name: 'partnerBirthDate', nullable: true }),
    __metadata("design:type", Date)
], CandidateApplication.prototype, "partnerBirthDate", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'partnerGenderId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], CandidateApplication.prototype, "partnerGenderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_value_entity_1.AppValue),
    (0, typeorm_1.JoinColumn)({ name: 'partnerGenderId' }),
    __metadata("design:type", app_value_entity_1.AppValue)
], CandidateApplication.prototype, "partnerGender", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'partnerEmail', nullable: true, length: 255 }),
    __metadata("design:type", String)
], CandidateApplication.prototype, "partnerEmail", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'partnerPhone', nullable: true, length: 255 }),
    __metadata("design:type", String)
], CandidateApplication.prototype, "partnerPhone", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'professionId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], CandidateApplication.prototype, "professionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_value_entity_1.AppValue),
    (0, typeorm_1.JoinColumn)({ name: 'professionId' }),
    __metadata("design:type", app_value_entity_1.AppValue)
], CandidateApplication.prototype, "profession", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => address_entity_1.Address, (address) => address.candidateApplication, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], CandidateApplication.prototype, "addresses", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'phone', nullable: true, length: 30 }),
    __metadata("design:type", String)
], CandidateApplication.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'phoneSecondary', nullable: true, length: 30 }),
    __metadata("design:type", String)
], CandidateApplication.prototype, "phoneSecondary", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'email', length: 255, nullable: true }),
    __metadata("design:type", String)
], CandidateApplication.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'skills', nullable: true }),
    __metadata("design:type", String)
], CandidateApplication.prototype, "skills", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'relationshipStatusId',
        nullable: true,
        length: 36,
    }),
    __metadata("design:type", String)
], CandidateApplication.prototype, "relationshipStatusId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_value_entity_1.AppValue),
    (0, typeorm_1.JoinColumn)({ name: 'relationshipStatusId' }),
    __metadata("design:type", app_value_entity_1.AppValue)
], CandidateApplication.prototype, "relationshipStatus", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'applyStatusId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], CandidateApplication.prototype, "applyStatusId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_value_entity_1.AppValue),
    (0, typeorm_1.JoinColumn)({ name: 'applyStatusId' }),
    __metadata("design:type", app_value_entity_1.AppValue)
], CandidateApplication.prototype, "applyStatus", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'photoFileId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], CandidateApplication.prototype, "photoFileId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_file_entity_1.AppFile, { cascade: true }),
    (0, typeorm_1.JoinColumn)({ name: 'photoFileId' }),
    __metadata("design:type", app_file_entity_1.AppFile)
], CandidateApplication.prototype, "photoFile", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'mainResumeFileId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], CandidateApplication.prototype, "mainResumeFileId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_file_entity_1.AppFile, { cascade: true }),
    (0, typeorm_1.JoinColumn)({ name: 'mainResumeFileId' }),
    __metadata("design:type", app_file_entity_1.AppFile)
], CandidateApplication.prototype, "mainResumeFile", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'partnerResumeFileId',
        nullable: true,
        length: 36,
    }),
    __metadata("design:type", String)
], CandidateApplication.prototype, "partnerResumeFileId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_file_entity_1.AppFile, { cascade: true }),
    (0, typeorm_1.JoinColumn)({ name: 'partnerResumeFileId' }),
    __metadata("design:type", app_file_entity_1.AppFile)
], CandidateApplication.prototype, "partnerResumeFile", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'inCouple', nullable: false, default: 0 }),
    __metadata("design:type", Boolean)
], CandidateApplication.prototype, "inCouple", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', {
        name: 'spontaneousApplication',
        nullable: false,
        default: 0,
    }),
    __metadata("design:type", Boolean)
], CandidateApplication.prototype, "spontaneousApplication", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'candidateId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], CandidateApplication.prototype, "candidateId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => candidate_entity_1.Candidate, (candidate) => candidate.candidateApplications, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'candidateId' }),
    __metadata("design:type", candidate_entity_1.Candidate)
], CandidateApplication.prototype, "candidate", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'seen', nullable: false, default: 0 }),
    __metadata("design:type", Boolean)
], CandidateApplication.prototype, "seen", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => candidates_application_jobs_entity_1.CandidateApplicationJobs, (candidateApplicationJobs) => candidateApplicationJobs.candidateApplication, { cascade: true }),
    __metadata("design:type", Array)
], CandidateApplication.prototype, "candidateApplicationJobs", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'jobOfferLinkedRef', nullable: true }),
    __metadata("design:type", String)
], CandidateApplication.prototype, "jobOfferLinkedRef", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', {
        name: 'linkedToCandidate',
        nullable: false,
        default: false,
    }),
    __metadata("design:type", Boolean)
], CandidateApplication.prototype, "linkedToCandidate", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'guidExchange', nullable: true, unique: true }),
    __metadata("design:type", String)
], CandidateApplication.prototype, "guidExchange", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => anonymous_exchange_entity_1.AnonymousExchange, (exchange) => exchange.candidateApplication, { cascade: true, onUpdate: 'CASCADE' }),
    __metadata("design:type", Array)
], CandidateApplication.prototype, "anonymousExchanges", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', {
        name: 'newsletterUnsubscribed',
        nullable: false,
        default: 0,
    }),
    __metadata("design:type", Boolean)
], CandidateApplication.prototype, "newsletterUnsubscribed", void 0);
__decorate([
    (0, typeorm_1.Generated)('uuid'),
    (0, typeorm_1.Column)('varchar', {
        name: 'newsletterUnsubscribedGuid',
        nullable: true,
        length: 36,
    }),
    __metadata("design:type", String)
], CandidateApplication.prototype, "newsletterUnsubscribedGuid", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => candidate_department_entity_1.CandidateDepartment, (candidateDepartment) => candidateDepartment.candidateApplication, { cascade: true }),
    __metadata("design:type", Array)
], CandidateApplication.prototype, "candidateDepartments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => candidate_country_entity_1.CandidateCountry, (candidateCountries) => candidateCountries.candidateApplication, { cascade: true }),
    __metadata("design:type", Array)
], CandidateApplication.prototype, "candidateCountries", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'allowed_to_work_us', nullable: true }),
    __metadata("design:type", Boolean)
], CandidateApplication.prototype, "allowed_to_work_us", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'require_sponsorship_us', nullable: true }),
    __metadata("design:type", Boolean)
], CandidateApplication.prototype, "require_sponsorship_us", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { name: 'usTermsAcceptedAt', nullable: true }),
    __metadata("design:type", Date)
], CandidateApplication.prototype, "usTermsAcceptedAt", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'usTermsVersion', nullable: true, length: 20 }),
    __metadata("design:type", String)
], CandidateApplication.prototype, "usTermsVersion", void 0);
CandidateApplication = __decorate([
    (0, typeorm_1.Entity)({ name: 'candidate-applications' })
], CandidateApplication);
exports.CandidateApplication = CandidateApplication;
//# sourceMappingURL=candidate-application.entity.js.map