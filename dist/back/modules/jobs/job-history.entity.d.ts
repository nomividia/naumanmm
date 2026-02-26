import { JobHistoryDto } from './job-history-dto';
import { Job } from './job.entity';
export declare class JobHistory {
    id: string;
    job: Job;
    jobId: string;
    date: Date;
    result: string;
    duration: number;
    toDto(getJob: boolean): JobHistoryDto;
}
