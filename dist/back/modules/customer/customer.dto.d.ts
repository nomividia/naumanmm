import { AddressDto } from '../../models/dto/address-dto';
import { AppValueDto } from '../../models/dto/app-value-dto';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { BaseSearchResponse } from '../../models/responses/base-search-responses';
import { GenericResponse } from '../../models/responses/generic-response';
import { JobReferencesDetailsDto } from '../job-references/job-reference-dto';
export declare class CustomerDto {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    addresses?: AddressDto[];
    creationDate?: Date;
    modifDate?: Date;
    dateOfContact?: Date;
    isPrivatePerson?: boolean;
    isCompany?: boolean;
    companyName?: string;
    disabled?: boolean;
    contactFullName?: string;
    customerFunctionId?: string;
    customerFunction?: AppValueDto;
}
export declare class GetCustomerResponse extends GenericResponse {
    customer?: CustomerDto;
}
export declare class GetCustomersResponse extends BaseSearchResponse {
    customers?: CustomerDto[];
}
export declare class CustomersRequest extends BaseSearchRequest {
    countryCode?: string;
    city?: string;
    consultantId?: string;
    isCompany?: 'true' | 'false';
    isPrivatePerson?: 'true' | 'false';
    includeCustomerFunction?: 'true' | 'false';
}
export declare class GenerateCustomerFromeReferenceRequest {
    jobReferenceDto: JobReferencesDetailsDto;
    overwrite: boolean;
    customerId?: string;
}
export declare class CustomerCreatedFromReferenceResponse extends GenericResponse {
    customers: CustomerDto[];
    alreadyExist: boolean;
}
