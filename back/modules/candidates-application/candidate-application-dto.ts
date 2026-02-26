import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

export class CandidateApplicationDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    genderId: string;

    @ApiPropertyOptional({ type: () => AppValueDto })
    gender?: AppValueDto;

    @ApiProperty({ type: String, format: 'date-time' })
    birthDate: Date;

    @ApiPropertyOptional()
    partnerFirstName: string;

    @ApiPropertyOptional()
    partnerLastName: string;

    @ApiPropertyOptional()
    partnerGenderId: string;

    @ApiPropertyOptional({ type: () => AppValueDto })
    partnerGender?: AppValueDto;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    partnerBirthDate: Date;

    @ApiPropertyOptional()
    partnerEmail?: string;

    @ApiPropertyOptional()
    partnerPhone?: string;

    @ApiPropertyOptional()
    professionId: string;

    @ApiPropertyOptional({ type: () => AppValueDto })
    profession?: AppValueDto;

    @ApiPropertyOptional({ type: () => AddressDto })
    address?: AddressDto;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    phoneSecondary: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    skills: string; //TODO skill entity

    @ApiProperty()
    relationshipStatusId: string;

    @ApiPropertyOptional({ type: () => AppValueDto })
    relationshipStatus?: AppValueDto;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    public creationDate?: Date;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    public modifDate?: Date;

    @ApiPropertyOptional({ type: () => AppValueDto })
    applyStatus?: AppValueDto;

    @ApiPropertyOptional()
    applyStatusId?: string;

    @ApiProperty()
    inCouple: boolean;

    @ApiProperty()
    spontaneousApplication: boolean;

    @ApiPropertyOptional()
    candidateId?: string;

    @ApiPropertyOptional()
    mainPhotoBase64?: string;

    @ApiPropertyOptional()
    mainPhotoBase64MimeType?: string;

    @ApiPropertyOptional()
    photoFileId?: string;

    @ApiPropertyOptional({ type: () => AppFileDto })
    photoFile?: AppFileDto;

    @ApiPropertyOptional()
    mainResumeFileId?: string;

    @ApiPropertyOptional({ type: () => AppFileDto })
    mainResumeFile?: AppFileDto;

    @ApiPropertyOptional()
    resumeFileBase64?: string;

    @ApiPropertyOptional()
    resumeFileBase64MimeType?: string;

    @ApiPropertyOptional()
    partnerResumeFileId?: string;

    @ApiPropertyOptional({ type: () => AppFileDto })
    partnerResumeFile?: AppFileDto;

    @ApiPropertyOptional()
    partnerResumeFileBase64?: string;

    @ApiPropertyOptional()
    partnerResumeFileBase64MimeType?: string;

    @ApiPropertyOptional()
    seen?: boolean;

    @ApiPropertyOptional({
        type: () => CandidateApplicationJobsDto,
        isArray: true,
    })
    candidateApplicationJobs?: CandidateApplicationJobsDto[];

    @ApiPropertyOptional()
    disabled?: boolean;

    @ApiPropertyOptional()
    jobOfferLinkedRef?: string;

    @ApiPropertyOptional()
    linkedToCandidate?: boolean;

    @ApiPropertyOptional({ type: () => CandidateDto })
    candidate: CandidateDto;

    @ApiPropertyOptional()
    guidExchange?: string;

    // @ApiPropertyOptional({ type: () => String, format: 'date-time' })
    // lastCandidateMessageSendedDate?: Date;

    @ApiPropertyOptional({ type: () => AnonymousExchangeDto, isArray: true })
    anonymousExchanges?: AnonymousExchangeDto[];

    @ApiPropertyOptional()
    newsletterUnsubscribed?: boolean;

    @ApiPropertyOptional()
    newsletterUnsubscribedGuid?: string;

    @ApiPropertyOptional({ type: () => CandidateDepartmentDto, isArray: true })
    candidateDepartments?: CandidateDepartmentDto[];

    @ApiPropertyOptional({ type: () => CandidateCountryDto, isArray: true })
    candidateCountries?: CandidateCountryDto[];

    @ApiPropertyOptional()
    allowed_to_work_us?: boolean;

    @ApiPropertyOptional()
    require_sponsorship_us?: boolean;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    usTermsAcceptedAt?: Date;

    @ApiPropertyOptional()
    usTermsVersion?: string;
}

export class GetCandidateApplicationResponse extends GenericResponse {
    @ApiProperty({ type: () => CandidateApplicationDto })
    candidateApplication: CandidateApplicationDto;
}

export class GetCandidateApplicationsResponse extends BaseSearchResponse {
    @ApiProperty({ type: () => CandidateApplicationDto, isArray: true })
    candidateApplications: CandidateApplicationDto[] = [];
}

export class GetCandidateApplicationsRequest extends BaseSearchRequest {
    @ApiPropertyOptional({
        type: String,
        description: 'select candidates-applications with status selected',
    })
    applyStatus?: string;

    @ApiPropertyOptional({
        type: String,
        description: 'select candidates-applications with status selected',
    })
    candidateStatus?: string;

    @ApiPropertyOptional({
        type: String,
        description:
            'select candidates-applications with relationship selected',
    })
    applyInCouple?: 'true' | 'false';

    @ApiPropertyOptional({
        type: String,
        description: 'select candidates-applications with job offer reference',
    })
    jobOfferRef?: string;

    @ApiPropertyOptional({
        type: String,
        description: 'select candidates-applications with job category',
    })
    jobCategory?: string;

    @ApiPropertyOptional({
        type: String,
        description: 'select candidates-applications with candidate id',
    })
    candidateId?: string;

    @ApiPropertyOptional({
        description: 'filter by status archive or not',
        type: String,
    })
    disabled?: 'true' | 'false';

    @ApiPropertyOptional({
        description: 'filter by status archive or not',
        type: String,
    })
    includeDisabled?: 'true' | 'false';

    @ApiPropertyOptional({ description: 'filter by seen or not', type: String })
    showOnlyUnSeen?: 'true' | 'false';

    @ApiPropertyOptional({
        description: 'filter spontxsaneous application',
        type: String,
    })
    spontaneousApplication?: 'true' | 'false';

    @ApiPropertyOptional({
        description: 'hide spontaneous applications',
        type: String,
    })
    hideSpontaneousApplications?: 'true' | 'false';

    @ApiPropertyOptional({
        description: 'filter only new candidates (not linked to existing candidate)',
        type: String,
    })
    onlyNewCandidate?: 'true' | 'false';

    @ApiPropertyOptional({ description: 'filter by consultant', type: String })
    consultantIds?: string;

    @ApiPropertyOptional({
        type: String,
        description: 'select candidates-applications with job offer id',
    })
    jobOfferId?: string;

    @ApiPropertyOptional({
        description: 'Exclude placed candidate',
        type: String,
    })
    excludePlaced?: 'true' | 'false';

    @ApiPropertyOptional({
        description: 'Filter by city (comma-separated list)',
        type: String,
    })
    city?: string;

    @ApiPropertyOptional({
        description: 'Filter by country codes (comma-separated list)',
        type: String,
    })
    locations?: string;

    @ApiPropertyOptional({
        description: 'Filter by department',
        type: String,
    })
    department?: string;
}

export class SubmitCandidateApplicationFormRequest {
    @ApiProperty({ type: () => CandidateApplicationDto })
    candidateApplication: CandidateApplicationDto;

    @ApiProperty()
    recaptchaToken: string;

    @ApiPropertyOptional({ type: String })
    language: 'fr' | 'en' = 'en';
}

export class RefuseCandidateApplicationRequest {
    @ApiProperty({ description: 'candidate application id' })
    id: string;

    @ApiPropertyOptional({ description: 'create candidate or not' })
    createCandidate?: boolean;

    @ApiPropertyOptional({
        type: () => String,
        isArray: true,
        description: 'candidate current job',
    })
    candidateCurrentJobIds?: string[];

    @ApiPropertyOptional({ description: 'give ats access' })
    giveAtsAccess?: boolean;

    @ApiPropertyOptional({ description: 'candidate gender id' })
    genderId?: string;

    @ApiPropertyOptional({ description: 'is platform' })
    isPlatform?: boolean;
}

export class ValidateCandidateApplicationRequest {
    @ApiProperty({ description: 'candidate application id' })
    id: string;

    @ApiPropertyOptional({
        type: () => String,
        isArray: true,
        description: 'candidate current job',
    })
    candidateCurrentJobIds?: string[];

    @ApiPropertyOptional({ description: 'give ats access' })
    giveAtsAccess?: boolean;

    @ApiPropertyOptional({ description: 'candidate gender id' })
    genderId?: string;
}

export class UnSeenCandidateApplicationResponse extends GenericResponse {
    @ApiProperty()
    unSeenCandidateApplication: number = 0;
}

export class ApplyToJobOffersRequest {
    @ApiProperty({ isArray: true, type: String })
    jobOfferIds: string[];
}

export class GuidExchangeResponse extends GenericResponse {
    @ApiProperty({ type: String })
    guid: string;
}

export class SetCandidateApplicationUnseenRequest {
    @ApiProperty({ type: String })
    candidateApplicationId: string;
}
