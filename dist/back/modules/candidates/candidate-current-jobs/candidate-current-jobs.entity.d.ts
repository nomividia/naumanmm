import { AppValue } from '../../../entities/app-value.entity';
import { AppBaseEntity } from '../../../entities/base-entity';
import { Candidate } from '../candidate.entity';
import { CandidateCurrentJobDto } from './candidate-current-jobs.dto';
export declare class CandidateCurrentJob extends AppBaseEntity {
    candidateId?: string;
    candidate?: Candidate;
    currentJobId?: string;
    currentJob?: AppValue;
    toDto(): CandidateCurrentJobDto;
    fromDto(dto: CandidateCurrentJobDto): void;
}
