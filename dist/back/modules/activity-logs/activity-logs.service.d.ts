import { Repository } from 'typeorm';
import { ActivityLogCode } from '../../../shared/shared-constants';
import { ApplicationBaseModelService } from '../../services/base-model.service';
import { ReferentialService } from '../../services/referential.service';
import { ActivityLogDto, GetActivityLogResponse, GetActivityLogsResponse } from './activity-log-dto';
import { ActivityLog } from './activity-log.entity';
export declare class ActivityLogsService extends ApplicationBaseModelService<ActivityLog, ActivityLogDto, GetActivityLogResponse, GetActivityLogsResponse> {
    private readonly activityLogRepository;
    private referentialService;
    constructor(activityLogRepository: Repository<ActivityLog>, referentialService: ReferentialService);
    addActivityLog(userId: string, type: ActivityLogCode, meta?: any): Promise<void>;
}
