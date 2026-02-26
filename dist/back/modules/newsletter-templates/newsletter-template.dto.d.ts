import { BaseDto } from '../../models/dto/base.dto';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { BaseSearchResponse } from '../../models/responses/base-search-responses';
import { GenericResponse } from '../../models/responses/generic-response';
export declare class NewsletterTemplateDto extends BaseDto {
    content: string;
    title: string;
    subject?: string;
}
export declare class GetNewsletterTemplateResponse extends GenericResponse {
    newsletterTemplate?: NewsletterTemplateDto;
}
export declare class GetNewsletterTemplatesResponse extends BaseSearchResponse {
    newsletterTemplates?: NewsletterTemplateDto[];
}
export declare class GetNewsletterTemplatesRequest extends BaseSearchRequest {
}
