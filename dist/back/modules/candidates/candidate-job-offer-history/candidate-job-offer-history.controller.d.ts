import { CreateCandidateJobOfferHistoryRequest, GetCandidateJobOfferHistoryRequest } from './candidate-job-offer-history-dto';
import { CandidateJobOfferHistoryService } from './candidate-job-offer-history.service';
export declare class CandidateJobOfferHistoryController {
    private readonly candidateJobOfferHistoryService;
    constructor(candidateJobOfferHistoryService: CandidateJobOfferHistoryService);
    createHistoryEntry(request: CreateCandidateJobOfferHistoryRequest): Promise<import("./candidate-job-offer-history-dto").CandidateJobOfferHistoryDto>;
    getJobOfferHistory(jobOfferId: string, query: GetCandidateJobOfferHistoryRequest): Promise<{
        success: boolean;
        message?: string;
        history?: import("./candidate-job-offer-history-dto").CandidateJobOfferHistoryDto[];
        totalCount?: number;
    }>;
    getCandidateHistory(candidateId: string, query: GetCandidateJobOfferHistoryRequest): Promise<{
        success: boolean;
        message?: string;
        history?: import("./candidate-job-offer-history-dto").CandidateJobOfferHistoryDto[];
        totalCount?: number;
    }>;
}
