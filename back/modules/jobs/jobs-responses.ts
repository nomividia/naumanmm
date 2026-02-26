import { ApiProperty } from '@nestjs/swagger';
import { BaseSearchResponse } from '../../models/responses/base-search-responses';
import { GenericResponse } from '../../models/responses/generic-response';
import { JobDto } from './job-dto';

export class GetJobsResponse extends BaseSearchResponse {
    @ApiProperty({ type: () => JobDto, isArray: true })
    jobs: JobDto[] = [];

    @ApiProperty()
    isOnMainWorker: boolean;

    constructor() {
        super();
    }
}

export class GetJobResponse extends GenericResponse {
    @ApiProperty({ type: () => JobDto })
    job: JobDto;

    @ApiProperty()
    isOnMainWorker: boolean;

    constructor() {
        super();
    }
}
