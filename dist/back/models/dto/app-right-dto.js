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
exports.GetAppRightsResponse = exports.GetAppRightResponse = exports.AppRightDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_search_responses_1 = require("../responses/base-search-responses");
const generic_response_1 = require("../responses/generic-response");
const user_role_dto_1 = require("./user-role-dto");
class AppRightDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], AppRightDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AppRightDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], AppRightDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => user_role_dto_1.UserRoleDto, isArray: true }),
    __metadata("design:type", Array)
], AppRightDto.prototype, "roles", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], AppRightDto.prototype, "order", void 0);
exports.AppRightDto = AppRightDto;
class GetAppRightResponse extends generic_response_1.GenericResponse {
    constructor() {
        super(...arguments);
        this.appRight = null;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => AppRightDto }),
    __metadata("design:type", AppRightDto)
], GetAppRightResponse.prototype, "appRight", void 0);
exports.GetAppRightResponse = GetAppRightResponse;
class GetAppRightsResponse extends base_search_responses_1.BaseSearchResponse {
    constructor() {
        super(...arguments);
        this.appRights = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => AppRightDto, isArray: true }),
    __metadata("design:type", Array)
], GetAppRightsResponse.prototype, "appRights", void 0);
exports.GetAppRightsResponse = GetAppRightsResponse;
//# sourceMappingURL=app-right-dto.js.map