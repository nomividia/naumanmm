import { CandidateApplicationDto } from '../../candidates-application/candidate-application-dto';
import { CandidateDto } from '../candidate-dto';
export declare class CandidateCountryDto {
    candidateId?: string;
    id?: string;
    candidate?: CandidateDto;
    country?: string;
    candidateApplicationId?: string;
    candidateApplication?: CandidateApplicationDto;
}
