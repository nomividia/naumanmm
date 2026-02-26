import { Module } from '@nestjs/common';
import { DatabaseService } from '../../services/tools/database.service';
import { AppCommonModule } from '../../shared/app-common.module';
import { KeyValueModule } from '../key-value-db/key-value.module';

@Module({
    imports: [AppCommonModule, KeyValueModule],
    controllers: [],
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule {}
