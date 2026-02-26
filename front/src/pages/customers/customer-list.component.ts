import { Component, ViewEncapsulation } from '@angular/core';
import { DialogService } from 'nextalys-angular-tools';
import { ReferentialProvider } from '../../providers/referential.provider';

import { RefData } from '../../../../shared/ref-data';
import { RequestLocalStorageKeys } from '../../../../shared/shared-constants';
import { BaseSimpleList } from '../../components/base/base-simple-list.component';
import { BaseRequest } from '../../components/base/base-types';
import {
    AppValueDto,
    CustomerDto,
    CustomersService,
    GenericResponse,
} from '../../providers/api-client.generated';
import { LocalStorageService } from '../../providers/local-storage.service';

interface CustomersRequest extends BaseRequest {
    consultantId: string;
    city: string;
    isCompany: boolean;
    isPrivatePerson: boolean;
    employerType: 'company' | 'privatePerson';
    locations: string[];
}

@Component({
    selector: 'app-customer',
    templateUrl: './customer-list.component.html',
    styleUrls: [
        '../../components/base/base-simple-list.component.scss',
        './customer-list.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class CustomerListComponent extends BaseSimpleList<
    CustomerDto,
    BaseRequest
> {
    // locations: string[] = [];
    jobReferenceFunctions?: AppValueDto;
    request: CustomersRequest;

    customers: CustomerDto[] = [];

    countriesList = RefData.countriesListForCurrentLanguage;
    RefData = RefData;

    constructor(
        dialogService: DialogService,
        private customerService: CustomersService,

        private referentialProvider: ReferentialProvider,
    ) {
        super('customers', dialogService);
        this.request.locations = [];

        this.subscribeToObservable(this.datasourceLoaded, () => {
            LocalStorageService.saveObjectInLocalStorage(
                RequestLocalStorageKeys.Customers,
                this.request,
            );
        });
    }

    public isExpandedAfterLoadingData(): boolean {
        return false;
    }

    ngOnInit() {
        this.request =
            LocalStorageService.getObjectFromLocalStorage(
                RequestLocalStorageKeys.Customers,
            ) || ({} as CustomersRequest);
    }

    public async loadCustomData(): Promise<GenericResponse> {
        if (
            this.GlobalAppService.userHasRole(
                this.AuthDataService.currentUser,
                this.RolesList.Consultant,
            ) &&
            !this.GlobalAppService.userHasRole(
                this.AuthDataService.currentUser,
                this.RolesList.Admin,
            )
        ) {
            this.request.consultantId = this.AuthDataService.currentUser.id;
        }

        return this.customerService
            .getAllCustomers({
                start: this.request.start,
                length: this.request.length,
                orderby: this.request.orderby,
                order: this.request.order,
                search: this.request.search,
                countryCode: this.request.locations?.toString(),
                consultantId: this.request.consultantId || undefined,
                city: this.request.city,
                isCompany: this.request.isCompany ? 'true' : 'false',
                isPrivatePerson: this.request.isPrivatePerson
                    ? 'true'
                    : 'false',
                includeCustomerFunction: 'true',
            })
            .toPromise();
    }

    displayInitial(dto: CustomerDto) {
        if (dto.isPrivatePerson) {
            return dto.firstName?.charAt(0) + '' + dto.lastName?.charAt(0);
        } else if (dto.isCompany) {
            return dto.companyName?.charAt(0) + '' + dto.companyName?.charAt(1);
        } else {
            return ' ';
        }
    }

    onEmployerTypeChange() {
        if (this.request.employerType === 'company') {
            this.request.isCompany = true;
            this.request.isPrivatePerson = !this.request.isCompany;
        } else if (this.request.employerType === 'privatePerson') {
            this.request.isPrivatePerson = true;
            this.request.isCompany = !this.request.isPrivatePerson;
        } else {
            this.request.isPrivatePerson = false;
            this.request.isCompany = false;
        }
    }
}
