import { ApiPropertyOptional } from '@nestjs/swagger';
import { AppValueDto } from '../../models/dto/app-value-dto';
import { NewsletterDto } from '../newsletter/newsletter.dto';

export class NewsLetterCandidateStatusDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiPropertyOptional()
    candidateStatusId?: string;

    @ApiPropertyOptional()
    newsletterId?: string;

    @ApiPropertyOptional({ type: () => AppValueDto })
    candidateStatus?: AppValueDto;

    @ApiPropertyOptional({ type: () => NewsletterDto })
    newsLetter?: NewsletterDto;
}
