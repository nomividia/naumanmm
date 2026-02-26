import { BaseSearchResponse } from '../../models/responses/base-search-responses';
import { GenericResponse } from '../../models/responses/generic-response';
import { CandidateApplicationDto } from '../candidates-application/candidate-application-dto';
import { JobOfferDto } from '../job-offers/job-offer-dto';
export declare class CandidateApplicationJobsDto {
    id?: string;
    creationDate?: Date;
    modifDate?: Date;
    candidateApplicationId?: string;
    candidateApplication?: CandidateApplicationDto;
    jobOfferId: string;
    jobOffer?: JobOfferDto;
}
export declare class GetCandidateApplicationJobResponse extends GenericResponse {
    candidateApplicationJob: CandidateApplicationJobsDto;
}
export declare class GetCandidateApplicationJobsResponse extends BaseSearchResponse {
    candidateApplicationJobs: CandidateApplicationJobsDto[];
}
