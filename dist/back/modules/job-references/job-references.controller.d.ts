import { GenericResponse } from '../../models/responses/generic-response';
import { BaseController } from '../../shared/base.controller';
import { GetJobReferenceResponse, GetJobReferencesDetailsDtoResponse, GetJobReferencesDetailsRequest, GetJobReferencesDistinctRequest, GetJobReferencesDistinctResponse, JobReferenceDto } from './job-reference-dto';
import { JobReferencesService } from './job-references.service';
export declare class JobReferencesController extends BaseController {
    private readonly jobReferencesService;
    constructor(jobReferencesService: JobReferencesService);
    createOrUpdate(jobReferenceDto: JobReferenceDto): Promise<GetJobReferenceResponse>;
    get(id: string): Promise<GetJobReferenceResponse>;
    getAll(request: GetJobReferencesDistinctRequest): Promise<GetJobReferencesDistinctResponse>;
    getAllJobRefDetails(request: GetJobReferencesDetailsRequest): Promise<GetJobReferencesDetailsDtoResponse>;
    archive(ids: string[]): Promise<GenericResponse>;
}
