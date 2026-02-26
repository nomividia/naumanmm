import { ApiPropertyOptional } from '@nestjs/swagger';
import { AppValueDto } from '../../models/dto/app-value-dto';
import { CandidateDto } from './candidate-dto';

export class CandidateContractDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    public creationDate?: Date;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    public modifDate?: Date;

    @ApiPropertyOptional()
    candidateId?: string;

    @ApiPropertyOptional({ type: () => CandidateDto })
    candidate?: CandidateDto;

    @ApiPropertyOptional({ type: () => AppValueDto })
    contractType?: AppValueDto;

    @ApiPropertyOptional()
    contractTypeId?: string;
}
