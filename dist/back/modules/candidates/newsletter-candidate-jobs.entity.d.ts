import { AppValue } from '../../entities/app-value.entity';
import { AppBaseEntity } from '../../entities/base-entity';
import { Newsletter } from '../newsletter/newsletter.entity';
import { NewsLetterCandidateJobsDto } from './newsletter-candidate-jobs.dto';
export declare class NewsLetterCandidateJobs extends AppBaseEntity {
    jobTypeId?: string;
    jobType?: AppValue;
    newsLetterId?: string;
    newsLetter?: Newsletter;
    toDto(): NewsLetterCandidateJobsDto;
    fromDto(dto: NewsLetterCandidateJobsDto): void;
}
