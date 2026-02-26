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
exports.CandidateLanguage = void 0;
const typeorm_1 = require("typeorm");
const app_value_entity_1 = require("../../../entities/app-value.entity");
const base_entity_1 = require("../../../entities/base-entity");
const candidate_entity_1 = require("../candidate.entity");
let CandidateLanguage = class CandidateLanguage extends base_entity_1.AppBaseEntity {
    toDto() {
        return {
            id: this.id,
            candidateId: this.candidateId,
            levelLanguageId: this.levelLanguageId,
            candidate: this.candidate ? this.candidate.toDto() : null,
            levelLanguage: this.levelLanguage
                ? this.levelLanguage.toDto()
                : null,
            languageCode: this.languageCode,
            isPartnerLanguage: this.isPartnerLanguage,
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.candidateId = dto.candidateId;
        this.levelLanguageId = dto.levelLanguageId;
        this.languageCode = dto.languageCode;
        this.isPartnerLanguage = dto.isPartnerLanguage;
    }
};
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'languageCode', nullable: false, length: 14 }),
    __metadata("design:type", String)
], CandidateLanguage.prototype, "languageCode", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => candidate_entity_1.Candidate, (candidate) => candidate.candidateLanguages, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'candidateId' }),
    __metadata("design:type", candidate_entity_1.Candidate)
], CandidateLanguage.prototype, "candidate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_value_entity_1.AppValue),
    (0, typeorm_1.JoinColumn)({ name: 'levelLanguageId' }),
    __metadata("design:type", app_value_entity_1.AppValue)
], CandidateLanguage.prototype, "levelLanguage", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'candidateId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], CandidateLanguage.prototype, "candidateId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'levelLanguageId', length: 36, nullable: true }),
    __metadata("design:type", String)
], CandidateLanguage.prototype, "levelLanguageId", void 0);
__decorate([
    (0, typeorm_1.Column)('bool', { name: 'isPartnerLanguage', nullable: true }),
    __metadata("design:type", Boolean)
], CandidateLanguage.prototype, "isPartnerLanguage", void 0);
CandidateLanguage = __decorate([
    (0, typeorm_1.Entity)({ name: 'candidate-language' })
], CandidateLanguage);
exports.CandidateLanguage = CandidateLanguage;
//# sourceMappingURL=candidate-language.entity.js.map