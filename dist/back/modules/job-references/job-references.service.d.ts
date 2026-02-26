import { Repository } from 'typeorm';
import { ApplicationBaseModelService } from '../../services/base-model.service';
import { GetJobReferenceResponse, GetJobReferencesResponse, JobReferenceDto } from './job-reference-dto';
import { JobReference } from './job-reference.entity';
export declare class JobReferencesService extends ApplicationBaseModelService<JobReference, JobReferenceDto, GetJobReferenceResponse, GetJobReferencesResponse> {
    readonly repository: Repository<JobReference>;
    constructor(repository: Repository<JobReference>);
}
