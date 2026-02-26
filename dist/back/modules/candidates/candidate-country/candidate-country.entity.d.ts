import { AppBaseEntity } from '../../../entities/base-entity';
import { CandidateApplication } from '../../candidates-application/candidate-application.entity';
import { Candidate } from '../candidate.entity';
import { CandidateCountryDto } from './candidate-country.dto';
export declare class CandidateCountry extends AppBaseEntity {
    candidateId?: string;
    candidate?: Candidate;
    candidateApplicationId?: string;
    candidateApplication?: CandidateApplication;
    country?: string;
    toDto(): CandidateCountryDto;
    fromDto(dto: CandidateCountryDto): void;
}
