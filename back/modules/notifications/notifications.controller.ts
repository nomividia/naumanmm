import {
    Body,
    Controller,
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
import { DateHelpers } from 'nextalys-js-helpers';
import {
    CustomSocketEventType,
    RolesList,
} from '../../../shared/shared-constants';
import { GetNotificationsResponse } from '../../models/dto/notification-dto';
import { PushSubscriptionDto } from '../../models/dto/push-subscription-dto';
import { GenericResponse } from '../../models/responses/generic-response';
import { AuthToolsService } from '../../services/auth-tools.service';
import { RolesGuard } from '../../services/guards/roles-guard';
import { Roles } from '../../services/roles.decorator';
import { PushService } from '../../services/tools/push.service';
import { BaseController } from '../../shared/base.controller';
import { SocketGateway } from '../../sockets/socket-gateway';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@ApiTags('notifications')
export class NotificationsController extends BaseController {
    constructor(
        private notificationsService: NotificationsService,
        private authToolsService: AuthToolsService,
        private pushService: PushService,
        private socketGateway: SocketGateway,
    ) {
        super();
    }

    @UseGuards(RolesGuard)
    @Get('getMyNotifications')
    @ApiOperation({
        summary: 'getMyNotifications',
        operationId: 'getMyNotifications',
    })
    @ApiResponse({
        status: 200,
        description: 'getMyNotifications',
        type: GetNotificationsResponse,
    })
    @HttpCode(200)
    @ApiBearerAuth()
    async getMyNotifications() {
        const currentUserPayload =
            this.authToolsService.getCurrentPayload(false);
        const fiveWeeksPast = DateHelpers.addDaysToDate(new Date(), -35);

        return await this.notificationsService.getUserNotifications(
            currentUserPayload?.id,
            fiveWeeksPast,
        );
    }

    @UseGuards(RolesGuard)
    @Post('set-my-notifications-seen')
    @ApiOperation({
        summary: 'setNotificationsSeen',
        operationId: 'setNotificationsSeen',
    })
    @ApiResponse({
        status: 200,
        description: 'setNotificationsSeen',
        type: GenericResponse,
    })
    @HttpCode(200)
    @ApiBearerAuth()
    async setNotificationsSeen() {
        const currentUserPayload =
            this.authToolsService.getCurrentPayload(false);

        return await this.notificationsService.setNotificationsSeen(
            currentUserPayload.id,
        );
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.AdminTech)
    @Post('send-notification-test/:userId')
    @ApiOperation({
        summary: 'sendNotificationTest',
        operationId: 'sendNotificationTest',
    })
    @ApiResponse({
        status: 200,
        description: 'sendNotification',
        type: GenericResponse,
    })
    @HttpCode(200)
    @ApiBearerAuth()
    async sendNotificationTest(
        @Param('userId') userId: string,
        @Query('sendToAllSocket') sendToAllSocket: 'true' | 'false' = 'false',
    ) {
        return await this.notificationsService.sendNotification(
            'test notif  - ' + new Date().getTime(),
            [userId],
            ['Push', 'Mail'],
            sendToAllSocket === 'true',
            'https://www.nextalys.com',
        );
    }

    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @Post('save-push-subscription')
    @ApiOperation({
        summary: 'savePushSubscription',
        operationId: 'savePushSubscription',
    })
    @ApiResponse({
        status: 200,
        description: 'savePushSubscription',
        type: GenericResponse,
    })
    @HttpCode(200)
    async savePushSubscription(@Body() subscription: PushSubscriptionDto) {
        return await this.pushService.savePushSubscription(
            subscription,
            this.authToolsService.getCurrentPayload(false).id,
        );
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.AdminTech)
    @Post('send-event-test/:userId')
    @ApiOperation({ summary: 'sendEventTest', operationId: 'sendEventTest' })
    @ApiResponse({
        status: 200,
        description: 'sendEventTest',
        type: GenericResponse,
    })
    @HttpCode(200)
    @ApiBearerAuth()
    async sendEventTest(@Param('userId') userId: string) {
        return await this.notificationsService.sendEvent(
            'test event  - ' + new Date().getTime(),
            [userId],
        );
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.AdminTech)
    @Post('send-event-test-socket/:userId')
    @ApiOperation({
        summary: 'sendEventTestSocket',
        operationId: 'sendEventTestSocket',
    })
    @ApiResponse({
        status: 200,
        description: 'sendEventTestSocket',
        type: GenericResponse,
    })
    @HttpCode(200)
    @ApiBearerAuth()
    async sendEventTestSocket(
        @Param('userId') userId: string,
        @Query('fromFirebase') fromFirebase: string,
        @Query('sendToAllSocket') sendToAllSocket: 'true' | 'false' = 'false',
    ) {
        //, fromFirebase === 'true'
        let userIds: string[];

        if (userId && sendToAllSocket !== 'true') {
            userIds = [userId];
        }

        await this.socketGateway.sendEventToClient(
            CustomSocketEventType.NewMessage,
            {
                data: 'test event socket - ' + new Date().getTime(),
                date: new Date(),
            },
            userIds,
        );

        return new GenericResponse(true);
    }
}
