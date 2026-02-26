"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobAppTypesListSorted = exports.NewsletterType = exports.CandidateAllergiesEnum = exports.RequestLocalStorageKeys = exports.SenderMailList = exports.AppMainSender = exports.FirebaseRealTimeDatabaseEnabled = exports.AppLocalNotificationsEnabled = exports.FirebaseNotificationsEnabled = exports.CandidateResumeHiddenKeys = exports.NewsletterState = exports.InterviewConfirmationStatus = exports.NewsletterLanguage = exports.EmployerProfil = exports.JobReferenceFunction = exports.JobOfferState = exports.CandidateContactVisioType = exports.CandidateReadonlyField = exports.JobHousedEnum = exports.AnonymousMessageSenderType = exports.CandidateMessageSenderType = exports.LanguageCandidateCode = exports.LevelLanguage = exports.LicenceType = exports.CandidateFileTypeMultipleWrapper = exports.CandidateFileType = exports.ContractTimeType = exports.FileCandidateStatus = exports.CandidateStatus = exports.ContractType = exports.ApplyStatus = exports.RelationshipStatus = exports.AppFileType = exports.PersonGender = exports.AppResponseCode = exports.refreshTokenLsKey = exports.defaultAppLanguage = exports.AvailableLanguageCodes = exports.VapidPublicKey = exports.AppPage = exports.CustomSocketEventType = exports.ActivityLogCode = exports.AppDirectories = exports.LangageCodes = exports.UserCivilityCode = exports.AppTypes = exports.RolesList = void 0;
var RolesList;
(function (RolesList) {
    RolesList["Admin"] = "admin";
    RolesList["AdminTech"] = "admin_tech";
    RolesList["Consultant"] = "consultant";
    RolesList["Candidate"] = "candidate";
    RolesList["Newsletter"] = "newsletter";
    RolesList["RH"] = "RH";
})(RolesList = exports.RolesList || (exports.RolesList = {}));
var AppTypes;
(function (AppTypes) {
    AppTypes["UserCivilityCode"] = "UserCivility";
    AppTypes["ActivityLogCode"] = "ActivityLog";
    AppTypes["ApplyStatusCode"] = "ApplyStatus";
    AppTypes["RelationshipStatusCode"] = "RelationshipStatus";
    AppTypes["PersonGenderCode"] = "PersonGender";
    AppTypes["ContractTypeCode"] = "ContractType";
    AppTypes["JobCategoryCode"] = "JobCategory";
    AppTypes["JobYachtingCategoryCode"] = "JobYachtingCategory";
    AppTypes["JobNannyCategoryCode"] = "JobNannyCategory";
    AppTypes["CandidateStatusCode"] = "CandidateStatus";
    AppTypes["FileCandidateStatusCode"] = "FileCandidateStatus";
    AppTypes["ContractTimeType"] = "ContractTimeType";
    AppTypes["LicenceTypeCode"] = "LicenceType";
    AppTypes["CandidateFileType"] = "CandidateFileType";
    AppTypes["LevelLanguageCode"] = "LevelLanguage";
    AppTypes["CandidateContactVisioTypeCode"] = "CandidateContactVisioType";
    AppTypes["JobOfferStateCode"] = "JobOfferState";
    AppTypes["JobReferenceFunctionCode"] = "JobReferenceFunction";
    AppTypes["NewsletterStateCode"] = "NewsletterState";
    AppTypes["EmployerProfilCode"] = "EmployerProfil";
    AppTypes["JobHotellerieCategoryCode"] = "JobHotellerieCategory";
    AppTypes["JobRetailCategoryCode"] = "JobRetailCategory";
    AppTypes["JobRestaurationCategoryCode"] = "JobRestaurationCategory";
    AppTypes["JobCuisineCategoryCode"] = "JobCuisineCategory";
    AppTypes["JobSpaCategoryCode"] = "JobSpaCategory";
    AppTypes["JobAdministratifHotellerieCategoryCode"] = "JobAdministratifHotellerieCategory";
})(AppTypes = exports.AppTypes || (exports.AppTypes = {}));
var UserCivilityCode;
(function (UserCivilityCode) {
    UserCivilityCode["Male"] = "UserCivility_Male";
    UserCivilityCode["Female"] = "UserCivility_Female";
})(UserCivilityCode = exports.UserCivilityCode || (exports.UserCivilityCode = {}));
var LangageCodes;
(function (LangageCodes) {
    LangageCodes["French"] = "fr";
    LangageCodes["English"] = "en";
})(LangageCodes = exports.LangageCodes || (exports.LangageCodes = {}));
var AppDirectories;
(function (AppDirectories) {
    AppDirectories["Uploads"] = "uploads";
    AppDirectories["User"] = "user";
    AppDirectories["Images"] = "images";
    AppDirectories["Candidates"] = "candidates";
    AppDirectories["CandidateApplications"] = "CandidateApplications";
    AppDirectories["Temp"] = "temp";
})(AppDirectories = exports.AppDirectories || (exports.AppDirectories = {}));
var ActivityLogCode;
(function (ActivityLogCode) {
    ActivityLogCode["Logout"] = "ActivityLog_Logout";
    ActivityLogCode["Login"] = "ActivityLog_Login";
    ActivityLogCode["RefreshToken"] = "ActivityLog_RefreshToken";
})(ActivityLogCode = exports.ActivityLogCode || (exports.ActivityLogCode = {}));
var CustomSocketEventType;
(function (CustomSocketEventType) {
    CustomSocketEventType["ClientSetUserId"] = "setUserId";
    CustomSocketEventType["NewMessage"] = "NewMessage";
    CustomSocketEventType["UserLogout"] = "UserLogout";
    CustomSocketEventType["RefreshUnseenCandidateApplications"] = "RefreshUnseenCandidateApplications";
    CustomSocketEventType["NewCandidateMessage"] = "NewCandidateMessage";
    CustomSocketEventType["AppNotification"] = "AppNotification";
    CustomSocketEventType["AnyUserSocketDisconnected"] = "AnyUserSocketDisconnected";
    CustomSocketEventType["AnyUserSocketConnected"] = "AnyUserSocketConnected";
    CustomSocketEventType["NewAnonymousMessage"] = "NewAnonymousMessage";
    CustomSocketEventType["AnyUserAnonymousExchangeSocketDisconnected"] = "AnyUserAnonymousExchangeSocketDisconnected";
    CustomSocketEventType["AnyUserAnonymousExchangeSocketConnected"] = "AnyUserAnonymousExchangeSocketConnected";
    CustomSocketEventType["RetrieveSocketConnectionsList"] = "RetrieveSocketConnectionsList";
})(CustomSocketEventType = exports.CustomSocketEventType || (exports.CustomSocketEventType = {}));
var AppPage;
(function (AppPage) {
    AppPage["Home"] = "Home";
    AppPage["AdminUsersList"] = "Users list";
    AppPage["AdminEditUser"] = "Edit user";
    AppPage["AdminLogs"] = "Logs";
    AppPage["AdminActivityLogs"] = "Activity logs";
    AppPage["AdminJobs"] = "Jobs";
    AppPage["AdminEditJob"] = "Edit Job";
    AppPage["AdminEditRole"] = "Edit role";
    AppPage["AdminAppTypes"] = "Types dynamiques";
    AppPage["CandidateEdit"] = "Edit candidate";
    AppPage["CustomerEdit"] = "Edit customer";
    AppPage["JobOfferEdit"] = "Edit job offer";
    AppPage["MyApplications"] = "My applications";
    AppPage["MyDossier"] = "My dossier";
    AppPage["MyMmiResume"] = "My MMI resume";
    AppPage["MmiAndMe"] = "MMI and me";
    AppPage["Messaging"] = "Messaging";
    AppPage["MatchingCandidateJobOffer"] = "Matching candidate job offer";
    AppPage["NewsLetter"] = "Edit Newsletter";
    AppPage["MailsTests"] = "Test E-mails";
})(AppPage = exports.AppPage || (exports.AppPage = {}));
exports.VapidPublicKey = "BMGz073AwQL15Lxg_QbEfx4zKfuiBfc7N47IgHfclnQEXF3eQ5Le0hLjZsLYkJwxXp9HCwf3FmPawa2L4kLQK7g";
exports.AvailableLanguageCodes = ["fr", "en"];
exports.defaultAppLanguage = "en";
exports.refreshTokenLsKey = "morgan_and_mallet_refresh_token";
var AppResponseCode;
(function (AppResponseCode) {
    AppResponseCode[AppResponseCode["ExpiredToken"] = 4031] = "ExpiredToken";
})(AppResponseCode = exports.AppResponseCode || (exports.AppResponseCode = {}));
var PersonGender;
(function (PersonGender) {
    PersonGender["Female"] = "PersonGender_Female";
    PersonGender["Male"] = "PersonGender_Male";
})(PersonGender = exports.PersonGender || (exports.PersonGender = {}));
var AppFileType;
(function (AppFileType) {
    AppFileType["ProfilePicture"] = "ProfilePicture";
    AppFileType["Identity"] = "Identity";
})(AppFileType = exports.AppFileType || (exports.AppFileType = {}));
var RelationshipStatus;
(function (RelationshipStatus) {
    RelationshipStatus["Single"] = "RelationshipStatus_Single";
    RelationshipStatus["InPairs"] = "RelationshipStatus_InPairs";
    RelationshipStatus["InCohabiting"] = "RelationshipStatus_InCohabiting";
    RelationshipStatus["Married"] = "RelationshipStatus_Married";
    RelationshipStatus["Divorced"] = "RelationshipStatus_Divorced";
    RelationshipStatus["Widowed"] = "RelationshipStatus_Widowed";
})(RelationshipStatus = exports.RelationshipStatus || (exports.RelationshipStatus = {}));
var ApplyStatus;
(function (ApplyStatus) {
    ApplyStatus["Pending"] = "ApplyStatus_Pending";
    ApplyStatus["Validated"] = "ApplyStatus_Validated";
    ApplyStatus["Refused"] = "ApplyStatus_Refused";
    ApplyStatus["ToBeSorted"] = "ApplyStatus_ToBeSorted";
})(ApplyStatus = exports.ApplyStatus || (exports.ApplyStatus = {}));
var ContractType;
(function (ContractType) {
    ContractType["CDD_FullTime"] = "ContractType_CDD_FullTime";
    ContractType["CDD_HalfTime"] = "ContractType_CDD_HalfTime";
    ContractType["CDI_FullTime"] = "ContractType_CDI_FullTime";
    ContractType["CDI_HalfTime"] = "ContractType_CDI_HalfTime";
    ContractType["Freelance"] = "ContractType_Freelance";
})(ContractType = exports.ContractType || (exports.ContractType = {}));
var CandidateStatus;
(function (CandidateStatus) {
    CandidateStatus["ToBeReferenced"] = "CandidateStatus_ToBeReferenced";
    CandidateStatus["BeingReferenced"] = "CandidateStatus_BeingReferenced";
    CandidateStatus["Referenced"] = "CandidateStatus_Referenced";
    CandidateStatus["NotSelected"] = "CandidateStatus_NotSelected";
    CandidateStatus["Placed"] = "CandidateStatus_Placed";
    CandidateStatus["InProcess"] = "CandidateStatus_InProcess";
})(CandidateStatus = exports.CandidateStatus || (exports.CandidateStatus = {}));
var FileCandidateStatus;
(function (FileCandidateStatus) {
    FileCandidateStatus["Complete"] = "FileCandidateStatus_Complete";
    FileCandidateStatus["NotComplete"] = "FileCandidateStatus_NotComplete";
})(FileCandidateStatus = exports.FileCandidateStatus || (exports.FileCandidateStatus = {}));
var ContractTimeType;
(function (ContractTimeType) {
    ContractTimeType["FullTime"] = "ContractTimeType_FullTime";
    ContractTimeType["HalfTime"] = "ContractTimeType_HalfTime";
    ContractTimeType["NoPreference"] = "ContractTimeType_NoPreference";
})(ContractTimeType = exports.ContractTimeType || (exports.ContractTimeType = {}));
var CandidateFileType;
(function (CandidateFileType) {
    CandidateFileType["MainPhoto"] = "CandidateFileType_MainPhoto";
    CandidateFileType["MainResume"] = "CandidateFileType_MainResume";
    CandidateFileType["PartnerResume"] = "CandidateFileType_PartnerResume";
    CandidateFileType["IdentityCard"] = "CandidateFileType_IdentityCard";
    CandidateFileType["PhotoWithWorkClothes"] = "CandidateFileType_PhotoWithWorkClothes";
    CandidateFileType["ProofOfAddress"] = "CandidateFileType_ProofOfAddress";
    CandidateFileType["CriminalRecord"] = "CandidateFileType_CriminalRecord";
    CandidateFileType["FlightLicence"] = "CandidateFileType_FlightLicence";
    CandidateFileType["SeaDiploma"] = "CandidateFileType_SeaDiploma";
    CandidateFileType["VariousDiploma"] = "CandidateFileType_VariousDiploma";
    CandidateFileType["DrivingPointStatementFR"] = "CandidateFileType_DrivingPointStatementFR";
    CandidateFileType["StatementInsuranceInformationFR"] = "CandidateFileType_StatementInsuranceInformationFR";
    CandidateFileType["Passport"] = "CandidateFileType_Passport";
    CandidateFileType["NationalNumbers"] = "CandidateFileType_NationalNumbers";
    CandidateFileType["LastThreeWorkCertificates"] = "CandidateFileType_LastThreeWorkCertificates";
    CandidateFileType["LastThreeLettersOfReference"] = "CandidateFileType_LastThreeLettersOfReference";
    CandidateFileType["PhotoOfDishes"] = "CandidateFileType_PhotoOfDishes";
    CandidateFileType["ExtractFromKBis"] = "CandidateFileType_ExtractFromKBis";
    CandidateFileType["VariousRecruitmentTestOrSkills"] = "CandidateFileType_VariousRecruitmentTestOrSkills";
    CandidateFileType["CarLicence"] = "CandidateFileType_CarLicence";
    CandidateFileType["BoatLicence"] = "CandidateFileType_BoatLicence";
    CandidateFileType["MotorbikeLicence"] = "CandidateFileType_MotorbikeLicence";
    CandidateFileType["SalarySheets"] = "CandidateFileType_SalarySheets";
    CandidateFileType["Other"] = "CandidateFileType_Other";
    CandidateFileType["ChildcareCertificate"] = "CandidateFileType_ChildcareCertificate";
    CandidateFileType["CareAssistantDiploma"] = "CandidateFileType_CareAssistantDiploma";
    CandidateFileType["FirstAidAndCPRCertificate"] = "CandidateFileType_FirstAidAndCPRCertification";
    CandidateFileType["SpecialNeedsOrPostPartumTraining"] = "CandidateFileType_SpecialNeedsOrPostPartumTraining";
    CandidateFileType["ButlerOrHouseholdManagementCertificate"] = "CandidateFileType_ButlerOrHouseholdManagementCertificate";
    CandidateFileType["BlankMoralityInvestigationReport"] = "CandidateFileType_BlankMoralityInvestigationReport";
    CandidateFileType["PlacementContract"] = "CandidateFileType_PlacementContract";
})(CandidateFileType = exports.CandidateFileType || (exports.CandidateFileType = {}));
exports.CandidateFileTypeMultipleWrapper = {
    [CandidateFileType.MainPhoto]: false,
    [CandidateFileType.MainResume]: true,
    [CandidateFileType.PartnerResume]: true,
    [CandidateFileType.IdentityCard]: true,
    [CandidateFileType.PhotoWithWorkClothes]: false,
    [CandidateFileType.ProofOfAddress]: true,
    [CandidateFileType.CriminalRecord]: true,
    [CandidateFileType.FlightLicence]: true,
    [CandidateFileType.SeaDiploma]: true,
    [CandidateFileType.VariousDiploma]: true,
    [CandidateFileType.DrivingPointStatementFR]: true,
    [CandidateFileType.StatementInsuranceInformationFR]: true,
    [CandidateFileType.Passport]: true,
    [CandidateFileType.NationalNumbers]: true,
    [CandidateFileType.LastThreeWorkCertificates]: true,
    [CandidateFileType.LastThreeLettersOfReference]: true,
    [CandidateFileType.PhotoOfDishes]: true,
    [CandidateFileType.ExtractFromKBis]: true,
    [CandidateFileType.VariousRecruitmentTestOrSkills]: true,
    [CandidateFileType.CarLicence]: true,
    [CandidateFileType.BoatLicence]: true,
    [CandidateFileType.MotorbikeLicence]: true,
    [CandidateFileType.SalarySheets]: true,
    [CandidateFileType.Other]: true,
    [CandidateFileType.ChildcareCertificate]: true,
    [CandidateFileType.CareAssistantDiploma]: true,
    [CandidateFileType.FirstAidAndCPRCertificate]: true,
    [CandidateFileType.SpecialNeedsOrPostPartumTraining]: true,
    [CandidateFileType.ButlerOrHouseholdManagementCertificate]: true,
    [CandidateFileType.BlankMoralityInvestigationReport]: true,
    [CandidateFileType.PlacementContract]: false,
};
var LicenceType;
(function (LicenceType) {
    LicenceType["Car"] = "LicenceType_Car";
    LicenceType["Boat"] = "LicenceType_Boat";
    LicenceType["Motorbike"] = "LicenceType_Motorbike";
})(LicenceType = exports.LicenceType || (exports.LicenceType = {}));
var LevelLanguage;
(function (LevelLanguage) {
    LevelLanguage["Maternelle"] = "LevelLanguage_maternelle";
    LevelLanguage["Scolaire"] = "LevelLanguage_Scolaire";
    LevelLanguage["Courant"] = "LevelLanguage_Courant";
})(LevelLanguage = exports.LevelLanguage || (exports.LevelLanguage = {}));
var LanguageCandidateCode;
(function (LanguageCandidateCode) {
    LanguageCandidateCode["FR"] = "LanguageCandidateCode_FR";
    LanguageCandidateCode["EN"] = "LanguageCandidateCode_EN";
    LanguageCandidateCode["AL"] = "LanguageCandidateCode_AL";
    LanguageCandidateCode["IT"] = "LanguageCandidateCode_IT";
    LanguageCandidateCode["AR"] = "LanguageCandidateCode_AR";
})(LanguageCandidateCode = exports.LanguageCandidateCode || (exports.LanguageCandidateCode = {}));
var CandidateMessageSenderType;
(function (CandidateMessageSenderType) {
    CandidateMessageSenderType["Candidate"] = "candidate";
    CandidateMessageSenderType["Consultant"] = "consultant";
})(CandidateMessageSenderType = exports.CandidateMessageSenderType || (exports.CandidateMessageSenderType = {}));
var AnonymousMessageSenderType;
(function (AnonymousMessageSenderType) {
    AnonymousMessageSenderType["Consultant"] = "consultant";
    AnonymousMessageSenderType["Guest"] = "guest";
})(AnonymousMessageSenderType = exports.AnonymousMessageSenderType || (exports.AnonymousMessageSenderType = {}));
var JobHousedEnum;
(function (JobHousedEnum) {
    JobHousedEnum["Yes"] = "Live in";
    JobHousedEnum["No"] = "Live out";
    JobHousedEnum["NoMatter"] = "Either";
})(JobHousedEnum = exports.JobHousedEnum || (exports.JobHousedEnum = {}));
var CandidateReadonlyField;
(function (CandidateReadonlyField) {
    CandidateReadonlyField["skills"] = "section_skills";
    CandidateReadonlyField["jobs"] = "section_jobs";
    CandidateReadonlyField["language"] = "field_language";
})(CandidateReadonlyField = exports.CandidateReadonlyField || (exports.CandidateReadonlyField = {}));
var CandidateContactVisioType;
(function (CandidateContactVisioType) {
    CandidateContactVisioType["Skype"] = "CandidateContactVisioType_Skype";
    CandidateContactVisioType["Zoom"] = "CandidateContactVisioType_Zoom";
    CandidateContactVisioType["WhatsApp"] = "CandidateContactVisioType_WhatsApp";
    CandidateContactVisioType["Teams"] = "CandidateContactVisioType_Teams";
    CandidateContactVisioType["GoogleMeet"] = "CandidateContactVisioType_GoogleMeet";
})(CandidateContactVisioType = exports.CandidateContactVisioType || (exports.CandidateContactVisioType = {}));
var JobOfferState;
(function (JobOfferState) {
    JobOfferState["Activated"] = "JobOfferState_Activated";
    JobOfferState["Suspended"] = "JobOfferState_Suspended";
    JobOfferState["Closed"] = "JobOfferState_Closed";
})(JobOfferState = exports.JobOfferState || (exports.JobOfferState = {}));
var JobReferenceFunction;
(function (JobReferenceFunction) {
    JobReferenceFunction["Particulier"] = "JobReferenceFunction_Individual_";
    JobReferenceFunction["Assistante"] = "JobReferenceFunction_Assistant";
    JobReferenceFunction["FamilyOffice"] = "JobReferenceFunction_FamilyOffice";
    JobReferenceFunction["HouseManager"] = "JobReferenceFunction_HouseManager";
    JobReferenceFunction["Capitaine"] = "JobReferenceFunction_Captain";
    JobReferenceFunction["Autre"] = "JobReferenceFunction_Other";
})(JobReferenceFunction = exports.JobReferenceFunction || (exports.JobReferenceFunction = {}));
var EmployerProfil;
(function (EmployerProfil) {
    EmployerProfil["Famille"] = "EmployerProfil_Famille";
    EmployerProfil["Particulier"] = "EmployerProfil_Particulier";
    EmployerProfil["OldPerson"] = "EmployerProfil_OldPerson";
    EmployerProfil["FamilyOffice"] = "EmployerProfil_FamilyOffice";
    EmployerProfil["Autre"] = "EmployerProfil_Other";
})(EmployerProfil = exports.EmployerProfil || (exports.EmployerProfil = {}));
var NewsletterLanguage;
(function (NewsletterLanguage) {
    NewsletterLanguage["FR"] = "fr";
    NewsletterLanguage["EN"] = "en";
})(NewsletterLanguage = exports.NewsletterLanguage || (exports.NewsletterLanguage = {}));
var InterviewConfirmationStatus;
(function (InterviewConfirmationStatus) {
    InterviewConfirmationStatus["ACCEPTED"] = "accepted";
    InterviewConfirmationStatus["REFUSED"] = "refused";
})(InterviewConfirmationStatus = exports.InterviewConfirmationStatus || (exports.InterviewConfirmationStatus = {}));
var NewsletterState;
(function (NewsletterState) {
    NewsletterState["Sent"] = "NewsletterState_Sent";
    NewsletterState["Archived"] = "NewsletterState_Archived";
    NewsletterState["Draft"] = "NewsletterState_Draft";
    NewsletterState["Pending"] = "NewsletterState_Pending";
    NewsletterState["Sent_SendInBlue"] = "NewsletterState_Sent_SendInBlue";
})(NewsletterState = exports.NewsletterState || (exports.NewsletterState = {}));
var CandidateResumeHiddenKeys;
(function (CandidateResumeHiddenKeys) {
    CandidateResumeHiddenKeys["BirthDateKey"] = "BirthDate_CandidateResumeHiddenKeys";
    CandidateResumeHiddenKeys["AddressesKey"] = "Addresses_CandidateResumeHiddenKeys";
    CandidateResumeHiddenKeys["CandidateLicencesKey"] = "CandidateLicences_CandidateResumeHiddenKeys";
    CandidateResumeHiddenKeys["RelationshipStatusKey"] = "RelationshipStatus_CandidateResumeHiddenKeys";
    CandidateResumeHiddenKeys["CandidateChildrensKey"] = "CandidateChildrens_CandidateResumeHiddenKeys";
    CandidateResumeHiddenKeys["CandidatePetsKey"] = "CandidatePets_CandidateResumeHiddenKeys";
    CandidateResumeHiddenKeys["CandidateCountriesKey"] = "CandidateCountries_CandidateResumeHiddenKeys";
    CandidateResumeHiddenKeys["JobKey"] = "Job_CandidateResumeHiddenKeys";
    CandidateResumeHiddenKeys["IdentityKey"] = "Identity_CandidateResumeHiddenKeys";
})(CandidateResumeHiddenKeys = exports.CandidateResumeHiddenKeys || (exports.CandidateResumeHiddenKeys = {}));
exports.FirebaseNotificationsEnabled = false;
exports.AppLocalNotificationsEnabled = true;
exports.FirebaseRealTimeDatabaseEnabled = false;
exports.AppMainSender = "contact@morganmallet.agency";
exports.SenderMailList = [
    exports.AppMainSender,
    "contact@personneldemaison.agency",
    "contact@householdstaff.agency",
    "contact@recrutementyacht.agency",
    "contact@yachtcrew.agency",
];
var RequestLocalStorageKeys;
(function (RequestLocalStorageKeys) {
    RequestLocalStorageKeys["JobOffers"] = "JobOffersListFilters";
    RequestLocalStorageKeys["Candidates"] = "CandidatesListFilters";
    RequestLocalStorageKeys["Customers"] = "CustomersListFilters";
    RequestLocalStorageKeys["Users"] = "UsersListFilters";
    RequestLocalStorageKeys["References"] = "ReferencesListFilters";
    RequestLocalStorageKeys["Newsletters"] = "NewslettersListFilters";
    RequestLocalStorageKeys["CandidateApplication"] = "CandidateApplicationListFilters";
})(RequestLocalStorageKeys = exports.RequestLocalStorageKeys || (exports.RequestLocalStorageKeys = {}));
var CandidateAllergiesEnum;
(function (CandidateAllergiesEnum) {
    CandidateAllergiesEnum["AnyAllergies"] = "AnyAllergies_CandidateAllergies";
    CandidateAllergiesEnum["Dog"] = "Dog_CandidateAllergies";
    CandidateAllergiesEnum["Cat"] = "Cat_CandidateAllergies";
    CandidateAllergiesEnum["DogAndCat"] = "DogAndCat_CandidateAllergies";
})(CandidateAllergiesEnum = exports.CandidateAllergiesEnum || (exports.CandidateAllergiesEnum = {}));
var NewsletterType;
(function (NewsletterType) {
    NewsletterType["Email"] = "Email";
    NewsletterType["SMS"] = "SMS";
})(NewsletterType = exports.NewsletterType || (exports.NewsletterType = {}));
exports.JobAppTypesListSorted = [
    AppTypes.JobCategoryCode,
    AppTypes.JobNannyCategoryCode,
    AppTypes.JobYachtingCategoryCode,
    AppTypes.JobHotellerieCategoryCode,
    AppTypes.JobRetailCategoryCode,
    AppTypes.JobRestaurationCategoryCode,
    AppTypes.JobCuisineCategoryCode,
    AppTypes.JobSpaCategoryCode,
    AppTypes.JobAdministratifHotellerieCategoryCode,
];
//# sourceMappingURL=shared-constants.js.map