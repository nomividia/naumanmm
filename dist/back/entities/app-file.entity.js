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
exports.AppFile = void 0;
const typeorm_1 = require("typeorm");
const shared_constants_1 = require("../../shared/shared-constants");
const base_file_entity_1 = require("./base-file.entity");
let AppFile = class AppFile extends base_file_entity_1.BaseFile {
    toDto() {
        return {
            id: this.id,
            mimeType: this.mimeType,
            name: this.name,
            physicalName: this.physicalName,
            size: this.size,
            externalId: this.externalId,
            fileType: this.fileType,
            externalFilePath: this.externalFilePath,
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.mimeType = dto.mimeType;
        this.name = dto.name;
        this.physicalName = dto.physicalName;
        this.size = dto.size;
        this.fileType = dto.fileType;
        this.externalFilePath = dto.externalFilePath;
        this.externalId = dto.externalId;
        if (!this.id)
            this.id = undefined;
    }
};
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'externalId', nullable: true, length: 100 }),
    __metadata("design:type", String)
], AppFile.prototype, "externalId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'fileType', nullable: true, length: 50 }),
    __metadata("design:type", String)
], AppFile.prototype, "fileType", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'externalFilePath', nullable: true }),
    __metadata("design:type", String)
], AppFile.prototype, "externalFilePath", void 0);
AppFile = __decorate([
    (0, typeorm_1.Entity)({ name: 'app_files' })
], AppFile);
exports.AppFile = AppFile;
//# sourceMappingURL=app-file.entity.js.map