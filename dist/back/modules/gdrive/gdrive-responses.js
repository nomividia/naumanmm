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
exports.GetGDriveFileResponse = exports.GetGDriveFilesResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
const generic_response_1 = require("../../models/responses/generic-response");
class GDriveFileClass {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], GDriveFileClass.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => GDriveFileClass, isArray: true }),
    __metadata("design:type", Array)
], GDriveFileClass.prototype, "children", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GDriveFileClass.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GDriveFileClass.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, isArray: true }),
    __metadata("design:type", Array)
], GDriveFileClass.prototype, "parents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GDriveFileClass.prototype, "modifiedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GDriveFileClass.prototype, "fileExtension", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GDriveFileClass.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GDriveFileClass.prototype, "ownedByMe", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GDriveFileClass.prototype, "shared", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GDriveFileClass.prototype, "driveId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GDriveFileClass.prototype, "createdTime", void 0);
class GetGDriveFilesResponse extends generic_response_1.GenericResponse {
    constructor() {
        super(...arguments);
        this.files = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => GDriveFileClass, isArray: true }),
    __metadata("design:type", Array)
], GetGDriveFilesResponse.prototype, "files", void 0);
exports.GetGDriveFilesResponse = GetGDriveFilesResponse;
class GetGDriveFileResponse extends generic_response_1.GenericResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => GDriveFileClass }),
    __metadata("design:type", Object)
], GetGDriveFileResponse.prototype, "file", void 0);
exports.GetGDriveFileResponse = GetGDriveFileResponse;
//# sourceMappingURL=gdrive-responses.js.map