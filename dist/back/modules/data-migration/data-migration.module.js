"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataMigrationModule = void 0;
const common_1 = require("@nestjs/common");
const app_common_module_1 = require("../../shared/app-common.module");
const candidate_resume_module_1 = require("../candidate-resume/candidate-resume.module");
const candidate_applications_module_1 = require("../candidates-application/candidate-applications.module");
const candidates_module_1 = require("../candidates/candidates.module");
const file_module_1 = require("../file/file.module");
const job_offers_module_1 = require("../job-offers/job-offers.module");
const key_value_module_1 = require("../key-value-db/key-value.module");
const mail_module_1 = require("../mail/mail.module");
const data_migration_service_1 = require("./data-migration.service");
let DataMigrationModule = class DataMigrationModule {
};
DataMigrationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            app_common_module_1.AppCommonModule,
            candidates_module_1.CandidateModule,
            candidate_resume_module_1.CandidateResumeModule,
            job_offers_module_1.JobOfferModule,
            candidate_applications_module_1.CandidatApplicationModule,
            file_module_1.FileModule,
            key_value_module_1.KeyValueModule,
            mail_module_1.MailModule,
        ],
        controllers: [],
        providers: [data_migration_service_1.DataMigrationService],
        exports: [data_migration_service_1.DataMigrationService],
    })
], DataMigrationModule);
exports.DataMigrationModule = DataMigrationModule;
//# sourceMappingURL=data-migration.module.js.map