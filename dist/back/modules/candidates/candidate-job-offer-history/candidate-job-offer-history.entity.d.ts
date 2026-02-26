import { AppBaseEntity } from '../../../entities/base-entity';
import { JobOffer } from '../../job-offers/job-offer.entity';
import { Candidate } from '../candidate.entity';
import { CandidateFile } from '../candidate-file.entity';
export declare enum CandidateJobOfferAction {
    LINKED = "LINKED",
    UNLINKED = "UNLINKED"
}
export declare class CandidateJobOfferHistory extends AppBaseEntity {
    candidateId: string;
    candidate?: Candidate;
    jobOfferId: string;
    jobOffer?: JobOffer;
    action: CandidateJobOfferAction;
    candidateFirstName: string;
    candidateLastName: string;
    actionDate: Date;
    startDate: Date;
    contractFileId: string;
    contractFile?: CandidateFile;
    toDto(): {
        id: string;
        candidateId: string;
        candidate: import("../candidate-dto").CandidateDto;
        jobOfferId: string;
        jobOffer: import("../../job-offers/job-offer-dto").JobOfferDto;
        action: CandidateJobOfferAction;
        candidateFirstName: string;
        candidateLastName: string;
        actionDate: Date;
        startDate: Date;
        contractFileId: string;
        contractFile: import("../candidate-file-dto").CandidateFileDto;
        creationDate: Date;
        modifDate: Date;
    };
    fromDto(dto: any): void;
}
