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
exports.GetKeyValuesRequest = exports.GetKeyValuesResponse = exports.GetKeyValueResponse = exports.KeyValueDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_search_requests_1 = require("../../models/requests/base-search-requests");
const base_search_responses_1 = require("../../models/responses/base-search-responses");
const generic_response_1 = require("../../models/responses/generic-response");
class KeyValueDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], KeyValueDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], KeyValueDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], KeyValueDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], KeyValueDto.prototype, "frontEditable", void 0);
exports.KeyValueDto = KeyValueDto;
class GetKeyValueResponse extends generic_response_1.GenericResponse {
    constructor() {
        super(...arguments);
        this.keyValue = null;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => KeyValueDto }),
    __metadata("design:type", KeyValueDto)
], GetKeyValueResponse.prototype, "keyValue", void 0);
exports.GetKeyValueResponse = GetKeyValueResponse;
class GetKeyValuesResponse extends base_search_responses_1.BaseSearchResponse {
    constructor() {
        super(...arguments);
        this.keyValues = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => KeyValueDto, isArray: true }),
    __metadata("design:type", Array)
], GetKeyValuesResponse.prototype, "keyValues", void 0);
exports.GetKeyValuesResponse = GetKeyValuesResponse;
class GetKeyValuesRequest extends base_search_requests_1.BaseSearchRequest {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], GetKeyValuesRequest.prototype, "keys", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], GetKeyValuesRequest.prototype, "onlyFrontEditable", void 0);
exports.GetKeyValuesRequest = GetKeyValuesRequest;
//# sourceMappingURL=key-value-dto.js.map