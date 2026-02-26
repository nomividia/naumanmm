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
exports.GetFilesResponse = exports.GetFileResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
const app_file_dto_1 = require("../dto/app-file-dto");
const base_search_responses_1 = require("./base-search-responses");
const generic_response_1 = require("./generic-response");
class GetFileResponse extends generic_response_1.GenericResponse {
    constructor() {
        super(...arguments);
        this.file = null;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", app_file_dto_1.AppFileDto)
], GetFileResponse.prototype, "file", void 0);
exports.GetFileResponse = GetFileResponse;
class GetFilesResponse extends base_search_responses_1.BaseSearchResponse {
    constructor() {
        super(...arguments);
        this.files = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => app_file_dto_1.AppFileDto, isArray: true }),
    __metadata("design:type", Array)
], GetFilesResponse.prototype, "files", void 0);
exports.GetFilesResponse = GetFilesResponse;
//# sourceMappingURL=file-responses.js.map