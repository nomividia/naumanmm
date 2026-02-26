import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AddressDto } from '../../models/dto/address-dto';
import { AppValueDto } from '../../models/dto/app-value-dto';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { BaseSearchResponse } from '../../models/responses/base-search-responses';
import { GenericResponse } from '../../models/responses/generic-response';
import { JobReferencesDetailsDto } from '../job-references/job-reference-dto';

export class CustomerDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiPropertyOptional()
    firstName?: string;

    @ApiPropertyOptional()
    lastName?: string;

    @ApiPropertyOptional()
    email?: string;

    @ApiPropertyOptional()
    phone?: string;

    @ApiPropertyOptional({ type: () => AddressDto, isArray: true })
    addresses?: AddressDto[];

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    public creationDate?: Date;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    public modifDate?: Date;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    dateOfContact?: Date;

    @ApiPropertyOptional()
    isPrivatePerson?: boolean;

    @ApiPropertyOptional()
    isCompany?: boolean;

    @ApiPropertyOptional()
    companyName?: string;

    @ApiPropertyOptional()
    disabled?: boolean;

    @ApiPropertyOptional()
    contactFullName?: string;

    @ApiPropertyOptional()
    customerFunctionId?: string;

    @ApiPropertyOptional()
    customerFunction?: AppValueDto;
}

export class GetCustomerResponse extends GenericResponse {
    @ApiPropertyOptional({ type: () => CustomerDto })
    customer?: CustomerDto;
}

export class GetCustomersResponse extends BaseSearchResponse {
    @ApiPropertyOptional({ type: () => CustomerDto, isArray: true })
    customers?: CustomerDto[] = [];
}

export class CustomersRequest extends BaseSearchRequest {
    @ApiPropertyOptional({ description: 'filter customer by country code' })
    countryCode?: string;

    @ApiPropertyOptional({ description: 'filter customer by cities' })
    city?: string;

    @ApiPropertyOptional({
        description: 'filter customer by id of the consultant',
    })
    consultantId?: string;

    @ApiPropertyOptional({ description: 'filter customer by customer type' })
    isCompany?: 'true' | 'false';

    @ApiPropertyOptional({ description: 'filter customer by customer type' })
    isPrivatePerson?: 'true' | 'false';

    @ApiPropertyOptional({ description: 'include or not customer function' })
    includeCustomerFunction?: 'true' | 'false';
}

export class GenerateCustomerFromeReferenceRequest {
    @ApiProperty({ type: () => JobReferencesDetailsDto })
    jobReferenceDto: JobReferencesDetailsDto;

    @ApiProperty()
    overwrite: boolean;

    @ApiPropertyOptional()
    customerId?: string;
}

export class CustomerCreatedFromReferenceResponse extends GenericResponse {
    @ApiProperty({ type: () => CustomerDto, isArray: true })
    customers: CustomerDto[];

    @ApiProperty()
    alreadyExist: boolean;
}
