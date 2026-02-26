import { FindManyOptions, Repository } from 'typeorm';
import { ApplicationBaseModelService } from '../../services/base-model.service';
import { JobOfferService } from '../job-offers/job-offers.service';
import { JobReferenceDto } from '../job-references/job-reference-dto';
import { CustomerCreatedFromReferenceResponse, CustomerDto, GenerateCustomerFromeReferenceRequest, GetCustomerResponse, GetCustomersResponse } from './customer.dto';
import { Customer } from './customer.entity';
export declare class CustomerService extends ApplicationBaseModelService<Customer, CustomerDto, GetCustomerResponse, GetCustomersResponse> {
    private readonly repository;
    private jobOfferService;
    constructor(repository: Repository<Customer>, jobOfferService: JobOfferService);
    findAll(conditions?: FindManyOptions<Customer>, consultantId?: string, ...toDtoParameters: any): Promise<GetCustomersResponse>;
    createCustomerFromReference(request: GenerateCustomerFromeReferenceRequest): Promise<GetCustomerResponse>;
    checkCustomerAlreadyCreateFromReference(jobReferenceDto: JobReferenceDto): Promise<CustomerCreatedFromReferenceResponse>;
}
