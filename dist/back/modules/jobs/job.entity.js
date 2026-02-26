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
exports.Job = void 0;
const typeorm_1 = require("typeorm");
const job_history_entity_1 = require("./job-history.entity");
let Job = class Job {
    toDto() {
        return {
            id: this.id,
            name: this.name,
            cronPattern: this.cronPattern,
            description: this.description,
            enabled: this.enabled,
            jobHistory: this.jobHistory
                ? this.jobHistory.map((x) => x.toDto(false))
                : undefined,
            methodName: this.methodName,
            applicationServiceName: this.applicationServiceName,
            logHistory: this.logHistory,
            moduleName: this.moduleName,
            modulePath: this.modulePath,
            servicePath: this.servicePath,
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.cronPattern = dto.cronPattern;
        this.name = dto.name;
        this.description = dto.description;
        this.applicationServiceName = dto.applicationServiceName;
        this.methodName = dto.methodName;
        this.enabled = dto.enabled;
        this.logHistory = dto.logHistory;
        this.moduleName = dto.moduleName;
        this.modulePath = dto.modulePath;
        this.servicePath = dto.servicePath;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'id' }),
    __metadata("design:type", String)
], Job.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'name',
        nullable: false,
        length: 100,
        unique: true,
    }),
    __metadata("design:type", String)
], Job.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'cronPattern', nullable: true, length: 30 }),
    __metadata("design:type", String)
], Job.prototype, "cronPattern", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'description', nullable: true }),
    __metadata("design:type", String)
], Job.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => job_history_entity_1.JobHistory, (jobHistory) => jobHistory.job, {
        cascade: true,
        onUpdate: 'CASCADE',
    }),
    __metadata("design:type", Array)
], Job.prototype, "jobHistory", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { name: 'enabled', nullable: false, default: 1 }),
    __metadata("design:type", Boolean)
], Job.prototype, "enabled", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'applicationServiceName',
        nullable: true,
        length: 150,
    }),
    __metadata("design:type", String)
], Job.prototype, "applicationServiceName", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'methodName', nullable: false, length: 150 }),
    __metadata("design:type", String)
], Job.prototype, "methodName", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { name: 'logHistory', nullable: false, default: 1 }),
    __metadata("design:type", Boolean)
], Job.prototype, "logHistory", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'moduleName', nullable: true, length: 200 }),
    __metadata("design:type", String)
], Job.prototype, "moduleName", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'modulePath', nullable: true }),
    __metadata("design:type", String)
], Job.prototype, "modulePath", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'servicePath', nullable: true }),
    __metadata("design:type", String)
], Job.prototype, "servicePath", void 0);
Job = __decorate([
    (0, typeorm_1.Entity)({ name: 'jobs' })
], Job);
exports.Job = Job;
//# sourceMappingURL=job.entity.js.map