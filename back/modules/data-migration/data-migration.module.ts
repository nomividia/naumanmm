import { Module } from '@nestjs/common';
import { AppCommonModule } from '../../shared/app-common.module';
import { CandidateResumeModule } from '../candidate-resume/candidate-resume.module';
import { CandidatApplicationModule } from '../candidates-application/candidate-applications.module';
import { CandidateModule } from '../candidates/candidates.module';
import { FileModule } from '../file/file.module';
import { JobOfferModule } from '../job-offers/job-offers.module';
import { KeyValueModule } from '../key-value-db/key-value.module';
import { MailModule } from '../mail/mail.module';
import { DataMigrationService } from './data-migration.service';

@Module({
    imports: [
        AppCommonModule,
        CandidateModule,
        CandidateResumeModule,
        JobOfferModule,
        CandidatApplicationModule,
        FileModule,
        KeyValueModule,
        MailModule,
    ],
    controllers: [],
    providers: [DataMigrationService],
    exports: [DataMigrationService],
})
export class DataMigrationModule {}
