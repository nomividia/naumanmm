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
exports.CandidatePresentation = void 0;
const typeorm_1 = require("typeorm");
const candidate_entity_1 = require("../modules/candidates/candidate.entity");
const base_entity_1 = require("./base-entity");
let CandidatePresentation = class CandidatePresentation extends base_entity_1.AppBaseEntity {
    toDto() {
        return {
            id: this.id,
            title: this.title,
            content: this.content,
            candidateId: this.candidateId,
            isDefault: this.isDefault,
            displayOrder: this.displayOrder,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            disabled: this.disabled,
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.title = dto.title;
        this.content = dto.content;
        this.candidateId = dto.candidateId;
        this.isDefault = dto.isDefault;
        this.displayOrder = dto.displayOrder;
        this.disabled = dto.disabled;
        if (!this.id)
            this.id = undefined;
    }
};
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'title', length: 255 }),
    __metadata("design:type", String)
], CandidatePresentation.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'content', nullable: true }),
    __metadata("design:type", String)
], CandidatePresentation.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => candidate_entity_1.Candidate, (candidate) => candidate.presentations, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'candidateId' }),
    __metadata("design:type", candidate_entity_1.Candidate)
], CandidatePresentation.prototype, "candidate", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'candidateId', length: 36 }),
    __metadata("design:type", String)
], CandidatePresentation.prototype, "candidateId", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'isDefault', default: false }),
    __metadata("design:type", Boolean)
], CandidatePresentation.prototype, "isDefault", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'displayOrder', nullable: true }),
    __metadata("design:type", Number)
], CandidatePresentation.prototype, "displayOrder", void 0);
CandidatePresentation = __decorate([
    (0, typeorm_1.Entity)({ name: 'candidate_presentations' })
], CandidatePresentation);
exports.CandidatePresentation = CandidatePresentation;
//# sourceMappingURL=candidate-presentation.entity.js.map