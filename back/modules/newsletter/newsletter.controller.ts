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
import { FindConditions, In, Like, Raw } from 'typeorm';
import { RolesList } from '../../../shared/shared-constants';
import { AppErrorWithMessage } from '../../models/app-error';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { GenericResponse } from '../../models/responses/generic-response';
import { AuthToolsService } from '../../services/auth-tools.service';
import { RolesGuard } from '../../services/guards/roles-guard';
import { ReferentialService } from '../../services/referential.service';
import { Roles } from '../../services/roles.decorator';
import { ApiMainHelpers } from '../../services/tools/helpers.service';
import { BaseController } from '../../shared/base.controller';
import {
    GetCandidatesCountRequest,
    GetCandidatesCountResponse,
    GetNewsletterCandidateApplicationsRequest,
    GetNewsletterCandidateApplicationsResponse,
    GetNewsletterResponse,
    GetNewslettersRequest,
    GetNewslettersResponse,
    NewsletterDto,
    UnsubscribeFromNewsletterRequest,
} from './newsletter.dto';
import { Newsletter } from './newsletter.entity';
import { NewsletterService } from './newsletter.service';

@Controller('newsletter')
@ApiTags('newsletter')
export class NewsletterController extends BaseController {
    constructor(
        private newsletterService: NewsletterService,
        private referentialService: ReferentialService,
        private authToolsService: AuthToolsService,
    ) {
        super();
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin, RolesList.AdminTech, RolesList.Newsletter)
    @Get('previewNewsletter/:id')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'previewNewsletter',
        operationId: 'previewNewsletter',
    })
    @ApiResponse({
        status: 200,
        description: 'previewNewsletter',
        type: GenericResponse,
    })
    @HttpCode(200)
    async previewNewsletter(@Param('id') id: string): Promise<GenericResponse> {
        return await this.newsletterService.previewNewsletter(id);
    }
    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin, RolesList.AdminTech, RolesList.Newsletter)
    @Get('get/:id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get newsletter', operationId: 'getNewsletter' })
    @ApiResponse({
        status: 200,
        description: 'Get newsletter',
        type: GetNewsletterResponse,
    })
    @HttpCode(200)
    async get(@Param('id') id: string): Promise<GetNewsletterResponse> {
        return await this.newsletterService.findOne({ where: { id } });
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin, RolesList.AdminTech, RolesList.Newsletter)
    @Get('getAll')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get all newsletters',
        operationId: 'getAllNewsletters',
    })
    @ApiResponse({
        status: 200,
        description: 'Get all Newsletters',
        type: GetNewslettersResponse,
    })
    @HttpCode(200)
    async getAll(
        @Query() request: GetNewslettersRequest,
    ): Promise<GetNewslettersResponse> {
        const findOptions =
            BaseSearchRequest.getDefaultFindOptions<Newsletter>(request);

        if (request.search) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            findOptions.where = [
                {
                    content: Like('%' + request.search + '%'),
                },
                {
                    title: Like('%' + request.search + '%'),
                },
                {
                    subject: Like('%' + request.search + '%'),
                },
            ];
        }

        if (request.statusIdList) {
            const statusIdList = request.statusIdList.split(',');
            // console.log('statusIdList', statusIdList);
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            for (const whereFilter of findOptions.where as FindConditions<Newsletter>[]) {
                whereFilter.newsletterStatusId = In(statusIdList);
            }
        }

        if (request.month && request.year) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            for (const where of findOptions.where as FindConditions<Newsletter>[]) {
                where.creationDate = Raw(
                    (alias) =>
                        `${alias} IS NOT NULL AND MONTH(${alias})=${ApiMainHelpers.mysql_real_escape_string(
                            request.month,
                        )}  AND YEAR(${alias})=${ApiMainHelpers.mysql_real_escape_string(
                            request.year,
                        )}`,
                );
            }
        } else if (request.year) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            for (const where of findOptions.where as FindConditions<Newsletter>[]) {
                where.creationDate = Raw(
                    (alias) =>
                        `${alias} IS NOT NULL AND YEAR(${alias})=${ApiMainHelpers.mysql_real_escape_string(
                            request.year,
                        )}`,
                );
            }
        }

        return await this.newsletterService.findAll(findOptions);
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin, RolesList.AdminTech)
    @Delete('delete/:ids')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Delete newsletters',
        operationId: 'deleteNewsletters',
    })
    @ApiResponse({
        status: 200,
        description: 'Delete newsletters',
        type: GenericResponse,
    })
    @HttpCode(200)
    async delete(@Param('ids') ids: string): Promise<GenericResponse> {
        return await this.newsletterService.delete(ids.split(','));
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin, RolesList.AdminTech)
    @Post('archive/:id')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'archive newsletter',
        operationId: 'archiveNewsletter',
    })
    @ApiResponse({
        status: 200,
        description: 'archive newsletter',
        type: GetNewsletterResponse,
    })
    @HttpCode(200)
    async archive(@Param('id') id: string): Promise<GetNewsletterResponse> {
        return await this.newsletterService.archiveNewslettersStatus(id);
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin, RolesList.AdminTech, RolesList.Newsletter)
    @Post('createOrUpdate')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Create or update newsletter',
        operationId: 'createOrUpdateNewsletter',
    })
    @ApiResponse({
        status: 200,
        description: 'Create or update newsletter',
        type: GetNewsletterResponse,
    })
    @HttpCode(200)
    async createOrUpdate(
        @Body() newsletterDto: NewsletterDto,
    ): Promise<GetNewsletterResponse> {
        if (!newsletterDto) {
            throw new AppErrorWithMessage('Invalid Request');
        }

        const payload = this.authToolsService.getCurrentPayload(false);
        return await this.newsletterService.createOrUpdate(
            newsletterDto,
            payload?.mail,
        );
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin, RolesList.AdminTech, RolesList.Newsletter)
    @Post('sendNewsletter/:id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'send Newsletter', operationId: 'sendNewsletter' })
    @ApiResponse({
        status: 200,
        description: 'send Newsletter',
        type: GenericResponse,
    })
    @HttpCode(200)
    async sendNewsletter(@Param('id') id: string): Promise<GenericResponse> {
        if (!id) {
            throw new AppErrorWithMessage('Invalid Request');
        }

        const payload = this.authToolsService.getCurrentPayload(false);
        return await this.newsletterService.sendNewsletter(id, payload?.mail);
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin, RolesList.AdminTech, RolesList.Newsletter)
    @Post('getNewsletterCandidates')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'count candidates for newletter ',
        operationId: 'getNewsletterCandidates',
    })
    @ApiResponse({
        status: 200,
        description: 'count candidates for newletter',
        type: GetCandidatesCountResponse,
    })
    @HttpCode(200)
    async getNewsletterCandidates(
        @Query() request: GetCandidatesCountRequest,
    ): Promise<GetCandidatesCountResponse> {
        if (!request) {
            throw new AppErrorWithMessage('Invalid Request');
        }

        return await this.newsletterService.getNewsletterCandidates(
            request,
            false,
        );
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin, RolesList.AdminTech, RolesList.Newsletter)
    @Post('getNewsletterCandidateApplications')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'count candidate applications for newletter ',
        operationId: 'getNewsletterCandidateApplications',
    })
    @ApiResponse({
        status: 200,
        description: 'count candidate applications for newletter',
        type: GetNewsletterCandidateApplicationsResponse,
    })
    @HttpCode(200)
    async getNewsletterCandidateApplications(
        @Query() request: GetNewsletterCandidateApplicationsRequest,
    ): Promise<GetNewsletterCandidateApplicationsResponse> {
        if (!request) {
            throw new AppErrorWithMessage('Invalid Request');
        }

        return await this.newsletterService.getNewsletterCandidateApplications(
            request,
            false,
        );
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin, RolesList.AdminTech, RolesList.Newsletter)
    @Post('duplicateNewsletter/:id')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'duplicate Newsletter',
        operationId: 'duplicateNewsletter',
    })
    @ApiResponse({
        status: 200,
        description: 'duplicate Newsletter',
        type: GetNewsletterResponse,
    })
    @HttpCode(200)
    async duplicateNewsletter(
        @Param('id') id: string,
    ): Promise<GetNewsletterResponse> {
        if (!id) {
            throw new AppErrorWithMessage('Invalid Request');
        }

        return await this.newsletterService.duplicateNewsletter(id);
    }

    @Post('unsubscribeFromNewsletter')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'unsubscribe from newsletter',
        operationId: 'unsubscribeFromNewsletter',
    })
    @ApiResponse({
        status: 200,
        description: 'unsubscribe from newsletter',
        type: GenericResponse,
    })
    @HttpCode(200)
    async unsubscribeFromNewsletter(
        @Body() request: UnsubscribeFromNewsletterRequest,
    ): Promise<GenericResponse> {
        if (!request?.guid) {
            throw new AppErrorWithMessage('Invalid Request');
        }

        return await this.newsletterService.unsubscribeFromNewsletter(request);
    }
}
