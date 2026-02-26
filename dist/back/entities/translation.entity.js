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
exports.Translation = void 0;
const typeorm_1 = require("typeorm");
const app_language_entity_1 = require("./app-language.entity");
const app_type_entity_1 = require("./app-type.entity");
const app_value_entity_1 = require("./app-value.entity");
const user_entity_1 = require("./user.entity");
let Translation = class Translation {
    toDto() {
        return {
            id: this.id,
            userId: this.userId,
            entityField: this.entityField,
            value: this.value,
            languageId: this.languageId,
            language: this.language ? this.language.toDto() : null,
            appValueId: this.appValueId,
            appTypeId: this.appTypeId,
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.entityField = dto.entityField;
        this.value = dto.value;
        this.languageId = dto.languageId;
        this.userId = dto.userId;
        this.appValueId = dto.appValueId;
        this.appTypeId = dto.appTypeId;
        if (!this.id)
            this.id = undefined;
        if (!this.appTypeId)
            delete this.appTypeId;
        if (!this.appValueId)
            delete this.appValueId;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'id' }),
    __metadata("design:type", String)
], Translation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'entityField', length: 50, nullable: false }),
    __metadata("design:type", String)
], Translation.prototype, "entityField", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_language_entity_1.AppLanguage),
    (0, typeorm_1.JoinColumn)({ name: 'languageId' }),
    __metadata("design:type", app_language_entity_1.AppLanguage)
], Translation.prototype, "language", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'languageId', length: 36, nullable: false }),
    __metadata("design:type", String)
], Translation.prototype, "languageId", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'value', nullable: false }),
    __metadata("design:type", String)
], Translation.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.translations, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Translation.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'userId', length: 36, nullable: true }),
    __metadata("design:type", String)
], Translation.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_value_entity_1.AppValue, (appValue) => appValue.translations, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'appValueId' }),
    __metadata("design:type", app_value_entity_1.AppValue)
], Translation.prototype, "appValue", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'appValueId', length: 36, nullable: true }),
    __metadata("design:type", String)
], Translation.prototype, "appValueId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_type_entity_1.AppType, (appType) => appType.translations, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'appTypeId' }),
    __metadata("design:type", app_type_entity_1.AppType)
], Translation.prototype, "appType", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'appTypeId', length: 36, nullable: true }),
    __metadata("design:type", String)
], Translation.prototype, "appTypeId", void 0);
Translation = __decorate([
    (0, typeorm_1.Entity)({ name: 'translations' })
], Translation);
exports.Translation = Translation;
//# sourceMappingURL=translation.entity.js.map