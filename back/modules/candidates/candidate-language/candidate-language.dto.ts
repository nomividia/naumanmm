import { ApiPropertyOptional } from '@nestjs/swagger';
import { AppValueDto } from '../../../models/dto/app-value-dto';
import { CandidateDto } from '../candidate-dto';

export class CandidateLanguageDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiPropertyOptional()
    languageCode?: string;

    @ApiPropertyOptional({ type: () => CandidateDto })
    candidate?: CandidateDto;

    @ApiPropertyOptional({ type: () => AppValueDto })
    levelLanguage?: AppValueDto;

    @ApiPropertyOptional()
    candidateId?: string;

    @ApiPropertyOptional()
    levelLanguageId?: string;

    @ApiPropertyOptional()
    languageString?: string;

    @ApiPropertyOptional()
    isPartnerLanguage?: boolean;
}
