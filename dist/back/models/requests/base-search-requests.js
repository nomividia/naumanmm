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
exports.BaseSearchRequest = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_linq_repository_1 = require("typeorm-linq-repository");
class BaseSearchRequest {
    static getDefaultFindOptions(request, orderbyExcepts = []) {
        if (!request)
            request = {};
        if (!request.start || typeof request.start === 'object')
            request.start = 0;
        if (!request.length || typeof request.length === 'object')
            request.length = 1000;
        let orderObject;
        if (request.order && request.orderby) {
            orderObject = {};
            if (!orderbyExcepts ||
                orderbyExcepts.indexOf(request.orderby) === -1)
                orderObject[request.orderby] = request.order.toUpperCase();
        }
        return {
            take: request.length,
            skip: request.start,
            order: orderObject,
        };
    }
    static getLinqOrderByMethod(orderby, order, query) {
        let method;
        switch (orderby) {
            case 'id':
                method = (x) => x.id;
                break;
            case 'date':
                method = (x) => x.date;
                break;
            case 'typeId':
                method = (x) => x.typeId;
                break;
            case 'userId':
                method = (x) => x.userId;
                break;
            case 'creationDate':
                method = (x) => x.creationDate;
                break;
            case 'modifDate':
                method = (x) => x.modifDate;
                break;
            case 'order':
                method = (x) => x.order;
                break;
            case 'key':
                method = (x) => x.key;
                break;
            case 'meta':
                method = (x) => x.meta;
                break;
        }
        if (order === 'ASC')
            return query.orderBy(method);
        else
            return query.orderByDescending(method);
    }
    static getDefaultFindOptionsLinq(request, entityType) {
        if (!request)
            request = {};
        if (!request.start || typeof request.start === 'object')
            request.start = 0;
        if (!request.length || typeof request.length === 'object')
            request.length = 1000;
        const query = new typeorm_linq_repository_1.LinqRepository(entityType)
            .getAll()
            .skip(request.start)
            .take(request.length);
        if (request.orderby)
            return this.getLinqOrderByMethod(request.orderby, request.order.toUpperCase(), query);
        else
            return query;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The start of the request',
        required: false,
        type: Number,
    }),
    __metadata("design:type", Number)
], BaseSearchRequest.prototype, "start", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The length of the request',
        required: false,
        type: Number,
    }),
    __metadata("design:type", Number)
], BaseSearchRequest.prototype, "length", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'order by field',
        required: false,
        type: String,
    }),
    __metadata("design:type", String)
], BaseSearchRequest.prototype, "orderby", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'order direction (asc | desc)',
        required: false,
        type: String,
    }),
    __metadata("design:type", String)
], BaseSearchRequest.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search',
        required: false,
        type: String,
    }),
    __metadata("design:type", String)
], BaseSearchRequest.prototype, "search", void 0);
exports.BaseSearchRequest = BaseSearchRequest;
//# sourceMappingURL=base-search-requests.js.map