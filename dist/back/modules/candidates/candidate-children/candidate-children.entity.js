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
exports.CandidateChildren = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../entities/base-entity");
const candidate_entity_1 = require("../candidate.entity");
let CandidateChildren = class CandidateChildren extends base_entity_1.AppBaseEntity {
    toDto() {
        return {
            id: this.id,
            candidateId: this.candidateId,
            childNumber: this.childNumber,
            age: this.age,
            isDependent: this.isDependent,
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.childNumber = dto.childNumber;
        this.age = dto.age;
        this.candidateId = dto.candidateId;
        this.isDependent = dto.isDependent;
    }
};
__decorate([
    (0, typeorm_1.ManyToOne)(() => candidate_entity_1.Candidate, (candidate) => candidate.candidateChildrens, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'candidateId' }),
    __metadata("design:type", candidate_entity_1.Candidate)
], CandidateChildren.prototype, "candidate", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'candidateId', length: 36, nullable: true }),
    __metadata("design:type", String)
], CandidateChildren.prototype, "candidateId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'childNumber', nullable: false }),
    __metadata("design:type", Number)
], CandidateChildren.prototype, "childNumber", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'age', nullable: false }),
    __metadata("design:type", Number)
], CandidateChildren.prototype, "age", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'isDependent', nullable: false, default: false }),
    __metadata("design:type", Boolean)
], CandidateChildren.prototype, "isDependent", void 0);
CandidateChildren = __decorate([
    (0, typeorm_1.Entity)({ name: 'candidate-children' })
], CandidateChildren);
exports.CandidateChildren = CandidateChildren;
//# sourceMappingURL=candidate-children.entity.js.map