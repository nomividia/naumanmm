import {
    Component,
    forwardRef,
    Input,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NextalysAutocompleteComponent } from 'nextalys-angular-tools';
import {
    AppTypes,
    JobOfferState,
    RolesList,
} from '../../../../shared/shared-constants';
import {
    GetAllJobOffersRequestParams,
    JobOfferDto,
    JobOffersService,
} from '../../providers/api-client.generated';
import { ReferentialProvider } from '../../providers/referential.provider';
import { AuthDataService } from '../../services/auth-data.service';
import { GlobalAppService } from '../../services/global.service';
import { BaseComponent } from '../base/base.component';

@Component({
    selector: 'app-job-offers-autocomplete',
    templateUrl: './job-offers-autocomplete.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => JobOffersAutocompleteComponent),
            multi: true,
        },
    ],
})
export class JobOffersAutocompleteComponent extends BaseComponent {
    private innerValue: JobOfferDto;

    loading = false;

    @Input() disabled = false;
    @Input() placeholder = '';
    @Input() label = '';
    @Input() displayCandidateApplicationFormat: boolean = false;
    @Input() onlyActiveJobOffers: boolean;
    @Input() onlyConnectedConsultant: boolean;
    @Input() takeOnlyJobOfferWithUrl = false;
    @Input() excludePlacedJobOffers: boolean = false;

    @ViewChild(NextalysAutocompleteComponent)
    autocompleteComponent: NextalysAutocompleteComponent;

    private onChangeCallback: (_: any) => void = () => {};
    private onTouchedCallback: () => void = () => {};

    get value(): JobOfferDto {
        return this.innerValue;
    }

    set value(v: JobOfferDto) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
        }
    }

    onBlur() {
        this.onTouchedCallback();
    }

    writeValue(value: JobOfferDto) {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    }

    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    constructor(
        private jobOfferService: JobOffersService,
        private refProvider: ReferentialProvider,
    ) {
        super();
    }

    loadJobOffer = async (val: string) => {
        try {
            let status: 'false' | 'true';
            let stateId: string;

            if (this.onlyActiveJobOffers) {
                status = 'true';
                const appTypes = await this.refProvider.getTypesValues(
                    [AppTypes.JobOfferStateCode],
                    true,
                );
                // console.log("Log ~ JobOffersAutocompleteComponent ~ loadJobOffer= ~ appTypes:", appTypes);
                const statesList = appTypes?.find(
                    (x) => x.code === AppTypes.JobOfferStateCode,
                )?.appValues;
                // console.log("Log ~ JobOffersAutocompleteComponent ~ loadJobOffer= ~ statesList:", statesList);
                stateId = statesList?.find(
                    (x) => x.code === JobOfferState.Activated,
                )?.id;
                // console.log("Log ~ JobOffersAutocompleteComponent ~ loadJobOffer= ~ stateId:", stateId);
            }

            const requestData: GetAllJobOffersRequestParams = {
                start: 0,
                length: 1000,
                search: val,
                status: status,
                stateId: stateId,
            };

            if (this.excludePlacedJobOffers) {
                requestData.excludePlacedJobOffers = 'true';
            }

            if (
                this.onlyConnectedConsultant &&
                GlobalAppService.userHasRole(
                    AuthDataService.currentUser,
                    RolesList.Consultant,
                ) &&
                !GlobalAppService.userHasOneOfRoles(
                    AuthDataService.currentUser,
                    [RolesList.RH, RolesList.Admin, RolesList.AdminTech],
                )
            ) {
                requestData.consultantIds = AuthDataService.currentUser?.id;
            }

            const getJobOffersResponse = await this.sendApiRequest(
                this.jobOfferService.getAllJobOffers(requestData),
            );
            // console.log("🚀 ~ loadJobOffer= ~ getJobOffersResponse", getJobOffersResponse);

            if (!getJobOffersResponse.success) {
                return [];
            }

            if (this.takeOnlyJobOfferWithUrl) {
                const jobOfferWithUrl = [];

                for (const jobOffer of getJobOffersResponse.jobOffers) {
                    if (jobOffer.publicLink) {
                        jobOfferWithUrl.push(jobOffer);
                    }
                }

                return jobOfferWithUrl;
            }

            return getJobOffersResponse.jobOffers;
        } catch (err) {
            console.log('🚀 ~ loadJobOffer= ~ err', err);
        }

        return;
    };

    displayFunction = (item: JobOfferDto) => {
        if (this.displayCandidateApplicationFormat) {
            if (item.job?.label) {
                return item.job.label + ' - ' + item.city + ' - #' + item.ref;
            } else {
                return item.title + ' - ' + item.city + ' - #' + item.ref;
            }
        } else {
            return item.ref + ' - ' + item.title;
        }
    };

    clear() {
        this.autocompleteComponent?.clear();
        this.autocompleteComponent?.clearInput();
    }
}
