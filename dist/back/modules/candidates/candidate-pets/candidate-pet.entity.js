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
exports.CandidatePet = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../entities/base-entity");
const candidate_entity_1 = require("../candidate.entity");
let CandidatePet = class CandidatePet extends base_entity_1.AppBaseEntity {
    toDto() {
        return {
            id: this.id,
            candidateId: this.candidateId,
            petNumber: this.petNumber,
            type: this.type,
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.petNumber = dto.petNumber;
        this.type = dto.type;
        this.candidateId = dto.candidateId;
    }
};
__decorate([
    (0, typeorm_1.ManyToOne)(() => candidate_entity_1.Candidate, (candidate) => candidate.candidatePets, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'candidateId' }),
    __metadata("design:type", candidate_entity_1.Candidate)
], CandidatePet.prototype, "candidate", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'candidateId', length: 36, nullable: true }),
    __metadata("design:type", String)
], CandidatePet.prototype, "candidateId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'petNumber', nullable: true }),
    __metadata("design:type", Number)
], CandidatePet.prototype, "petNumber", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'type', nullable: true }),
    __metadata("design:type", String)
], CandidatePet.prototype, "type", void 0);
CandidatePet = __decorate([
    (0, typeorm_1.Entity)({ name: 'candidate-pet' })
], CandidatePet);
exports.CandidatePet = CandidatePet;
//# sourceMappingURL=candidate-pet.entity.js.map