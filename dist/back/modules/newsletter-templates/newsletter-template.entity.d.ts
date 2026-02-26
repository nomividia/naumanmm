import { AppBaseEntity } from '../../entities/base-entity';
import { NewsletterTemplateDto } from './newsletter-template.dto';
export declare class NewsletterTemplate extends AppBaseEntity {
    content: string;
    title: string;
    subject?: string;
    toDto(): NewsletterTemplateDto;
    fromDto(dto: NewsletterTemplateDto): void;
}
