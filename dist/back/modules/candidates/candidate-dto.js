"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCandidateJobsStatusRequest = exports.UpdateCandidateJobStatusDto = exports.GetCandidateLanguageResponse = exports.CandidateForResumeDto = exports.SendCandidateByEmailRequest = exports.CandidateResumeOptions = exports.GetCandidateImageResponse = exports.UploadCandidateFilesToGdriveResponse = exports.GetCandidateApplicationsLength = exports.GetCandidateJobsRequest = exports.GetCandidateJobsConditionResponse = exports.GetCandidateEmailData = exports.GetUnseenMessagesCountResponse = exports.GetCandidatesForMessageResponse = exports.GetCandidatesRequest = exports.SaveCandidateRequest = exports.GetCandidateRequest = exports.GetCandidatesResponse = exports.GetCandidateResponse = exports.CandidateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const shared_constants_1 = require("../../../shared/shared-constants");
const candidate_job_status_type_1 = require("../../../shared/types/candidate-job-status.type");
const address_dto_1 = require("../../models/dto/address-dto");
const app_value_dto_1 = require("../../models/dto/app-value-dto");
const language_dto_1 = require("../../models/dto/language-dto");
const note_item_dto_1 = require("../../models/dto/note-item.dto");
const user_dto_1 = require("../../models/dto/user-dto");
const base_search_requests_1 = require("../../models/requests/base-search-requests");
const base_search_responses_1 = require("../../models/responses/base-search-responses");
const generic_response_1 = require("../../models/responses/generic-response");
const candidate_application_dto_1 = require("../candidates-application/candidate-application-dto");
const gcloud_storage_service_1 = require("../gdrive/gcloud-storage-service");
const interview_dto_1 = require("../interviews/interview-dto");
const job_offer_dto_1 = require("../job-offers/job-offer-dto");
const candidate_children_dto_1 = require("./candidate-children/candidate-children.dto");
const candidate_contract_dto_1 = require("./candidate-contract.dto");
const candidate_country_dto_1 = require("./candidate-country/candidate-country.dto");
const candidate_current_jobs_dto_1 = require("./candidate-current-jobs/candidate-current-jobs.dto");
const candidate_department_dto_1 = require("./candidate-department/candidate-department.dto");
const candidate_file_dto_1 = require("./candidate-file-dto");
const candidate_jobs_dto_1 = require("./candidate-jobs.dto");
const candidate_language_dto_1 = require("./candidate-language/candidate-language.dto");
const candidate_licences_dto_1 = require("./candidate-licences/candidate-licences-dto");
const candidate_pet_dto_1 = require("./candidate-pets/candidate-pet-dto");
const candidate_readonly_property_dto_1 = require("./candidate-readonly/candidate-readonly-property.dto");
class CandidateDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateDto.prototype, "nickName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateDto.prototype, "genderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => app_value_dto_1.AppValueDto }),
    __metadata("design:type", app_value_dto_1.AppValueDto)
], CandidateDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], CandidateDto.prototype, "birthDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateDto.prototype, "phoneSecondary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    __metadata("design:type", Array)
], CandidateDto.prototype, "additionalEmails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateDto.prototype, "nationality", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateDto.prototype, "relationshipStatusId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => app_value_dto_1.AppValueDto }),
    __metadata("design:type", app_value_dto_1.AppValueDto)
], CandidateDto.prototype, "relationshipStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateDto.prototype, "skills", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], CandidateDto.prototype, "inCouple", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    __metadata("design:type", String)
], CandidateDto.prototype, "isJobHoused", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], CandidateDto.prototype, "hasLicenceDriver", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateDto.prototype, "languageId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => language_dto_1.LanguageDto }),
    __metadata("design:type", language_dto_1.LanguageDto)
], CandidateDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CandidateDto.prototype, "dependentChildren", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], CandidateDto.prototype, "animal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], CandidateDto.prototype, "isAvailable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], CandidateDto.prototype, "creationDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], CandidateDto.prototype, "modifDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => address_dto_1.AddressDto, isArray: true }),
    __metadata("design:type", Array)
], CandidateDto.prototype, "addresses", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateDto.prototype, "candidateStatusId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => app_value_dto_1.AppValueDto }),
    __metadata("design:type", app_value_dto_1.AppValueDto)
], CandidateDto.prototype, "candidateStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateDto.prototype, "placedJobOfferId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => job_offer_dto_1.JobOfferDto }),
    __metadata("design:type", job_offer_dto_1.JobOfferDto)
], CandidateDto.prototype, "placedJobOffer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => candidate_application_dto_1.CandidateApplicationDto, isArray: true }),
    __metadata("design:type", Array)
], CandidateDto.prototype, "candidateApplications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateDto.prototype, "contractTypeAskedId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => app_value_dto_1.AppValueDto }),
    __metadata("design:type", app_value_dto_1.AppValueDto)
], CandidateDto.prototype, "contractTypeAsked", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateDto.prototype, "workingTimeTypeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => app_value_dto_1.AppValueDto }),
    __metadata("design:type", app_value_dto_1.AppValueDto)
], CandidateDto.prototype, "workingTimeType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => candidate_file_dto_1.CandidateFileDto, isArray: true }),
    __metadata("design:type", Array)
], CandidateDto.prototype, "files", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateDto.prototype, "mainPhotoBase64", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateDto.prototype, "mainPhotoBase64MimeType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], CandidateDto.prototype, "note", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => note_item_dto_1.NoteItemDto, isArray: true }),
    __metadata("design:type", Array)
], CandidateDto.prototype, "noteItems", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => candidate_jobs_dto_1.CandidateJobDto, isArray: true }),
    __metadata("design:type", Array)
], CandidateDto.prototype, "candidateJobs", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => candidate_licences_dto_1.CandidateLicenceDto, isArray: true }),
    __metadata("design:type", Array)
], CandidateDto.prototype, "candidateLicences", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => interview_dto_1.InterviewDto, isArray: true }),
    __metadata("design:type", Array)
], CandidateDto.prototype, "interviews", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => candidate_language_dto_1.CandidateLanguageDto, isArray: true }),
    __metadata("design:type", Array)
], CandidateDto.prototype, "candidateLanguages", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => candidate_children_dto_1.CandidateChildrenDto, isArray: true }),
    __metadata("design:type", Array)
], CandidateDto.prototype, "candidateChildrens", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateDto.prototype, "partnerFirstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateDto.prototype, "partnerLastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateDto.prototype, "partnerGenderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => app_value_dto_1.AppValueDto }),
    __metadata("design:type", app_value_dto_1.AppValueDto)
], CandidateDto.prototype, "partnerGender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], CandidateDto.prototype, "partnerBirthDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateDto.prototype, "partnerEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateDto.prototype, "partnerPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], CandidateDto.prototype, "userAlreadyExist", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, format: 'date-time' }),
    __metadata("design:type", Date)
], CandidateDto.prototype, "lastCandidateMessageSendedDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], CandidateDto.prototype, "candidateMessagesUnseen", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], CandidateDto.prototype, "candidateAdvancementPercent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], CandidateDto.prototype, "candidateApplicationsLength", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], CandidateDto.prototype, "hasNoChildren", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => candidate_readonly_property_dto_1.CandidateReadonlyPropertyDto,
        isArray: true,
    }),
    __metadata("design:type", Array)
], CandidateDto.prototype, "candidateReadonlyProperties", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], CandidateDto.prototype, "isOnPost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => user_dto_1.UserDto }),
    __metadata("design:type", user_dto_1.UserDto)
], CandidateDto.prototype, "consultant", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateDto.prototype, "consultantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], CandidateDto.prototype, "disabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], CandidateDto.prototype, "jobAdderContactId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], CandidateDto.prototype, "isVehicle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => candidate_pet_dto_1.CandidatePetDto, isArray: true }),
    __metadata("design:type", Array)
], CandidateDto.prototype, "candidatePets", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, isArray: true }),
    __metadata("design:type", Array)
], CandidateDto.prototype, "candidateFieldsMiss", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => candidate_contract_dto_1.CandidateContractDto, isArray: true }),
    __metadata("design:type", Array)
], CandidateDto.prototype, "candidateContracts", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => candidate_country_dto_1.CandidateCountryDto, isArray: true }),
    __metadata("design:type", Array)
], CandidateDto.prototype, "candidateCountries", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => candidate_department_dto_1.CandidateDepartmentDto, isArray: true }),
    __metadata("design:type", Array)
], CandidateDto.prototype, "candidateDepartments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], CandidateDto.prototype, "manuallyCompleted", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], CandidateDto.prototype, "mailSentAfterMigration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => user_dto_1.UserDto }),
    __metadata("design:type", user_dto_1.UserDto)
], CandidateDto.prototype, "associatedUser", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => candidate_current_jobs_dto_1.CandidateCurrentJobDto, isArray: true }),
    __metadata("design:type", Array)
], CandidateDto.prototype, "candidateCurrentJobs", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], CandidateDto.prototype, "globalMobility", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], CandidateDto.prototype, "hasManyTravel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], CandidateDto.prototype, "referencesValidated", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: shared_constants_1.CandidateAllergiesEnum,
        enumName: 'CandidateAllergiesEnum',
    }),
    __metadata("design:type", String)
], CandidateDto.prototype, "allergy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], CandidateDto.prototype, "newsletterUnsubscribed", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateDto.prototype, "newsletterUnsubscribedGuid", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], CandidateDto.prototype, "allowed_to_work_us", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], CandidateDto.prototype, "require_sponsorship_us", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateDto.prototype, "jobTitle", void 0);
exports.CandidateDto = CandidateDto;
class GetCandidateResponse extends generic_response_1.GenericResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => CandidateDto }),
    __metadata("design:type", CandidateDto)
], GetCandidateResponse.prototype, "candidate", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    __metadata("design:type", Boolean)
], GetCandidateResponse.prototype, "hasNewMainPhoto", void 0);
exports.GetCandidateResponse = GetCandidateResponse;
class GetCandidatesResponse extends base_search_responses_1.BaseSearchResponse {
    constructor() {
        super(...arguments);
        this.candidates = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => CandidateDto, isArray: true }),
    __metadata("design:type", Array)
], GetCandidatesResponse.prototype, "candidates", void 0);
exports.GetCandidatesResponse = GetCandidatesResponse;
class GetCandidateRequest {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], GetCandidateRequest.prototype, "specificRelations", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], GetCandidateRequest.prototype, "includeFiles", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], GetCandidateRequest.prototype, "includeLicences", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], GetCandidateRequest.prototype, "includeAddresses", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], GetCandidateRequest.prototype, "includeNoteItems", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], GetCandidateRequest.prototype, "includeCandidateJobs", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], GetCandidateRequest.prototype, "includeLanguages", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], GetCandidateRequest.prototype, "includeChildren", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], GetCandidateRequest.prototype, "includeResume", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], GetCandidateRequest.prototype, "includeConsultant", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], GetCandidateRequest.prototype, "includePets", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], GetCandidateRequest.prototype, "includeContracts", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], GetCandidateRequest.prototype, "includeCountries", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], GetCandidateRequest.prototype, "includeDepartments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], GetCandidateRequest.prototype, "includeCurrentJobs", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], GetCandidateRequest.prototype, "includeBasicInformations", void 0);
exports.GetCandidateRequest = GetCandidateRequest;
class SaveCandidateRequest extends GetCandidateRequest {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => CandidateDto }),
    __metadata("design:type", CandidateDto)
], SaveCandidateRequest.prototype, "candidate", void 0);
exports.SaveCandidateRequest = SaveCandidateRequest;
class LanguageRequest {
}
class GetCandidatesRequest extends base_search_requests_1.BaseSearchRequest {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'filter candidates with a specific status',
    }),
    __metadata("design:type", String)
], GetCandidatesRequest.prototype, "candidateStatut", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter candidates by jobs' }),
    __metadata("design:type", String)
], GetCandidatesRequest.prototype, "jobIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter candidates by gender' }),
    __metadata("design:type", String)
], GetCandidatesRequest.prototype, "candidateGender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter candidates by nationality' }),
    __metadata("design:type", String)
], GetCandidatesRequest.prototype, "candidateNationality", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'set filter candidates min age',
    }),
    __metadata("design:type", Date)
], GetCandidatesRequest.prototype, "candidateMinYear", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'set filter candidates max age',
    }),
    __metadata("design:type", Date)
], GetCandidatesRequest.prototype, "candidateMaxYear", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'filter candidates by job housed criteria',
    }),
    __metadata("design:type", String)
], GetCandidatesRequest.prototype, "jobHoused", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'filter candidates with driver licence',
    }),
    __metadata("design:type", String)
], GetCandidatesRequest.prototype, "driverLicence", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'filter candidates mobility countries',
    }),
    __metadata("design:type", String)
], GetCandidatesRequest.prototype, "mobilityCountries", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'filter candidates mobility departments',
    }),
    __metadata("design:type", String)
], GetCandidatesRequest.prototype, "mobilityDepartments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter candidates children min age' }),
    __metadata("design:type", String)
], GetCandidatesRequest.prototype, "childrenMinAge", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter candidates children max age' }),
    __metadata("design:type", String)
], GetCandidatesRequest.prototype, "childrenMaxAge", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter candidates by pets' }),
    __metadata("design:type", String)
], GetCandidatesRequest.prototype, "pets", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'filter candidates with contract type',
    }),
    __metadata("design:type", String)
], GetCandidatesRequest.prototype, "contractType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'filter candidates if available or not',
    }),
    __metadata("design:type", String)
], GetCandidatesRequest.prototype, "isAvailable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter candidates by location' }),
    __metadata("design:type", String)
], GetCandidatesRequest.prototype, "candidateLocation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter candidates by licences' }),
    __metadata("design:type", String)
], GetCandidatesRequest.prototype, "licencesIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter candidates by language' }),
    __metadata("design:type", String)
], GetCandidatesRequest.prototype, "languagesIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'include percentage advancement dossier ? true or false',
        type: String,
    }),
    __metadata("design:type", String)
], GetCandidatesRequest.prototype, "includePercentageAdvancement", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter by disabled', type: String }),
    __metadata("design:type", String)
], GetCandidatesRequest.prototype, "disabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'search candidate by cities',
        type: [String],
    }),
    __metadata("design:type", Array)
], GetCandidatesRequest.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'search candidate by department' }),
    __metadata("design:type", String)
], GetCandidatesRequest.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'filter candidates if vehicle or not' }),
    __metadata("design:type", String)
], GetCandidatesRequest.prototype, "isVehicle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'get candidate by consultants' }),
    __metadata("design:type", String)
], GetCandidatesRequest.prototype, "consultantIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'include candidates without assigned consultant when filtering by consultantIds',
        type: String,
    }),
    __metadata("design:type", String)
], GetCandidatesRequest.prototype, "includeUnassignedCandidates", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'filter candidates by ids from references',
    }),
    __metadata("design:type", String)
], GetCandidatesRequest.prototype, "candidateIdsFromReferences", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => LanguageRequest,
        description: 'languages',
        isArray: true,
    }),
    __metadata("design:type", Array)
], GetCandidatesRequest.prototype, "languages", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'filter candidates if have global mobility or not',
    }),
    __metadata("design:type", String)
], GetCandidatesRequest.prototype, "globalMobility", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'get candidate by note' }),
    __metadata("design:type", Number)
], GetCandidatesRequest.prototype, "note", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'get candidate by travel',
    }),
    __metadata("design:type", String)
], GetCandidatesRequest.prototype, "hasManyTravel", void 0);
exports.GetCandidatesRequest = GetCandidatesRequest;
class GetCandidatesForMessageResponse extends base_search_responses_1.BaseSearchResponse {
    constructor() {
        super(...arguments);
        this.candidates = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetCandidatesForMessageResponse.prototype, "unseenCandidateMessages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => CandidateDto, isArray: true }),
    __metadata("design:type", Array)
], GetCandidatesForMessageResponse.prototype, "candidates", void 0);
exports.GetCandidatesForMessageResponse = GetCandidatesForMessageResponse;
class GetUnseenMessagesCountResponse extends base_search_responses_1.BaseSearchResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetUnseenMessagesCountResponse.prototype, "unSeenMessagesCount", void 0);
exports.GetUnseenMessagesCountResponse = GetUnseenMessagesCountResponse;
class GetCandidateEmailData {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetCandidateEmailData.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetCandidateEmailData.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], GetCandidateEmailData.prototype, "recoverToken", void 0);
exports.GetCandidateEmailData = GetCandidateEmailData;
class GetCandidateJobsConditionResponse extends generic_response_1.GenericResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, isArray: true }),
    __metadata("design:type", Array)
], GetCandidateJobsConditionResponse.prototype, "candidateJobIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], GetCandidateJobsConditionResponse.prototype, "applyInCouple", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], GetCandidateJobsConditionResponse.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], GetCandidateJobsConditionResponse.prototype, "contractTypeId", void 0);
exports.GetCandidateJobsConditionResponse = GetCandidateJobsConditionResponse;
class GetCandidateJobsRequest extends base_search_requests_1.BaseSearchRequest {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'get only inActivity or not' }),
    __metadata("design:type", String)
], GetCandidateJobsRequest.prototype, "onlyInActivity", void 0);
exports.GetCandidateJobsRequest = GetCandidateJobsRequest;
class GetCandidateApplicationsLength extends generic_response_1.GenericResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetCandidateApplicationsLength.prototype, "applications", void 0);
exports.GetCandidateApplicationsLength = GetCandidateApplicationsLength;
class UploadCandidateFilesToGdriveResponse extends gcloud_storage_service_1.NxsAppGetFileResponse {
}
exports.UploadCandidateFilesToGdriveResponse = UploadCandidateFilesToGdriveResponse;
class GetCandidateImageResponse extends generic_response_1.GenericResponse {
}
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    __metadata("design:type", CandidateDto)
], GetCandidateImageResponse.prototype, "candidate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GetCandidateImageResponse.prototype, "candidateHasImage", void 0);
exports.GetCandidateImageResponse = GetCandidateImageResponse;
class CandidateResumeOptions {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateResumeOptions.prototype, "candidateId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateResumeOptions.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], CandidateResumeOptions.prototype, "showAge", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], CandidateResumeOptions.prototype, "showNationality", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateResumeOptions.prototype, "selectedJobId", void 0);
exports.CandidateResumeOptions = CandidateResumeOptions;
class SendCandidateByEmailRequest extends base_search_requests_1.BaseSearchRequest {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SendCandidateByEmailRequest.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SendCandidateByEmailRequest.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SendCandidateByEmailRequest.prototype, "body", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SendCandidateByEmailRequest.prototype, "customerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SendCandidateByEmailRequest.prototype, "mode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SendCandidateByEmailRequest.prototype, "candidatePublicLink", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SendCandidateByEmailRequest.prototype, "candidateId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => candidate_file_dto_1.CandidateFileDto, isArray: true }),
    __metadata("design:type", Array)
], SendCandidateByEmailRequest.prototype, "candidateFiles", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SendCandidateByEmailRequest.prototype, "candidatesIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => CandidateResumeOptions, isArray: true }),
    __metadata("design:type", Array)
], SendCandidateByEmailRequest.prototype, "candidateResumeOptions", void 0);
exports.SendCandidateByEmailRequest = SendCandidateByEmailRequest;
class CandidateForResumeDto extends CandidateDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateForResumeDto.prototype, "candidateChildStringValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateForResumeDto.prototype, "birthDateString", void 0);
exports.CandidateForResumeDto = CandidateForResumeDto;
class GetCandidateLanguageResponse extends generic_response_1.GenericResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", language_dto_1.LanguageDto)
], GetCandidateLanguageResponse.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], GetCandidateLanguageResponse.prototype, "isDefaultLanguage", void 0);
exports.GetCandidateLanguageResponse = GetCandidateLanguageResponse;
class UpdateCandidateJobStatusDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], UpdateCandidateJobStatusDto.prototype, "candidateJobId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: candidate_job_status_type_1.CandidateJobStatus }),
    __metadata("design:type", String)
], UpdateCandidateJobStatusDto.prototype, "status", void 0);
exports.UpdateCandidateJobStatusDto = UpdateCandidateJobStatusDto;
class UpdateCandidateJobsStatusRequest {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], UpdateCandidateJobsStatusRequest.prototype, "candidateId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => UpdateCandidateJobStatusDto,
        isArray: true,
    }),
    __metadata("design:type", Array)
], UpdateCandidateJobsStatusRequest.prototype, "candidateJobUpdates", void 0);
exports.UpdateCandidateJobsStatusRequest = UpdateCandidateJobsStatusRequest;
//# sourceMappingURL=candidate-dto.js.map