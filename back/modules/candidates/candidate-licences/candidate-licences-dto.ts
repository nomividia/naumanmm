import { ApiPropertyOptional } from '@nestjs/swagger';
import { AppValueDto } from '../../../models/dto/app-value-dto';
import { CandidateDto } from '../candidate-dto';

export class CandidateLicenceDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiPropertyOptional({ type: () => CandidateDto })
    candidate?: CandidateDto;

    @ApiPropertyOptional()
    candidateId?: string;

    @ApiPropertyOptional({ type: () => AppValueDto })
    licence?: AppValueDto;

    @ApiPropertyOptional()
    licenceId?: string;

    @ApiPropertyOptional()
    countryCode?: string;
}
