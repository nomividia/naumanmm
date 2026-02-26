import { forwardRef, Module } from '@nestjs/common';
import { MailService } from '../../services/tools/mail.service';
import { AppCommonModule } from '../../shared/app-common.module';
import { MailController } from './mail.controller';
@Module({
    imports: [forwardRef(() => AppCommonModule)],
    controllers: [MailController],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
