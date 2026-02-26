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
exports.JobHistory = void 0;
const typeorm_1 = require("typeorm");
const job_entity_1 = require("./job.entity");
let JobHistory = class JobHistory {
    toDto(getJob) {
        return {
            id: this.id,
            job: this.job && getJob ? this.job.toDto() : undefined,
            jobId: this.jobId,
            date: this.date,
            result: this.result,
            duration: this.duration,
        };
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'id' }),
    __metadata("design:type", String)
], JobHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => job_entity_1.Job, (job) => job.jobHistory, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'jobId' }),
    __metadata("design:type", job_entity_1.Job)
], JobHistory.prototype, "job", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'jobId', length: 36, nullable: false }),
    __metadata("design:type", String)
], JobHistory.prototype, "jobId", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { name: 'date', nullable: false }),
    __metadata("design:type", Date)
], JobHistory.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'result', nullable: true }),
    __metadata("design:type", String)
], JobHistory.prototype, "result", void 0);
__decorate([
    (0, typeorm_1.Column)('float', { name: 'duration', nullable: false, default: 0 }),
    __metadata("design:type", Number)
], JobHistory.prototype, "duration", void 0);
JobHistory = __decorate([
    (0, typeorm_1.Entity)({ name: 'jobs-history' })
], JobHistory);
exports.JobHistory = JobHistory;
//# sourceMappingURL=job-history.entity.js.map