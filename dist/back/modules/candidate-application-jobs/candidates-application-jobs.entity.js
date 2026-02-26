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
exports.CandidateApplicationJobs = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../entities/base-entity");
const candidate_application_entity_1 = require("../candidates-application/candidate-application.entity");
const job_offer_entity_1 = require("../job-offers/job-offer.entity");
let CandidateApplicationJobs = class CandidateApplicationJobs extends base_entity_1.AppBaseEntity {
    toDto() {
        return {
            id: this.id,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            candidateApplicationId: this.candidateApplicationId,
            jobOfferId: this.jobOfferId,
            candidateApplication: this.candidateApplication
                ? this.candidateApplication.toDto()
                : undefined,
            jobOffer: this.jobOffer ? this.jobOffer.toDto() : undefined,
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.creationDate = dto.creationDate;
        this.jobOfferId = dto.jobOfferId;
        this.candidateApplicationId = dto.candidateApplicationId;
        if (!this.id) {
            this.id = undefined;
        }
    }
};
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'candidateApplicationId', length: 36 }),
    __metadata("design:type", String)
], CandidateApplicationJobs.prototype, "candidateApplicationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => candidate_application_entity_1.CandidateApplication, (candidateApplication) => candidateApplication.candidateApplicationJobs, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'candidateApplicationId' }),
    __metadata("design:type", candidate_application_entity_1.CandidateApplication)
], CandidateApplicationJobs.prototype, "candidateApplication", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'jobOfferId', length: 36 }),
    __metadata("design:type", String)
], CandidateApplicationJobs.prototype, "jobOfferId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => job_offer_entity_1.JobOffer, (jobOffer) => jobOffer.candidateApplicationJobs, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'jobOfferId' }),
    __metadata("design:type", job_offer_entity_1.JobOffer)
], CandidateApplicationJobs.prototype, "jobOffer", void 0);
CandidateApplicationJobs = __decorate([
    (0, typeorm_1.Entity)({ name: 'candidate-application-jobs' })
], CandidateApplicationJobs);
exports.CandidateApplicationJobs = CandidateApplicationJobs;
//# sourceMappingURL=candidates-application-jobs.entity.js.map