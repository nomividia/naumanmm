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
exports.AppValue = void 0;
const typeorm_1 = require("typeorm");
const app_type_entity_1 = require("./app-type.entity");
const translation_entity_1 = require("./translation.entity");
let AppValue = class AppValue {
    toDto() {
        return {
            id: this.id,
            label: this.label,
            order: this.order,
            code: this.code,
            appTypeId: this.appTypeId,
            enabled: this.enabled,
            appType: this.appType ? this.appType.toDto() : null,
            translations: this.translations
                ? this.translations.map((x) => x.toDto())
                : undefined,
        };
    }
    fromDto(dto) {
        this.label = dto.label;
        this.order = dto.order;
        this.appTypeId = dto.appTypeId;
        this.code = dto.code;
        this.id = dto.id;
        this.enabled = dto.enabled;
        if (dto.translations) {
            this.translations = [];
            dto.translations.forEach((translationDto) => {
                const translation = new translation_entity_1.Translation();
                translation.fromDto(translationDto);
                this.translations.push(translation);
            });
        }
        if (!this.id)
            this.id = undefined;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'id' }),
    __metadata("design:type", String)
], AppValue.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'label', nullable: false }),
    __metadata("design:type", String)
], AppValue.prototype, "label", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'order', nullable: true }),
    __metadata("design:type", Number)
], AppValue.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'enabled', nullable: false, default: 1 }),
    __metadata("design:type", Boolean)
], AppValue.prototype, "enabled", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'code',
        nullable: false,
        length: 100,
        unique: true,
    }),
    __metadata("design:type", String)
], AppValue.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_type_entity_1.AppType, (appType) => appType.appValues, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'appTypeId' }),
    __metadata("design:type", app_type_entity_1.AppType)
], AppValue.prototype, "appType", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'appTypeId', length: 36, nullable: false }),
    __metadata("design:type", String)
], AppValue.prototype, "appTypeId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => translation_entity_1.Translation, (translation) => translation.appValue, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], AppValue.prototype, "translations", void 0);
AppValue = __decorate([
    (0, typeorm_1.Entity)({ name: 'app_values' })
], AppValue);
exports.AppValue = AppValue;
//# sourceMappingURL=app-value.entity.js.map