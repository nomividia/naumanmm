import { forwardRef, Module } from '@nestjs/common';
import { AppCommonModule } from '../../shared/app-common.module';
import { SmsService } from './sms.service';
@Module({
    imports: [forwardRef(() => AppCommonModule)],
    controllers: [],
    providers: [SmsService],
    exports: [SmsService],
})
export class SmsModule {}
