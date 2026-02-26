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
exports.CandidateJobDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const candidate_job_status_type_1 = require("../../../shared/types/candidate-job-status.type");
const candidate_job_type_1 = require("../../../shared/types/candidate-job-type");
const app_value_dto_1 = require("../../models/dto/app-value-dto");
const job_reference_dto_1 = require("../job-references/job-reference-dto");
const candidate_dto_1 = require("./candidate-dto");
class CandidateJobDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateJobDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], CandidateJobDto.prototype, "creationDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], CandidateJobDto.prototype, "modifDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateJobDto.prototype, "candidateId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => candidate_dto_1.CandidateDto }),
    __metadata("design:type", candidate_dto_1.CandidateDto)
], CandidateJobDto.prototype, "candidate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateJobDto.prototype, "candidateResumeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => app_value_dto_1.AppValueDto }),
    __metadata("design:type", app_value_dto_1.AppValueDto)
], CandidateJobDto.prototype, "job", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateJobDto.prototype, "jobId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], CandidateJobDto.prototype, "experienceStartDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], CandidateJobDto.prototype, "experienceEndDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], CandidateJobDto.prototype, "showMonthInResume", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateJobDto.prototype, "postTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateJobDto.prototype, "postDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateJobDto.prototype, "postResponsability", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateJobDto.prototype, "employer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], CandidateJobDto.prototype, "inActivity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateJobDto.prototype, "leavingReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => job_reference_dto_1.JobReferenceDto }),
    __metadata("design:type", job_reference_dto_1.JobReferenceDto)
], CandidateJobDto.prototype, "jobReference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateJobDto.prototype, "jobReferenceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateJobDto.prototype, "employerProfileId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => app_value_dto_1.AppValueDto }),
    __metadata("design:type", app_value_dto_1.AppValueDto)
], CandidateJobDto.prototype, "employerProfile", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateJobDto.prototype, "jobName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateJobDto.prototype, "jobDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: candidate_job_status_type_1.CandidateJobStatus }),
    __metadata("design:type", String)
], CandidateJobDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: candidate_job_type_1.CandidateJobType }),
    __metadata("design:type", String)
], CandidateJobDto.prototype, "type", void 0);
exports.CandidateJobDto = CandidateJobDto;
//# sourceMappingURL=candidate-jobs.dto.js.map