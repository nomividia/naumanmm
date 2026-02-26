import { GenericResponse } from '../models/responses/generic-response';
export interface MomentObject {
    toDate?: () => Date;
    format?: (arg: string) => string;
}
export declare class CronJobObject {
    start: () => void;
    stop: () => void;
    lastDate: () => MomentObject;
    nextDates: () => MomentObject;
}
export declare type CronObjectConstructor = new (cronTime: string | Date, onTick: () => any, onComplete?: () => any, start?: boolean, timezone?: string, context?: any, runOnInit?: boolean, utcOffset?: number, unrefTimeout?: any) => CronJobObject;
export declare class SendNewsletterResponse extends GenericResponse {
    newsletterId?: string;
    listId?: string;
}
