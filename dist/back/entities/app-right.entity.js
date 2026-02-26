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
exports.AppRight = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base-entity");
const user_role_entity_1 = require("./user-role.entity");
let AppRight = class AppRight extends base_entity_1.AppBaseEntity {
    toDto(getRoles) {
        return {
            id: this.id,
            code: this.code,
            label: this.label,
            roles: this.roles && getRoles
                ? this.roles.map((x) => x.toDto())
                : undefined,
            order: this.order,
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.code = dto.code;
        this.label = dto.label;
        this.order = dto.order;
        if (!this.id)
            this.id = undefined;
    }
};
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'code',
        length: 60,
        unique: true,
        nullable: false,
    }),
    __metadata("design:type", String)
], AppRight.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'label',
        length: 200,
        unique: false,
        nullable: true,
    }),
    __metadata("design:type", String)
], AppRight.prototype, "label", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_role_entity_1.UserRole, (role) => role.rights),
    __metadata("design:type", Array)
], AppRight.prototype, "roles", void 0);
__decorate([
    (0, typeorm_1.Column)('float', { name: 'order', nullable: true }),
    __metadata("design:type", Number)
], AppRight.prototype, "order", void 0);
AppRight = __decorate([
    (0, typeorm_1.Entity)({ name: 'app_rights' })
], AppRight);
exports.AppRight = AppRight;
//# sourceMappingURL=app-right.entity.js.map