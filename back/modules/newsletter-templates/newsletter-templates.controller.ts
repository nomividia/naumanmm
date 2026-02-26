import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Like } from 'typeorm';
import { RolesList } from '../../../shared/shared-constants';
import { AppErrorWithMessage } from '../../models/app-error';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { GenericResponse } from '../../models/responses/generic-response';
import { RolesGuard } from '../../services/guards/roles-guard';
import { Roles } from '../../services/roles.decorator';
import { BaseController } from '../../shared/base.controller';
import {
    GetNewsletterTemplateResponse,
    GetNewsletterTemplatesRequest,
    GetNewsletterTemplatesResponse,
    NewsletterTemplateDto,
} from './newsletter-template.dto';
import { NewsletterTemplate } from './newsletter-template.entity';
import { NewsletterTemplatesService } from './newsletter-templates.service';

@Controller('newsletter-templates')
@ApiTags('newsletter-templates')
export class NewsletterTemplatesController extends BaseController {
    constructor(
        private newsletterTemplatesService: NewsletterTemplatesService,
    ) {
        super();
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.Newsletter,
    )
    @Get('getNewsletterTemplate/:id')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get newsletter template',
        operationId: 'getNewsletterTemplate',
    })
    @ApiResponse({
        status: 200,
        description: 'Get newsletter template',
        type: GetNewsletterTemplateResponse,
    })
    @HttpCode(200)
    async getNewsletterTemplate(
        @Param('id') id: string,
    ): Promise<GetNewsletterTemplateResponse> {
        return await this.newsletterTemplatesService.findOne({ where: { id } });
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.Newsletter,
    )
    @Get('getAllNewsletterTemplates')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get all newsletter templates',
        operationId: 'getAllNewsletterTemplates',
    })
    @ApiResponse({
        status: 200,
        description: 'Get all newsletter templates',
        type: GetNewsletterTemplatesResponse,
    })
    @HttpCode(200)
    async getAllNewsletterTemplates(
        @Query() request: GetNewsletterTemplatesRequest,
    ): Promise<GetNewsletterTemplatesResponse> {
        const findOptions =
            BaseSearchRequest.getDefaultFindOptions<NewsletterTemplate>(
                request,
            );

        if (request.search) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            findOptions.where = [
                {
                    content: Like('%' + request.search + '%'),
                },
            ];
        }

        return await this.newsletterTemplatesService.findAll(findOptions);
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.Newsletter,
    )
    @Delete('deleteNewsletterTemplates/:ids')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Delete newsletter templates',
        operationId: 'deleteNewsletterTemplates',
    })
    @ApiResponse({
        status: 200,
        description: 'Delete newsletter templates',
        type: GenericResponse,
    })
    @HttpCode(200)
    async deleteNewsletterTemplates(
        @Param('ids') ids: string,
    ): Promise<GenericResponse> {
        return await this.newsletterTemplatesService.delete(ids.split(','));
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.Newsletter,
    )
    @Post('archiveNewsletterTemplates/:ids')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Archive newsletter templates',
        operationId: 'archiveNewsletterTemplates',
    })
    @ApiResponse({
        status: 200,
        description: 'archive newsletter templates',
        type: GenericResponse,
    })
    @HttpCode(200)
    async archiveNewsletterTemplates(
        @Param('ids') ids: string,
    ): Promise<GenericResponse> {
        return await this.newsletterTemplatesService.archive(ids.split(','));
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.Newsletter,
    )
    @Post('createOrUpdateNewsletterTemplate')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Create or update newsletter template',
        operationId: 'createOrUpdateNewsletterTemplate',
    })
    @ApiResponse({
        status: 200,
        description: 'Create or update newsletter template',
        type: GetNewsletterTemplateResponse,
    })
    @HttpCode(200)
    async createOrUpdateNewsletterTemplate(
        @Body() newsletterTemplateDto: NewsletterTemplateDto,
    ): Promise<GetNewsletterTemplateResponse> {
        if (!newsletterTemplateDto) {
            throw new AppErrorWithMessage('Invalid Request');
        }

        return await this.newsletterTemplatesService.createOrUpdate(
            newsletterTemplateDto,
        );
    }
}
