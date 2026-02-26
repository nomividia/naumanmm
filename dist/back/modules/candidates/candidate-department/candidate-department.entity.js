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
exports.CandidateDepartment = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../entities/base-entity");
const candidate_application_entity_1 = require("../../candidates-application/candidate-application.entity");
const newsletter_entity_1 = require("../../newsletter/newsletter.entity");
const candidate_entity_1 = require("../candidate.entity");
let CandidateDepartment = class CandidateDepartment extends base_entity_1.AppBaseEntity {
    toDto() {
        return {
            id: this.id,
            candidateId: this.candidateId,
            candidate: this.candidate ? this.candidate.toDto() : null,
            candidateApplicationId: this.candidateApplicationId,
            candidateApplication: this.candidateApplication
                ? this.candidateApplication.toDto()
                : null,
            department: this.department,
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.candidateId = dto.candidateId;
        this.candidateApplicationId = dto.candidateApplicationId;
        this.department = dto.department;
    }
};
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'candidateId', length: 36, nullable: true }),
    __metadata("design:type", String)
], CandidateDepartment.prototype, "candidateId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => candidate_entity_1.Candidate, (candidate) => candidate.candidateDepartments, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'candidateId' }),
    __metadata("design:type", candidate_entity_1.Candidate)
], CandidateDepartment.prototype, "candidate", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'candidateApplicationId',
        length: 36,
        nullable: true,
    }),
    __metadata("design:type", String)
], CandidateDepartment.prototype, "candidateApplicationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => candidate_application_entity_1.CandidateApplication, (candidateApplication) => candidateApplication.candidateDepartments, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'candidateApplicationId' }),
    __metadata("design:type", candidate_application_entity_1.CandidateApplication)
], CandidateDepartment.prototype, "candidateApplication", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'department', length: 20, nullable: false }),
    __metadata("design:type", String)
], CandidateDepartment.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'newsletterId', length: 36, nullable: true }),
    __metadata("design:type", String)
], CandidateDepartment.prototype, "newsletterId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => newsletter_entity_1.Newsletter, (newsletter) => newsletter.candidateDepartments, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'newsletterId' }),
    __metadata("design:type", newsletter_entity_1.Newsletter)
], CandidateDepartment.prototype, "newsletter", void 0);
CandidateDepartment = __decorate([
    (0, typeorm_1.Entity)({ name: 'candidate-department' })
], CandidateDepartment);
exports.CandidateDepartment = CandidateDepartment;
//# sourceMappingURL=candidate-department.entity.js.map