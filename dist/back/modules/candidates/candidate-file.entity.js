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
exports.CandidateFile = void 0;
const typeorm_1 = require("typeorm");
const app_file_entity_1 = require("../../entities/app-file.entity");
const app_value_entity_1 = require("../../entities/app-value.entity");
const base_entity_1 = require("../../entities/base-entity");
const candidate_entity_1 = require("./candidate.entity");
let CandidateFile = class CandidateFile extends base_entity_1.AppBaseEntity {
    toDto() {
        var _a, _b, _c;
        return {
            id: this.id,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            candidateId: this.candidateId,
            fileId: this.fileId,
            fileTypeId: this.fileTypeId,
            fileType: (_a = this.fileType) === null || _a === void 0 ? void 0 : _a.toDto(),
            file: (_b = this.file) === null || _b === void 0 ? void 0 : _b.toDto(),
            candidate: (_c = this.candidate) === null || _c === void 0 ? void 0 : _c.toDto(),
            isMandatory: this.isMandatory,
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.candidateId = dto.candidateId;
        this.fileId = dto.fileId;
        this.fileTypeId = dto.fileTypeId;
        this.isMandatory = dto.isMandatory;
        if (dto.file) {
            this.file = new app_file_entity_1.AppFile();
            this.file.fromDto(dto.file);
        }
        if (!this.id) {
            this.id = undefined;
        }
    }
};
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'fileId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], CandidateFile.prototype, "fileId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_file_entity_1.AppFile, { cascade: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'fileId' }),
    __metadata("design:type", app_file_entity_1.AppFile)
], CandidateFile.prototype, "file", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'candidateId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], CandidateFile.prototype, "candidateId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => candidate_entity_1.Candidate, (candidate) => candidate.files, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'candidateId' }),
    __metadata("design:type", candidate_entity_1.Candidate)
], CandidateFile.prototype, "candidate", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'fileTypeId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], CandidateFile.prototype, "fileTypeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_value_entity_1.AppValue, { orphanedRowAction: 'delete' }),
    (0, typeorm_1.JoinColumn)({ name: 'fileTypeId' }),
    __metadata("design:type", app_value_entity_1.AppValue)
], CandidateFile.prototype, "fileType", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'isMandatory', nullable: false, default: 0 }),
    __metadata("design:type", Boolean)
], CandidateFile.prototype, "isMandatory", void 0);
CandidateFile = __decorate([
    (0, typeorm_1.Entity)({ name: 'candidates-files' })
], CandidateFile);
exports.CandidateFile = CandidateFile;
//# sourceMappingURL=candidate-file.entity.js.map