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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataMigrationService = void 0;
const common_1 = require("@nestjs/common");
const linqts_1 = require("linqts");
const nextalys_js_helpers_1 = require("nextalys-js-helpers");
const csv_helpers_1 = require("nextalys-js-helpers/dist/csv-helpers/csv-helpers");
const nextalys_node_helpers_1 = require("nextalys-node-helpers");
const image_helpers_1 = require("nextalys-node-helpers/dist/image-helpers");
const path = require("path");
const typeorm_1 = require("typeorm");
const ref_data_1 = require("../../../shared/ref-data");
const shared_constants_1 = require("../../../shared/shared-constants");
const environment_1 = require("../../environment/environment");
const jobs_associations_crm_1 = require("../../environment/jobs-associations-crm");
const app_error_1 = require("../../models/app-error");
const app_file_dto_1 = require("../../models/dto/app-file-dto");
const note_item_dto_1 = require("../../models/dto/note-item.dto");
const generic_response_1 = require("../../models/responses/generic-response");
const base_service_1 = require("../../services/base-service");
const referential_service_1 = require("../../services/referential.service");
const file_service_1 = require("../../services/tools/file.service");
const logger_service_1 = require("../../services/tools/logger.service");
const mail_service_1 = require("../../services/tools/mail.service");
const candidate_applications_service_1 = require("../candidates-application/candidate-applications.service");
const candidate_current_jobs_dto_1 = require("../candidates/candidate-current-jobs/candidate-current-jobs.dto");
const candidate_dto_1 = require("../candidates/candidate-dto");
const candidates_service_1 = require("../candidates/candidates.service");
const job_offers_service_1 = require("../job-offers/job-offers.service");
const key_value_service_1 = require("../key-value-db/key-value.service");
const data_migration_types_1 = require("./data-migration-types");
let DataMigrationService = class DataMigrationService extends base_service_1.ApplicationBaseService {
    constructor(referentialService, candidateService, candidateApplicationService, jobOfferService, fileService, keyValueService, mailService) {
        super();
        this.referentialService = referentialService;
        this.candidateService = candidateService;
        this.candidateApplicationService = candidateApplicationService;
        this.jobOfferService = jobOfferService;
        this.fileService = fileService;
        this.keyValueService = keyValueService;
        this.mailService = mailService;
        this.jobsRegexList = [];
        this.maxLength = 0;
    }
    getConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, typeorm_1.createConnection)({
                name: 'jobAdderMsSql',
                type: 'mssql',
                host: environment_1.Environment.JobAdderBackupHost,
                port: 1433,
                database: 'jobadder',
                username: environment_1.Environment.JobAdderBackupUser,
                password: environment_1.Environment.JobAdderBackupPassword,
                synchronize: false,
                extra: { ssl: false, trustServerCertificate: true },
                logging: true,
            });
        });
    }
    initJobRegexList(jobsAppValues) {
        return __awaiter(this, void 0, void 0, function* () {
            const jobRegexListPrepare = [
                {
                    jobCode: 'jobcategory_garde-de-propriete',
                    regexList: [
                        new RegExp('.*gardien.*', 'gim'),
                    ],
                },
                {
                    jobCode: 'jobcategory_gouvernante',
                    regexList: [
                        new RegExp('.*gouvernant.*', 'gim'),
                        new RegExp('.*Hostess.*', 'gim'),
                        new RegExp('.*Host.*', 'gim'),
                        new RegExp('.*Host.*', 'gim'),
                    ],
                },
                {
                    jobCode: 'jobcategory_intendant-general-regisseur-house-manager',
                    regexList: [new RegExp('.*House Manager.*', 'gim')],
                },
                {
                    jobCode: 'jobcategory_assitante-maternelle-nourrice',
                    regexList: [new RegExp('.*assistante maternelle.*', 'gim')],
                },
                {
                    jobCode: 'jobcategory_majordome-maitre-d-hotel-huissier',
                    regexList: [
                        new RegExp(".*maitre d'hotel.*", 'gim'),
                        new RegExp(".*maître d'hotel.*", 'gim'),
                        new RegExp(".*maître d'hôtel.*", 'gim'),
                        new RegExp('.*majordome.*', 'gim'),
                        new RegExp('.*Butler.*', 'gim'),
                        new RegExp('.*Chalet.*', 'gim'),
                        new RegExp('.*manager in Aparthotel.*', 'gim'),
                    ],
                },
                {
                    jobCode: 'jobcategory_coach-sportif',
                    regexList: [
                        new RegExp('.*Personal Trainer.*', 'gim'),
                        new RegExp('.*coach sportif.*', 'gim'),
                    ],
                },
                {
                    jobCode: 'jobcategory_nannie-nounou',
                    regexList: [
                        new RegExp('.*Nannie.*', 'gim'),
                        new RegExp('.*Nanny.*', 'gim'),
                    ],
                },
                {
                    jobCode: 'jobcategory_garde-du-corps',
                    regexList: [
                        new RegExp('.*Private Security.', 'gim'),
                        new RegExp('.*Security Officer.', 'gim'),
                        new RegExp('.*Securi-guard.', 'gim'),
                        new RegExp('.*Caretaker and helper.', 'gim'),
                    ],
                },
                {
                    jobCode: 'jobcategory_chef-de-la-securite',
                    regexList: [new RegExp('.*Mobile Patrol.', 'gim')],
                },
                {
                    jobCode: 'jobcategory_auxiliaire-de-vie-dame-de-compagnie',
                    regexList: [new RegExp('.*Caregiver.', 'gim')],
                },
                {
                    jobCode: 'jobcategory_coiffeur-personnel',
                    regexList: [new RegExp('.*hairdresser.', 'gim')],
                },
                {
                    jobCode: 'jobyachtingcategory_manager-gestionnaire-de-yacht',
                    regexList: [
                        new RegExp('.*representative.', 'gim'),
                        new RegExp('.*4 cleanears', 'gim'),
                    ],
                },
                {
                    jobCode: 'jobcategory_tuteur-professeur-prive',
                    regexList: [
                        new RegExp('.*translator.', 'gim'),
                        new RegExp('.*Lecturer.', 'gim'),
                    ],
                },
                {
                    jobCode: 'jobcategory_skipper-equipage-de-yacht-voilier',
                    regexList: [new RegExp('.*skipper.', 'gim')],
                },
                {
                    jobCode: 'jobcategory_babysitter',
                    regexList: [
                        new RegExp('.*ASSISTANTE PARENTALE.', 'gim'),
                        new RegExp('.*NURSE DE NUIT.', 'gim'),
                        new RegExp('.*AU PAIR.', 'gim'),
                    ],
                },
                {
                    jobCode: 'jobcategory_femme-de-menage-de-chambre',
                    regexList: [
                        new RegExp('.*House keeper.*', 'gim'),
                        new RegExp('.*Housekeeping.*', 'gim'),
                        new RegExp('.*Housekeeper.*', 'gim'),
                        new RegExp('.*Housekeeper.*', 'gim'),
                    ],
                },
                {
                    jobCode: 'jobcategory_secretaire-particulier',
                    regexList: [
                        new RegExp('.*Personal Assistant.', 'gim'),
                        new RegExp('.*SECRETARY.', 'gim'),
                    ],
                },
            ];
            this.jobsRegexList = [];
            for (const jobRegexWrapper of jobRegexListPrepare) {
                const jobAppValue = jobsAppValues.find((x) => x.code === jobRegexWrapper.jobCode);
                if (!jobAppValue) {
                    yield logger_service_1.AppLogger.error('init job regex list error - job not found : ' +
                        jobRegexWrapper.jobCode);
                    continue;
                }
                this.jobsRegexList.push({
                    appValueId: jobAppValue === null || jobAppValue === void 0 ? void 0 : jobAppValue.id,
                    appValue: jobAppValue,
                    regexList: jobRegexWrapper.regexList,
                });
            }
        });
    }
    initAppTypesForMigration() {
        return __awaiter(this, void 0, void 0, function* () {
            const getAppTypesResponse = yield this.referentialService.getMultipleTypeValues({
                appTypesCodes: [
                    shared_constants_1.AppTypes.PersonGenderCode,
                    shared_constants_1.AppTypes.RelationshipStatusCode,
                    shared_constants_1.AppTypes.CandidateFileType,
                    shared_constants_1.AppTypes.CandidateStatusCode,
                    shared_constants_1.AppTypes.JobCategoryCode,
                    shared_constants_1.AppTypes.JobNannyCategoryCode,
                    shared_constants_1.AppTypes.JobYachtingCategoryCode,
                    shared_constants_1.AppTypes.EmployerProfilCode,
                ].join(','),
            });
            if (!getAppTypesResponse.success) {
                throw new app_error_1.AppErrorWithMessage('Error occured when loading appTypeResponse');
            }
            this.genderAppValues = getAppTypesResponse.appTypes.find((x) => x.code === shared_constants_1.AppTypes.PersonGenderCode).appValues;
            this.relationshipStatusAppValues = getAppTypesResponse.appTypes.find((x) => x.code === shared_constants_1.AppTypes.RelationshipStatusCode).appValues;
            this.candidateFileAppType = getAppTypesResponse.appTypes.find((x) => x.code === shared_constants_1.AppTypes.CandidateFileType);
            this.candidateStatusAppType = getAppTypesResponse.appTypes.find((x) => x.code === shared_constants_1.AppTypes.CandidateStatusCode);
            this.employerProfileAppType = getAppTypesResponse.appTypes.find((x) => x.code === shared_constants_1.AppTypes.EmployerProfilCode);
            if (!this.candidateFileAppType) {
                throw new app_error_1.AppErrorWithMessage('Error occured when loading appTypeResponse');
            }
            const jobsTypes = getAppTypesResponse.appTypes.filter((x) => x.code === shared_constants_1.AppTypes.JobCategoryCode ||
                x.code === shared_constants_1.AppTypes.JobNannyCategoryCode ||
                x.code === shared_constants_1.AppTypes.JobYachtingCategoryCode);
            this.jobsAppValuesFullList = new linqts_1.List(jobsTypes)
                .SelectMany((x) => new linqts_1.List(x.appValues))
                .ToArray();
            yield this.initJobRegexList(this.jobsAppValuesFullList);
        });
    }
    dataMigration() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new data_migration_types_1.DataMigrationResponse();
            let connection;
            yield logger_service_1.AppLogger.loggerInstance.log('Data Migration BEGIN');
            let currentContactId;
            try {
                if (!environment_1.Environment.JobAdderBackupHost ||
                    !environment_1.Environment.JobAdderBackupUser ||
                    !environment_1.Environment.JobAdderBackupPassword ||
                    !environment_1.Environment.JobAdderAttachmentsFolder) {
                    throw new app_error_1.AppErrorWithMessage('You must configure job adder backup sql access and attachment folder !');
                }
                return response;
                const lastContactSaved = yield this.keyValueService.getKeyValue('JobAdderLastContactSaved');
                const startingFromEnd = false;
                let firstCandidateContactID = 15745999 + 1;
                if (startingFromEnd) {
                    firstCandidateContactID = 30000000;
                }
                if (lastContactSaved) {
                    firstCandidateContactID = parseInt(lastContactSaved, 10) + 1;
                    yield this.keyValueService.saveKeyValue('JobAdderLastContactSavedPrevious', lastContactSaved);
                }
                const candidatesLength = 500;
                yield logger_service_1.AppLogger.loggerInstance.log('Data Migration : starting at ' +
                    firstCandidateContactID +
                    ' - taking ' +
                    candidatesLength +
                    ' candidates');
                yield this.initAppTypesForMigration();
                const contactsToImport = [15771734];
                const importOnlyContactIds = false;
                connection = yield this.getConnection();
                let candidateJobAdderQuery = 'SELECT TOP ' + candidatesLength + ' * FROM Candidate WHERE';
                if (importOnlyContactIds) {
                    candidateJobAdderQuery +=
                        ' ContactID IN (' + contactsToImport.join(',') + ')';
                }
                else {
                    if (startingFromEnd) {
                        candidateJobAdderQuery +=
                            ' ContactID <=' +
                                firstCandidateContactID +
                                ' ORDER BY ContactID DESC';
                    }
                    else {
                        candidateJobAdderQuery +=
                            ' ContactID >=' +
                                firstCandidateContactID +
                                ' ORDER BY ContactID ASC';
                    }
                }
                const ja_candidatesStatusList = (yield connection.query('SELECT * FROM CandidateStatus'));
                const candidates = (yield connection.query(candidateJobAdderQuery));
                if (candidates.length === 0) {
                    throw new app_error_1.AppError('NO candidates found !');
                }
                const contacts = (yield connection.query('SELECT * FROM Contact WHERE ContactID IN (' +
                    candidates.map((x) => x.ContactID).join(',') +
                    ')'));
                if (contacts.length === 0) {
                    throw new app_error_1.AppError('NO contacts found !');
                }
                yield logger_service_1.AppLogger.loggerInstance.log(candidates.length + ' candidates from JobAdder to save');
                yield logger_service_1.AppLogger.loggerInstance.log(contacts.length + ' contacts from JobAdder to save');
                const customFields = (yield connection.query('SELECT * FROM CustomField'));
                for (const candidate of candidates) {
                    if (!(candidate === null || candidate === void 0 ? void 0 : candidate.ContactID)) {
                        logger_service_1.AppLogger.loggerInstance.log('Ignoring candidate ' +
                            candidate.CandidateID +
                            ' - no contact ID');
                        continue;
                    }
                    let isNewCandidate = true;
                    let candidateDto = new candidate_dto_1.CandidateDto();
                    const findCandidateResponse = yield this.candidateService.findOne({
                        where: { jobAdderContactId: candidate.ContactID },
                    });
                    if (findCandidateResponse.candidate) {
                        isNewCandidate = false;
                        candidateDto = findCandidateResponse.candidate;
                        continue;
                    }
                    const contactFromJobAdder = contacts.find((x) => x.ContactID === candidate.ContactID);
                    if (!contactFromJobAdder) {
                        response.ignoredList.push(candidate.ContactID);
                        continue;
                    }
                    if (!contactFromJobAdder.FirstName &&
                        !contactFromJobAdder.LastName &&
                        !contactFromJobAdder.Email &&
                        !contactFromJobAdder.Phone) {
                        response.ignoredList.push(candidate.ContactID);
                        continue;
                    }
                    const candidateEducations = (yield connection.query('SELECT * FROM CandidateEducation WHERE ContactID = ' +
                        contactFromJobAdder.ContactID));
                    const migrateResponse = yield this.migrateCandidateJobs(connection, contactFromJobAdder.ContactID, candidateDto);
                    if ((_a = migrateResponse.ignoredJobs) === null || _a === void 0 ? void 0 : _a.length) {
                        yield logger_service_1.AppLogger.log('ignored jobs : ' +
                            migrateResponse.ignoredJobs.join(' / '));
                    }
                    const candidateNotes = (yield connection.query('SELECT NoteID FROM CandidateNote WHERE ContactID = ' +
                        contactFromJobAdder.ContactID));
                    candidateDto.noteItems = [];
                    if (candidateNotes === null || candidateNotes === void 0 ? void 0 : candidateNotes.length) {
                        const candidatesNotesIds = candidateNotes.map((x) => x.NoteID);
                        const notes = (yield connection.query("SELECT * FROM Note WHERE NoteID IN ('" +
                            candidatesNotesIds.join("','") +
                            "')"));
                        for (const note of notes) {
                            const noteItem = new note_item_dto_1.NoteItemDto();
                            noteItem.modifDate = note.DateCreated;
                            noteItem.content = nextalys_node_helpers_1.TextHelpers.htmlToText(note.Text);
                            noteItem.content = noteItem.content.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
                            candidateDto.noteItems.push(noteItem);
                        }
                    }
                    candidateDto.creationDate = contactFromJobAdder.DateCreated;
                    candidateDto.firstName = contactFromJobAdder.FirstName;
                    candidateDto.lastName = contactFromJobAdder.LastName;
                    let phone1 = contactFromJobAdder.MobileNormalized ||
                        contactFromJobAdder.PhoneNumeric;
                    let phone2 = contactFromJobAdder.Mobile ||
                        contactFromJobAdder.MobileNumeric;
                    if (phone1)
                        phone1 = phone1.substring(0, 29);
                    if (phone2)
                        phone2 = phone2.substring(0, 29);
                    candidateDto.phone = phone1;
                    candidateDto.phoneSecondary = phone2;
                    candidateDto.birthDate = candidate.DateOfBirth;
                    if (!candidateDto.phone && candidateDto.phoneSecondary) {
                        candidateDto.phone = candidateDto.phoneSecondary;
                        candidateDto.phoneSecondary = null;
                    }
                    candidateDto.email = contactFromJobAdder.Email;
                    candidateDto.isAvailable = !candidate.Deleted;
                    if (contactFromJobAdder.Salutation === 'Mr' ||
                        contactFromJobAdder.Salutation === 'Mr.' ||
                        !contactFromJobAdder.Salutation) {
                        candidateDto.genderId = this.genderAppValues.find((x) => x.code === shared_constants_1.PersonGender.Male).id;
                    }
                    else if (contactFromJobAdder.Salutation === 'Ms' ||
                        contactFromJobAdder.Salutation === 'Ms.') {
                        candidateDto.genderId = this.genderAppValues.find((x) => x.code === shared_constants_1.PersonGender.Female).id;
                        candidateDto.relationshipStatusId =
                            (_b = this.relationshipStatusAppValues.find((x) => x.code === shared_constants_1.RelationshipStatus.Married)) === null || _b === void 0 ? void 0 : _b.id;
                    }
                    else if (contactFromJobAdder.Salutation === 'Mrs' ||
                        contactFromJobAdder.Salutation === 'Mrs.' ||
                        contactFromJobAdder.Salutation === 'Miss') {
                        candidateDto.genderId = this.genderAppValues.find((x) => x.code === shared_constants_1.PersonGender.Female).id;
                    }
                    else if (contactFromJobAdder.Salutation === 'Dr' ||
                        contactFromJobAdder.Salutation === 'Dr.') {
                        const femalesFirstNames = [
                            'Gerlinde',
                            'Dr. & Mrs. Andrew',
                            'Gitta',
                            'Nicky',
                            'Tish',
                            'Vijay',
                            'Olga',
                            'Marie-Joséphine',
                        ];
                        if (femalesFirstNames.indexOf(contactFromJobAdder.FirstName) === -1)
                            candidateDto.genderId = this.genderAppValues.find((x) => x.code === shared_constants_1.PersonGender.Male).id;
                        else
                            candidateDto.genderId = this.genderAppValues.find((x) => x.code === shared_constants_1.PersonGender.Female).id;
                    }
                    if (!candidateDto.relationshipStatusId) {
                        candidateDto.relationshipStatusId =
                            (_c = this.relationshipStatusAppValues.find((x) => x.code === shared_constants_1.RelationshipStatus.Single)) === null || _c === void 0 ? void 0 : _c.id;
                    }
                    candidateDto.jobAdderContactId = candidate.ContactID;
                    if (candidate.AddressLine1 ||
                        candidate.AddressLine2 ||
                        candidate.AddressState ||
                        candidate.AddressSuburb ||
                        candidate.AddressPostcode ||
                        candidate.AddressCountry) {
                        candidateDto.addresses = [
                            {
                                lineOne: candidate.AddressLine1,
                                lineTwo: candidate.AddressLine2,
                                department: candidate.AddressState,
                                city: candidate.AddressSuburb,
                                postalCode: candidate.AddressPostcode
                                    ? candidate.AddressPostcode.substring(0, 9)
                                    : null,
                                country: ref_data_1.RefData.getCountryCode(candidate.AddressCountry, 'en'),
                            },
                        ];
                    }
                    candidateDto.candidateStatusId =
                        (_f = (_e = (_d = this.candidateStatusAppType) === null || _d === void 0 ? void 0 : _d.appValues) === null || _e === void 0 ? void 0 : _e.find((x) => x.code === shared_constants_1.CandidateStatus.ToBeReferenced)) === null || _f === void 0 ? void 0 : _f.id;
                    let mustCreateUser = false;
                    if (candidate.StatusID) {
                        const ja_candidatesStatus = ja_candidatesStatusList.find((x) => x.StatusID === candidate.StatusID);
                        if (ja_candidatesStatus === null || ja_candidatesStatus === void 0 ? void 0 : ja_candidatesStatus.Name) {
                            switch (ja_candidatesStatus.Name.toLowerCase()) {
                                case 'inactive':
                                    candidateDto.isAvailable = false;
                                    candidateDto.candidateStatusId =
                                        (_j = (_h = (_g = this.candidateStatusAppType) === null || _g === void 0 ? void 0 : _g.appValues) === null || _h === void 0 ? void 0 : _h.find((x) => x.code ===
                                            shared_constants_1.CandidateStatus.NotSelected)) === null || _j === void 0 ? void 0 : _j.id;
                                    break;
                                case 'placed (perm)':
                                    candidateDto.candidateStatusId =
                                        (_m = (_l = (_k = this.candidateStatusAppType) === null || _k === void 0 ? void 0 : _k.appValues) === null || _l === void 0 ? void 0 : _l.find((x) => x.code === shared_constants_1.CandidateStatus.Placed)) === null || _m === void 0 ? void 0 : _m.id;
                                    candidateDto.manuallyCompleted = true;
                                    candidateDto.isAvailable = false;
                                    mustCreateUser = true;
                                    break;
                                case 'placed (contract)':
                                    candidateDto.candidateStatusId =
                                        (_q = (_p = (_o = this.candidateStatusAppType) === null || _o === void 0 ? void 0 : _o.appValues) === null || _p === void 0 ? void 0 : _p.find((x) => x.code === shared_constants_1.CandidateStatus.Placed)) === null || _q === void 0 ? void 0 : _q.id;
                                    candidateDto.manuallyCompleted = true;
                                    candidateDto.isAvailable = false;
                                    mustCreateUser = true;
                                    break;
                                case 'registered':
                                    candidateDto.candidateStatusId =
                                        (_t = (_s = (_r = this.candidateStatusAppType) === null || _r === void 0 ? void 0 : _r.appValues) === null || _s === void 0 ? void 0 : _s.find((x) => x.code ===
                                            shared_constants_1.CandidateStatus.Referenced)) === null || _t === void 0 ? void 0 : _t.id;
                                    candidateDto.manuallyCompleted = true;
                                    candidateDto.isAvailable = true;
                                    mustCreateUser = true;
                                    break;
                                case 'available':
                                    candidateDto.isAvailable = true;
                                    candidateDto.candidateStatusId =
                                        (_w = (_v = (_u = this.candidateStatusAppType) === null || _u === void 0 ? void 0 : _u.appValues) === null || _v === void 0 ? void 0 : _v.find((x) => x.code ===
                                            shared_constants_1.CandidateStatus.ToBeReferenced)) === null || _w === void 0 ? void 0 : _w.id;
                                    break;
                                case 'pre-registered':
                                    candidateDto.isAvailable = true;
                                    candidateDto.candidateStatusId =
                                        (_z = (_y = (_x = this.candidateStatusAppType) === null || _x === void 0 ? void 0 : _x.appValues) === null || _y === void 0 ? void 0 : _y.find((x) => x.code ===
                                            shared_constants_1.CandidateStatus.BeingReferenced)) === null || _z === void 0 ? void 0 : _z.id;
                                    break;
                                case 'placed by us':
                                    candidateDto.candidateStatusId =
                                        (_2 = (_1 = (_0 = this.candidateStatusAppType) === null || _0 === void 0 ? void 0 : _0.appValues) === null || _1 === void 0 ? void 0 : _1.find((x) => x.code === shared_constants_1.CandidateStatus.Placed)) === null || _2 === void 0 ? void 0 : _2.id;
                                    candidateDto.manuallyCompleted = true;
                                    candidateDto.isAvailable = false;
                                    mustCreateUser = true;
                                    break;
                            }
                        }
                    }
                    const saveCandidateResponse = yield this.candidateService.createOrUpdate(candidateDto, false, null);
                    const candidateCreated = saveCandidateResponse.candidate;
                    if (saveCandidateResponse.success)
                        console.log('candidate created successfully');
                    let testMode = true;
                    const isProduction = environment_1.Environment.EnvName === 'production';
                    if (isProduction) {
                        testMode = false;
                    }
                    if (saveCandidateResponse.success && testMode) {
                        const missingList = yield this.testJobAdderFilesMissing(connection, candidate.ContactID);
                        if (missingList.length) {
                            for (const missing of missingList) {
                                yield logger_service_1.AppLogger.error('MISSING CANDIDATE FILE : ' +
                                    missing.attachment.AttachmentID +
                                    ' - ' +
                                    missing.localFilePath +
                                    ' - ' +
                                    missing.reason);
                            }
                        }
                    }
                    if (saveCandidateResponse.success &&
                        isProduction &&
                        environment_1.Environment.JobAdderMigrationFiles) {
                        console.log('load attachment');
                        const attachmentsResponse = yield this.loadAttachmentAndLinkToCandidate(connection, candidate.ContactID, candidateCreated, this.candidateFileAppType);
                        if ((_3 = attachmentsResponse.ignored) === null || _3 === void 0 ? void 0 : _3.length)
                            response.attachmentsIgnored.push(...attachmentsResponse.ignored);
                        if ((_4 = attachmentsResponse.errors) === null || _4 === void 0 ? void 0 : _4.length)
                            response.attachmentsErrors.push(...attachmentsResponse.errors);
                        const contactPhotos = (yield connection.query('SELECT * FROM ContactPhoto WHERE ContactID =' +
                            candidate.ContactID));
                        if (contactPhotos === null || contactPhotos === void 0 ? void 0 : contactPhotos.length) {
                            const candidateDirectory = environment_1.Environment.CandidatesPublicDirectory;
                            const targetFolder = this.fileService.joinPaths(candidateDirectory, candidateCreated.id);
                            if (!(yield nextalys_node_helpers_1.FileHelpers.fileExists(targetFolder)))
                                yield nextalys_node_helpers_1.FileHelpers.createDirectory(targetFolder);
                            for (const photo of contactPhotos) {
                                if (!photo || !photo.Data)
                                    continue;
                                let decodeResponse;
                                let extension;
                                let targetFileNameResized;
                                let targetFileResized;
                                let targetFileOriginal;
                                let targetFileNameOriginal;
                                let imageResized = false;
                                try {
                                    const base64 = Buffer.from(photo.Data, 'hex').toString('base64');
                                    extension = this.getFileExtensionType(photo.Type);
                                    const photoFileGuid = nextalys_js_helpers_1.MainHelpers.generateGuid();
                                    targetFileNameOriginal =
                                        photoFileGuid +
                                            '_original' +
                                            (extension ? '.' + extension : '');
                                    targetFileNameResized =
                                        photoFileGuid +
                                            (extension ? '.' + extension : '');
                                    targetFileOriginal = this.fileService.joinPaths(targetFolder, targetFileNameOriginal);
                                    targetFileResized = this.fileService.joinPaths(targetFolder, targetFileNameResized);
                                    decodeResponse = yield nextalys_node_helpers_1.FileHelpers.base64Decode(base64, targetFileOriginal);
                                    yield image_helpers_1.ImageHelpers.resizeImage(targetFileOriginal, { width: 1000 }, targetFileResized);
                                    yield nextalys_node_helpers_1.FileHelpers.removeFile(targetFileOriginal);
                                    imageResized = true;
                                }
                                catch (resizeImageErr) {
                                    yield logger_service_1.AppLogger.error('cannot resize image for contact : ' +
                                        candidate.ContactID);
                                }
                                try {
                                    if ((decodeResponse === null || decodeResponse === void 0 ? void 0 : decodeResponse.success) &&
                                        targetFileOriginal &&
                                        targetFileNameResized) {
                                        if (!imageResized) {
                                            if (yield nextalys_node_helpers_1.FileHelpers.fileExists(targetFileOriginal)) {
                                                targetFileResized =
                                                    targetFileOriginal;
                                                targetFileNameResized =
                                                    targetFileNameOriginal;
                                            }
                                            else {
                                                throw new Error('unable to upload file to gdrive for contact : ' +
                                                    candidate.ContactID);
                                            }
                                        }
                                        const newFile = new app_file_dto_1.AppFileDto();
                                        newFile.mimeType = 'text/plain';
                                        if (extension)
                                            newFile.mimeType =
                                                nextalys_node_helpers_1.FileHelpers.getMimeTypeFromExtension(extension);
                                        newFile.name =
                                            nextalys_js_helpers_1.MainHelpers.getFileWithoutExtension(targetFileNameResized);
                                        newFile.physicalName =
                                            targetFileNameResized;
                                        newFile.fileType =
                                            shared_constants_1.AppFileType.ProfilePicture;
                                        const fileTypeId = (_7 = (_6 = (_5 = this.candidateFileAppType) === null || _5 === void 0 ? void 0 : _5.appValues) === null || _6 === void 0 ? void 0 : _6.find((y) => y.code ===
                                            shared_constants_1.CandidateFileType.MainPhoto)) === null || _7 === void 0 ? void 0 : _7.id;
                                        console.log('uploading image photo to gdrive...');
                                        yield this.candidateService.uploadCandidateFilesToGdrive(candidateCreated, targetFileResized, newFile, fileTypeId, 'photoFile', 'candidates', true);
                                        yield this.candidateService.repository.save(candidateCreated);
                                        console.log('uploaded image photo successfull');
                                    }
                                }
                                catch (uploadImageErr) {
                                    yield logger_service_1.AppLogger.error('cannot upload image for contact : ' +
                                        candidate.ContactID);
                                }
                            }
                        }
                        yield this.candidateService.createMandatoryCandidateFilesForCandidate(candidateCreated);
                    }
                    if (saveCandidateResponse.success && mustCreateUser) {
                        yield this.candidateService.createUserFromCandidate(candidateCreated, { roles: [shared_constants_1.RolesList.Candidate] }, false, true);
                    }
                    if (saveCandidateResponse.success) {
                        response.successList.push(candidateDto.jobAdderContactId);
                        currentContactId = candidateDto.jobAdderContactId;
                    }
                    else {
                        response.errorsList.push(candidateDto.jobAdderContactId);
                    }
                }
                response.success = response.errorsList.length === 0;
                if (response.success && currentContactId && !importOnlyContactIds) {
                    yield this.keyValueService.saveKeyValue('JobAdderLastContactSaved', currentContactId);
                }
            }
            catch (err) {
                response.handleError(err);
            }
            if (connection) {
                yield connection.close();
            }
            yield logger_service_1.AppLogger.log('Data Migration END', response, 'COUNT SUCCESS : ' + response.successList.length, 'COUNT FAILED : ' + response.errorsList.length, 'COUNT IGNORED : ' + response.ignoredList.length, 'LAST CONTACT ID SAVED : ' + (currentContactId || 'NULL'));
            return response;
        });
    }
    createWrapper() {
        const wrapper = [
            {
                field: 'firstName',
                columns: [
                    {
                        columnNames: [
                            'Nom et Prénom.first',
                            'Prénom et Nom.first',
                            'Name.first',
                            'Name & Last Name.first',
                            'Prénom',
                        ],
                    },
                    {
                        columnNames: ['Nom et Prénom'],
                        splitCharacter: ' ',
                    },
                ],
            },
            {
                field: 'lastName',
                columns: [
                    {
                        columnNames: [
                            'Nom et Prénom.last',
                            'Prénom et Nom.last',
                            'Name.last',
                            'Name & Last Name.last',
                            'Nom',
                        ],
                    },
                    {
                        columnNames: ['Nom et Prénom'],
                        splitCharacter: ' ',
                    },
                ],
            },
            {
                field: 'creationDate',
                columns: [
                    {
                        columnNames: ['Date Submitted'],
                    },
                ],
            },
            {
                field: 'phone',
                columns: [
                    {
                        columnNames: ['Téléphone', 'Phone'],
                    },
                ],
            },
            {
                field: 'email',
                columns: [
                    {
                        columnNames: ['E-mail', 'Email'],
                    },
                ],
            },
            {
                field: 'birthDateFromCsv',
                columns: [
                    {
                        columnNames: [
                            'Veuillez indiquer votre date de naissance',
                            'Date de naissance',
                            'Date of Birth',
                        ],
                    },
                ],
            },
            {
                field: 'jobLabel',
                columns: [
                    {
                        columnNames: [
                            'Choisissez votre métier',
                            'Votre métier',
                            'Votre métier ',
                            'Poste recherché',
                            'Position you looking for?',
                            'Intitulé / Lieu du poste',
                            'Intitulé / Lieu du poste_1',
                            'Intitulé / Lieu du poste_2',
                        ],
                    },
                ],
            },
            {
                field: 'lineRefAnnonceStr',
                columns: [
                    {
                        columnNames: [
                            'Indiquez la référence de l\'annonce ou inscrivez le terme "candidature spontanée" ',
                            'Référence de l’annonce si nécessaire',
                            "Référence de l'annonce si applicable",
                            'Ad reference you are interested for if applicable',
                            'Référence du poste',
                        ],
                    },
                ],
            },
            {
                field: 'skills',
                columns: [
                    {
                        columnNames: [
                            'Décrivez vos compétences et votre valeur ajoutée',
                            'Décrivez votre profil',
                            'Description de votre profil',
                            'Describe yourself',
                        ],
                    },
                ],
            },
            {
                field: 'mainResumeLink',
                columns: [
                    {
                        columnNames: [
                            'Téléchargement de votre CV (merci de ne pas mettre de photo)',
                            'Téléchargez votre CV',
                            'Upload your Profile/Resume',
                            'Votre CV sans photo',
                            'Candidate Form',
                            'Votre CV',
                            'Your Profil/CV',
                            'Télécharger votre CV à jour',
                        ],
                    },
                ],
            },
            {
                field: 'photoLink',
                columns: [
                    {
                        columnNames: [
                            'Téléchargement de votre photo au format portrait (moins de trois mois)',
                            'Téléchargez votre photo',
                            'Your Picture',
                            'Votre photo',
                            'Upload you Picture',
                        ],
                    },
                ],
            },
            {
                field: 'partnerResumeLink',
                columns: [
                    {
                        columnNames: [
                            'Téléchargement du CV de votre conjoint pour les postes en couple uniquement',
                            'Upload the second Profile/Resume for Domestic Couple Only',
                        ],
                    },
                ],
            },
            {
                field: 'genderId',
                columns: [
                    {
                        columnNames: ['Vous êtes'],
                    },
                ],
            },
            {
                field: 'address',
                columns: [
                    {
                        columnNames: [
                            'Indiquez votre adresse',
                            'Votre adresse',
                            'Adresse postale',
                            'Address',
                        ],
                    },
                    {
                        columnNames: [
                            'Address.line1',
                            'Address.line2',
                            'Address.city',
                            'Address.state',
                            'Address.zip',
                            'Address.country',
                        ],
                        concat: true,
                    },
                ],
            },
            {
                field: 'partnerLastName',
                columns: [
                    {
                        columnNames: [
                            'Nom et prénom du conjoint (pour les postes en couple)',
                        ],
                    },
                ],
            },
            {
                field: 'partnerFirstName',
                columns: [
                    {
                        columnNames: [
                            'Nom et prénom du conjoint (pour les postes en couple)',
                        ],
                    },
                ],
            },
            {
                field: 'inCouple',
                columns: [
                    {
                        columnNames: [
                            'Nom et prénom du conjoint (pour les postes en couple)',
                        ],
                    },
                ],
            },
            {
                field: 'partnerGenderId',
                columns: [
                    {
                        columnNames: ['Vous êtes_1'],
                    },
                ],
            },
            {
                field: 'partnerBirthDateFromCsv',
                columns: [
                    {
                        columnNames: [
                            'Date de naissance du conjoint (pour les postes en couple)',
                        ],
                    },
                ],
            },
            {
                field: 'relationshipStatusId',
                columns: [
                    {
                        columnNames: ['Vous êtes'],
                    },
                ],
            },
        ];
        return wrapper;
    }
    getCsvValueFromWrapper(index, csvLines, csvHeaders, wrapper, field) {
        var _a;
        const wrapperItem = wrapper.find((x) => x.field === field);
        if (!wrapperItem) {
            return null;
        }
        for (const column of wrapperItem.columns) {
            if (column.splitCharacter) {
                if (field !== 'firstName' &&
                    field !== 'lastName' &&
                    field !== 'partnerFirstName' &&
                    field !== 'partnerLastName') {
                    return null;
                }
                for (const columnName of column.columnNames) {
                    const csvHeaderIndex = csvHeaders.findIndex((x) => x === columnName);
                    if (csvHeaderIndex !== -1 &&
                        csvHeaders[csvHeaderIndex] &&
                        csvLines[index][csvHeaderIndex]) {
                        const split = csvLines[index][csvHeaderIndex].split(column.splitCharacter);
                        if (!split) {
                            return null;
                        }
                        if (!split[split.length - 1]) {
                            split.splice(split.length - 1, 1);
                        }
                        if (field === 'firstName' ||
                            field === 'partnerFirstName') {
                            return split.pop();
                        }
                        else if (field === 'lastName' ||
                            field === 'partnerLastName') {
                            return (_a = split.slice(0, split.length - 1)) === null || _a === void 0 ? void 0 : _a.join(' ');
                        }
                    }
                }
            }
            else if (column.concat) {
                let rtn = '';
                for (const columnName of column.columnNames) {
                    const csvHeaderIndex = csvHeaders.findIndex((x) => x === columnName);
                    if (csvHeaderIndex !== -1 &&
                        csvHeaders[csvHeaderIndex] &&
                        csvLines[index][csvHeaderIndex]) {
                        rtn += csvLines[index][csvHeaderIndex] + ' ';
                    }
                }
                return rtn;
            }
            else {
                for (const columnName of column.columnNames) {
                    const csvHeaderIndex = csvHeaders.findIndex((x) => x === columnName);
                    if (csvHeaderIndex !== -1 &&
                        csvHeaders[csvHeaderIndex] &&
                        csvLines[index][csvHeaderIndex]) {
                        return csvLines[index][csvHeaderIndex];
                    }
                }
            }
        }
        return null;
    }
    parseDateFromCsv(dateFromCsv, forceUsFormat) {
        if (!dateFromCsv) {
            return null;
        }
        dateFromCsv = nextalys_js_helpers_1.MainHelpers.replaceAll(dateFromCsv.toString().trim(), ' ', '');
        if (!dateFromCsv) {
            return null;
        }
        const yearReg = '(\\d{4})';
        const monthReg = '(0[1-9]|1[0-2])';
        const dayReg = '(0[1-9]|1[0-9]|2[0-9]|3[0-1])';
        const regexArray = [];
        if (!forceUsFormat) {
            regexArray.push({
                regex: new RegExp('^' + dayReg + '/' + monthReg + '/' + yearReg + ''),
                dayIndex: 1,
                monthIndex: 2,
                yearIndex: 3,
            });
        }
        regexArray.push({
            regex: new RegExp('^' + monthReg + '/' + dayReg + '/' + yearReg + ''),
            dayIndex: 2,
            monthIndex: 1,
            yearIndex: 3,
        });
        regexArray.push({
            regex: new RegExp('^' + yearReg + '-' + monthReg + '-' + dayReg + ''),
            dayIndex: 3,
            monthIndex: 2,
            yearIndex: 1,
        });
        let parsedDate;
        for (const regexWrapper of regexArray) {
            const matches = dateFromCsv.match(regexWrapper.regex);
            if (matches && matches.length >= 4) {
                parsedDate = new Date(parseInt(matches[regexWrapper.yearIndex], 10), parseInt(matches[regexWrapper.monthIndex], 10) - 1, parseInt(matches[regexWrapper.dayIndex], 10));
                break;
            }
        }
        return parsedDate;
    }
    getAlreadyImportedCandidateApplications(candidateApplicationsAlreadyExistsList, candidateApplication, strictDateCompare) {
        if (!candidateApplication.creationDate || !candidateApplication.email) {
            return [];
        }
        if (candidateApplication.skills == null) {
            candidateApplication.skills = null;
        }
        if (candidateApplication.jobOfferLinkedRef == null) {
            candidateApplication.jobOfferLinkedRef = null;
        }
        if (strictDateCompare) {
            return candidateApplicationsAlreadyExistsList.filter((x) => x.creationDate &&
                x.creationDate.getTime() ===
                    candidateApplication.creationDate.getTime() &&
                x.firstName === candidateApplication.firstName &&
                x.lastName === candidateApplication.lastName &&
                x.jobOfferLinkedRef ==
                    candidateApplication.jobOfferLinkedRef &&
                x.email === candidateApplication.email &&
                x.skills == candidateApplication.skills);
        }
        else
            return candidateApplicationsAlreadyExistsList.filter((x) => x.creationDate &&
                (x.creationDate.getTime() ===
                    candidateApplication.creationDate.getTime() ||
                    (x.creationDate.getFullYear() ===
                        candidateApplication.creationDate.getFullYear() &&
                        x.creationDate.getDate() ===
                            candidateApplication.creationDate.getMonth() +
                                1 &&
                        x.creationDate.getMonth() + 1 ===
                            candidateApplication.creationDate.getDate())) &&
                x.firstName === candidateApplication.firstName &&
                x.lastName === candidateApplication.lastName &&
                x.jobOfferLinkedRef ==
                    candidateApplication.jobOfferLinkedRef &&
                x.email === candidateApplication.email &&
                x.skills == candidateApplication.skills);
    }
    candidateApplicationAlreadyExists(candidateApplicationsAlreadyExistsList, candidateApplication, strictDateCompare) {
        return (this.getAlreadyImportedCandidateApplications(candidateApplicationsAlreadyExistsList, candidateApplication, strictDateCompare).length > 0);
    }
    getGenderAppValueId(genderCsv, typeValues) {
        var _a, _b, _c, _d;
        let cGenderId = null;
        if (genderCsv) {
            const genderCsvArr = genderCsv.split(' ');
            if (genderCsvArr.length) {
                const lastGenderArr = genderCsvArr.pop();
                if (lastGenderArr) {
                    const lastGenderArrLower = lastGenderArr.toLowerCase();
                    cGenderId = (_d = (_c = (_b = (_a = typeValues.appTypes) === null || _a === void 0 ? void 0 : _a.find((y) => y.code === shared_constants_1.AppTypes.PersonGenderCode)) === null || _b === void 0 ? void 0 : _b.appValues) === null || _c === void 0 ? void 0 : _c.find((x) => x.label &&
                        x.label.toLowerCase() === lastGenderArrLower)) === null || _d === void 0 ? void 0 : _d.id;
                }
            }
        }
        return cGenderId;
    }
    testJobAdderFilesMissing(connection, contactID) {
        return __awaiter(this, void 0, void 0, function* () {
            const missing = [];
            const jobAdderAttachmentsResponse = yield this.getJobAdderAttachmentsForCandidate(connection, contactID);
            for (const attachment of jobAdderAttachmentsResponse.attachmentsList) {
                if (!attachment) {
                    continue;
                }
                const jobAdderPhysicalFileResponse = yield this.getJobAdderPhysicalFile(attachment);
                if (!jobAdderPhysicalFileResponse.success) {
                    missing.push({
                        attachment: attachment,
                        localFilePath: jobAdderPhysicalFileResponse.jobAdderFileLocation,
                        reason: jobAdderPhysicalFileResponse.error || '',
                    });
                }
            }
            return missing;
        });
    }
    getCandidateApplicationsJobsList(lineRefAnnonceStr, getJobOffersResponse) {
        var _a, _b;
        const jobOfferLinkedwrapperIds = [];
        let isCandidatureSpontannee = false;
        if (lineRefAnnonceStr) {
            const lineRefAnnonceStrTmp = nextalys_js_helpers_1.MainHelpers.replaceAccents(lineRefAnnonceStr.toLowerCase());
            isCandidatureSpontannee = lineRefAnnonceStrTmp.includes('candidature spontanee');
            if (!isCandidatureSpontannee) {
                const jobOfferLinkedId = ((_b = (_a = getJobOffersResponse.jobOffers) === null || _a === void 0 ? void 0 : _a.find((x) => x.ref &&
                    lineRefAnnonceStr
                        .trim()
                        .toLowerCase()
                        .includes(x.ref.trim().toLowerCase()))) === null || _b === void 0 ? void 0 : _b.id) || null;
                if (jobOfferLinkedId)
                    jobOfferLinkedwrapperIds.push({
                        jobOfferId: jobOfferLinkedId,
                    });
            }
        }
        return {
            jobOfferLinkedwrapperIds: jobOfferLinkedwrapperIds,
            isCandidatureSpontannee: isCandidatureSpontannee,
        };
    }
    getCandidateApplicationFromCsv(index, fileIndex, lines, csvHeaders, wrapper, regexHrefLink, getJobOffersResponse, typeValues, jobsAppValues, migrationResponse, fieldsTocheckMaxLen) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const mainResumeLinkValue = this.getCsvValueFromWrapper(index, lines, csvHeaders, wrapper, 'mainResumeLink');
        const mainResumeLink = (mainResumeLinkValue === null || mainResumeLinkValue === void 0 ? void 0 : mainResumeLinkValue.match(regexHrefLink))
            ? mainResumeLinkValue === null || mainResumeLinkValue === void 0 ? void 0 : mainResumeLinkValue.match(regexHrefLink)[2]
            : null;
        const photoLinkValue = this.getCsvValueFromWrapper(index, lines, csvHeaders, wrapper, 'photoLink');
        const photoLink = (photoLinkValue === null || photoLinkValue === void 0 ? void 0 : photoLinkValue.match(regexHrefLink))
            ? photoLinkValue === null || photoLinkValue === void 0 ? void 0 : photoLinkValue.match(regexHrefLink)[2]
            : null;
        const partnerResumeLinkValue = this.getCsvValueFromWrapper(index, lines, csvHeaders, wrapper, 'partnerResumeLink');
        const partnerResumeLink = (partnerResumeLinkValue === null || partnerResumeLinkValue === void 0 ? void 0 : partnerResumeLinkValue.match(regexHrefLink))
            ? partnerResumeLinkValue === null || partnerResumeLinkValue === void 0 ? void 0 : partnerResumeLinkValue.match(regexHrefLink)[2]
            : null;
        const creationDateFromCsv = this.parseDateFromCsv(this.getCsvValueFromWrapper(index, lines, csvHeaders, wrapper, 'creationDate'), true);
        const birthDateFromCsv = this.parseDateFromCsv(this.getCsvValueFromWrapper(index, lines, csvHeaders, wrapper, 'birthDateFromCsv'), false);
        const partnerBirthDateFromCsv = this.parseDateFromCsv(this.getCsvValueFromWrapper(index, lines, csvHeaders, wrapper, 'partnerBirthDateFromCsv'), false);
        const jobLabel = (_b = (_a = this.getCsvValueFromWrapper(index, lines, csvHeaders, wrapper, 'jobLabel')) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.trim();
        let isCandidatureSpontannee = false;
        const lineRefAnnonceStr = ((_c = this.getCsvValueFromWrapper(index, lines, csvHeaders, wrapper, 'lineRefAnnonceStr')) === null || _c === void 0 ? void 0 : _c.trim()) || '';
        const getJobOfferLinkedwrapperIds = this.getCandidateApplicationsJobsList(lineRefAnnonceStr, getJobOffersResponse);
        const jobOfferLinkedwrapperIds = getJobOfferLinkedwrapperIds.jobOfferLinkedwrapperIds;
        isCandidatureSpontannee =
            getJobOfferLinkedwrapperIds.isCandidatureSpontannee;
        const email = this.getCsvValueFromWrapper(index, lines, csvHeaders, wrapper, 'email');
        const genderCsv = this.getCsvValueFromWrapper(index, lines, csvHeaders, wrapper, 'genderId');
        const partnerGenderCsv = this.getCsvValueFromWrapper(index, lines, csvHeaders, wrapper, 'partnerGenderId');
        const relationshipStatusCsv = this.getCsvValueFromWrapper(index, lines, csvHeaders, wrapper, 'relationshipStatusId');
        const candidateApplication = {
            creationDate: creationDateFromCsv || null,
            phone: this.getCsvValueFromWrapper(index, lines, csvHeaders, wrapper, 'phone'),
            email: ((_d = email === null || email === void 0 ? void 0 : email.toLowerCase()) === null || _d === void 0 ? void 0 : _d.trim()) || null,
            birthDate: birthDateFromCsv || null,
            relationshipStatusId: (_g = (_f = (_e = typeValues.appTypes) === null || _e === void 0 ? void 0 : _e.find((y) => y.code === shared_constants_1.AppTypes.RelationshipStatusCode).appValues) === null || _f === void 0 ? void 0 : _f.find((x) => x.label === relationshipStatusCsv)) === null || _g === void 0 ? void 0 : _g.id,
            professionId: (_h = jobsAppValues === null || jobsAppValues === void 0 ? void 0 : jobsAppValues.find((x) => x.label &&
                jobLabel &&
                x.label.toLowerCase().trim() === jobLabel)) === null || _h === void 0 ? void 0 : _h.id,
            candidateApplicationJobs: jobOfferLinkedwrapperIds,
            skills: this.getCsvValueFromWrapper(index, lines, csvHeaders, wrapper, 'skills'),
            lastName: this.getCsvValueFromWrapper(index, lines, csvHeaders, wrapper, 'lastName'),
            firstName: this.getCsvValueFromWrapper(index, lines, csvHeaders, wrapper, 'firstName'),
            genderId: this.getGenderAppValueId(genderCsv, typeValues),
            address: {
                lineOne: this.getCsvValueFromWrapper(index, lines, csvHeaders, wrapper, 'address'),
            },
            partnerLastName: this.getCsvValueFromWrapper(index, lines, csvHeaders, wrapper, 'partnerLastName'),
            partnerFirstName: this.getCsvValueFromWrapper(index, lines, csvHeaders, wrapper, 'partnerFirstName'),
            partnerGenderId: this.getGenderAppValueId(partnerGenderCsv, typeValues),
            partnerBirthDate: partnerBirthDateFromCsv || null,
            inCouple: this.getCsvValueFromWrapper(index, lines, csvHeaders, wrapper, 'inCouple')
                ? true
                : false,
            phoneSecondary: null,
            spontaneousApplication: isCandidatureSpontannee,
            applyStatusId: (_m = (_l = (_k = (_j = typeValues.appTypes) === null || _j === void 0 ? void 0 : _j.find((y) => y.code === shared_constants_1.AppTypes.ApplyStatusCode)) === null || _k === void 0 ? void 0 : _k.appValues) === null || _l === void 0 ? void 0 : _l.find((x) => x.code === shared_constants_1.ApplyStatus.ToBeSorted)) === null || _m === void 0 ? void 0 : _m.id,
            seen: true,
            jobOfferLinkedRef: lineRefAnnonceStr,
            candidate: undefined,
        };
        if (!candidateApplication) {
            throw new Error('Ignore : when init candidate application');
        }
        if (!candidateApplication.creationDate) {
            console.log('ignoring candidate application : no creation date');
            migrationResponse.ignoredList.push('file index : ' +
                fileIndex +
                ' - line ' +
                index +
                ' : no creation date');
            index++;
            return { ignored: true };
        }
        for (const fieldName of fieldsTocheckMaxLen) {
            if (candidateApplication[fieldName] &&
                candidateApplication[fieldName].length > 30) {
                candidateApplication[fieldName] = candidateApplication[fieldName].substring(0, 29);
            }
        }
        return {
            candidateApplication: candidateApplication,
            ignored: false,
            mainResumeLink: mainResumeLink,
            partnerResumeLink: partnerResumeLink,
            photoLink: photoLink,
        };
    }
    dataMigrationCandidateApplications() {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            const migrationResponse = new data_migration_types_1.DataMigrationCandidateApplicationResponse();
            try {
                const typeValues = yield this.referentialService.getMultipleTypeValues({
                    appTypesCodes: [
                        shared_constants_1.AppTypes.RelationshipStatusCode,
                        shared_constants_1.AppTypes.JobCategoryCode,
                        shared_constants_1.AppTypes.JobNannyCategoryCode,
                        shared_constants_1.AppTypes.JobYachtingCategoryCode,
                        shared_constants_1.AppTypes.PersonGenderCode,
                        shared_constants_1.AppTypes.ApplyStatusCode,
                    ].join(','),
                });
                const candidateApplicationsAlreadyExistsListEntities = yield this.candidateApplicationService.getRepository().find({
                    select: [
                        'id',
                        'creationDate',
                        'firstName',
                        'lastName',
                        'jobOfferLinkedRef',
                        'email',
                        'skills',
                    ],
                });
                const candidateApplicationsAlreadyExistsList = candidateApplicationsAlreadyExistsListEntities.map((x) => x.toDto());
                yield logger_service_1.AppLogger.log('data migration candidate applications - already exist count :' +
                    candidateApplicationsAlreadyExistsList.length);
                const getJobOffersResponse = yield this.jobOfferService.findAll({
                    where: { disabled: false },
                });
                const jobsTypes = typeValues.appTypes.filter((x) => x.code === shared_constants_1.AppTypes.JobCategoryCode ||
                    x.code === shared_constants_1.AppTypes.JobNannyCategoryCode ||
                    x.code === shared_constants_1.AppTypes.JobYachtingCategoryCode);
                const jobsAppValues = new linqts_1.List(jobsTypes)
                    .SelectMany((x) => new linqts_1.List(x.appValues))
                    .ToArray();
                const regexHrefLink = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/;
                const wrapper = this.createWrapper();
                const importDataFolderPath = path.join(environment_1.Environment.ApiBasePath, 'import-data');
                const filesInFolder = yield nextalys_node_helpers_1.FileHelpers.getFilesInFolder(importDataFolderPath, { returnFullPath: true });
                let linesToImportTotal = 0;
                let fileIndex = 0;
                for (const filePath of filesInFolder) {
                    if (!filePath.endsWith('.csv')) {
                        continue;
                    }
                    let index = 1;
                    const csvFileContent = (yield nextalys_node_helpers_1.FileHelpers.readFile(filePath, true));
                    const lines = csv_helpers_1.CSVHelpers.parseCSV(csvFileContent);
                    const csvHeaders = lines[0];
                    lines[0] = null;
                    const linesToImportForFile = lines.length - 1;
                    migrationResponse.linesPerFile.push({
                        fileName: filePath,
                        lines: linesToImportForFile,
                    });
                    console.log('Importation fichier ' + filePath + ' - lignes : ', linesToImportForFile);
                    linesToImportTotal += linesToImportForFile;
                    const fieldsTocheckMaxLen = [
                        'firstName',
                        'lastName',
                        'partnerFirstName',
                        'partnerLastName',
                        'phone',
                        'phoneSecondary',
                    ];
                    if (fileIndex >= 1) {
                    }
                    for (const line of lines) {
                        if (line == null) {
                            continue;
                        }
                        if (index >= 2) {
                        }
                        console.log('reprise candidatures - import index ' +
                            index +
                            ' of file ' +
                            fileIndex +
                            ' - path : ' +
                            filePath);
                        try {
                            const candidateApplicationFromCsv = this.getCandidateApplicationFromCsv(index, fileIndex, lines, csvHeaders, wrapper, regexHrefLink, getJobOffersResponse, typeValues, jobsAppValues, migrationResponse, fieldsTocheckMaxLen);
                            if (candidateApplicationFromCsv.ignored ||
                                !candidateApplicationFromCsv.candidateApplication) {
                                index++;
                                continue;
                            }
                            let candidateApplication = candidateApplicationFromCsv.candidateApplication;
                            if (this.candidateApplicationAlreadyExists(candidateApplicationsAlreadyExistsList, candidateApplication, true)) {
                                console.log('ignore candidate application already exists : ' +
                                    candidateApplication.jobOfferLinkedRef);
                                index++;
                                continue;
                            }
                            if (candidateApplication.email) {
                                console.log('try to find candidate with email : ' +
                                    candidateApplication.email);
                                const candidateResponse = yield this.candidateService.findOne({
                                    where: {
                                        email: candidateApplication.email,
                                    },
                                });
                                console.log('candidate with email : ' +
                                    (((_a = candidateResponse.candidate) === null || _a === void 0 ? void 0 : _a.id) ||
                                        '[not found]'));
                                if (candidateResponse.success &&
                                    ((_b = candidateResponse.candidate) === null || _b === void 0 ? void 0 : _b.id)) {
                                    candidateApplication.candidateId =
                                        candidateResponse.candidate.id;
                                }
                            }
                            console.log('try to save candidate application...');
                            const candidateApplicationResponse = yield this.candidateApplicationService.createOrUpdate(candidateApplication);
                            console.log('save candidate application OK');
                            if (!candidateApplicationResponse.success) {
                                throw new Error('Error : when create candidate application');
                            }
                            candidateApplication =
                                candidateApplicationResponse.candidateApplication;
                            const links = [];
                            if (environment_1.Environment.CandidateApplicationsMigrationCsvFiles) {
                                console.log('start uploading files...');
                                if (candidateApplicationFromCsv.mainResumeLink) {
                                    links.push({
                                        link: candidateApplicationFromCsv.mainResumeLink,
                                        fileType: 'mainResumeFile',
                                    });
                                }
                                if (candidateApplicationFromCsv.photoLink) {
                                    links.push({
                                        link: candidateApplicationFromCsv.photoLink,
                                        fileType: 'photoFile',
                                    });
                                }
                                if (candidateApplicationFromCsv.partnerResumeLink) {
                                    links.push({
                                        link: candidateApplicationFromCsv.partnerResumeLink,
                                        fileType: 'partnerResumeFile',
                                    });
                                }
                                for (const linkWrapper of links) {
                                    console.log('will handle ' +
                                        linkWrapper.fileType +
                                        ' file ' +
                                        linkWrapper.link);
                                    const candidateApplicationFolder = linkWrapper.fileType === 'photoFile'
                                        ? environment_1.Environment.CandidateApplicationsPublicDirectory
                                        : environment_1.Environment.CandidateApplicationsDirectory;
                                    const targetFolder = this.fileService.joinPaths(candidateApplicationFolder, candidateApplication.id);
                                    if (!(yield nextalys_node_helpers_1.FileHelpers.fileExists(targetFolder))) {
                                        yield nextalys_node_helpers_1.FileHelpers.createDirectory(targetFolder);
                                    }
                                    const extension = nextalys_js_helpers_1.MainHelpers.getFileExtensionFromPath(linkWrapper.link);
                                    const fileNameFromUrl = nextalys_js_helpers_1.MainHelpers.getFileNameFromPath(linkWrapper.link);
                                    const fileGuid = nextalys_js_helpers_1.MainHelpers.generateGuid();
                                    const targetFileNameResized = fileGuid +
                                        (extension ? '.' + extension : '');
                                    const targetFileNameOriginal = fileGuid +
                                        '_original' +
                                        (extension ? '.' + extension : '');
                                    const targetFileResized = this.fileService.joinPaths(targetFolder, targetFileNameResized);
                                    const targetFileOriginal = this.fileService.joinPaths(targetFolder, targetFileNameOriginal);
                                    console.log('before download file', targetFileNameResized, extension);
                                    const httpClient = new nextalys_node_helpers_1.NextalysNodeHttpClient();
                                    const downloadResponse = yield httpClient.downloadFile(linkWrapper.link, targetFileOriginal, false, 20000);
                                    if (downloadResponse.success) {
                                        console.log('file downloaded');
                                        let fileMimeType = 'text/plain';
                                        if (extension) {
                                            fileMimeType =
                                                nextalys_node_helpers_1.FileHelpers.getMimeTypeFromExtension(extension);
                                        }
                                        console.log('file mime 1 :' + fileMimeType);
                                        if (fileMimeType &&
                                            fileMimeType.includes('image')) {
                                            let imageResized = false;
                                            try {
                                                yield image_helpers_1.ImageHelpers.resizeImage(targetFileOriginal, { width: 900 }, targetFileResized);
                                                yield nextalys_node_helpers_1.FileHelpers.removeFile(targetFileOriginal);
                                                imageResized = true;
                                            }
                                            catch (imgResizeErr) { }
                                            if (!imageResized) {
                                                yield nextalys_node_helpers_1.FileHelpers.renameFile(targetFileOriginal, targetFileResized);
                                            }
                                        }
                                        else {
                                            yield nextalys_node_helpers_1.FileHelpers.renameFile(targetFileOriginal, targetFileResized);
                                        }
                                        if (!fileMimeType) {
                                            fileMimeType = 'text/plain';
                                        }
                                        console.log('file mime  2 :' + fileMimeType);
                                        const newFile = new app_file_dto_1.AppFileDto();
                                        if (fileMimeType) {
                                            newFile.mimeType = fileMimeType;
                                        }
                                        newFile.name = fileNameFromUrl;
                                        const fileInfo = yield nextalys_node_helpers_1.FileHelpers.getFileInfo(targetFileResized);
                                        newFile.size = fileInfo.data.size;
                                        newFile.physicalName =
                                            targetFileNameResized;
                                        const uploadResponse = yield this.candidateService.uploadCandidateFilesToGdrive(candidateApplication, targetFileResized, newFile, null, linkWrapper.fileType, 'candidate-applications', true);
                                        if (uploadResponse.success) {
                                            if (!uploadResponse.file) {
                                                throw new Error('warning : file upload to Gdrive failed for candidate application: ' +
                                                    candidateApplication.lastName);
                                            }
                                            console.log('upload to gcloud SUCCESS');
                                            if (candidateApplication.creationDate &&
                                                candidateApplication.creationDate.getFullYear() <=
                                                    2020) {
                                                console.log('removing old file : ' +
                                                    targetFileResized +
                                                    ' - ' +
                                                    newFile.id);
                                                yield nextalys_node_helpers_1.FileHelpers.removeFile(targetFileResized);
                                                console.log('file removed with success');
                                                newFile.physicalName = null;
                                                migrationResponse.bytesIgnored +=
                                                    newFile.size;
                                            }
                                            else {
                                                migrationResponse.bytesAdded +=
                                                    newFile.size;
                                            }
                                        }
                                        else {
                                            console.log('file NOT UPLOADED');
                                            throw new Error('warning : upload gcloud error : ' +
                                                (((_c = uploadResponse.error) === null || _c === void 0 ? void 0 : _c.toString()) ||
                                                    ''));
                                        }
                                    }
                                    else {
                                        console.log('file NOT downloaded');
                                        throw new Error('warning : file download failed for candidate application: ' +
                                            candidateApplication.lastName);
                                    }
                                }
                                console.log('end uploading files');
                            }
                            if (links.length) {
                                console.log('try to save after upload files...');
                                const saveCandidateApplicationResponse = yield this.candidateApplicationService.createOrUpdate(candidateApplication);
                                console.log('save after upload files : ' +
                                    saveCandidateApplicationResponse.success);
                            }
                            migrationResponse.successList.push(candidateApplication.id);
                        }
                        catch (lineErr) {
                            console.log('not treated : ' + lineErr);
                            if (lineErr.message.indexOf('Ignore :') !== -1) {
                                console.warn('warning : ' + lineErr);
                                migrationResponse.ignoredList.push('file index : ' +
                                    fileIndex +
                                    ' - line ' +
                                    index +
                                    ' : ' +
                                    lineErr.message);
                            }
                            else {
                                console.error('error : ' + lineErr);
                                migrationResponse.errorsList.push('file index : ' +
                                    fileIndex +
                                    ' - line ' +
                                    index +
                                    ' : ' +
                                    lineErr.message);
                            }
                        }
                        index++;
                    }
                    fileIndex++;
                }
                const responseMessage = 'DATA Migration canidate applications finished ! Total lignes : ' +
                    linesToImportTotal +
                    ' - success : ' +
                    migrationResponse.successList.length +
                    ' - ignored : ' +
                    migrationResponse.ignoredList.length +
                    ' - errors : ' +
                    migrationResponse.errorsList.length;
                migrationResponse.message = responseMessage;
                migrationResponse.totalLinesRead = linesToImportTotal;
                console.log(responseMessage);
                migrationResponse.successListCount =
                    migrationResponse.successList.length;
                migrationResponse.successList = [];
                migrationResponse.success = true;
                response.success = true;
                yield nextalys_node_helpers_1.FileHelpers.writeFile(nextalys_node_helpers_1.FileHelpers.joinPaths(environment_1.Environment.PublicFolder, 'migration-response_' + new Date().toISOString() + '.json'), JSON.stringify(migrationResponse));
            }
            catch (err) {
                console.error(err);
                response.handleError(err);
            }
            return response;
        });
    }
    getJobAdderPhysicalFile(attachment) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = { success: false };
            let fileName = nextalys_js_helpers_1.MainHelpers.getFileNameFromPath(attachment.StorageName);
            const jobAdderFolder = this.fileService.joinPaths(environment_1.Environment.JobAdderAttachmentsFolder, this.getFolderNameAttachment(attachment.StorageName));
            let extension = nextalys_js_helpers_1.MainHelpers.getFileExtension(fileName);
            let jobAdderFileLocation = this.fileService.joinPaths(jobAdderFolder, fileName);
            let fileInfo = yield nextalys_node_helpers_1.FileHelpers.getFileInfo(jobAdderFileLocation);
            if (!fileInfo.success) {
                if (extension) {
                    if (extension === 'original') {
                        switch (attachment.FileType) {
                            case 'application/pdf':
                                extension = 'pdf';
                                break;
                            case 'image/jpeg':
                                extension = 'jpg';
                                break;
                            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                                extension = 'docx';
                                break;
                            case 'application/msword':
                                extension = 'doc';
                                break;
                        }
                        fileName = fileName + '.' + extension;
                    }
                    else {
                        extension = extension.toUpperCase();
                        fileName =
                            nextalys_js_helpers_1.MainHelpers.getFileWithoutExtension(fileName) +
                                '.' +
                                extension;
                    }
                    jobAdderFileLocation = this.fileService.joinPaths(jobAdderFolder, fileName);
                    fileInfo = yield nextalys_node_helpers_1.FileHelpers.getFileInfo(jobAdderFileLocation);
                }
                if (!fileInfo.success) {
                    response.error =
                        'The file cannot be found : ' + jobAdderFileLocation;
                    return response;
                }
            }
            response.fileInfo = fileInfo;
            response.jobAdderFileLocation = jobAdderFileLocation;
            response.fileName = fileName;
            response.extension = extension;
            response.success = true;
            return response;
        });
    }
    getAppFileFromJobAdderAttachment(attachment) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const response = {
                success: false,
                file: null,
                jobAdderFileLocation: null,
                error: null,
            };
            const jobAdderPhysicalFileResponse = yield this.getJobAdderPhysicalFile(attachment);
            if (!jobAdderPhysicalFileResponse.success) {
                return jobAdderPhysicalFileResponse;
            }
            response.jobAdderFileLocation =
                jobAdderPhysicalFileResponse.jobAdderFileLocation;
            let extension = jobAdderPhysicalFileResponse.extension;
            if (!extension) {
                extension = 'txt';
            }
            const targetFileName = nextalys_js_helpers_1.MainHelpers.generateGuid() + '.' + extension;
            const newFile = new app_file_dto_1.AppFileDto();
            newFile.mimeType = 'text/plain';
            let attachmentFileName = attachment.FileName;
            newFile.mimeType = nextalys_node_helpers_1.FileHelpers.getMimeTypeFromExtension(extension);
            if (!newFile.mimeType) {
                newFile.mimeType = attachment.FileType;
            }
            if (!newFile.mimeType) {
                newFile.mimeType = 'text/plain';
            }
            if (newFile.mimeType) {
                attachmentFileName = attachmentFileName.substring(0, attachmentFileName.lastIndexOf(extension) - 1);
            }
            newFile.name = attachmentFileName;
            newFile.physicalName = jobAdderPhysicalFileResponse.fileName;
            newFile.size = (_b = (_a = jobAdderPhysicalFileResponse.fileInfo) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.size;
            newFile.physicalName = targetFileName;
            response.file = newFile;
            response.success = true;
            return response;
        });
    }
    getJobAdderAttachmentsForCandidate(connection, contactID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!contactID || !connection) {
                return;
            }
            const attachmentsResponse = {
                ignored: [],
                success: [],
            };
            const candidateAttachments = yield connection.query(`SELECT * FROM  CandidateAttachment WHERE ContactID=${contactID}`);
            const contactAttachments = yield connection.query(`SELECT * FROM  ContactAttachment WHERE ContactID=${contactID}`);
            const allContactAttachments = [
                ...candidateAttachments,
                ...contactAttachments,
            ];
            const allContactAttachmentsIds = new linqts_1.List(allContactAttachments.map((x) => x.AttachmentID))
                .Distinct()
                .ToArray();
            const candidateAttachmentsIds = new linqts_1.List(candidateAttachments.map((x) => x.AttachmentID))
                .Distinct()
                .ToArray();
            const contactAttachmentsIds = new linqts_1.List(contactAttachments.map((x) => x.AttachmentID))
                .Distinct()
                .ToArray();
            const attachmentsList = [];
            if (contactAttachmentsIds.length) {
                const contactAttachmentsList = yield connection.query(`SELECT * FROM Attachment WHERE AttachmentID IN (${contactAttachmentsIds.join(',')});`);
                attachmentsList.push(...contactAttachmentsList);
            }
            if (candidateAttachmentsIds.length) {
                const candidateAttachmentsList = yield connection.query(`SELECT * FROM Attachment WHERE CandidateAttachmentID IN (${candidateAttachmentsIds.join(',')});`);
                attachmentsList.push(...candidateAttachmentsList);
            }
            return {
                attachmentsList: attachmentsList,
                candidateAttachments: candidateAttachments,
            };
        });
    }
    loadAttachmentAndLinkToCandidate(connection, contactID, candidate, candidateFileType) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        return __awaiter(this, void 0, void 0, function* () {
            if (!contactID || !connection) {
                return;
            }
            const attachmentsResponse = { ignored: [], ignoredReasons: [], success: [], errors: [] };
            const jobAdderAttachmentsResponse = yield this.getJobAdderAttachmentsForCandidate(connection, contactID);
            let resumeHasBeenImported = false;
            for (const attachment of jobAdderAttachmentsResponse.attachmentsList) {
                if (!attachment) {
                    continue;
                }
                const candidateAttachment = jobAdderAttachmentsResponse.candidateAttachments.find((x) => x.AttachmentID === attachment.CandidateAttachmentID);
                const getFileResponse = yield this.getAppFileFromJobAdderAttachment(attachment);
                if (!getFileResponse.success) {
                    console.error('getAppFileFromJobAdderAttachment error', getFileResponse.error);
                    attachmentsResponse.ignored.push(attachment.AttachmentID);
                    attachmentsResponse.ignoredReasons.push(getFileResponse.error);
                    continue;
                }
                const mainResumeFileTypeId = (_b = (_a = candidateFileType.appValues) === null || _a === void 0 ? void 0 : _a.find((y) => y.code === shared_constants_1.CandidateFileType.MainResume)) === null || _b === void 0 ? void 0 : _b.id;
                const lettersOfReferenceFileTypeId = (_d = (_c = candidateFileType.appValues) === null || _c === void 0 ? void 0 : _c.find((y) => y.code ===
                    shared_constants_1.CandidateFileType.LastThreeLettersOfReference)) === null || _d === void 0 ? void 0 : _d.id;
                const otherFileTypeId = (_f = (_e = candidateFileType.appValues) === null || _e === void 0 ? void 0 : _e.find((y) => y.code === shared_constants_1.CandidateFileType.Other)) === null || _f === void 0 ? void 0 : _f.id;
                const licenseFileTypeId = (_h = (_g = candidateFileType.appValues) === null || _g === void 0 ? void 0 : _g.find((y) => y.code === shared_constants_1.CandidateFileType.CarLicence)) === null || _h === void 0 ? void 0 : _h.id;
                const passportTypeId = (_k = (_j = candidateFileType.appValues) === null || _j === void 0 ? void 0 : _j.find((y) => y.code === shared_constants_1.CandidateFileType.Passport)) === null || _k === void 0 ? void 0 : _k.id;
                const identityTypeId = (_m = (_l = candidateFileType.appValues) === null || _l === void 0 ? void 0 : _l.find((y) => y.code === shared_constants_1.CandidateFileType.IdentityCard)) === null || _m === void 0 ? void 0 : _m.id;
                const criminalRecordTypeId = (_p = (_o = candidateFileType.appValues) === null || _o === void 0 ? void 0 : _o.find((y) => y.code === shared_constants_1.CandidateFileType.CriminalRecord)) === null || _p === void 0 ? void 0 : _p.id;
                const workCertificateTypeId = (_r = (_q = candidateFileType.appValues) === null || _q === void 0 ? void 0 : _q.find((y) => y.code === shared_constants_1.CandidateFileType.LastThreeWorkCertificates)) === null || _r === void 0 ? void 0 : _r.id;
                const variousDiplomaTypeId = (_t = (_s = candidateFileType.appValues) === null || _s === void 0 ? void 0 : _s.find((y) => y.code === shared_constants_1.CandidateFileType.VariousDiploma)) === null || _t === void 0 ? void 0 : _t.id;
                let fileTypeId;
                if (candidateAttachment) {
                    switch (candidateAttachment.Type) {
                        case 'FormattedResume':
                        case 'Resume':
                            fileTypeId = mainResumeFileTypeId;
                            if (resumeHasBeenImported) {
                                fileTypeId = otherFileTypeId;
                            }
                            break;
                        case 'Reference':
                            fileTypeId = lettersOfReferenceFileTypeId;
                            break;
                        case 'License':
                            fileTypeId = licenseFileTypeId;
                            break;
                        default:
                            fileTypeId = otherFileTypeId;
                            break;
                    }
                }
                if (fileTypeId === otherFileTypeId &&
                    candidateAttachment.FileName) {
                    const candidateAttachmentFileName = candidateAttachment.FileName.toLowerCase();
                    if (candidateAttachmentFileName.indexOf('driving licence') !==
                        -1 ||
                        candidateAttachmentFileName.indexOf('driving-licence') !==
                            -1) {
                        fileTypeId = licenseFileTypeId;
                        console.log('found license ', candidateAttachment.FileName);
                    }
                    if (this.searchWordInFileName(candidateAttachmentFileName, 'resume')) {
                        fileTypeId = mainResumeFileTypeId;
                        if (resumeHasBeenImported) {
                            fileTypeId = otherFileTypeId;
                        }
                        console.log('found resume ', candidateAttachment.FileName);
                    }
                    if (candidateAttachmentFileName.indexOf('recommendation letter') !== -1 ||
                        candidateAttachmentFileName.indexOf('ref letter') !== -1 ||
                        this.searchWordInFileName(candidateAttachmentFileName, 'reference')) {
                        fileTypeId = lettersOfReferenceFileTypeId;
                        console.log('found ref letter ', candidateAttachment.FileName);
                    }
                    if (candidateAttachmentFileName.indexOf('work certificate') !==
                        -1 ||
                        candidateAttachmentFileName.indexOf('work contract') !== -1) {
                        fileTypeId = workCertificateTypeId;
                        console.log('found work certificate ', candidateAttachment.FileName);
                    }
                    if (candidateAttachmentFileName.indexOf('training certificate') !== -1) {
                        fileTypeId = variousDiplomaTypeId;
                        console.log('found various diploma ', candidateAttachment.FileName);
                    }
                    if (candidateAttachmentFileName.indexOf('passeport') !== -1) {
                        fileTypeId = passportTypeId;
                        console.log('found passeport ', candidateAttachment.FileName);
                    }
                    if (candidateAttachmentFileName.indexOf('criminal record') !==
                        -1 ||
                        candidateAttachmentFileName.indexOf('criminalrecord') !== -1) {
                        fileTypeId = criminalRecordTypeId;
                        console.log('found criminal record ', candidateAttachment.FileName);
                    }
                    if (this.searchWordInFileName(candidateAttachmentFileName, 'id') ||
                        this.searchWordInFileName(candidateAttachmentFileName, 'cni')) {
                        fileTypeId = identityTypeId;
                        console.log('found identity ', candidateAttachment.FileName);
                    }
                    if (fileTypeId === otherFileTypeId) {
                        console.log('type could not be found');
                    }
                }
                if (!fileTypeId) {
                    attachmentsResponse.ignored.push(attachment.AttachmentID);
                    continue;
                }
                console.log('uploading attachment to gdrive for candidate ' +
                    candidate.id +
                    '...');
                const uploadResponse = yield this.candidateService.uploadCandidateFilesToGdrive(candidate, getFileResponse.jobAdderFileLocation, getFileResponse.file, fileTypeId, null, 'candidates', true);
                if (uploadResponse.success) {
                    uploadResponse.newCandidateFileDto.isMandatory = true;
                    yield this.candidateService.repository.save(candidate);
                    console.log('uploaded successfully');
                    if (fileTypeId === mainResumeFileTypeId) {
                        resumeHasBeenImported = true;
                    }
                }
                else {
                    attachmentsResponse.errors.push(attachment.AttachmentID);
                }
            }
            return attachmentsResponse;
        });
    }
    searchWordInFileName(fileName, word, separators) {
        if (!(separators === null || separators === void 0 ? void 0 : separators.length)) {
            separators = ['.', '_'];
        }
        for (const separator of separators) {
            if (fileName.indexOf(' ' + word + separator) !== -1 ||
                fileName.startsWith(word + separator) ||
                fileName.indexOf(' ' + word + ' ') !== -1 ||
                fileName.startsWith(word + ' ')) {
                return true;
            }
        }
        return false;
    }
    getFileExtensionType(fileType) {
        if (fileType.indexOf('png') !== -1) {
            return 'png';
        }
        else if (fileType.indexOf('jpeg') !== -1) {
            return 'jpeg';
        }
        else if (fileType.indexOf('jpg') !== -1) {
            return 'jpg';
        }
    }
    getFolderNameAttachment(filePath) {
        var _a;
        if (!filePath) {
            return null;
        }
        return (_a = filePath.substring(0, 7)) === null || _a === void 0 ? void 0 : _a.replace('/', '');
    }
    getExtensionAttachment(filePath) {
        if (!filePath) {
            return;
        }
        const lastIndexStart = filePath.lastIndexOf('.') + 1;
        const lastIndexEnd = filePath.lastIndexOf(filePath.slice(-1)) + 1;
        return filePath.substring(lastIndexStart, lastIndexEnd);
    }
    sendMailAfterMigration() {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            yield logger_service_1.AppLogger.log('sendMailAfterMigration BEGIN');
            try {
                yield this.initAppTypesForMigration();
                const statusList = (_c = (_b = (_a = this.candidateStatusAppType) === null || _a === void 0 ? void 0 : _a.appValues) === null || _b === void 0 ? void 0 : _b.filter((x) => x.code === shared_constants_1.CandidateStatus.Referenced ||
                    x.code === shared_constants_1.CandidateStatus.Placed)) === null || _c === void 0 ? void 0 : _c.map((x) => x.id);
                const candidatesCount = 70;
                const candidatesList = yield this.candidateService
                    .getRepository()
                    .find({
                    where: {
                        jobAdderContactId: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()),
                        mailSentAfterMigration: false,
                        email: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()),
                        candidateStatusId: (0, typeorm_1.In)(statusList),
                    },
                    take: candidatesCount,
                    relations: [
                        'associatedUser',
                        'candidateLanguages',
                        'candidateLanguages.levelLanguage',
                    ],
                    order: {
                        creationDate: 'DESC',
                    },
                });
                let mailsSent = 0;
                let mailsWithErrors = 0;
                let totalMails = 0;
                for (const candidate of candidatesList) {
                    if (!candidate.associatedUser) {
                        yield logger_service_1.AppLogger.log('sendMailAfterMigration - ignoring candidate : no associated user');
                        yield this.candidateService
                            .getRepository()
                            .update({ id: candidate.id }, { mailSentAfterMigration: true });
                        continue;
                    }
                    if (!candidate.email) {
                        yield logger_service_1.AppLogger.log('sendMailAfterMigration - ignoring candidate : no email');
                        yield this.candidateService
                            .getRepository()
                            .update({ id: candidate.id }, { mailSentAfterMigration: true });
                        continue;
                    }
                    if (!candidate.jobAdderContactId) {
                        yield logger_service_1.AppLogger.log('sendMailAfterMigration - ignoring candidate : no jobAdderContactId');
                        yield this.candidateService
                            .getRepository()
                            .update({ id: candidate.id }, { mailSentAfterMigration: true });
                        continue;
                    }
                    if (candidate.mailSentAfterMigration) {
                        yield logger_service_1.AppLogger.log('sendMailAfterMigration - ignoring candidate : mailSentAfterMigration');
                        continue;
                    }
                    const candidateDto = candidate.toDto();
                    const userResponse = yield this.candidateService.sendEmailAccessToCandidate(candidateDto.associatedUser, candidateDto, 'NewAccountAfterJobAdderMigration');
                    if (userResponse.success) {
                        mailsSent++;
                        candidate.mailSentAfterMigration = true;
                        yield this.candidateService
                            .getRepository()
                            .update({ id: candidate.id }, { mailSentAfterMigration: true });
                    }
                    else {
                        mailsWithErrors++;
                    }
                    totalMails++;
                }
                response.message = JSON.stringify({
                    mailsWithErrors,
                    mailsSent,
                    totalMails,
                    candidatesCount,
                });
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            yield logger_service_1.AppLogger.log('sendMailAfterMigration END');
            return response;
        });
    }
    migrateCandidateJobs(connection, contactId, candidateDto) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const jobsForContact = (yield connection.query('SELECT * FROM CandidateCustomField WHERE FieldID = 7 AND ContactID=' +
                contactId));
            const jobAssociationKeys = Object.keys(jobs_associations_crm_1.JobsAssociationCRM);
            const jobsResponse = { ignoredJobs: [], handledJobs: [] };
            if (!((_a = candidateDto === null || candidateDto === void 0 ? void 0 : candidateDto.candidateCurrentJobs) === null || _a === void 0 ? void 0 : _a.length)) {
                candidateDto.candidateCurrentJobs = [];
            }
            for (const jobForContact of jobsForContact) {
                let jobStr = jobForContact === null || jobForContact === void 0 ? void 0 : jobForContact.ValueText;
                if (!jobStr) {
                    jobStr = jobForContact === null || jobForContact === void 0 ? void 0 : jobForContact.Value;
                    continue;
                }
                const keyFound = jobAssociationKeys.find((x) => x &&
                    jobStr &&
                    x.trim().toLowerCase() === jobStr.trim().toLowerCase());
                if (!keyFound || !jobs_associations_crm_1.JobsAssociationCRM[keyFound]) {
                    jobsResponse.ignoredJobs.push(jobStr);
                    continue;
                }
                const jobCode = jobs_associations_crm_1.JobsAssociationCRM[keyFound];
                if (!jobCode) {
                    jobsResponse.ignoredJobs.push(jobStr);
                    continue;
                }
                const jobAppValue = this.jobsAppValuesFullList.find((x) => x.code.trim() === jobCode.trim());
                if (!jobAppValue) {
                    jobsResponse.ignoredJobs.push(jobStr);
                    continue;
                }
                const candidateJobLinkDto = new candidate_current_jobs_dto_1.CandidateCurrentJobDto();
                candidateJobLinkDto.currentJobId = jobAppValue.id;
                candidateJobLinkDto.candidateId = candidateDto.id;
                if (!candidateDto.candidateCurrentJobs.some((x) => x.currentJobId === candidateJobLinkDto.currentJobId)) {
                    candidateDto.candidateCurrentJobs.push(candidateJobLinkDto);
                }
                jobsResponse.handledJobs.push({
                    initialJobName: jobStr,
                    jobAppValue: jobAppValue,
                });
            }
            return jobsResponse;
        });
    }
};
DataMigrationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [referential_service_1.ReferentialService,
        candidates_service_1.CandidateService,
        candidate_applications_service_1.CandidateApplicationService,
        job_offers_service_1.JobOfferService,
        file_service_1.FileService,
        key_value_service_1.KeyValueService,
        mail_service_1.MailService])
], DataMigrationService);
exports.DataMigrationService = DataMigrationService;
//# sourceMappingURL=data-migration.service.js.map