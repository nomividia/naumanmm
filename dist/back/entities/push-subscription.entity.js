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
exports.AppPushSubscription = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let AppPushSubscription = class AppPushSubscription {
    toDto() {
        return {
            userId: this.userId,
            endpoint: this.endpoint,
            keys: {
                auth: this.auth,
                p256dh: this.p256dh,
            },
            options: this.options ? JSON.parse(this.options) : '',
        };
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'id' }),
    __metadata("design:type", String)
], AppPushSubscription.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.pushSubscriptions, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], AppPushSubscription.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'userId', length: 36, nullable: false }),
    __metadata("design:type", String)
], AppPushSubscription.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'endpoint', length: 400, nullable: false }),
    __metadata("design:type", String)
], AppPushSubscription.prototype, "endpoint", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'options', length: 400, nullable: true }),
    __metadata("design:type", String)
], AppPushSubscription.prototype, "options", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'auth', length: 255, nullable: false }),
    __metadata("design:type", String)
], AppPushSubscription.prototype, "auth", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'p256dh', length: 255, nullable: false }),
    __metadata("design:type", String)
], AppPushSubscription.prototype, "p256dh", void 0);
AppPushSubscription = __decorate([
    (0, typeorm_1.Entity)({ name: 'user_push_subscriptions' })
], AppPushSubscription);
exports.AppPushSubscription = AppPushSubscription;
//# sourceMappingURL=push-subscription.entity.js.map