import { AppValueDto } from '../../models/dto/app-value-dto';
import { UserDto } from '../../models/dto/user-dto';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { BaseSearchResponse } from '../../models/responses/base-search-responses';
import { GenericResponse } from '../../models/responses/generic-response';
import { CandidateApplicationJobsDto } from '../candidate-application-jobs/candidates-application-jobs-dto';
import { CandidateApplicationDto } from '../candidates-application/candidate-application-dto';
import { CustomerDto } from '../customer/customer.dto';
export declare class JobOfferDto {
    id?: string;
    title: string;
    jobDescription: string;
    ref: string;
    creationDate?: Date;
    modifDate?: Date;
    city?: string;
    country?: string;
    countryCode?: string;
    consultantId?: string;
    consultant?: UserDto;
    salary?: string;
    publicLink?: string;
    jobId: string;
    job?: AppValueDto;
    taskResponsabilitiesDescription?: string;
    candidateProfileDescription?: string;
    conditionsDescription?: string;
    applyInCouple?: boolean;
    contractTypeId: string;
    contractType?: AppValueDto;
    candidateApplicationJobs?: CandidateApplicationJobsDto[];
    disabled?: boolean;
    customerId?: string;
    customer?: CustomerDto;
    stateId?: string;
    state?: AppValueDto;
    candidateApplications?: CandidateApplicationDto[];
}
export declare class GetJobOfferResponse extends GenericResponse {
    jobOffer: JobOfferDto;
}
export declare class GetJobOffersResponse extends BaseSearchResponse {
    jobOffers: JobOfferDto[];
}
export declare class GetJobOfferRequest extends BaseSearchRequest {
    jobIds?: string;
    countryCode?: string;
    consultantIds?: string;
    applyInCouple?: 'true' | 'false';
    status?: 'true' | 'false';
    city?: string;
    contractTypeId?: string;
    customerIds?: string;
    contractTypeIds?: string;
    stateId?: string;
    excludePlacedJobOffers?: 'true' | 'false';
}
export declare class SendJobOfferByMailRequest {
    object: string;
    email: string;
    content: string;
    sender: string;
}
