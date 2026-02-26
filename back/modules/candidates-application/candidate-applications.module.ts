import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { Environment } from '../../environment/environment';
import { AuthToolsService } from '../../services/auth-tools.service';
import { AppCommonModule } from '../../shared/app-common.module';
import { SharedModule } from '../../shared/shared-module';
import { SocketModule } from '../../sockets/socket-module';
import { CandidateApplicationJobs } from '../candidate-application-jobs/candidates-application-jobs.entity';
import { CandidateModule } from '../candidates/candidates.module';
import { FileModule } from '../file/file.module';
import { GDriveModule } from '../gdrive/gdrive.module';
import { JobOfferModule } from '../job-offers/job-offers.module';
import { MailModule } from '../mail/mail.module';
import { CandidateApplication } from './candidate-application.entity';
import { CandidateApplicationsController } from './candidate-applications.controller';
import { CandidateApplicationService } from './candidate-applications.service';

@Module({
    imports: [
        AppCommonModule,
        CandidateModule,
        SharedModule,
        SocketModule,
        GDriveModule,
        FileModule,
        TypeOrmModule.forFeature([
            CandidateApplication,
            CandidateApplicationJobs,
        ]),
        GoogleRecaptchaModule.forRoot({
            secretKey: Environment.GoogleRecaptchaSecretKey,
            response: (req) => req.body.recaptchaToken,
            skipIf:
                Environment.EnvName !== 'production' &&
                Environment.EnvName !== 'val',
            // agent: null,
            actions: ['candidateApplicationFormSubmit'],
            score: 0.5,
            debug: false,
        }),
        JobOfferModule,
        MailModule,
    ],
    controllers: [CandidateApplicationsController],
    providers: [CandidateApplicationService, AuthToolsService],
    exports: [CandidateApplicationService],
})
export class CandidatApplicationModule {}
