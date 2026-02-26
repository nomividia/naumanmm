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
exports.CandidateCountry = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../entities/base-entity");
const candidate_application_entity_1 = require("../../candidates-application/candidate-application.entity");
const candidate_entity_1 = require("../candidate.entity");
let CandidateCountry = class CandidateCountry extends base_entity_1.AppBaseEntity {
    toDto() {
        return {
            id: this.id,
            candidateId: this.candidateId,
            candidate: this.candidate ? this.candidate.toDto() : null,
            country: this.country,
            candidateApplicationId: this.candidateApplicationId,
            candidateApplication: this.candidateApplication
                ? this.candidateApplication.toDto()
                : null,
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.candidateId = dto.candidateId;
        this.country = dto.country;
        this.candidateApplicationId = dto.candidateApplicationId;
    }
};
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'candidateId', length: 36, nullable: true }),
    __metadata("design:type", String)
], CandidateCountry.prototype, "candidateId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => candidate_entity_1.Candidate, (candidate) => candidate.candidateCountries, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        orphanedRowAction: 'delete',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'candidateId' }),
    __metadata("design:type", candidate_entity_1.Candidate)
], CandidateCountry.prototype, "candidate", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'candidateApplicationId',
        length: 36,
        nullable: true,
    }),
    __metadata("design:type", String)
], CandidateCountry.prototype, "candidateApplicationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => candidate_application_entity_1.CandidateApplication, (candidateApplication) => candidateApplication.candidateCountries, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        orphanedRowAction: 'delete',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'candidateApplicationId' }),
    __metadata("design:type", candidate_application_entity_1.CandidateApplication)
], CandidateCountry.prototype, "candidateApplication", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'country', length: 255, nullable: false }),
    __metadata("design:type", String)
], CandidateCountry.prototype, "country", void 0);
CandidateCountry = __decorate([
    (0, typeorm_1.Entity)({ name: 'candidate-country' })
], CandidateCountry);
exports.CandidateCountry = CandidateCountry;
//# sourceMappingURL=candidate-country.entity.js.map