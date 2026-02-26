import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppCommonModule } from '../../shared/app-common.module';
import { KeyValueController } from './key-value.controller';
import { KeyValue } from './key-value.entity';
import { KeyValueService } from './key-value.service';

@Module({
    imports: [
        forwardRef(() => AppCommonModule),
        TypeOrmModule.forFeature([KeyValue]),
    ],
    controllers: [KeyValueController],
    providers: [KeyValueService],
    exports: [KeyValueService],
})
export class KeyValueModule {}
