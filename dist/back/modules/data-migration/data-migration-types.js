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
exports.DataMigrationCandidateApplicationResponse = exports.DataMigrationResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
const generic_response_1 = require("../../models/responses/generic-response");
class DataMigrationResponse extends generic_response_1.GenericResponse {
    constructor() {
        super(...arguments);
        this.successList = [];
        this.errorsList = [];
        this.ignoredList = [];
        this.attachmentsIgnored = [];
        this.attachmentsErrors = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], DataMigrationResponse.prototype, "successList", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], DataMigrationResponse.prototype, "errorsList", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], DataMigrationResponse.prototype, "ignoredList", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], DataMigrationResponse.prototype, "attachmentsIgnored", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], DataMigrationResponse.prototype, "attachmentsErrors", void 0);
exports.DataMigrationResponse = DataMigrationResponse;
class DataMigrationCandidateApplicationResponse extends generic_response_1.GenericResponse {
    constructor() {
        super(...arguments);
        this.successList = [];
        this.successListCount = 0;
        this.linesPerFile = [];
        this.totalLinesRead = 0;
        this.errorsList = [];
        this.ignoredList = [];
        this.bytesIgnored = 0;
        this.bytesAdded = 0;
    }
    get megaBytesAdded() {
        return this.getMegaBytes(this.bytesAdded);
    }
    get megaBytesIgnored() {
        return this.getMegaBytes(this.bytesIgnored);
    }
    getMegaBytes(bytes) {
        return bytes / 1024 / 1024;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], DataMigrationCandidateApplicationResponse.prototype, "successList", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], DataMigrationCandidateApplicationResponse.prototype, "successListCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], DataMigrationCandidateApplicationResponse.prototype, "linesPerFile", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], DataMigrationCandidateApplicationResponse.prototype, "totalLinesRead", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], DataMigrationCandidateApplicationResponse.prototype, "errorsList", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], DataMigrationCandidateApplicationResponse.prototype, "ignoredList", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], DataMigrationCandidateApplicationResponse.prototype, "bytesIgnored", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], DataMigrationCandidateApplicationResponse.prototype, "bytesAdded", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], DataMigrationCandidateApplicationResponse.prototype, "megaBytesAdded", null);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], DataMigrationCandidateApplicationResponse.prototype, "megaBytesIgnored", null);
exports.DataMigrationCandidateApplicationResponse = DataMigrationCandidateApplicationResponse;
//# sourceMappingURL=data-migration-types.js.map