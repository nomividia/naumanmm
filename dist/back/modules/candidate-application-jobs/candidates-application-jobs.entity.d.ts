import { AppBaseEntity } from '../../entities/base-entity';
import { CandidateApplication } from '../candidates-application/candidate-application.entity';
import { JobOffer } from '../job-offers/job-offer.entity';
import { CandidateApplicationJobsDto } from './candidates-application-jobs-dto';
export declare class CandidateApplicationJobs extends AppBaseEntity {
    candidateApplicationId: string;
    candidateApplication?: CandidateApplication;
    jobOfferId: string;
    jobOffer?: JobOffer;
    toDto(): CandidateApplicationJobsDto;
    fromDto(dto: CandidateApplicationJobsDto): void;
}
