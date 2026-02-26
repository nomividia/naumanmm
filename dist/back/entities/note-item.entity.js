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
exports.NoteItem = void 0;
const typeorm_1 = require("typeorm");
const candidate_entity_1 = require("../modules/candidates/candidate.entity");
const base_entity_1 = require("./base-entity");
const note_item_file_entity_1 = require("./note-item-file.entity");
const user_entity_1 = require("./user.entity");
let NoteItem = class NoteItem extends base_entity_1.AppBaseEntity {
    toDto() {
        var _a;
        return {
            id: this.id,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            consultantId: this.consultantId,
            content: this.content,
            candidateId: this.candidateId,
            consultant: this.consultant ? this.consultant.toDto(false) : null,
            candidate: this.candidate ? this.candidate.toDto() : null,
            files: ((_a = this.files) === null || _a === void 0 ? void 0 : _a.map((f) => f.toDto())) || [],
        };
    }
    fromDto(dto) {
        var _a;
        this.id = dto.id;
        this.consultantId = dto.consultantId;
        this.content = dto.content;
        this.candidateId = dto.candidateId;
        if ((_a = dto.files) === null || _a === void 0 ? void 0 : _a.length) {
            this.files = dto.files.map((f) => {
                const file = new note_item_file_entity_1.NoteItemFile();
                file.fromDto(f);
                return file;
            });
        }
        this.modifDate = dto.modifDate;
        if (!dto.id)
            this.id = undefined;
    }
};
__decorate([
    (0, typeorm_1.Column)('text', { name: 'content', nullable: false }),
    __metadata("design:type", String)
], NoteItem.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { cascade: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'consultantId' }),
    __metadata("design:type", user_entity_1.User)
], NoteItem.prototype, "consultant", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'consultantId', length: 36, nullable: true }),
    __metadata("design:type", String)
], NoteItem.prototype, "consultantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => candidate_entity_1.Candidate, (candidate) => candidate.noteItems, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'candidateId' }),
    __metadata("design:type", candidate_entity_1.Candidate)
], NoteItem.prototype, "candidate", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'candidateId', length: 36, nullable: true }),
    __metadata("design:type", String)
], NoteItem.prototype, "candidateId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => note_item_file_entity_1.NoteItemFile, (file) => file.noteItem, { cascade: true }),
    __metadata("design:type", Array)
], NoteItem.prototype, "files", void 0);
NoteItem = __decorate([
    (0, typeorm_1.Entity)({ name: 'note-item' })
], NoteItem);
exports.NoteItem = NoteItem;
//# sourceMappingURL=note-item.entity.js.map