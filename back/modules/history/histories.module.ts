import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppCommonModule } from '../../shared/app-common.module';
import { HistoriesController } from './histories.controller';
import { HistoriesService } from './histories.service';
import { History } from './history.entity';

@Module({
    imports: [AppCommonModule, TypeOrmModule.forFeature([History])],
    controllers: [HistoriesController],
    providers: [HistoriesService],
    exports: [HistoriesService],
})
export class HistoriesModule {}
