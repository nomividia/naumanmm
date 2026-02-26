import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppCommonModule } from '../../shared/app-common.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { JobHistory } from './job-history.entity';
import { JobsController } from './job.controller';
import { Job } from './job.entity';
import { JobsService } from './jobs.service';
import { ModulesImportsForJobs } from './modules-imports-for-jobs';

@Module({
    imports: [
        AppCommonModule,
        TypeOrmModule.forFeature([Job, JobHistory]),
        NotificationsModule,
        ...ModulesImportsForJobs,
    ],
    controllers: [JobsController],
    providers: [JobsService],
    exports: [JobsService],
})
export class JobsModule {}
