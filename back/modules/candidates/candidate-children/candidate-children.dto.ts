import { ApiPropertyOptional } from '@nestjs/swagger';

export class CandidateChildrenDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiPropertyOptional()
    candidateId?: string;

    @ApiPropertyOptional()
    childNumber?: number;

    @ApiPropertyOptional()
    age?: number;

    @ApiPropertyOptional()
    stringValue?: string;

    @ApiPropertyOptional()
    isDependent?: boolean;
}
