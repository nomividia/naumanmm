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
exports.Customer = void 0;
const typeorm_1 = require("typeorm");
const address_entity_1 = require("../../entities/address.entity");
const app_value_entity_1 = require("../../entities/app-value.entity");
const base_entity_1 = require("../../entities/base-entity");
let Customer = class Customer extends base_entity_1.AppBaseEntity {
    toDto() {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            addresses: this.addresses
                ? this.addresses.map((x) => x.toDto())
                : undefined,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            phone: this.phone,
            dateOfContact: this.dateOfContact,
            companyName: this.companyName,
            isCompany: this.isCompany,
            isPrivatePerson: this.isPrivatePerson,
            disabled: this.disabled,
            customerFunctionId: this.customerFunctionId,
            contactFullName: this.contactFullName,
            customerFunction: this.customerFunction
                ? this.customerFunction.toDto()
                : undefined,
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.firstName = dto.firstName;
        this.lastName = dto.lastName;
        this.email = dto.email;
        this.phone = dto.phone;
        this.dateOfContact = dto.dateOfContact;
        this.isCompany = dto.isCompany;
        this.isPrivatePerson = dto.isPrivatePerson;
        this.companyName = dto.companyName;
        this.disabled = dto.disabled;
        this.customerFunctionId = dto.customerFunctionId;
        this.contactFullName = dto.contactFullName;
        if (dto.addresses) {
            this.addresses = [];
            for (const address of dto.addresses) {
                const addrEntity = new address_entity_1.Address();
                addrEntity.fromDto(address);
                this.addresses.push(addrEntity);
            }
        }
        if (!dto.id) {
            this.id = undefined;
        }
    }
};
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'firstName', length: 40, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'lastName', length: 40, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'email', length: 40, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'phone', length: 40, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => address_entity_1.Address, (addresses) => addresses.customer, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Customer.prototype, "addresses", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dateOfContact', nullable: true, type: 'datetime' }),
    __metadata("design:type", Date)
], Customer.prototype, "dateOfContact", void 0);
__decorate([
    (0, typeorm_1.Column)('bool', {
        name: 'isPrivatePerson',
        nullable: false,
        default: false,
    }),
    __metadata("design:type", Boolean)
], Customer.prototype, "isPrivatePerson", void 0);
__decorate([
    (0, typeorm_1.Column)('bool', { name: 'isCompany', nullable: false, default: true }),
    __metadata("design:type", Boolean)
], Customer.prototype, "isCompany", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'companyName', length: 200, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "companyName", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'customerFunctionId',
        length: 50,
        nullable: true,
    }),
    __metadata("design:type", String)
], Customer.prototype, "customerFunctionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_value_entity_1.AppValue),
    (0, typeorm_1.JoinColumn)({ name: 'customerFunctionId' }),
    __metadata("design:type", app_value_entity_1.AppValue)
], Customer.prototype, "customerFunction", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'contactFullName', length: 100, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "contactFullName", void 0);
Customer = __decorate([
    (0, typeorm_1.Entity)({ name: 'customer' })
], Customer);
exports.Customer = Customer;
//# sourceMappingURL=customer.entity.js.map