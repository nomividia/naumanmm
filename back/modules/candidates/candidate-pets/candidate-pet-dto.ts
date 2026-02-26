import { ApiPropertyOptional } from '@nestjs/swagger';

export class CandidatePetDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiPropertyOptional()
    candidateId?: string;

    @ApiPropertyOptional()
    petNumber?: number;

    @ApiPropertyOptional()
    type?: string;

    @ApiPropertyOptional()
    stringValue?: string;
}
