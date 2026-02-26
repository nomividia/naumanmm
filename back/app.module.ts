import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { Environment, FoldersToCreateOnInit } from './environment/environment';
import { AppLogger } from './services/tools/logger.service';
import { SharedModule } from './shared/shared-module';
// import { AngularUniversalModule, applyDomino } from '@nestjs/ng-universal';
import { FileHelpers } from 'nextalys-node-helpers';
import { join } from 'path';
import { ImagesHelper } from '../shared/images.helper';
import { AnonymousExchangeModule } from './modules/anonymous-exchange/anonymous-exchanges.module';
import { CandidateMessagesModule } from './modules/candidate-messages/candidate-messages.module';
import { CandidatePresentationsModule } from './modules/candidate-presentations/candidate-presentations.module';
import { CandidateResumeModule } from './modules/candidate-resume/candidate-resume.module';
import { CandidatApplicationModule } from './modules/candidates-application/candidate-applications.module';
import { CandidateJobOfferHistoryModule } from './modules/candidates/candidate-job-offer-history/candidate-job-offer-history.module';
import { CandidateModule } from './modules/candidates/candidates.module';
import { CustomerModule } from './modules/customer/customer.module';
import { DataMigrationModule } from './modules/data-migration/data-migration.module';
import { DatabaseModule } from './modules/database/database.module';
import { FirebaseService } from './modules/firebase/firebase-service';
import { GDriveModule } from './modules/gdrive/gdrive.module';
import { HistoriesModule } from './modules/history/histories.module';
import { InterviewsModule } from './modules/interviews/interviews.module';
import { JobOfferModule } from './modules/job-offers/job-offers.module';
import { JobReferencesModule } from './modules/job-references/job-references.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { JobsService } from './modules/jobs/jobs.service';
import { NewsletterTemplatesModule } from './modules/newsletter-templates/newsletter-templates.module';
import { NewsletterModule } from './modules/newsletter/newsletter.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { TranslateModule } from './modules/translate/translate.module';
import { UsersModule } from './modules/users/users.module';
import { BaseGoogleService } from './services/base-google-service';
import { PM2Helpers } from './services/pm2-helpers';
import { DatabaseService } from './services/tools/database.service';
import { ApiMainHelpers } from './services/tools/helpers.service';
import { TranslationService } from './services/translation.service';
// import { AppServerModule } from '../front/src/app/app.module.server';
const ssrModulesList = [];
if (Environment.SsrEnabled) {
    // const { AppServerModuleNgFactory, LAZY_MODULE_MAP, ngExpressEngine, provideModuleMap } = require('../server/main.js');
    const BROWSER_DIR = join(process.cwd(), 'browser');
    //TODO : when nest ng universal ready for imports as common js
    // applyDomino(global, join(BROWSER_DIR, 'index.html'));
    // ssrModulesList.push(AngularUniversalModule.forRoot({
    //   viewsPath: BROWSER_DIR,
    //   rootStaticPath: '*.*',
    //   renderPath: '*',
    //   // bundle: {
    //   //   AppServerModuleNgFactory,
    //   //   LAZY_MODULE_MAP,
    //   //   provideModuleMap,
    //   //   ngExpressEngine
    //   // },
    //   bootstrap: AppServerModule,
    //   // liveReload: false,
    // }));
}

@Module({
    imports: [
        ...ssrModulesList,
        TypeOrmModule.forRoot({
            extra: {
                timezone: 'utc',
                decimalNumbers: true,
            },
            type: 'mysql',
            host: Environment.db_host,
            port: Environment.db_port,
            username: Environment.db_user,
            password: Environment.db_password,
            database: Environment.db_name,
            logging: Environment.db_log_enabled,
            migrationsTableName: !!Environment.UseTypeOrmMigrations
                ? 'nxs-migrations'
                : undefined,
            migrations: !!Environment.UseTypeOrmMigrations
                ? [
                      __dirname + '/migrations/*.js',
                      __dirname + '/migrations/*.ts',
                  ]
                : undefined,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: !Environment.UseTypeOrmMigrations,
            migrationsRun: !!Environment.UseTypeOrmMigrations,
        }),
        SharedModule,
        NotificationsModule,
        CandidateModule,
        CandidateJobOfferHistoryModule,
        CandidatApplicationModule,
        CandidatePresentationsModule,
        CustomerModule,
        JobOfferModule,
        GDriveModule,
        DataMigrationModule,
        InterviewsModule,
        CandidateMessagesModule,
        CandidateResumeModule,
        JobsModule,
        DatabaseModule,
        UsersModule,
        JobReferencesModule,
        NewsletterModule,
        NewsletterTemplatesModule,
        AnonymousExchangeModule,
        HistoriesModule,
        TranslateModule,
    ],
    controllers: [AppController],
})
export class AppModule {
    constructor(
        private logger: AppLogger,
        private dbService: DatabaseService,
        private jobsService: JobsService,
    ) {
        this.init();
    }

    private async init() {
        const backBaseUrl =
            Environment.EnvName !== 'development'
                ? Environment.BaseURL
                : 'http://localhost:' + Environment.ApiPort;
        ImagesHelper.init(Environment.BaseURL, backBaseUrl);
        Environment.ApiPort = AppModule.normalizePort(Environment.ApiPort);
        Environment.ApiScheme =
            Environment.ApiScheme === 'https' ? 'https' : 'http';
        await TranslationService.loadAllTranslationsFiles();
        await BaseGoogleService.init();
        await PM2Helpers.init();
        if (ApiMainHelpers.isMainWorker()) {
            await this.logger.log(
                'Node app listening on port ' + Environment.ApiPort,
                Environment,
            );
            // await this.logger.log('Current timezone offset ' + new Date().getTimezoneOffset());
            await this.dbService.seedDatabase();
            await this.jobsService.init();
            for (const folder of FoldersToCreateOnInit) {
                if (!(await FileHelpers.isDirectory(folder)))
                    await FileHelpers.createDirectory(folder);
            }
        }
        FirebaseService.init();
    }
    // tslint:disable-next-line: member-ordering
    private static normalizePort(param: number): number {
        const portNumber: number =
            typeof param === 'string' ? parseInt(param, 10) : param;
        if (isNaN(portNumber)) return param;
        else if (portNumber >= 0) return portNumber;
    }
}
