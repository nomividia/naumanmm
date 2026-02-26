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
exports.AppLanguage = void 0;
const typeorm_1 = require("typeorm");
let AppLanguage = class AppLanguage {
    toDto() {
        return {
            id: this.id,
            label: this.label,
            code: this.code,
            icon: this.icon,
        };
    }
    fromDto(dto) {
        this.code = dto.code;
        this.label = dto.label;
        this.icon = dto.icon;
        this.id = dto.id;
        if (!this.id)
            this.id = undefined;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'id' }),
    __metadata("design:type", String)
], AppLanguage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'code',
        nullable: false,
        length: 40,
        unique: true,
    }),
    __metadata("design:type", String)
], AppLanguage.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'label', nullable: false }),
    __metadata("design:type", String)
], AppLanguage.prototype, "label", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'icon', nullable: false }),
    __metadata("design:type", String)
], AppLanguage.prototype, "icon", void 0);
AppLanguage = __decorate([
    (0, typeorm_1.Entity)({ name: 'app_languages' })
], AppLanguage);
exports.AppLanguage = AppLanguage;
//# sourceMappingURL=app-language.entity.js.map