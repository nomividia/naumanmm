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
exports.UserRole = void 0;
const typeorm_1 = require("typeorm");
const app_right_entity_1 = require("./app-right.entity");
const user_entity_1 = require("./user.entity");
let UserRole = class UserRole {
    toDto() {
        return {
            id: this.id,
            role: this.role,
            label: this.label,
            rights: this.rights
                ? this.rights.map((x) => x.toDto(false))
                : undefined,
            enabled: this.enabled,
        };
    }
    fromDto(dto) {
        this.role = dto.role;
        this.id = dto.id;
        this.label = dto.label;
        this.enabled = dto.enabled;
        if (dto.rights) {
            this.rights = [];
            for (const rightDto of dto.rights) {
                const rightEntity = new app_right_entity_1.AppRight();
                rightEntity.fromDto(rightDto);
                this.rights.push(rightEntity);
            }
        }
        if (!this.id)
            this.id = undefined;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { name: 'id' }),
    __metadata("design:type", Number)
], UserRole.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'role', length: 30, unique: true }),
    __metadata("design:type", String)
], UserRole.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'label', length: 150, nullable: true }),
    __metadata("design:type", String)
], UserRole.prototype, "label", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'enabled', nullable: false, default: 1 }),
    __metadata("design:type", Boolean)
], UserRole.prototype, "enabled", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User, (user) => user.roles),
    (0, typeorm_1.JoinTable)({ name: 'user_roles' }),
    __metadata("design:type", Array)
], UserRole.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => app_right_entity_1.AppRight, (right) => right.roles, { cascade: true }),
    (0, typeorm_1.JoinTable)({ name: 'roles_rights' }),
    __metadata("design:type", Array)
], UserRole.prototype, "rights", void 0);
UserRole = __decorate([
    (0, typeorm_1.Entity)({ name: 'roles' })
], UserRole);
exports.UserRole = UserRole;
//# sourceMappingURL=user-role.entity.js.map