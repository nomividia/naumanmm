import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppValueDto } from '../../models/dto/app-value-dto';
import { UserDto } from '../../models/dto/user-dto';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { BaseSearchResponse } from '../../models/responses/base-search-responses';
import { GenericResponse } from '../../models/responses/generic-response';
import { CandidateApplicationJobsDto } from '../candidate-application-jobs/candidates-application-jobs-dto';
import { CandidateApplicationDto } from '../candidates-application/candidate-application-dto';
import { CustomerDto } from '../customer/customer.dto';

export class JobOfferDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    jobDescription: string;

    @ApiProperty()
    ref: string;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    public creationDate?: Date;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    public modifDate?: Date;

    @ApiPropertyOptional()
    city?: string;

    @ApiPropertyOptional()
    country?: string;

    @ApiPropertyOptional()
    countryCode?: string;

    @ApiPropertyOptional()
    consultantId?: string;

    @ApiPropertyOptional({ type: () => UserDto })
    consultant?: UserDto;

    @ApiPropertyOptional()
    salary?: string;

    @ApiPropertyOptional()
    publicLink?: string;

    @ApiProperty()
    jobId: string;

    @ApiPropertyOptional({ type: () => AppValueDto })
    job?: AppValueDto;

    @ApiPropertyOptional()
    taskResponsabilitiesDescription?: string;

    @ApiPropertyOptional()
    candidateProfileDescription?: string;

    @ApiPropertyOptional()
    conditionsDescription?: string;

    @ApiPropertyOptional()
    applyInCouple?: boolean;

    @ApiPropertyOptional()
    contractTypeId: string;

    @ApiPropertyOptional({ type: () => AppValueDto })
    contractType?: AppValueDto;

    @ApiPropertyOptional({
        type: () => CandidateApplicationJobsDto,
        isArray: true,
    })
    candidateApplicationJobs?: CandidateApplicationJobsDto[];

    @ApiPropertyOptional()
    disabled?: boolean;

    @ApiPropertyOptional()
    customerId?: string;

    @ApiPropertyOptional({ type: () => CustomerDto })
    customer?: CustomerDto;

    @ApiPropertyOptional()
    stateId?: string;

    @ApiPropertyOptional({ type: () => AppValueDto })
    state?: AppValueDto;

    @ApiPropertyOptional({ type: () => CandidateApplicationDto, isArray: true })
    candidateApplications?: CandidateApplicationDto[];
}

export class GetJobOfferResponse extends GenericResponse {
    @ApiProperty({ type: () => JobOfferDto })
    jobOffer: JobOfferDto;
}

export class GetJobOffersResponse extends BaseSearchResponse {
    @ApiProperty({ type: () => JobOfferDto, isArray: true })
    jobOffers: JobOfferDto[] = [];
}

export class GetJobOfferRequest extends BaseSearchRequest {
    @ApiPropertyOptional({ description: 'filter job offers by jobs' })
    jobIds?: string;

    @ApiPropertyOptional({ description: 'filter job offer by country code' })
    countryCode?: string;

    @ApiPropertyOptional({ description: 'filter job offer by consultant' })
    consultantIds?: string;

    @ApiPropertyOptional({
        type: String,
        description: 'filter job offer with relationship selected',
    })
    applyInCouple?: 'true' | 'false';

    @ApiPropertyOptional({ description: 'filter job by status archive or not' })
    status?: 'true' | 'false';

    @ApiPropertyOptional({ description: 'filter by city' })
    city?: string;

    @ApiPropertyOptional({ description: 'filter by contractType' })
    contractTypeId?: string;

    @ApiPropertyOptional({ description: 'filter by customerIds' })
    customerIds?: string;

    @ApiPropertyOptional({ description: 'filter by contractTypeIds' })
    contractTypeIds?: string;

    @ApiPropertyOptional({ description: 'filter by stateId' })
    stateId?: string;

    @ApiPropertyOptional({
        description:
            'exclude job offers that already have candidates placed to them',
        type: String,
    })
    excludePlacedJobOffers?: 'true' | 'false';
}

export class SendJobOfferByMailRequest {
    @ApiProperty()
    object: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    content: string;

    @ApiProperty()
    sender: string;
}
