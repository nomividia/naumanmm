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
exports.GetUserRolesRequest = exports.FindUsersRequest = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_search_requests_1 = require("./base-search-requests");
class FindUsersRequest extends base_search_requests_1.BaseSearchRequest {
    constructor() {
        super(...arguments);
        this.includeDisabled = 'false';
        this.includeCandidate = 'false';
        this.includeGender = 'false';
        this.includeImage = 'false';
        this.includeRoles = 'false';
    }
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Roles separated by comma' }),
    __metadata("design:type", String)
], FindUsersRequest.prototype, "roles", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'Include disabled users',
    }),
    __metadata("design:type", String)
], FindUsersRequest.prototype, "includeDisabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Include candidate' }),
    __metadata("design:type", String)
], FindUsersRequest.prototype, "includeCandidate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Include user gender' }),
    __metadata("design:type", String)
], FindUsersRequest.prototype, "includeGender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Include user image' }),
    __metadata("design:type", String)
], FindUsersRequest.prototype, "includeImage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Include user role' }),
    __metadata("design:type", String)
], FindUsersRequest.prototype, "includeRoles", void 0);
exports.FindUsersRequest = FindUsersRequest;
class GetUserRolesRequest extends base_search_requests_1.BaseSearchRequest {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'Include disabled roles',
    }),
    __metadata("design:type", String)
], GetUserRolesRequest.prototype, "includeDisabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'Include rights in response',
    }),
    __metadata("design:type", String)
], GetUserRolesRequest.prototype, "includeRights", void 0);
exports.GetUserRolesRequest = GetUserRolesRequest;
//# sourceMappingURL=user-requests.js.map