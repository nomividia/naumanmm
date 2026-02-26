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
exports.GetUserRolesResponse = exports.GetUserRoleResponse = exports.UserRoleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_search_responses_1 = require("../responses/base-search-responses");
const generic_response_1 = require("../responses/generic-response");
const app_right_dto_1 = require("./app-right-dto");
class UserRoleDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], UserRoleDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserRoleDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => app_right_dto_1.AppRightDto, isArray: true }),
    __metadata("design:type", Array)
], UserRoleDto.prototype, "rights", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], UserRoleDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], UserRoleDto.prototype, "enabled", void 0);
exports.UserRoleDto = UserRoleDto;
class GetUserRoleResponse extends generic_response_1.GenericResponse {
    constructor() {
        super(...arguments);
        this.userRole = null;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => UserRoleDto }),
    __metadata("design:type", UserRoleDto)
], GetUserRoleResponse.prototype, "userRole", void 0);
exports.GetUserRoleResponse = GetUserRoleResponse;
class GetUserRolesResponse extends base_search_responses_1.BaseSearchResponse {
    constructor() {
        super(...arguments);
        this.userRoles = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => UserRoleDto, isArray: true }),
    __metadata("design:type", Array)
], GetUserRolesResponse.prototype, "userRoles", void 0);
exports.GetUserRolesResponse = GetUserRolesResponse;
//# sourceMappingURL=user-role-dto.js.map