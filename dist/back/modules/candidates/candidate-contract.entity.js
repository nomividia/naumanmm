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
exports.CandidateContract = void 0;
const typeorm_1 = require("typeorm");
const app_value_entity_1 = require("../../entities/app-value.entity");
const base_entity_1 = require("../../entities/base-entity");
const candidate_entity_1 = require("./candidate.entity");
let CandidateContract = class CandidateContract extends base_entity_1.AppBaseEntity {
    toDto() {
        return {
            id: this.id,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            candidateId: this.candidateId,
            contractTypeId: this.contractTypeId,
            contractType: this.contractType ? this.contractType.toDto() : null,
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.candidateId = dto.candidateId;
        this.contractTypeId = dto.contractTypeId;
        if (!this.id) {
            this.id = undefined;
        }
    }
};
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'candidateId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], CandidateContract.prototype, "candidateId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => candidate_entity_1.Candidate, (candidate) => candidate.candidateJobs, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'candidateId' }),
    __metadata("design:type", candidate_entity_1.Candidate)
], CandidateContract.prototype, "candidate", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'contractTypeId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], CandidateContract.prototype, "contractTypeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_value_entity_1.AppValue),
    (0, typeorm_1.JoinColumn)({ name: 'contractTypeId' }),
    __metadata("design:type", app_value_entity_1.AppValue)
], CandidateContract.prototype, "contractType", void 0);
CandidateContract = __decorate([
    (0, typeorm_1.Entity)({ name: 'candidate-contracts' })
], CandidateContract);
exports.CandidateContract = CandidateContract;
//# sourceMappingURL=candidate-contract.entity.js.map