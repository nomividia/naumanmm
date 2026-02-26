import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { GenericResponse } from '../../models/responses/generic-response';
import { BaseController } from '../../shared/base.controller';
import { JobDto } from './job-dto';
import { GetJobResponse, GetJobsResponse } from './jobs-responses';
import { JobsService } from './jobs.service';
export declare class JobsController extends BaseController {
    private jobsService;
    constructor(jobsService: JobsService);
    get(jobId: string, includeJobHistory?: 'true' | 'false'): Promise<GetJobResponse>;
    getAll(request: BaseSearchRequest): Promise<GetJobsResponse>;
    createOrUpdate(job: JobDto): Promise<GetJobResponse>;
    deleteJobs(jobIds: string): Promise<GenericResponse>;
    triggerJob(jobId: string): Promise<GenericResponse>;
}
