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
exports.CandidateJob = void 0;
const typeorm_1 = require("typeorm");
const candidate_job_status_type_1 = require("../../../shared/types/candidate-job-status.type");
const candidate_job_type_1 = require("../../../shared/types/candidate-job-type");
const app_value_entity_1 = require("../../entities/app-value.entity");
const base_entity_1 = require("../../entities/base-entity");
const job_reference_entity_1 = require("../job-references/job-reference.entity");
const candidate_entity_1 = require("./candidate.entity");
let CandidateJob = class CandidateJob extends base_entity_1.AppBaseEntity {
    normalizeDateForOutput(date) {
        if (!date) {
            return null;
        }
        let year, month, day;
        if (typeof date === 'string') {
            const match = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
            if (match) {
                year = parseInt(match[1], 10);
                month = parseInt(match[2], 10) - 1;
                day = parseInt(match[3], 10);
            }
            else {
                const d = new Date(date);
                year = d.getFullYear();
                month = d.getMonth();
                day = d.getDate();
            }
        }
        else {
            year = date.getFullYear();
            month = date.getMonth();
            day = date.getDate();
        }
        return new Date(Date.UTC(year, month, day, 12, 0, 0));
    }
    toDto() {
        var _a;
        return {
            id: this.id,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            candidateId: this.candidateId,
            jobId: this.jobId,
            job: this.job ? this.job.toDto() : null,
            experienceStartDate: this.normalizeDateForOutput(this.experienceStartDate),
            experienceEndDate: this.normalizeDateForOutput(this.experienceEndDate),
            showMonthInResume: this.showMonthInResume,
            employer: this.employer,
            inActivity: this.inActivity,
            leavingReason: this.leavingReason,
            jobReferenceId: this.jobReferenceId,
            jobReference: this.jobReference ? this.jobReference.toDto() : null,
            employerProfileId: this.employerProfileId,
            employerProfile: (_a = this.employerProfile) === null || _a === void 0 ? void 0 : _a.toDto(),
            jobName: this.jobName,
            jobDescription: this.jobDescription,
            status: this.status,
            type: this.type,
        };
    }
    normalizeDateForStorage(date) {
        if (!date) {
            return null;
        }
        let year, month, day;
        if (typeof date === 'string') {
            const match = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
            if (match) {
                year = parseInt(match[1], 10);
                month = parseInt(match[2], 10) - 1;
                day = parseInt(match[3], 10);
            }
            else {
                const d = new Date(date);
                year = d.getFullYear();
                month = d.getMonth();
                day = d.getDate();
            }
        }
        else {
            year = date.getFullYear();
            month = date.getMonth();
            day = date.getDate();
        }
        return new Date(Date.UTC(year, month, day, 12, 0, 0));
    }
    fromDto(dto) {
        this.id = dto.id;
        this.candidateId = dto.candidateId;
        this.jobId = dto.jobId;
        this.experienceStartDate = this.normalizeDateForStorage(dto.experienceStartDate);
        this.experienceEndDate = this.normalizeDateForStorage(dto.experienceEndDate);
        this.showMonthInResume = dto.showMonthInResume;
        this.employer = dto.employer;
        this.inActivity = dto.inActivity;
        this.leavingReason = dto.leavingReason;
        this.jobReferenceId = dto.jobReferenceId;
        this.employerProfileId = dto.employerProfileId;
        this.jobName = dto.jobName;
        this.jobDescription = dto.jobDescription;
        this.status = dto.status;
        this.type = dto.type;
        if (dto.jobReference) {
            const jobRef = new job_reference_entity_1.JobReference();
            jobRef.fromDto(dto.jobReference);
            this.jobReference = jobRef;
            this.jobReferenceId = jobRef.id;
        }
        if (!this.id) {
            this.id = undefined;
        }
    }
};
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'candidateId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], CandidateJob.prototype, "candidateId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => candidate_entity_1.Candidate, (candidate) => candidate.candidateJobs, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'candidateId' }),
    __metadata("design:type", candidate_entity_1.Candidate)
], CandidateJob.prototype, "candidate", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'jobId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], CandidateJob.prototype, "jobId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_value_entity_1.AppValue),
    (0, typeorm_1.JoinColumn)({ name: 'jobId' }),
    __metadata("design:type", app_value_entity_1.AppValue)
], CandidateJob.prototype, "job", void 0);
__decorate([
    (0, typeorm_1.Column)('date', { name: 'experienceStartDate', nullable: true }),
    __metadata("design:type", Date)
], CandidateJob.prototype, "experienceStartDate", void 0);
__decorate([
    (0, typeorm_1.Column)('date', { name: 'experienceEndDate', nullable: true }),
    __metadata("design:type", Date)
], CandidateJob.prototype, "experienceEndDate", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'showMonthInResume', default: true }),
    __metadata("design:type", Boolean)
], CandidateJob.prototype, "showMonthInResume", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'employer', nullable: true }),
    __metadata("design:type", String)
], CandidateJob.prototype, "employer", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'inActivity', default: true }),
    __metadata("design:type", Boolean)
], CandidateJob.prototype, "inActivity", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'leavingReason', nullable: true }),
    __metadata("design:type", String)
], CandidateJob.prototype, "leavingReason", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'jobReferenceId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], CandidateJob.prototype, "jobReferenceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => job_reference_entity_1.JobReference, { cascade: true }),
    (0, typeorm_1.JoinColumn)({ name: 'jobReferenceId' }),
    __metadata("design:type", job_reference_entity_1.JobReference)
], CandidateJob.prototype, "jobReference", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'employerProfileId',
        nullable: true,
        length: 36,
    }),
    __metadata("design:type", String)
], CandidateJob.prototype, "employerProfileId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_value_entity_1.AppValue),
    (0, typeorm_1.JoinColumn)({ name: 'employerProfileId' }),
    __metadata("design:type", app_value_entity_1.AppValue)
], CandidateJob.prototype, "employerProfile", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'jobName', nullable: true, length: 255 }),
    __metadata("design:type", String)
], CandidateJob.prototype, "jobName", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'jobDescription', nullable: true }),
    __metadata("design:type", String)
], CandidateJob.prototype, "jobDescription", void 0);
__decorate([
    (0, typeorm_1.Column)('enum', {
        name: 'status',
        nullable: false,
        default: candidate_job_status_type_1.CandidateJobStatus.PENDING,
        enum: candidate_job_status_type_1.CandidateJobStatus,
    }),
    __metadata("design:type", String)
], CandidateJob.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('enum', {
        name: 'type',
        nullable: false,
        default: candidate_job_type_1.CandidateJobType.JOB,
        enum: candidate_job_type_1.CandidateJobType,
    }),
    __metadata("design:type", String)
], CandidateJob.prototype, "type", void 0);
CandidateJob = __decorate([
    (0, typeorm_1.Entity)({ name: 'candidate-jobs' })
], CandidateJob);
exports.CandidateJob = CandidateJob;
//# sourceMappingURL=candidate-jobs.entity.js.map