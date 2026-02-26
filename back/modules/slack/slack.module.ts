import { Module } from '@nestjs/common';
import { AppCommonModule } from '../../shared/app-common.module';
import { SlackService } from './slack.service';

@Module({
    imports: [AppCommonModule],
    controllers: [],
    providers: [SlackService],
    exports: [SlackService],
})
export class SlackModule {}
