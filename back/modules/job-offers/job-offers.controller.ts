import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    Redirect,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { FindConditions, In, Like } from 'typeorm';
import {
    AppTypes,
    JobOfferState,
    RolesList,
} from '../../../shared/shared-constants';
import { AppErrorWithMessage } from '../../models/app-error';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { GenericResponse } from '../../models/responses/generic-response';
import { AuthToolsService } from '../../services/auth-tools.service';
import { RolesGuard } from '../../services/guards/roles-guard';
import { ReferentialService } from '../../services/referential.service';
import { Roles } from '../../services/roles.decorator';
import { BaseController } from '../../shared/base.controller';
import {
    GetJobOfferRequest,
    GetJobOfferResponse,
    GetJobOffersResponse,
    JobOfferDto,
    SendJobOfferByMailRequest,
} from './job-offer-dto';
import { JobOffer } from './job-offer.entity';
import { JobOfferService } from './job-offers.service';

@Controller('job-offers')
@ApiTags('job-offers')
export class JobOfferController extends BaseController {
    constructor(
        private readonly jobOfferService: JobOfferService,
        private referentialService: ReferentialService,
        private authToolsService: AuthToolsService, // private readonly candidateApplicationService: CandidateApplicationService
    ) {
        super();
    }

    @Get('getAll')
    @ApiOperation({
        summary: 'Get all job offers',
        operationId: 'getAllJobOffers',
    })
    @ApiResponse({
        status: 200,
        description: 'Get All Job Offers',
        type: GetJobOffersResponse,
    })
    @HttpCode(200)
    async getAll(
        @Query() request: GetJobOfferRequest,
    ): Promise<GetJobOffersResponse> {
        const findOptions =
            BaseSearchRequest.getDefaultFindOptions<JobOffer>(request);

        if (request.search) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            findOptions.where = [
                {
                    ref: Like('%' + request.search + '%'),
                },
                {
                    city: Like('%' + request.search + '%'),
                },
                {
                    title: Like('%' + request.search + '%'),
                },
            ];
        }

        if (request.jobIds) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            const jobIds = request.jobIds.split(',');

            for (const whereFilter of findOptions.where as FindConditions<JobOffer>[]) {
                whereFilter.jobId = In(jobIds);
            }
        }

        if (request.countryCode) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            const countriesCode = request.countryCode.split(',');

            for (const whereFilter of findOptions.where as FindConditions<JobOffer>[]) {
                whereFilter.country = In(countriesCode);
            }
        }

        if (request.consultantIds) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            const consultantIds = request.consultantIds.split(',');

            for (const whereFilter of findOptions.where as FindConditions<JobOffer>[]) {
                whereFilter.consultantId = In(consultantIds);
            }
        }

        if (request.applyInCouple) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            for (const whereFilter of findOptions.where as FindConditions<JobOffer>[]) {
                whereFilter.applyInCouple =
                    request.applyInCouple === 'true' ? true : false;
            }
        }

        if (request.city) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            for (const whereFilter of findOptions.where as FindConditions<JobOffer>[]) {
                whereFilter.city = request.city;
            }
        }

        if (request.contractTypeId) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            for (const whereFilter of findOptions.where as FindConditions<JobOffer>[]) {
                whereFilter.contractTypeId = request.contractTypeId;
            }
        }

        if (request.status) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            if (request.status === 'true') {
                for (const whereFilter of findOptions.where as FindConditions<JobOffer>[]) {
                    whereFilter.disabled = false;
                }
            } else if (request.status === 'false') {
                for (const whereFilter of findOptions.where as FindConditions<JobOffer>[]) {
                    whereFilter.disabled = true;
                }
            }
        }

        if (request.customerIds) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            const customerIds = request.customerIds.split(',');

            for (const whereFilter of findOptions.where as FindConditions<JobOffer>[]) {
                whereFilter.customerId = In(customerIds);
            }
        }

        if (request.contractTypeIds) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            const contractTypeIds = request.contractTypeIds.split(',');

            for (const whereFilter of findOptions.where as FindConditions<JobOffer>[]) {
                whereFilter.contractTypeId = In(contractTypeIds);
            }
        }

        if (request.stateId) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            for (const whereFilter of findOptions.where as FindConditions<JobOffer>[]) {
                whereFilter.stateId = request.stateId;
            }
        }

        if (request.excludePlacedJobOffers === 'true') {
            // Pass the exclusion parameter to the service
            return await this.jobOfferService.findAllExcludingPlaced(
                findOptions,
            );
        }

        return await this.jobOfferService.findAll(findOptions);
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Get('get/:id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get job offer', operationId: 'getJobOffer' })
    @ApiResponse({
        status: 200,
        description: 'Get job offer',
        type: GetJobOfferResponse,
    })
    @HttpCode(200)
    async get(@Param('id') id: string): Promise<GetJobOfferResponse> {
        return await this.jobOfferService.findOne({
            where: { id: id },
            relations: ['job', 'job.translations'],
        });
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Get('getJobOfferByRef/:ref')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get job offer', operationId: 'getJobOfferByRef' })
    @ApiResponse({
        status: 200,
        description: 'Get job offer by ref',
        type: GetJobOfferResponse,
    })
    @HttpCode(200)
    async getJobOfferByRef(
        @Param('ref') ref: string,
    ): Promise<GetJobOfferResponse> {
        return await this.jobOfferService.findOne({ where: { ref: ref } });
    }

    // @UseGuards(RolesGuard)
    // @Roles(RolesList.Admin, RolesList.Consultant, RolesList.AdminTech, RolesList.RH)
    @Get('getJobOfferByRefLike/:ref')
    // @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get job offer',
        operationId: 'getJobOfferByRefLike',
    })
    @ApiResponse({
        status: 200,
        description: 'Get job offer by ref',
        type: GetJobOfferResponse,
    })
    @HttpCode(200)
    async getJobOfferByRefLike(
        @Param('ref') ref: string,
    ): Promise<GetJobOfferResponse> {
        const response = new GetJobOfferResponse();
        response.success = true;
        response.jobOffer = null;
        const jobOfferStatesResponse =
            await this.referentialService.getTypeValues({
                appTypeCode: AppTypes.JobOfferStateCode,
            });
        const stateActivated = jobOfferStatesResponse?.appType?.appValues?.find(
            (x) => x.code === JobOfferState.Activated,
        );

        if (!stateActivated?.id) {
            return response;
        }

        return await this.jobOfferService.findOne({
            where: {
                ref: Like(ref + '%'),
                disabled: false,
                stateId: stateActivated?.id,
            },
        });
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Post('createOrUpdate')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Create or update job offer',
        operationId: 'createOrUpdateJobOffer',
    })
    @ApiResponse({
        status: 200,
        description: 'Create or update job offer',
        type: GetJobOfferResponse,
    })
    @HttpCode(200)
    async createOrUpdate(
        @Body() jobOfferDto: JobOfferDto,
    ): Promise<GetJobOfferResponse> {
        if (!jobOfferDto) {
            throw new AppErrorWithMessage('Invalid Request');
        }

        return await this.jobOfferService.createOrUpdate(jobOfferDto);
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin, RolesList.AdminTech)
    @Delete('delete/:ids')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Delete job offers',
        operationId: 'deleteJobOffers',
    })
    @ApiResponse({
        status: 200,
        description: 'Delete candidates',
        type: GenericResponse,
    })
    @HttpCode(200)
    async delete(@Param('ids') ids: string): Promise<GenericResponse> {
        return await this.jobOfferService.delete(ids.split(','));
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin, RolesList.Consultant, RolesList.AdminTech, RolesList.RH)
    @Get('sendJobOfferByMail')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Send job offer by email',
        operationId: 'sendJobOfferByMail',
    })
    @ApiResponse({
        status: 200,
        description: 'Send job offer by email',
        type: GenericResponse,
    })
    @HttpCode(200)
    async sendJobOfferByMail(
        @Query() request: SendJobOfferByMailRequest,
    ): Promise<GenericResponse> {
        const payload = this.authToolsService.getCurrentPayload(false);
        return await this.jobOfferService.sendJobOfferByMail(
            request,
            payload?.mail,
        );
    }

    @Get('public/redirect-by-ref/:ref')
    @ApiOperation({
        summary: 'Redirect to job offer page by reference',
        operationId: 'redirectByRef',
    })
    @ApiResponse({
        status: 302,
        description: 'Redirect to job offer page',
    })
    @HttpCode(302)
    async redirectByRef(
        @Param('ref') ref: string,
    ): Promise<{ url: string }> {
        const jobOffer = await this.jobOfferService.findOne({
            where: { ref: ref },
        });

        if (jobOffer?.success && jobOffer?.jobOffer?.id) {
            return { url: `/offres-emplois/${jobOffer.jobOffer.id}` };
        }

        return { url: '/not-found' };
    }
}
