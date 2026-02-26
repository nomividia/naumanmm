import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RefData } from '../../../../shared/ref-data';
import {
    AppTypes,
    RequestLocalStorageKeys,
    RolesList,
} from '../../../../shared/shared-constants';
import {
    GetJobOffersRequest,
    JobOfferListMinifiedComponent,
} from '../../components/job-offer-list/job-offer-list.minified.component';
import {
    AppValueDto,
    UserDto,
    UsersService,
} from '../../providers/api-client.generated';
import { LocalStorageService } from '../../providers/local-storage.service';
import { ReferentialProvider } from '../../providers/referential.provider';
import { BasePageComponent } from '../base/base-page.component';

@Component({
    selector: 'app-list-job-offers',
    templateUrl: './list-job-offers.component.html',
    styleUrls: [
        '../../components/base/base-simple-list.component.scss',
        './list-job-offers.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class ListJobOffersComponent extends BasePageComponent {
    jobsList: AppValueDto[];
    consultantsList: UserDto[];
    contractTypeList: AppValueDto[];
    statesList: AppValueDto[];
    jobOfferListComponent: JobOfferListMinifiedComponent;

    request: GetJobOffersRequest = {};
    typesLoaded = false;
    isOnlyConsultant: boolean = false;
    statusList = [
        { valueToDisplay: 'Global.Archive', key: 'false' },
        { valueToDisplay: 'Global.Active', key: 'true' },
    ];

    countriesList = RefData.countriesListForCurrentLanguage;

    @ViewChild('jobOfferListComponent') set setJobOfferListComponent(
        value: JobOfferListMinifiedComponent,
    ) {
        this.jobOfferListComponent = value;
        if (this.jobOfferListComponent) {
            this.subscribeToObservable(
                this.jobOfferListComponent.datasourceLoaded,
                () => {
                    LocalStorageService.saveObjectInLocalStorage(
                        RequestLocalStorageKeys.JobOffers,
                        this.request,
                    );
                },
            );
        }
    }

    constructor(
        private refProvider: ReferentialProvider,
        private userService: UsersService,
        private route: ActivatedRoute,
    ) {
        super();
        this.loadFilterData();

        this.route.queryParams.subscribe((params) => {
            if (params.consultantId)
                this.request.consultantIds = [params.consultantId];
        });
    }

    ngOnInit() {
        this.request =
            LocalStorageService.getObjectFromLocalStorage(
                RequestLocalStorageKeys.JobOffers,
            ) || {};

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
    }

    async loadFilterData() {
        this.loading = true;
        this.request.status = 'true';

        const appTypes = await this.refProvider.getTypesValues(
            [
                // AppTypes.JobCategoryCode,
                AppTypes.ContractTypeCode,
                AppTypes.JobOfferStateCode,
            ],
            true,
        );

        // this.jobsList = appTypes.find(x => x.code === AppTypes.JobCategoryCode).appValues;
        this.contractTypeList = appTypes.find(
            (x) => x.code === AppTypes.ContractTypeCode,
        ).appValues;
        this.statesList = appTypes.find(
            (x) => x.code === AppTypes.JobOfferStateCode,
        ).appValues;
        // const jobsList = await this.refProvider.getTypeValues(AppTypes.JobCategoryCode);

        const getConsultantResponse =
            await this.GlobalAppService.getConsultantOrRHList(
                this.userService,
                this,
            );

        this.consultantsList = getConsultantResponse.users;
        this.typesLoaded = true;

        this.loading = false;
    }

    public isExpandedAfterLoadingData(): boolean {
        return false;
    }

    loadDataDelayedComponent() {
        this.jobOfferListComponent?.loadDataDelayed();
    }

    loadDataComponent() {
        this.jobOfferListComponent?.loadData();
    }
}
