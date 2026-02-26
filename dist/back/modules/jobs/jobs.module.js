"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const app_common_module_1 = require("../../shared/app-common.module");
const notifications_module_1 = require("../notifications/notifications.module");
const job_history_entity_1 = require("./job-history.entity");
const job_controller_1 = require("./job.controller");
const job_entity_1 = require("./job.entity");
const jobs_service_1 = require("./jobs.service");
const modules_imports_for_jobs_1 = require("./modules-imports-for-jobs");
let JobsModule = class JobsModule {
};
JobsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            app_common_module_1.AppCommonModule,
            typeorm_1.TypeOrmModule.forFeature([job_entity_1.Job, job_history_entity_1.JobHistory]),
            notifications_module_1.NotificationsModule,
            ...modules_imports_for_jobs_1.ModulesImportsForJobs,
        ],
        controllers: [job_controller_1.JobsController],
        providers: [jobs_service_1.JobsService],
        exports: [jobs_service_1.JobsService],
    })
], JobsModule);
exports.JobsModule = JobsModule;
//# sourceMappingURL=jobs.module.js.map