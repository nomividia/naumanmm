import { ApiPropertyOptional } from '@nestjs/swagger';
import { AppValueDto } from '../../../models/dto/app-value-dto';
import { CandidateDto } from '../candidate-dto';

export class CandidateCurrentJobDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiPropertyOptional()
    candidateId?: string;

    @ApiPropertyOptional({ type: () => CandidateDto })
    candidate?: CandidateDto;

    @ApiPropertyOptional()
    currentJobId?: string;

    @ApiPropertyOptional({ type: () => AppValueDto })
    currentJob?: AppValueDto;
}
