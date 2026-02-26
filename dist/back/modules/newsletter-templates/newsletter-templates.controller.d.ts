import { GenericResponse } from '../../models/responses/generic-response';
import { BaseController } from '../../shared/base.controller';
import { GetNewsletterTemplateResponse, GetNewsletterTemplatesRequest, GetNewsletterTemplatesResponse, NewsletterTemplateDto } from './newsletter-template.dto';
import { NewsletterTemplatesService } from './newsletter-templates.service';
export declare class NewsletterTemplatesController extends BaseController {
    private newsletterTemplatesService;
    constructor(newsletterTemplatesService: NewsletterTemplatesService);
    getNewsletterTemplate(id: string): Promise<GetNewsletterTemplateResponse>;
    getAllNewsletterTemplates(request: GetNewsletterTemplatesRequest): Promise<GetNewsletterTemplatesResponse>;
    deleteNewsletterTemplates(ids: string): Promise<GenericResponse>;
    archiveNewsletterTemplates(ids: string): Promise<GenericResponse>;
    createOrUpdateNewsletterTemplate(newsletterTemplateDto: NewsletterTemplateDto): Promise<GetNewsletterTemplateResponse>;
}
