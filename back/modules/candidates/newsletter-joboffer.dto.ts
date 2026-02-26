import { ApiPropertyOptional } from '@nestjs/swagger';
import { JobOfferDto } from '../job-offers/job-offer-dto';
import { NewsletterDto } from '../newsletter/newsletter.dto';

export class NewsletterJobOfferDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiPropertyOptional()
    newsletterId?: string;

    @ApiPropertyOptional()
    jobofferId?: string;

    @ApiPropertyOptional({ type: () => NewsletterDto })
    newsletter?: NewsletterDto;

    @ApiPropertyOptional({ type: () => JobOfferDto })
    joboffer?: JobOfferDto;
}
