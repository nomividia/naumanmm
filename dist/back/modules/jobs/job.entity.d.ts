import { JobDto } from './job-dto';
import { JobHistory } from './job-history.entity';
export declare class Job {
    id: string;
    name: string;
    cronPattern?: string;
    description?: string;
    jobHistory: JobHistory[];
    enabled: boolean;
    applicationServiceName: string;
    methodName: string;
    logHistory: boolean;
    moduleName: string;
    modulePath: string;
    servicePath: string;
    toDto(): JobDto;
    fromDto(dto: JobDto): void;
}
