import { AppValue } from '../../../entities/app-value.entity';
import { AppBaseEntity } from '../../../entities/base-entity';
import { Candidate } from '../candidate.entity';
import { CandidateLanguageDto } from './candidate-language.dto';
export declare class CandidateLanguage extends AppBaseEntity {
    languageCode?: string;
    candidate?: Candidate;
    levelLanguage?: AppValue;
    candidateId?: string;
    levelLanguageId?: string;
    isPartnerLanguage?: boolean;
    toDto(): CandidateLanguageDto;
    fromDto(dto: CandidateLanguageDto): void;
}
