import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from '../controllers/auth.controller';
// @NOTE: Somehow this  module has to be imported before the AppCommonModule
import { SocketModule } from '../sockets/socket-module';

//Other Modules
import { ImageController } from '../controllers/image.controller';
import { PdfController } from '../controllers/pdf.controller';
import { AppImage } from '../entities/app-image.entity';
import { AppPushSubscription } from '../entities/push-subscription.entity';
import { Translation } from '../entities/translation.entity';
import { ActivityLogsModule } from '../modules/activity-logs/activity-logs.module';
import { KeyValueModule } from '../modules/key-value-db/key-value.module';
import { MailModule } from '../modules/mail/mail.module';
import { AuthService } from '../services/auth.service';
import { RolesGuard } from '../services/guards/roles-guard';
import { ImagesService } from '../services/images.service';
import { PdfService } from '../services/tools/pdf.service';
import { PushService } from '../services/tools/push.service';
import { AppCommonModule } from './app-common.module';

@Module({
    imports: [
        forwardRef(() => AppCommonModule),
        TypeOrmModule.forFeature([AppPushSubscription, Translation, AppImage]),
        SocketModule,
        ActivityLogsModule,
        forwardRef(() => KeyValueModule),
        forwardRef(() => MailModule),
    ],
    controllers: [AuthController, PdfController, ImageController],
    providers: [
        AuthService,
        RolesGuard,
        PdfService,
        PushService,
        ImagesService,
    ],
    exports: [AppCommonModule, PdfService, PushService, AuthService],
})
export class SharedModule {}
