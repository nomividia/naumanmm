import { AppValueDto } from '../../../models/dto/app-value-dto';
import { CandidateDto } from '../candidate-dto';
export declare class CandidateLanguageDto {
    id?: string;
    languageCode?: string;
    candidate?: CandidateDto;
    levelLanguage?: AppValueDto;
    candidateId?: string;
    levelLanguageId?: string;
    languageString?: string;
    isPartnerLanguage?: boolean;
}
