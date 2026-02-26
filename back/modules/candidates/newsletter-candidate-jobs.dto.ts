import { ApiPropertyOptional } from '@nestjs/swagger';
import { AppValueDto } from '../../models/dto/app-value-dto';
import { NewsletterDto } from '../newsletter/newsletter.dto';

export class NewsLetterCandidateJobsDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiPropertyOptional()
    jobTypeId?: string;

    @ApiPropertyOptional()
    newsLetterId?: string;

    @ApiPropertyOptional({ type: () => AppValueDto })
    jobType?: AppValueDto;

    @ApiPropertyOptional({ type: () => NewsletterDto })
    newsLetter?: NewsletterDto;
}
