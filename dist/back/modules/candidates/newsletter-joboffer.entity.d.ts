import { AppBaseEntity } from '../../entities/base-entity';
import { JobOffer } from '../job-offers/job-offer.entity';
import { Newsletter } from '../newsletter/newsletter.entity';
import { NewsletterJobOfferDto } from './newsletter-joboffer.dto';
export declare class NewsletterJobOffer extends AppBaseEntity {
    jobOfferId?: string;
    newsletterId?: string;
    jobOffer?: JobOffer;
    newsletter?: Newsletter;
    toDto(): NewsletterJobOfferDto;
    fromDto(dto: NewsletterJobOfferDto): void;
}
