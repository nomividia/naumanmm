import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from 'nextalys-angular-tools';
import { RefData } from '../../../../shared/ref-data';
import { RequestLocalStorageKeys } from '../../../../shared/shared-constants';
import { BaseSimpleList } from '../../components/base/base-simple-list.component';
import { BaseRequest } from '../../components/base/base-types';
import {
    GenericResponse,
    JobReferenceDistinctDto,
    JobReferenceDto,
    JobReferencesService,
} from '../../providers/api-client.generated';
import { LocalStorageService } from '../../providers/local-storage.service';

interface GetJobReferenceDistinctRequest extends BaseRequest {
    countriesCodes?: string[];
    isCompany?: boolean;
    isPrivatePerson?: boolean;
    employerType?: 'privatePerson' | 'company' | null;
    includeDisabled?: boolean;
}

@Component({
    selector: 'app-job-references-distinct',
    templateUrl: './job-references-distinct.component.html',
    styleUrls: [
        './job-references-distinct.component.scss',
        '../../components/base/base-simple-list.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class JobReferencesDistinctComponent extends BaseSimpleList<
    JobReferenceDistinctDto,
    BaseRequest
> {
    request: GetJobReferenceDistinctRequest;

    jobReferences: JobReferenceDto[] = [];

    RefData = RefData;
    countriesList = RefData.countriesListForCurrentLanguage;

    constructor(
        public dialogService: DialogService,
        private jobReferenceService: JobReferencesService,
        private router: Router,
    ) {
        super('jobReferences', dialogService);

        this.subscribeToObservable(this.datasourceLoaded, () => {
            LocalStorageService.saveObjectInLocalStorage(
                RequestLocalStorageKeys.References,
                this.request,
            );
        });
    }

    ngOnInit() {
        this.request =
            LocalStorageService.getObjectFromLocalStorage(
                RequestLocalStorageKeys.References,
            ) || {};
    }

    public isExpandedAfterLoadingData(): boolean {
        return false;
    }

    public async loadCustomData(): Promise<GenericResponse> {
        return await this.jobReferenceService
            .getAllJobReferences({
                start: this.request.start,
                length: this.request.length,
                orderby: this.request.orderby,
                order: this.request.order,
                search: this.request.search,
                countriesCodes: this.request.countriesCodes?.join("','"),
                isCompany: this.request.isCompany ? 'true' : 'false',
                isPrivatePerson: this.request.isPrivatePerson
                    ? 'true'
                    : 'false',
                disabled: this.request.includeDisabled ? 'true' : 'false',
            })
            .toPromise();
    }

    displayInitial(dto: JobReferenceDistinctDto) {
        if (dto.companyName) {
            return dto.companyName?.charAt(0);
        }

        if (dto.privatePersonFirstName || dto.privatePersonLastName) {
            return (
                dto.privatePersonFirstName?.charAt(0) +
                '' +
                dto.privatePersonLastName?.charAt(0)
            );
        }
    }

    redirectToJobReferencesDetails(jobRef: JobReferenceDistinctDto) {
        this.router.navigate([this.RoutesList.JobReferencesDetails], {
            queryParams: {
                company: jobRef.companyName,
                country: jobRef.country,
                firstName: jobRef.privatePersonFirstName,
                lastName: jobRef.privatePersonLastName,
            },
        });
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
