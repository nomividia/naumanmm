import { AppValue } from '../../../entities/app-value.entity';
import { AppBaseEntity } from '../../../entities/base-entity';
import { Candidate } from '../candidate.entity';
import { CandidateLicenceDto } from './candidate-licences-dto';
export declare class CandidateLicence extends AppBaseEntity {
    candidate?: Candidate;
    candidateId?: string;
    licence?: AppValue;
    licenceId?: string;
    countryCode?: string;
    toDto(): CandidateLicenceDto;
    fromDto(dto: CandidateLicenceDto): void;
}
