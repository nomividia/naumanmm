/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/await-thenable */
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateHelpers } from 'nextalys-js-helpers';
import { BrowserFileHelpers } from 'nextalys-js-helpers/dist/browser-file-helpers';
import { RefData } from '../../../../shared/ref-data';
import {
    AppTypes,
    RequestLocalStorageKeys,
    RolesList,
} from '../../../../shared/shared-constants';
import { CandidateApplicationListMinified } from '../../components/candidate-application-list/candidate-applications-list-minified.component';
import {
    AppValueDto,
    CandidateApplicationDto,
    GetAllCandidateApplicationsRequestParams,
    JobOfferDto,
    JobOffersService,
    UserDto,
    UsersService,
} from '../../providers/api-client.generated';
import { LocalStorageService } from '../../providers/local-storage.service';
import { ReferentialProvider } from '../../providers/referential.provider';
import { BasePageComponent } from '../base/base-page.component';

export interface CandidateApplicationsRequestParamsCustom extends GetAllCandidateApplicationsRequestParams {
    applyStatusListSelected?: string[];
    jobOfferSelected?: JobOfferDto;
    candidateStatusListSelected?: string[];
    cityArray?: string[];
    locationsArray?: string[];
}

@Component({
    selector: 'app-candidate-applications',
    templateUrl: './candidate-applications-list.component.html',
    styleUrls: ['./candidate-applications-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ListCandidateApplicationsComponent extends BasePageComponent {
    candidateListComponent: CandidateApplicationListMinified;
    jobOfferSelected: JobOfferDto;

    // applyStatusListSelected: string[] = [];
    request: CandidateApplicationsRequestParamsCustom = {};
    candidateApplications: CandidateApplicationDto[] = [];
    applyStatusFullList: AppValueDto[] = [];
    candidateStatusFullList: AppValueDto[] = [];
    jobCategoriesList: AppValueDto[] = [];
    consultantsList: UserDto[] = [];
    countriesList: { code: string; label: string }[] = [];
    showNoFiltersMessage: boolean = false;
    showNoApplicationsFoundMessage: boolean = false;
    isOnlyConsultant: boolean = false;

    DateHelpers = DateHelpers;
    BrowserFileHelpers = BrowserFileHelpers;

    typesLoaded = false;

    @ViewChild('candidateListComponent') set setCandidateListComponent(
        value: CandidateApplicationListMinified,
    ) {
        this.candidateListComponent = value;

        if (this.candidateListComponent) {
            this.subscribeToObservable(
                this.candidateListComponent.datasourceLoaded,
                () => {
                    LocalStorageService.saveObjectInLocalStorage(
                        RequestLocalStorageKeys.CandidateApplication,
                        this.request,
                    );

                    // Update empty state based on results
                    if (
                        this.hasAnyFiltersApplied() &&
                        (!this.candidateListComponent.items ||
                            this.candidateListComponent.items.length === 0)
                    ) {
                        this.showNoApplicationsFoundMessage = true;
                    } else {
                        this.showNoApplicationsFoundMessage = false;
                    }
                },
            );
        }
    }

    constructor(
        private refProvider: ReferentialProvider,
        private router: Router,
        private route: ActivatedRoute,
        private jobOfferService: JobOffersService,
        private userService: UsersService,
    ) {
        super();
    }

    ngOnInit() {
        const storedRequest = LocalStorageService.getObjectFromLocalStorage(
            RequestLocalStorageKeys.CandidateApplication,
        );

        // Try to get from native localStorage first to avoid type conversion issues
        let nativeStoredRequest = null;
        try {
            const nativeStored = localStorage.getItem(
                RequestLocalStorageKeys.CandidateApplication,
            );
            if (nativeStored) {
                nativeStoredRequest = JSON.parse(nativeStored);
            }
        } catch (error) {
            console.error('Error reading from native localStorage:', error);
        }

        // Use native localStorage data if available, otherwise fall back to LocalStorageService
        const finalStoredRequest = nativeStoredRequest || storedRequest;

        // Initialize with empty object if nothing stored
        this.request = finalStoredRequest || {};

        // Ensure these fields exist with proper defaults
        this.request.jobOfferRef = this.request.jobOfferRef || undefined;
        this.request.jobOfferId = this.request.jobOfferId || undefined;
        this.request.applyStatusListSelected =
            this.request.applyStatusListSelected || [];
        this.request.candidateStatusListSelected =
            this.request.candidateStatusListSelected || [];
        this.request.applyInCouple = this.request.applyInCouple || undefined;
        this.request.search = this.request.search || '';

        // Initialize location filters
        this.request.cityArray = this.request.cityArray || [];
        this.request.locationsArray = this.request.locationsArray || [];
        this.request.department = this.request.department || undefined;

        // Initialize countries list (uses pre-sorted list with priority countries at top)
        this.countriesList = RefData.countriesListForCurrentLanguage;

        // Handle jobCategory - it can be a string (from API) or array (from UI)
        if (this.request.jobCategory) {
            if (typeof this.request.jobCategory === 'string') {
                // Convert string to array
                (this.request as any).jobCategory = this.request.jobCategory
                    .split(',')
                    .filter((id) => id.trim());
            } else if (Array.isArray(this.request.jobCategory)) {
                (this.request as any).jobCategory = this.request.jobCategory;
            } else {
                (this.request as any).jobCategory = [];
            }
        } else {
            (this.request as any).jobCategory = [];
        }

        // Handle consultantIds - it can be a string (from API) or array (from UI)
        if (this.request.consultantIds) {
            if (typeof this.request.consultantIds === 'string') {
                // Convert string to array
                (this.request as any).consultantIds = this.request.consultantIds
                    .split(',')
                    .filter((id) => id.trim());
            } else if (Array.isArray(this.request.consultantIds)) {
                (this.request as any).consultantIds =
                    this.request.consultantIds;
            } else {
                (this.request as any).consultantIds = [];
            }
        } else {
            (this.request as any).consultantIds = [];
        }

        // Convert string values to boolean for checkboxes
        const showOnlyUnSeenValue = this.request.showOnlyUnSeen;
        const spontaneousApplicationValue = this.request.spontaneousApplication;
        const hideSpontaneousApplicationsValue =
            this.request.hideSpontaneousApplications;
        const onlyNewCandidateValue = this.request.onlyNewCandidate;

        // Properly handle boolean values for checkboxes
        // Handle both boolean and string values from localStorage
        const isShowOnlyUnSeenTrue =
            typeof showOnlyUnSeenValue === 'boolean'
                ? showOnlyUnSeenValue
                : showOnlyUnSeenValue === 'true';
        const isSpontaneousApplicationTrue =
            typeof spontaneousApplicationValue === 'boolean'
                ? spontaneousApplicationValue
                : spontaneousApplicationValue === 'true';
        const isHideSpontaneousApplicationsTrue =
            typeof hideSpontaneousApplicationsValue === 'boolean'
                ? hideSpontaneousApplicationsValue
                : hideSpontaneousApplicationsValue === 'true';
        const isOnlyNewCandidateTrue =
            typeof onlyNewCandidateValue === 'boolean'
                ? onlyNewCandidateValue
                : onlyNewCandidateValue === 'true';

        this.request.showOnlyUnSeen = isShowOnlyUnSeenTrue ? 'true' : 'false';
        this.request.spontaneousApplication = isSpontaneousApplicationTrue
            ? 'true'
            : 'false';
        this.request.hideSpontaneousApplications =
            isHideSpontaneousApplicationsTrue ? 'true' : 'false';
        this.request.onlyNewCandidate = isOnlyNewCandidateTrue
            ? 'true'
            : 'false';

        // Handle job offer selection
        if (this.request.jobOfferId) {
            // Fetch the job offer by ID if only the ID is present
            this.jobOfferService
                .getJobOffer({ id: this.request.jobOfferId })
                .toPromise()
                .then((response) => {
                    if (response.success && response.jobOffer) {
                        this.jobOfferSelected = response.jobOffer;
                    }
                });
        }

        // Check if user is a consultant (not admin/admintech/rh)
        const canSeeConsultantFilter = this.GlobalAppService.userHasOneOfRoles(
            this.AuthDataService.currentUser,
            [RolesList.Admin, RolesList.AdminTech, RolesList.RH],
        );
        this.isOnlyConsultant = !canSeeConsultantFilter;

        // If consultant and no consultant filter already set, default to themselves
        if (this.isOnlyConsultant && !(this.request as any).consultantIds?.length) {
            (this.request as any).consultantIds = [
                this.AuthDataService.currentUser.id,
            ];
        }

        // Load data after localStorage is processed
        this.loadTypes();
        this.loadConsultants();
    }

    private async loadConsultants() {
        const getConsultantResponse =
            await this.GlobalAppService.getConsultantOrRHList(
                this.userService,
                this,
            );
        this.consultantsList = getConsultantResponse.users;
        this.loading = false;
    }

    private async loadTypes() {
        const applyStatusSelectedAppValues: AppValueDto[] = [];
        const candidateStatusSelectedAppValues: AppValueDto[] = [];
        const jobOfferRef = this.route.snapshot.queryParams.jobOfferRef;

        // Load the lists first
        this.applyStatusFullList = await this.refProvider.getTypeValues(
            AppTypes.ApplyStatusCode,
            true,
        );

        this.candidateStatusFullList = await this.refProvider.getTypeValues(
            AppTypes.CandidateStatusCode,
            true,
        );

        await this.refProvider.addArchivedFakeAppValue(
            this.applyStatusFullList,
        );

        await this.refProvider.addArchivedFakeAppValue(
            this.candidateStatusFullList,
        );

        // Handle job offer selection
        if (jobOfferRef) {
            const jobOfferResponse = await this.jobOfferService
                .getJobOfferByRef({ ref: jobOfferRef })
                .toPromise();

            if (jobOfferResponse.success && jobOfferResponse.jobOffer) {
                this.request.jobOfferId = jobOfferResponse.jobOffer.id;
                this.request.jobOfferRef = undefined;
                this.jobOfferSelected = jobOfferResponse.jobOffer;
                // Clear status filters when coming from job offer page
                this.request.applyStatusListSelected = [];
                this.request.candidateStatusListSelected = [];
                // Save the cleared state to localStorage
                LocalStorageService.saveObjectInLocalStorage(
                    RequestLocalStorageKeys.CandidateApplication,
                    this.request,
                );
            }
        }

        // Only set request parameters if filters exist
        if (
            this.request.applyStatusListSelected?.length ||
            this.request.candidateStatusListSelected?.length
        ) {
            this.request.applyStatus =
                this.request.applyStatusListSelected?.join(',');
            this.request.candidateStatus =
                this.request.candidateStatusListSelected?.join(',');
        }

        this.setFilterParameters();
        this.updateEmptyStateFlags();
        this.typesLoaded = true;
    }

    onFiltersChanged(load: boolean = true) {
        this.request.applyStatus =
            this.request.applyStatusListSelected?.join(',');

        // Save to localStorage
        this.saveToLocalStorage();

        // Update empty state flags
        this.updateEmptyStateFlags();

        if (load) {
            this.loadDataComponent();
        }
    }

    onCandidateStatusSelected(load: boolean = true) {
        this.request.candidateStatus =
            this.request.candidateStatusListSelected?.join(',');

        // Save to localStorage
        this.saveToLocalStorage();

        // Update empty state flags
        this.updateEmptyStateFlags();

        if (load) {
            this.loadDataComponent();
        }
    }

    // Set filter parameters without saving to localStorage (for initialization)
    private setFilterParameters() {
        this.request.applyStatus =
            this.request.applyStatusListSelected?.join(',');
        this.request.candidateStatus =
            this.request.candidateStatusListSelected?.join(',');
    }

    public applyBold(item: CandidateApplicationDto) {
        return !item.seen ? 'font-weight:bold;' : '';
    }

    public getAge(birthdate: Date) {
        if (!birthdate) {
            return;
        }

        return DateHelpers.getAge(birthdate);
    }

    loadDataDelayedComponent() {
        this.candidateListComponent?.loadDataDelayed();
    }

    loadDataComponent() {
        this.candidateListComponent?.loadData();
    }

    // Save to localStorage when any filter changes
    private saveToLocalStorage() {
        // Convert boolean values to strings for localStorage
        const requestToSave = { ...this.request };

        // Handle checkbox boolean to string conversion
        if (typeof (this.request as any).showOnlyUnSeen === 'boolean') {
            requestToSave.showOnlyUnSeen = (this.request as any).showOnlyUnSeen
                ? 'true'
                : 'false';
        } else {
            requestToSave.showOnlyUnSeen =
                this.request.showOnlyUnSeen || 'false';
        }
        if (typeof (this.request as any).spontaneousApplication === 'boolean') {
            requestToSave.spontaneousApplication = (this.request as any)
                .spontaneousApplication
                ? 'true'
                : 'false';
        } else {
            requestToSave.spontaneousApplication =
                this.request.spontaneousApplication || 'false';
        }
        if (typeof (this.request as any).onlyNewCandidate === 'boolean') {
            requestToSave.onlyNewCandidate = (this.request as any)
                .onlyNewCandidate
                ? 'true'
                : 'false';
        } else {
            requestToSave.onlyNewCandidate =
                this.request.onlyNewCandidate || 'false';
        }
        if (
            typeof (this.request as any).hideSpontaneousApplications ===
            'boolean'
        ) {
            requestToSave.hideSpontaneousApplications = (this.request as any)
                .hideSpontaneousApplications
                ? 'true'
                : 'false';
        } else {
            requestToSave.hideSpontaneousApplications =
                this.request.hideSpontaneousApplications || 'false';
        }

        // Handle array fields
        if (Array.isArray((this.request as any).jobCategory)) {
            requestToSave.jobCategory = (this.request as any).jobCategory;
        }
        if (Array.isArray((this.request as any).consultantIds)) {
            requestToSave.consultantIds = (this.request as any).consultantIds;
        }
        if (Array.isArray(this.request.cityArray)) {
            requestToSave.cityArray = this.request.cityArray;
        }
        if (Array.isArray(this.request.locationsArray)) {
            requestToSave.locationsArray = this.request.locationsArray;
        }

        // Include job offer selection
        (requestToSave as any).jobOfferSelected = this.jobOfferSelected;

        try {
            // Use native localStorage to avoid type conversion issues
            localStorage.setItem(
                RequestLocalStorageKeys.CandidateApplication,
                JSON.stringify(requestToSave),
            );

            // Verify what was actually saved
            const verifySaved = JSON.parse(
                localStorage.getItem(
                    RequestLocalStorageKeys.CandidateApplication,
                ),
            );
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    onJobOfferSelected() {
        if (this.jobOfferSelected) {
            this.request.jobOfferId = this.jobOfferSelected.id;
            // Clear status filters when job offer is selected
            this.request.applyStatusListSelected = [];
            this.request.candidateStatusListSelected = [];
            this.request.applyStatus = undefined;
            this.request.candidateStatus = undefined;
        } else {
            this.request.jobOfferId = undefined;
            this.request.jobOfferRef = undefined;
        }

        // Save to localStorage
        this.saveToLocalStorage();

        // Update empty state flags
        this.updateEmptyStateFlags();

        this.loadDataDelayedComponent();
    }

    displayUnSeenCandidatures(event?: any) {
        // If event is provided, use the checked state from the event
        if (event && event.checked !== undefined) {
            this.request.showOnlyUnSeen = event.checked ? 'true' : 'false';
        } else {
            // Fallback to toggle behavior
            this.request.showOnlyUnSeen =
                this.request.showOnlyUnSeen === 'true' ? 'false' : 'true';
        }

        this.onFiltersChanged();
    }

    displaySpontaneousApplication(event?: any) {
        // If event is provided, use the checked state from the event
        if (event && event.checked !== undefined) {
            this.request.spontaneousApplication = event.checked
                ? 'true'
                : 'false';
        } else {
            // Fallback to toggle behavior
            this.request.spontaneousApplication =
                this.request.spontaneousApplication === 'true'
                    ? 'false'
                    : 'true';
        }

        // Mutually exclusive with hideSpontaneousApplications
        if (this.request.spontaneousApplication === 'true') {
            this.request.hideSpontaneousApplications = 'false';
        }

        this.onFiltersChanged();
    }

    displayHideSpontaneousApplications(event?: any) {
        // If event is provided, use the checked state from the event
        if (event && event.checked !== undefined) {
            this.request.hideSpontaneousApplications = event.checked
                ? 'true'
                : 'false';
        } else {
            // Fallback to toggle behavior
            this.request.hideSpontaneousApplications =
                this.request.hideSpontaneousApplications === 'true'
                    ? 'false'
                    : 'true';
        }

        // Mutually exclusive with spontaneousApplication
        if (this.request.hideSpontaneousApplications === 'true') {
            this.request.spontaneousApplication = 'false';
        }

        this.onFiltersChanged();
    }

    displayOnlyNewCandidate(event?: any) {
        // If event is provided, use the checked state from the event
        if (event && event.checked !== undefined) {
            this.request.onlyNewCandidate = event.checked ? 'true' : 'false';
        } else {
            // Fallback to toggle behavior
            this.request.onlyNewCandidate =
                this.request.onlyNewCandidate === 'true' ? 'false' : 'true';
        }

        // Clear candidate status filter when "Only new candidates" is checked
        // because these filters are mutually exclusive (new candidates don't have a candidateId)
        if (this.request.onlyNewCandidate === 'true') {
            this.request.candidateStatusListSelected = [];
            this.request.candidateStatus = undefined;
        }

        this.onFiltersChanged();
    }

    // Method to clear localStorage for testing
    clearLocalStorage() {
        try {
            localStorage.removeItem(
                RequestLocalStorageKeys.CandidateApplication,
            );
            // Also clear using the service
            LocalStorageService.removeFromLocalStorage(
                RequestLocalStorageKeys.CandidateApplication,
            );
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }

    // Method to manually set checkbox values for testing
    setCheckboxValues(
        showOnlyUnSeen: boolean,
        spontaneousApplication: boolean,
    ) {
        this.request.showOnlyUnSeen = showOnlyUnSeen ? 'true' : 'false';
        this.request.spontaneousApplication = spontaneousApplication
            ? 'true'
            : 'false';

        this.saveToLocalStorage();
    }

    // Wrapper methods for filters handled directly in template
    onSearchChanged() {
        this.saveToLocalStorage();
        this.updateEmptyStateFlags();
        this.loadDataDelayedComponent();
    }

    onSearchButtonClick() {
        this.saveToLocalStorage();
        this.updateEmptyStateFlags();
        this.loadDataComponent();
    }

    onConsultantIdsChanged() {
        this.saveToLocalStorage();
        this.updateEmptyStateFlags();
        this.loadDataComponent();
    }

    onJobCategoryChanged() {
        this.saveToLocalStorage();
        this.updateEmptyStateFlags();
        this.loadDataComponent();
    }

    onApplyInCoupleChanged() {
        this.saveToLocalStorage();
        this.updateEmptyStateFlags();
        this.onFiltersChanged(false); // Don't load twice
    }

    onLocationChanged() {
        this.saveToLocalStorage();
        this.updateEmptyStateFlags();
        this.loadDataComponent();
    }

    onLocationChangedDelayed() {
        this.saveToLocalStorage();
        this.updateEmptyStateFlags();
        this.loadDataDelayedComponent();
    }

    /**
     * Checks if any filters are applied to prevent loading all applications
     * Note: consultantIds is excluded when user is a consultant since it's auto-applied
     */
    hasAnyFiltersApplied(): boolean {
        return !!(
            this.request.applyStatusListSelected?.length ||
            this.request.candidateStatusListSelected?.length ||
            this.request.jobOfferId ||
            this.request.jobOfferRef ||
            (this.request as any).jobCategory?.length ||
            this.request.cityArray?.length ||
            this.request.locationsArray?.length ||
            this.request.department ||
            (this.request as any).consultantIds?.length ||
            this.request.search?.trim() ||
            this.request.applyInCouple ||
            this.request.showOnlyUnSeen === 'true' ||
            this.request.spontaneousApplication === 'true' ||
            this.request.hideSpontaneousApplications === 'true' ||
            this.request.onlyNewCandidate === 'true'
        );
    }

    /**
     * Updates empty state flags based on filter state
     */
    updateEmptyStateFlags() {
        if (!this.hasAnyFiltersApplied()) {
            this.showNoFiltersMessage = true;
            this.showNoApplicationsFoundMessage = false;
        } else {
            this.showNoFiltersMessage = false;
            // showNoApplicationsFoundMessage is managed by the child component
        }
    }

    resetFilters() {
        this.jobOfferSelected = null;
        this.request = {
            applyStatusListSelected: [],
            candidateStatusListSelected: [],
            cityArray: [],
            locationsArray: [],
            department: undefined,
            jobOfferId: undefined,
            jobOfferRef: undefined,
            search: '',
            applyInCouple: undefined,
            showOnlyUnSeen: 'false',
            spontaneousApplication: 'false',
            hideSpontaneousApplications: 'false',
            onlyNewCandidate: 'false',
        };

        if (this.isOnlyConsultant) {
            (this.request as any).consultantIds = [
                this.AuthDataService.currentUser.id,
            ];
        } else {
            (this.request as any).consultantIds = [];
        }

        (this.request as any).jobCategory = [];

        this.clearLocalStorage();

        this.updateEmptyStateFlags();

        this.loadDataComponent();
    }
}
