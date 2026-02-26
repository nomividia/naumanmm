import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppNotification } from '../../entities/notification.entity';
import { AuthToolsService } from '../../services/auth-tools.service';
import { AppCommonModule } from '../../shared/app-common.module';
import { SharedModule } from '../../shared/shared-module';
import { SocketModule } from '../../sockets/socket-module';
import { KeyValueModule } from '../key-value-db/key-value.module';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../users/users.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
    imports: [
        forwardRef(() => AppCommonModule),
        forwardRef(() => SharedModule),
        forwardRef(() => SocketModule),
        forwardRef(() => MailModule),
        forwardRef(() => KeyValueModule),
        forwardRef(() => UsersModule),
        TypeOrmModule.forFeature([AppNotification]),
    ],
    controllers: [NotificationsController],
    providers: [NotificationsService, AuthToolsService],
    exports: [NotificationsService],
})
export class NotificationsModule {}
