import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MainHelpers } from 'nextalys-js-helpers';
import { FindConditions, FindManyOptions, Raw, Repository } from 'typeorm';
import { AppErrorWithMessage } from '../../models/app-error';
import { AddressDto } from '../../models/dto/address-dto';
import { ApplicationBaseModelService } from '../../services/base-model.service';
import { JobOfferService } from '../job-offers/job-offers.service';
import { JobReferenceDto } from '../job-references/job-reference-dto';
import {
    CustomerCreatedFromReferenceResponse,
    CustomerDto,
    GenerateCustomerFromeReferenceRequest,
    GetCustomerResponse,
    GetCustomersResponse,
} from './customer.dto';
import { Customer } from './customer.entity';

@Injectable()
export class CustomerService extends ApplicationBaseModelService<
    Customer,
    CustomerDto,
    GetCustomerResponse,
    GetCustomersResponse
> {
    constructor(
        @InjectRepository(Customer)
        private readonly repository: Repository<Customer>,
        private jobOfferService: JobOfferService,
    ) {
        super();

        this.modelOptions = {
            getManyResponse: GetCustomersResponse,
            getOneResponse: GetCustomerResponse,
            getManyResponseField: 'customers',
            getOneResponseField: 'customer',
            getManyRelations: [],
            getOneRelations: ['addresses', 'customerFunction'],
            repository: this.repository,
            entity: Customer,
            archiveField: 'disabled',
            archiveFieldValue: true,
        };
    }

    async findAll(
        conditions?: FindManyOptions<Customer>,
        consultantId?: string,
        ...toDtoParameters: any
    ): Promise<GetCustomersResponse> {
        try {
            if (consultantId) {
                if (!conditions.where) {
                    conditions.where = [{}];
                }

                const getJobOffersResponse = await this.jobOfferService.findAll(
                    { where: { consultantId } },
                );
                const customerIds = getJobOffersResponse.jobOffers.map(
                    (x) => x.customerId,
                );

                for (const whereItem of conditions.where as FindConditions<Customer>[]) {
                    whereItem.id = Raw(
                        (alias) =>
                            `${alias} IN ("${customerIds.join('","')}" )`,
                    );
                }
            }
        } catch (err) {
            console.log(
                '\n \n ~ file: customer.service.ts ~ line 44 ~ CustomerService ~ findAll ~ err',
                err,
            );
            throw new AppErrorWithMessage('error');
        }

        return super.findAll(conditions, toDtoParameters);
    }

    async createCustomerFromReference(
        request: GenerateCustomerFromeReferenceRequest,
    ): Promise<GetCustomerResponse> {
        const response = new GetCustomerResponse();

        try {
            let customer: CustomerDto;

            const test: any = request.jobReferenceDto;
            console.log(
                '🚀 ~ CustomerService ~ createCustomerFromReference ~ test',
                test.line1,
            );

            if (!request.overwrite) {
                customer = new CustomerDto();
                customer.addresses = [];
                console.log('\x1b[36m%s\x1b[35m', 'CREATE NEW CUSTOMER');
            } else {
                const findCustomerWithJobReferenceData = await super.findOne({
                    where: { id: request.customerId },
                    relations: ['addresses'],
                });
                customer = MainHelpers.cloneObject(
                    findCustomerWithJobReferenceData.customer,
                );
                console.log(
                    '\x1b[36m%s\x1b[35m',
                    'OVERWRITE CUSTOMER',
                    customer,
                );
            }

            if (customer === null || customer === undefined) {
                throw new AppErrorWithMessage('Une erreur est survenue');
                return;
            }

            if (request.jobReferenceDto.isPrivatePerson) {
                customer.firstName =
                    request.jobReferenceDto.privatePersonFirstName ?? '';
                customer.lastName =
                    request.jobReferenceDto.privatePersonLastName ?? '';
                customer.isPrivatePerson =
                    request.jobReferenceDto.isPrivatePerson;
                customer.isCompany = false;
                customer.customerFunctionId =
                    request.jobReferenceDto.jobRefFunctionId;
                customer.contactFullName =
                    request.jobReferenceDto.contactFullName;
            }

            if (request.jobReferenceDto.isCompany) {
                customer.companyName =
                    request.jobReferenceDto.companyName ?? '';
                customer.isCompany = request.jobReferenceDto.isCompany;
                customer.isPrivatePerson = false;
                customer.customerFunctionId =
                    request.jobReferenceDto.jobRefFunctionId;
                customer.contactFullName =
                    request.jobReferenceDto.contactFullName;
            }

            customer.phone = request.jobReferenceDto.phone;
            customer.email = request.jobReferenceDto.email;
            customer.disabled = false;

            const customerAddress = new AddressDto();
            customerAddress.lineOne = request.jobReferenceDto.line1;
            customerAddress.lineTwo = request.jobReferenceDto.line2;
            customerAddress.department = request.jobReferenceDto.department;
            customerAddress.postalCode = request.jobReferenceDto.postalCode;
            customerAddress.city = request.jobReferenceDto.city;
            customerAddress.country = request.jobReferenceDto.country;

            console.log(
                '🚀 ~ CustomerService ~ createCustomerFromReference ~ customerAddress',
                customerAddress,
            );
            customer.addresses.push(customerAddress);

            await super.createOrUpdate(customer);

            response.customer = customer;
            console.log(
                '🚀 ~ CustomerService ~ createCustomerFromReference ~ customer',
                customer,
            );
            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    async checkCustomerAlreadyCreateFromReference(
        jobReferenceDto: JobReferenceDto,
    ): Promise<CustomerCreatedFromReferenceResponse> {
        const response = new CustomerCreatedFromReferenceResponse();
        response.customers = [];
        response.alreadyExist = false;

        try {
            console.log(jobReferenceDto);
            let findCustomerWithJobReferenceData: GetCustomersResponse;

            if (jobReferenceDto.isPrivatePerson) {
                findCustomerWithJobReferenceData = await super.findAll({
                    where: {
                        lastName: jobReferenceDto.privatePersonLastName,
                        firstName: jobReferenceDto.privatePersonFirstName,
                    },
                    relations: ['addresses'],
                });
            }

            if (jobReferenceDto.isCompany) {
                findCustomerWithJobReferenceData = await super.findAll({
                    where: { companyName: jobReferenceDto.companyName },
                    relations: ['addresses'],
                });
            }

            if (!findCustomerWithJobReferenceData.success) {
                response.message = findCustomerWithJobReferenceData.message;
                return;
            }

            if (findCustomerWithJobReferenceData.customers?.length) {
                response.alreadyExist = true;
                response.customers = findCustomerWithJobReferenceData.customers;
            }

            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }
}
