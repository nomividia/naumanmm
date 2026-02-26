/* eslint-disable no-underscore-dangle */
import {
    Component,
    Renderer2,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'nextalys-angular-tools';
import { DateHelpers, MainHelpers } from 'nextalys-js-helpers';
import { NxsList } from 'nextalys-js-helpers/dist/nxs-list';
import { RefData } from '../../../../shared/ref-data';
import { RoutesList } from '../../../../shared/routes';
import {
    AppPage,
    AppTypes,
    CandidateFileType,
    CandidateMessageSenderType,
    CandidateSection,
    CandidateStatus,
} from '../../../../shared/shared-constants';
import { CandidateInformationsComponent } from '../../components/candidate-informations/candidate-informations.component';
import {
    CandidateProcessWarningDialogComponent,
    CandidateProcessWarningDialogData,
    CandidateProcessWarningDialogResponse,
} from '../../components/candidate-process-warning-dialog/candidate-process-warning-dialog.component';
import { CandidateStatusHistoriesDialogComponent } from '../../components/candidate-status-histories-dialog/candidate-status-histories-dialog.component';
import {
    DetailInterviewDialogComponent,
    DetailInterviewDialogData,
    DetailInterviewDialogResponse,
} from '../../components/detail-interview-dialog/detail-interview-dialog.component';
import {
    SelectJobOfferDialogComponent,
    SelectJobOfferDialogData,
    SelectJobOfferDialogResponse,
} from '../../components/select-job-offer-dialog/select-job-offer-dialog.component';
import {
    SendAvailabilityDialogComponent,
    SendAvailabilityDialogData,
} from '../../components/send-availability-mail-dialog/send-availability-dialog.component';
import {
    SendFolderCustomerDialogComponent,
    SendFolderCustomerDialogData,
} from '../../components/send-folder-customer/send-folder-dialog.component';
import { GenericUnloadMessage } from '../../environments/constants';
import {
    AddressDto,
    AppValueDto,
    CandidateApplicationsService,
    CandidateJobOfferHistoryService,
    CandidateMessageDto,
    CandidatesService,
    CreateOrUpdateCandidateRequestParams,
    GenericResponse,
    GetAllCandidateApplicationsRequestParams,
    GetAllHistoriesRequestParams,
    GetCandidateRequestParams,
    InterviewDto,
    InterviewsService,
    JobReferenceDto,
    JobReferencesService,
    NoteItemDto,
} from '../../providers/api-client.generated';
import { CandidateDto } from '../../providers/api-client.generated/model/candidateDto';

import { SharedService } from '../../../../shared/shared-service';
import { CandidateJobStatus } from '../../../../shared/types/candidate-job-status.type';
import { ReferentialProvider } from '../../providers/referential.provider';
import { EventsHandler } from '../../services/events.handler';
import { GlobalAppService } from '../../services/global.service';
import { BaseEditPageComponent } from '../base/base-edit-page.component';

interface InterviewRequest {
    interviewCurrentDate?: 'past' | 'coming';
    interviewFilterMonth?: string;
    interviewFilterYear?: string;
}

interface MonthWrapper {
    label: string;
    code: number;
}

@Component({
    selector: 'app-edit-candidate',
    templateUrl: './edit-candidate.component.html',
    styleUrls: [
        '../base/edit-page-style.scss',
        './edit-candidate.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class EditCandidateComponent extends BaseEditPageComponent<
    CandidateDto,
    CandidatesService
> {
    relationshipStatusList: AppValueDto[];
    candidateStatusList: AppValueDto[];
    levelLanguageList: AppValueDto[];
    contractTypes: AppValueDto[];
    licencesList: AppValueDto[];
    genderList: AppValueDto[];
    jobList: AppValueDto[];
    notesToDisplay: NoteItemDto[];
    relationShipStatusLabel: string;
    selectedGender: string;
    candidateId: string;
    newInterviewHour: string;
    modifyStatus: boolean;
    candidateMessages: CandidateMessageDto[];
    newCandidateMessageContent: string;

    candidateAdvancementPercent = 0;
    isSubscribedToNewsletter: boolean = false;
    noLanguageAdd: boolean = false;
    noChildAdd: boolean = false;
    isConsultant: boolean = false;
    newInterview: InterviewDto = {};
    requestInterview: InterviewRequest = {};
    candidateInterviewsList: InterviewDto[] = [];
    candidateInterviewsListLoaded = false;
    isNew: boolean = false;
    pendingResumeFile: { physicalName: string; name: string; mimeType: string } | null = null;

    tabIndex: number = 0;
    yearList: number[] = [];
    monthList: MonthWrapper[] = [];
    additionalParameters?: GetCandidateRequestParams = {} as any;
    getCandidateApplicationsRequest: GetAllCandidateApplicationsRequestParams =
        {};

    DateHelpers = DateHelpers;
    languagesList = RefData.languages;
    CandidateMessageSenderType = CandidateMessageSenderType;
    RefData = RefData;
    CandidateJobStatus = CandidateJobStatus;

    editModes: CandidateSection = {
        informations: false,
        complement: false,
        contact: false,
        location: false,
        conditions: false,
        skills: false,
        jobs: false,
        notes: false,
        conjoint: false,
        language: false,
    };

    @ViewChild('toggleStatus') toggleStatus: MatButton;
    @ViewChild('fieldStatus') fieldStatus: MatSelect;
    @ViewChild('candidateInformation')
    candidateInformation: CandidateInformationsComponent;
    @ViewChild('placementHistory')
    placementHistory: any;

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        public candidateService: CandidatesService,
        public dialogService: DialogService,
        private referentialProvider: ReferentialProvider,
        private interviewsService: InterviewsService,
        private renderer: Renderer2,
        private translateService: TranslateService,
        private jobReferenceService: JobReferencesService,
        private candidateApplicationsService: CandidateApplicationsService,
        private candidateJobOfferHistoryService: CandidateJobOfferHistoryService,
    ) {
        super(
            dialogService,
            AppPage.CandidateEdit,
            route,
            router,
            candidateService,
            'id',
            'candidate',
            'candidateDto',
            'getCandidate',
            'createOrUpdateCandidate',
            RoutesList.CandidatesList,
            'id',
            null,
            GenericUnloadMessage,
        );

        this.checkOutsideClick();

        const sub = EventsHandler.EditCandidateInfo.subscribe(() => {
            this.tabIndex = 0;
        });

        this.eventsCollector.collect(sub);
        this.setAdditionalParameters(null);
        this.isConsultant = SharedService.userIsConsultant(
            this.AuthDataService.currentUser,
        );
    }

    async onTabChange() {
        const mustReload = this.setAdditionalParameters(null);

        if (mustReload) {
            this.reloadData();
        }

        if (this.tabIndex === 6) {
            await this.loadInterviewData();
        }
    }

    private setAdditionalParameters(specificTabIndex: number) {
        this.additionalParameters = {} as any;
        let mustReload = false;

        if (specificTabIndex == null) {
            specificTabIndex = this.tabIndex;
        }

        switch (specificTabIndex) {
            case 0:
                // Global Informations tab - candidateJobs NOT needed here (only used in Skills tab)
                this.additionalParameters.includeAddresses = 'true';
                this.additionalParameters.includeCurrentJobs = 'true';
                this.additionalParameters.includePets = 'true';
                this.additionalParameters.includeLicences = 'true';
                this.additionalParameters.includeNoteItems = 'true';
                this.additionalParameters.includeLanguages = 'true';
                this.additionalParameters.includeConsultant = 'true';
                this.additionalParameters.includeContracts = 'true';
                this.additionalParameters.includeCountries = 'true';
                this.additionalParameters.includeDepartments = 'true';
                this.additionalParameters.includeChildren = 'true';
                this.additionalParameters.includeBasicInformations = 'true';

                mustReload = true;

                break;
            case 1:
                this.additionalParameters.includeCandidateJobs = 'true';
                this.additionalParameters.includeCurrentJobs = 'true';
                mustReload = true;
                break;
            case 2:
                //Files
                this.additionalParameters.includeFiles = 'true';
                this.additionalParameters.includeResume = 'true';
                this.additionalParameters.includeCurrentJobs = 'true';
                this.additionalParameters.includeCandidateJobs = 'true';

                mustReload = true;

                break;
            case 3:
                //MMI Resume

                // this.additionalParameters.includeResume = 'true';
                // // this.additionalParameters.includeCurrentJobs = 'true';
                // // this.additionalParameters.includeCandidateJobs = 'true';
                // this.additionalParameters.includeLicences = 'true';
                // this.additionalParameters.includePets = 'true';
                // this.additionalParameters.includeAddresses = 'true';
                // this.additionalParameters.includeLanguages = 'true';
                // this.additionalParameters.includeContracts = 'true';
                // this.additionalParameters.includeCountries = 'true';
                // this.additionalParameters.includeFiles = 'true';
                // this.additionalParameters.includeChildren = 'true';

                mustReload = false;

                break;
            case 5:
                //interviews
                this.additionalParameters.includeCurrentJobs = 'true';
                this.additionalParameters.includeCandidateJobs = 'true';
                mustReload = false;

                break;
        }

        return mustReload;
    }

    private sortExperiences() {
        if (this.entity?.candidateJobs?.length) {
            this.entity.candidateJobs = new NxsList(this.entity?.candidateJobs)
                .OrderByDescending((x) => x.experienceStartDate)
                .ToArray();
        }
    }

    async afterInitEditPageData() {
        this.genderList = [];
        this.relationshipStatusList = [];

        if (this.entity) {
            this.sortExperiences();

            this.isSubscribedToNewsletter = !this.entity.newsletterUnsubscribed;

            if (this.tabIndex === 0) {
                this.candidateAdvancementPercent =
                    this.entity.candidateAdvancementPercent;
            }

            this.getCandidateApplicationsRequest.candidateId = this.entity.id;

            if (this.entity.noteItems) {
                this.entity.noteItems = this.entity.noteItems.sort(
                    (a, b) => b.modifDate.getTime() - a.modifDate.getTime(),
                );
            }

            const appTypes = await this.referentialProvider.getTypesValues(
                [
                    AppTypes.ContractTypeCode,
                    AppTypes.PersonGenderCode,
                    AppTypes.RelationshipStatusCode,
                    // AppTypes.JobCategoryCode,
                    AppTypes.CandidateStatusCode,
                    AppTypes.LicenceTypeCode,
                    AppTypes.CandidateFileType,
                    AppTypes.LevelLanguageCode,
                ],
                true,
            );
            this.contractTypes = appTypes.find(
                (x) => x.code === AppTypes.ContractTypeCode,
            ).appValues;
            this.genderList = appTypes.find(
                (x) => x.code === AppTypes.PersonGenderCode,
            ).appValues;
            this.relationshipStatusList = appTypes.find(
                (x) => x.code === AppTypes.RelationshipStatusCode,
            ).appValues;

            // Flatten all jobs from all job categories
            this.jobList = [];
            const jobCategories = appTypes.filter(
                (x) =>
                    x.code === AppTypes.JobCategoryCode ||
                    x.code === AppTypes.JobNannyCategoryCode ||
                    x.code === AppTypes.JobYachtingCategoryCode ||
                    x.code === AppTypes.JobHotellerieCategoryCode ||
                    x.code === AppTypes.JobRetailCategoryCode ||
                    x.code === AppTypes.JobRestaurationCategoryCode ||
                    x.code === AppTypes.JobCuisineCategoryCode ||
                    x.code === AppTypes.JobSpaCategoryCode ||
                    x.code === AppTypes.JobAdministratifHotellerieCategoryCode,
            );

            jobCategories.forEach((category) => {
                if (category.appValues) {
                    this.jobList = this.jobList.concat(category.appValues);
                }
            });

            const statuslist = appTypes
                .find((x) => x.code === AppTypes.CandidateStatusCode)
                .appValues?.sort((a, b) => a.order - b.order);
            this.candidateStatusList = statuslist;

            if (
                !GlobalAppService.userHasRole(
                    this.AuthDataService.currentUser,
                    this.RolesList.Admin,
                )
            ) {
                this.candidateStatusList = statuslist.filter(
                    (x) => x.code !== CandidateStatus.NotSelected,
                );
            }

            this.licencesList = appTypes
                .find((x) => x.code === AppTypes.LicenceTypeCode)
                ?.appValues?.sort((a, b) => a.order - b.order);
            this.levelLanguageList = appTypes
                .find((x) => x.code === AppTypes.LevelLanguageCode)
                ?.appValues?.sort((a, b) => a.order - b.order);

            if (this.entity.noteItems) {
                this.notesToDisplay = MainHelpers.cloneObject(
                    this.entity.noteItems,
                );

                if (this.entity.noteItems.length > 2) {
                    this.notesToDisplay = this.entity.noteItems.slice(0, 2);
                }
            }

            this.createYearAndMonthRange();
            if (!this.entity.candidateLanguages?.length) {
                this.noLanguageAdd = true;
            }

            if (!this.entity.candidateChildrens?.length) {
                this.noChildAdd = true;
            }

            this.orderInterviews();

            // Check if candidate status requires warning dialog
            if (
                this.entity.candidateStatus?.code ===
                    CandidateStatus.InProcess ||
                this.entity.candidateStatus?.code ===
                    CandidateStatus.NotSelected
            ) {
                await this.showProcessWarningDialog();
            }
        }

        this.subscribeToObservable(this.route.params, (params) => {
            this.isNew = params.id === 'new';

            if (this.isNew) {
                this.entity.candidateStatusId = this.candidateStatusList?.find(
                    (x) => x.code === CandidateStatus.ToBeReferenced,
                )?.id;
                // console.log("Log ~ file: edit-candidate.component.ts ~ line 136 ~ EditCandidateComponent ~ this.subscribeToObservable ~ this.entity.candidateStatusId ", this.entity.candidateStatusId);
            }
        });
    }

    beforeSaveCheck() {
        const errors: string[] = [];

        if (this.editModes.informations) {
            if (!this.entity.lastName) {
                errors.push(
                    this.translateService.instant(
                        'ErrorsCandidate.NameUndefined',
                    ),
                );
            }

            if (!this.entity.firstName) {
                errors.push(
                    this.translateService.instant(
                        'ErrorsCandidate.FirstNameUndefined',
                    ),
                );
            }

            if (!this.entity.genderId) {
                errors.push(
                    this.translateService.instant(
                        'ErrorsCandidate.GenderUndefined',
                    ),
                );
            }

            if (!this.entity.birthDate) {
                errors.push(
                    this.translateService.instant(
                        'ErrorsCandidate.BirthDateUndefined',
                    ),
                );
            }

            if (!this.entity.relationshipStatusId) {
                errors.push(
                    this.translateService.instant(
                        'ErrorsCandidate.RelationshipUndefined',
                    ),
                );
            }
        }

        if (this.editModes.contact) {
            if (!this.entity.phone) {
                errors.push(
                    this.translateService.instant(
                        'ErrorsCandidate.PhoneUndefined',
                    ),
                );
            }

            if (!this.entity.email) {
                errors.push(
                    this.translateService.instant(
                        'ErrorsCandidate.EmailUndefined',
                    ),
                );
            }
        }

        if (this.entity) {
            /* if (this.editModes.jobs) {
                if (this.entity.candidateJobs?.length) {
                    this.entity.candidateJobs.forEach(x => {
                        if (!x.jobId) {
                            errors.push(this.translateService.instant('ErrorsCandidate.JobUndefined'));
                        }
                    });
                }
            } */

            if (this.editModes.language) {
                if (this.entity.candidateLanguages?.length) {
                    this.entity.candidateLanguages.forEach((x) => {
                        if (!x.languageCode) {
                            errors.push(
                                this.translateService.instant(
                                    'ErrorsCandidate.LanguageUndefined',
                                ),
                            );
                        }

                        if (!x.levelLanguageId) {
                            errors.push(
                                this.translateService.instant(
                                    'ErrorsCandidate.LevelLanguageUndefined',
                                ),
                            );
                        }
                    });
                }
            }
        }

        const errorsFromCandidateInformations =
            this.candidateInformation.beforeSaveCheck();

        if (errorsFromCandidateInformations?.length > 0) {
            errors.push(...errorsFromCandidateInformations);
        }

        return errors;
    }

    addAddress() {
        if (!this.entity.addresses) {
            this.entity.addresses = [];
        }

        this.entity.addresses.push({
            lineOne: undefined,
            lineTwo: undefined,
            city: undefined,
            postalCode: undefined,
            label: undefined,
            country: undefined,
            candidateId: this.entity?.id ? this.entity.id : undefined,
        });
    }

    removeAddress(address: AddressDto) {
        if (!address || !this.entity.addresses) {
            return;
        }

        const addressIndex = this.entity.addresses.indexOf(address);

        if (addressIndex > -1) {
            this.entity.addresses.splice(addressIndex, 1);
        }
    }

    async onEditClick(key: keyof CandidateSection) {
        if (this.editModes[key]) {
            await this.save();
        } else {
            this.editModes[key] = true;
        }
    }

    async checkIfCandidateExists(): Promise<boolean> {
        if (this.isNew) {
            const getByName = await this.candidateService
                .getAllCandidates({
                    getCandidatesRequest: {
                        search:
                            this.entity.firstName + ' ' + this.entity.lastName,
                    },
                })
                .toPromise();

            if (
                getByName.filteredResults === 0 &&
                getByName.candidates.map(
                    (x) =>
                        x.firstName === this.entity.firstName &&
                        x.lastName === this.entity.lastName,
                ).length === 0
            ) {
                const getByEmail = await this.candidateService
                    .getAllCandidates({
                        getCandidatesRequest: {
                            search: this.entity.email,
                        },
                    })
                    .toPromise();

                if (getByEmail.filteredResults !== 0) {
                    if (
                        confirm(
                            'Existing email found. Do you want to continue saving?',
                        )
                    ) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            } else {
                if (
                    confirm(
                        'Existing name found. Do you want to continue saving?',
                    )
                ) {
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            return false;
        }
    }

    async save(exit?: boolean, isSetReference?: boolean): Promise<any> {
        // const errors = this.candidateInformation.beforeSaveCheck();

        // if (errors?.length > 0) {
        //     this.dialogService.showDialog('Liste des erreurs : <ul>' + errors.map(x => x = '<li>' + x + '</li>').join('') + '</ul>');
        //     return;
        // }

        // console.log(`🚀 ~ this.hasPendingModifications`, !!this.hasPendingModifications);
        const isCandidateExists = await this.checkIfCandidateExists();

        if (isCandidateExists) {
            return false;
        }

        if (!this.hasPendingModifications) {
            for (const key in this.editModes) {
                (this.editModes as any)[key] = false;
            }

            return;
        }

        if (this.entity?.candidateJobs?.length > 1 && !isSetReference) {
            this.entity.referencesValidated = true;
            const goodReferenceStatusCount = this.entity?.candidateJobs
                ?.map((x) => x.status)
                ?.filter((x) => x === CandidateJobStatus.VALIDATED)?.length;
            const badReferenceStatusCount = this.entity?.candidateJobs
                ?.map((x) => x.status)
                ?.filter((x) => x === CandidateJobStatus.REFUSED)?.length;

            this.candidateApplicationsService
                .getAllCandidateApplications(
                    this.getCandidateApplicationsRequest,
                )
                .subscribe((item) => {
                    const pendingJobApplication =
                        item.candidateApplications.find(
                            (x) => x.applyStatus.code === 'ApplyStatus_Pending',
                        );

                    const request = {
                        start: 0,
                        length: 20,
                        orderby: 'creationDate',
                        order: 'DESC',
                        candidateId: this.entity.id,
                    };

                    if (goodReferenceStatusCount > 1) {
                        if (pendingJobApplication !== undefined) {
                            this.candidateApplicationsService
                                .validateCandidateApplication({
                                    validateCandidateApplicationRequest: {
                                        id: pendingJobApplication.id,
                                        candidateCurrentJobIds: [],
                                    },
                                })
                                .toPromise();

                            this.candidateApplicationsService
                                .getAllCandidateApplications(request)
                                .toPromise();
                        }
                    } else if (badReferenceStatusCount > 1) {
                        if (pendingJobApplication !== undefined) {
                            this.candidateApplicationsService
                                .refuseCandidateApplication({
                                    refuseCandidateApplicationRequest: {
                                        id: pendingJobApplication.id,
                                        createCandidate: false,
                                        candidateCurrentJobIds: [],
                                    },
                                })
                                .toPromise();

                            this.candidateApplicationsService
                                .getAllCandidateApplications(request)
                                .toPromise();
                        }
                    }
                });
        }

        const additionalParameters: CreateOrUpdateCandidateRequestParams =
            {} as any;
        additionalParameters.saveCandidateRequest = MainHelpers.cloneObject(
            this.additionalParameters,
        ) as any;

        // Store pending resume file for new candidates (will be saved in afterSave)
        if (this.isNew) {
            this.pendingResumeFile = this.candidateInformation.getUploadedResumeFile();
        }

        if (this.additionalParameters.includeCandidateJobs !== 'true') {
            const entityToSave = { ...this.entity };
            delete entityToSave.candidateJobs;
            additionalParameters.saveCandidateRequest.candidate = entityToSave;
        } else {
            additionalParameters.saveCandidateRequest.candidate = this.entity;
        }

        this.additionalParametersForSave = additionalParameters;
        const saveResponse = await super.save(exit);
        if (saveResponse) {
            for (const key in this.editModes) {
                this.editModes[key as keyof CandidateSection] = false;
            }
        }

        return saveResponse;
    }

    async afterSave(apiResponse: GenericResponse): Promise<GenericResponse> {
        if (this.pendingResumeFile && this.entity?.id) {
            const appTypes = await this.referentialProvider.getTypesValues(
                [AppTypes.CandidateFileType],
                true,
            );
            const candidateFileTypes = appTypes.find(
                (x) => x.code === AppTypes.CandidateFileType,
            )?.appValues;
            const mainResumeType = candidateFileTypes?.find(
                (x) => x.code === CandidateFileType.MainResume,
            );

            if (mainResumeType) {
                if (!this.entity.files) {
                    this.entity.files = [];
                }
                this.entity.files.push({
                    fileTypeId: mainResumeType.id,
                    file: {
                        physicalName: this.pendingResumeFile.physicalName,
                        name: this.pendingResumeFile.name,
                        mimeType: this.pendingResumeFile.mimeType,
                    },
                } as any);

                const candidateClone = MainHelpers.cloneObject(this.entity);
                for (const fileItem of candidateClone.files) {
                    delete fileItem.fileType;
                }

                const saveResponse = await this.candidateService
                    .createOrUpdateCandidate({
                        saveCandidateRequest: {
                            candidate: candidateClone,
                            includeFiles: 'true',
                        },
                    })
                    .toPromise();

                if (saveResponse.success && saveResponse.candidate) {
                    this.entity = saveResponse.candidate;
                }
            }

            this.pendingResumeFile = null;
        }

        return { success: true };
    }

    async onFilesChanged() {
        this.hasPendingModifications = true;
        // console.log('file changed', this.entity.files);
        await this.save();
    }

    canLookMore() {
        return (
            this.entity.noteItems?.length &&
            this.entity.noteItems?.length > this.notesToDisplay?.length
        );
    }

    lookMore() {
        const currentIndex = this.notesToDisplay.length;
        const nbToLoad = 2;

        for (let i = 0; i < nbToLoad; i++) {
            if (this.entity.noteItems[currentIndex + i]) {
                this.notesToDisplay.push(
                    this.entity.noteItems[currentIndex + i],
                );
            }
        }
    }

    joinListToDisplay(list: AppValueDto[]) {
        if (!list.length) {
            return;
        }

        const listToReturn = list.map((x) => x.label).join(', ');

        return listToReturn;
    }

    deleteNote(id: string) {
        if (!id) {
            return;
        }

        const indexToRemove = this.entity.noteItems.findIndex(
            (x) => x.id === id,
        );

        if (indexToRemove > -1) {
            this.entity.noteItems.splice(indexToRemove, 1);
        }

        // console.log(this.entity.noteItems);
    }

    getInterviewLabel(interview: InterviewDto) {
        const today = new Date();

        if (today.getTime() < interview.date.getTime()) {
            return this.translateService.instant('Global.InComing');
        }

        return this.translateService.instant('Global.Past');
    }

    private orderInterviews() {
        this.entity.interviews?.sort((a, b) =>
            a.date.getTime() < b.date.getTime() ? 1 : -1,
        );
    }

    async openDetailInterviewDialog(interview: InterviewDto) {
        const data: DetailInterviewDialogData = {
            interview,
            candidateId: this.entity.id,
            defaultConsultantId: this.entity.consultantId ?? null,
            candidate: this.entity,
        };

        const dialogResponse =
            await this.dialogService.showCustomDialogAwaitable<DetailInterviewDialogResponse>(
                {
                    component: DetailInterviewDialogComponent,
                    data,
                    exitOnClickOutside: true,
                    width: '90%',
                    maxWidth: 1000,
                },
            );

        if (dialogResponse?.interview) {
            const dialogSendMailResponse =
                await this.dialogService.showConfirmDialog(
                    this.translateService.instant(
                        'Interview.SendConfirmationMailToCandidate',
                    ),
                    {
                        okLabel: this.translateService.instant('Global.Yes'),
                        cancelLabel: this.translateService.instant('Global.No'),
                    },
                );

            if (dialogSendMailResponse.okClicked) {
                await this.sendMailInterview(dialogResponse.interview);
            }
        }

        if (dialogResponse?.reload) {
            this.candidateInterviewsListLoaded = false;
            await this.loadInterviewData();

            // Update the candidate data if it was returned from the dialog
            if (dialogResponse.candidate) {
                this.entity = dialogResponse.candidate;
                this.hasPendingModifications = false;
            }
        }
    }

    private async sendMailInterview(interview: InterviewDto) {
        this.loading = true;

        const sendMailResponse = await this.sendApiRequest(
            this.interviewsService.sendInterviewMailToCandidate({
                id: interview.id,
            }),
        );

        this.loading = false;

        if (!sendMailResponse.success) {
            this.dialogService.showDialog(sendMailResponse.message);

            return;
        }

        //TODO : translate
        this.dialogService.showSnackBar(
            'Le mail a bien été envoyé au candidat',
        );
    }

    onAddInterview() {
        const interview: InterviewDto = {};
        this.openDetailInterviewDialog(interview);
    }

    async loadInterviewData() {
        this.loading = true;

        const getCandidateInterviewsResponse = await this.interviewsService
            .getAllInterviews({
                candidateId: this.entity.id,
                interviewFilterYear:
                    this.requestInterview?.interviewFilterYear?.toString() ??
                    undefined,
                interviewFilterMonth:
                    this.requestInterview?.interviewFilterMonth?.toString() ??
                    undefined,
                interviewCurrentDate:
                    this.requestInterview?.interviewCurrentDate?.toString() ??
                    undefined,
                order: 'desc',
                orderby: 'date',
            })
            .toPromise();

        this.loading = false;

        if (!getCandidateInterviewsResponse.success) {
            this.dialogService.showDialog(
                getCandidateInterviewsResponse.message,
            );

            return;
        }

        this.candidateInterviewsList =
            getCandidateInterviewsResponse.interviews;
        this.candidateInterviewsListLoaded = true;
    }

    createYearAndMonthRange() {
        const currentYear = new Date().getFullYear();
        this.yearList.push(currentYear);

        for (let i = 2010; i < currentYear; i++) {
            this.yearList.push(i);
        }

        this.yearList.sort((a, b) => b - a);

        for (let y = 0; y < 12; y++) {
            this.monthList.push({
                label: DateHelpers.GetMonthName(y, 'fr'),
                code: y + 1,
            });
        }

        this.monthList.sort((a, b) => a.code - b.code);
    }

    async createUser() {
        if (!this.entity.email) {
            this.dialogService.showDialog(
                await this.translateService.instant(
                    'ErrorsCandidate.NoEmailForCreateUser',
                ),
            );
            return;
        }

        this.loading = true;

        const response = await this.sendApiRequest(
            this.candidateService.createUserFromCandidate({
                candidateId: this.entity.id,
            }),
        );

        if (!response.success) {
            this.dialogService.showDialog(response.message);
            this.loading = false;

            return;
        }

        let msg = this.translateService.instant(
            'Dialog.MailWithConnexionDataSend',
        );

        msg = MainHelpers.replaceAll(
            msg,
            '{{emailAddress}}',
            response?.user?.mail,
        );

        this.dialogService.showDialog(msg);
        this.loading = false;
    }

    async onLockPageBlock(pageBlockName: string) {
        if (!this.entity.candidateReadonlyProperties?.length) {
            this.entity.candidateReadonlyProperties = [];
        }

        const indexIfExist = this.entity.candidateReadonlyProperties.findIndex(
            (x) => x.candidateReadonlyField === pageBlockName,
        );

        if (indexIfExist > -1) {
            this.entity.candidateReadonlyProperties.splice(indexIfExist, 1);
        } else {
            this.entity.candidateReadonlyProperties.push({
                candidateReadonlyField: pageBlockName,
            });
        }

        this.hasPendingModifications = true;

        await this.save();
    }

    isPageLock(editKeyMode: string) {
        if (!this.entity.candidateReadonlyProperties?.length) {
            return false;
        }

        return this.entity.candidateReadonlyProperties
            .map((x) => x.candidateReadonlyField)
            .includes(editKeyMode);
    }

    async onStatusChange() {
        // Check if the status is being changed to "Placed"
        const selectedStatus = this.candidateStatusList.find(
            (status) => status.id === this.entity.candidateStatusId,
        );

        if (selectedStatus?.code === CandidateStatus.Placed) {
            // Show job offer selection dialog
            const dialogData: SelectJobOfferDialogData = {
                candidateName: `${this.entity.firstName} ${this.entity.lastName}`,
            };

            const dialogResponse =
                await this.dialogService.showCustomDialogAwaitable<SelectJobOfferDialogResponse>(
                    {
                        component: SelectJobOfferDialogComponent,
                        data: dialogData,
                        exitOnClickOutside: false,
                        width: '600px',
                    },
                );

            if (dialogResponse?.selectedJobOffer) {
                this.loading = true;

                try {
                    // User selected a job offer, proceed with status change
                    this.hasPendingModifications = true;
                    this.modifyStatus = !this.modifyStatus;

                    // Store the selected job offer ID
                    this.entity.placedJobOfferId =
                        dialogResponse.selectedJobOffer.id;

                    // Resolve the PlacementContract file type from referential
                    const appTypes =
                        await this.referentialProvider.getTypesValues(
                            [AppTypes.CandidateFileType],
                            true,
                        );
                    const candidateFileTypes = appTypes.find(
                        (x) => x.code === AppTypes.CandidateFileType,
                    )?.appValues;
                    const placementContractType = candidateFileTypes?.find(
                        (x) => x.code === CandidateFileType.PlacementContract,
                    );

                    if (!placementContractType) {
                        this.dialogService.showDialog(
                            'Placement contract file type not found. Please contact an administrator.',
                        );
                        this.loading = false;
                        return;
                    }

                    // Track existing file IDs before save
                    const existingFileIds = new Set(
                        (this.entity.files || [])
                            .map((f) => f.id)
                            .filter(Boolean),
                    );

                    // Create a CandidateFileDto for the contract
                    if (!this.entity.files) {
                        this.entity.files = [];
                    }
                    this.entity.files.push({
                        fileTypeId: placementContractType.id,
                        file: {
                            id: undefined,
                            mimeType:
                                dialogResponse.contractFileUploadData
                                    ?.fileItems?.[0]?.file?.type,
                            physicalName:
                                dialogResponse.contractFileUploadData
                                    ?.fileItems?.[0]?.file?.name,
                            name:
                                'Placement Contract - ' +
                                dialogResponse.selectedJobOffer.title,
                        },
                    } as any);

                    // Save candidate with files (cascade-creates the file)
                    const candidateClone = MainHelpers.cloneObject(this.entity);
                    for (const fileItem of candidateClone.files || []) {
                        delete fileItem.fileType;
                    }

                    const saveResponse = await this.candidateService
                        .createOrUpdateCandidate({
                            saveCandidateRequest: {
                                candidate: candidateClone,
                                includeFiles: 'true',
                            },
                        })
                        .toPromise();

                    if (!saveResponse?.success) {
                        this.dialogService.showDialog(
                            saveResponse?.message ||
                                'Error saving placement data.',
                        );
                        this.loading = false;
                        return;
                    }

                    if (saveResponse.candidate) {
                        this.entity = saveResponse.candidate;
                    }

                    // Reset form state after successful save
                    this.hasPendingModifications = false;

                    // Find the newly created PlacementContract file
                    const contractFile = (this.entity.files || []).find(
                        (f) =>
                            f.fileType?.code ===
                                CandidateFileType.PlacementContract &&
                            !existingFileIds.has(f.id),
                    );

                    // Create history entry with new fields
                    await this.candidateJobOfferHistoryService
                        .candidateJobOfferHistoryControllerCreateHistoryEntry({
                            createCandidateJobOfferHistoryRequest: {
                                candidateId: this.entity.id,
                                jobOfferId:
                                    dialogResponse.selectedJobOffer.id,
                                action: 'LINKED',
                                candidateFirstName: this.entity.firstName,
                                candidateLastName: this.entity.lastName,
                                startDate: dialogResponse.startDate,
                                contractFileId: contractFile?.id,
                            },
                        })
                        .toPromise();

                    await this.sendPlacedCandidateReviewEmail();

                    // Reload full entity with all relations
                    await this.reloadData();
                    
                    // Refresh placement history component
                    if (this.placementHistory?.loadHistory) {
                        await this.placementHistory.loadHistory();
                    }
                } catch (error) {
                    console.error('Error during placement flow:', error);
                    this.dialogService.showDialog(
                        'An error occurred during the placement process. Please check the data and try again.',
                    );
                } finally {
                    this.loading = false;
                }
            } else {
                // User cancelled the dialog, revert the status change
                this.entity.candidateStatusId = this.entity.candidateStatus?.id;
            }
        } else {
            // For other status changes, clear the placed job offer if status is not "Placed"
            if (this.entity.placedJobOfferId) {
                await this.candidateJobOfferHistoryService
                    .candidateJobOfferHistoryControllerCreateHistoryEntry({
                        createCandidateJobOfferHistoryRequest: {
                            candidateId: this.entity.id,
                            jobOfferId: this.entity.placedJobOfferId,
                            action: 'UNLINKED',
                            candidateFirstName: this.entity.firstName,
                            candidateLastName: this.entity.lastName,
                        },
                    })
                    .toPromise();

                this.entity.placedJobOfferId = null;
            }

            // For other status changes, proceed normally
            this.hasPendingModifications = true;
            this.modifyStatus = !this.modifyStatus;
            await this.save();
        }
    }

    onJobStatusChange() {
        // Refresh the candidate data to get updated job statuses
        this.reloadData();
    }

    // Candidate Job Status Management Methods
    hasPendingJobs(): boolean {
        return (
            this.entity?.candidateJobs?.some(
                (job) => job.status === CandidateJobStatus.PENDING,
            ) || false
        );
    }

    async validateAllJobs() {
        if (!this.entity?.candidateJobs?.length) return;

        const pendingJobs = this.entity.candidateJobs.filter(
            (job) => job.status === CandidateJobStatus.PENDING,
        );
        if (!pendingJobs.length) return;

        const updates = pendingJobs.map((job) => ({
            candidateJobId: job.id,
            status: CandidateJobStatus.VALIDATED,
        }));

        await this.updateCandidateJobStatuses(updates);
    }

    async refuseAllJobs() {
        if (!this.entity?.candidateJobs?.length) return;

        const pendingJobs = this.entity.candidateJobs.filter(
            (job) => job.status === CandidateJobStatus.PENDING,
        );
        if (!pendingJobs.length) return;

        const updates = pendingJobs.map((job) => ({
            candidateJobId: job.id,
            status: CandidateJobStatus.REFUSED,
        }));

        await this.updateCandidateJobStatuses(updates);
    }

    private async updateCandidateJobStatuses(
        updates: Array<{
            candidateJobId: string;
            status: 'VALIDATED' | 'REFUSED' | 'PENDING';
        }>,
    ) {
        try {
            this.loading = true;

            const response = await this.candidateService
                .updateCandidateJobsStatus({
                    updateCandidateJobsStatusRequest: {
                        candidateId: this.entity.id,
                        candidateJobUpdates: updates,
                    },
                })
                .toPromise();

            if (response.success) {
                // Update the local entity with the response data
                this.entity = response.candidate;
                this.hasPendingModifications = true;

                // Show success message
                this.dialogService.showDialog(
                    this.translateService.instant('Candidate.JobStatusUpdated'),
                );
            } else {
                this.dialogService.showDialog(
                    response.message || 'Error updating job statuses',
                );
            }
        } catch (error) {
            console.error('Error updating candidate job statuses:', error);
            this.dialogService.showDialog('Error updating job statuses');
        } finally {
            this.loading = false;
        }
    }

    checkOutsideClick() {
        this.renderer.listen('window', 'click', (e: Event) => {
            const toggleButton = this.toggleStatus?._elementRef?.nativeElement;
            const field = this.fieldStatus?._elementRef?.nativeElement;

            let iconIfExist: any;
            let testInput: boolean;

            if (toggleButton?.children) {
                const property: any = Object.values(toggleButton?.children);
                iconIfExist = property[0].children[0];
            }

            if (field?.children) {
                const x: any = Object.values(field.children);
                if (x[0]) {
                    const y: any = Object.values(x[0].children);
                    if (y) {
                        const z: any = Object.values(y[0].children);
                        const z_second: any = Object.values(y[1].children);

                        if (z) {
                            const w: any = Object.values(z[0].children);
                            if (w) testInput = w[0] === e.target;
                        }
                        if (z_second[0] === e.target) {
                            testInput = z_second[0] === e.target;
                        }
                    }

                    if (x[0].children[0] === e.target)
                        testInput = x[0].children[0] === e.target;

                    if (
                        x[0].parentElement === e.target ||
                        x[0].parentElement.parentElement === e.target ||
                        x[0].parentElement.parentElement.parentElement ===
                            e.target ||
                        x[0].children[1] === e.target
                    ) {
                        testInput = true;
                    }
                }
            }

            const testIcon = iconIfExist && iconIfExist === e.target;
            const testButton =
                toggleButton?.children &&
                (toggleButton === e.target ||
                    Object.values(toggleButton?.children)?.includes(e.target));

            this.modifyStatus =
                testButton || testIcon
                    ? true
                    : this.modifyStatus && testInput
                    ? true
                    : false;
        });
    }

    getStatusColor() {
        if (!this.entity) {
            return;
        }

        let color: string;

        switch (this.entity.candidateStatus?.code) {
            case CandidateStatus.Placed:
                color = 'statut-btn-blue';
                break;
            case CandidateStatus.Referenced:
                color = 'statut-btn-green';
                break;
            case CandidateStatus.BeingReferenced:
                color = 'statut-btn-border';
                break;
            case CandidateStatus.ToBeReferenced:
                color = 'statut-btn-red';
                break;
            case CandidateStatus.NotSelected:
                color = 'statut-btn-black';
                break;
            case CandidateStatus.InProcess:
                color = 'statut-btn-yellow';
                break;
        }

        return 'statut-btn ' + color;
    }

    async onArchive() {
        const dialogResult = await this.dialogService.showConfirmDialog(
            this.translateService.instant('Dialog.ArchiveCandidate'),
            { okLabel: 'Global.Yes', cancelLabel: 'Global.No' },
        );

        if (!dialogResult.okClicked) {
            return;
        }

        this.entity.disabled = true;
        this.loading = true;
        const response = await this.candidateService
            .archiveCandidates({ requestBody: [this.entity.id] })
            .toPromise();
        this.loading = false;

        if (response.success) {
            this.dialogService.showSnackBar(
                this.translateService.instant('Dialog.CandidateBeenArchived'),
            );
        } else {
            //TODO : translate
            this.dialogService.showSnackBar(response.message);
        }
    }
    async removeCandidate() {
        const dialog = await this.dialogService.showConfirmDialog(
            this.translateService.instant('Dialog.RemoveCandidate'),
            { okLabel: 'Global.Yes', cancelLabel: 'Global.No' },
        );

        if (!dialog.okClicked) {
            return;
        }

        this.loading = true;

        const removeCandidateResponse = await this.candidateService
            .deleteCandidates({ ids: this.entity.id })
            .toPromise();

        this.loading = false;

        if (!removeCandidateResponse.success) {
            return this.dialogService.showDialog(
                removeCandidateResponse.message,
            );
        }

        this.router.navigateByUrl('/' + RoutesList.CandidatesList);
    }

    capitalize(str: string) {
        if (!str) {
            return;
        }

        return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
    }

    onLoading(loading: boolean) {
        this.loading = loading;
    }

    onModification(hasPendingModifications: boolean) {
        this.hasPendingModifications = hasPendingModifications;
    }

    async saveToggle() {
        if (!this.hasPendingModifications) {
            this.hasPendingModifications = true;
        }

        await this.save();
    }

    async openNoteDialog(item: JobReferenceDto) {
        const dialog = await this.dialogService.showPromptDialog(
            this.translateService.instant('Candidate.Comment'),
            {
                title: '',
                inputLabel: this.translateService.instant(
                    'Candidate.AddComment',
                ),
                inputType: 'text',
                initialValue: item.note,
                okLabel: this.translateService.instant('JobReference.Confirm'),
                cancelLabel: this.translateService.instant('Global.Cancel'),
                showTextArea: true,
            },
        );

        if (dialog.cancelClicked) {
            return;
        }

        item.note = dialog.result;
        this.loading = true;
        const saveJobReferenceResponse = await this.jobReferenceService
            .createOrUpdateJobReference({ jobReferenceDto: item })
            .toPromise();
        this.loading = false;

        if (!saveJobReferenceResponse.success) {
            this.dialogService.showDialog(saveJobReferenceResponse.message);

            return;
        }

        this.dialogService.showSnackBar(
            this.translateService.instant('Candidate.CommentHasBeenSaved'),
        );
    }

    async setAdvancementPercentManually() {
        this.loading = true;
        this.entity.manuallyCompleted = true;
        this.hasPendingModifications = true;
        await this.save();
        this.loading = false;
    }

    async setAdvancementPercentAuto() {
        this.loading = true;
        this.entity.manuallyCompleted = false;
        this.hasPendingModifications = true;
        await this.save();
        this.loading = false;
    }

    async openSendToCustomerDialog() {
        // if (environment.production) {
        //     //TODO : remove when tests OK
        //     this.dialogService.showDialog('Bientôt disponible');
        //     return;
        // }

        const mustReload = this.setAdditionalParameters(2);
        await this.reloadData();

        const dialogData: SendFolderCustomerDialogData = {
            candidate: this.entity,
            mode: 'sendCandidate',
        };

        await this.dialogService.showCustomDialogAwaitable({
            component: SendFolderCustomerDialogComponent,
            exitOnClickOutside: false,
            data: dialogData,
            minHeight: '80vh',
            minWidth: '70vw',
        });
    }

    async showCandidateStatusHistory() {
        const dialogData: GetAllHistoriesRequestParams = {
            entityId: this.entity.id,
        };

        await this.dialogService.showCustomDialogAwaitable({
            component: CandidateStatusHistoriesDialogComponent,
            exitOnClickOutside: true,
            data: dialogData,
        });
    }

    getReferenceValidatedLabel(): string {
        if (this.entity.referencesValidated == null) {
            return this.translateService.instant('Experience.ToValidate');
        }

        return this.translateService.instant(
            this.entity.referencesValidated
                ? 'Experience.RefValidated'
                : 'Experience.RefNotValidated',
        );
    }

    async setReferenceValidated(value: boolean) {
        if (this.entity.referencesValidated === value) {
            return;
        }

        this.entity.referencesValidated = value;
        this.hasPendingModifications = true;
        await this.save(false, true);
    }

    onNewsletterToggleChange() {
        this.entity.newsletterUnsubscribed = !this.isSubscribedToNewsletter;
        this.saveToggle();
    }

    async openSendAvailabilityDialog() {
        // const mustReload = this.setAdditionalParameters(2);
        // await this.reloadData();

        const dialogData: SendAvailabilityDialogData = {
            candidate: this.entity,
        };

        await this.dialogService.showCustomDialogAwaitable({
            component: SendAvailabilityDialogComponent,
            exitOnClickOutside: false,
            data: dialogData,
            minHeight: '80vh',
            minWidth: '70vw',
        });
    }

    async showProcessWarningDialog(): Promise<void> {
        const dialogData: CandidateProcessWarningDialogData = {
            candidateName: `${this.entity.firstName} ${this.entity.lastName}`,
            warningType: this.entity.candidateStatus?.code as
                | CandidateStatus.InProcess
                | CandidateStatus.NotSelected,
        };

        await this.dialogService.showCustomDialogAwaitable<CandidateProcessWarningDialogResponse>(
            {
                component: CandidateProcessWarningDialogComponent,
                data: dialogData,
                exitOnClickOutside: false,
                width: '600px',
            },
        );
    }

    private async sendPlacedCandidateReviewEmail(): Promise<void> {
        try {
            if (!this.entity.email || !this.entity.firstName) {
                console.warn(
                    'Cannot send review email: missing email or firstName',
                );
                return;
            }

            this.loading = true;

            // Call the backend service to send the review request email
            // Note: This method will be available once the API client is regenerated
            const sendMailResponse = await this.sendApiRequest(
                this.interviewsService.interviewsControllerSendPlacedCandidateReviewEmail(
                    {
                        candidateId: this.entity.id,
                    },
                ),
            );

            this.loading = false;

            if (sendMailResponse.success) {
                console.log(
                    '✅ Review request email sent successfully to placed candidate',
                );
                this.dialogService.showSnackBar(
                    this.translateService.instant(
                        'Candidate.ReviewRequestEmailSent',
                    ) || 'Review request email sent successfully',
                );
            } else {
                const errorMessage =
                    sendMailResponse?.message || 'Unknown error occurred';
                console.error(
                    '❌ Failed to send review request email:',
                    errorMessage,
                );
                this.dialogService.showDialog(
                    'Failed to send review request email: ' + errorMessage,
                );
            }
        } catch (error) {
            this.loading = false;
            console.error('❌ Error in review request email flow:', error);
            this.dialogService.showDialog('Error in review request email flow');
        }
    }
}
