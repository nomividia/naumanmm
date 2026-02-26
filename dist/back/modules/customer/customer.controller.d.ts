import { GenericResponse } from '../../models/responses/generic-response';
import { BaseController } from '../../shared/base.controller';
import { JobReferenceDto } from '../job-references/job-reference-dto';
import { CustomerCreatedFromReferenceResponse, CustomerDto, CustomersRequest, GenerateCustomerFromeReferenceRequest, GetCustomerResponse, GetCustomersResponse } from './customer.dto';
import { CustomerService } from './customer.service';
export declare class CustomerController extends BaseController {
    private readonly customerService;
    constructor(customerService: CustomerService);
    getAll(request: CustomersRequest): Promise<GetCustomersResponse>;
    get(id: string): Promise<GetCustomerResponse>;
    createOrUpdate(customerDto: CustomerDto): Promise<GetCustomerResponse>;
    delete(ids: string): Promise<GenericResponse>;
    archive(ids: string[]): Promise<GenericResponse>;
    createCustomerFromReference(request: GenerateCustomerFromeReferenceRequest): Promise<GetCustomerResponse>;
    checkCustomerAlreadyCreateFromReference(jobReferenceDto: JobReferenceDto): Promise<CustomerCreatedFromReferenceResponse>;
}
