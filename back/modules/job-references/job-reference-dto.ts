import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AddressDto } from '../../models/dto/address-dto';
import { AppValueDto } from '../../models/dto/app-value-dto';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { BaseSearchResponse } from '../../models/responses/base-search-responses';
import { GenericResponse } from '../../models/responses/generic-response';

export class JobReferenceDto {
    @ApiProperty()
    id: string;

    @ApiPropertyOptional()
    email?: string;

    @ApiPropertyOptional()
    phone?: string;

    @ApiPropertyOptional({ type: () => AddressDto, isArray: true })
    addresses?: AddressDto[];

    @ApiProperty()
    jobRefFunctionId: string;

    @ApiPropertyOptional({ type: () => AppValueDto })
    jobRefFunction?: AppValueDto;

    @ApiPropertyOptional()
    otherFunction?: string;

    @ApiProperty()
    candidateAcceptContact: boolean;

    @ApiProperty()
    isPrivatePerson: boolean;

    @ApiProperty()
    isCompany: boolean;

    @ApiPropertyOptional()
    privatePersonFirstName?: string;

    @ApiPropertyOptional()
    privatePersonLastName?: string;

    @ApiPropertyOptional()
    companyName?: string;

    @ApiPropertyOptional()
    note?: string;

    @ApiPropertyOptional()
    disabled?: boolean;

    @ApiProperty()
    customerHasBeenCreated: boolean;

    @ApiPropertyOptional()
    contactFullName?: string;

    @ApiPropertyOptional()
    jobReferenceId?: string;
}

export class CreateJobReferenceRequest {
    jobReferenceDto: JobReferenceDto;
    jobRefId?: string;
}

export class JobReferenceDistinctDto extends JobReferenceDto {
    @ApiProperty()
    referenceName: string;
    @ApiPropertyOptional()
    country?: string;
}

export class GetJobReferenceResponse extends GenericResponse {
    @ApiProperty({ type: () => JobReferenceDto })
    jobReference: JobReferenceDto;
}

export class GetJobReferencesResponse extends BaseSearchResponse {
    @ApiProperty({ type: () => JobReferenceDto, isArray: true })
    jobReferences: JobReferenceDto[] = [];
}

export class GetJobReferencesDistinctResponse extends BaseSearchResponse {
    @ApiProperty({ type: () => JobReferenceDistinctDto, isArray: true })
    jobReferences: JobReferenceDistinctDto[] = [];
}

export class GetJobReferencesRequest extends BaseSearchRequest {
    @ApiPropertyOptional({ description: 'filter job reference by function' })
    functionIds?: string;

    @ApiPropertyOptional({
        description: 'filter job reference by country code',
    })
    countryCode?: string;

    @ApiPropertyOptional({
        type: String,
        description: 'filter job reference witch accepted to be contact',
    })
    acceptToBeContact?: 'true' | 'false';

    @ApiPropertyOptional({ description: 'filter by city' })
    city?: string;
}

export class GetJobReferencesDistinctRequest extends BaseSearchRequest {
    @ApiPropertyOptional({
        description: 'select job reference by country code',
    })
    countriesCodes?: string;

    @ApiPropertyOptional({
        description: 'select job reference where are companies',
    })
    isCompany?: 'true' | 'false';

    @ApiPropertyOptional({
        description: 'select job reference where are privates persons',
    })
    isPrivatePerson?: 'true' | 'false';

    @ApiPropertyOptional({ description: 'select job reference not disabled' })
    disabled?: 'true' | 'false';
}

export class GetJobReferencesDetailsRequest extends BaseSearchRequest {
    @ApiPropertyOptional({ description: 'select job reference by country' })
    country?: string;

    @ApiPropertyOptional({
        description: 'select job reference by company name',
    })
    company?: string;

    @ApiPropertyOptional({
        description: 'select job reference by private persone firstName',
    })
    firstName?: string;

    @ApiPropertyOptional({
        description: 'select job reference by private persone firstName',
    })
    lastName?: string;

    @ApiPropertyOptional({ description: 'select job reference not disabled' })
    disabled?: 'true' | 'false';
}

export class JobReferencesDetailsDto extends JobReferenceDto {
    @ApiPropertyOptional()
    line1?: string;

    @ApiPropertyOptional()
    line2?: string;

    @ApiPropertyOptional()
    city?: string;

    @ApiPropertyOptional()
    country?: string;

    @ApiPropertyOptional()
    department?: string;

    @ApiPropertyOptional()
    postalCode?: string;

    @ApiPropertyOptional()
    jobFunction?: string;

    @ApiPropertyOptional()
    label?: string;

    @ApiPropertyOptional()
    candidateIdFromJobs?: string;

    @ApiProperty()
    jobRefId: string;

    @ApiPropertyOptional()
    functionLabel?: string;
}

export class GetJobReferencesDetailsDtoResponse extends BaseSearchResponse {
    @ApiProperty({ type: () => JobReferencesDetailsDto, isArray: true })
    jobReferences: JobReferencesDetailsDto[] = [];
}
