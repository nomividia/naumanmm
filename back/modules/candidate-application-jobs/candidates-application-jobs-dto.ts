import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseSearchResponse } from '../../models/responses/base-search-responses';
import { GenericResponse } from '../../models/responses/generic-response';
import { CandidateApplicationDto } from '../candidates-application/candidate-application-dto';
import { JobOfferDto } from '../job-offers/job-offer-dto';

export class CandidateApplicationJobsDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    public creationDate?: Date;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    public modifDate?: Date;

    @ApiProperty()
    candidateApplicationId?: string;

    @ApiPropertyOptional({ type: () => CandidateApplicationDto })
    candidateApplication?: CandidateApplicationDto;

    @ApiProperty()
    jobOfferId: string;

    @ApiPropertyOptional({ type: () => JobOfferDto })
    jobOffer?: JobOfferDto;
}

export class GetCandidateApplicationJobResponse extends GenericResponse {
    @ApiProperty({ type: () => CandidateApplicationJobsDto })
    candidateApplicationJob: CandidateApplicationJobsDto;
}

export class GetCandidateApplicationJobsResponse extends BaseSearchResponse {
    @ApiProperty({ type: () => CandidateApplicationJobsDto, isArray: true })
    candidateApplicationJobs: CandidateApplicationJobsDto[] = [];
}
