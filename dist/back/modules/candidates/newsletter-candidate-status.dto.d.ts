import { AppValueDto } from '../../models/dto/app-value-dto';
import { NewsletterDto } from '../newsletter/newsletter.dto';
export declare class NewsLetterCandidateStatusDto {
    id?: string;
    candidateStatusId?: string;
    newsletterId?: string;
    candidateStatus?: AppValueDto;
    newsLetter?: NewsletterDto;
}
