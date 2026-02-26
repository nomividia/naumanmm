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
exports.AppNotification = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base-entity");
const user_entity_1 = require("./user.entity");
let AppNotification = class AppNotification extends base_entity_1.AppBaseEntity {
    toDto() {
        return {
            id: this.id,
            creationDate: this.creationDate,
            seen: this.seen,
            title: this.title,
            userId: this.userId,
            url: this.url,
        };
    }
    fromDto(dto) { }
};
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.appNotifications, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], AppNotification.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'userId', length: 36, nullable: false }),
    __metadata("design:type", String)
], AppNotification.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'title', nullable: false, length: 400 }),
    __metadata("design:type", String)
], AppNotification.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('bool', { name: 'seen', nullable: false, default: 0 }),
    __metadata("design:type", Boolean)
], AppNotification.prototype, "seen", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'url', nullable: true }),
    __metadata("design:type", String)
], AppNotification.prototype, "url", void 0);
AppNotification = __decorate([
    (0, typeorm_1.Entity)({ name: 'notifications' })
], AppNotification);
exports.AppNotification = AppNotification;
//# sourceMappingURL=notification.entity.js.map