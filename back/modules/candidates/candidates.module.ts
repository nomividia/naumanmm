import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteItemFile } from '../../entities/note-item-file.entity';
import { NoteItem } from '../../entities/note-item.entity';
import { AuthToolsService } from '../../services/auth-tools.service';
import { AppCommonModule } from '../../shared/app-common.module';
import { SharedModule } from '../../shared/shared-module';
import { CandidateResumeModule } from '../candidate-resume/candidate-resume.module';
import { FileModule } from '../file/file.module';
import { GDriveModule } from '../gdrive/gdrive.module';
import { HistoriesService } from '../history/histories.service';
import { History } from '../history/history.entity';
import { MailModule } from '../mail/mail.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';
import { CandidateChildren } from './candidate-children/candidate-children.entity';
import { CandidateContract } from './candidate-contract.entity';
import { CandidateCountry } from './candidate-country/candidate-country.entity';
import { CandidateCurrentJob } from './candidate-current-jobs/candidate-current-jobs.entity';
import { CandidateDepartment } from './candidate-department/candidate-department.entity';
import { CandidateFile } from './candidate-file.entity';
import { CandidateJobOfferHistoryModule } from './candidate-job-offer-history/candidate-job-offer-history.module';
import { CandidateJob } from './candidate-jobs.entity';
import { CandidateLanguage } from './candidate-language/candidate-language.entity';
import { CandidateLicence } from './candidate-licences/candidate-licences.entity';
import { CandidatePet } from './candidate-pets/candidate-pet.entity';
import { CandidateReadonlyProperty } from './candidate-readonly/candidate-readonly-property.entity';
import { Candidate } from './candidate.entity';
import { CandidatesController } from './candidates.controller';
import { CandidateService } from './candidates.service';

@Module({
    imports: [
        // AppCommonModule,
        forwardRef(() => AppCommonModule),
        TypeOrmModule.forFeature([
            Candidate,
            NoteItem,
            NoteItemFile,
            CandidateJob,
            CandidateLanguage,
            CandidateChildren,
            CandidateLicence,
            CandidateFile,
            CandidateReadonlyProperty,
            CandidatePet,
            CandidateContract,
            CandidateCountry,
            History,
            CandidateCurrentJob,
            CandidateDepartment,
        ]),
        forwardRef(() => FileModule),
        forwardRef(() => GDriveModule),
        forwardRef(() => MailModule),
        forwardRef(() => SharedModule),
        forwardRef(() => UsersModule),
        forwardRef(() => NotificationsModule),
        forwardRef(() => CandidateResumeModule),
        forwardRef(() => CandidateJobOfferHistoryModule),
    ],
    controllers: [CandidatesController],
    providers: [CandidateService, HistoriesService, AuthToolsService],
    exports: [CandidateService],
})
export class CandidateModule {}
