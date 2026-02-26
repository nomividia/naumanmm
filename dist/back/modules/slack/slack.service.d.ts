import { GenericResponse } from '../../models/responses/generic-response';
import { ApplicationBaseService } from '../../services/base-service';
export declare class SlackService extends ApplicationBaseService {
    constructor();
    sendSlackNotification(to: string, message: string): Promise<GenericResponse>;
}
