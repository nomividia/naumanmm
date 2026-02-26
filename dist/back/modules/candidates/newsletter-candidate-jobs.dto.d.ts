import { AppValueDto } from '../../models/dto/app-value-dto';
import { NewsletterDto } from '../newsletter/newsletter.dto';
export declare class NewsLetterCandidateJobsDto {
    id?: string;
    jobTypeId?: string;
    newsLetterId?: string;
    jobType?: AppValueDto;
    newsLetter?: NewsletterDto;
}
