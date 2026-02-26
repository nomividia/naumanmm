import { ApiPropertyOptional } from '@nestjs/swagger';
import { CandidateReadonlyField } from '../../../../shared/shared-constants';

export class CandidateReadonlyPropertyDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiPropertyOptional()
    candidateId?: string;

    @ApiPropertyOptional({ type: String })
    candidateReadonlyField?: CandidateReadonlyField;
}
