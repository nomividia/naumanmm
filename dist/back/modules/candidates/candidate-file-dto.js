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
exports.GetCandidatesFilesResponse = exports.GetCandidateFileResponse = exports.CandidateFileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const app_file_dto_1 = require("../../models/dto/app-file-dto");
const app_value_dto_1 = require("../../models/dto/app-value-dto");
const base_search_responses_1 = require("../../models/responses/base-search-responses");
const generic_response_1 = require("../../models/responses/generic-response");
const candidate_dto_1 = require("./candidate-dto");
class CandidateFileDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateFileDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], CandidateFileDto.prototype, "creationDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], CandidateFileDto.prototype, "modifDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateFileDto.prototype, "fileId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => app_file_dto_1.AppFileDto }),
    __metadata("design:type", app_file_dto_1.AppFileDto)
], CandidateFileDto.prototype, "file", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateFileDto.prototype, "candidateId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => candidate_dto_1.CandidateDto }),
    __metadata("design:type", candidate_dto_1.CandidateDto)
], CandidateFileDto.prototype, "candidate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: app_value_dto_1.AppValueDto }),
    __metadata("design:type", app_value_dto_1.AppValueDto)
], CandidateFileDto.prototype, "fileType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], CandidateFileDto.prototype, "fileTypeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], CandidateFileDto.prototype, "isMandatory", void 0);
exports.CandidateFileDto = CandidateFileDto;
class GetCandidateFileResponse extends generic_response_1.GenericResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => candidate_dto_1.CandidateDto }),
    __metadata("design:type", CandidateFileDto)
], GetCandidateFileResponse.prototype, "candidateFile", void 0);
exports.GetCandidateFileResponse = GetCandidateFileResponse;
class GetCandidatesFilesResponse extends base_search_responses_1.BaseSearchResponse {
    constructor() {
        super(...arguments);
        this.candidatesFiles = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => CandidateFileDto, isArray: true }),
    __metadata("design:type", Array)
], GetCandidatesFilesResponse.prototype, "candidatesFiles", void 0);
exports.GetCandidatesFilesResponse = GetCandidatesFilesResponse;
//# sourceMappingURL=candidate-file-dto.js.map