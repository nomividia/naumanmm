import { JobOfferDto } from '../../job-offers/job-offer-dto';
import { CandidateDto } from '../candidate-dto';
import { CandidateFileDto } from '../candidate-file-dto';
import { CandidateJobOfferAction } from './candidate-job-offer-history.entity';
export declare class CandidateJobOfferHistoryDto {
    id?: string;
    candidateId: string;
    candidate?: CandidateDto;
    jobOfferId: string;
    jobOffer?: JobOfferDto;
    action: CandidateJobOfferAction;
    candidateFirstName: string;
    candidateLastName: string;
    actionDate: Date;
    startDate?: Date;
    contractFileId?: string;
    contractFile?: CandidateFileDto;
    creationDate?: Date;
    modifDate?: Date;
}
export declare class CreateCandidateJobOfferHistoryRequest {
    candidateId: string;
    jobOfferId: string;
    action: CandidateJobOfferAction;
    candidateFirstName: string;
    candidateLastName: string;
    startDate?: Date;
    contractFileId?: string;
}
export declare class GetCandidateJobOfferHistoryRequest {
    jobOfferId?: string;
    candidateId?: string;
    start?: number;
    length?: number;
    orderby?: string;
    order?: string;
}
