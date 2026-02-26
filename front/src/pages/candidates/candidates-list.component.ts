import {
    Component,
    ElementRef,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'nextalys-angular-tools';
import { DateHelpers, MainHelpers } from 'nextalys-js-helpers';
import { BrowserFileHelpers } from 'nextalys-js-helpers/dist/browser-file-helpers';
import { ImagesHelper } from '../../../../shared/images.helper';
import { RefData } from '../../../../shared/ref-data';
import {
    AppTypes,
    CandidateStatus,
    JobHousedEnum,
    RequestLocalStorageKeys,
    RolesList,
} from '../../../../shared/shared-constants';
import { BaseSimpleList } from '../../components/base/base-simple-list.component';
import { BaseRequest } from '../../components/base/base-types';
import {
    SendFolderCustomerDialogComponent,
    SendFolderCustomerDialogData,
} from '../../components/send-folder-customer/send-folder-dialog.component';
import { ArchiveFakeAppValueCode } from '../../environments/constants';
import { environment } from '../../environments/environment';
import {
    AppValueDto,
    GenericResponse,
    JobOffersService,
    UserDto,
    UsersService,
} from '../../providers/api-client.generated';
import { CandidatesService } from '../../providers/api-client.generated/api/candidates.service';
import { CandidateDto } from '../../providers/api-client.generated/model/candidateDto';
import { LocalStorageService } from '../../providers/local-storage.service';
import { ReferentialProvider } from '../../providers/referential.provider';
import { Department } from '../../services/geo.service';

interface YearsRange {
    label: string;
    min: Date;
    max: Date;
}

interface ChildrenYearsRange {
    label: string;
    min: number;
    max: number;
}

interface LanguageRequest {
    language?: string;
    level?: string;
}

interface GetCandidatesRequest extends BaseRequest {
    jobIds: string[];
    genderId: string;
    nationality: string;
    candidateAge: number;
    jobHoused: 'true' | 'false' | 'null';
    driverLicence: 'true' | 'false';
    mobilityCountries: string[];
    mobilityDepartments: string[];
    isAvailable: 'true' | 'false';
    // dependentChildren: 'true' | 'false';
    pets: 'true' | 'false';
    jobOfferId: string;
    selectedCandidateStatutList: string[];
    contractTypesId: string[];
    locations: string[];
    licences: string[];
    // languages: string[];
    status: 'true' | 'false' | 'all';
    city: string[];
    department: string;
    isVehicle: 'true' | 'false';
    consultantIds: string[];
    languages: LanguageRequest[];
    globalMobility: 'true' | 'false';
    note: number;
    hasManyTravel: 'true' | 'false' | 'all';
    selectedAgeRangeWrapper?: YearsRange;
    selectedChildrenAgeRangeWrapper: ChildrenYearsRange;
}
@Component({
    selector: 'app-list-candidates',
    templateUrl: './candidates-list.component.html',
    styleUrls: [
        '../../components/base/base-simple-list.component.scss',
        'candidates-list.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class ListCandidatesComponent extends BaseSimpleList<
    CandidateDto,
    GetCandidatesRequest
> {
    // selectedAgeRangeWrapper: YearsRange;
    consultantsList: UserDto[];
    levelLanguageList: AppValueDto[];
    selectedMobilityDepartment: Department;

    // workingTypeList: AppValueDto[] = [];
    candidates: CandidateDto[] = [];
    jobCategoriesList: AppValueDto[] = [];
    candidateStatusList: AppValueDto[] = [];
    genderList: AppValueDto[] = [];
    contractTypeList: AppValueDto[] = [];
    licencesList: AppValueDto[] = [];
    ageWrapperList: YearsRange[] = [];
    childrenAgeWrapperList: ChildrenYearsRange[] = [];
    noteList: { label: string; value: number }[] = [];
    newLanguage: LanguageRequest = {};
    showNoFiltersMessage: boolean = false;
    showNoCandidatesFoundMessage: boolean = false;
    isOnlyConsultant: boolean = false;

    RefData = RefData;
    countriesList = RefData.countriesListForCurrentLanguage;
    CandidateStatus = CandidateStatus;
    ImagesHelper = ImagesHelper;
    candidateLanguageList = RefData.languages;
    JobHousedEnum = JobHousedEnum;

    @ViewChild('filterList') filterList: ElementRef;

    constructor(
        dialogService: DialogService,
        private candidatesService: CandidatesService,
        private referentialProvider: ReferentialProvider,
        private jobOfferService: JobOffersService,
        private userService: UsersService,
        private route: ActivatedRoute,
        private router: Router,
        private translate: TranslateService,
    ) {
        super('candidates', dialogService, false);
        this.loadFilterData();
        this.createRangeDate();
        this.privateChildrenRange();

        this.subscribeToObservable(this.datasourceLoaded, () => {
            try {
                for (const item of this.items) {
                    if (item.mainPhotoBase64) {
                        item.mainPhotoBase64 =
                            BrowserFileHelpers.base64ToDataUri(
                                item.mainPhotoBase64,
                                item.mainPhotoBase64MimeType,
                            );
                    }
                }
            } catch (err) {}

            LocalStorageService.saveObjectInLocalStorage(
                RequestLocalStorageKeys.Candidates,
                this.request,
            );
        });
    }

    ngOnInit() {
        this.request =
            LocalStorageService.getObjectFromLocalStorage(
                RequestLocalStorageKeys.Candidates,
            ) || ({} as GetCandidatesRequest);

        // Ensure city is always an array
        if (!Array.isArray(this.request.city)) {
            this.request.city = [];
        }

        if (this.request.mobilityDepartments?.length) {
            this.selectedMobilityDepartment = {
                num: this.request.mobilityDepartments[0],
                country: '',
                name: '',
            };
        }

        // Check if user is a consultant (not admin/admintech/rh)
        const canSeeConsultantFilter =
            this.GlobalAppService.userHasOneOfRoles(
                this.AuthDataService.currentUser,
                [RolesList.Admin, RolesList.AdminTech, RolesList.RH],
            );
        this.isOnlyConsultant = !canSeeConsultantFilter;

        // If consultant and no consultant filter already set, default to themselves
        if (this.isOnlyConsultant && !this.request.consultantIds?.length) {
            this.request.consultantIds = [this.AuthDataService.currentUser.id];
        }

        if (this.request.consultantIds?.length) {
            this.setQueryFromFilters();
        }
        //search must not be saved
        this.request.search = '';

        if (this.request.selectedAgeRangeWrapper)
            this.request.selectedAgeRangeWrapper = this.ageWrapperList.find(
                (x) => x.label === this.request.selectedAgeRangeWrapper.label,
            );

        if (this.request.selectedChildrenAgeRangeWrapper)
            this.request.selectedChildrenAgeRangeWrapper =
                this.childrenAgeWrapperList.find(
                    (x) =>
                        x.label ===
                        this.request.selectedChildrenAgeRangeWrapper.label,
                );

        this.loadFilterData();
        this.setQueryFromFilters();
        this.loadData();
    }

    private async loadFilterData() {
        this.loading = true;
        const appTypes = await this.referentialProvider.getTypesValues(
            [
                AppTypes.ContractTypeCode,
                AppTypes.PersonGenderCode,
                // AppTypes.JobCategoryCode,
                AppTypes.CandidateStatusCode,
                AppTypes.ContractTimeType,
                AppTypes.LicenceTypeCode,
                AppTypes.LevelLanguageCode,
            ],
            true,
        );

        // this.jobCategoriesList = appTypes.find(x => x.code === AppTypes.JobCategoryCode).appValues;
        this.candidateStatusList = appTypes.find(
            (x) => x.code === AppTypes.CandidateStatusCode,
        ).appValues;
        this.levelLanguageList = appTypes
            .find((x) => x.code === AppTypes.LevelLanguageCode)
            ?.appValues?.sort((a, b) => a.order - b.order);

        await this.referentialProvider.addArchivedFakeAppValue(
            this.candidateStatusList,
        );
        const getConsultantResponse =
            await this.GlobalAppService.getConsultantOrRHList(
                this.userService,
                this,
            );
        this.consultantsList = getConsultantResponse.users;

        this.subscribeToObservable(this.route.queryParams, (params) => {
            //console.log("🚀 ~ ListCandidatesComponent ~ loadFilterData ~ params", params);
            this.setFiltersFromQuery(params);
            this.loadData();
        });

        this.genderList = appTypes.find(
            (x) => x.code === AppTypes.PersonGenderCode,
        ).appValues;
        this.contractTypeList = appTypes.find(
            (x) => x.code === AppTypes.ContractTypeCode,
        ).appValues;
        this.licencesList = appTypes.find(
            (x) => x.code === AppTypes.LicenceTypeCode,
        ).appValues;

        this.loadNoteValue();

        // this.workingTypeList = getTypesValuesResponse.appTypes.find(x => x.code === AppTypes.ContractTimeType).appValues;
        // this.loading = false;
    }

    private loadNoteValue() {
        for (let i = 1; i <= 5; i++) {
            this.noteList.push({
                value: i,
                label: i.toString(),
            });
        }
    }

    setQueryFromFilters() {
        this.setQueryParameters(this.router, this.route, {
            consultantIds: this.request.consultantIds,
        });
    }
    private setFiltersFromQuery(params: Params) {
        if (!this.request.consultantIds?.length)
            this.request.consultantIds = [];

        if (params.consultantIds) {
            this.request.consultantIds = [];
            let consultantIdsParameter = params.consultantIds;
            if (!Array.isArray(consultantIdsParameter))
                consultantIdsParameter = [consultantIdsParameter];
            for (const consultantId of consultantIdsParameter) {
                const consultantIdFromList = this.consultantsList.find(
                    (x) => x.id === consultantId,
                )?.id;
                if (consultantIdFromList)
                    this.request.consultantIds.push(consultantId);
            }
        }
    }
    public isExpandedAfterLoadingData(): boolean {
        return false;
    }

    /**
     * Checks if any filters are applied to prevent loading all candidates
     * Note: consultantIds is excluded when user is a consultant since it's auto-applied
     */
    private hasAnyFiltersApplied(): boolean {
        return !!(
            this.request.jobIds?.length ||
            this.request.genderId ||
            this.request.nationality ||
            this.request.selectedAgeRangeWrapper ||
            this.request.jobHoused ||
            this.request.contractTypesId?.length ||
            this.request.licences?.length ||
            this.request.locations?.length ||
            this.request.city?.length ||
            this.request.department ||
            this.request.selectedCandidateStatutList?.length ||
            this.request.consultantIds?.length ||
            this.request.languages?.length ||
            this.request.isAvailable ||
            this.request.note ||
            this.request.search?.trim()
        );
    }

    public async loadCustomData(): Promise<GenericResponse> {
        // Prevent loading all candidates without filters
        if (!this.hasAnyFiltersApplied()) {
            this.showNoFiltersMessage = true;
            this.showNoCandidatesFoundMessage = false; // Reset no-candidates state when no filters
            return {
                success: true,
                candidates: [],
                filteredResults: 0,
                message:
                    'Please apply at least one filter to search candidates',
            } as GenericResponse;
        }

        this.showNoFiltersMessage = false;
        this.showNoCandidatesFoundMessage = false;

        let statusList = this.request.selectedCandidateStatutList?.filter(
            (x) => x !== ArchiveFakeAppValueCode,
        );
        if (!statusList?.length) statusList = [];

        if (
            this.request.mobilityCountries &&
            (this.request.mobilityCountries[0] as any) === 0
        )
            this.request.mobilityCountries.shift();

        // this.request.orderby = 'modifDate';
        // this.request.order = 'desc';

        const getAllCandidateResponse = await this.candidatesService
            .getAllCandidates({
                getCandidatesRequest: {
                    start: this.request.start,
                    length: this.request.length,
                    orderby: this.request.orderby,
                    order: this.request.order,
                    search: this.request.search,
                    candidateStatut: statusList?.length
                        ? statusList.join(',')
                        : null,
                    // jobOfferRef: this.request.jobOfferId?.toString() ?? undefined,
                    candidateGender:
                        this.request.genderId?.toString() ?? undefined,
                    candidateNationality: this.request.nationality ?? undefined,
                    candidateMinYear: !!this.request.selectedAgeRangeWrapper
                        ?.min
                        ? DateHelpers.formatDateISO8601(
                              this.request.selectedAgeRangeWrapper.min,
                          )
                        : undefined,
                    candidateMaxYear: !!this.request.selectedAgeRangeWrapper
                        ?.max
                        ? DateHelpers.formatDateISO8601(
                              this.request.selectedAgeRangeWrapper.max,
                          )
                        : undefined,
                    jobHoused: this.request.jobHoused ?? undefined,
                    driverLicence: this.request.driverLicence ?? undefined,
                    mobilityCountries:
                        this.request.mobilityCountries?.toString(),
                    mobilityDepartments:
                        this.request.mobilityDepartments?.toString(),
                    // dependantChildren: this.request.dependentChildren ?? undefined,
                    pets: this.request.pets ?? undefined,
                    contractType: this.request.contractTypesId?.join(','),
                    jobIds: this.request.jobIds?.join(','),
                    isAvailable: this.request.isAvailable ?? undefined,
                    candidateLocation: this.request.locations?.toString(),
                    licencesIds: this.request.licences?.join(','),
                    childrenMaxAge:
                        this.request.selectedChildrenAgeRangeWrapper?.max?.toString() ??
                        undefined,
                    childrenMinAge:
                        this.request.selectedChildrenAgeRangeWrapper?.min?.toString() ??
                        undefined,
                    // languagesIds: this.request.languages?.join(','),
                    includePercentageAdvancement: 'false',
                    disabled: this.request.selectedCandidateStatutList?.some(
                        (x) => x === ArchiveFakeAppValueCode,
                    )
                        ? 'true'
                        : 'false',
                    city: this.request.city?.length ? this.request.city : null,
                    department: this.request.department,
                    isVehicle: this.request.isVehicle,
                    consultantIds: this.request.consultantIds?.join(','),
                    languages: this.request.languages,
                    globalMobility: this.request.globalMobility,
                    note: this.request.note,
                    hasManyTravel:
                        this.request.hasManyTravel === 'true' ||
                        this.request.hasManyTravel === 'false'
                            ? this.request.hasManyTravel
                            : undefined,
                },
            })
            .toPromise();

        if (getAllCandidateResponse.success) {
            if (getAllCandidateResponse.candidates?.length) {
                for (const candidate of getAllCandidateResponse.candidates) {
                    const searchJobs = candidate.candidateJobs?.filter(
                        (x) => x.inActivity,
                    );
                    if (searchJobs?.length >= 2)
                        candidate.candidateJobs = searchJobs
                            ?.sort(
                                (a, b) =>
                                    b.experienceEndDate?.getTime() -
                                    a.experienceEndDate?.getTime(),
                            )
                            ?.slice(0, 2);

                    candidate.city = candidate.addresses[0]?.city;
                    candidate.jobTitle =
                        candidate.candidateCurrentJobs[0]?.currentJob?.translations[0]?.value;
                }

                // getAllCandidateResponse.candidates?.sort(function (a,b){
                //     if(a.jobTitle < b.jobTitle) return -1;
                //     if(a.jobTitle > b.jobTitle) return 1;

                //     return a.city?.localeCompare(b.city);
                // })
            } else {
                // No candidates found with current filters
                this.showNoCandidatesFoundMessage = true;
            }
        }

        return getAllCandidateResponse;
    }

    public getAgeCandidates(numberDays: number) {
        if (!numberDays) return;
        const yearCountDays = 365;
        const divideResult = Math.floor(numberDays / yearCountDays).toFixed(0);
        return divideResult;
    }

    public getAge(birthdate: Date) {
        if (!birthdate) return;
        return DateHelpers.getAge(birthdate);
    }

    private createRangeDate() {
        this.ageWrapperList.push(
            this.createAgeRange(18, 30),
            this.createAgeRange(31, 40),
            this.createAgeRange(41, 50),
            this.createAgeRange(51, 60),
            this.createAgeRange(61, 70),
            this.createAgeRange(70, 90),
        );
    }

    private createAgeRange(from: number, to?: number): YearsRange {
        return {
            label: from + ' - ' + to,
            min: this.removeYearsFromNow(from),
            max: this.removeYearsFromNow(to ?? 100),
        };
    }

    async privateChildrenRange() {
        this.childrenAgeWrapperList.push(
            await this.createChildrenAgeRange(null, 0),
            await this.createChildrenAgeRange(0, 5),
            await this.createChildrenAgeRange(6, 10),
            await this.createChildrenAgeRange(11, 16),
            await this.createChildrenAgeRange(16, null),
        );
    }

    private async createChildrenAgeRange(
        min: number,
        max: number,
    ): Promise<ChildrenYearsRange> {
        if (max === null) {
            return {
                label:
                    min +
                    ' ' +
                    (await this.translate
                        .get('Candidate.ChildrenFilter')
                        .toPromise()),
                min: min,
                max: undefined,
            };
        }
        if (min === null) {
            return {
                label: await this.translate.get('Candidate.Nobody').toPromise(),
                min: undefined,
                max: max,
            };
        }
        return {
            label:
                (await this.translate.get('Candidate.From').toPromise()) +
                ' ' +
                min +
                '  ' +
                (await this.translate.get('Candidate.To').toPromise()) +
                ' ' +
                max +
                ' ' +
                (await this.translate.get('Candidate.Years').toPromise()),
            min: min,
            max: max,
        };
    }

    private removeYearsFromNow(years: number) {
        const countOfMonthsToRemove = -(12 * years);
        return DateHelpers.addMonthsToDate(new Date(), countOfMonthsToRemove);
    }

    /**
     * Handles the search button click - triggers the search with all current filters
     */
    onSearchButtonClick() {
        this.loadData();
    }

    newLanguageChange() {
        if (!this.newLanguage.language) return;

        if (!this.request.languages) this.request.languages = [];

        this.request.languages.push(MainHelpers.cloneObject(this.newLanguage));
        setTimeout(() => {
            this.newLanguage.language = null;
        }, 0);

        this.loadData();
    }

    removeLanguage(language: LanguageRequest) {
        const index = this.request.languages.findIndex((x) => x === language);
        if (index !== -1) {
            this.request.languages.splice(index, 1);
            this.loadData();
        }
    }

    async openSendToCustomerDialog() {
        if (environment.production) {
            //TODO : remove when tests OK
            this.dialogService.showDialog('Bientôt disponible');
            return;
        }
        const dialogData: SendFolderCustomerDialogData = {
            mode: 'sendResumes',
        };

        await this.dialogService.showCustomDialogAwaitable({
            component: SendFolderCustomerDialogComponent,
            exitOnClickOutside: false,
            data: dialogData,
            minHeight: '80vh',
            minWidth: '70vw',
        });
    }

    onSelectedDepartment(dptNum?: string) {
        console.log(
            'Log ~ file: candidates-list.component.ts:409 ~ ListCandidatesComponent ~ onSelectedDepartment ~ dptNum',
            dptNum,
        );
        if (!dptNum) {
            dptNum = this.selectedMobilityDepartment?.num;
        }
        this.request.mobilityDepartments = [];
        if (dptNum) {
            this.request.mobilityDepartments.push(dptNum);
        }
        this.loadDataDelayed();
    }

    onPageChange(event: PageEvent) {
        this.request.start = event.pageIndex * event.pageSize;
        this.request.length = event.pageSize;
        this.loadData(false);
    }

    resetFilters() {
        this.request = {
            start: 0,
            length: 20,
        } as GetCandidatesRequest;
        this.request.languages = [];
        this.request.city = [];
        this.newLanguage = {};
        this.selectedMobilityDepartment = null;

        // Re-apply consultant default on reset
        if (this.isOnlyConsultant) {
            this.request.consultantIds = [this.AuthDataService.currentUser.id];
        }

        LocalStorageService.saveObjectInLocalStorage(
            RequestLocalStorageKeys.Candidates,
            this.request,
        );

        this.setQueryFromFilters();
        this.loadData();
    }
}
