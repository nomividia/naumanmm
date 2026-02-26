import { Repository } from 'typeorm';
import { ApplicationBaseModelService } from '../../services/base-model.service';
import { GetNewsletterTemplateResponse, GetNewsletterTemplatesResponse, NewsletterTemplateDto } from './newsletter-template.dto';
import { NewsletterTemplate } from './newsletter-template.entity';
export declare class NewsletterTemplatesService extends ApplicationBaseModelService<NewsletterTemplate, NewsletterTemplateDto, GetNewsletterTemplateResponse, GetNewsletterTemplatesResponse> {
    readonly repository: Repository<NewsletterTemplate>;
    constructor(repository: Repository<NewsletterTemplate>);
}
