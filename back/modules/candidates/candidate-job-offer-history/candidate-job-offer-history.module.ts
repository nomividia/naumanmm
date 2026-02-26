import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppCommonModule } from '../../../shared/app-common.module';
import { CandidateJobOfferHistoryController } from './candidate-job-offer-history.controller';
import { CandidateJobOfferHistory } from './candidate-job-offer-history.entity';
import { CandidateJobOfferHistoryService } from './candidate-job-offer-history.service';

@Module({
    imports: [
        forwardRef(() => AppCommonModule),
        TypeOrmModule.forFeature([CandidateJobOfferHistory]),
    ],
    controllers: [CandidateJobOfferHistoryController],
    providers: [CandidateJobOfferHistoryService],
    exports: [CandidateJobOfferHistoryService],
})
export class CandidateJobOfferHistoryModule {}
