import { forwardRef, Module } from '@nestjs/common';
import { AppCommonModule } from '../../shared/app-common.module';

import { TranslateController } from './translate.controller';
@Module({
    imports: [forwardRef(() => AppCommonModule)],
    controllers: [TranslateController],
    providers: [],
    exports: [],
})
export class TranslateModule {}
