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
exports.CandidateMessage = void 0;
const typeorm_1 = require("typeorm");
const shared_constants_1 = require("../../../shared/shared-constants");
const base_entity_1 = require("../../entities/base-entity");
const user_entity_1 = require("../../entities/user.entity");
const candidate_entity_1 = require("../candidates/candidate.entity");
let CandidateMessage = class CandidateMessage extends base_entity_1.AppBaseEntity {
    toDto() {
        var _a, _b;
        return {
            id: this.id,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            content: this.content,
            seen: this.seen,
            senderType: this.senderType,
            candidateId: this.candidateId,
            senderId: this.senderId,
            candidate: (_a = this.candidate) === null || _a === void 0 ? void 0 : _a.toDto(),
            sender: (_b = this.sender) === null || _b === void 0 ? void 0 : _b.toDto(),
            archived: this.archived,
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.content = dto.content;
        this.senderType = dto.senderType;
        this.candidateId = dto.candidateId;
        this.senderId = dto.senderId;
        this.archived = dto.archived;
        if (!this.id) {
            this.id = undefined;
        }
    }
};
__decorate([
    (0, typeorm_1.Column)('text', { name: 'content', nullable: false }),
    __metadata("design:type", String)
], CandidateMessage.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'candidateId', nullable: false, length: 36 }),
    __metadata("design:type", String)
], CandidateMessage.prototype, "candidateId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => candidate_entity_1.Candidate, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'candidateId' }),
    __metadata("design:type", candidate_entity_1.Candidate)
], CandidateMessage.prototype, "candidate", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'senderId', nullable: false, length: 36 }),
    __metadata("design:type", String)
], CandidateMessage.prototype, "senderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'senderId' }),
    __metadata("design:type", user_entity_1.User)
], CandidateMessage.prototype, "sender", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'seen', nullable: false, default: 0 }),
    __metadata("design:type", Boolean)
], CandidateMessage.prototype, "seen", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'senderType', nullable: false }),
    __metadata("design:type", String)
], CandidateMessage.prototype, "senderType", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'archived', nullable: false, default: false }),
    __metadata("design:type", Boolean)
], CandidateMessage.prototype, "archived", void 0);
CandidateMessage = __decorate([
    (0, typeorm_1.Entity)({ name: 'candidate-messages' })
], CandidateMessage);
exports.CandidateMessage = CandidateMessage;
//# sourceMappingURL=candidate-message.entity.js.map