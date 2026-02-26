import { BaseSearchResponse } from '../../models/responses/base-search-responses';
import { GenericResponse } from '../../models/responses/generic-response';
import { JobDto } from './job-dto';
export declare class GetJobsResponse extends BaseSearchResponse {
    jobs: JobDto[];
    isOnMainWorker: boolean;
    constructor();
}
export declare class GetJobResponse extends GenericResponse {
    job: JobDto;
    isOnMainWorker: boolean;
    constructor();
}
