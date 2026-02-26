import { AppValue } from '../../entities/app-value.entity';
import { AppBaseEntity } from '../../entities/base-entity';
import { CandidateContractDto } from './candidate-contract.dto';
import { Candidate } from './candidate.entity';
export declare class CandidateContract extends AppBaseEntity {
    candidateId?: string;
    candidate?: Candidate;
    contractTypeId?: string;
    contractType?: AppValue;
    toDto(): CandidateContractDto;
    fromDto(dto: CandidateContractDto): void;
}
