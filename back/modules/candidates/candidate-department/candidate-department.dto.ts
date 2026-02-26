import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseDto } from '../../../models/dto/base.dto';
import { CandidateApplicationDto } from '../../candidates-application/candidate-application-dto';
import { CandidateDto } from '../candidate-dto';

export class CandidateDepartmentDto extends BaseDto {
    @ApiPropertyOptional()
    candidateId?: string;

    @ApiPropertyOptional({ type: () => CandidateDto })
    candidate?: CandidateDto;

    @ApiPropertyOptional()
    candidateApplicationId?: string;

    @ApiPropertyOptional({ type: () => CandidateApplicationDto })
    candidateApplication?: CandidateApplicationDto;

    @ApiProperty()
    department: string;
}
