import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateHelpers } from 'nextalys-js-helpers';
import { Repository } from 'typeorm';
import { ActivityLogCode } from '../../../shared/shared-constants';
import { ApplicationBaseModelService } from '../../services/base-model.service';
import { ReferentialService } from '../../services/referential.service';
import {
    ActivityLogDto,
    GetActivityLogResponse,
    GetActivityLogsResponse,
} from './activity-log-dto';
import { ActivityLog } from './activity-log.entity';

@Injectable()
export class ActivityLogsService extends ApplicationBaseModelService<
    ActivityLog,
    ActivityLogDto,
    GetActivityLogResponse,
    GetActivityLogsResponse
> {
    constructor(
        @InjectRepository(ActivityLog)
        private readonly activityLogRepository: Repository<ActivityLog>,
        private referentialService: ReferentialService,
    ) {
        super();

        this.modelOptions = {
            getManyResponse: GetActivityLogsResponse,
            getOneResponse: GetActivityLogResponse,
            getManyResponseField: 'logs',
            getOneResponseField: 'log',
            repository: this.activityLogRepository,
            getManyRelations: ['user', 'type'],
            entity: ActivityLog,
        };
    }

    public async addActivityLog(
        userId: string,
        type: ActivityLogCode,
        meta?: any,
    ) {
        const getValueResponse = await this.referentialService.getAllAppValues([
            type,
        ]);

        if (getValueResponse.success && getValueResponse.appValues.length > 0) {
            let metaString: string = null;

            if (meta) {
                metaString = JSON.stringify(meta);
            }

            await this.createOrUpdate({
                date: DateHelpers.toUtcDate(new Date()),
                userId,
                typeId: getValueResponse.appValues[0].id,
                meta: metaString,
            });
        }
    }
}
