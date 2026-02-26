import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MMIAgencyCode } from '../../../shared/interview-helpers';
import { InterviewConfirmationStatus } from '../../../shared/shared-constants';
import { UserDto } from '../../models/dto/user-dto';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { BaseSearchResponse } from '../../models/responses/base-search-responses';
import { GenericResponse } from '../../models/responses/generic-response';
import { CandidateDto } from '../candidates/candidate-dto';

export class InterviewDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    creationDate?: Date;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    modifDate?: Date;

    @ApiPropertyOptional()
    candidateId: string;

    @ApiPropertyOptional({ type: () => CandidateDto })
    candidate?: CandidateDto;

    @ApiPropertyOptional({ type: () => String, format: 'date-time' })
    date?: Date;

    @ApiPropertyOptional()
    title?: string;

    @ApiPropertyOptional()
    comment?: string;

    @ApiPropertyOptional()
    consultantId?: string;

    @ApiPropertyOptional({ type: () => UserDto })
    consultant?: UserDto;

    @ApiPropertyOptional()
    guid?: string;

    @ApiPropertyOptional({ type: String })
    candidateResponse?: InterviewConfirmationStatus;

    @ApiPropertyOptional({ type: String })
    agencyPlace?: MMIAgencyCode;

    @ApiPropertyOptional({ description: 'Whether the candidate did not show up to the interview' })
    noShow?: boolean;
}

export class GetInterviewResponse extends GenericResponse {
    @ApiProperty({ type: () => InterviewDto })
    interview: InterviewDto;
}
export class SaveInterviewResponseResponse extends GetInterviewResponse {
    @ApiProperty()
    alreadyAccepted: boolean;

    @ApiProperty()
    alreadyRefused: boolean;
}
export class GetInterviewsResponse extends BaseSearchResponse {
    @ApiProperty({ type: () => InterviewDto, isArray: true })
    interviews: InterviewDto[] = [];
}

export class CheckCandidatesInterviewEligibilityRequest {
    @ApiProperty({ description: 'List of candidate IDs to check', type: [String] })
    candidateIds: string[];
}

export class CandidateInterviewEligibility {
    @ApiProperty({ description: 'The candidate ID' })
    candidateId: string;

    @ApiProperty({ description: 'Whether the candidate is eligible (has recent interview with current consultant)' })
    isEligible: boolean;

    @ApiProperty({ description: 'Date of the last interview with current consultant', required: false })
    lastInterviewDate?: Date;
}

export class CheckCandidatesInterviewEligibilityResponse extends GenericResponse {
    @ApiProperty({ type: () => CandidateInterviewEligibility, isArray: true })
    eligibilities: CandidateInterviewEligibility[] = [];
}

export class GetInterviewsRequest extends BaseSearchRequest {
    @ApiPropertyOptional({ description: 'filter interviews by candidate' })
    candidateId?: string;

    @ApiPropertyOptional({ description: 'filter interview by month' })
    interviewFilterMonth: string;

    @ApiPropertyOptional({ description: 'filter interview by year' })
    interviewFilterYear: string;

    @ApiPropertyOptional({
        type: String,
        description: 'filter interview by a date',
    })
    interviewCurrentDate: 'past' | 'coming';

    @ApiPropertyOptional({
        type: String,
        description: 'filter interview by place',
    })
    interviewPlace: MMIAgencyCode;

    @ApiPropertyOptional({
        type: String,
        description: 'filter by interview confirmation status',
    })
    interviewConfirmationStatus?: InterviewConfirmationStatus;

    @ApiPropertyOptional({
        type: Boolean,
        description: 'filter by no-show status',
    })
    noShow?: boolean;
}
