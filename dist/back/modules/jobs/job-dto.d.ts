import { JobHistoryDto } from './job-history-dto';
export declare class JobDto {
    id?: string;
    cronPattern?: string;
    name: string;
    methodName: string;
    applicationServiceName?: string;
    description?: string;
    jobHistory?: JobHistoryDto[];
    enabled: boolean;
    logHistory?: boolean;
    modulePath?: string;
    moduleName?: string;
    servicePath?: string;
}
