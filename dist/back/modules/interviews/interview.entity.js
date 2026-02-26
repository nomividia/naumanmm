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
exports.Interview = void 0;
const typeorm_1 = require("typeorm");
const shared_constants_1 = require("../../../shared/shared-constants");
const base_entity_1 = require("../../entities/base-entity");
const user_entity_1 = require("../../entities/user.entity");
const candidate_entity_1 = require("../candidates/candidate.entity");
let Interview = class Interview extends base_entity_1.AppBaseEntity {
    toDto() {
        var _a;
        return {
            id: this.id,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            title: this.title,
            date: this.date,
            comment: this.comment,
            candidateId: this.candidateId,
            candidate: (_a = this.candidate) === null || _a === void 0 ? void 0 : _a.toDto(),
            consultantId: this.consultantId,
            consultant: this.consultant ? this.consultant.toDto() : undefined,
            guid: this.guid,
            candidateResponse: this.candidateResponse,
            agencyPlace: this.agencyPlace,
            noShow: this.noShow,
        };
    }
    fromDto(dto) {
        var _a;
        this.id = dto.id;
        this.title = dto.title;
        this.date = dto.date;
        this.comment = dto.comment;
        this.candidateId = dto.candidateId;
        this.consultantId = dto.consultantId;
        this.guid = dto.guid;
        this.candidateResponse = dto.candidateResponse;
        this.agencyPlace = 'visio';
        this.noShow = (_a = dto.noShow) !== null && _a !== void 0 ? _a : false;
        if (!this.id) {
            this.id = undefined;
        }
    }
};
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'title', nullable: false }),
    __metadata("design:type", String)
], Interview.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { name: 'date', nullable: false }),
    __metadata("design:type", Date)
], Interview.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'comment', nullable: true }),
    __metadata("design:type", String)
], Interview.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'candidateId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], Interview.prototype, "candidateId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => candidate_entity_1.Candidate, (candidate) => candidate.interviews, {
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'candidateId' }),
    __metadata("design:type", candidate_entity_1.Candidate)
], Interview.prototype, "candidate", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'consultantId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], Interview.prototype, "consultantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'consultantId' }),
    __metadata("design:type", user_entity_1.User)
], Interview.prototype, "consultant", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'agencyPlace', nullable: true, length: '80' }),
    __metadata("design:type", String)
], Interview.prototype, "agencyPlace", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'guid', nullable: true, length: 36 }),
    __metadata("design:type", String)
], Interview.prototype, "guid", void 0);
__decorate([
    (0, typeorm_1.Column)('enum', {
        name: 'candidateResponse',
        nullable: true,
        enum: shared_constants_1.InterviewConfirmationStatus,
    }),
    __metadata("design:type", String)
], Interview.prototype, "candidateResponse", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'noShow', nullable: false, default: false }),
    __metadata("design:type", Boolean)
], Interview.prototype, "noShow", void 0);
Interview = __decorate([
    (0, typeorm_1.Entity)({ name: 'interviews' })
], Interview);
exports.Interview = Interview;
//# sourceMappingURL=interview.entity.js.map