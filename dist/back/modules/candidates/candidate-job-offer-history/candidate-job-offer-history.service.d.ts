import { Repository } from 'typeorm';
import { ApplicationBaseModelService } from '../../../services/base-model.service';
import { CandidateJobOfferHistoryDto, GetCandidateJobOfferHistoryRequest } from './candidate-job-offer-history-dto';
import { CandidateJobOfferAction, CandidateJobOfferHistory } from './candidate-job-offer-history.entity';
export declare class CandidateJobOfferHistoryService extends ApplicationBaseModelService<CandidateJobOfferHistory, CandidateJobOfferHistoryDto, any, any> {
    readonly repository: Repository<CandidateJobOfferHistory>;
    constructor(repository: Repository<CandidateJobOfferHistory>);
    createHistoryEntry(candidateId: string, jobOfferId: string, action: CandidateJobOfferAction, candidateFirstName: string, candidateLastName: string, startDate?: Date, contractFileId?: string): Promise<CandidateJobOfferHistoryDto>;
    getJobOfferHistory(request: GetCandidateJobOfferHistoryRequest): Promise<{
        success: boolean;
        message?: string;
        history?: CandidateJobOfferHistoryDto[];
        totalCount?: number;
    }>;
    getCandidateHistory(candidateId: string): Promise<{
        success: boolean;
        message?: string;
        history?: CandidateJobOfferHistoryDto[];
    }>;
}
