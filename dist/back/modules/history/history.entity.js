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
exports.History = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../entities/base-entity");
const user_entity_1 = require("../../entities/user.entity");
let History = class History extends base_entity_1.AppBaseEntity {
    toDto() {
        return {
            id: this.id,
            entity: this.entity,
            entityId: this.entityId,
            field: this.field,
            date: this.date,
            valueAfter: this.valueAfter,
            valueBefore: this.valueBefore,
            userId: this.userId,
            user: this.user ? this.user.toDto() : null,
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.entity = dto.entity;
        this.date = dto.date;
        this.field = dto.field;
        this.valueAfter = dto.valueAfter;
        this.valueBefore = dto.valueBefore;
        this.userId = dto.userId;
        this.entityId = dto.entityId;
    }
};
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'entity', nullable: false, length: 255 }),
    __metadata("design:type", String)
], History.prototype, "entity", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'entityId', nullable: false, length: 36 }),
    __metadata("design:type", String)
], History.prototype, "entityId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'field', nullable: false, length: 255 }),
    __metadata("design:type", String)
], History.prototype, "field", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { name: 'date', nullable: false }),
    __metadata("design:type", Date)
], History.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'valueBefore', nullable: true }),
    __metadata("design:type", String)
], History.prototype, "valueBefore", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'valueAfter', nullable: true }),
    __metadata("design:type", String)
], History.prototype, "valueAfter", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], History.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'userId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], History.prototype, "userId", void 0);
History = __decorate([
    (0, typeorm_1.Entity)({ name: 'history' })
], History);
exports.History = History;
//# sourceMappingURL=history.entity.js.map