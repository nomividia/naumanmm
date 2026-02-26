import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { RolesList } from '../../../shared/shared-constants';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { GenericResponse } from '../../models/responses/generic-response';
import { RolesGuard } from '../../services/guards/roles-guard';
import { Roles } from '../../services/roles.decorator';
import { ApiMainHelpers } from '../../services/tools/helpers.service';
import { BaseController } from '../../shared/base.controller';
import { JobDto } from './job-dto';
import { Job } from './job.entity';
import { GetJobResponse, GetJobsResponse } from './jobs-responses';
import { JobsService } from './jobs.service';

@Controller('jobs')
@ApiTags('jobs')
export class JobsController extends BaseController {
    constructor(private jobsService: JobsService) {
        super();
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.AdminTech)
    @Get(':jobId')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get job', operationId: 'getJob' })
    @ApiResponse({ status: 200, description: 'Job', type: GetJobResponse })
    @HttpCode(200)
    @ApiQuery({ name: 'includeJobHistory', required: false, type: String })
    async get(
        @Param('jobId') jobId: string,
        @Query('includeJobHistory') includeJobHistory?: 'true' | 'false',
    ): Promise<GetJobResponse> {
        const getOneResponse = await this.jobsService.findOne({
            where: { id: jobId },
            relations: includeJobHistory === 'true' ? ['jobHistory'] : [],
        });
        getOneResponse.isOnMainWorker = ApiMainHelpers.isMainWorker();

        return getOneResponse;
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.AdminTech)
    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all jobs', operationId: 'getAllJobs' })
    @ApiResponse({
        status: 200,
        description: 'Get all jobs',
        type: GetJobsResponse,
    })
    @HttpCode(200)
    async getAll(
        @Query() request: BaseSearchRequest,
    ): Promise<GetJobsResponse> {
        const findOptions =
            BaseSearchRequest.getDefaultFindOptions<Job>(request);

        return await this.jobsService.findAll(findOptions, true);
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.AdminTech)
    @Post()
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Create or update job',
        operationId: 'createOrUpdateJob',
    })
    @ApiResponse({
        status: 200,
        description: 'GetJobResponse',
        type: GetJobResponse,
    })
    @HttpCode(200)
    async createOrUpdate(@Body() job: JobDto): Promise<GetJobResponse> {
        return await this.jobsService.createOrUpdate(job);
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.AdminTech)
    @Delete(':jobIds')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete job', operationId: 'deleteJobs' })
    @ApiResponse({
        status: 200,
        description: 'Delete job GenericResponse',
        type: GenericResponse,
    })
    @HttpCode(200)
    async deleteJobs(
        @Param('jobIds') jobIds: string,
    ): Promise<GenericResponse> {
        const splitted = jobIds.split(';');

        return await this.jobsService.deleteJobs(splitted);
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.AdminTech)
    @Post('triggerJob/:id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Trigger job', operationId: 'triggerJob' })
    @ApiResponse({
        status: 200,
        description: 'Generic response',
        type: GenericResponse,
    })
    @HttpCode(200)
    async triggerJob(@Param('id') jobId: string): Promise<GenericResponse> {
        return await this.jobsService.triggerJob(jobId);
    }
}
