import { JobDto } from './job-dto';
export declare class JobHistoryDto {
    id?: string;
    job: JobDto;
    date: Date;
    jobId: string;
    result?: string;
    duration?: number;
}
