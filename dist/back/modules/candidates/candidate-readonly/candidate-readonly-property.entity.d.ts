import { CandidateReadonlyField } from '../../../../shared/shared-constants';
import { Candidate } from '../candidate.entity';
import { CandidateReadonlyPropertyDto } from './candidate-readonly-property.dto';
export declare class CandidateReadonlyProperty {
    id: string;
    candidateReadonlyField: CandidateReadonlyField;
    candidate?: Candidate;
    candidateId?: string;
    toDto(): CandidateReadonlyPropertyDto;
    fromDto(dto: CandidateReadonlyPropertyDto): void;
}
