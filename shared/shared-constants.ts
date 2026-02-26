export enum RolesList {
    Admin = "admin",
    AdminTech = "admin_tech",
    Consultant = "consultant",
    Candidate = "candidate",
    Newsletter = "newsletter",
    RH = "RH",
}

export enum AppTypes {
    UserCivilityCode = "UserCivility",
    ActivityLogCode = "ActivityLog",
    ApplyStatusCode = "ApplyStatus",
    RelationshipStatusCode = "RelationshipStatus",
    PersonGenderCode = "PersonGender",
    ContractTypeCode = "ContractType",
    JobCategoryCode = "JobCategory",
    JobYachtingCategoryCode = "JobYachtingCategory",
    JobNannyCategoryCode = "JobNannyCategory",
    CandidateStatusCode = "CandidateStatus",
    FileCandidateStatusCode = "FileCandidateStatus",
    ContractTimeType = "ContractTimeType",
    LicenceTypeCode = "LicenceType",
    CandidateFileType = "CandidateFileType",
    LevelLanguageCode = "LevelLanguage",
    CandidateContactVisioTypeCode = "CandidateContactVisioType",
    JobOfferStateCode = "JobOfferState",
    JobReferenceFunctionCode = "JobReferenceFunction",
    NewsletterStateCode = "NewsletterState",
    EmployerProfilCode = "EmployerProfil",
    JobHotellerieCategoryCode = "JobHotellerieCategory",
    JobRetailCategoryCode = "JobRetailCategory",
    JobRestaurationCategoryCode = "JobRestaurationCategory",
    JobCuisineCategoryCode = "JobCuisineCategory",
    JobSpaCategoryCode = "JobSpaCategory",
    JobAdministratifHotellerieCategoryCode = "JobAdministratifHotellerieCategory",
}

export enum UserCivilityCode {
    Male = "UserCivility_Male",
    Female = "UserCivility_Female",
}

export enum LangageCodes {
    French = "fr",
    English = "en",
}

export enum AppDirectories {
    Uploads = "uploads",
    User = "user",
    Images = "images",
    Candidates = "candidates",
    CandidateApplications = "CandidateApplications",
    Temp = "temp",
}

export enum ActivityLogCode {
    Logout = "ActivityLog_Logout",
    Login = "ActivityLog_Login",
    RefreshToken = "ActivityLog_RefreshToken",
}

export enum CustomSocketEventType {
    ClientSetUserId = "setUserId",
    NewMessage = "NewMessage",
    UserLogout = "UserLogout",
    RefreshUnseenCandidateApplications = "RefreshUnseenCandidateApplications",
    NewCandidateMessage = "NewCandidateMessage",
    AppNotification = "AppNotification",
    AnyUserSocketDisconnected = "AnyUserSocketDisconnected",
    AnyUserSocketConnected = "AnyUserSocketConnected",
    NewAnonymousMessage = "NewAnonymousMessage",
    AnyUserAnonymousExchangeSocketDisconnected = "AnyUserAnonymousExchangeSocketDisconnected",
    AnyUserAnonymousExchangeSocketConnected = "AnyUserAnonymousExchangeSocketConnected",

    RetrieveSocketConnectionsList = "RetrieveSocketConnectionsList",
}
export interface SocketEventPayload<T = any> {
    date?: Date;
    data: T;
}

export enum AppPage {
    Home = "Home",
    AdminUsersList = "Users list",
    AdminEditUser = "Edit user",
    AdminLogs = "Logs",
    AdminActivityLogs = "Activity logs",
    AdminJobs = "Jobs",
    AdminEditJob = "Edit Job",
    AdminEditRole = "Edit role",
    AdminAppTypes = "Types dynamiques",
    CandidateEdit = "Edit candidate",
    CustomerEdit = "Edit customer",
    JobOfferEdit = "Edit job offer",
    MyApplications = "My applications",
    MyDossier = "My dossier",
    MyMmiResume = "My MMI resume",
    MmiAndMe = "MMI and me",
    Messaging = "Messaging",
    MatchingCandidateJobOffer = "Matching candidate job offer",
    NewsLetter = "Edit Newsletter",
    MailsTests = "Test E-mails",
}
export const VapidPublicKey =
    "BMGz073AwQL15Lxg_QbEfx4zKfuiBfc7N47IgHfclnQEXF3eQ5Le0hLjZsLYkJwxXp9HCwf3FmPawa2L4kLQK7g";

export const AvailableLanguageCodes = ["fr", "en"];
export const defaultAppLanguage = "en";
export const refreshTokenLsKey = "morgan_and_mallet_refresh_token";

export enum AppResponseCode {
    ExpiredToken = 4031,
}
export enum PersonGender {
    Female = "PersonGender_Female",
    Male = "PersonGender_Male",
}

export enum AppFileType {
    ProfilePicture = "ProfilePicture",
    Identity = "Identity",
}

export enum RelationshipStatus {
    Single = "RelationshipStatus_Single",
    InPairs = "RelationshipStatus_InPairs",
    InCohabiting = "RelationshipStatus_InCohabiting",
    Married = "RelationshipStatus_Married",
    Divorced = "RelationshipStatus_Divorced",
    Widowed = "RelationshipStatus_Widowed",
}

export enum ApplyStatus {
    Pending = "ApplyStatus_Pending",
    Validated = "ApplyStatus_Validated",
    Refused = "ApplyStatus_Refused",
    ToBeSorted = "ApplyStatus_ToBeSorted",
}

export enum ContractType {
    CDD_FullTime = "ContractType_CDD_FullTime",
    CDD_HalfTime = "ContractType_CDD_HalfTime",
    CDI_FullTime = "ContractType_CDI_FullTime",
    CDI_HalfTime = "ContractType_CDI_HalfTime",
    Freelance = "ContractType_Freelance",
}

export enum CandidateStatus {
    ToBeReferenced = "CandidateStatus_ToBeReferenced",
    BeingReferenced = "CandidateStatus_BeingReferenced",
    Referenced = "CandidateStatus_Referenced",
    NotSelected = "CandidateStatus_NotSelected",
    Placed = "CandidateStatus_Placed",
    InProcess = "CandidateStatus_InProcess",
}

export enum FileCandidateStatus {
    Complete = "FileCandidateStatus_Complete",
    NotComplete = "FileCandidateStatus_NotComplete",
}

export enum ContractTimeType {
    FullTime = "ContractTimeType_FullTime",
    HalfTime = "ContractTimeType_HalfTime",
    NoPreference = "ContractTimeType_NoPreference",
}

export enum CandidateFileType {
    MainPhoto = "CandidateFileType_MainPhoto",
    MainResume = "CandidateFileType_MainResume",
    PartnerResume = "CandidateFileType_PartnerResume",
    IdentityCard = "CandidateFileType_IdentityCard",
    PhotoWithWorkClothes = "CandidateFileType_PhotoWithWorkClothes",
    ProofOfAddress = "CandidateFileType_ProofOfAddress",
    CriminalRecord = "CandidateFileType_CriminalRecord",
    FlightLicence = "CandidateFileType_FlightLicence",
    SeaDiploma = "CandidateFileType_SeaDiploma",
    VariousDiploma = "CandidateFileType_VariousDiploma",
    DrivingPointStatementFR = "CandidateFileType_DrivingPointStatementFR",
    StatementInsuranceInformationFR = "CandidateFileType_StatementInsuranceInformationFR",
    Passport = "CandidateFileType_Passport",
    NationalNumbers = "CandidateFileType_NationalNumbers",
    LastThreeWorkCertificates = "CandidateFileType_LastThreeWorkCertificates",
    LastThreeLettersOfReference = "CandidateFileType_LastThreeLettersOfReference",
    PhotoOfDishes = "CandidateFileType_PhotoOfDishes",
    ExtractFromKBis = "CandidateFileType_ExtractFromKBis",
    VariousRecruitmentTestOrSkills = "CandidateFileType_VariousRecruitmentTestOrSkills",
    CarLicence = "CandidateFileType_CarLicence",
    BoatLicence = "CandidateFileType_BoatLicence",
    MotorbikeLicence = "CandidateFileType_MotorbikeLicence",
    SalarySheets = "CandidateFileType_SalarySheets",
    Other = "CandidateFileType_Other",
    // New documents
    ChildcareCertificate = "CandidateFileType_ChildcareCertificate",
    CareAssistantDiploma = "CandidateFileType_CareAssistantDiploma",
    FirstAidAndCPRCertificate = "CandidateFileType_FirstAidAndCPRCertification",
    SpecialNeedsOrPostPartumTraining = "CandidateFileType_SpecialNeedsOrPostPartumTraining",
    ButlerOrHouseholdManagementCertificate = "CandidateFileType_ButlerOrHouseholdManagementCertificate",
    BlankMoralityInvestigationReport = "CandidateFileType_BlankMoralityInvestigationReport",
    PlacementContract = "CandidateFileType_PlacementContract",
}

export const CandidateFileTypeMultipleWrapper: Record<
    CandidateFileType,
    boolean
> = {
    // Old documents
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

    // New documents
    [CandidateFileType.ChildcareCertificate]: true,
    [CandidateFileType.CareAssistantDiploma]: true,
    [CandidateFileType.FirstAidAndCPRCertificate]: true,
    [CandidateFileType.SpecialNeedsOrPostPartumTraining]: true,
    [CandidateFileType.ButlerOrHouseholdManagementCertificate]: true,
    [CandidateFileType.BlankMoralityInvestigationReport]: true,
    [CandidateFileType.PlacementContract]: false,
};

export enum LicenceType {
    Car = "LicenceType_Car",
    Boat = "LicenceType_Boat",
    Motorbike = "LicenceType_Motorbike",
}

export enum LevelLanguage {
    Maternelle = "LevelLanguage_maternelle",
    Scolaire = "LevelLanguage_Scolaire",
    Courant = "LevelLanguage_Courant",
}

export enum LanguageCandidateCode {
    FR = "LanguageCandidateCode_FR",
    EN = "LanguageCandidateCode_EN",
    AL = "LanguageCandidateCode_AL",
    IT = "LanguageCandidateCode_IT",
    AR = "LanguageCandidateCode_AR",
}

export enum CandidateMessageSenderType {
    Candidate = "candidate",
    Consultant = "consultant",
}

export enum AnonymousMessageSenderType {
    Consultant = "consultant",
    Guest = "guest",
}

export enum JobHousedEnum {
    Yes = "Live in",
    No = "Live out",
    NoMatter = "Either",
}

export interface JobOfferSection {
    informations: boolean;
    descriptions: boolean;
    consultant: boolean;
    customer: boolean;
    linkedCandidate: boolean;
    candidateTimeline: boolean;
}

export interface CandidateSection {
    informations?: boolean;
    complement?: boolean;
    contact?: boolean;
    location?: boolean;
    conditions?: boolean;
    skills?: boolean;
    jobs?: boolean;
    notes?: boolean;
    conjoint?: boolean;
    documents?: boolean;
    language?: boolean;
    consultant?: boolean;
    currentJobs?: boolean;
}

export enum CandidateReadonlyField {
    skills = "section_skills",
    jobs = "section_jobs",
    language = "field_language",
}

export type CandidateApplicationFileType =
    | "photoFile"
    | "mainResumeFile"
    | "partnerResumeFile";

export enum CandidateContactVisioType {
    Skype = "CandidateContactVisioType_Skype",
    Zoom = "CandidateContactVisioType_Zoom",
    WhatsApp = "CandidateContactVisioType_WhatsApp",
    Teams = "CandidateContactVisioType_Teams",
    GoogleMeet = "CandidateContactVisioType_GoogleMeet",
}

export enum JobOfferState {
    Activated = "JobOfferState_Activated",
    Suspended = "JobOfferState_Suspended",
    Closed = "JobOfferState_Closed",
}

export enum JobReferenceFunction {
    Particulier = "JobReferenceFunction_Individual_",
    Assistante = "JobReferenceFunction_Assistant",
    FamilyOffice = "JobReferenceFunction_FamilyOffice",
    HouseManager = "JobReferenceFunction_HouseManager",
    Capitaine = "JobReferenceFunction_Captain",
    Autre = "JobReferenceFunction_Other",
}

export enum EmployerProfil {
    Famille = "EmployerProfil_Famille",
    Particulier = "EmployerProfil_Particulier",
    OldPerson = "EmployerProfil_OldPerson",
    FamilyOffice = "EmployerProfil_FamilyOffice",
    Autre = "EmployerProfil_Other",
}

export enum NewsletterLanguage {
    FR = "fr",
    EN = "en",
}

export enum InterviewConfirmationStatus {
    ACCEPTED = "accepted",
    REFUSED = "refused",
}

export enum NewsletterState {
    Sent = "NewsletterState_Sent",
    Archived = "NewsletterState_Archived",
    Draft = "NewsletterState_Draft",
    Pending = "NewsletterState_Pending",
    Sent_SendInBlue = "NewsletterState_Sent_SendInBlue",
}

export enum CandidateResumeHiddenKeys {
    BirthDateKey = "BirthDate_CandidateResumeHiddenKeys",
    AddressesKey = "Addresses_CandidateResumeHiddenKeys",
    CandidateLicencesKey = "CandidateLicences_CandidateResumeHiddenKeys",
    RelationshipStatusKey = "RelationshipStatus_CandidateResumeHiddenKeys",
    CandidateChildrensKey = "CandidateChildrens_CandidateResumeHiddenKeys",
    CandidatePetsKey = "CandidatePets_CandidateResumeHiddenKeys",
    CandidateCountriesKey = "CandidateCountries_CandidateResumeHiddenKeys",
    JobKey = "Job_CandidateResumeHiddenKeys",
    IdentityKey = "Identity_CandidateResumeHiddenKeys",
}

export const FirebaseNotificationsEnabled = false;
export const AppLocalNotificationsEnabled = true;
export const FirebaseRealTimeDatabaseEnabled = false;
export const AppMainSender = "contact@morganmallet.agency";

export const SenderMailList = [
    AppMainSender,
    "contact@personneldemaison.agency",
    "contact@householdstaff.agency",
    "contact@recrutementyacht.agency",
    "contact@yachtcrew.agency",
];

export enum RequestLocalStorageKeys {
    JobOffers = "JobOffersListFilters",
    Candidates = "CandidatesListFilters",
    Customers = "CustomersListFilters",
    Users = "UsersListFilters",
    References = "ReferencesListFilters",
    Newsletters = "NewslettersListFilters",
    CandidateApplication = "CandidateApplicationListFilters",
}

export enum CandidateAllergiesEnum {
    AnyAllergies = "AnyAllergies_CandidateAllergies",
    Dog = "Dog_CandidateAllergies",
    Cat = "Cat_CandidateAllergies",
    DogAndCat = "DogAndCat_CandidateAllergies",
}
export enum NewsletterType {
    Email = "Email",
    SMS = "SMS",
}

export const JobAppTypesListSorted: AppTypes[] = [
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
