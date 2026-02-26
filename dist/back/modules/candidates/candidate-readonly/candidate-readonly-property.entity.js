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
exports.CandidateReadonlyProperty = void 0;
const typeorm_1 = require("typeorm");
const shared_constants_1 = require("../../../../shared/shared-constants");
const candidate_entity_1 = require("../candidate.entity");
let CandidateReadonlyProperty = class CandidateReadonlyProperty {
    toDto() {
        return {
            id: this.id,
            candidateId: this.candidateId,
            candidateReadonlyField: this.candidateReadonlyField,
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.candidateId = dto.candidateId;
        this.candidateReadonlyField = dto.candidateReadonlyField;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'id' }),
    __metadata("design:type", String)
], CandidateReadonlyProperty.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'candidateReadonlyField', length: 80 }),
    __metadata("design:type", String)
], CandidateReadonlyProperty.prototype, "candidateReadonlyField", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => candidate_entity_1.Candidate, (candidate) => candidate.candidateReadonlyProperties, { onDelete: 'CASCADE', orphanedRowAction: 'delete' }),
    (0, typeorm_1.JoinColumn)({ name: 'candidateId' }),
    __metadata("design:type", candidate_entity_1.Candidate)
], CandidateReadonlyProperty.prototype, "candidate", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'candidateId', length: 36, nullable: true }),
    __metadata("design:type", String)
], CandidateReadonlyProperty.prototype, "candidateId", void 0);
CandidateReadonlyProperty = __decorate([
    (0, typeorm_1.Entity)({ name: 'candidate-readonly-property' })
], CandidateReadonlyProperty);
exports.CandidateReadonlyProperty = CandidateReadonlyProperty;
//# sourceMappingURL=candidate-readonly-property.entity.js.map