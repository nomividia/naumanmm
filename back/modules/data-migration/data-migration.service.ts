/* eslint-disable @typescript-eslint/prefer-regexp-exec */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/semi */
import { Injectable } from '@nestjs/common';
import { List } from 'linqts';
import { MainHelpers } from 'nextalys-js-helpers';
import { CSVHelpers } from 'nextalys-js-helpers/dist/csv-helpers/csv-helpers';
import {
    FileHelpers,
    NextalysNodeHttpClient,
    TextHelpers,
} from 'nextalys-node-helpers';
import { ImageHelpers } from 'nextalys-node-helpers/dist/image-helpers';
import * as path from 'path';
import { Connection, createConnection, In, IsNull, Not } from 'typeorm';
import { RefData } from '../../../shared/ref-data';
import {
    AppFileType,
    ApplyStatus,
    AppTypes,
    CandidateApplicationFileType,
    CandidateFileType,
    CandidateStatus,
    PersonGender,
    RelationshipStatus,
    RolesList,
} from '../../../shared/shared-constants';
import { Environment } from '../../environment/environment';
import { JobsAssociationCRM } from '../../environment/jobs-associations-crm';
import { AppError, AppErrorWithMessage } from '../../models/app-error';
import { AddressDto } from '../../models/dto/address-dto';
import { AppFileDto } from '../../models/dto/app-file-dto';
import { AppTypeDto, GetAppTypesResponse } from '../../models/dto/app-type-dto';
import { AppValueDto } from '../../models/dto/app-value-dto';
import { NoteItemDto } from '../../models/dto/note-item.dto';
import { GenericResponse } from '../../models/responses/generic-response';
import { ApplicationBaseService } from '../../services/base-service';
import { ReferentialService } from '../../services/referential.service';
import { FileService } from '../../services/tools/file.service';
import { AppLogger } from '../../services/tools/logger.service';
import { MailService } from '../../services/tools/mail.service';
import { CandidateApplicationJobsDto } from '../candidate-application-jobs/candidates-application-jobs-dto';
import { CandidateApplicationDto } from '../candidates-application/candidate-application-dto';
import { CandidateApplicationService } from '../candidates-application/candidate-applications.service';
import { CandidateCurrentJobDto } from '../candidates/candidate-current-jobs/candidate-current-jobs.dto';
import { CandidateDto } from '../candidates/candidate-dto';
import { CandidateService } from '../candidates/candidates.service';
import { GetJobOffersResponse } from '../job-offers/job-offer-dto';
import { JobOfferService } from '../job-offers/job-offers.service';
import { KeyValueService } from '../key-value-db/key-value.service';
import {
    DataMigrationCandidateApplicationResponse,
    DataMigrationResponse,
    JA_Attachment,
    JA_Candidate,
    JA_Candidate_Attachment,
    JA_CandidateEducation,
    JA_CandidateNote,
    JA_CandidateStatus,
    JA_Contact,
    JA_Contact_Attachment,
    JA_Contact_Photo,
    JA_CustomField,
    JA_Note,
} from './data-migration-types';

interface CandidateApplicationCsvWrapper {
    field: string;
    columns: CandidateApplicationCsvWrapperColumn[];
}

interface CandidateApplicationCsvWrapperColumn {
    columnNames: string[];
    concat?: boolean;
    splitCharacter?: string;
}

@Injectable()
export class DataMigrationService extends ApplicationBaseService {
    private jobsRegexList: {
        appValueId: string;
        regexList: RegExp[];
        appValue?: AppValueDto;
    }[] = [];
    private genderAppValues: AppValueDto[];
    private relationshipStatusAppValues: AppValueDto[];
    private candidateFileAppType: AppTypeDto;
    private candidateStatusAppType: AppTypeDto;
    private employerProfileAppType: AppTypeDto;
    private jobsAppValuesFullList: AppValueDto[];

    maxLength = 0;

    constructor(
        private referentialService: ReferentialService,
        private candidateService: CandidateService,
        // private jobReferencesService: JobReferencesService,
        // private candidateResumeService: CandidateResumeService,
        private candidateApplicationService: CandidateApplicationService,
        private jobOfferService: JobOfferService,
        private fileService: FileService,
        private keyValueService: KeyValueService,
        private mailService: MailService, // @InjectRepository(CandidateJob) // public readonly candidateJobRepository: Repository<CandidateJob>,
    ) {
        super();
    }

    private async getConnection() {
        return await createConnection({
            name: 'jobAdderMsSql',
            type: 'mssql',
            host: Environment.JobAdderBackupHost,
            port: 1433,
            database: 'jobadder',
            username: Environment.JobAdderBackupUser,
            password: Environment.JobAdderBackupPassword,
            synchronize: false,
            extra: { ssl: false, trustServerCertificate: true },
            logging: true,
        });
    }

    private async initJobRegexList(jobsAppValues: AppValueDto[]) {
        const jobRegexListPrepare: { regexList: RegExp[]; jobCode: string }[] =
            [
                {
                    jobCode: 'jobcategory_garde-de-propriete',
                    regexList: [
                        new RegExp('.*gardien.*', 'gim'),
                        // new RegExp('.*House keeper.*', 'gim'),
                        // new RegExp('.*Housekeeping.*', 'gim'),
                        // new RegExp('.*Housekeeper.*', 'gim'),
                        // new RegExp('.*Housekeeper.*', 'gim'),
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
                    jobCode:
                        'jobcategory_intendant-general-regisseur-house-manager',
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
                    jobCode:
                        'jobyachtingcategory_manager-gestionnaire-de-yacht',
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
                // {
                //     jobCode: 'jobcategory_cuisiniere-femme-de-menage',
                //     regexList: [
                //         new RegExp('.*Aide.', 'gim'),
                //     ],
                // },
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
            const jobAppValue = jobsAppValues.find(
                (x) => x.code === jobRegexWrapper.jobCode,
            );

            if (!jobAppValue) {
                await AppLogger.error(
                    'init job regex list error - job not found : ' +
                        jobRegexWrapper.jobCode,
                );
                continue;
            }

            this.jobsRegexList.push({
                appValueId: jobAppValue?.id,
                appValue: jobAppValue,
                regexList: jobRegexWrapper.regexList,
            });
        }
        // this.jobsRegexList = [
        //     {
        //         appValueId: jobsAppValues.find(x => x.code === 'jobcategory_garde-de-propriete')?.id,
        //         regexList: [
        //             new RegExp('.*gardien.*', 'gim'),
        //             // new RegExp('.*House keeper.*', 'gim'),
        //             // new RegExp('.*Housekeeping.*', 'gim'),
        //             // new RegExp('.*Housekeeper.*', 'gim'),
        //             // new RegExp('.*Housekeeper.*', 'gim'),
        //         ],
        //         appValue: jobsAppValues.find(x => x.code === 'jobcategory_garde-de-propriete'),
        //     },
        //     {
        //         appValueId: jobsAppValues.find(x => x.code === 'jobcategory_gouvernante')?.id,
        //         regexList: [
        //             new RegExp('.*gouvernant.*', 'gim'),
        //             new RegExp('.*Hostess.*', 'gim'),
        //             new RegExp('.*Host.*', 'gim'),
        //             new RegExp('.*Host.*', 'gim'),
        //         ],
        //         appValue: jobsAppValues.find(x => x.code === 'jobcategory_gouvernante'),
        //     },
        //     {
        //         appValueId: jobsAppValues.find(x => x.code === 'jobcategory_intendant-general-regisseur-house-manager')?.id,
        //         regexList: [
        //             new RegExp('.*House Manager.*', 'gim'),
        //         ],
        //         appValue: jobsAppValues.find(x => x.code === 'jobcategory_intendant-general-regisseur-house-manager'),
        //     },
        //     {
        //         appValueId: jobsAppValues.find(x => x.code === 'jobcategory_assitante-maternelle-nourrice')?.id,
        //         regexList: [new RegExp('.*assistante maternelle.*', 'gim')],
        //         appValue: jobsAppValues.find(x => x.code === 'jobcategory_assitante-maternelle-nourrice'),
        //     },
        //     {
        //         appValueId: jobsAppValues.find(x => x.code === 'jobcategory_majordome-maitre-d-hotel-huissier')?.id,
        //         regexList: [
        //             new RegExp('.*maitre d\'hotel.*', 'gim'),
        //             new RegExp('.*maître d\'hotel.*', 'gim'),
        //             new RegExp('.*maître d\'hôtel.*', 'gim'),
        //             new RegExp('.*majordome.*', 'gim'),
        //             new RegExp('.*Butler.*', 'gim'),
        //             new RegExp('.*Chalet.*', 'gim'),
        //             new RegExp('.*manager in Aparthotel.*', 'gim'),

        //         ],
        //         appValue: jobsAppValues.find(x => x.code === 'jobcategory_majordome-maitre-d-hotel-huissier'),
        //     },

        //     {
        //         appValueId: jobsAppValues.find(x => x.code === 'jobcategory_coach-sportif')?.id,
        //         regexList: [
        //             new RegExp('.*Personal Trainer.*', 'gim'),
        //             new RegExp('.*coach sportif.*', 'gim'),

        //         ],
        //         appValue: jobsAppValues.find(x => x.code === 'jobcategory_coach-sportif'),
        //     },
        //     {
        //         appValueId: jobsAppValues.find(x => x.code === 'jobcategory_nannie-nounou')?.id,
        //         regexList: [
        //             new RegExp('.*Nannie.*', 'gim'),
        //             new RegExp('.*Nanny.*', 'gim'),

        //         ],
        //     },
        //     {
        //         appValueId: jobsAppValues.find(x => x.code === 'jobcategory_garde-du-corps')?.id,
        //         regexList: [
        //             new RegExp('.*Private Security.', 'gim'),
        //             new RegExp('.*Security Officer.', 'gim'),
        //             new RegExp('.*Securi-guard.', 'gim'),
        //             new RegExp('.*Caretaker and helper.', 'gim'),
        //         ],
        //     },
        //     {
        //         appValueId: jobsAppValues.find(x => x.code === 'jobcategory_chef-de-la-securite')?.id,
        //         regexList: [
        //             new RegExp('.*Mobile Patrol.', 'gim'),
        //         ],
        //     },
        //     {
        //         appValueId: jobsAppValues.find(x => x.code === 'jobcategory_auxiliaire-de-vie-dame-de-compagnie')?.id,
        //         regexList: [
        //             new RegExp('.*Caregiver.', 'gim'),
        //         ],
        //     },
        //     {
        //         appValueId: jobsAppValues.find(x => x.code === 'jobcategory_coiffeur-personnel')?.id,
        //         regexList: [
        //             new RegExp('.*hairdresser.', 'gim'),
        //         ],
        //     },
        //     {
        //         appValueId: jobsAppValues.find(x => x.code === 'jobyachtingcategory_manager-gestionnaire-de-yacht')?.id,
        //         regexList: [
        //             new RegExp('.*representative.', 'gim'),
        //             new RegExp('.*4 cleanears', 'gim'),

        //         ],
        //     },
        //     {
        //         appValueId: jobsAppValues.find(x => x.code === 'jobcategory_tuteur-professeur-prive')?.id,
        //         regexList: [
        //             new RegExp('.*translator.', 'gim'),
        //             new RegExp('.*Lecturer.', 'gim'),
        //         ],
        //     },
        //     {
        //         appValueId: jobsAppValues.find(x => x.code === 'jobcategory_tuteur-professeur-prive')?.id,
        //         regexList: [
        //             new RegExp('.*skipper.', 'gim'),
        //         ],
        //     },
        //     {
        //         appValueId: jobsAppValues.find(x => x.code === 'jobcategory_babysitter')?.id,
        //         regexList: [
        //             new RegExp('.*ASSISTANTE PARENTALE.', 'gim'),
        //             new RegExp('.*NURSE DE NUIT.', 'gim'),
        //             new RegExp('.*AU PAIR.', 'gim'),
        //         ],
        //     },
        //     {
        //         appValueId: jobsAppValues.find(x => x.code === 'jobcategory_cuisiniere-femme-de-menage')?.id,
        //         regexList: [
        //             new RegExp('.*Aide.', 'gim'),
        //         ],
        //     },
        //     {
        //         appValueId: jobsAppValues.find(x => x.code === 'jobcategory_femme-de-menage-de-chambre')?.id,
        //         regexList: [
        //             new RegExp('.*House keeper.*', 'gim'),
        //             new RegExp('.*Housekeeping.*', 'gim'),
        //             new RegExp('.*Housekeeper.*', 'gim'),
        //             new RegExp('.*Housekeeper.*', 'gim'),
        //         ],
        //     },
        //     {
        //         appValueId: jobsAppValues.find(x => x.code === 'jobcategory_secretaire-particulier')?.id,
        //         regexList: [
        //             new RegExp('.*Personal Assistant.', 'gim'),
        //             new RegExp('.*SECRETARY.', 'gim'),
        //         ],
        //     },

        // ];
    }

    private async initAppTypesForMigration() {
        const getAppTypesResponse =
            await this.referentialService.getMultipleTypeValues({
                appTypesCodes: [
                    AppTypes.PersonGenderCode,
                    AppTypes.RelationshipStatusCode,
                    AppTypes.CandidateFileType,
                    AppTypes.CandidateStatusCode,
                    AppTypes.JobCategoryCode,
                    AppTypes.JobNannyCategoryCode,
                    AppTypes.JobYachtingCategoryCode,
                    AppTypes.EmployerProfilCode,
                ].join(','),
            });

        if (!getAppTypesResponse.success) {
            throw new AppErrorWithMessage(
                'Error occured when loading appTypeResponse',
            );
        }

        this.genderAppValues = getAppTypesResponse.appTypes.find(
            (x) => x.code === AppTypes.PersonGenderCode,
        ).appValues;
        this.relationshipStatusAppValues = getAppTypesResponse.appTypes.find(
            (x) => x.code === AppTypes.RelationshipStatusCode,
        ).appValues;
        this.candidateFileAppType = getAppTypesResponse.appTypes.find(
            (x) => x.code === AppTypes.CandidateFileType,
        );
        this.candidateStatusAppType = getAppTypesResponse.appTypes.find(
            (x) => x.code === AppTypes.CandidateStatusCode,
        );
        this.employerProfileAppType = getAppTypesResponse.appTypes.find(
            (x) => x.code === AppTypes.EmployerProfilCode,
        );

        if (!this.candidateFileAppType) {
            throw new AppErrorWithMessage(
                'Error occured when loading appTypeResponse',
            );
        }

        const jobsTypes = getAppTypesResponse.appTypes.filter(
            (x) =>
                x.code === AppTypes.JobCategoryCode ||
                x.code === AppTypes.JobNannyCategoryCode ||
                x.code === AppTypes.JobYachtingCategoryCode,
        );

        this.jobsAppValuesFullList = new List(jobsTypes)
            .SelectMany((x) => new List(x.appValues))
            .ToArray();

        await this.initJobRegexList(this.jobsAppValuesFullList);
    }

    async dataMigration() {
        const response = new DataMigrationResponse();
        let connection: Connection;
        await AppLogger.loggerInstance.log('Data Migration BEGIN');
        let currentContactId: number;

        try {
            if (
                !Environment.JobAdderBackupHost ||
                !Environment.JobAdderBackupUser ||
                !Environment.JobAdderBackupPassword ||
                !Environment.JobAdderAttachmentsFolder
            ) {
                throw new AppErrorWithMessage(
                    'You must configure job adder backup sql access and attachment folder !',
                );
            }
            //disabled
            return response;

            const lastContactSaved = await this.keyValueService.getKeyValue(
                'JobAdderLastContactSaved',
            );
            const startingFromEnd = false;

            // let firstCandidateContactID = 1;
            let firstCandidateContactID = 15745999 + 1;

            if (startingFromEnd) {
                firstCandidateContactID = 30000000;
            }
            if (lastContactSaved) {
                firstCandidateContactID = parseInt(lastContactSaved, 10) + 1;
                await this.keyValueService.saveKeyValue(
                    'JobAdderLastContactSavedPrevious',
                    lastContactSaved,
                );
            }

            const candidatesLength = 500;
            await AppLogger.loggerInstance.log(
                'Data Migration : starting at ' +
                    firstCandidateContactID +
                    ' - taking ' +
                    candidatesLength +
                    ' candidates',
            );
            await this.initAppTypesForMigration();
            // const contactsToImport = [12147544, 1326176, 1326178, 1325589];
            // const contactsToImport = [13647288];
            const contactsToImport = [15771734];

            const importOnlyContactIds = false;

            connection = await this.getConnection();

            let candidateJobAdderQuery =
                'SELECT TOP ' + candidatesLength + ' * FROM Candidate WHERE';
            if (importOnlyContactIds) {
                candidateJobAdderQuery +=
                    ' ContactID IN (' + contactsToImport.join(',') + ')';
            } else {
                if (startingFromEnd) {
                    candidateJobAdderQuery +=
                        ' ContactID <=' +
                        firstCandidateContactID +
                        ' ORDER BY ContactID DESC';
                } else {
                    candidateJobAdderQuery +=
                        ' ContactID >=' +
                        firstCandidateContactID +
                        ' ORDER BY ContactID ASC';
                }
            }

            const ja_candidatesStatusList = (await connection.query(
                'SELECT * FROM CandidateStatus',
            )) as JA_CandidateStatus[];

            const candidates = (await connection.query(
                candidateJobAdderQuery,
            )) as JA_Candidate[];
            // const contacts = await connection.query('SELECT TOP 10 * FROM Contact') as JA_Contact[];

            if (candidates.length === 0) {
                throw new AppError('NO candidates found !');
            }
            const contacts = (await connection.query(
                'SELECT * FROM Contact WHERE ContactID IN (' +
                    candidates.map((x) => x.ContactID).join(',') +
                    ')',
            )) as JA_Contact[];

            if (contacts.length === 0) {
                throw new AppError('NO contacts found !');
            }
            await AppLogger.loggerInstance.log(
                candidates.length + ' candidates from JobAdder to save',
            );
            await AppLogger.loggerInstance.log(
                contacts.length + ' contacts from JobAdder to save',
            );

            const customFields = (await connection.query(
                'SELECT * FROM CustomField',
            )) as JA_CustomField[];
            // console.log("🚀 ~ customFields", customFields);

            for (const candidate of candidates) {
                // console.log("Log ~ file: data-migration.service.ts ~ line 65 ~ DataMigrationService ~ dataMigration ~ candidate", candidate);
                if (!candidate?.ContactID) {
                    AppLogger.loggerInstance.log(
                        'Ignoring candidate ' +
                            candidate.CandidateID +
                            ' - no contact ID',
                    );
                    continue;
                }
                let isNewCandidate = true;
                let candidateDto = new CandidateDto();

                const findCandidateResponse =
                    await this.candidateService.findOne({
                        where: { jobAdderContactId: candidate.ContactID },
                    });
                if (findCandidateResponse.candidate) {
                    isNewCandidate = false;
                    candidateDto = findCandidateResponse.candidate;
                    continue;
                }

                const contactFromJobAdder = contacts.find(
                    (x) => x.ContactID === candidate.ContactID,
                );

                if (!contactFromJobAdder) {
                    response.ignoredList.push(candidate.ContactID);
                    continue;
                }
                if (
                    !contactFromJobAdder.FirstName &&
                    !contactFromJobAdder.LastName &&
                    !contactFromJobAdder.Email &&
                    !contactFromJobAdder.Phone
                ) {
                    response.ignoredList.push(candidate.ContactID);
                    continue;
                }
                const candidateEducations = (await connection.query(
                    'SELECT * FROM CandidateEducation WHERE ContactID = ' +
                        contactFromJobAdder.ContactID,
                )) as JA_CandidateEducation[];
                // console.log("🚀 ~ candidateEducations", candidateEducations);

                // for (const candidateEducation of candidateEducations) {
                //     const candidateResumeFormationEntity =
                //         new CandidateResumeFormation();
                //     candidateResumeFormationEntity.place =
                //         candidateEducation.Institution;
                //     candidateResumeFormationEntity.formationDiplomeName =
                //         candidateEducation.Course;

                //     if (!candidateResumeEntity.formations)
                //         candidateResumeEntity.formations = [];

                //     candidateResumeEntity.formations.push(
                //         candidateResumeFormationEntity,
                //     );
                // }

                // const candidateCustomFields = await connection.query('SELECT * FROM CandidateCustomField WHERE ContactID = ' + contactFromJobAdder.ContactID) as JA_CandidateCustomField[];
                // // console.log("🚀 ~ candidateCustomFields", candidateCustomFields);

                // for (const candidateCustomField of candidateCustomFields) {
                //     const customField = customFields.find(x => x.FieldID === candidateCustomField.FieldID);
                //     // console.log("🚀 ~ customField", customField);

                //     // todo map customField
                // }

                const migrateResponse = await this.migrateCandidateJobs(
                    connection,
                    contactFromJobAdder.ContactID,
                    candidateDto,
                );
                if (migrateResponse.ignoredJobs?.length) {
                    await AppLogger.log(
                        'ignored jobs : ' +
                            migrateResponse.ignoredJobs.join(' / '),
                    );
                }
                const candidateNotes = (await connection.query(
                    'SELECT NoteID FROM CandidateNote WHERE ContactID = ' +
                        contactFromJobAdder.ContactID,
                )) as JA_CandidateNote[];
                // console.log("🚀 ~ candidateNotes", candidateNotes);

                candidateDto.noteItems = [];
                if (candidateNotes?.length) {
                    const candidatesNotesIds = candidateNotes.map(
                        (x) => x.NoteID,
                    );
                    const notes = (await connection.query(
                        "SELECT * FROM Note WHERE NoteID IN ('" +
                            candidatesNotesIds.join("','") +
                            "')",
                    )) as JA_Note[];
                    for (const note of notes) {
                        // const notes = await connection.query('SELECT * FROM Note WHERE NoteID = \'' + candidateNote.NoteID + '\'') as JA_Note[];
                        // console.log("🚀 ~ note", note);
                        // if (!notes?.length)
                        //     continue;
                        // const note = notes[0];

                        const noteItem = new NoteItemDto();
                        noteItem.modifDate = note.DateCreated;
                        noteItem.content = TextHelpers.htmlToText(note.Text);
                        noteItem.content = noteItem.content.replace(
                            /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
                            '',
                        );

                        candidateDto.noteItems.push(noteItem);
                    }
                }

                candidateDto.creationDate = contactFromJobAdder.DateCreated;

                candidateDto.firstName = contactFromJobAdder.FirstName;
                candidateDto.lastName = contactFromJobAdder.LastName;

                let phone1 =
                    contactFromJobAdder.MobileNormalized ||
                    contactFromJobAdder.PhoneNumeric;
                let phone2 =
                    contactFromJobAdder.Mobile ||
                    contactFromJobAdder.MobileNumeric;
                if (phone1) phone1 = phone1.substring(0, 29);
                if (phone2) phone2 = phone2.substring(0, 29);

                candidateDto.phone = phone1;
                candidateDto.phoneSecondary = phone2;
                candidateDto.birthDate = candidate.DateOfBirth;

                if (!candidateDto.phone && candidateDto.phoneSecondary) {
                    candidateDto.phone = candidateDto.phoneSecondary;
                    candidateDto.phoneSecondary = null;
                }
                candidateDto.email = contactFromJobAdder.Email;
                candidateDto.isAvailable = !candidate.Deleted;
                if (
                    contactFromJobAdder.Salutation === 'Mr' ||
                    contactFromJobAdder.Salutation === 'Mr.' ||
                    !contactFromJobAdder.Salutation
                ) {
                    candidateDto.genderId = this.genderAppValues.find(
                        (x) => x.code === PersonGender.Male,
                    ).id;
                } else if (
                    contactFromJobAdder.Salutation === 'Ms' ||
                    contactFromJobAdder.Salutation === 'Ms.'
                ) {
                    candidateDto.genderId = this.genderAppValues.find(
                        (x) => x.code === PersonGender.Female,
                    ).id;
                    candidateDto.relationshipStatusId =
                        this.relationshipStatusAppValues.find(
                            (x) => x.code === RelationshipStatus.Married,
                        )?.id;
                } else if (
                    contactFromJobAdder.Salutation === 'Mrs' ||
                    contactFromJobAdder.Salutation === 'Mrs.' ||
                    contactFromJobAdder.Salutation === 'Miss'
                ) {
                    candidateDto.genderId = this.genderAppValues.find(
                        (x) => x.code === PersonGender.Female,
                    ).id;
                } else if (
                    contactFromJobAdder.Salutation === 'Dr' ||
                    contactFromJobAdder.Salutation === 'Dr.'
                ) {
                    const femalesFirstNames: string[] = [
                        'Gerlinde',
                        'Dr. & Mrs. Andrew',
                        'Gitta',
                        'Nicky',
                        'Tish',
                        'Vijay',
                        'Olga',
                        'Marie-Joséphine',
                    ];

                    if (
                        femalesFirstNames.indexOf(
                            contactFromJobAdder.FirstName,
                        ) === -1
                    )
                        candidateDto.genderId = this.genderAppValues.find(
                            (x) => x.code === PersonGender.Male,
                        ).id;
                    else
                        candidateDto.genderId = this.genderAppValues.find(
                            (x) => x.code === PersonGender.Female,
                        ).id;
                }

                if (!candidateDto.relationshipStatusId) {
                    candidateDto.relationshipStatusId =
                        this.relationshipStatusAppValues.find(
                            (x) => x.code === RelationshipStatus.Single,
                        )?.id;
                }

                candidateDto.jobAdderContactId = candidate.ContactID;

                // add address to candidate

                if (
                    candidate.AddressLine1 ||
                    candidate.AddressLine2 ||
                    candidate.AddressState ||
                    candidate.AddressSuburb ||
                    candidate.AddressPostcode ||
                    candidate.AddressCountry
                ) {
                    candidateDto.addresses = [
                        {
                            lineOne: candidate.AddressLine1,
                            lineTwo: candidate.AddressLine2,
                            department: candidate.AddressState,
                            city: candidate.AddressSuburb,
                            postalCode: candidate.AddressPostcode
                                ? candidate.AddressPostcode.substring(0, 9)
                                : null,
                            country: RefData.getCountryCode(
                                candidate.AddressCountry,
                                'en',
                            ),
                        },
                    ];
                }

                candidateDto.candidateStatusId =
                    this.candidateStatusAppType?.appValues?.find(
                        (x) => x.code === CandidateStatus.ToBeReferenced,
                    )?.id;

                let mustCreateUser = false;
                if (candidate.StatusID) {
                    const ja_candidatesStatus = ja_candidatesStatusList.find(
                        (x) => x.StatusID === candidate.StatusID,
                    );
                    if (ja_candidatesStatus?.Name) {
                        switch (ja_candidatesStatus.Name.toLowerCase()) {
                            case 'inactive':
                                // candidateDto.disabled = true;
                                candidateDto.isAvailable = false;
                                candidateDto.candidateStatusId =
                                    this.candidateStatusAppType?.appValues?.find(
                                        (x) =>
                                            x.code ===
                                            CandidateStatus.NotSelected,
                                    )?.id;
                                break;
                            case 'placed (perm)':
                                candidateDto.candidateStatusId =
                                    this.candidateStatusAppType?.appValues?.find(
                                        (x) =>
                                            x.code === CandidateStatus.Placed,
                                    )?.id;
                                candidateDto.manuallyCompleted = true;
                                candidateDto.isAvailable = false;
                                mustCreateUser = true;
                                break;
                            case 'placed (contract)':
                                candidateDto.candidateStatusId =
                                    this.candidateStatusAppType?.appValues?.find(
                                        (x) =>
                                            x.code === CandidateStatus.Placed,
                                    )?.id;
                                candidateDto.manuallyCompleted = true;
                                candidateDto.isAvailable = false;
                                mustCreateUser = true;

                                break;
                            case 'registered':
                                candidateDto.candidateStatusId =
                                    this.candidateStatusAppType?.appValues?.find(
                                        (x) =>
                                            x.code ===
                                            CandidateStatus.Referenced,
                                    )?.id;
                                candidateDto.manuallyCompleted = true;
                                candidateDto.isAvailable = true;
                                mustCreateUser = true;

                                break;
                            case 'available':
                                candidateDto.isAvailable = true;
                                candidateDto.candidateStatusId =
                                    this.candidateStatusAppType?.appValues?.find(
                                        (x) =>
                                            x.code ===
                                            CandidateStatus.ToBeReferenced,
                                    )?.id;
                                break;
                            case 'pre-registered':
                                candidateDto.isAvailable = true;
                                candidateDto.candidateStatusId =
                                    this.candidateStatusAppType?.appValues?.find(
                                        (x) =>
                                            x.code ===
                                            CandidateStatus.BeingReferenced,
                                    )?.id;
                                break;
                            case 'placed by us':
                                candidateDto.candidateStatusId =
                                    this.candidateStatusAppType?.appValues?.find(
                                        (x) =>
                                            x.code === CandidateStatus.Placed,
                                    )?.id;
                                candidateDto.manuallyCompleted = true;
                                candidateDto.isAvailable = false;
                                mustCreateUser = true;

                                break;
                        }
                    }
                }
                const saveCandidateResponse =
                    await this.candidateService.createOrUpdate(
                        candidateDto,
                        false,
                        null,
                    );
                const candidateCreated = saveCandidateResponse.candidate;

                if (saveCandidateResponse.success)
                    console.log('candidate created successfully');

                let testMode = true;
                const isProduction = Environment.EnvName === 'production';
                if (isProduction) {
                    testMode = false;
                }
                if (saveCandidateResponse.success && testMode) {
                    const missingList = await this.testJobAdderFilesMissing(
                        connection,
                        candidate.ContactID,
                    );
                    if (missingList.length) {
                        for (const missing of missingList) {
                            await AppLogger.error(
                                'MISSING CANDIDATE FILE : ' +
                                    missing.attachment.AttachmentID +
                                    ' - ' +
                                    missing.localFilePath +
                                    ' - ' +
                                    missing.reason,
                            );
                        }
                    }
                }

                if (
                    saveCandidateResponse.success &&
                    isProduction &&
                    Environment.JobAdderMigrationFiles
                ) {
                    console.log('load attachment');
                    const attachmentsResponse =
                        await this.loadAttachmentAndLinkToCandidate(
                            connection,
                            candidate.ContactID,
                            candidateCreated,
                            this.candidateFileAppType,
                        );
                    if (attachmentsResponse.ignored?.length)
                        response.attachmentsIgnored.push(
                            ...attachmentsResponse.ignored,
                        );

                    if (attachmentsResponse.errors?.length)
                        response.attachmentsErrors.push(
                            ...attachmentsResponse.errors,
                        );
                    const contactPhotos = (await connection.query(
                        'SELECT * FROM ContactPhoto WHERE ContactID =' +
                            candidate.ContactID,
                    )) as JA_Contact_Photo[];
                    // COPY TO SERVER

                    if (contactPhotos?.length) {
                        const candidateDirectory =
                            Environment.CandidatesPublicDirectory;
                        const targetFolder = this.fileService.joinPaths(
                            candidateDirectory,
                            candidateCreated.id,
                        );

                        if (!(await FileHelpers.fileExists(targetFolder)))
                            await FileHelpers.createDirectory(targetFolder);

                        for (const photo of contactPhotos) {
                            if (!photo || !photo.Data) continue;

                            let decodeResponse: { success: boolean };
                            let extension: string;
                            let targetFileNameResized: string;
                            let targetFileResized: string;
                            let targetFileOriginal: string;
                            let targetFileNameOriginal: string;

                            let imageResized = false;
                            try {
                                const base64 = Buffer.from(
                                    photo.Data,
                                    'hex',
                                ).toString('base64');
                                // console.log('import photo 50%');
                                extension = this.getFileExtensionType(
                                    photo.Type,
                                );
                                const photoFileGuid =
                                    MainHelpers.generateGuid();
                                targetFileNameOriginal =
                                    photoFileGuid +
                                    '_original' +
                                    (extension ? '.' + extension : '');
                                targetFileNameResized =
                                    photoFileGuid +
                                    (extension ? '.' + extension : '');

                                targetFileOriginal = this.fileService.joinPaths(
                                    targetFolder,
                                    targetFileNameOriginal,
                                );
                                targetFileResized = this.fileService.joinPaths(
                                    targetFolder,
                                    targetFileNameResized,
                                );
                                decodeResponse = await FileHelpers.base64Decode(
                                    base64,
                                    targetFileOriginal,
                                );

                                await ImageHelpers.resizeImage(
                                    targetFileOriginal,
                                    { width: 1000 },
                                    targetFileResized,
                                );
                                await FileHelpers.removeFile(
                                    targetFileOriginal,
                                );
                                imageResized = true;
                                // console.log('import end success photo for candidate ' + candidateCreated.id);
                                // await AppLogger.log('import end success photo for candidate ' + candidateCreated.id);
                            } catch (resizeImageErr) {
                                await AppLogger.error(
                                    'cannot resize image for contact : ' +
                                        candidate.ContactID,
                                );
                            }
                            try {
                                // console.log(decodeResponse);
                                if (
                                    decodeResponse?.success &&
                                    targetFileOriginal &&
                                    targetFileNameResized
                                ) {
                                    if (!imageResized) {
                                        if (
                                            await FileHelpers.fileExists(
                                                targetFileOriginal,
                                            )
                                        ) {
                                            targetFileResized =
                                                targetFileOriginal;
                                            targetFileNameResized =
                                                targetFileNameOriginal;
                                        } else {
                                            throw new Error(
                                                'unable to upload file to gdrive for contact : ' +
                                                    candidate.ContactID,
                                            );
                                        }
                                    }
                                    // console.log('decode success');
                                    const newFile = new AppFileDto();
                                    newFile.mimeType = 'text/plain';
                                    if (extension)
                                        newFile.mimeType =
                                            FileHelpers.getMimeTypeFromExtension(
                                                extension,
                                            );
                                    newFile.name =
                                        MainHelpers.getFileWithoutExtension(
                                            targetFileNameResized,
                                        );
                                    newFile.physicalName =
                                        targetFileNameResized;
                                    newFile.fileType =
                                        AppFileType.ProfilePicture;

                                    const fileTypeId: string =
                                        this.candidateFileAppType?.appValues?.find(
                                            (y) =>
                                                y.code ===
                                                CandidateFileType.MainPhoto,
                                        )?.id;
                                    // console.log(fileTypeId);
                                    // const fileInfo = await FileHelpers.getFileInfo(targetFileResized);

                                    console.log(
                                        'uploading image photo to gdrive...',
                                    );
                                    await this.candidateService.uploadCandidateFilesToGdrive(
                                        candidateCreated,
                                        targetFileResized,
                                        newFile,
                                        fileTypeId,
                                        'photoFile',
                                        'candidates',
                                        true,
                                    );

                                    await this.candidateService.repository.save(
                                        candidateCreated,
                                    );
                                    console.log(
                                        'uploaded image photo successfull',
                                    );
                                }
                            } catch (uploadImageErr) {
                                await AppLogger.error(
                                    'cannot upload image for contact : ' +
                                        candidate.ContactID,
                                );
                            }
                        }
                    }

                    await this.candidateService.createMandatoryCandidateFilesForCandidate(
                        candidateCreated,
                    );
                }

                if (saveCandidateResponse.success && mustCreateUser) {
                    await this.candidateService.createUserFromCandidate(
                        candidateCreated,
                        { roles: [RolesList.Candidate] } as any,
                        false,
                        true,
                    );
                }
                // console.log("🚀 ~ dataMigration ~ saveCandidateResponse", saveCandidateResponse);
                if (saveCandidateResponse.success) {
                    response.successList.push(candidateDto.jobAdderContactId);
                    currentContactId = candidateDto.jobAdderContactId;
                } else {
                    response.errorsList.push(candidateDto.jobAdderContactId);
                }
                // console.log("🚀 ~ dataMigration ~ candidateEntity", candidateEntity);

                // todo create candidateResume
                // const saveCandidateResumeResponse = await this.candidateResumeService.createOrUpdate(candidateResumeEntity.toDto());
                // console.log("🚀 ~ dataMigration ~ saveCandidateResumeResponse", saveCandidateResumeResponse);
            }
            response.success = response.errorsList.length === 0;

            if (response.success && currentContactId && !importOnlyContactIds) {
                await this.keyValueService.saveKeyValue(
                    'JobAdderLastContactSaved',
                    currentContactId,
                );
            }
        } catch (err) {
            response.handleError(err);
        }

        if (connection) {
            await connection.close();
        }

        await AppLogger.log(
            'Data Migration END',
            response,
            'COUNT SUCCESS : ' + response.successList.length,
            'COUNT FAILED : ' + response.errorsList.length,
            'COUNT IGNORED : ' + response.ignoredList.length,
            'LAST CONTACT ID SAVED : ' + (currentContactId || 'NULL'),
        );

        return response;
    }

    private createWrapper() {
        const wrapper: CandidateApplicationCsvWrapper[] = [
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

    private getCsvValueFromWrapper(
        index: number,
        csvLines: any[][],
        csvHeaders: string[],
        wrapper: CandidateApplicationCsvWrapper[],
        field: string,
    ): string {
        const wrapperItem = wrapper.find((x) => x.field === field);

        if (!wrapperItem) {
            return null;
        }

        for (const column of wrapperItem.columns) {
            if (column.splitCharacter) {
                if (
                    field !== 'firstName' &&
                    field !== 'lastName' &&
                    field !== 'partnerFirstName' &&
                    field !== 'partnerLastName'
                ) {
                    return null;
                }

                for (const columnName of column.columnNames) {
                    const csvHeaderIndex = csvHeaders.findIndex(
                        (x) => x === columnName,
                    );

                    if (
                        csvHeaderIndex !== -1 &&
                        csvHeaders[csvHeaderIndex] &&
                        csvLines[index][csvHeaderIndex]
                    ) {
                        const split: string[] = csvLines[index][
                            csvHeaderIndex
                        ].split(column.splitCharacter);

                        if (!split) {
                            return null;
                        }

                        if (!split[split.length - 1]) {
                            split.splice(split.length - 1, 1);
                        }

                        if (
                            field === 'firstName' ||
                            field === 'partnerFirstName'
                        ) {
                            return split.pop();
                        } else if (
                            field === 'lastName' ||
                            field === 'partnerLastName'
                        ) {
                            return split.slice(0, split.length - 1)?.join(' ');
                        }
                    }
                }
            } else if (column.concat) {
                let rtn = '';

                for (const columnName of column.columnNames) {
                    const csvHeaderIndex = csvHeaders.findIndex(
                        (x) => x === columnName,
                    );

                    if (
                        csvHeaderIndex !== -1 &&
                        csvHeaders[csvHeaderIndex] &&
                        csvLines[index][csvHeaderIndex]
                    ) {
                        rtn += csvLines[index][csvHeaderIndex] + ' ';
                    }
                }

                return rtn;
            } else {
                for (const columnName of column.columnNames) {
                    const csvHeaderIndex = csvHeaders.findIndex(
                        (x) => x === columnName,
                    );

                    if (
                        csvHeaderIndex !== -1 &&
                        csvHeaders[csvHeaderIndex] &&
                        csvLines[index][csvHeaderIndex]
                    ) {
                        return csvLines[index][csvHeaderIndex];
                    }
                }
            }
        }

        return null;
    }

    private parseDateFromCsv(
        dateFromCsv: string,
        forceUsFormat: boolean,
    ): Date {
        if (!dateFromCsv) {
            return null;
        }

        dateFromCsv = MainHelpers.replaceAll(
            dateFromCsv.toString().trim(),
            ' ',
            '',
        );

        if (!dateFromCsv) {
            return null;
        }

        const yearReg = '(\\d{4})';
        const monthReg = '(0[1-9]|1[0-2])';
        const dayReg = '(0[1-9]|1[0-9]|2[0-9]|3[0-1])';

        const regexArray: {
            regex: RegExp;
            dayIndex: number;
            monthIndex: number;
            yearIndex: number;
        }[] = [];

        if (!forceUsFormat) {
            regexArray.push({
                regex: new RegExp(
                    '^' + dayReg + '/' + monthReg + '/' + yearReg + '',
                ),
                dayIndex: 1,
                monthIndex: 2,
                yearIndex: 3,
            });
        }

        regexArray.push({
            regex: new RegExp(
                '^' + monthReg + '/' + dayReg + '/' + yearReg + '',
            ),
            dayIndex: 2,
            monthIndex: 1,
            yearIndex: 3,
        });
        regexArray.push({
            regex: new RegExp(
                '^' + yearReg + '-' + monthReg + '-' + dayReg + '',
            ),
            dayIndex: 3,
            monthIndex: 2,
            yearIndex: 1,
        });

        let parsedDate: Date;

        for (const regexWrapper of regexArray) {
            // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
            const matches = dateFromCsv.match(regexWrapper.regex) as string[];

            if (matches && matches.length >= 4) {
                parsedDate = new Date(
                    parseInt(matches[regexWrapper.yearIndex], 10),
                    parseInt(matches[regexWrapper.monthIndex], 10) - 1,
                    parseInt(matches[regexWrapper.dayIndex], 10),
                );
                break;
            }
        }

        return parsedDate;
    }

    private getAlreadyImportedCandidateApplications(
        candidateApplicationsAlreadyExistsList: CandidateApplicationDto[],
        candidateApplication: CandidateApplicationDto,
        strictDateCompare: boolean,
    ) {
        if (!candidateApplication.creationDate || !candidateApplication.email) {
            return [];
        }
        // if(candidateApplication.jobOfferLinkedRef)
        // return null;
        if (candidateApplication.skills == null) {
            candidateApplication.skills = null;
        }

        if (candidateApplication.jobOfferLinkedRef == null) {
            candidateApplication.jobOfferLinkedRef = null;
        }

        if (strictDateCompare) {
            return candidateApplicationsAlreadyExistsList.filter(
                (x) =>
                    x.creationDate &&
                    x.creationDate.getTime() ===
                        candidateApplication.creationDate.getTime() &&
                    x.firstName === candidateApplication.firstName &&
                    x.lastName === candidateApplication.lastName &&
                    // eslint-disable-next-line eqeqeq
                    x.jobOfferLinkedRef ==
                        candidateApplication.jobOfferLinkedRef &&
                    x.email === candidateApplication.email &&
                    // eslint-disable-next-line eqeqeq
                    x.skills == candidateApplication.skills,
            );
        } else
            return candidateApplicationsAlreadyExistsList.filter(
                (x) =>
                    x.creationDate &&
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
                    // eslint-disable-next-line eqeqeq
                    x.jobOfferLinkedRef ==
                        candidateApplication.jobOfferLinkedRef &&
                    x.email === candidateApplication.email &&
                    // eslint-disable-next-line eqeqeq
                    x.skills == candidateApplication.skills,
            );
    }

    private candidateApplicationAlreadyExists(
        candidateApplicationsAlreadyExistsList: CandidateApplicationDto[],
        candidateApplication: CandidateApplicationDto,
        strictDateCompare: boolean,
    ) {
        return (
            this.getAlreadyImportedCandidateApplications(
                candidateApplicationsAlreadyExistsList,
                candidateApplication,
                strictDateCompare,
            ).length > 0
        );
    }

    private getGenderAppValueId(
        genderCsv: string,
        typeValues: GetAppTypesResponse,
    ) {
        let cGenderId: string = null;

        if (genderCsv) {
            const genderCsvArr = genderCsv.split(' ');

            if (genderCsvArr.length) {
                const lastGenderArr = genderCsvArr.pop();
                if (lastGenderArr) {
                    const lastGenderArrLower = lastGenderArr.toLowerCase();
                    cGenderId = typeValues.appTypes
                        ?.find((y) => y.code === AppTypes.PersonGenderCode)
                        ?.appValues?.find(
                            (x) =>
                                x.label &&
                                x.label.toLowerCase() === lastGenderArrLower,
                        )?.id;
                }
            }
        }

        return cGenderId;
    }

    private async testJobAdderFilesMissing(
        connection: Connection,
        contactID: number,
    ) {
        const missing: {
            attachment: JA_Attachment;
            localFilePath: string;
            reason: string;
        }[] = [];
        const jobAdderAttachmentsResponse =
            await this.getJobAdderAttachmentsForCandidate(
                connection,
                contactID,
            );

        for (const attachment of jobAdderAttachmentsResponse.attachmentsList) {
            if (!attachment) {
                continue;
            }

            const jobAdderPhysicalFileResponse =
                await this.getJobAdderPhysicalFile(attachment);

            // const candidateAttachment = jobAdderAttachmentsResponse.candidateAttachments.find(x => x.AttachmentID === attachment.CandidateAttachmentID);
            // const folder = this.getFolderNameAttachment(attachment.StorageName);
            // // const fileName = attachment.AttachmentID + '.original';
            // const fileName = MainHelpers.getFileNameFromPath(attachment.StorageName);
            // // const extension = MainHelpers.getFileExtension(fileName);

            // const candidateDirectory = Environment.JobAdderAttachmentsFolder;
            // const targetFolder = this.fileService.joinPaths(candidateDirectory, folder);

            // const jobAdderFileLocation = this.fileService.joinPaths(targetFolder, fileName);
            if (!jobAdderPhysicalFileResponse.success) {
                missing.push({
                    attachment: attachment,
                    localFilePath:
                        jobAdderPhysicalFileResponse.jobAdderFileLocation,
                    reason: jobAdderPhysicalFileResponse.error || '',
                });
            }
        }

        return missing;
    }

    private getCandidateApplicationsJobsList(
        lineRefAnnonceStr: string,
        getJobOffersResponse: GetJobOffersResponse,
    ) {
        const jobOfferLinkedwrapperIds: CandidateApplicationJobsDto[] = [];
        let isCandidatureSpontannee = false;

        if (lineRefAnnonceStr) {
            const lineRefAnnonceStrTmp = MainHelpers.replaceAccents(
                lineRefAnnonceStr.toLowerCase(),
            );
            isCandidatureSpontannee = lineRefAnnonceStrTmp.includes(
                'candidature spontanee',
            );

            if (!isCandidatureSpontannee) {
                const jobOfferLinkedId =
                    getJobOffersResponse.jobOffers?.find(
                        (x) =>
                            x.ref &&
                            lineRefAnnonceStr
                                .trim()
                                .toLowerCase()
                                .includes(x.ref.trim().toLowerCase()),
                    )?.id || null;
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

    private getCandidateApplicationFromCsv(
        index: number,
        fileIndex: number,
        lines: string[][],
        csvHeaders: string[],
        wrapper: CandidateApplicationCsvWrapper[],
        regexHrefLink: RegExp,
        getJobOffersResponse: GetJobOffersResponse,
        typeValues: GetAppTypesResponse,
        jobsAppValues: AppValueDto[],
        migrationResponse: DataMigrationCandidateApplicationResponse,
        fieldsTocheckMaxLen: string[],
    ): {
        candidateApplication?: CandidateApplicationDto;
        ignored: boolean;
        mainResumeLink?: string;
        photoLink?: string;
        partnerResumeLink?: string;
    } {
        // console.log('try to get csv values');

        const mainResumeLinkValue = this.getCsvValueFromWrapper(
            index,
            lines,
            csvHeaders,
            wrapper,
            'mainResumeLink',
        );
        // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
        const mainResumeLink = mainResumeLinkValue?.match(regexHrefLink)
            ? mainResumeLinkValue?.match(regexHrefLink)[2]
            : null;

        const photoLinkValue = this.getCsvValueFromWrapper(
            index,
            lines,
            csvHeaders,
            wrapper,
            'photoLink',
        );
        // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
        const photoLink = photoLinkValue?.match(regexHrefLink)
            ? photoLinkValue?.match(regexHrefLink)[2]
            : null;

        const partnerResumeLinkValue = this.getCsvValueFromWrapper(
            index,
            lines,
            csvHeaders,
            wrapper,
            'partnerResumeLink',
        );
        // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
        const partnerResumeLink = partnerResumeLinkValue?.match(regexHrefLink)
            ? partnerResumeLinkValue?.match(regexHrefLink)[2]
            : null;

        const creationDateFromCsv = this.parseDateFromCsv(
            this.getCsvValueFromWrapper(
                index,
                lines,
                csvHeaders,
                wrapper,
                'creationDate',
            ),
            true,
        );

        const birthDateFromCsv = this.parseDateFromCsv(
            this.getCsvValueFromWrapper(
                index,
                lines,
                csvHeaders,
                wrapper,
                'birthDateFromCsv',
            ),
            false,
        );

        const partnerBirthDateFromCsv = this.parseDateFromCsv(
            this.getCsvValueFromWrapper(
                index,
                lines,
                csvHeaders,
                wrapper,
                'partnerBirthDateFromCsv',
            ),
            false,
        );

        const jobLabel = this.getCsvValueFromWrapper(
            index,
            lines,
            csvHeaders,
            wrapper,
            'jobLabel',
        )
            ?.toLowerCase()
            ?.trim();

        let isCandidatureSpontannee = false;

        const lineRefAnnonceStr =
            this.getCsvValueFromWrapper(
                index,
                lines,
                csvHeaders,
                wrapper,
                'lineRefAnnonceStr',
            )?.trim() || '';

        // console.log(' csv values OK 1');

        const getJobOfferLinkedwrapperIds =
            this.getCandidateApplicationsJobsList(
                lineRefAnnonceStr,
                getJobOffersResponse,
            );

        const jobOfferLinkedwrapperIds =
            getJobOfferLinkedwrapperIds.jobOfferLinkedwrapperIds;
        isCandidatureSpontannee =
            getJobOfferLinkedwrapperIds.isCandidatureSpontannee;

        // if (lineRefAnnonceStr) {
        //     const lineRefAnnonceStrTmp = MainHelpers.replaceAccents(lineRefAnnonceStr.toLowerCase());
        //     isCandidatureSpontannee = lineRefAnnonceStrTmp.includes('candidature spontanee');
        //     if (!isCandidatureSpontannee) {
        //         const jobOfferLinkedId = getJobOffersResponse.jobOffers?.find(x => x.ref && lineRefAnnonceStr.trim().toLowerCase().includes(x.ref.trim().toLowerCase()))?.id || null;
        //         if (jobOfferLinkedId)
        //             jobOfferLinkedwrapperIds.push({ jobOfferId: jobOfferLinkedId });
        //     }
        // }

        // console.log('try to get csv values 2');

        const email = this.getCsvValueFromWrapper(
            index,
            lines,
            csvHeaders,
            wrapper,
            'email',
        );

        const genderCsv = this.getCsvValueFromWrapper(
            index,
            lines,
            csvHeaders,
            wrapper,
            'genderId',
        );

        const partnerGenderCsv = this.getCsvValueFromWrapper(
            index,
            lines,
            csvHeaders,
            wrapper,
            'partnerGenderId',
        );

        const relationshipStatusCsv = this.getCsvValueFromWrapper(
            index,
            lines,
            csvHeaders,
            wrapper,
            'relationshipStatusId',
        );
        // console.log(' csv values OK 2');

        // console.log('try to create candidate application');

        const candidateApplication: CandidateApplicationDto = {
            creationDate: creationDateFromCsv || null,
            phone: this.getCsvValueFromWrapper(
                index,
                lines,
                csvHeaders,
                wrapper,
                'phone',
            ),
            email: email?.toLowerCase()?.trim() || null,
            birthDate: birthDateFromCsv || null,
            relationshipStatusId: typeValues.appTypes
                ?.find((y) => y.code === AppTypes.RelationshipStatusCode)
                .appValues?.find((x) => x.label === relationshipStatusCsv)?.id,
            professionId: jobsAppValues?.find(
                (x) =>
                    x.label &&
                    jobLabel &&
                    x.label.toLowerCase().trim() === jobLabel,
            )?.id,
            candidateApplicationJobs: jobOfferLinkedwrapperIds,
            skills: this.getCsvValueFromWrapper(
                index,
                lines,
                csvHeaders,
                wrapper,
                'skills',
            ),
            lastName: this.getCsvValueFromWrapper(
                index,
                lines,
                csvHeaders,
                wrapper,
                'lastName',
            ),
            firstName: this.getCsvValueFromWrapper(
                index,
                lines,
                csvHeaders,
                wrapper,
                'firstName',
            ),
            genderId: this.getGenderAppValueId(genderCsv, typeValues),
            address: {
                lineOne: this.getCsvValueFromWrapper(
                    index,
                    lines,
                    csvHeaders,
                    wrapper,
                    'address',
                ),
            } as AddressDto,
            partnerLastName: this.getCsvValueFromWrapper(
                index,
                lines,
                csvHeaders,
                wrapper,
                'partnerLastName',
            ),
            partnerFirstName: this.getCsvValueFromWrapper(
                index,
                lines,
                csvHeaders,
                wrapper,
                'partnerFirstName',
            ),
            partnerGenderId: this.getGenderAppValueId(
                partnerGenderCsv,
                typeValues,
            ),
            partnerBirthDate: partnerBirthDateFromCsv || null,
            inCouple: this.getCsvValueFromWrapper(
                index,
                lines,
                csvHeaders,
                wrapper,
                'inCouple',
            )
                ? true
                : false,
            phoneSecondary: null,
            spontaneousApplication: isCandidatureSpontannee,
            applyStatusId: typeValues.appTypes
                ?.find((y) => y.code === AppTypes.ApplyStatusCode)
                ?.appValues?.find((x) => x.code === ApplyStatus.ToBeSorted)?.id,
            seen: true,
            jobOfferLinkedRef: lineRefAnnonceStr,
            candidate: undefined,
        };

        if (!candidateApplication) {
            throw new Error('Ignore : when init candidate application');
        }

        if (!candidateApplication.creationDate) {
            console.log('ignoring candidate application : no creation date');
            migrationResponse.ignoredList.push(
                'file index : ' +
                    fileIndex +
                    ' - line ' +
                    index +
                    ' : no creation date',
            );
            index++;

            return { ignored: true };
        }

        // console.log('try to check max len');

        for (const fieldName of fieldsTocheckMaxLen) {
            if (
                candidateApplication[fieldName] &&
                (candidateApplication[fieldName] as string).length > 30
            ) {
                (candidateApplication as any)[fieldName] = (
                    candidateApplication[fieldName] as string
                ).substring(0, 29);
            }
        }

        // console.log('check max len OK');

        return {
            candidateApplication: candidateApplication,
            ignored: false,
            mainResumeLink: mainResumeLink,
            partnerResumeLink: partnerResumeLink,
            photoLink: photoLink,
        };
    }

    async dataMigrationCandidateApplications() {
        const response = new GenericResponse();
        const migrationResponse =
            new DataMigrationCandidateApplicationResponse();

        try {
            // if (!Environment.JobApplicationMigrationDataCsvFile) {
            //     throw new AppErrorWithMessage('You must configure your env.json : JobApplicationMigrationDataCsvFile');
            // }

            // const lastCandidateApplicationsMigrationFileLineIndexStr = await this.keyValueService.getKeyValue('LastCandidateApplicationsMigrationFileLineIndex');
            // const lastCandidateApplicationsMigrationFileIndexStr = await this.keyValueService.getKeyValue('LastCandidateApplicationsMigrationFileIndex');
            // const lastCandidateApplicationsMigrationFileStr = await this.keyValueService.getKeyValue('LastCandidateApplicationsMigrationFile');

            // console.log('reprise migration candidatures - file :  ' + lastCandidateApplicationsMigrationFileStr + ' - file index : ' + lastCandidateApplicationsMigrationFileIndexStr
            //     + ' - line index : ' + lastCandidateApplicationsMigrationFileLineIndexStr);

            // const lastCandidateApplicationsMigrationFileLineIndex = parseInt(lastCandidateApplicationsMigrationFileLineIndexStr, 10);
            // const lastCandidateApplicationsMigrationFileIndex = parseInt(lastCandidateApplicationsMigrationFileIndexStr, 10);

            // const lastApplicationSaved = await this.keyValueService.getKeyValue('JobAdderLastCandidateApplicationSaved');
            // let lastApplicationSavedNumber = 0;
            // if (lastApplicationSaved)
            //     lastApplicationSavedNumber = parseInt(lastApplicationSaved, 10);

            // const getAppTypesResponse = await this.referentialService.getMultipleTypeValues({
            //     appTypesCodes: [AppTypes.CandidateFileType].join(','),
            // });

            // let firstCandidateApplicationID = 1;
            // if (lastApplicationSaved)
            //     firstCandidateApplicationID = (parseInt(lastApplicationSaved, 10) + 1);

            const typeValues =
                await this.referentialService.getMultipleTypeValues({
                    appTypesCodes: [
                        AppTypes.RelationshipStatusCode,
                        AppTypes.JobCategoryCode,
                        AppTypes.JobNannyCategoryCode,
                        AppTypes.JobYachtingCategoryCode,
                        AppTypes.PersonGenderCode,
                        AppTypes.ApplyStatusCode,
                    ].join(','),
                });

            const candidateApplicationsAlreadyExistsListEntities =
                await this.candidateApplicationService.getRepository().find({
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
            const candidateApplicationsAlreadyExistsList =
                candidateApplicationsAlreadyExistsListEntities.map((x) =>
                    x.toDto(),
                );

            await AppLogger.log(
                'data migration candidate applications - already exist count :' +
                    candidateApplicationsAlreadyExistsList.length,
            );

            const getJobOffersResponse = await this.jobOfferService.findAll({
                where: { disabled: false },
            });

            const jobsTypes = typeValues.appTypes.filter(
                (x) =>
                    x.code === AppTypes.JobCategoryCode ||
                    x.code === AppTypes.JobNannyCategoryCode ||
                    x.code === AppTypes.JobYachtingCategoryCode,
            );

            const jobsAppValues = new List(jobsTypes)
                .SelectMany((x) => new List(x.appValues))
                .ToArray();

            const regexHrefLink = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/;

            // const jobApplicationsToImport = 10;
            // let imported = 0;

            const wrapper = this.createWrapper();

            const importDataFolderPath = path.join(
                Environment.ApiBasePath,
                'import-data',
            );
            const filesInFolder = await FileHelpers.getFilesInFolder(
                importDataFolderPath,
                { returnFullPath: true },
            );

            let linesToImportTotal = 0;
            let fileIndex = 0;

            for (const filePath of filesInFolder) {
                if (!filePath.endsWith('.csv')) {
                    continue;
                }

                let index = 1;
                const csvFileContent = (await FileHelpers.readFile(
                    filePath,
                    true,
                )) as string;
                const lines = CSVHelpers.parseCSV(csvFileContent) as any[][];
                const csvHeaders = lines[0];

                lines[0] = null;

                const linesToImportForFile = lines.length - 1;

                migrationResponse.linesPerFile.push({
                    fileName: filePath,
                    lines: linesToImportForFile,
                });
                console.log(
                    'Importation fichier ' + filePath + ' - lignes : ',
                    linesToImportForFile,
                );
                linesToImportTotal += linesToImportForFile;
                const fieldsTocheckMaxLen: (keyof CandidateApplicationDto)[] = [
                    'firstName',
                    'lastName',
                    'partnerFirstName',
                    'partnerLastName',
                    'phone',
                    'phoneSecondary',
                ];

                if (fileIndex >= 1) {
                    //TODO : remove
                    // break;
                }

                for (const line of lines) {
                    if (line == null) {
                        continue;
                    }

                    // if (index < lastApplicationSavedNumber) {
                    //     index++
                    //     continue;
                    // }
                    if (index >= 2) {
                        //TODO : remove
                        // break;
                    }

                    // if (fileIndex < lastCandidateApplicationsMigrationFileIndex) {
                    //     console.log('ignoring fileIndex ' + fileIndex + ' - file : ' + lastCandidateApplicationsMigrationFileStr + ' - index : ' + index);
                    //     continue;
                    // }
                    // if (fileIndex === lastCandidateApplicationsMigrationFileIndex && index <= lastCandidateApplicationsMigrationFileLineIndex) {
                    //     continue;
                    // }
                    console.log(
                        'reprise candidatures - import index ' +
                            index +
                            ' of file ' +
                            fileIndex +
                            ' - path : ' +
                            filePath,
                    );
                    // if (imported >= jobApplicationsToImport) {
                    //     console.log('\x1b[36m%s\x1b[0m', 'MAX IMPORT SIZE !', lastApplicationSaved);
                    //     break;
                    // }

                    try {
                        const candidateApplicationFromCsv =
                            this.getCandidateApplicationFromCsv(
                                index,
                                fileIndex,
                                lines,
                                csvHeaders,
                                wrapper,
                                regexHrefLink,
                                getJobOffersResponse,
                                typeValues,
                                jobsAppValues,
                                migrationResponse,
                                fieldsTocheckMaxLen,
                            );

                        if (
                            candidateApplicationFromCsv.ignored ||
                            !candidateApplicationFromCsv.candidateApplication
                        ) {
                            index++;
                            continue;
                        }

                        let candidateApplication =
                            candidateApplicationFromCsv.candidateApplication;
                        // if (candidateApplication.creationDate.getFullYear() === 2022 &&
                        //     candidateApplication.creationDate.getMonth() === 11
                        //     && candidateApplication.creationDate.getDate() === 3) {
                        //     break;
                        // }

                        if (
                            this.candidateApplicationAlreadyExists(
                                candidateApplicationsAlreadyExistsList,
                                candidateApplication,
                                true,
                            )
                        ) {
                            console.log(
                                'ignore candidate application already exists : ' +
                                    candidateApplication.jobOfferLinkedRef,
                            );
                            index++;
                            continue;
                        }

                        // if (true) {
                        //     await this.keyValueService.saveKeyValue('LastCandidateApplicationsMigrationFile', filePath);
                        //     await this.keyValueService.saveKeyValue('LastCandidateApplicationsMigrationFileIndex', fileIndex);
                        //     await this.keyValueService.saveKeyValue('LastCandidateApplicationsMigrationFileLineIndex', index);
                        //     return migrationResponse;
                        // }

                        if (candidateApplication.email) {
                            console.log(
                                'try to find candidate with email : ' +
                                    candidateApplication.email,
                            );
                            const candidateResponse =
                                await this.candidateService.findOne({
                                    where: {
                                        email: candidateApplication.email,
                                    },
                                });
                            console.log(
                                'candidate with email : ' +
                                    (candidateResponse.candidate?.id ||
                                        '[not found]'),
                            );

                            if (
                                candidateResponse.success &&
                                candidateResponse.candidate?.id
                            ) {
                                candidateApplication.candidateId =
                                    candidateResponse.candidate.id;
                            }
                        }

                        console.log('try to save candidate application...');
                        const candidateApplicationResponse =
                            await this.candidateApplicationService.createOrUpdate(
                                candidateApplication,
                            );
                        console.log('save candidate application OK');

                        if (!candidateApplicationResponse.success) {
                            throw new Error(
                                'Error : when create candidate application',
                            );
                        }

                        candidateApplication =
                            candidateApplicationResponse.candidateApplication;

                        const links: {
                            link: string;
                            fileType: CandidateApplicationFileType;
                        }[] = [];

                        if (
                            Environment.CandidateApplicationsMigrationCsvFiles
                        ) {
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
                                console.log(
                                    'will handle ' +
                                        linkWrapper.fileType +
                                        ' file ' +
                                        linkWrapper.link,
                                );

                                const candidateApplicationFolder: string =
                                    linkWrapper.fileType === 'photoFile'
                                        ? Environment.CandidateApplicationsPublicDirectory
                                        : Environment.CandidateApplicationsDirectory;
                                const targetFolder = this.fileService.joinPaths(
                                    candidateApplicationFolder,
                                    candidateApplication.id,
                                );
                                if (
                                    !(await FileHelpers.fileExists(
                                        targetFolder,
                                    ))
                                ) {
                                    await FileHelpers.createDirectory(
                                        targetFolder,
                                    );
                                }

                                const extension =
                                    MainHelpers.getFileExtensionFromPath(
                                        linkWrapper.link,
                                    );
                                const fileNameFromUrl =
                                    MainHelpers.getFileNameFromPath(
                                        linkWrapper.link,
                                    );

                                const fileGuid = MainHelpers.generateGuid();
                                const targetFileNameResized =
                                    fileGuid +
                                    (extension ? '.' + extension : '');
                                const targetFileNameOriginal =
                                    fileGuid +
                                    '_original' +
                                    (extension ? '.' + extension : '');

                                const targetFileResized =
                                    this.fileService.joinPaths(
                                        targetFolder,
                                        targetFileNameResized,
                                    );
                                const targetFileOriginal =
                                    this.fileService.joinPaths(
                                        targetFolder,
                                        targetFileNameOriginal,
                                    );

                                console.log(
                                    'before download file',
                                    targetFileNameResized,
                                    extension,
                                );

                                const httpClient = new NextalysNodeHttpClient();
                                // console.log('downloading file...', linkWrapper.link, ' ', 'index : ' + index);
                                const downloadResponse =
                                    await httpClient.downloadFile(
                                        linkWrapper.link,
                                        targetFileOriginal,
                                        false,
                                        20000,
                                    );

                                if (downloadResponse.success) {
                                    console.log('file downloaded');

                                    let fileMimeType: string = 'text/plain';

                                    if (extension) {
                                        fileMimeType =
                                            FileHelpers.getMimeTypeFromExtension(
                                                extension,
                                            );
                                    }

                                    console.log('file mime 1 :' + fileMimeType);

                                    if (
                                        fileMimeType &&
                                        fileMimeType.includes('image')
                                    ) {
                                        let imageResized = false;

                                        try {
                                            await ImageHelpers.resizeImage(
                                                targetFileOriginal,
                                                { width: 900 },
                                                targetFileResized,
                                            );
                                            await FileHelpers.removeFile(
                                                targetFileOriginal,
                                            );
                                            imageResized = true;
                                        } catch (imgResizeErr) {}

                                        if (!imageResized) {
                                            await FileHelpers.renameFile(
                                                targetFileOriginal,
                                                targetFileResized,
                                            );
                                        }
                                    } else {
                                        await FileHelpers.renameFile(
                                            targetFileOriginal,
                                            targetFileResized,
                                        );
                                    }

                                    if (!fileMimeType) {
                                        fileMimeType = 'text/plain';
                                    }

                                    console.log(
                                        'file mime  2 :' + fileMimeType,
                                    );

                                    // console.log(downloadResponse);
                                    const newFile = new AppFileDto();

                                    if (fileMimeType) {
                                        newFile.mimeType = fileMimeType;
                                    }

                                    newFile.name = fileNameFromUrl;
                                    const fileInfo =
                                        await FileHelpers.getFileInfo(
                                            targetFileResized,
                                        );
                                    newFile.size = fileInfo.data.size;
                                    newFile.physicalName =
                                        targetFileNameResized;
                                    // candidateApplicationResponse.candidateApplication.mainResumeFile.physicalName = targetFile;
                                    // console.log('uploading to gdrive...');
                                    const uploadResponse =
                                        await this.candidateService.uploadCandidateFilesToGdrive(
                                            candidateApplication,
                                            targetFileResized,
                                            newFile,
                                            null,
                                            linkWrapper.fileType,
                                            'candidate-applications',
                                            true,
                                        );

                                    if (uploadResponse.success) {
                                        if (!uploadResponse.file) {
                                            throw new Error(
                                                'warning : file upload to Gdrive failed for candidate application: ' +
                                                    candidateApplication.lastName,
                                            );
                                        }

                                        console.log('upload to gcloud SUCCESS');

                                        //todo : remove true : true ||
                                        if (
                                            candidateApplication.creationDate &&
                                            candidateApplication.creationDate.getFullYear() <=
                                                2020
                                        ) {
                                            console.log(
                                                'removing old file : ' +
                                                    targetFileResized +
                                                    ' - ' +
                                                    newFile.id,
                                            );
                                            await FileHelpers.removeFile(
                                                targetFileResized,
                                            );
                                            console.log(
                                                'file removed with success',
                                            );
                                            newFile.physicalName = null;
                                            migrationResponse.bytesIgnored +=
                                                newFile.size;
                                        } else {
                                            migrationResponse.bytesAdded +=
                                                newFile.size;
                                        }
                                    } else {
                                        console.log('file NOT UPLOADED');
                                        throw new Error(
                                            'warning : upload gcloud error : ' +
                                                (uploadResponse.error?.toString() ||
                                                    ''),
                                        );
                                    }
                                } else {
                                    console.log('file NOT downloaded');
                                    throw new Error(
                                        'warning : file download failed for candidate application: ' +
                                            candidateApplication.lastName,
                                    );
                                }
                                // console.log('download success');
                            }

                            console.log('end uploading files');
                        }

                        if (links.length) {
                            console.log('try to save after upload files...');

                            const saveCandidateApplicationResponse =
                                await this.candidateApplicationService.createOrUpdate(
                                    candidateApplication,
                                );

                            console.log(
                                'save after upload files : ' +
                                    saveCandidateApplicationResponse.success,
                            );
                            // if (saveCandidateApplicationResponse.success) {
                            //     currentCandidateApplicationFirstname = candidateApplication.firstName;
                            //     currentCandidateApplicationMail = candidateApplication.email;
                            // }
                        }

                        migrationResponse.successList.push(
                            candidateApplication.id,
                        );

                        // await this.keyValueService.saveKeyValue('LastCandidateApplicationsMigrationFile', filePath);
                        // await this.keyValueService.saveKeyValue('LastCandidateApplicationsMigrationFileIndex', fileIndex);
                        // await this.keyValueService.saveKeyValue('LastCandidateApplicationsMigrationFileLineIndex', index);

                        // console.log('candidate application ' + index + ' set correctly');
                    } catch (lineErr) {
                        console.log('not treated : ' + lineErr);

                        if (lineErr.message.indexOf('Ignore :') !== -1) {
                            console.warn('warning : ' + lineErr);
                            migrationResponse.ignoredList.push(
                                'file index : ' +
                                    fileIndex +
                                    ' - line ' +
                                    index +
                                    ' : ' +
                                    lineErr.message,
                            );
                        } else {
                            console.error('error : ' + lineErr);
                            migrationResponse.errorsList.push(
                                'file index : ' +
                                    fileIndex +
                                    ' - line ' +
                                    index +
                                    ' : ' +
                                    lineErr.message,
                            );
                        }
                    }
                    // imported++;
                    index++;
                }

                fileIndex++;
            }

            const responseMessage =
                'DATA Migration canidate applications finished ! Total lignes : ' +
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
            await FileHelpers.writeFile(
                FileHelpers.joinPaths(
                    Environment.PublicFolder,
                    'migration-response_' + new Date().toISOString() + '.json',
                ),
                JSON.stringify(migrationResponse),
            );
        } catch (err) {
            console.error(err);
            response.handleError(err);
        }

        return response;
    }

    private async getJobAdderPhysicalFile(attachment: JA_Attachment) {
        const response: {
            success: boolean;
            error?: string;
            fileName?: string;
            extension?: string;
            jobAdderFileLocation?: string;
            fileInfo?: { data?: { size?: number } };
        } = { success: false };
        let fileName = MainHelpers.getFileNameFromPath(attachment.StorageName);
        const jobAdderFolder = this.fileService.joinPaths(
            Environment.JobAdderAttachmentsFolder,
            this.getFolderNameAttachment(attachment.StorageName),
        );
        let extension = MainHelpers.getFileExtension(fileName);
        let jobAdderFileLocation = this.fileService.joinPaths(
            jobAdderFolder,
            fileName,
        );
        let fileInfo = await FileHelpers.getFileInfo(jobAdderFileLocation);

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
                } else {
                    extension = extension.toUpperCase();
                    fileName =
                        MainHelpers.getFileWithoutExtension(fileName) +
                        '.' +
                        extension;
                }
                jobAdderFileLocation = this.fileService.joinPaths(
                    jobAdderFolder,
                    fileName,
                );
                fileInfo = await FileHelpers.getFileInfo(jobAdderFileLocation);
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
    }

    private async getAppFileFromJobAdderAttachment(
        attachment: JA_Attachment,
    ): Promise<{
        success: boolean;
        file?: AppFileDto;
        jobAdderFileLocation?: string;
        error?: string;
    }> {
        const response = {
            success: false,
            file: null,
            jobAdderFileLocation: null,
            error: null,
        };
        // const folder = this.getFolderNameAttachment(attachment.StorageName);
        // const fileName = attachment.AttachmentID + '.original';
        // let fileName = MainHelpers.getFileNameFromPath(attachment.StorageName);
        // const extension = MainHelpers.getFileExtension(fileName);

        // const candidateDirectory = Environment.JobAdderAttachmentsFolder;
        const jobAdderPhysicalFileResponse = await this.getJobAdderPhysicalFile(
            attachment,
        );

        if (!jobAdderPhysicalFileResponse.success) {
            return jobAdderPhysicalFileResponse;
        }

        // let jobAdderFileLocation = this.fileService.joinPaths(targetFolder, fileName);
        // let fileInfo = await FileHelpers.getFileInfo(jobAdderFileLocation);
        // if (!fileInfo.success) {
        //     fileName = MainHelpers.getFileWithoutExtension(fileName) + '.' + extension.toUpperCase();
        //     jobAdderFileLocation = this.fileService.joinPaths(targetFolder, fileName);
        //     fileInfo = await FileHelpers.getFileInfo(jobAdderFileLocation);
        //     if (!fileInfo.success) {
        //         response.error = 'The file cannot be found : ' + jobAdderFileLocation;
        //         return response;
        //     }
        // }
        response.jobAdderFileLocation =
            jobAdderPhysicalFileResponse.jobAdderFileLocation;
        let extension = jobAdderPhysicalFileResponse.extension;

        if (!extension) {
            extension = 'txt';
        }

        const targetFileName = MainHelpers.generateGuid() + '.' + extension;
        const newFile = new AppFileDto();
        newFile.mimeType = 'text/plain';
        let attachmentFileName = attachment.FileName;
        // if (jobAdderPhysicalFileResponse.extension) {
        newFile.mimeType = FileHelpers.getMimeTypeFromExtension(extension);

        if (!newFile.mimeType) {
            newFile.mimeType = attachment.FileType;
        }

        if (!newFile.mimeType) {
            newFile.mimeType = 'text/plain';
        }

        if (newFile.mimeType) {
            attachmentFileName = attachmentFileName.substring(
                0,
                attachmentFileName.lastIndexOf(extension) - 1,
            );
        }
        // }
        // console.log('build file...')
        newFile.name = attachmentFileName;
        newFile.physicalName = jobAdderPhysicalFileResponse.fileName;
        newFile.size = jobAdderPhysicalFileResponse.fileInfo?.data?.size;
        newFile.physicalName = targetFileName;

        response.file = newFile;
        response.success = true;

        return response;
    }

    private async getJobAdderAttachmentsForCandidate(
        connection: Connection,
        contactID: number,
    ) {
        if (!contactID || !connection) {
            return;
        }

        const attachmentsResponse: { ignored: number[]; success: number[] } = {
            ignored: [],
            success: [],
        };
        const candidateAttachments: JA_Candidate_Attachment[] =
            await connection.query(
                `SELECT * FROM  CandidateAttachment WHERE ContactID=${contactID}`,
            );
        const contactAttachments: JA_Contact_Attachment[] =
            await connection.query(
                `SELECT * FROM  ContactAttachment WHERE ContactID=${contactID}`,
            );

        // if (contactAttachments.length > 0) {
        //     const tst = "";
        // }

        const allContactAttachments = [
            ...candidateAttachments,
            ...contactAttachments,
        ];
        // const attachmentIds = candidateAttachments.map(x => x.AttachmentID);
        const allContactAttachmentsIds = new List(
            allContactAttachments.map((x) => x.AttachmentID),
        )
            .Distinct()
            .ToArray();
        const candidateAttachmentsIds = new List(
            candidateAttachments.map((x) => x.AttachmentID),
        )
            .Distinct()
            .ToArray();
        const contactAttachmentsIds = new List(
            contactAttachments.map((x) => x.AttachmentID),
        )
            .Distinct()
            .ToArray();
        const attachmentsList: JA_Attachment[] = [];

        if (contactAttachmentsIds.length) {
            const contactAttachmentsList: JA_Attachment[] =
                await connection.query(
                    `SELECT * FROM Attachment WHERE AttachmentID IN (${contactAttachmentsIds.join(
                        ',',
                    )});`,
                );
            attachmentsList.push(...contactAttachmentsList);
        }

        if (candidateAttachmentsIds.length) {
            const candidateAttachmentsList: JA_Attachment[] =
                await connection.query(
                    `SELECT * FROM Attachment WHERE CandidateAttachmentID IN (${candidateAttachmentsIds.join(
                        ',',
                    )});`,
                );
            attachmentsList.push(...candidateAttachmentsList);
        }

        return {
            attachmentsList: attachmentsList,
            candidateAttachments: candidateAttachments,
        };
    }

    private async loadAttachmentAndLinkToCandidate(
        connection: Connection,
        contactID: number,
        candidate: CandidateDto,
        candidateFileType: AppTypeDto,
    ) {
        if (!contactID || !connection) {
            return;
        }

        const attachmentsResponse: {
            ignored: number[];
            ignoredReasons: string[];
            success: number[];
            errors: number[];
        } = { ignored: [], ignoredReasons: [], success: [], errors: [] };
        const jobAdderAttachmentsResponse =
            await this.getJobAdderAttachmentsForCandidate(
                connection,
                contactID,
            );

        // console.log('select candidate attachment id...')

        let resumeHasBeenImported = false;
        for (const attachment of jobAdderAttachmentsResponse.attachmentsList) {
            if (!attachment) {
                continue;
            }

            const candidateAttachment =
                jobAdderAttachmentsResponse.candidateAttachments.find(
                    (x) => x.AttachmentID === attachment.CandidateAttachmentID,
                );
            const getFileResponse = await this.getAppFileFromJobAdderAttachment(
                attachment,
            );

            if (!getFileResponse.success) {
                console.error(
                    'getAppFileFromJobAdderAttachment error',
                    getFileResponse.error,
                );
                attachmentsResponse.ignored.push(attachment.AttachmentID);
                attachmentsResponse.ignoredReasons.push(getFileResponse.error);
                continue;
            }

            const mainResumeFileTypeId = candidateFileType.appValues?.find(
                (y) => y.code === CandidateFileType.MainResume,
            )?.id;
            const lettersOfReferenceFileTypeId =
                candidateFileType.appValues?.find(
                    (y) =>
                        y.code ===
                        CandidateFileType.LastThreeLettersOfReference,
                )?.id;
            const otherFileTypeId = candidateFileType.appValues?.find(
                (y) => y.code === CandidateFileType.Other,
            )?.id;
            const licenseFileTypeId = candidateFileType.appValues?.find(
                (y) => y.code === CandidateFileType.CarLicence,
            )?.id;
            const passportTypeId = candidateFileType.appValues?.find(
                (y) => y.code === CandidateFileType.Passport,
            )?.id;
            const identityTypeId = candidateFileType.appValues?.find(
                (y) => y.code === CandidateFileType.IdentityCard,
            )?.id;
            const criminalRecordTypeId = candidateFileType.appValues?.find(
                (y) => y.code === CandidateFileType.CriminalRecord,
            )?.id;
            const workCertificateTypeId = candidateFileType.appValues?.find(
                (y) => y.code === CandidateFileType.LastThreeWorkCertificates,
            )?.id;
            const variousDiplomaTypeId = candidateFileType.appValues?.find(
                (y) => y.code === CandidateFileType.VariousDiploma,
            )?.id;

            let fileTypeId: string;

            if (candidateAttachment) {
                switch (candidateAttachment.Type) {
                    case 'FormattedResume':
                    case 'Resume':
                        fileTypeId = mainResumeFileTypeId;
                        if (resumeHasBeenImported) {
                            //plusieurs CV => autres
                            fileTypeId = otherFileTypeId;
                        }
                        break;
                    case 'Reference':
                        fileTypeId = lettersOfReferenceFileTypeId;
                        break;
                    case 'License':
                        fileTypeId = licenseFileTypeId;
                        break;
                    // case 'CoverLetter':
                    //     fileTypeId = lettersOfReferenceFileTypeId;
                    //     break;

                    default:
                        fileTypeId = otherFileTypeId;
                        break;
                }
            }

            if (
                fileTypeId === otherFileTypeId &&
                candidateAttachment.FileName
            ) {
                //todo : tester cette partie
                const candidateAttachmentFileName =
                    candidateAttachment.FileName.toLowerCase();

                if (
                    candidateAttachmentFileName.indexOf('driving licence') !==
                        -1 ||
                    candidateAttachmentFileName.indexOf('driving-licence') !==
                        -1
                ) {
                    fileTypeId = licenseFileTypeId;
                    console.log('found license ', candidateAttachment.FileName);
                }

                if (
                    this.searchWordInFileName(
                        candidateAttachmentFileName,
                        'resume',
                    )
                ) {
                    fileTypeId = mainResumeFileTypeId;

                    if (resumeHasBeenImported) {
                        //plusieurs CV => autres
                        fileTypeId = otherFileTypeId;
                    }

                    console.log('found resume ', candidateAttachment.FileName);
                }

                if (
                    candidateAttachmentFileName.indexOf(
                        'recommendation letter',
                    ) !== -1 ||
                    candidateAttachmentFileName.indexOf('ref letter') !== -1 ||
                    this.searchWordInFileName(
                        candidateAttachmentFileName,
                        'reference',
                    )
                ) {
                    fileTypeId = lettersOfReferenceFileTypeId;
                    console.log(
                        'found ref letter ',
                        candidateAttachment.FileName,
                    );
                }

                if (
                    candidateAttachmentFileName.indexOf('work certificate') !==
                        -1 ||
                    candidateAttachmentFileName.indexOf('work contract') !== -1
                ) {
                    fileTypeId = workCertificateTypeId;
                    console.log(
                        'found work certificate ',
                        candidateAttachment.FileName,
                    );
                }

                if (
                    candidateAttachmentFileName.indexOf(
                        'training certificate',
                    ) !== -1
                ) {
                    fileTypeId = variousDiplomaTypeId;
                    console.log(
                        'found various diploma ',
                        candidateAttachment.FileName,
                    );
                }

                if (candidateAttachmentFileName.indexOf('passeport') !== -1) {
                    fileTypeId = passportTypeId;
                    console.log(
                        'found passeport ',
                        candidateAttachment.FileName,
                    );
                }

                if (
                    candidateAttachmentFileName.indexOf('criminal record') !==
                        -1 ||
                    candidateAttachmentFileName.indexOf('criminalrecord') !== -1
                ) {
                    fileTypeId = criminalRecordTypeId;
                    console.log(
                        'found criminal record ',
                        candidateAttachment.FileName,
                    );
                }

                if (
                    this.searchWordInFileName(
                        candidateAttachmentFileName,
                        'id',
                    ) ||
                    this.searchWordInFileName(
                        candidateAttachmentFileName,
                        'cni',
                    )
                ) {
                    fileTypeId = identityTypeId;
                    console.log(
                        'found identity ',
                        candidateAttachment.FileName,
                    );
                }

                if (fileTypeId === otherFileTypeId) {
                    console.log('type could not be found');
                }
            }

            if (!fileTypeId) {
                attachmentsResponse.ignored.push(attachment.AttachmentID);
                continue;
            }

            console.log(
                'uploading attachment to gdrive for candidate ' +
                    candidate.id +
                    '...',
            );
            // await AppLogger.log('uploading attachment to gdrive for candidate ' + candidate.id + '...');
            const uploadResponse =
                await this.candidateService.uploadCandidateFilesToGdrive(
                    candidate,
                    getFileResponse.jobAdderFileLocation,
                    getFileResponse.file,
                    fileTypeId,
                    null,
                    'candidates',
                    true,
                );

            if (uploadResponse.success) {
                uploadResponse.newCandidateFileDto.isMandatory = true;
                await this.candidateService.repository.save(candidate);
                console.log('uploaded successfully');
                if (fileTypeId === mainResumeFileTypeId) {
                    resumeHasBeenImported = true;
                }
            } else {
                attachmentsResponse.errors.push(attachment.AttachmentID);
            }
        }

        return attachmentsResponse;
    }
    private searchWordInFileName(
        fileName: string,
        word: string,
        separators?: string[],
    ) {
        if (!separators?.length) {
            separators = ['.', '_'];
        }

        for (const separator of separators) {
            if (
                fileName.indexOf(' ' + word + separator) !== -1 ||
                fileName.startsWith(word + separator) ||
                fileName.indexOf(' ' + word + ' ') !== -1 ||
                fileName.startsWith(word + ' ')
            ) {
                return true;
            }
        }

        return false;
    }

    private getFileExtensionType(fileType: string) {
        if (fileType.indexOf('png') !== -1) {
            return 'png';
        } else if (fileType.indexOf('jpeg') !== -1) {
            return 'jpeg';
        } else if (fileType.indexOf('jpg') !== -1) {
            return 'jpg';
        }
    }

    private getFolderNameAttachment(filePath: string): string {
        if (!filePath) {
            return null;
        }

        return filePath.substring(0, 7)?.replace('/', '');
    }

    private getExtensionAttachment(filePath: string): string {
        if (!filePath) {
            return;
        }

        const lastIndexStart = filePath.lastIndexOf('.') + 1;
        const lastIndexEnd = filePath.lastIndexOf(filePath.slice(-1)) + 1;

        return filePath.substring(lastIndexStart, lastIndexEnd);
    }

    async sendMailAfterMigration() {
        // const usersResponse = await this.usersService.findAll({ where: { jobAdderContactId: Not(IsNull()), mailSentAfterMigration: false } });
        const response = new GenericResponse();
        await AppLogger.log('sendMailAfterMigration BEGIN');

        try {
            await this.initAppTypesForMigration();
            const statusList = this.candidateStatusAppType?.appValues
                ?.filter(
                    (x) =>
                        x.code === CandidateStatus.Referenced ||
                        x.code === CandidateStatus.Placed,
                )
                ?.map((x) => x.id);

            const candidatesCount = 70;
            const candidatesList = await this.candidateService
                .getRepository()
                .find({
                    where: {
                        jobAdderContactId: Not(IsNull()),
                        mailSentAfterMigration: false,
                        email: Not(IsNull()),
                        candidateStatusId: In(statusList),
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
                    await AppLogger.log(
                        'sendMailAfterMigration - ignoring candidate : no associated user',
                    );
                    await this.candidateService
                        .getRepository()
                        .update(
                            { id: candidate.id },
                            { mailSentAfterMigration: true },
                        );
                    continue;
                }

                if (!candidate.email) {
                    await AppLogger.log(
                        'sendMailAfterMigration - ignoring candidate : no email',
                    );
                    await this.candidateService
                        .getRepository()
                        .update(
                            { id: candidate.id },
                            { mailSentAfterMigration: true },
                        );
                    continue;
                }

                if (!candidate.jobAdderContactId) {
                    await AppLogger.log(
                        'sendMailAfterMigration - ignoring candidate : no jobAdderContactId',
                    );
                    await this.candidateService
                        .getRepository()
                        .update(
                            { id: candidate.id },
                            { mailSentAfterMigration: true },
                        );
                    continue;
                }

                if (candidate.mailSentAfterMigration) {
                    await AppLogger.log(
                        'sendMailAfterMigration - ignoring candidate : mailSentAfterMigration',
                    );
                    continue;
                }

                const candidateDto = candidate.toDto();
                const userResponse =
                    await this.candidateService.sendEmailAccessToCandidate(
                        candidateDto.associatedUser,
                        candidateDto,
                        'NewAccountAfterJobAdderMigration',
                    );

                if (userResponse.success) {
                    mailsSent++;
                    candidate.mailSentAfterMigration = true;
                    await this.candidateService
                        .getRepository()
                        .update(
                            { id: candidate.id },
                            { mailSentAfterMigration: true },
                        );
                } else {
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
        } catch (err) {
            response.handleError(err);
        }

        await AppLogger.log('sendMailAfterMigration END');

        return response;
    }

    private async migrateCandidateJobs(
        connection: Connection,
        contactId: number,
        candidateDto: CandidateDto,
    ) {
        const jobsForContact = (await connection.query(
            'SELECT * FROM CandidateCustomField WHERE FieldID = 7 AND ContactID=' +
                contactId,
        )) as { Value: string; ValueText: string }[];

        // const employments = await connection.query('SELECT * FROM CandidateEmploymentHistory WHERE ContactID = ' + contactId) as JA_CandidateEmploymentHistory[];
        // let jobsList: CandidateJobDto[] = [];
        // if (!!candidateDto?.candidateJobs?.length)
        //     jobsList = candidateDto.candidateJobs;

        // let jobsList: CandidateCurrentJobDto[] = [];
        // if (!!candidateDto?.candidateCurrentJobs?.length)
        //     jobsList = candidateDto.candidateCurrentJobs;
        const jobAssociationKeys = Object.keys(JobsAssociationCRM);
        const jobsResponse: {
            ignoredJobs: string[];
            handledJobs: { initialJobName: string; jobAppValue: AppValueDto }[];
        } = { ignoredJobs: [], handledJobs: [] };

        if (!candidateDto?.candidateCurrentJobs?.length) {
            candidateDto.candidateCurrentJobs = [];
        }

        for (const jobForContact of jobsForContact) {
            let jobStr = jobForContact?.ValueText;

            if (!jobStr) {
                jobStr = jobForContact?.Value;
                continue;
            }

            const keyFound = jobAssociationKeys.find(
                (x) =>
                    x &&
                    jobStr &&
                    x.trim().toLowerCase() === jobStr.trim().toLowerCase(),
            );

            if (!keyFound || !JobsAssociationCRM[keyFound]) {
                jobsResponse.ignoredJobs.push(jobStr);
                continue;
            }
            // const jobFound = this.jobsRegexList.find(x => x.appValueId && x.regexList?.length && jobStr &&
            //     x.regexList.some(y => !!jobStr.match(y))
            // )
            // if (!jobFound?.appValueId) {
            //     jobsResponse.ignoredJobs.push(jobStr);
            //     continue;
            // }
            const jobCode = JobsAssociationCRM[keyFound] as string;

            if (!jobCode) {
                jobsResponse.ignoredJobs.push(jobStr);
                continue;
            }

            const jobAppValue = this.jobsAppValuesFullList.find(
                (x) => x.code.trim() === jobCode.trim(),
            );

            if (!jobAppValue) {
                jobsResponse.ignoredJobs.push(jobStr);
                continue;
            }

            const candidateJobLinkDto = new CandidateCurrentJobDto();
            candidateJobLinkDto.currentJobId = jobAppValue.id;
            candidateJobLinkDto.candidateId = candidateDto.id;

            if (
                !candidateDto.candidateCurrentJobs.some(
                    (x) => x.currentJobId === candidateJobLinkDto.currentJobId,
                )
            ) {
                candidateDto.candidateCurrentJobs.push(candidateJobLinkDto);
            }

            jobsResponse.handledJobs.push({
                initialJobName: jobStr,
                jobAppValue: jobAppValue,
            });

            // jobsList.push(candidateJobLinkDto);

            // if (!jobFound?.appValueId)
            //     continue;

            // const candidateJob: CandidateJobDto = {};
            // candidateJob.jobId = jobFound?.appValueId || null;
            // candidateJob.experienceStartDate = employment.StartDate || null;
            // candidateJob.experienceEndDate = employment.EndDate || null;
            // candidateJob.employer = employment.Employer || null;
            // candidateJob.inActivity = false;
            // candidateJob.jobName = employment.Position || null;
            // candidateJob.jobDescription = employment.Description || null;

            // // candidateJob. = employment.Location;
            // // candidateJob.pri = employerProfiles.appValues?.find(x=>x.code===EmployerProfil.)
            // let companyName = employment.Employer;
            // if (companyName && companyName.length > 199) {
            //     companyName = companyName.substring(0, 199);
            // }

            // candidateJob.jobReference = { isCompany: true, companyName: companyName } as any;

            // jobsList.push(candidateJob);
        }

        // if (jobsList?.length) {
        //     const candidateJob = new List(jobsList).OrderByDescending(x => x.experienceStartDate).FirstOrDefault();
        //     if (candidateJob) {
        //         candidateJob.inActivity = true;
        //     }
        // }
        // if (candidateDto) {
        //     candidateDto.candidateJobs = jobsList;
        // }
        // return jobsList;
        return jobsResponse;
    }

    // async migrationCandidateApplicationsPartial(): Promise<DataMigrationCandidateApplicationResponse> {
    //     const response = new DataMigrationCandidateApplicationResponse();
    //     await AppLogger.log('Data Migration candidate applications Partial BEGIN');

    //     try {
    //         await this.initAppTypesForMigration();

    //         const candidateApplicationsAlreadyExistsListEntities = await this.candidateApplicationService.getRepository().find({ select: ['id', 'creationDate', 'firstName', 'lastName', 'jobOfferLinkedRef', 'email', 'skills'] });
    //         const candidateApplicationsAlreadyExistsList = candidateApplicationsAlreadyExistsListEntities.map(x => x.toDto());

    //         const wrapper = this.createWrapper();

    //         const importDataFolderPath = path.join(Environment.ApiBasePath, 'import-data');
    //         const filesInFolder = await FileHelpers.getFilesInFolder(importDataFolderPath, { returnFullPath: true });
    //         let fileIndex = 0;
    //         const getJobOffersResponse = await this.jobOfferService.findAll({ where: { disabled: false } });
    //         const migrationResponse = new DataMigrationCandidateApplicationResponse();

    //         const typeValues = await this.referentialService.getMultipleTypeValues({
    //             appTypesCodes: [
    //                 AppTypes.RelationshipStatusCode,
    //                 AppTypes.JobCategoryCode,
    //                 AppTypes.JobNannyCategoryCode,
    //                 AppTypes.JobYachtingCategoryCode,
    //                 AppTypes.PersonGenderCode,
    //                 AppTypes.ApplyStatusCode,
    //             ].join(','),
    //         });

    //         const jobsTypes = typeValues.appTypes.filter(x => x.code === AppTypes.JobCategoryCode ||
    //             x.code === AppTypes.JobNannyCategoryCode ||
    //             x.code === AppTypes.JobYachtingCategoryCode);

    //         const jobsAppValues = new List(jobsTypes).SelectMany(x => new List(x.appValues)).ToArray();
    //         const fieldsTocheckMaxLen: (keyof CandidateApplicationDto)[] = ['firstName', 'lastName', 'partnerFirstName', 'partnerLastName', 'phone', 'phoneSecondary'];
    //         const regexHrefLink = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/;

    //         for (const filePath of filesInFolder) {
    //             if (!filePath.endsWith('.csv'))
    //                 continue;

    //             // if (fileIndex < 42 || fileIndex > 42) {
    //             //     fileIndex++;
    //             //     continue;
    //             // }

    //             // if (fileIndex < 140) {
    //             //     fileIndex++;
    //             //     continue;
    //             // }
    //             const csvFileContent = await FileHelpers.readFile(filePath, true) as string;
    //             console.log("reading filePath N°", fileIndex, filePath);
    //             const lines = CSVHelpers.parseCSV(csvFileContent) as any[][];
    //             const csvHeaders = lines[0];
    //             for (let index = 0; index < lines.length; index++) {
    //                 if (index <= 0)
    //                     continue;
    //                 // const creationDateFromCsv = this.parseDateFromCsv(this.getCsvValueFromWrapper(index, lines, csvHeaders, wrapper, 'creationDate'), true);
    //                 // if (!creationDateFromCsv)
    //                 //     continue;

    //                 const candidateApplicationFromCsv = this.getCandidateApplicationFromCsv(index, fileIndex, lines,
    //                     csvHeaders, wrapper, regexHrefLink, getJobOffersResponse, typeValues, jobsAppValues, migrationResponse, fieldsTocheckMaxLen);
    //                 if (candidateApplicationFromCsv.ignored || !candidateApplicationFromCsv.candidateApplication) {
    //                     // index++;
    //                     continue;
    //                 }
    //                 const dateCsvValue = this.getCsvValueFromWrapper(index, lines, csvHeaders, wrapper, 'creationDate');
    //                 // if (dateCsvValue && dateCsvValue.indexOf('03/12/2022') !== -1) {
    //                 //     const test = "";
    //                 //     const test2 = "";

    //                 // }
    //                 // const lastName = this.getCsvValueFromWrapper(index, lines, csvHeaders, wrapper, 'lastName');
    //                 // const firstName = this.getCsvValueFromWrapper(index, lines, csvHeaders, wrapper, 'firstName');
    //                 // if (
    //                 //     // firstName?.toLowerCase() === 'ouadghiri' || firstName?.toLowerCase() === 'ghania'
    //                 //     // firstName?.toLowerCase() === 'elvira'

    //                 //     firstName?.toLowerCase() === 'pierre'
    //                 //     && lastName?.toLowerCase() === 'letard'

    //                 //     && candidateApplicationFromCsv.candidateApplication.creationDate.getFullYear() === 2022
    //                 //     && candidateApplicationFromCsv.candidateApplication.creationDate.getDate() === 12

    //                 // ) {
    //                 //     const test = "";
    //                 //     const test2 = "";
    //                 // }

    //                 // let candidateApplication = candidateApplicationFromCsv.candidateApplication;
    //                 const fromDbList = this.getAlreadyImportedCandidateApplications(candidateApplicationsAlreadyExistsList, candidateApplicationFromCsv.candidateApplication, false);
    //                 if (!fromDbList?.length) {
    //                     continue;
    //                 }

    //                 // if (candidateApplicationFromCsv.candidateApplication?.creationDate
    //                 //     && candidatceApplicationFromCsv.candidateApplication.creationDate.getFullYear() === 2022
    //                 //      && candidateApplicationFromCsv.candidateApplication.creationDate.getMonth() === 2
    //                 //      && candidateApplicationFromCsv.candidateApplication.creationDate.getMonth() === 2) {
    //                 //     break;
    //                 // }

    //                 for (const fromDb of fromDbList) {
    //                     if (DateHelpers.daysDiff(fromDb.creationDate, candidateApplicationFromCsv.candidateApplication.creationDate) !== 0) {
    //                         console.log('update candidate appplication from ' + fromDb.creationDate.toISOString() + ' to ' + candidateApplicationFromCsv.candidateApplication.creationDate.toISOString()
    //                             + ' - CSV : ' + dateCsvValue);
    //                         await this.candidateApplicationService.getRepository().update({ id: fromDb.id }, { creationDate: candidateApplicationFromCsv.candidateApplication.creationDate });
    //                     }
    //                 }

    //                 // await this.candidateApplicationService.getRepository().update({id:},{});

    //             }

    //             fileIndex++;
    //         }

    //         // await this.candidateApplicationService.findAll({where:{jobOfferLinkedRef:Not(IsNull(),job)}});
    //         // const getJobOfferLinkedwrapperIds = this.getCandidateApplicationsJobsList(lineRefAnnonceStr, getJobOffersResponse);
    //         // const jobOfferLinkedwrapperIds = getJobOfferLinkedwrapperIds.jobOfferLinkedwrapperIds;
    //         // isCandidatureSpontannee = getJobOfferLinkedwrapperIds.isCandidatureSpontannee;

    //         response.success = true;
    //     }
    //     catch (err) {
    //         await AppLogger.error(err);

    //     }
    //     return response;
    // }

    // private async migrationJobsPartial(connection: Connection, contacts: JA_Contact[], candidatesResponse: GetCandidatesResponse, maxLength: number) {
    //     //migration jobs
    //     const queryDeleteJobs = 'DELETE FROM `' + this.candidateService.candidateJobRepository.metadata.tableName + '`';
    //     console.log("queryDeleteJobs", queryDeleteJobs);
    //     // return;
    //     await this.candidateService.candidateJobRepository.query(queryDeleteJobs);
    //     let i = 0;
    //     for (const contactFromJobAdder of contacts) {
    //         const jobsList = await this.migrateCandidateJobs(connection, contactFromJobAdder.ContactID, null);
    //         const candidateToUpdate = candidatesResponse.candidates?.find(x => x.jobAdderContactId === contactFromJobAdder.ContactID);
    //         if (!candidateToUpdate?.id) {
    //             console.log('candidate not found in new CRM DB !');
    //             continue;
    //         }
    //         for (const newCandidateJob of jobsList) {
    //             newCandidateJob.candidateId = candidateToUpdate.id;
    //             await this.candidateService.candidateJobRepository.save(newCandidateJob);
    //         }

    //         i++;
    //         if (maxLength != null && i > maxLength)
    //             break;
    //     }
    // }
    // async migrationJobAdderPartial(): Promise<DataMigrationResponse> {
    //     const response = new DataMigrationResponse();
    //     let connection: Connection;
    //     await AppLogger.log('Data Migration Partial BEGIN');

    //     try {
    //         if (!Environment.JobAdderBackupHost || !Environment.JobAdderBackupUser || !Environment.JobAdderBackupPassword || !Environment.JobAdderAttachmentsFolder) {
    //             throw new AppErrorWithMessage('You must configure job adder backup sql access and attachment folder !');
    //         }
    //         connection = await this.getConnection();
    //         await this.initAppTypesForMigration();

    //         const contacts = await connection.query('SELECT ContactID FROM Contact ORDER BY ContactID desc') as JA_Contact[];
    //         console.log("contacts LENGTH", contacts.length);
    //         const candidatesResponse = await this.candidateService.findAll({
    //             select: ['id', 'jobAdderContactId'],
    //             where: { jobAdderContactId: Not(IsNull()) },
    //         }, false, []
    //         );
    //         console.log("candidatesResponse LENGTH", candidatesResponse.candidates.length);
    //         const migrationJobs = false;
    //         if (migrationJobs) {
    //             // await this.migrationJobsPartial(connection, contacts, candidatesResponse, 10);
    //             await this.migrationJobsPartial(connection, contacts, candidatesResponse, null);
    //         }
    //         if (connection) {
    //             await connection.close();
    //         }

    //         response.success = true;
    //     }
    //     catch (err) {
    //         await AppLogger.error(err);

    //     }
    //     return response;
    // }

    // public async setJobSearchAsCurrentCandidateJob() {
    //     await AppLogger.log('Start migration experience inActivity to currentJob');
    //     const response = new GenericResponse();
    //     try {
    //         const findOptions: FindManyOptions<Candidate> = { relations: ['candidateJobs', 'candidateJobs.job', 'candidateCurrentJobs'] };
    //         if (Environment.EnvName === 'development') {
    //             findOptions.take = 10000;
    //             findOptions.order = { modifDate: 'DESC' };
    //         }

    //         const getAllCandidate = await this.candidateService.repository.find(findOptions);
    //         if (!getAllCandidate?.length)
    //             throw new AppErrorWithMessage('Une erreur est survenue.');

    //         let candidatesSaved = 0;
    //         for (const candidate of getAllCandidate) {
    //             if (!candidate?.id || !candidate.candidateJobs?.some(x => x.inActivity && x.jobId)) {
    //                 continue;
    //             }

    //             let mustBeSaved = false;

    //             // const candidateDto = candidate.toDto();
    //             for (const candidateJob of candidate.candidateJobs) {
    //                 if (!candidateJob.inActivity || !candidateJob.jobId) {
    //                     continue;
    //                 }

    //                 if (!candidate.candidateCurrentJobs?.length)
    //                     candidate.candidateCurrentJobs = [];

    //                 if (!candidate.candidateCurrentJobs.some(x => x.currentJobId === candidateJob.jobId)) {
    //                     if (Environment.EnvName === 'development') {
    //                         console.log('Candidate migration : ' + candidate.id + " - job : " + (candidateJob.job?.label || '') + ' - candidate : ' + candidate.email);
    //                     }

    //                     const candidateJobLink = new CandidateCurrentJob();
    //                     candidateJobLink.currentJobId = candidateJob.jobId;
    //                     candidateJobLink.candidateId = candidate.id;
    //                     candidate.candidateCurrentJobs.push(candidateJobLink);
    //                     mustBeSaved = true;
    //                 }
    //             }
    //             if (mustBeSaved) {
    //                 await this.candidateService.repository.save(candidate);
    //                 candidatesSaved++;
    //             }
    //             else {
    //                 // console.log('ignoring save');
    //             }
    //         }

    //         await AppLogger.log('End migration experience inActivity to currentJob, ' + (candidatesSaved) + " items");
    //         response.success = true;
    //     } catch (err) {
    //         response.handleError(err);
    //     }
    //     return response;
    // }
    // public async setCurrentJobsFromJobAdder() {
    //     await AppLogger.log('Start migration jobs from job adder');
    //     const response = new GenericResponse();
    //     try {
    //         await this.initAppTypesForMigration();

    //         const filePath = path.join(Environment.ApiBasePath, 'import-data-jobadder', 'job_adder_jobs.csv');

    //         if (!await FileHelpers.fileExists(filePath)) {
    //             throw new AppError('setCurrentJobsFromJobAdder ERROR : csv file does not exist !');
    //         }
    //         const csvFileContent = await FileHelpers.readFile(filePath, true) as string;
    //         let lines = CSVHelpers.parseCSV(csvFileContent) as any[][];

    //         lines = lines.reverse();

    //         const jobAssoc = JobsAssociationCRM;
    //         const jobAssociationData: { jobName: string; jobCode: string; }[] = [];

    //         for (const key in jobAssoc) {
    //             if (!jobAssoc[key])
    //                 continue;
    //             jobAssociationData.push({ jobName: key, jobCode: jobAssoc[key] });
    //         }

    //         let count = 0;

    //         const contactWithJobs: { contactId: number; jobs: string[]; jobsList: AppValueDto[] }[] = [];
    //         for (const csvLine of lines) {
    //             const contactId = csvLine[0] as string;
    //             const jobName = csvLine[1] as string;
    //             if (!contactId || !jobName)
    //                 continue;

    //             const contactIdInt = parseInt(contactId, 10);
    //             // console.log("Log ~ file: data-migration.service.ts ~ line 2059 ~ DataMigrationService ~ setCurrentJobsFromJobAdder ~ contactIdInt", contactIdInt);
    //             // console.log("Log ~ file: data-migration.service.ts ~ line 2056 ~ DataMigrationService ~ setCurrentJobsFromJobAdder ~ jobName", jobName);

    //             const jobData = jobAssociationData.find(x => x.jobName.toLowerCase().trim() === jobName.trim().toLowerCase());
    //             if (!jobData?.jobCode) {
    //                 console.log('ignoring job : ' + jobName + ' - job not found');
    //                 continue;
    //             }

    //             // console.log("Log ~ file: data-migration.service.ts ~ line 2075 ~ DataMigrationService ~ setCurrentJobsFromJobAdder ~ jobData", jobData.jobCode);

    //             const jobAppValue = this.jobsAppValuesFullList.find(x => x.code === jobData.jobCode);
    //             if (!jobAppValue) {
    //                 console.log('ignoring job : ' + jobName + ' - app value with code ' + jobData.jobCode + ' not found !');
    //                 continue;
    //             }

    //             let contactWrapper = contactWithJobs.find(x => x.contactId === contactIdInt);
    //             if (!contactWrapper) {
    //                 contactWrapper = { contactId: contactIdInt, jobs: [], jobsList: [] };
    //                 contactWithJobs.push(contactWrapper);
    //             }

    //             if (!contactWrapper.jobs.some(x => x === jobName)) {
    //                 contactWrapper.jobs.push(jobName);
    //             }

    //             if (!contactWrapper.jobsList.some(x => x.id === jobAppValue.id)) {
    //                 contactWrapper.jobsList.push(jobAppValue);
    //             }
    //         }

    //         for (const contactWrapper of contactWithJobs) {

    //             const candidate = await this.candidateService.repository.findOne({ where: { jobAdderContactId: contactWrapper.contactId }, relations: ['candidateCurrentJobs'] });
    //             if (!candidate) {
    //                 console.log('candidate not found ! - ' + contactWrapper.contactId);
    //                 continue;
    //             }

    //             let mustSave = false;

    //             for (const jobAppValue of contactWrapper.jobsList) {
    //                 if (!candidate.candidateCurrentJobs?.some(x => x.currentJobId === jobAppValue.id)) {
    //                     if (!candidate.candidateCurrentJobs) {
    //                         candidate.candidateCurrentJobs = [];
    //                     }
    //                     const candidateJobLink = new CandidateCurrentJob();
    //                     candidateJobLink.currentJobId = jobAppValue.id;
    //                     candidateJobLink.candidateId = candidate.id;
    //                     candidate.candidateCurrentJobs.push(candidateJobLink);

    //                     console.log('adding job ' + jobAppValue.code + ' to ' + candidate.email);
    //                     mustSave = true;
    //                 } else {
    //                     // console.log('alreay added for ' + contactWrapper.contactId);
    //                 }
    //             }

    //             if (mustSave) {
    //                 await this.candidateService.repository.save(candidate);
    //                 count++;
    //             }
    //             if (Environment.EnvName === 'development' && count >= 2000) {
    //                 break;
    //             }
    //         }
    //         response.success = true;
    //         await AppLogger.log('END migration jobs from job adder - ' + count);

    //     } catch (err) {
    //         response.handleError(err);
    //     }
    //     return response;
    // }
}
