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
exports.NoteItemFile = void 0;
const typeorm_1 = require("typeorm");
const app_file_entity_1 = require("./app-file.entity");
const base_entity_1 = require("./base-entity");
const note_item_entity_1 = require("./note-item.entity");
let NoteItemFile = class NoteItemFile extends base_entity_1.AppBaseEntity {
    toDto() {
        var _a;
        return {
            id: this.id,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            noteItemId: this.noteItemId,
            fileId: this.fileId,
            file: (_a = this.file) === null || _a === void 0 ? void 0 : _a.toDto(),
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.noteItemId = dto.noteItemId;
        this.fileId = dto.fileId;
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
], NoteItemFile.prototype, "fileId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_file_entity_1.AppFile, { cascade: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'fileId' }),
    __metadata("design:type", app_file_entity_1.AppFile)
], NoteItemFile.prototype, "file", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'noteItemId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], NoteItemFile.prototype, "noteItemId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => note_item_entity_1.NoteItem, (noteItem) => noteItem.files, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'noteItemId' }),
    __metadata("design:type", note_item_entity_1.NoteItem)
], NoteItemFile.prototype, "noteItem", void 0);
NoteItemFile = __decorate([
    (0, typeorm_1.Entity)({ name: 'note-item-files' })
], NoteItemFile);
exports.NoteItemFile = NoteItemFile;
//# sourceMappingURL=note-item-file.entity.js.map