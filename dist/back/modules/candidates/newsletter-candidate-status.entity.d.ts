import { AppValue } from '../../entities/app-value.entity';
import { AppBaseEntity } from '../../entities/base-entity';
import { Newsletter } from '../newsletter/newsletter.entity';
import { NewsLetterCandidateStatusDto } from './newsletter-candidate-status.dto';
export declare class NewsLetterCandidateStatus extends AppBaseEntity {
    candidateStatusId?: string;
    candidateStatus: AppValue;
    newsletterId?: string;
    newsLetter: Newsletter;
    toDto(): NewsLetterCandidateStatusDto;
    fromDto(dto: NewsLetterCandidateStatusDto): void;
}
