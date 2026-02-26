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
exports.ActivityLog = void 0;
const typeorm_1 = require("typeorm");
const app_value_entity_1 = require("../../entities/app-value.entity");
const user_entity_1 = require("../../entities/user.entity");
let ActivityLog = class ActivityLog {
    toDto() {
        return {
            id: this.id,
            date: this.date,
            typeId: this.typeId,
            userId: this.userId,
            user: this.user ? this.user.toDto() : undefined,
            type: this.type ? this.type.toDto() : undefined,
            meta: this.meta,
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.date = dto.date;
        this.typeId = dto.typeId;
        this.userId = dto.userId;
        this.meta = dto.meta;
        if (!this.id)
            this.id = undefined;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'id' }),
    __metadata("design:type", String)
], ActivityLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], ActivityLog.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'userId', length: 36, nullable: false }),
    __metadata("design:type", String)
], ActivityLog.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_value_entity_1.AppValue),
    (0, typeorm_1.JoinColumn)({ name: 'typeId' }),
    __metadata("design:type", app_value_entity_1.AppValue)
], ActivityLog.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'typeId', length: 36, nullable: false }),
    __metadata("design:type", String)
], ActivityLog.prototype, "typeId", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { name: 'date', nullable: false }),
    __metadata("design:type", Date)
], ActivityLog.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'meta', nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "meta", void 0);
ActivityLog = __decorate([
    (0, typeorm_1.Entity)({ name: 'activity_logs' })
], ActivityLog);
exports.ActivityLog = ActivityLog;
//# sourceMappingURL=activity-log.entity.js.map