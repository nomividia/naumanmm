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

export type CronObjectConstructor = new (
    /**
     *  [REQUIRED] - The time to fire off your job. This can be in the form of cron syntax or a JS Date object.
     */
    cronTime: string | Date,
    /**
     *  [REQUIRED] - The function to fire at the specified time. If an onComplete callback was provided, onTick will receive it as an argument. onTick may call onComplete when it has finished its work.
     */
    onTick: () => any,
    /**
     * [OPTIONAL] - A function that will fire when the job is stopped with job.stop(), and may also be called by onTick at the end of each run.
     */
    onComplete?: () => any,
    /**
     * [OPTIONAL] - Specifies whether to start the job just before exiting the constructor.
     * By default this is set to false. If left at default you will need to call job.start() in order to start the job (assuming job is the variable you set the cronjob to).
     * This does not immediately fire your onTick function, it just gives you more control over the behavior of your jobs.
     */
    start?: boolean,
    /**
     * [OPTIONAL] - Specify the timezone for the execution. This will modify the actual time relative to your timezone. If the timezone is invalid, an error is thrown.
     * You can check all timezones available at Moment Timezone Website. Probably don't use both timeZone and utcOffset together or weird things may happen.
     */
    timezone?: string,
    context?: any,
    runOnInit?: boolean,
    utcOffset?: number,
    unrefTimeout?: any,
) => CronJobObject;

export class SendNewsletterResponse extends GenericResponse {
    newsletterId?: string;
    listId?: string;
}
