import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationBaseModelService } from '../../services/base-model.service';
import {
    GetNewsletterTemplateResponse,
    GetNewsletterTemplatesResponse,
    NewsletterTemplateDto,
} from './newsletter-template.dto';
import { NewsletterTemplate } from './newsletter-template.entity';

@Injectable()
export class NewsletterTemplatesService extends ApplicationBaseModelService<
    NewsletterTemplate,
    NewsletterTemplateDto,
    GetNewsletterTemplateResponse,
    GetNewsletterTemplatesResponse
> {
    constructor(
        @InjectRepository(NewsletterTemplate)
        public readonly repository: Repository<NewsletterTemplate>,
    ) {
        super();

        this.modelOptions = {
            getManyResponse: GetNewsletterTemplatesResponse,
            getOneResponse: GetNewsletterTemplateResponse,
            getManyResponseField: 'newsletterTemplates',
            getOneResponseField: 'newsletterTemplate',
            getManyRelations: [],
            getOneRelations: [],
            repository: this.repository,
            entity: NewsletterTemplate,
            archiveField: 'disabled',
            archiveFieldValue: true,
        };
    }
}
