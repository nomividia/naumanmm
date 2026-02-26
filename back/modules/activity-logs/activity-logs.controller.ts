import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { LinqRepository } from 'typeorm-linq-repository';
import { RolesList } from '../../../shared/shared-constants';
import { AppValue } from '../../entities/app-value.entity';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { LinqMultipleQueryWrapper } from '../../services/base-model.service';
import { RolesGuard } from '../../services/guards/roles-guard';
import { Roles } from '../../services/roles.decorator';
import { BaseController } from '../../shared/base.controller';
import { GetActivityLogsResponse } from './activity-log-dto';
import { ActivityLog } from './activity-log.entity';
import { ActivityLogsService } from './activity-logs.service';

@Controller('activity-logs')
@ApiTags('activity-logs')
export class ActivityLogsController extends BaseController {
    constructor(private activityLogsService: ActivityLogsService) {
        super();
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin)
    @Get()
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get all activity logs',
        operationId: 'getActivityLogs',
    })
    @ApiResponse({
        status: 200,
        description: 'Get activity logs',
        type: GetActivityLogsResponse,
    })
    @HttpCode(200)
    async getAll(
        @Query() request: BaseSearchRequest,
    ): Promise<GetActivityLogsResponse> {
        let query = BaseSearchRequest.getDefaultFindOptionsLinq(
            request,
            ActivityLog,
        );

        if (request.search) {
            const appValues = await new LinqRepository(AppValue)
                .getAll()
                .where((x) => x.label)
                .contains(request.search)
                .toPromise();
            if (appValues.length > 0) {
                query = query
                    .where((x) => x.typeId)
                    .in(appValues.map((x) => x.id));
            } else {
                return new GetActivityLogsResponse(true);
            }
        }

        const queryData: LinqMultipleQueryWrapper<ActivityLog> = {
            query,
            relations: [{ include: (x) => x.user }, { include: (x) => x.type }],
        };
        // if (request.orderby) {
        //     const test = {};
        //     test[request.orderby] = '';
        //     queryData.query = queryData.query.orderBy(x => test[request.orderby]);
        // }

        return await this.activityLogsService.findAll(queryData);
    }
}
