import {
    Body,
    Controller,
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
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { RolesList } from '../../../shared/shared-constants';
import { AppErrorWithMessage } from '../../models/app-error';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { GenericResponse } from '../../models/responses/generic-response';
import { RolesGuard } from '../../services/guards/roles-guard';
import { Roles } from '../../services/roles.decorator';
import { BaseController } from '../../shared/base.controller';
import {
    GetJobReferenceResponse,
    GetJobReferencesDetailsDtoResponse,
    GetJobReferencesDetailsRequest,
    GetJobReferencesDistinctRequest,
    GetJobReferencesDistinctResponse,
    JobReferenceDto,
    JobReferencesDetailsDto,
} from './job-reference-dto';
import { JobReference } from './job-reference.entity';
import { JobReferencesService } from './job-references.service';

@Controller('job-references')
@ApiTags('job-references')
export class JobReferencesController extends BaseController {
    constructor(private readonly jobReferencesService: JobReferencesService) {
        super();
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.AdminTech,
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.Candidate,
        RolesList.RH,
    )
    @Post('createOrUpdate')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Create or update job reference',
        operationId: 'createOrUpdateJobReference',
    })
    @ApiResponse({
        status: 200,
        description: 'Create or update job reference',
        type: GetJobReferenceResponse,
    })
    @HttpCode(200)
    async createOrUpdate(
        @Body() jobReferenceDto: JobReferenceDto,
    ): Promise<GetJobReferenceResponse> {
        if (!jobReferenceDto) {
            throw new AppErrorWithMessage('Invalid Request');
        }

        if (jobReferenceDto.disabled === null) {
            jobReferenceDto.disabled = false;
        }

        if (jobReferenceDto.jobReferenceId) {
            jobReferenceDto.id = jobReferenceDto.jobReferenceId;
        }

        return await this.jobReferencesService.createOrUpdate(jobReferenceDto);
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.AdminTech,
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.Candidate,
        RolesList.RH,
    )
    @Get('get/:id')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get job reference',
        operationId: 'getJobReference',
    })
    @ApiResponse({
        status: 200,
        description: 'Get job offer',
        type: GetJobReferenceResponse,
    })
    @HttpCode(200)
    async get(@Param('id') id: string): Promise<GetJobReferenceResponse> {
        return await this.jobReferencesService.findOne({ where: { id: id } });
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.AdminTech, RolesList.Admin)
    @Get('getAll')
    @ApiOperation({
        summary: 'Get all job references distinct',
        operationId: 'getAllJobReferences',
    })
    @ApiResponse({
        status: 200,
        description: 'Get All Job References distinct',
        type: GetJobReferencesDistinctResponse,
    })
    @HttpCode(200)
    async getAll(
        @Query() request: GetJobReferencesDistinctRequest,
    ): Promise<GetJobReferencesDistinctResponse> {
        const findOptions =
            BaseSearchRequest.getDefaultFindOptions<JobReference>(request);
        const response = new GetJobReferencesDistinctResponse(true);

        try {
            const repo = this.jobReferencesService.getRepository();
            const tableName = repo.metadata.tableName;

            let customSQLRequestDisabled: string = '';
            let customSQLRequestCountryCode: string = '';
            let customSQLRequestIsCompany: string = '';
            let customSQLRequestIsPrivatePerson: string = '';
            let customSQLRequestSearch: string = '';

            if (request.disabled === 'false') {
                customSQLRequestDisabled =
                    ' WHERE `' + tableName + '`.disabled = 0 ';
            } else {
                customSQLRequestDisabled =
                    ' WHERE (`' +
                    tableName +
                    '`.disabled = 0 OR `' +
                    tableName +
                    '`.disabled = 1)';
            }

            if (request.search) {
                // eslint-disable-next-line max-len
                customSQLRequestSearch =
                    ' AND (`' +
                    tableName +
                    "`.companyName LIKE '%" +
                    request.search +
                    "%' OR `" +
                    tableName +
                    "`.privatePersonLastName LIKE '%" +
                    request.search +
                    "%' OR `" +
                    tableName +
                    "`.privatePersonFirstName LIKE '%" +
                    request.search +
                    "%')";
            }

            if (request.countriesCodes) {
                customSQLRequestCountryCode =
                    " AND address.country IN ('" +
                    request.countriesCodes.split(',') +
                    "')";
            }

            if (
                request.isCompany === 'true' &&
                request.isPrivatePerson === 'false'
            ) {
                customSQLRequestIsCompany =
                    ' AND `' + tableName + '`.isCompany = 1';
            }

            if (
                request.isPrivatePerson === 'true' &&
                request.isCompany === 'false'
            ) {
                customSQLRequestIsPrivatePerson =
                    ' AND `' + tableName + '`.isPrivatePerson = 1';
            }

            let selectQuery = `SELECT DISTINCT TRIM(privatePersonFirstName) as privatePersonFirstName,TRIM(privatePersonLastName) as privatePersonLastName,TRIM(companyName) as companyName, address.country`;
            let countQuery =
                'SELECT COUNT(`' + tableName + '`.id) as totalResults';

            const query =
                ` FROM ` +
                '`' +
                tableName +
                '`' +
                ' LEFT JOIN address ON address.jobReferenceId=`' +
                tableName +
                '`.id ' +
                customSQLRequestDisabled +
                customSQLRequestSearch +
                customSQLRequestCountryCode +
                customSQLRequestIsPrivatePerson +
                customSQLRequestIsCompany;

            selectQuery += query;
            countQuery += query;

            const results = await repo.query(
                selectQuery +
                    ' LIMIT ' +
                    findOptions.skip +
                    ',' +
                    findOptions.take,
            );

            const countQueryResults = await repo.query(countQuery);

            response.filteredResults =
                countQueryResults?.[0]?.totalResults || 0;
            response.jobReferences = results;
            response.success = true;
        } catch (error) {
            response.handleError(error);
        }

        return response;
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.AdminTech, RolesList.Admin)
    @Get('getAllJobRefDetails')
    @ApiOperation({
        summary: 'Get all job references details',
        operationId: 'getAllJobReferencesDetails',
    })
    @ApiResponse({
        status: 200,
        description: 'Get All Job References details',
        type: GetJobReferencesDetailsDtoResponse,
    })
    @HttpCode(200)
    async getAllJobRefDetails(
        @Query() request: GetJobReferencesDetailsRequest,
    ): Promise<GetJobReferencesDetailsDtoResponse> {
        const response = new GetJobReferencesDetailsDtoResponse();
        const findOptions =
            BaseSearchRequest.getDefaultFindOptions<JobReference>(request);

        try {
            const repo = this.jobReferencesService.getRepository();
            const tableName = repo.metadata.tableName;
            let customSQLRequestName: string;
            let customSQLRequestCountry: string = '';
            let customSQLRequestDisabled: string = '';

            if (request.company) {
                customSQLRequestName =
                    " WHERE `companyName` = '" + request.company + "'";
            }

            if (request.firstName || request.lastName) {
                customSQLRequestName =
                    " WHERE `privatePersonLastName` = '" +
                    request.lastName +
                    "' AND `privatePersonFirstName` = '" +
                    request.firstName +
                    "'";
            }

            if (request.disabled === 'true') {
                customSQLRequestDisabled =
                    ' AND `' + tableName + '`.disabled = true';
            }

            if (request.disabled === 'false') {
                customSQLRequestDisabled =
                    ' AND `' + tableName + '`.disabled = false';
            }

            if (request.country) {
                customSQLRequestCountry =
                    " AND address.country = '" + request.country + "'";
            }

            const query =
                'SELECT *,`' +
                tableName +
                '`.id as id, `' +
                tableName +
                '`.disabled as disabled,`candidate-jobs`.candidateId as candidateIdFromJobs, `' +
                tableName +
                '`.id AS jobRefId, `app_values`.label AS functionLabel FROM ' +
                '`' +
                tableName +
                '`' +
                ' LEFT JOIN `address` ON `address`.jobReferenceId = `' +
                tableName +
                '`.id' +
                ' LEFT JOIN `candidate-jobs` ON `candidate-jobs`.jobReferenceId = `' +
                tableName +
                '`.id' +
                ' LEFT JOIN `app_values` ON `app_values`.id = `' +
                tableName +
                '`.jobRefFunctionId' +
                customSQLRequestName +
                customSQLRequestDisabled +
                customSQLRequestCountry +
                ' LIMIT ' +
                findOptions.skip +
                ',' +
                findOptions.take;
            const results: JobReferencesDetailsDto[] = await repo.query(query);

            response.jobReferences = results;
            response.success = true;
        } catch (error) {
            response.handleError(error);
        }

        return response;
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin, RolesList.AdminTech)
    @ApiBearerAuth()
    @Post('archiveJobReferences')
    @ApiOperation({
        summary: 'Archive job references',
        operationId: 'archiveJobReferences',
    })
    @ApiResponse({
        status: 200,
        description: 'Archive job references',
        type: GenericResponse,
    })
    @HttpCode(200)
    async archive(@Body() ids: string[]): Promise<GenericResponse> {
        return await this.jobReferencesService.archive(ids);
    }
}
