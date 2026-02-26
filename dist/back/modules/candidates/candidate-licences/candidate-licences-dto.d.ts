import { AppValueDto } from '../../../models/dto/app-value-dto';
import { CandidateDto } from '../candidate-dto';
export declare class CandidateLicenceDto {
    id?: string;
    candidate?: CandidateDto;
    candidateId?: string;
    licence?: AppValueDto;
    licenceId?: string;
    countryCode?: string;
}
