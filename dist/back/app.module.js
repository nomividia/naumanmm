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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var AppModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const environment_1 = require("./environment/environment");
const logger_service_1 = require("./services/tools/logger.service");
const shared_module_1 = require("./shared/shared-module");
const nextalys_node_helpers_1 = require("nextalys-node-helpers");
const path_1 = require("path");
const images_helper_1 = require("../shared/images.helper");
const anonymous_exchanges_module_1 = require("./modules/anonymous-exchange/anonymous-exchanges.module");
const candidate_messages_module_1 = require("./modules/candidate-messages/candidate-messages.module");
const candidate_presentations_module_1 = require("./modules/candidate-presentations/candidate-presentations.module");
const candidate_resume_module_1 = require("./modules/candidate-resume/candidate-resume.module");
const candidate_applications_module_1 = require("./modules/candidates-application/candidate-applications.module");
const candidate_job_offer_history_module_1 = require("./modules/candidates/candidate-job-offer-history/candidate-job-offer-history.module");
const candidates_module_1 = require("./modules/candidates/candidates.module");
const customer_module_1 = require("./modules/customer/customer.module");
const data_migration_module_1 = require("./modules/data-migration/data-migration.module");
const database_module_1 = require("./modules/database/database.module");
const firebase_service_1 = require("./modules/firebase/firebase-service");
const gdrive_module_1 = require("./modules/gdrive/gdrive.module");
const histories_module_1 = require("./modules/history/histories.module");
const interviews_module_1 = require("./modules/interviews/interviews.module");
const job_offers_module_1 = require("./modules/job-offers/job-offers.module");
const job_references_module_1 = require("./modules/job-references/job-references.module");
const jobs_module_1 = require("./modules/jobs/jobs.module");
const jobs_service_1 = require("./modules/jobs/jobs.service");
const newsletter_templates_module_1 = require("./modules/newsletter-templates/newsletter-templates.module");
const newsletter_module_1 = require("./modules/newsletter/newsletter.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const translate_module_1 = require("./modules/translate/translate.module");
const users_module_1 = require("./modules/users/users.module");
const base_google_service_1 = require("./services/base-google-service");
const pm2_helpers_1 = require("./services/pm2-helpers");
const database_service_1 = require("./services/tools/database.service");
const helpers_service_1 = require("./services/tools/helpers.service");
const translation_service_1 = require("./services/translation.service");
const ssrModulesList = [];
if (environment_1.Environment.SsrEnabled) {
    const BROWSER_DIR = (0, path_1.join)(process.cwd(), 'browser');
}
let AppModule = AppModule_1 = class AppModule {
    constructor(logger, dbService, jobsService) {
        this.logger = logger;
        this.dbService = dbService;
        this.jobsService = jobsService;
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const backBaseUrl = environment_1.Environment.EnvName !== 'development'
                ? environment_1.Environment.BaseURL
                : 'http://localhost:' + environment_1.Environment.ApiPort;
            images_helper_1.ImagesHelper.init(environment_1.Environment.BaseURL, backBaseUrl);
            environment_1.Environment.ApiPort = AppModule_1.normalizePort(environment_1.Environment.ApiPort);
            environment_1.Environment.ApiScheme =
                environment_1.Environment.ApiScheme === 'https' ? 'https' : 'http';
            yield translation_service_1.TranslationService.loadAllTranslationsFiles();
            yield base_google_service_1.BaseGoogleService.init();
            yield pm2_helpers_1.PM2Helpers.init();
            if (helpers_service_1.ApiMainHelpers.isMainWorker()) {
                yield this.logger.log('Node app listening on port ' + environment_1.Environment.ApiPort, environment_1.Environment);
                yield this.dbService.seedDatabase();
                yield this.jobsService.init();
                for (const folder of environment_1.FoldersToCreateOnInit) {
                    if (!(yield nextalys_node_helpers_1.FileHelpers.isDirectory(folder)))
                        yield nextalys_node_helpers_1.FileHelpers.createDirectory(folder);
                }
            }
            firebase_service_1.FirebaseService.init();
        });
    }
    static normalizePort(param) {
        const portNumber = typeof param === 'string' ? parseInt(param, 10) : param;
        if (isNaN(portNumber))
            return param;
        else if (portNumber >= 0)
            return portNumber;
    }
};
AppModule = AppModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [
            ...ssrModulesList,
            typeorm_1.TypeOrmModule.forRoot({
                extra: {
                    timezone: 'utc',
                    decimalNumbers: true,
                },
                type: 'mysql',
                host: environment_1.Environment.db_host,
                port: environment_1.Environment.db_port,
                username: environment_1.Environment.db_user,
                password: environment_1.Environment.db_password,
                database: environment_1.Environment.db_name,
                logging: environment_1.Environment.db_log_enabled,
                migrationsTableName: !!environment_1.Environment.UseTypeOrmMigrations
                    ? 'nxs-migrations'
                    : undefined,
                migrations: !!environment_1.Environment.UseTypeOrmMigrations
                    ? [
                        __dirname + '/migrations/*.js',
                        __dirname + '/migrations/*.ts',
                    ]
                    : undefined,
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: !environment_1.Environment.UseTypeOrmMigrations,
                migrationsRun: !!environment_1.Environment.UseTypeOrmMigrations,
            }),
            shared_module_1.SharedModule,
            notifications_module_1.NotificationsModule,
            candidates_module_1.CandidateModule,
            candidate_job_offer_history_module_1.CandidateJobOfferHistoryModule,
            candidate_applications_module_1.CandidatApplicationModule,
            candidate_presentations_module_1.CandidatePresentationsModule,
            customer_module_1.CustomerModule,
            job_offers_module_1.JobOfferModule,
            gdrive_module_1.GDriveModule,
            data_migration_module_1.DataMigrationModule,
            interviews_module_1.InterviewsModule,
            candidate_messages_module_1.CandidateMessagesModule,
            candidate_resume_module_1.CandidateResumeModule,
            jobs_module_1.JobsModule,
            database_module_1.DatabaseModule,
            users_module_1.UsersModule,
            job_references_module_1.JobReferencesModule,
            newsletter_module_1.NewsletterModule,
            newsletter_templates_module_1.NewsletterTemplatesModule,
            anonymous_exchanges_module_1.AnonymousExchangeModule,
            histories_module_1.HistoriesModule,
            translate_module_1.TranslateModule,
        ],
        controllers: [app_controller_1.AppController],
    }),
    __metadata("design:paramtypes", [logger_service_1.AppLogger,
        database_service_1.DatabaseService,
        jobs_service_1.JobsService])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map