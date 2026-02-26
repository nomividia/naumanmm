import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { BaseController } from '../../shared/base.controller';
import { GetActivityLogsResponse } from './activity-log-dto';
import { ActivityLogsService } from './activity-logs.service';
export declare class ActivityLogsController extends BaseController {
    private activityLogsService;
    constructor(activityLogsService: ActivityLogsService);
    getAll(request: BaseSearchRequest): Promise<GetActivityLogsResponse>;
}
