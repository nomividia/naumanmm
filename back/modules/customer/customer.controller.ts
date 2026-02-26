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
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { FindConditions, getManager, Like, Raw } from 'typeorm';
import { RolesList } from '../../../shared/shared-constants';
import { Address } from '../../entities/address.entity';
import { AppErrorWithMessage } from '../../models/app-error';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { GenericResponse } from '../../models/responses/generic-response';
import { RolesGuard } from '../../services/guards/roles-guard';
import { Roles } from '../../services/roles.decorator';
import { BaseController } from '../../shared/base.controller';
import { JobReferenceDto } from '../job-references/job-reference-dto';
import {
    CustomerCreatedFromReferenceResponse,
    CustomerDto,
    CustomersRequest,
    GenerateCustomerFromeReferenceRequest,
    GetCustomerResponse,
    GetCustomersResponse,
} from './customer.dto';
import { Customer } from './customer.entity';
import { CustomerService } from './customer.service';

@Controller('customers')
@ApiTags('customers')
export class CustomerController extends BaseController {
    constructor(private readonly customerService: CustomerService) {
        super();
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Get()
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get all customers',
        operationId: 'getAllCustomers',
    })
    @ApiResponse({
        status: 200,
        description: 'Get all Customers',
        type: GetCustomersResponse,
    })
    @HttpCode(200)
    async getAll(
        @Query() request: CustomersRequest,
    ): Promise<GetCustomersResponse> {
        const findOptions =
            BaseSearchRequest.getDefaultFindOptions<Customer>(request);
        findOptions.relations = ['addresses'];

        if (request.includeCustomerFunction === 'true') {
            findOptions.relations.push('customerFunction');
        }

        if (request.search) {
            findOptions.where = [
                {
                    firstName: Like('%' + request.search + '%'),
                },
                {
                    lastName: Like('%' + request.search + '%'),
                },
                {
                    companyName: Like('%' + request.search + '%'),
                },
            ];
        }

        if (request.countryCode) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            const locationCode = request.countryCode.split(',');

            if (locationCode.length) {
                const addressTableName =
                    getManager().getRepository(Address).metadata.tableName;

                if (!request.city) {
                    for (const whereFilter of findOptions.where as FindConditions<Customer>[]) {
                        whereFilter.id = Raw(
                            (alias) =>
                                `(${alias} IN (SELECT customerId FROM \`${addressTableName}\` WHERE country IN("${locationCode.join(
                                    '","',
                                )}") ))`,
                        );
                    }
                }

                if (request.city) {
                    for (const whereFilter of findOptions.where as FindConditions<Customer>[]) {
                        whereFilter.id = Raw(
                            (alias) =>
                                `(${alias} IN (SELECT customerId FROM \`${addressTableName}\` WHERE country IN("${locationCode.join(
                                    '","',
                                )}") AND city LIKE '%${request.city}%' ))`,
                        );
                    }
                }
            }
        }

        if (request.city && !request.countryCode) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            const addressTableName =
                getManager().getRepository(Address).metadata.tableName;

            for (const whereFilter of findOptions.where as FindConditions<Customer>[]) {
                whereFilter.id = Raw(
                    (alias) =>
                        `(${alias} IN (SELECT customerId FROM \`${addressTableName}\` WHERE city LIKE '%${request.city}%'  ))`,
                );
            }
        }

        if (
            request.isCompany === 'true' &&
            request.isPrivatePerson === 'false'
        ) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            for (const whereFilter of findOptions.where as FindConditions<Customer>[]) {
                whereFilter.isCompany = true;
            }
        }

        if (
            request.isCompany === 'false' &&
            request.isPrivatePerson === 'true'
        ) {
            if (!findOptions.where) {
                findOptions.where = [{}];
            }

            for (const whereFilter of findOptions.where as FindConditions<Customer>[]) {
                whereFilter.isPrivatePerson = true;
            }
        }

        return await this.customerService.findAll(
            findOptions,
            request.consultantId,
        );
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Get(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get customer', operationId: 'getCustomer' })
    @ApiResponse({
        status: 200,
        description: 'Get customer',
        type: GetCustomerResponse,
    })
    @HttpCode(200)
    async get(@Param('id') id: string): Promise<GetCustomerResponse> {
        return await this.customerService.findOne({ where: { id: id } });
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Post()
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Create or update customer',
        operationId: 'createOrUpdateCustomer',
    })
    @ApiResponse({
        status: 200,
        description: 'Create or update customer',
        type: GetCustomerResponse,
    })
    @HttpCode(200)
    async createOrUpdate(
        @Body() customerDto: CustomerDto,
    ): Promise<GetCustomerResponse> {
        if (!customerDto) {
            throw new AppErrorWithMessage('Invalid Request');
        }

        return await this.customerService.createOrUpdate(customerDto);
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Delete(':ids')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Delete customers',
        operationId: 'deleteCustomers',
    })
    @ApiResponse({
        status: 200,
        description: 'Delete customers',
        type: GenericResponse,
    })
    @HttpCode(200)
    async delete(@Param('ids') ids: string): Promise<GenericResponse> {
        return await this.customerService.delete(ids.split(','));
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @ApiBearerAuth()
    @Post('archiveCustomer')
    @ApiOperation({
        summary: 'Archive customers',
        operationId: 'archiveCustomers',
    })
    @ApiResponse({
        status: 200,
        description: 'Archive customers',
        type: GenericResponse,
    })
    @HttpCode(200)
    async archive(@Body() ids: string[]): Promise<GenericResponse> {
        return await this.customerService.archive(ids);
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.AdminTech,
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.RH,
    )
    @Post('createCustomerFromReference')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'create customer from reference',
        operationId: 'createCustomerFromReference',
    })
    @ApiResponse({
        status: 200,
        description: 'create customer from reference',
        type: GetCustomerResponse,
    })
    @HttpCode(200)
    async createCustomerFromReference(
        @Body() request: GenerateCustomerFromeReferenceRequest,
    ): Promise<GetCustomerResponse> {
        if (!request.jobReferenceDto) {
            throw new AppErrorWithMessage('Invalid Request');
        }

        return await this.customerService.createCustomerFromReference(request);
    }

    @UseGuards(RolesGuard)
    @Roles(
        RolesList.Admin,
        RolesList.Consultant,
        RolesList.AdminTech,
        RolesList.RH,
    )
    @Post('checkCustomerAlreadyCreateFromReference')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Check Customer Already Create From Reference',
        operationId: 'checkCustomerAlreadyCreateFromReference',
    })
    @ApiResponse({
        status: 200,
        description: 'Check Customer Already Create From Reference',
        type: CustomerCreatedFromReferenceResponse,
    })
    @HttpCode(200)
    async checkCustomerAlreadyCreateFromReference(
        @Body() jobReferenceDto: JobReferenceDto,
    ): Promise<CustomerCreatedFromReferenceResponse> {
        return await this.customerService.checkCustomerAlreadyCreateFromReference(
            jobReferenceDto,
        );
    }
}
