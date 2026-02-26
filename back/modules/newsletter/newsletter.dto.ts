import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmailAddress } from 'nextalys-node-helpers';
import {
    NewsletterLanguage,
    NewsletterType,
} from '../../../shared/shared-constants';
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

export class NewsletterDto extends BaseDto {
    @ApiPropertyOptional()
    title?: string;

    @ApiPropertyOptional()
    content: string;

    @ApiPropertyOptional()
    subject?: string;

    @ApiPropertyOptional()
    sender?: string;

    @ApiPropertyOptional()
    newsletterStatusId?: string;

    @ApiPropertyOptional()
    newsletterStatus?: AppValueDto;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    sendDate?: Date;

    @ApiPropertyOptional()
    candidatesCount?: number;

    @ApiPropertyOptional()
    candidateApplicationsCount?: number;

    @ApiPropertyOptional({
        type: () => NewsLetterCandidateStatusDto,
        isArray: true,
    })
    newsLettersCandidateStatus?: NewsLetterCandidateStatusDto[];

    @ApiPropertyOptional({
        type: () => NewsLetterCandidateJobsDto,
        isArray: true,
    })
    newsLettersJob?: NewsLetterCandidateJobsDto[];

    @ApiPropertyOptional({ type: () => NewsletterJobOfferDto, isArray: true })
    newslettersJobOffer?: NewsletterJobOfferDto[];

    @ApiPropertyOptional({ type: String })
    language?: NewsletterLanguage;

    @ApiPropertyOptional({ type: String })
    newsletterSibId?: string;

    @ApiPropertyOptional({ type: String })
    type?: NewsletterType = NewsletterType.Email;

    @ApiPropertyOptional({ type: String })
    newsletterListSibId?: string;

    @ApiPropertyOptional({ type: Number })
    sentCount?: number;

    @ApiPropertyOptional({ type: Number })
    deliveredCount?: number;

    @ApiPropertyOptional({ type: Number })
    answeredCount?: number;

    @ApiPropertyOptional({ type: Number })
    unsubscriptionsCount?: number;

    @ApiPropertyOptional({ type: Number })
    openedCount?: number;

    @ApiPropertyOptional({ type: Number })
    clickedCount?: number;

    @ApiPropertyOptional({ type: String })
    htmlFullContent?: string;

    @ApiPropertyOptional()
    includeCandidateApplications?: boolean;

    @ApiPropertyOptional({ type: () => CandidateDepartmentDto, isArray: true })
    candidateDepartments?: CandidateDepartmentDto[];

    @ApiPropertyOptional({ type: [String] })
    cityFilter?: string[];

    @ApiPropertyOptional({ type: String })
    countriesFilter?: string;
}

export class GetNewsletterResponse extends GenericResponse {
    @ApiPropertyOptional({ type: () => NewsletterDto })
    newsletter?: NewsletterDto;
}

export class GetNewslettersResponse extends BaseSearchResponse {
    @ApiPropertyOptional({ type: () => NewsletterDto, isArray: true })
    newsletters?: NewsletterDto[] = [];
}

export class GetNewslettersRequest extends BaseSearchRequest {
    @ApiPropertyOptional({ description: 'filter newsletter date' })
    date?: string;

    @ApiPropertyOptional({ description: 'filter newsletter by statusId' })
    statusIdList?: string;

    @ApiPropertyOptional({ description: 'filter by year' })
    year?: string;

    @ApiPropertyOptional({ description: 'filter by month' })
    month?: string;
}

export interface NewsLetterMailRequest {
    newsLetter: NewsletterDto;
    candidates: CandidateDto[];
}

export class GetCandidatesCountRequest {
    @ApiPropertyOptional({ description: 'filter newsletter by statusId' })
    statusIds?: string;

    @ApiPropertyOptional({ description: 'filter newsletter by jobIds' })
    jobIds?: string;

    @ApiPropertyOptional({
        description: 'filter newsletter by cities',
        type: [String],
    })
    cityFilter?: string[];

    @ApiPropertyOptional({ description: 'filter newsletter by country' })
    countriesFilter?: string;

    @ApiPropertyOptional({
        description: 'filter newsletter by candidate location',
    })
    isNewsletterFrench?: 'true' | 'false' = 'false';

    @ApiPropertyOptional({ type: String })
    newsletterType?: NewsletterType = NewsletterType.Email;
}

export class GetNewsletterCandidateApplicationsRequest {
    @ApiPropertyOptional({
        description: 'filter newsletter by candidate location',
    })
    isNewsletterFrench?: 'true' | 'false' = 'false';

    @ApiPropertyOptional({ description: 'candidate adresses already loaded' })
    candidateAdressesAlreadyLoaded: string[];

    @ApiPropertyOptional({ type: String })
    newsletterType?: NewsletterType = NewsletterType.Email;

    @ApiPropertyOptional({ description: 'filter newsletter by jobIds' })
    jobIds?: string;
}

export class GetCandidatesCountResponse extends GenericResponse {
    @ApiPropertyOptional()
    candidatesCount?: number;

    @ApiPropertyOptional({ type: () => CandidateDto, isArray: true })
    candidates: CandidateDto[];
}

export class GetNewsletterCandidateApplicationsResponse extends GenericResponse {
    @ApiPropertyOptional()
    candidateApplicationsCount?: number;

    @ApiPropertyOptional({ type: () => CandidateApplicationDto, isArray: true })
    candidateApplications: CandidateApplicationDto[];
}

export class UnsubscribeFromNewsletterRequest {
    @ApiProperty()
    guid: string;
}

export class SendNewsletterWithContactsResponse extends SendNewsletterResponse {
    contactsList?: EmailAddress[];
}
