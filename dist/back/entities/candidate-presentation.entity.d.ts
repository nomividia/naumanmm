import { CandidatePresentationDto } from '../modules/candidate-presentations/candidate-presentation-dto';
import { Candidate } from '../modules/candidates/candidate.entity';
import { AppBaseEntity } from './base-entity';
export declare class CandidatePresentation extends AppBaseEntity {
    title: string;
    content?: string;
    candidate?: Candidate;
    candidateId: string;
    isDefault?: boolean;
    displayOrder?: number;
    toDto(): CandidatePresentationDto;
    fromDto(dto: CandidatePresentationDto): void;
}
