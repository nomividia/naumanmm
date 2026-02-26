import { AddressDto } from '../../models/dto/address-dto';
import { AppValueDto } from '../../models/dto/app-value-dto';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { BaseSearchResponse } from '../../models/responses/base-search-responses';
import { GenericResponse } from '../../models/responses/generic-response';
export declare class JobReferenceDto {
    id: string;
    email?: string;
    phone?: string;
    addresses?: AddressDto[];
    jobRefFunctionId: string;
    jobRefFunction?: AppValueDto;
    otherFunction?: string;
    candidateAcceptContact: boolean;
    isPrivatePerson: boolean;
    isCompany: boolean;
    privatePersonFirstName?: string;
    privatePersonLastName?: string;
    companyName?: string;
    note?: string;
    disabled?: boolean;
    customerHasBeenCreated: boolean;
    contactFullName?: string;
    jobReferenceId?: string;
}
export declare class CreateJobReferenceRequest {
    jobReferenceDto: JobReferenceDto;
    jobRefId?: string;
}
export declare class JobReferenceDistinctDto extends JobReferenceDto {
    referenceName: string;
    country?: string;
}
export declare class GetJobReferenceResponse extends GenericResponse {
    jobReference: JobReferenceDto;
}
export declare class GetJobReferencesResponse extends BaseSearchResponse {
    jobReferences: JobReferenceDto[];
}
export declare class GetJobReferencesDistinctResponse extends BaseSearchResponse {
    jobReferences: JobReferenceDistinctDto[];
}
export declare class GetJobReferencesRequest extends BaseSearchRequest {
    functionIds?: string;
    countryCode?: string;
    acceptToBeContact?: 'true' | 'false';
    city?: string;
}
export declare class GetJobReferencesDistinctRequest extends BaseSearchRequest {
    countriesCodes?: string;
    isCompany?: 'true' | 'false';
    isPrivatePerson?: 'true' | 'false';
    disabled?: 'true' | 'false';
}
export declare class GetJobReferencesDetailsRequest extends BaseSearchRequest {
    country?: string;
    company?: string;
    firstName?: string;
    lastName?: string;
    disabled?: 'true' | 'false';
}
export declare class JobReferencesDetailsDto extends JobReferenceDto {
    line1?: string;
    line2?: string;
    city?: string;
    country?: string;
    department?: string;
    postalCode?: string;
    jobFunction?: string;
    label?: string;
    candidateIdFromJobs?: string;
    jobRefId: string;
    functionLabel?: string;
}
export declare class GetJobReferencesDetailsDtoResponse extends BaseSearchResponse {
    jobReferences: JobReferencesDetailsDto[];
}
