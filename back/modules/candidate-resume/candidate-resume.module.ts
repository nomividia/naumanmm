import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppLanguage } from '../../entities/app-language.entity';
import { AppType } from '../../entities/app-type.entity';
import { AppValue } from '../../entities/app-value.entity';
import { ReferentialService } from '../../services/referential.service';
import { PdfService } from '../../services/tools/pdf.service';
import { TranslationService } from '../../services/translation.service';
import { AppCommonModule } from '../../shared/app-common.module';
import { SharedModule } from '../../shared/shared-module';
import { Candidate } from '../candidates/candidate.entity';
import { CandidateModule } from '../candidates/candidates.module';
import { GDriveModule } from '../gdrive/gdrive.module';
import { CandidateResumesController } from './candidate-resume.controller';
import { CandidateResumeService } from './candidate-resume.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([AppValue, AppType, AppLanguage, Candidate]),
        forwardRef(() => AppCommonModule),
        forwardRef(() => CandidateModule),
        forwardRef(() => SharedModule),
        forwardRef(() => GDriveModule),
    ],
    controllers: [CandidateResumesController],
    providers: [
        CandidateResumeService,
        PdfService,
        TranslationService,
        ReferentialService,
    ],
    exports: [CandidateResumeService],
})
export class CandidateResumeModule {}
