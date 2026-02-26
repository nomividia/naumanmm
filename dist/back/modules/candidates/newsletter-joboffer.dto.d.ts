import { JobOfferDto } from '../job-offers/job-offer-dto';
import { NewsletterDto } from '../newsletter/newsletter.dto';
export declare class NewsletterJobOfferDto {
    id?: string;
    newsletterId?: string;
    jobofferId?: string;
    newsletter?: NewsletterDto;
    joboffer?: JobOfferDto;
}
