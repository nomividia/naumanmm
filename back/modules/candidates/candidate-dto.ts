import {
    ApiHideProperty,
    ApiProperty,
    ApiPropertyOptional,
} from '@nestjs/swagger';
import {
    CandidateAllergiesEnum,
    JobHousedEnum,
} from '../../../shared/shared-constants';
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

export class CandidateDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    nickName: string;

    @ApiProperty()
    genderId: string;

    @ApiPropertyOptional({ type: () => AppValueDto })
    gender?: AppValueDto;

    @ApiProperty({ type: String, format: 'date-time' })
    birthDate: Date;

    // @ApiPropertyOptional()
    // professionId: string
    // @ApiPropertyOptional({ type: () => AppValueDto })
    // profession?: AppValueDto;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    phoneSecondary: string;

    @ApiProperty()
    email: string;

    @ApiPropertyOptional({ type: [String] })
    additionalEmails?: string[];

    @ApiProperty()
    nationality: string;

    @ApiProperty()
    relationshipStatusId: string;

    @ApiPropertyOptional({ type: () => AppValueDto })
    relationshipStatus?: AppValueDto;

    @ApiProperty()
    skills: string; //TODO skill entity

    @ApiProperty()
    inCouple: boolean;

    @ApiProperty({ type: () => String })
    isJobHoused: JobHousedEnum;

    @ApiProperty()
    hasLicenceDriver: boolean;

    @ApiPropertyOptional()
    languageId?: string;

    @ApiPropertyOptional({ type: () => LanguageDto })
    language?: LanguageDto; //Language level

    @ApiProperty()
    dependentChildren: number;

    @ApiProperty()
    animal: boolean;

    @ApiPropertyOptional()
    isAvailable?: boolean;

    // @ApiPropertyOptional({ type: () => AppFileDto, isArray: true })
    // files?: AppFileDto[];

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    public creationDate?: Date;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    public modifDate?: Date;

    @ApiPropertyOptional({ type: () => AddressDto, isArray: true })
    addresses?: AddressDto[];

    @ApiPropertyOptional()
    candidateStatusId?: string;

    @ApiPropertyOptional({ type: () => AppValueDto })
    candidateStatus?: AppValueDto;

    @ApiPropertyOptional()
    placedJobOfferId?: string;

    @ApiPropertyOptional({ type: () => JobOfferDto })
    placedJobOffer?: JobOfferDto;

    @ApiPropertyOptional({ type: () => CandidateApplicationDto, isArray: true })
    candidateApplications?: CandidateApplicationDto[];

    // @ApiPropertyOptional({ type: () => AppValueDto, isArray: true })
    // jobs?: AppValueDto[];
    // todo : remove

    @ApiPropertyOptional()
    contractTypeAskedId: string;

    @ApiPropertyOptional({ type: () => AppValueDto })
    contractTypeAsked?: AppValueDto;

    @ApiPropertyOptional()
    workingTimeTypeId: string;

    @ApiPropertyOptional({ type: () => AppValueDto })
    workingTimeType?: AppValueDto;

    @ApiPropertyOptional({ type: () => CandidateFileDto, isArray: true })
    files?: CandidateFileDto[];

    @ApiPropertyOptional()
    mainPhotoBase64?: string;

    @ApiPropertyOptional()
    mainPhotoBase64MimeType?: string;

    @ApiPropertyOptional()
    note?: number;

    @ApiPropertyOptional({ type: () => NoteItemDto, isArray: true })
    noteItems?: NoteItemDto[];

    @ApiPropertyOptional({ type: () => CandidateJobDto, isArray: true })
    candidateJobs?: CandidateJobDto[];

    @ApiPropertyOptional({ type: () => CandidateLicenceDto, isArray: true })
    candidateLicences?: CandidateLicenceDto[];

    @ApiPropertyOptional({ type: () => InterviewDto, isArray: true })
    interviews?: InterviewDto[];

    @ApiPropertyOptional({ type: () => CandidateLanguageDto, isArray: true })
    candidateLanguages?: CandidateLanguageDto[];

    @ApiPropertyOptional({ type: () => CandidateChildrenDto, isArray: true })
    candidateChildrens?: CandidateChildrenDto[];

    @ApiPropertyOptional()
    partnerFirstName: string;

    @ApiPropertyOptional()
    partnerLastName: string;

    @ApiPropertyOptional()
    partnerGenderId: string;

    @ApiPropertyOptional({ type: () => AppValueDto })
    partnerGender?: AppValueDto;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    partnerBirthDate: Date;

    @ApiPropertyOptional()
    partnerEmail?: string;

    @ApiPropertyOptional()
    partnerPhone?: string;

    @ApiPropertyOptional()
    userAlreadyExist?: boolean;

    @ApiPropertyOptional({ type: () => String, format: 'date-time' })
    lastCandidateMessageSendedDate?: Date;

    @ApiPropertyOptional()
    candidateMessagesUnseen?: boolean;

    @ApiPropertyOptional()
    candidateAdvancementPercent?: number;

    @ApiPropertyOptional()
    candidateApplicationsLength?: number;

    @ApiPropertyOptional()
    hasNoChildren?: boolean;

    @ApiPropertyOptional({
        type: () => CandidateReadonlyPropertyDto,
        isArray: true,
    })
    candidateReadonlyProperties?: CandidateReadonlyPropertyDto[];

    @ApiPropertyOptional()
    isOnPost?: boolean;

    @ApiPropertyOptional({ type: () => UserDto })
    consultant?: UserDto;

    @ApiPropertyOptional()
    consultantId?: string;

    @ApiPropertyOptional()
    disabled?: boolean;

    @ApiPropertyOptional()
    jobAdderContactId?: number;

    @ApiPropertyOptional()
    isVehicle?: boolean;

    @ApiPropertyOptional({ type: () => CandidatePetDto, isArray: true })
    candidatePets?: CandidatePetDto[];

    @ApiPropertyOptional({ type: () => String, isArray: true })
    candidateFieldsMiss?: string[];

    @ApiPropertyOptional({ type: () => CandidateContractDto, isArray: true })
    candidateContracts?: CandidateContractDto[];

    @ApiPropertyOptional({ type: () => CandidateCountryDto, isArray: true })
    candidateCountries?: CandidateCountryDto[];

    @ApiPropertyOptional({ type: () => CandidateDepartmentDto, isArray: true })
    candidateDepartments?: CandidateDepartmentDto[];

    @ApiPropertyOptional()
    manuallyCompleted?: boolean;

    @ApiPropertyOptional()
    mailSentAfterMigration?: boolean;

    @ApiPropertyOptional({ type: () => UserDto })
    associatedUser?: UserDto;

    @ApiPropertyOptional({ type: () => CandidateCurrentJobDto, isArray: true })
    candidateCurrentJobs?: CandidateCurrentJobDto[];

    @ApiPropertyOptional()
    globalMobility?: boolean;

    @ApiPropertyOptional()
    hasManyTravel?: boolean;

    @ApiPropertyOptional()
    referencesValidated?: boolean;

    @ApiPropertyOptional({
        enum: CandidateAllergiesEnum,
        enumName: 'CandidateAllergiesEnum',
    })
    allergy?: CandidateAllergiesEnum;

    @ApiProperty()
    newsletterUnsubscribed: boolean;

    @ApiPropertyOptional()
    newsletterUnsubscribedGuid: string;

    @ApiPropertyOptional()
    allowed_to_work_us?: boolean;

    @ApiPropertyOptional()
    require_sponsorship_us?: boolean;

    @ApiPropertyOptional()
    city?: string;

    @ApiPropertyOptional()
    jobTitle?: string;
}

export class GetCandidateResponse extends GenericResponse {
    @ApiProperty({ type: () => CandidateDto })
    candidate: CandidateDto;

    @ApiHideProperty()
    hasNewMainPhoto: boolean;
}

export class GetCandidatesResponse extends BaseSearchResponse {
    @ApiProperty({ type: () => CandidateDto, isArray: true })
    candidates: CandidateDto[] = [];
}

export class GetCandidateRequest {
    // @ApiPropertyOptional({ description: 'include photo ? true or false', type: String })
    // includePhoto?: 'true' | 'false';

    @ApiPropertyOptional()
    specificRelations?: string;

    @ApiPropertyOptional({ type: String })
    includeFiles?: 'true' | 'false';

    @ApiPropertyOptional({ type: String })
    includeLicences?: 'true' | 'false';

    @ApiPropertyOptional({ type: String })
    includeAddresses?: 'true' | 'false';

    @ApiPropertyOptional({ type: String })
    includeNoteItems?: 'true' | 'false';

    @ApiPropertyOptional({ type: String })
    includeCandidateJobs?: 'true' | 'false';

    @ApiPropertyOptional({ type: String })
    includeLanguages?: 'true' | 'false';

    @ApiPropertyOptional({ type: String })
    includeChildren?: 'true' | 'false';

    @ApiPropertyOptional({ type: String })
    includeResume?: 'true' | 'false';

    @ApiPropertyOptional({ type: String })
    includeConsultant?: 'true' | 'false';

    @ApiPropertyOptional({ type: String })
    includePets?: 'true' | 'false';

    @ApiPropertyOptional({ type: String })
    includeContracts?: 'true' | 'false';

    @ApiPropertyOptional({ type: String })
    includeCountries?: 'true' | 'false';

    @ApiPropertyOptional({ type: String })
    includeDepartments?: 'true' | 'false';

    @ApiPropertyOptional({ type: String })
    includeCurrentJobs?: 'true' | 'false';

    @ApiPropertyOptional({ type: String })
    includeBasicInformations?: 'true' | 'false';
}
export class SaveCandidateRequest extends GetCandidateRequest {
    @ApiProperty({ type: () => CandidateDto })
    candidate: CandidateDto;
}

class LanguageRequest {
    language: string;
    level: string;
}

export class GetCandidatesRequest extends BaseSearchRequest {
    @ApiPropertyOptional({
        description: 'filter candidates with a specific status',
    })
    candidateStatut?: string;

    @ApiPropertyOptional({ description: 'filter candidates by jobs' })
    jobIds?: string;

    @ApiPropertyOptional({ description: 'filter candidates by gender' })
    candidateGender?: string;

    @ApiPropertyOptional({ description: 'filter candidates by nationality' })
    candidateNationality?: string;

    @ApiPropertyOptional({
        type: String,
        description: 'set filter candidates min age',
    })
    candidateMinYear?: Date;

    @ApiPropertyOptional({
        type: String,
        description: 'set filter candidates max age',
    })
    candidateMaxYear?: Date;

    @ApiPropertyOptional({
        type: String,
        description: 'filter candidates by job housed criteria',
    })
    jobHoused?: JobHousedEnum;

    @ApiPropertyOptional({
        description: 'filter candidates with driver licence',
    })
    driverLicence?: 'true' | 'false';

    @ApiPropertyOptional({
        description: 'filter candidates mobility countries',
    })
    mobilityCountries?: string;

    @ApiPropertyOptional({
        description: 'filter candidates mobility departments',
    })
    mobilityDepartments?: string;

    @ApiPropertyOptional({ description: 'filter candidates children min age' })
    childrenMinAge?: string;

    @ApiPropertyOptional({ description: 'filter candidates children max age' })
    childrenMaxAge?: string;

    @ApiPropertyOptional({ description: 'filter candidates by pets' })
    pets?: 'true' | 'false';

    @ApiPropertyOptional({
        description: 'filter candidates with contract type',
    })
    contractType?: string;

    @ApiPropertyOptional({
        description: 'filter candidates if available or not',
    })
    isAvailable?: 'true' | 'false';

    @ApiPropertyOptional({ description: 'filter candidates by location' })
    candidateLocation?: string;

    @ApiPropertyOptional({ description: 'filter candidates by licences' })
    licencesIds?: string;

    @ApiPropertyOptional({ description: 'filter candidates by language' })
    languagesIds?: string;

    @ApiPropertyOptional({
        description: 'include percentage advancement dossier ? true or false',
        type: String,
    })
    includePercentageAdvancement?: 'true' | 'false';

    @ApiPropertyOptional({ description: 'filter by disabled', type: String })
    disabled?: 'true' | 'false';

    @ApiPropertyOptional({
        description: 'search candidate by cities',
        type: [String],
    })
    city?: string[];

    @ApiPropertyOptional({ description: 'search candidate by department' })
    department?: string;

    @ApiPropertyOptional({ description: 'filter candidates if vehicle or not' })
    isVehicle?: 'true' | 'false';

    @ApiPropertyOptional({ description: 'get candidate by consultants' })
    consultantIds?: string;

    @ApiPropertyOptional({
        description:
            'include candidates without assigned consultant when filtering by consultantIds',
        type: String,
    })
    includeUnassignedCandidates?: 'true' | 'false';

    @ApiPropertyOptional({
        description: 'filter candidates by ids from references',
    })
    candidateIdsFromReferences?: string;

    @ApiPropertyOptional({
        type: () => LanguageRequest,
        description: 'languages',
        isArray: true,
    })
    languages?: LanguageRequest[];

    @ApiPropertyOptional({
        type: String,
        description: 'filter candidates if have global mobility or not',
    })
    globalMobility?: 'true' | 'false';

    @ApiPropertyOptional({ description: 'get candidate by note' })
    note?: number;

    @ApiPropertyOptional({
        type: String,
        description: 'get candidate by travel',
    })
    hasManyTravel?: 'true' | 'false';
}

export class GetCandidatesForMessageResponse extends BaseSearchResponse {
    @ApiProperty()
    unseenCandidateMessages: number;

    @ApiProperty({ type: () => CandidateDto, isArray: true })
    candidates: CandidateDto[] = [];
}

export class GetUnseenMessagesCountResponse extends BaseSearchResponse {
    @ApiProperty()
    unSeenMessagesCount: number;
}

export class GetCandidateEmailData {
    @ApiProperty()
    email: string;

    @ApiProperty()
    firstName: string;

    @ApiPropertyOptional()
    recoverToken?: string;
}

export class GetCandidateJobsConditionResponse extends GenericResponse {
    @ApiProperty({ type: () => String, isArray: true })
    candidateJobIds?: string[];

    @ApiPropertyOptional()
    applyInCouple?: boolean;

    @ApiPropertyOptional()
    city?: string;

    @ApiPropertyOptional()
    contractTypeId?: string;
}

export class GetCandidateJobsRequest extends BaseSearchRequest {
    @ApiPropertyOptional({ description: 'get only inActivity or not' })
    onlyInActivity?: 'true' | 'false';
}

export class GetCandidateApplicationsLength extends GenericResponse {
    @ApiProperty()
    applications: number;
}

export class UploadCandidateFilesToGdriveResponse extends NxsAppGetFileResponse {
    newCandidateFileDto?: CandidateFileDto;
    newCandidateApplicationFileDto?: AppFileDto;
}

export class GetCandidateImageResponse extends GenericResponse {
    @ApiHideProperty()
    candidate: CandidateDto;
    @ApiProperty()
    candidateHasImage: boolean;
}

export class CandidateResumeOptions {
    @ApiProperty()
    candidateId: string;

    @ApiPropertyOptional()
    language?: 'fr' | 'en';

    @ApiPropertyOptional()
    showAge?: boolean;

    @ApiPropertyOptional()
    showNationality?: boolean;

    @ApiPropertyOptional()
    selectedJobId?: string;
}

export class SendCandidateByEmailRequest extends BaseSearchRequest {
    @ApiProperty()
    to: string;

    @ApiProperty()
    subject: string;

    @ApiProperty()
    body: string;

    @ApiProperty()
    customerName: string;

    @ApiProperty()
    mode: 'sendResumes' | 'sendCandidate';

    @ApiPropertyOptional()
    candidatePublicLink: string;

    @ApiPropertyOptional()
    candidateId?: string;

    @ApiPropertyOptional({ type: () => CandidateFileDto, isArray: true })
    candidateFiles?: CandidateFileDto[];

    @ApiPropertyOptional()
    candidatesIds?: string;

    @ApiPropertyOptional({ type: () => CandidateResumeOptions, isArray: true })
    candidateResumeOptions?: CandidateResumeOptions[];
}
export class CandidateForResumeDto extends CandidateDto {
    @ApiPropertyOptional()
    candidateChildStringValue?: string;

    @ApiPropertyOptional()
    birthDateString?: string;
}

export class GetCandidateLanguageResponse extends GenericResponse {
    @ApiProperty()
    language: LanguageDto;

    @ApiPropertyOptional()
    isDefaultLanguage?: boolean;
}

export class UpdateCandidateJobStatusDto {
    @ApiPropertyOptional()
    candidateJobId: string;

    @ApiPropertyOptional({ enum: CandidateJobStatus })
    status: CandidateJobStatus;
}

export class UpdateCandidateJobsStatusRequest {
    @ApiPropertyOptional()
    candidateId: string;

    @ApiPropertyOptional({
        type: () => UpdateCandidateJobStatusDto,
        isArray: true,
    })
    candidateJobUpdates: UpdateCandidateJobStatusDto[];
}
