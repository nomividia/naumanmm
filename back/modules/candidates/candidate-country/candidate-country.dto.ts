import { ApiPropertyOptional } from '@nestjs/swagger';
import { CandidateApplicationDto } from '../../candidates-application/candidate-application-dto';
import { CandidateDto } from '../candidate-dto';

export class CandidateCountryDto {
    @ApiPropertyOptional()
    candidateId?: string;

    @ApiPropertyOptional()
    id?: string;

    @ApiPropertyOptional({ type: () => CandidateDto })
    candidate?: CandidateDto;

    @ApiPropertyOptional()
    country?: string;

    @ApiPropertyOptional()
    candidateApplicationId?: string;

    @ApiPropertyOptional({ type: () => CandidateApplicationDto })
    candidateApplication?: CandidateApplicationDto;
}
