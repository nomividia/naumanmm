"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidatApplicationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const google_recaptcha_1 = require("@nestlab/google-recaptcha");
const environment_1 = require("../../environment/environment");
const auth_tools_service_1 = require("../../services/auth-tools.service");
const app_common_module_1 = require("../../shared/app-common.module");
const shared_module_1 = require("../../shared/shared-module");
const socket_module_1 = require("../../sockets/socket-module");
const candidates_application_jobs_entity_1 = require("../candidate-application-jobs/candidates-application-jobs.entity");
const candidates_module_1 = require("../candidates/candidates.module");
const file_module_1 = require("../file/file.module");
const gdrive_module_1 = require("../gdrive/gdrive.module");
const job_offers_module_1 = require("../job-offers/job-offers.module");
const mail_module_1 = require("../mail/mail.module");
const candidate_application_entity_1 = require("./candidate-application.entity");
const candidate_applications_controller_1 = require("./candidate-applications.controller");
const candidate_applications_service_1 = require("./candidate-applications.service");
let CandidatApplicationModule = class CandidatApplicationModule {
};
CandidatApplicationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            app_common_module_1.AppCommonModule,
            candidates_module_1.CandidateModule,
            shared_module_1.SharedModule,
            socket_module_1.SocketModule,
            gdrive_module_1.GDriveModule,
            file_module_1.FileModule,
            typeorm_1.TypeOrmModule.forFeature([
                candidate_application_entity_1.CandidateApplication,
                candidates_application_jobs_entity_1.CandidateApplicationJobs,
            ]),
            google_recaptcha_1.GoogleRecaptchaModule.forRoot({
                secretKey: environment_1.Environment.GoogleRecaptchaSecretKey,
                response: (req) => req.body.recaptchaToken,
                skipIf: environment_1.Environment.EnvName !== 'production' &&
                    environment_1.Environment.EnvName !== 'val',
                actions: ['candidateApplicationFormSubmit'],
                score: 0.5,
                debug: false,
            }),
            job_offers_module_1.JobOfferModule,
            mail_module_1.MailModule,
        ],
        controllers: [candidate_applications_controller_1.CandidateApplicationsController],
        providers: [candidate_applications_service_1.CandidateApplicationService, auth_tools_service_1.AuthToolsService],
        exports: [candidate_applications_service_1.CandidateApplicationService],
    })
], CandidatApplicationModule);
exports.CandidatApplicationModule = CandidatApplicationModule;
//# sourceMappingURL=candidate-applications.module.js.map