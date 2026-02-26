import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { RolesList } from '../../shared/shared-constants';
import { RolesGuard } from '../services/guards/roles-guard';
import { PM2Helpers } from '../services/pm2-helpers';
import { Roles } from '../services/roles.decorator';
import { BaseController } from '../shared/base.controller';
import { GetUserConnectionsWrapperResponse, SocketData } from './socket-data';
import { SocketGateway } from './socket-gateway';

@Controller('api-socket')
@ApiTags('api-socket')
export class ApiSocketController extends BaseController {
    constructor(private socketGateway: SocketGateway) {
        super();
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.AdminTech)
    @Get('getSocketConnections')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'getSocketConnections',
        operationId: 'getSocketConnections',
    })
    @ApiResponse({
        status: 200,
        description: 'GetUserConnectionsResponse',
        type: GetUserConnectionsWrapperResponse,
    })
    @HttpCode(200)
    async getSocketConnections(): Promise<GetUserConnectionsWrapperResponse> {
        const response = new GetUserConnectionsWrapperResponse();
        const selfResponse = await this.socketGateway.getSocketConnectionsList(
            null,
        );
        // PM2Helpers.sendDataToAllAppProcesses({ eventName: 'RetrieveSocketConnectionsList', data: { pm2Id: PM2Helpers.pm2AppId, data: selfResponse } }, true);
        response.connectionsWrapper = SocketData.UserConnectionsListByPM2App;
        // response.connectionsWrapper.push({ pm2AppId: PM2Helpers.pm2AppId, connectionsWrapper: selfResponse });
        response.success = true;
        response.currentPm2AppId = PM2Helpers.pm2AppId;
        return response;
    }
}
