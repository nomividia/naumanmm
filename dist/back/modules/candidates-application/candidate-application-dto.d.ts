import { AddressDto } from '../../models/dto/address-dto';
import { AppFileDto } from '../../models/dto/app-file-dto';
import { AppValueDto } from '../../models/dto/app-value-dto';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { BaseSearchResponse } from '../../models/responses/base-search-responses';
import { GenericResponse } from '../../models/responses/generic-response';
import { AnonymousExchangeDto } from '../anonymous-exchange/anonymous-exchange.dto';
import { CandidateApplicationJobsDto } from '../candidate-application-jobs/candidates-application-jobs-dto';
import { CandidateCountryDto } from '../candidates/candidate-country/candidate-country.dto';
import { CandidateDepartmentDto } from '../candidates/candidate-department/candidate-department.dto';
import { CandidateDto } from '../candidates/candidate-dto';
export declare class CandidateApplicationDto {
    id?: string;
    lastName: string;
    firstName: string;
    genderId: string;
    gender?: AppValueDto;
    birthDate: Date;
    partnerFirstName: string;
    partnerLastName: string;
    partnerGenderId: string;
    partnerGender?: AppValueDto;
    partnerBirthDate: Date;
    partnerEmail?: string;
    partnerPhone?: string;
    professionId: string;
    profession?: AppValueDto;
    address?: AddressDto;
    phone: string;
    phoneSecondary: string;
    email: string;
    skills: string;
    relationshipStatusId: string;
    relationshipStatus?: AppValueDto;
    creationDate?: Date;
    modifDate?: Date;
    applyStatus?: AppValueDto;
    applyStatusId?: string;
    inCouple: boolean;
    spontaneousApplication: boolean;
    candidateId?: string;
    mainPhotoBase64?: string;
    mainPhotoBase64MimeType?: string;
    photoFileId?: string;
    photoFile?: AppFileDto;
    mainResumeFileId?: string;
    mainResumeFile?: AppFileDto;
    resumeFileBase64?: string;
    resumeFileBase64MimeType?: string;
    partnerResumeFileId?: string;
    partnerResumeFile?: AppFileDto;
    partnerResumeFileBase64?: string;
    partnerResumeFileBase64MimeType?: string;
    seen?: boolean;
    candidateApplicationJobs?: CandidateApplicationJobsDto[];
    disabled?: boolean;
    jobOfferLinkedRef?: string;
    linkedToCandidate?: boolean;
    candidate: CandidateDto;
    guidExchange?: string;
    anonymousExchanges?: AnonymousExchangeDto[];
    newsletterUnsubscribed?: boolean;
    newsletterUnsubscribedGuid?: string;
    candidateDepartments?: CandidateDepartmentDto[];
    candidateCountries?: CandidateCountryDto[];
    allowed_to_work_us?: boolean;
    require_sponsorship_us?: boolean;
    usTermsAcceptedAt?: Date;
    usTermsVersion?: string;
}
export declare class GetCandidateApplicationResponse extends GenericResponse {
    candidateApplication: CandidateApplicationDto;
}
export declare class GetCandidateApplicationsResponse extends BaseSearchResponse {
    candidateApplications: CandidateApplicationDto[];
}
export declare class GetCandidateApplicationsRequest extends BaseSearchRequest {
    applyStatus?: string;
    candidateStatus?: string;
    applyInCouple?: 'true' | 'false';
    jobOfferRef?: string;
    jobCategory?: string;
    candidateId?: string;
    disabled?: 'true' | 'false';
    includeDisabled?: 'true' | 'false';
    showOnlyUnSeen?: 'true' | 'false';
    spontaneousApplication?: 'true' | 'false';
    hideSpontaneousApplications?: 'true' | 'false';
    onlyNewCandidate?: 'true' | 'false';
    consultantIds?: string;
    jobOfferId?: string;
    excludePlaced?: 'true' | 'false';
    city?: string;
    locations?: string;
    department?: string;
}
export declare class SubmitCandidateApplicationFormRequest {
    candidateApplication: CandidateApplicationDto;
    recaptchaToken: string;
    language: 'fr' | 'en';
}
export declare class RefuseCandidateApplicationRequest {
    id: string;
    createCandidate?: boolean;
    candidateCurrentJobIds?: string[];
    giveAtsAccess?: boolean;
    genderId?: string;
    isPlatform?: boolean;
}
export declare class ValidateCandidateApplicationRequest {
    id: string;
    candidateCurrentJobIds?: string[];
    giveAtsAccess?: boolean;
    genderId?: string;
}
export declare class UnSeenCandidateApplicationResponse extends GenericResponse {
    unSeenCandidateApplication: number;
}
export declare class ApplyToJobOffersRequest {
    jobOfferIds: string[];
}
export declare class GuidExchangeResponse extends GenericResponse {
    guid: string;
}
export declare class SetCandidateApplicationUnseenRequest {
    candidateApplicationId: string;
}
