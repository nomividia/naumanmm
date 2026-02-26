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
import { RolesList } from '../../../shared/shared-constants';
import { AppErrorWithMessage } from '../../models/app-error';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { GenericResponse } from '../../models/responses/generic-response';
import { RolesGuard } from '../../services/guards/roles-guard';
import { Roles } from '../../services/roles.decorator';
import { BaseController } from '../../shared/base.controller';
import { HistoriesService } from './histories.service';
import {
    GetHistoriesResponse,
    GetHistoryRequest,
    GetHistoryResponse,
    HistoryDto,
} from './history.dto';
import { History } from './history.entity';

@ApiTags('history')
@Controller('history')
export class HistoriesController extends BaseController {
    constructor(private historiesService: HistoriesService) {
        super();
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Get('getAll')
    @ApiOperation({
        summary: 'Get all histories',
        operationId: 'getAllHistories',
    })
    @ApiResponse({
        status: 200,
        description: 'Get all histories',
        type: GetHistoriesResponse,
    })
    @HttpCode(200)
    async getAll(@Query() request: GetHistoryRequest) {
        const findOptions =
            BaseSearchRequest.getDefaultFindOptions<History>(request);

        findOptions.where = {
            entityId: request.entityId,
        };

        return await this.historiesService.findAll(findOptions);
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @ApiBearerAuth()
    @Get('get/:id')
    @ApiOperation({ summary: 'Get history', operationId: 'getHistory' })
    @ApiResponse({
        status: 200,
        description: 'Get my history',
        type: GetHistoryResponse,
    })
    @HttpCode(200)
    async get(@Param('id') id: string): Promise<GetHistoryResponse> {
        return await this.historiesService.findOne({ where: { id: id } });
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Post('createOrUpdate')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Create or update history',
        operationId: 'createOrUpdateHistory',
    })
    @ApiResponse({
        status: 200,
        description: 'Create or update history',
        type: GetHistoryResponse,
    })
    @HttpCode(200)
    async createOrUpdate(
        @Body() history: HistoryDto,
    ): Promise<GetHistoryResponse> {
        if (!history) {
            throw new AppErrorWithMessage('Invalid Request');
        }

        return await this.historiesService.createOrUpdate(history);
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Delete('delete/:ids')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete history', operationId: 'deleteHistory' })
    @ApiResponse({
        status: 200,
        description: 'Delete history',
        type: GenericResponse,
    })
    @HttpCode(200)
    async delete(@Param('ids') ids: string): Promise<GenericResponse> {
        return await this.historiesService.delete(ids.split(','));
    }
}
