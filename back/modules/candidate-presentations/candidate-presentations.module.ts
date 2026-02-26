import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidatePresentation } from '../../entities/candidate-presentation.entity';
import { AppCommonModule } from '../../shared/app-common.module';
import { CandidatePresentationsController } from './candidate-presentations.controller';
import { CandidatePresentationsService } from './candidate-presentations.service';

@Module({
    imports: [
        forwardRef(() => AppCommonModule),
        TypeOrmModule.forFeature([CandidatePresentation]),
    ],
    controllers: [CandidatePresentationsController],
    providers: [CandidatePresentationsService],
    exports: [CandidatePresentationsService],
})
export class CandidatePresentationsModule {}
