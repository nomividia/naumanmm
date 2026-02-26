import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationBaseModelService } from '../../services/base-model.service';
import {
    GetJobReferenceResponse,
    GetJobReferencesResponse,
    JobReferenceDto,
} from './job-reference-dto';
import { JobReference } from './job-reference.entity';

@Injectable()
export class JobReferencesService extends ApplicationBaseModelService<
    JobReference,
    JobReferenceDto,
    GetJobReferenceResponse,
    GetJobReferencesResponse
> {
    constructor(
        @InjectRepository(JobReference)
        public readonly repository: Repository<JobReference>,
    ) {
        super();

        this.modelOptions = {
            getManyResponse: GetJobReferencesResponse,
            getOneResponse: GetJobReferenceResponse,
            getManyResponseField: 'jobReferences',
            getOneResponseField: 'jobReference',
            getManyRelations: ['jobRefFunction', 'addresses'],
            getOneRelations: ['jobRefFunction', 'addresses'],
            repository: this.repository,
            entity: JobReference,
            archiveField: 'disabled',
            archiveFieldValue: true,
        };
    }
}
