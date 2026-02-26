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
exports.KeyValue = void 0;
const typeorm_1 = require("typeorm");
let KeyValue = class KeyValue {
    toDto() {
        return {
            id: this.id,
            key: this.key,
            value: this.value,
            frontEditable: this.frontEditable,
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.key = dto.key;
        this.value = dto.value;
        this.frontEditable = dto.frontEditable;
        if (!this.id) {
            this.id = undefined;
        }
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'id' }),
    __metadata("design:type", String)
], KeyValue.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'key',
        nullable: false,
        length: 250,
        unique: true,
    }),
    __metadata("design:type", String)
], KeyValue.prototype, "key", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'value', nullable: true }),
    __metadata("design:type", String)
], KeyValue.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)('bool', { name: 'front-editable', nullable: false, default: true }),
    __metadata("design:type", Boolean)
], KeyValue.prototype, "frontEditable", void 0);
KeyValue = __decorate([
    (0, typeorm_1.Entity)({ name: 'key_values' })
], KeyValue);
exports.KeyValue = KeyValue;
//# sourceMappingURL=key-value.entity.js.map