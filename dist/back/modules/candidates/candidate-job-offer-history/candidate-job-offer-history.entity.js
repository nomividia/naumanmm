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
exports.CandidateJobOfferHistory = exports.CandidateJobOfferAction = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../entities/base-entity");
const job_offer_entity_1 = require("../../job-offers/job-offer.entity");
const candidate_entity_1 = require("../candidate.entity");
const candidate_file_entity_1 = require("../candidate-file.entity");
var CandidateJobOfferAction;
(function (CandidateJobOfferAction) {
    CandidateJobOfferAction["LINKED"] = "LINKED";
    CandidateJobOfferAction["UNLINKED"] = "UNLINKED";
})(CandidateJobOfferAction = exports.CandidateJobOfferAction || (exports.CandidateJobOfferAction = {}));
let CandidateJobOfferHistory = class CandidateJobOfferHistory extends base_entity_1.AppBaseEntity {
    toDto() {
        var _a, _b, _c;
        return {
            id: this.id,
            candidateId: this.candidateId,
            candidate: (_a = this.candidate) === null || _a === void 0 ? void 0 : _a.toDto(),
            jobOfferId: this.jobOfferId,
            jobOffer: (_b = this.jobOffer) === null || _b === void 0 ? void 0 : _b.toDto(),
            action: this.action,
            candidateFirstName: this.candidateFirstName,
            candidateLastName: this.candidateLastName,
            actionDate: this.actionDate,
            startDate: this.startDate,
            contractFileId: this.contractFileId,
            contractFile: (_c = this.contractFile) === null || _c === void 0 ? void 0 : _c.toDto(),
            creationDate: this.creationDate,
            modifDate: this.modifDate,
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.candidateId = dto.candidateId;
        this.jobOfferId = dto.jobOfferId;
        this.action = dto.action;
        this.candidateFirstName = dto.candidateFirstName;
        this.candidateLastName = dto.candidateLastName;
        this.actionDate = dto.actionDate;
        this.startDate = dto.startDate;
        this.contractFileId = dto.contractFileId;
        if (!this.id) {
            this.id = undefined;
        }
    }
};
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'candidateId', nullable: false, length: 36 }),
    __metadata("design:type", String)
], CandidateJobOfferHistory.prototype, "candidateId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => candidate_entity_1.Candidate, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'candidateId' }),
    __metadata("design:type", candidate_entity_1.Candidate)
], CandidateJobOfferHistory.prototype, "candidate", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'jobOfferId', nullable: false, length: 36 }),
    __metadata("design:type", String)
], CandidateJobOfferHistory.prototype, "jobOfferId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => job_offer_entity_1.JobOffer, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'jobOfferId' }),
    __metadata("design:type", job_offer_entity_1.JobOffer)
], CandidateJobOfferHistory.prototype, "jobOffer", void 0);
__decorate([
    (0, typeorm_1.Column)('enum', {
        name: 'action',
        nullable: false,
        enum: CandidateJobOfferAction,
        enumName: 'CandidateJobOfferAction',
    }),
    __metadata("design:type", String)
], CandidateJobOfferHistory.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'candidateFirstName',
        nullable: true,
        length: 130,
    }),
    __metadata("design:type", String)
], CandidateJobOfferHistory.prototype, "candidateFirstName", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'candidateLastName',
        nullable: true,
        length: 130,
    }),
    __metadata("design:type", String)
], CandidateJobOfferHistory.prototype, "candidateLastName", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { name: 'actionDate', nullable: false }),
    __metadata("design:type", Date)
], CandidateJobOfferHistory.prototype, "actionDate", void 0);
__decorate([
    (0, typeorm_1.Column)('date', { name: 'startDate', nullable: true }),
    __metadata("design:type", Date)
], CandidateJobOfferHistory.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'contractFileId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], CandidateJobOfferHistory.prototype, "contractFileId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => candidate_file_entity_1.CandidateFile, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'contractFileId' }),
    __metadata("design:type", candidate_file_entity_1.CandidateFile)
], CandidateJobOfferHistory.prototype, "contractFile", void 0);
CandidateJobOfferHistory = __decorate([
    (0, typeorm_1.Entity)({ name: 'candidate-job-offer-history' })
], CandidateJobOfferHistory);
exports.CandidateJobOfferHistory = CandidateJobOfferHistory;
//# sourceMappingURL=candidate-job-offer-history.entity.js.map