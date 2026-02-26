export declare enum RolesList {
    Admin = "admin",
    AdminTech = "admin_tech",
    Consultant = "consultant",
    Candidate = "candidate",
    Newsletter = "newsletter",
    RH = "RH"
}
export declare enum AppTypes {
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
    JobAdministratifHotellerieCategoryCode = "JobAdministratifHotellerieCategory"
}
export declare enum UserCivilityCode {
    Male = "UserCivility_Male",
    Female = "UserCivility_Female"
}
export declare enum LangageCodes {
    French = "fr",
    English = "en"
}
export declare enum AppDirectories {
    Uploads = "uploads",
    User = "user",
    Images = "images",
    Candidates = "candidates",
    CandidateApplications = "CandidateApplications",
    Temp = "temp"
}
export declare enum ActivityLogCode {
    Logout = "ActivityLog_Logout",
    Login = "ActivityLog_Login",
    RefreshToken = "ActivityLog_RefreshToken"
}
export declare enum CustomSocketEventType {
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
    RetrieveSocketConnectionsList = "RetrieveSocketConnectionsList"
}
export interface SocketEventPayload<T = any> {
    date?: Date;
    data: T;
}
export declare enum AppPage {
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
    MailsTests = "Test E-mails"
}
export declare const VapidPublicKey = "BMGz073AwQL15Lxg_QbEfx4zKfuiBfc7N47IgHfclnQEXF3eQ5Le0hLjZsLYkJwxXp9HCwf3FmPawa2L4kLQK7g";
export declare const AvailableLanguageCodes: string[];
export declare const defaultAppLanguage = "en";
export declare const refreshTokenLsKey = "morgan_and_mallet_refresh_token";
export declare enum AppResponseCode {
    ExpiredToken = 4031
}
export declare enum PersonGender {
    Female = "PersonGender_Female",
    Male = "PersonGender_Male"
}
export declare enum AppFileType {
    ProfilePicture = "ProfilePicture",
    Identity = "Identity"
}
export declare enum RelationshipStatus {
    Single = "RelationshipStatus_Single",
    InPairs = "RelationshipStatus_InPairs",
    InCohabiting = "RelationshipStatus_InCohabiting",
    Married = "RelationshipStatus_Married",
    Divorced = "RelationshipStatus_Divorced",
    Widowed = "RelationshipStatus_Widowed"
}
export declare enum ApplyStatus {
    Pending = "ApplyStatus_Pending",
    Validated = "ApplyStatus_Validated",
    Refused = "ApplyStatus_Refused",
    ToBeSorted = "ApplyStatus_ToBeSorted"
}
export declare enum ContractType {
    CDD_FullTime = "ContractType_CDD_FullTime",
    CDD_HalfTime = "ContractType_CDD_HalfTime",
    CDI_FullTime = "ContractType_CDI_FullTime",
    CDI_HalfTime = "ContractType_CDI_HalfTime",
    Freelance = "ContractType_Freelance"
}
export declare enum CandidateStatus {
    ToBeReferenced = "CandidateStatus_ToBeReferenced",
    BeingReferenced = "CandidateStatus_BeingReferenced",
    Referenced = "CandidateStatus_Referenced",
    NotSelected = "CandidateStatus_NotSelected",
    Placed = "CandidateStatus_Placed",
    InProcess = "CandidateStatus_InProcess"
}
export declare enum FileCandidateStatus {
    Complete = "FileCandidateStatus_Complete",
    NotComplete = "FileCandidateStatus_NotComplete"
}
export declare enum ContractTimeType {
    FullTime = "ContractTimeType_FullTime",
    HalfTime = "ContractTimeType_HalfTime",
    NoPreference = "ContractTimeType_NoPreference"
}
export declare enum CandidateFileType {
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
    ChildcareCertificate = "CandidateFileType_ChildcareCertificate",
    CareAssistantDiploma = "CandidateFileType_CareAssistantDiploma",
    FirstAidAndCPRCertificate = "CandidateFileType_FirstAidAndCPRCertification",
    SpecialNeedsOrPostPartumTraining = "CandidateFileType_SpecialNeedsOrPostPartumTraining",
    ButlerOrHouseholdManagementCertificate = "CandidateFileType_ButlerOrHouseholdManagementCertificate",
    BlankMoralityInvestigationReport = "CandidateFileType_BlankMoralityInvestigationReport",
    PlacementContract = "CandidateFileType_PlacementContract"
}
export declare const CandidateFileTypeMultipleWrapper: Record<CandidateFileType, boolean>;
export declare enum LicenceType {
    Car = "LicenceType_Car",
    Boat = "LicenceType_Boat",
    Motorbike = "LicenceType_Motorbike"
}
export declare enum LevelLanguage {
    Maternelle = "LevelLanguage_maternelle",
    Scolaire = "LevelLanguage_Scolaire",
    Courant = "LevelLanguage_Courant"
}
export declare enum LanguageCandidateCode {
    FR = "LanguageCandidateCode_FR",
    EN = "LanguageCandidateCode_EN",
    AL = "LanguageCandidateCode_AL",
    IT = "LanguageCandidateCode_IT",
    AR = "LanguageCandidateCode_AR"
}
export declare enum CandidateMessageSenderType {
    Candidate = "candidate",
    Consultant = "consultant"
}
export declare enum AnonymousMessageSenderType {
    Consultant = "consultant",
    Guest = "guest"
}
export declare enum JobHousedEnum {
    Yes = "Live in",
    No = "Live out",
    NoMatter = "Either"
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
export declare enum CandidateReadonlyField {
    skills = "section_skills",
    jobs = "section_jobs",
    language = "field_language"
}
export declare type CandidateApplicationFileType = "photoFile" | "mainResumeFile" | "partnerResumeFile";
export declare enum CandidateContactVisioType {
    Skype = "CandidateContactVisioType_Skype",
    Zoom = "CandidateContactVisioType_Zoom",
    WhatsApp = "CandidateContactVisioType_WhatsApp",
    Teams = "CandidateContactVisioType_Teams",
    GoogleMeet = "CandidateContactVisioType_GoogleMeet"
}
export declare enum JobOfferState {
    Activated = "JobOfferState_Activated",
    Suspended = "JobOfferState_Suspended",
    Closed = "JobOfferState_Closed"
}
export declare enum JobReferenceFunction {
    Particulier = "JobReferenceFunction_Individual_",
    Assistante = "JobReferenceFunction_Assistant",
    FamilyOffice = "JobReferenceFunction_FamilyOffice",
    HouseManager = "JobReferenceFunction_HouseManager",
    Capitaine = "JobReferenceFunction_Captain",
    Autre = "JobReferenceFunction_Other"
}
export declare enum EmployerProfil {
    Famille = "EmployerProfil_Famille",
    Particulier = "EmployerProfil_Particulier",
    OldPerson = "EmployerProfil_OldPerson",
    FamilyOffice = "EmployerProfil_FamilyOffice",
    Autre = "EmployerProfil_Other"
}
export declare enum NewsletterLanguage {
    FR = "fr",
    EN = "en"
}
export declare enum InterviewConfirmationStatus {
    ACCEPTED = "accepted",
    REFUSED = "refused"
}
export declare enum NewsletterState {
    Sent = "NewsletterState_Sent",
    Archived = "NewsletterState_Archived",
    Draft = "NewsletterState_Draft",
    Pending = "NewsletterState_Pending",
    Sent_SendInBlue = "NewsletterState_Sent_SendInBlue"
}
export declare enum CandidateResumeHiddenKeys {
    BirthDateKey = "BirthDate_CandidateResumeHiddenKeys",
    AddressesKey = "Addresses_CandidateResumeHiddenKeys",
    CandidateLicencesKey = "CandidateLicences_CandidateResumeHiddenKeys",
    RelationshipStatusKey = "RelationshipStatus_CandidateResumeHiddenKeys",
    CandidateChildrensKey = "CandidateChildrens_CandidateResumeHiddenKeys",
    CandidatePetsKey = "CandidatePets_CandidateResumeHiddenKeys",
    CandidateCountriesKey = "CandidateCountries_CandidateResumeHiddenKeys",
    JobKey = "Job_CandidateResumeHiddenKeys",
    IdentityKey = "Identity_CandidateResumeHiddenKeys"
}
export declare const FirebaseNotificationsEnabled = false;
export declare const AppLocalNotificationsEnabled = true;
export declare const FirebaseRealTimeDatabaseEnabled = false;
export declare const AppMainSender = "contact@morganmallet.agency";
export declare const SenderMailList: string[];
export declare enum RequestLocalStorageKeys {
    JobOffers = "JobOffersListFilters",
    Candidates = "CandidatesListFilters",
    Customers = "CustomersListFilters",
    Users = "UsersListFilters",
    References = "ReferencesListFilters",
    Newsletters = "NewslettersListFilters",
    CandidateApplication = "CandidateApplicationListFilters"
}
export declare enum CandidateAllergiesEnum {
    AnyAllergies = "AnyAllergies_CandidateAllergies",
    Dog = "Dog_CandidateAllergies",
    Cat = "Cat_CandidateAllergies",
    DogAndCat = "DogAndCat_CandidateAllergies"
}
export declare enum NewsletterType {
    Email = "Email",
    SMS = "SMS"
}
export declare const JobAppTypesListSorted: AppTypes[];
