import { EmailAddress } from 'nextalys-node-helpers';
import { NewsletterLanguage, NewsletterType } from '../../../shared/shared-constants';
import { AppValueDto } from '../../models/dto/app-value-dto';
import { BaseDto } from '../../models/dto/base.dto';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { BaseSearchResponse } from '../../models/responses/base-search-responses';
import { GenericResponse } from '../../models/responses/generic-response';
import { SendNewsletterResponse } from '../../shared/types';
import { CandidateApplicationDto } from '../candidates-application/candidate-application-dto';
import { CandidateDepartmentDto } from '../candidates/candidate-department/candidate-department.dto';
import { CandidateDto } from '../candidates/candidate-dto';
import { NewsLetterCandidateJobsDto } from '../candidates/newsletter-candidate-jobs.dto';
import { NewsLetterCandidateStatusDto } from '../candidates/newsletter-candidate-status.dto';
import { NewsletterJobOfferDto } from '../candidates/newsletter-joboffer.dto';
export declare class NewsletterDto extends BaseDto {
    title?: string;
    content: string;
    subject?: string;
    sender?: string;
    newsletterStatusId?: string;
    newsletterStatus?: AppValueDto;
    sendDate?: Date;
    candidatesCount?: number;
    candidateApplicationsCount?: number;
    newsLettersCandidateStatus?: NewsLetterCandidateStatusDto[];
    newsLettersJob?: NewsLetterCandidateJobsDto[];
    newslettersJobOffer?: NewsletterJobOfferDto[];
    language?: NewsletterLanguage;
    newsletterSibId?: string;
    type?: NewsletterType;
    newsletterListSibId?: string;
    sentCount?: number;
    deliveredCount?: number;
    answeredCount?: number;
    unsubscriptionsCount?: number;
    openedCount?: number;
    clickedCount?: number;
    htmlFullContent?: string;
    includeCandidateApplications?: boolean;
    candidateDepartments?: CandidateDepartmentDto[];
    cityFilter?: string[];
    countriesFilter?: string;
}
export declare class GetNewsletterResponse extends GenericResponse {
    newsletter?: NewsletterDto;
}
export declare class GetNewslettersResponse extends BaseSearchResponse {
    newsletters?: NewsletterDto[];
}
export declare class GetNewslettersRequest extends BaseSearchRequest {
    date?: string;
    statusIdList?: string;
    year?: string;
    month?: string;
}
export interface NewsLetterMailRequest {
    newsLetter: NewsletterDto;
    candidates: CandidateDto[];
}
export declare class GetCandidatesCountRequest {
    statusIds?: string;
    jobIds?: string;
    cityFilter?: string[];
    countriesFilter?: string;
    isNewsletterFrench?: 'true' | 'false';
    newsletterType?: NewsletterType;
}
export declare class GetNewsletterCandidateApplicationsRequest {
    isNewsletterFrench?: 'true' | 'false';
    candidateAdressesAlreadyLoaded: string[];
    newsletterType?: NewsletterType;
    jobIds?: string;
}
export declare class GetCandidatesCountResponse extends GenericResponse {
    candidatesCount?: number;
    candidates: CandidateDto[];
}
export declare class GetNewsletterCandidateApplicationsResponse extends GenericResponse {
    candidateApplicationsCount?: number;
    candidateApplications: CandidateApplicationDto[];
}
export declare class UnsubscribeFromNewsletterRequest {
    guid: string;
}
export declare class SendNewsletterWithContactsResponse extends SendNewsletterResponse {
    contactsList?: EmailAddress[];
}
