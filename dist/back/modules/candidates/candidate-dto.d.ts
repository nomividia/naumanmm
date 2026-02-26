import { CandidateAllergiesEnum, JobHousedEnum } from '../../../shared/shared-constants';
import { CandidateJobStatus } from '../../../shared/types/candidate-job-status.type';
import { AddressDto } from '../../models/dto/address-dto';
import { AppFileDto } from '../../models/dto/app-file-dto';
import { AppValueDto } from '../../models/dto/app-value-dto';
import { LanguageDto } from '../../models/dto/language-dto';
import { NoteItemDto } from '../../models/dto/note-item.dto';
import { UserDto } from '../../models/dto/user-dto';
import { BaseSearchRequest } from '../../models/requests/base-search-requests';
import { BaseSearchResponse } from '../../models/responses/base-search-responses';
import { GenericResponse } from '../../models/responses/generic-response';
import { CandidateApplicationDto } from '../candidates-application/candidate-application-dto';
import { NxsAppGetFileResponse } from '../gdrive/gcloud-storage-service';
import { InterviewDto } from '../interviews/interview-dto';
import { JobOfferDto } from '../job-offers/job-offer-dto';
import { CandidateChildrenDto } from './candidate-children/candidate-children.dto';
import { CandidateContractDto } from './candidate-contract.dto';
import { CandidateCountryDto } from './candidate-country/candidate-country.dto';
import { CandidateCurrentJobDto } from './candidate-current-jobs/candidate-current-jobs.dto';
import { CandidateDepartmentDto } from './candidate-department/candidate-department.dto';
import { CandidateFileDto } from './candidate-file-dto';
import { CandidateJobDto } from './candidate-jobs.dto';
import { CandidateLanguageDto } from './candidate-language/candidate-language.dto';
import { CandidateLicenceDto } from './candidate-licences/candidate-licences-dto';
import { CandidatePetDto } from './candidate-pets/candidate-pet-dto';
import { CandidateReadonlyPropertyDto } from './candidate-readonly/candidate-readonly-property.dto';
export declare class CandidateDto {
    id?: string;
    lastName: string;
    firstName: string;
    nickName: string;
    genderId: string;
    gender?: AppValueDto;
    birthDate: Date;
    phone: string;
    phoneSecondary: string;
    email: string;
    additionalEmails?: string[];
    nationality: string;
    relationshipStatusId: string;
    relationshipStatus?: AppValueDto;
    skills: string;
    inCouple: boolean;
    isJobHoused: JobHousedEnum;
    hasLicenceDriver: boolean;
    languageId?: string;
    language?: LanguageDto;
    dependentChildren: number;
    animal: boolean;
    isAvailable?: boolean;
    creationDate?: Date;
    modifDate?: Date;
    addresses?: AddressDto[];
    candidateStatusId?: string;
    candidateStatus?: AppValueDto;
    placedJobOfferId?: string;
    placedJobOffer?: JobOfferDto;
    candidateApplications?: CandidateApplicationDto[];
    contractTypeAskedId: string;
    contractTypeAsked?: AppValueDto;
    workingTimeTypeId: string;
    workingTimeType?: AppValueDto;
    files?: CandidateFileDto[];
    mainPhotoBase64?: string;
    mainPhotoBase64MimeType?: string;
    note?: number;
    noteItems?: NoteItemDto[];
    candidateJobs?: CandidateJobDto[];
    candidateLicences?: CandidateLicenceDto[];
    interviews?: InterviewDto[];
    candidateLanguages?: CandidateLanguageDto[];
    candidateChildrens?: CandidateChildrenDto[];
    partnerFirstName: string;
    partnerLastName: string;
    partnerGenderId: string;
    partnerGender?: AppValueDto;
    partnerBirthDate: Date;
    partnerEmail?: string;
    partnerPhone?: string;
    userAlreadyExist?: boolean;
    lastCandidateMessageSendedDate?: Date;
    candidateMessagesUnseen?: boolean;
    candidateAdvancementPercent?: number;
    candidateApplicationsLength?: number;
    hasNoChildren?: boolean;
    candidateReadonlyProperties?: CandidateReadonlyPropertyDto[];
    isOnPost?: boolean;
    consultant?: UserDto;
    consultantId?: string;
    disabled?: boolean;
    jobAdderContactId?: number;
    isVehicle?: boolean;
    candidatePets?: CandidatePetDto[];
    candidateFieldsMiss?: string[];
    candidateContracts?: CandidateContractDto[];
    candidateCountries?: CandidateCountryDto[];
    candidateDepartments?: CandidateDepartmentDto[];
    manuallyCompleted?: boolean;
    mailSentAfterMigration?: boolean;
    associatedUser?: UserDto;
    candidateCurrentJobs?: CandidateCurrentJobDto[];
    globalMobility?: boolean;
    hasManyTravel?: boolean;
    referencesValidated?: boolean;
    allergy?: CandidateAllergiesEnum;
    newsletterUnsubscribed: boolean;
    newsletterUnsubscribedGuid: string;
    allowed_to_work_us?: boolean;
    require_sponsorship_us?: boolean;
    city?: string;
    jobTitle?: string;
}
export declare class GetCandidateResponse extends GenericResponse {
    candidate: CandidateDto;
    hasNewMainPhoto: boolean;
}
export declare class GetCandidatesResponse extends BaseSearchResponse {
    candidates: CandidateDto[];
}
export declare class GetCandidateRequest {
    specificRelations?: string;
    includeFiles?: 'true' | 'false';
    includeLicences?: 'true' | 'false';
    includeAddresses?: 'true' | 'false';
    includeNoteItems?: 'true' | 'false';
    includeCandidateJobs?: 'true' | 'false';
    includeLanguages?: 'true' | 'false';
    includeChildren?: 'true' | 'false';
    includeResume?: 'true' | 'false';
    includeConsultant?: 'true' | 'false';
    includePets?: 'true' | 'false';
    includeContracts?: 'true' | 'false';
    includeCountries?: 'true' | 'false';
    includeDepartments?: 'true' | 'false';
    includeCurrentJobs?: 'true' | 'false';
    includeBasicInformations?: 'true' | 'false';
}
export declare class SaveCandidateRequest extends GetCandidateRequest {
    candidate: CandidateDto;
}
declare class LanguageRequest {
    language: string;
    level: string;
}
export declare class GetCandidatesRequest extends BaseSearchRequest {
    candidateStatut?: string;
    jobIds?: string;
    candidateGender?: string;
    candidateNationality?: string;
    candidateMinYear?: Date;
    candidateMaxYear?: Date;
    jobHoused?: JobHousedEnum;
    driverLicence?: 'true' | 'false';
    mobilityCountries?: string;
    mobilityDepartments?: string;
    childrenMinAge?: string;
    childrenMaxAge?: string;
    pets?: 'true' | 'false';
    contractType?: string;
    isAvailable?: 'true' | 'false';
    candidateLocation?: string;
    licencesIds?: string;
    languagesIds?: string;
    includePercentageAdvancement?: 'true' | 'false';
    disabled?: 'true' | 'false';
    city?: string[];
    department?: string;
    isVehicle?: 'true' | 'false';
    consultantIds?: string;
    includeUnassignedCandidates?: 'true' | 'false';
    candidateIdsFromReferences?: string;
    languages?: LanguageRequest[];
    globalMobility?: 'true' | 'false';
    note?: number;
    hasManyTravel?: 'true' | 'false';
}
export declare class GetCandidatesForMessageResponse extends BaseSearchResponse {
    unseenCandidateMessages: number;
    candidates: CandidateDto[];
}
export declare class GetUnseenMessagesCountResponse extends BaseSearchResponse {
    unSeenMessagesCount: number;
}
export declare class GetCandidateEmailData {
    email: string;
    firstName: string;
    recoverToken?: string;
}
export declare class GetCandidateJobsConditionResponse extends GenericResponse {
    candidateJobIds?: string[];
    applyInCouple?: boolean;
    city?: string;
    contractTypeId?: string;
}
export declare class GetCandidateJobsRequest extends BaseSearchRequest {
    onlyInActivity?: 'true' | 'false';
}
export declare class GetCandidateApplicationsLength extends GenericResponse {
    applications: number;
}
export declare class UploadCandidateFilesToGdriveResponse extends NxsAppGetFileResponse {
    newCandidateFileDto?: CandidateFileDto;
    newCandidateApplicationFileDto?: AppFileDto;
}
export declare class GetCandidateImageResponse extends GenericResponse {
    candidate: CandidateDto;
    candidateHasImage: boolean;
}
export declare class CandidateResumeOptions {
    candidateId: string;
    language?: 'fr' | 'en';
    showAge?: boolean;
    showNationality?: boolean;
    selectedJobId?: string;
}
export declare class SendCandidateByEmailRequest extends BaseSearchRequest {
    to: string;
    subject: string;
    body: string;
    customerName: string;
    mode: 'sendResumes' | 'sendCandidate';
    candidatePublicLink: string;
    candidateId?: string;
    candidateFiles?: CandidateFileDto[];
    candidatesIds?: string;
    candidateResumeOptions?: CandidateResumeOptions[];
}
export declare class CandidateForResumeDto extends CandidateDto {
    candidateChildStringValue?: string;
    birthDateString?: string;
}
export declare class GetCandidateLanguageResponse extends GenericResponse {
    language: LanguageDto;
    isDefaultLanguage?: boolean;
}
export declare class UpdateCandidateJobStatusDto {
    candidateJobId: string;
    status: CandidateJobStatus;
}
export declare class UpdateCandidateJobsStatusRequest {
    candidateId: string;
    candidateJobUpdates: UpdateCandidateJobStatusDto[];
}
export {};
