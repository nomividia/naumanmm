import { AppBaseEntity } from '../../../entities/base-entity';
import { Candidate } from '../candidate.entity';
import { CandidateChildrenDto } from './candidate-children.dto';
export declare class CandidateChildren extends AppBaseEntity {
    candidate?: Candidate;
    candidateId: string;
    childNumber?: number;
    age?: number;
    isDependent: boolean;
    toDto(): CandidateChildrenDto;
    fromDto(dto: CandidateChildrenDto): void;
}
