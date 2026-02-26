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
exports.Candidate = void 0;
const typeorm_1 = require("typeorm");
const shared_constants_1 = require("../../../shared/shared-constants");
const address_entity_1 = require("../../entities/address.entity");
const app_language_entity_1 = require("../../entities/app-language.entity");
const app_value_entity_1 = require("../../entities/app-value.entity");
const base_entity_1 = require("../../entities/base-entity");
const candidate_presentation_entity_1 = require("../../entities/candidate-presentation.entity");
const note_item_entity_1 = require("../../entities/note-item.entity");
const user_entity_1 = require("../../entities/user.entity");
const candidate_application_entity_1 = require("../candidates-application/candidate-application.entity");
const interview_entity_1 = require("../interviews/interview.entity");
const job_offer_entity_1 = require("../job-offers/job-offer.entity");
const candidate_children_entity_1 = require("./candidate-children/candidate-children.entity");
const candidate_contract_entity_1 = require("./candidate-contract.entity");
const candidate_country_entity_1 = require("./candidate-country/candidate-country.entity");
const candidate_current_jobs_entity_1 = require("./candidate-current-jobs/candidate-current-jobs.entity");
const candidate_department_entity_1 = require("./candidate-department/candidate-department.entity");
const candidate_file_entity_1 = require("./candidate-file.entity");
const candidate_jobs_entity_1 = require("./candidate-jobs.entity");
const candidate_language_entity_1 = require("./candidate-language/candidate-language.entity");
const candidate_licences_entity_1 = require("./candidate-licences/candidate-licences.entity");
const candidate_pet_entity_1 = require("./candidate-pets/candidate-pet.entity");
const candidate_readonly_property_entity_1 = require("./candidate-readonly/candidate-readonly-property.entity");
let Candidate = class Candidate extends base_entity_1.AppBaseEntity {
    constructor() {
        super(...arguments);
        this.capitalize = (value) => {
            if (!value) {
                return value;
            }
            value = value.toLowerCase();
            return value.charAt(0).toUpperCase() + value.slice(1);
        };
    }
    toDto() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        return {
            id: this.id,
            firstName: (_a = this.capitalize(this.firstName)) !== null && _a !== void 0 ? _a : this.firstName,
            lastName: (_c = (_b = this.lastName) === null || _b === void 0 ? void 0 : _b.toUpperCase()) !== null && _c !== void 0 ? _c : this.lastName,
            nickName: (_e = (_d = this.nickName) === null || _d === void 0 ? void 0 : _d.toUpperCase()) !== null && _e !== void 0 ? _e : this.nickName,
            genderId: this.genderId,
            gender: (_f = this.gender) === null || _f === void 0 ? void 0 : _f.toDto(),
            birthDate: this.birthDate,
            addresses: this.addresses
                ? this.addresses.map((x) => x.toDto())
                : undefined,
            phone: this.phone,
            phoneSecondary: this.phoneSecondary,
            email: this.email,
            additionalEmails: (_g = this.additionalEmails) !== null && _g !== void 0 ? _g : [],
            nationality: this.nationality,
            skills: this.skills,
            inCouple: this.inCouple,
            isJobHoused: this.isJobHoused,
            hasLicenceDriver: this.hasLicenceDriver,
            languageId: this.languageId,
            language: this.language ? this.language.toDto() : null,
            dependentChildren: this.dependentChildren,
            animal: this.animal,
            isAvailable: this.isAvailable,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            relationshipStatusId: this.relationshipStatusId,
            relationshipStatus: (_h = this.relationshipStatus) === null || _h === void 0 ? void 0 : _h.toDto(),
            candidateStatusId: this.candidateStatusId,
            candidateStatus: (_j = this.candidateStatus) === null || _j === void 0 ? void 0 : _j.toDto(),
            placedJobOfferId: this.placedJobOfferId,
            placedJobOffer: (_k = this.placedJobOffer) === null || _k === void 0 ? void 0 : _k.toDto(),
            candidateApplications: this.candidateApplications
                ? this.candidateApplications.map((x) => x.toDto())
                : undefined,
            contractTypeAskedId: this.contractTypeAskedId,
            contractTypeAsked: (_l = this.contractTypeAsked) === null || _l === void 0 ? void 0 : _l.toDto(),
            workingTimeTypeId: this.workingTimeTypeId,
            workingTimeType: (_m = this.workingTimeType) === null || _m === void 0 ? void 0 : _m.toDto(),
            files: this.files ? this.files.map((x) => x.toDto()) : undefined,
            noteItems: this.noteItems
                ? this.noteItems.map((x) => x.toDto())
                : undefined,
            note: this.note,
            candidateLicences: this.candidateLicences
                ? this.candidateLicences.map((x) => x.toDto())
                : undefined,
            candidateJobs: this.candidateJobs
                ? this.candidateJobs.map((x) => x.toDto())
                : undefined,
            interviews: this.interviews
                ? this.interviews.map((x) => x.toDto())
                : undefined,
            candidateLanguages: this.candidateLanguages
                ? this.candidateLanguages.map((x) => x.toDto())
                : undefined,
            candidateChildrens: this.candidateChildrens
                ? this.candidateChildrens.map((x) => x.toDto())
                : undefined,
            partnerFirstName: this.partnerFirstName,
            partnerLastName: this.partnerLastName,
            partnerGenderId: this.partnerGenderId,
            partnerGender: (_o = this.partnerGender) === null || _o === void 0 ? void 0 : _o.toDto(),
            partnerBirthDate: this.partnerBirthDate,
            lastCandidateMessageSendedDate: this.lastCandidateMessageSendedDate,
            hasNoChildren: this.hasNoChildren,
            candidateReadonlyProperties: this.candidateReadonlyProperties
                ? this.candidateReadonlyProperties.map((x) => x.toDto())
                : undefined,
            isOnPost: this.isOnPost,
            consultantId: this.consultantId,
            consultant: (_p = this.consultant) === null || _p === void 0 ? void 0 : _p.toDto(),
            disabled: this.disabled,
            jobAdderContactId: this.jobAdderContactId,
            isVehicle: this.isVehicle,
            candidatePets: this.candidatePets
                ? this.candidatePets.map((x) => x.toDto())
                : undefined,
            candidateContracts: this.candidateContracts
                ? this.candidateContracts.map((x) => x.toDto())
                : undefined,
            candidateCountries: this.candidateCountries
                ? this.candidateCountries.map((x) => x.toDto())
                : undefined,
            candidateDepartments: this.candidateDepartments
                ? this.candidateDepartments.map((x) => x.toDto())
                : undefined,
            manuallyCompleted: this.manuallyCompleted,
            mailSentAfterMigration: this.mailSentAfterMigration,
            associatedUser: (_q = this.associatedUser) === null || _q === void 0 ? void 0 : _q.toDto(false),
            candidateCurrentJobs: this.candidateCurrentJobs
                ? this.candidateCurrentJobs.map((x) => x.toDto())
                : undefined,
            globalMobility: this.globalMobility,
            hasManyTravel: this.hasManyTravel,
            referencesValidated: this.referencesValidated,
            allergy: this.allergy,
            newsletterUnsubscribed: this.newsletterUnsubscribed,
            newsletterUnsubscribedGuid: this.newsletterUnsubscribedGuid,
            partnerEmail: this.partnerEmail,
            partnerPhone: this.partnerPhone,
            allowed_to_work_us: this.allowed_to_work_us,
            require_sponsorship_us: this.require_sponsorship_us,
        };
    }
    fromDto(dto) {
        var _a;
        this.id = dto.id;
        this.firstName = dto.firstName;
        this.lastName = dto.lastName;
        this.nickName = dto.nickName;
        this.genderId = dto.genderId;
        this.birthDate = dto.birthDate;
        this.phone = dto.phone;
        this.email = dto.email;
        this.additionalEmails = (_a = dto.additionalEmails) !== null && _a !== void 0 ? _a : [];
        this.nationality = dto.nationality;
        this.relationshipStatusId = dto.relationshipStatusId;
        this.skills = dto.skills;
        this.inCouple = dto.inCouple;
        this.isJobHoused = dto.isJobHoused;
        this.hasLicenceDriver = dto.hasLicenceDriver;
        this.languageId = dto.languageId;
        this.dependentChildren = dto.dependentChildren;
        this.animal = dto.animal;
        this.isAvailable = dto.isAvailable;
        this.phoneSecondary = dto.phoneSecondary;
        this.candidateStatusId = dto.candidateStatusId;
        this.placedJobOfferId = dto.placedJobOfferId;
        this.contractTypeAskedId = dto.contractTypeAskedId;
        this.workingTimeTypeId = dto.workingTimeTypeId;
        this.note = dto.note;
        this.partnerFirstName = dto.partnerFirstName;
        this.partnerLastName = dto.partnerLastName;
        this.partnerBirthDate = dto.partnerBirthDate;
        this.partnerGenderId = dto.partnerGenderId;
        this.lastCandidateMessageSendedDate =
            dto.lastCandidateMessageSendedDate;
        this.hasNoChildren = dto.hasNoChildren;
        this.isOnPost = dto.isOnPost;
        this.consultantId = dto.consultantId;
        this.disabled = dto.disabled;
        this.jobAdderContactId = dto.jobAdderContactId;
        this.isVehicle = dto.isVehicle;
        this.manuallyCompleted = dto.manuallyCompleted;
        this.mailSentAfterMigration = dto.mailSentAfterMigration;
        this.globalMobility = dto.globalMobility;
        this.hasManyTravel = dto.hasManyTravel;
        this.referencesValidated = dto.referencesValidated;
        this.allergy = dto.allergy;
        this.newsletterUnsubscribed = dto.newsletterUnsubscribed;
        this.newsletterUnsubscribedGuid = dto.newsletterUnsubscribedGuid;
        this.partnerEmail = dto.partnerEmail;
        this.partnerPhone = dto.partnerPhone;
        this.allowed_to_work_us = dto.allowed_to_work_us;
        this.require_sponsorship_us = dto.require_sponsorship_us;
        if (dto.creationDate) {
            this.creationDate = dto.creationDate;
        }
        if (dto.language) {
            const language = new app_language_entity_1.AppLanguage();
            language.fromDto(dto.language);
            this.language = language;
            this.languageId = language.id;
        }
        if (dto.addresses) {
            this.addresses = [];
            for (const address of dto.addresses) {
                const addrEntity = new address_entity_1.Address();
                addrEntity.fromDto(address);
                this.addresses.push(addrEntity);
            }
        }
        if (dto.candidateJobs) {
            this.candidateJobs = [];
            for (const cjob of dto.candidateJobs) {
                const cjobToCreate = new candidate_jobs_entity_1.CandidateJob();
                cjobToCreate.fromDto(cjob);
                this.candidateJobs.push(cjobToCreate);
            }
        }
        if (dto.files) {
            this.files = [];
            for (const file of dto.files) {
                const fileToCreate = new candidate_file_entity_1.CandidateFile();
                fileToCreate.fromDto(file);
                this.files.push(fileToCreate);
            }
        }
        if (dto.noteItems) {
            this.noteItems = [];
            for (const note of dto.noteItems) {
                const noteToCreate = new note_item_entity_1.NoteItem();
                noteToCreate.fromDto(note);
                this.noteItems.push(noteToCreate);
            }
        }
        if (dto.candidateLicences) {
            this.candidateLicences = [];
            for (const cl of dto.candidateLicences) {
                const clToCreate = new candidate_licences_entity_1.CandidateLicence();
                clToCreate.fromDto(cl);
                this.candidateLicences.push(clToCreate);
            }
        }
        if (dto.candidateLanguages) {
            this.candidateLanguages = [];
            for (const cl of dto.candidateLanguages) {
                const clToCreate = new candidate_language_entity_1.CandidateLanguage();
                clToCreate.fromDto(cl);
                this.candidateLanguages.push(clToCreate);
            }
        }
        if (dto.candidateChildrens) {
            this.candidateChildrens =
                dto.candidateChildrens.map((x) => {
                    const candidateChildren = new candidate_children_entity_1.CandidateChildren();
                    candidateChildren.fromDto(x);
                    return candidateChildren;
                });
        }
        if (dto.candidateReadonlyProperties) {
            this.candidateReadonlyProperties = [];
            for (const item of dto.candidateReadonlyProperties) {
                const candidateReadonlyProperty = new candidate_readonly_property_entity_1.CandidateReadonlyProperty();
                candidateReadonlyProperty.fromDto(item);
                this.candidateReadonlyProperties.push(candidateReadonlyProperty);
            }
        }
        if (dto.candidatePets) {
            this.candidatePets = dto.candidatePets.map((x) => {
                const candidatePet = new candidate_pet_entity_1.CandidatePet();
                candidatePet.fromDto(x);
                return candidatePet;
            });
        }
        if (dto.candidateContracts) {
            this.candidateContracts = [];
            for (const candidateContractDto of dto.candidateContracts) {
                const candidateContract = new candidate_contract_entity_1.CandidateContract();
                candidateContract.fromDto(candidateContractDto);
                this.candidateContracts.push(candidateContract);
            }
        }
        if (dto.candidateCountries) {
            this.candidateCountries =
                dto.candidateCountries.map((x) => {
                    const candidateCountry = new candidate_country_entity_1.CandidateCountry();
                    candidateCountry.fromDto(x);
                    return candidateCountry;
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
        if (dto.candidateCurrentJobs) {
            this.candidateCurrentJobs = [];
            for (const currentJob of dto.candidateCurrentJobs) {
                const currentJobToCreate = new candidate_current_jobs_entity_1.CandidateCurrentJob();
                currentJobToCreate.fromDto(currentJob);
                this.candidateCurrentJobs.push(currentJobToCreate);
            }
        }
        if (!this.id) {
            this.id = undefined;
        }
    }
};
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'firstName', nullable: true, length: 130 }),
    __metadata("design:type", String)
], Candidate.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'lastName', nullable: true, length: 130 }),
    __metadata("design:type", String)
], Candidate.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'nickName', nullable: true, length: 130 }),
    __metadata("design:type", String)
], Candidate.prototype, "nickName", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'genderId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], Candidate.prototype, "genderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_value_entity_1.AppValue),
    (0, typeorm_1.JoinColumn)({ name: 'genderId' }),
    __metadata("design:type", app_value_entity_1.AppValue)
], Candidate.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)('date', { name: 'birthDate', nullable: true }),
    __metadata("design:type", Date)
], Candidate.prototype, "birthDate", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'phone', nullable: true, length: 30 }),
    __metadata("design:type", String)
], Candidate.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'phoneSecondary', nullable: true, length: 30 }),
    __metadata("design:type", String)
], Candidate.prototype, "phoneSecondary", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'email', length: 255, nullable: true }),
    __metadata("design:type", String)
], Candidate.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        name: 'additionalEmails',
        nullable: true,
        transformer: {
            to: (value) => (value === null || value === void 0 ? void 0 : value.length) ? JSON.stringify(value) : null,
            from: (value) => value ? JSON.parse(value) : [],
        },
    }),
    __metadata("design:type", Array)
], Candidate.prototype, "additionalEmails", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'nationality', nullable: true }),
    __metadata("design:type", String)
], Candidate.prototype, "nationality", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'relationshipStatusId',
        nullable: true,
        length: 36,
    }),
    __metadata("design:type", String)
], Candidate.prototype, "relationshipStatusId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_value_entity_1.AppValue),
    (0, typeorm_1.JoinColumn)({ name: 'relationshipStatusId' }),
    __metadata("design:type", app_value_entity_1.AppValue)
], Candidate.prototype, "relationshipStatus", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'skills', nullable: true }),
    __metadata("design:type", String)
], Candidate.prototype, "skills", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'inCouple', nullable: false, default: 0 }),
    __metadata("design:type", Boolean)
], Candidate.prototype, "inCouple", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'isJobHoused', nullable: true, length: 30 }),
    __metadata("design:type", String)
], Candidate.prototype, "isJobHoused", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'hasLicenceDriver', nullable: true }),
    __metadata("design:type", Boolean)
], Candidate.prototype, "hasLicenceDriver", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_language_entity_1.AppLanguage),
    (0, typeorm_1.JoinColumn)({ name: 'languageId' }),
    __metadata("design:type", app_language_entity_1.AppLanguage)
], Candidate.prototype, "language", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'languageId', length: 36, nullable: true }),
    __metadata("design:type", String)
], Candidate.prototype, "languageId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'dependentChildren', nullable: true }),
    __metadata("design:type", Number)
], Candidate.prototype, "dependentChildren", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'animal', nullable: true }),
    __metadata("design:type", Boolean)
], Candidate.prototype, "animal", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'isAvailable', nullable: true, default: 0 }),
    __metadata("design:type", Boolean)
], Candidate.prototype, "isAvailable", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => address_entity_1.Address, (addresses) => addresses.candidate, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Candidate.prototype, "addresses", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'candidateStatusId',
        nullable: true,
        length: 36,
    }),
    __metadata("design:type", String)
], Candidate.prototype, "candidateStatusId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_value_entity_1.AppValue),
    (0, typeorm_1.JoinColumn)({ name: 'candidateStatusId' }),
    __metadata("design:type", app_value_entity_1.AppValue)
], Candidate.prototype, "candidateStatus", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'placedJobOfferId',
        nullable: true,
        length: 36,
    }),
    __metadata("design:type", String)
], Candidate.prototype, "placedJobOfferId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => job_offer_entity_1.JobOffer, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'placedJobOfferId' }),
    __metadata("design:type", job_offer_entity_1.JobOffer)
], Candidate.prototype, "placedJobOffer", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => candidate_application_entity_1.CandidateApplication, (candidateApplications) => candidateApplications.candidate, { cascade: true, onDelete: 'SET NULL' }),
    __metadata("design:type", Array)
], Candidate.prototype, "candidateApplications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => candidate_jobs_entity_1.CandidateJob, (candidateJobs) => candidateJobs.candidate, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Candidate.prototype, "candidateJobs", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'contractTypeId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], Candidate.prototype, "contractTypeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_value_entity_1.AppValue),
    (0, typeorm_1.JoinColumn)({ name: 'contractTypeId' }),
    __metadata("design:type", app_value_entity_1.AppValue)
], Candidate.prototype, "contractType", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'contractTypeAskedId',
        nullable: true,
        length: 36,
    }),
    __metadata("design:type", String)
], Candidate.prototype, "contractTypeAskedId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_value_entity_1.AppValue),
    (0, typeorm_1.JoinColumn)({ name: 'contractTypeAskedId' }),
    __metadata("design:type", app_value_entity_1.AppValue)
], Candidate.prototype, "contractTypeAsked", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'workingTimeTypeId',
        nullable: true,
        length: 36,
    }),
    __metadata("design:type", String)
], Candidate.prototype, "workingTimeTypeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_value_entity_1.AppValue),
    (0, typeorm_1.JoinColumn)({ name: 'workingTimeTypeId' }),
    __metadata("design:type", app_value_entity_1.AppValue)
], Candidate.prototype, "workingTimeType", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => candidate_file_entity_1.CandidateFile, (file) => file.candidate, { cascade: true }),
    __metadata("design:type", Array)
], Candidate.prototype, "files", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'note', nullable: true }),
    __metadata("design:type", Number)
], Candidate.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => note_item_entity_1.NoteItem, (noteItems) => noteItems.candidate, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Candidate.prototype, "noteItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => candidate_licences_entity_1.CandidateLicence, (candidateLicence) => candidateLicence.candidate, { cascade: true }),
    __metadata("design:type", Array)
], Candidate.prototype, "candidateLicences", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => interview_entity_1.Interview, (interview) => interview.candidate),
    __metadata("design:type", Array)
], Candidate.prototype, "interviews", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => candidate_language_entity_1.CandidateLanguage, (candidateLanguages) => candidateLanguages.candidate, { cascade: true }),
    __metadata("design:type", Array)
], Candidate.prototype, "candidateLanguages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => candidate_children_entity_1.CandidateChildren, (candidateChildrens) => candidateChildrens.candidate, { cascade: true }),
    __metadata("design:type", Array)
], Candidate.prototype, "candidateChildrens", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'partnerFirstName', nullable: true, length: 30 }),
    __metadata("design:type", String)
], Candidate.prototype, "partnerFirstName", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'partnerLastName', nullable: true, length: 30 }),
    __metadata("design:type", String)
], Candidate.prototype, "partnerLastName", void 0);
__decorate([
    (0, typeorm_1.Column)('date', { name: 'partnerBirthDate', nullable: true }),
    __metadata("design:type", Date)
], Candidate.prototype, "partnerBirthDate", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'partnerGenderId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], Candidate.prototype, "partnerGenderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_value_entity_1.AppValue),
    (0, typeorm_1.JoinColumn)({ name: 'partnerGenderId' }),
    __metadata("design:type", app_value_entity_1.AppValue)
], Candidate.prototype, "partnerGender", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'partnerEmail', nullable: true, length: 255 }),
    __metadata("design:type", String)
], Candidate.prototype, "partnerEmail", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'partnerPhone', nullable: true, length: 30 }),
    __metadata("design:type", String)
], Candidate.prototype, "partnerPhone", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', {
        name: 'lastCandidateMessageSendedDate',
        nullable: true,
    }),
    __metadata("design:type", Date)
], Candidate.prototype, "lastCandidateMessageSendedDate", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', {
        name: 'hasNoChildren',
        nullable: true,
        default: false,
    }),
    __metadata("design:type", Boolean)
], Candidate.prototype, "hasNoChildren", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => candidate_readonly_property_entity_1.CandidateReadonlyProperty, (candidateReadonlyProperties) => candidateReadonlyProperties.candidate, { cascade: true }),
    __metadata("design:type", Array)
], Candidate.prototype, "candidateReadonlyProperties", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'isOnPost', nullable: true, default: 0 }),
    __metadata("design:type", Boolean)
], Candidate.prototype, "isOnPost", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (consultant) => consultant.candidates, {
        cascade: true,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'consultantId' }),
    __metadata("design:type", user_entity_1.User)
], Candidate.prototype, "consultant", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'consultantId', length: 36, nullable: true }),
    __metadata("design:type", String)
], Candidate.prototype, "consultantId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'jobAdderContactId', nullable: true }),
    __metadata("design:type", Number)
], Candidate.prototype, "jobAdderContactId", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'isVehicle', nullable: true, default: false }),
    __metadata("design:type", Boolean)
], Candidate.prototype, "isVehicle", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => candidate_pet_entity_1.CandidatePet, (candidatePets) => candidatePets.candidate, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Candidate.prototype, "candidatePets", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => candidate_presentation_entity_1.CandidatePresentation, (presentations) => presentations.candidate, { cascade: true }),
    __metadata("design:type", Array)
], Candidate.prototype, "presentations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => candidate_contract_entity_1.CandidateContract, (candidateContracts) => candidateContracts.candidate, { cascade: true }),
    __metadata("design:type", Array)
], Candidate.prototype, "candidateContracts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => candidate_country_entity_1.CandidateCountry, (candidateCountries) => candidateCountries.candidate, { cascade: true }),
    __metadata("design:type", Array)
], Candidate.prototype, "candidateCountries", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => candidate_department_entity_1.CandidateDepartment, (candidateDepartment) => candidateDepartment.candidate, { cascade: true }),
    __metadata("design:type", Array)
], Candidate.prototype, "candidateDepartments", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', {
        name: 'manuallyCompleted',
        nullable: true,
        default: false,
    }),
    __metadata("design:type", Boolean)
], Candidate.prototype, "manuallyCompleted", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', {
        name: 'mailSentAfterMigration',
        nullable: false,
        default: false,
    }),
    __metadata("design:type", Boolean)
], Candidate.prototype, "mailSentAfterMigration", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, (user) => user.candidate),
    __metadata("design:type", user_entity_1.User)
], Candidate.prototype, "associatedUser", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => candidate_current_jobs_entity_1.CandidateCurrentJob, (candidateCurrentJob) => candidateCurrentJob.candidate, { cascade: true }),
    __metadata("design:type", Array)
], Candidate.prototype, "candidateCurrentJobs", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'globalMobility', default: false }),
    __metadata("design:type", Boolean)
], Candidate.prototype, "globalMobility", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', {
        name: 'hasManyTravel',
        nullable: true,
        default: false,
    }),
    __metadata("design:type", Boolean)
], Candidate.prototype, "hasManyTravel", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', {
        name: 'referencesValidated',
        nullable: true,
        default: null,
    }),
    __metadata("design:type", Boolean)
], Candidate.prototype, "referencesValidated", void 0);
__decorate([
    (0, typeorm_1.Column)('enum', {
        name: 'allergy',
        nullable: true,
        enum: shared_constants_1.CandidateAllergiesEnum,
        enumName: 'CandidateAllergiesEnum',
    }),
    __metadata("design:type", String)
], Candidate.prototype, "allergy", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', {
        name: 'newsletterUnsubscribed',
        nullable: false,
        default: 0,
    }),
    __metadata("design:type", Boolean)
], Candidate.prototype, "newsletterUnsubscribed", void 0);
__decorate([
    (0, typeorm_1.Generated)('uuid'),
    (0, typeorm_1.Column)('varchar', {
        name: 'newsletterUnsubscribedGuid',
        nullable: true,
        length: 36,
    }),
    __metadata("design:type", String)
], Candidate.prototype, "newsletterUnsubscribedGuid", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'allowed_to_work_us', nullable: true }),
    __metadata("design:type", Boolean)
], Candidate.prototype, "allowed_to_work_us", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'require_sponsorship_us', nullable: true }),
    __metadata("design:type", Boolean)
], Candidate.prototype, "require_sponsorship_us", void 0);
Candidate = __decorate([
    (0, typeorm_1.Entity)({ name: 'candidates' })
], Candidate);
exports.Candidate = Candidate;
//# sourceMappingURL=candidate.entity.js.map