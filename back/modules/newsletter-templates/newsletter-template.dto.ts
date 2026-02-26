import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseDto } from '../../models/dto/base.dto';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { BaseSearchResponse } from '../../models/responses/base-search-responses';
import { GenericResponse } from '../../models/responses/generic-response';

export class NewsletterTemplateDto extends BaseDto {
    @ApiProperty()
    content: string;

    @ApiProperty()
    title: string;

    @ApiPropertyOptional()
    subject?: string;
}

export class GetNewsletterTemplateResponse extends GenericResponse {
    @ApiPropertyOptional({ type: () => NewsletterTemplateDto })
    newsletterTemplate?: NewsletterTemplateDto;
}

export class GetNewsletterTemplatesResponse extends BaseSearchResponse {
    @ApiPropertyOptional({ type: () => NewsletterTemplateDto, isArray: true })
    newsletterTemplates?: NewsletterTemplateDto[] = [];
}

export class GetNewsletterTemplatesRequest extends BaseSearchRequest {}
