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
exports.AppType = void 0;
const typeorm_1 = require("typeorm");
const app_value_entity_1 = require("./app-value.entity");
const translation_entity_1 = require("./translation.entity");
let AppType = class AppType {
    toDto() {
        return {
            id: this.id,
            label: this.label,
            code: this.code,
            appValues: this.appValues
                ? this.appValues.map((x) => x.toDto())
                : [],
            translations: this.translations
                ? this.translations.map((x) => x.toDto())
                : undefined,
        };
    }
    fromDto(dto, mapAppValues) {
        var _a;
        this.code = dto.code;
        this.label = dto.label;
        this.id = dto.id;
        if (mapAppValues && ((_a = dto.appValues) === null || _a === void 0 ? void 0 : _a.length)) {
            this.appValues = [];
            for (const appValueDto of dto.appValues) {
                const appValue = new app_value_entity_1.AppValue();
                appValue.fromDto(appValueDto);
                this.appValues.push(appValue);
            }
        }
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
], AppType.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'label', nullable: false }),
    __metadata("design:type", String)
], AppType.prototype, "label", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'code',
        length: 100,
        nullable: false,
        unique: true,
    }),
    __metadata("design:type", String)
], AppType.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => app_value_entity_1.AppValue, (appValue) => appValue.appType, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], AppType.prototype, "appValues", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => translation_entity_1.Translation, (translation) => translation.appType, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], AppType.prototype, "translations", void 0);
AppType = __decorate([
    (0, typeorm_1.Entity)({ name: 'app_types' })
], AppType);
exports.AppType = AppType;
//# sourceMappingURL=app-type.entity.js.map