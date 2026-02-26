import { AppBaseEntity } from '../../../entities/base-entity';
import { Candidate } from '../candidate.entity';
import { CandidatePetDto } from './candidate-pet-dto';
export declare class CandidatePet extends AppBaseEntity {
    candidate?: Candidate;
    candidateId: string;
    petNumber?: number;
    type: string;
    toDto(): CandidatePetDto;
    fromDto(dto: CandidatePetDto): void;
}
