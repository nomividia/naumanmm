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
exports.AppImage = void 0;
const typeorm_1 = require("typeorm");
const base_file_entity_1 = require("./base-file.entity");
let AppImage = class AppImage extends base_file_entity_1.BaseFile {
    toDto() {
        return {
            id: this.id,
            mimeType: this.mimeType,
            name: this.name,
            physicalName: this.physicalName,
            size: this.size,
            height: this.height,
            width: this.width,
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.mimeType = dto.mimeType;
        this.name = dto.name;
        this.physicalName = dto.physicalName;
        this.size = dto.size;
        this.height = dto.height;
        this.width = dto.width;
        if (!this.id)
            this.id = undefined;
    }
};
__decorate([
    (0, typeorm_1.Column)('float', { name: 'width', nullable: false }),
    __metadata("design:type", Number)
], AppImage.prototype, "width", void 0);
__decorate([
    (0, typeorm_1.Column)('float', { name: 'height', nullable: false }),
    __metadata("design:type", Number)
], AppImage.prototype, "height", void 0);
AppImage = __decorate([
    (0, typeorm_1.Entity)({ name: 'app_images' })
], AppImage);
exports.AppImage = AppImage;
//# sourceMappingURL=app-image.entity.js.map