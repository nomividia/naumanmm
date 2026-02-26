import { Component, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'nextalys-angular-tools';
import { MainHelpers } from 'nextalys-js-helpers';
import { RefData } from '../../../../shared/ref-data';
import {
    CustomerListDialog,
    CustomerListDialogResponse,
} from '../../components/customer-list-dialog/customer-list-dialog.component';
import {
    AppValueDto,
    CandidateDto,
    CandidatesService,
    CustomersService,
    GetAllJobReferencesDetailsRequestParams,
    JobReferenceDto,
    JobReferencesDetailsDto,
    JobReferencesService,
} from '../../providers/api-client.generated';
import { BasePageComponent } from '../base/base-page.component';

interface JobReferenceParams {
    company?: string;
    country?: string;
    firstName?: string;
    lastName?: string;
}

@Component({
    selector: 'app-job-references-details',
    templateUrl: './job-references-details.component.html',
    styleUrls: [
        './job-references-details.component.scss',
        '../../components/base/base-simple-list.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class JobReferencesDetailsComponent extends BasePageComponent {
    request: GetAllJobReferencesDetailsRequestParams;
    jobReferences: JobReferencesDetailsDto[];
    candidates: CandidateDto[];
    isArchived: boolean;

    functionsList: AppValueDto[] = [];

    RefData = RefData;

    constructor(
        public dialogService: DialogService,
        private jobReferenceService: JobReferencesService,
        private route: ActivatedRoute,
        private router: Router,
        private customerService: CustomersService,
        private candidateService: CandidatesService,
        public translate: TranslateService,
    ) {
        super();

        this.route.queryParams.subscribe((params) => {
            this.request = MainHelpers.cloneObject(params);
            this.loadJobReferences();
        });
    }

    async onTabChange(event: MatTabChangeEvent) {
        if (event.index === 0) {
            await this.loadJobReferences();
        }

        if (event.index === 1) {
            await this.loadCandidatesFromQueryJobReference();
        }
    }

    async loadJobReferences() {
        this.loading = true;

        const items = await this.jobReferenceService
            .getAllJobReferencesDetails({
                start: this.request.start,
                length: this.request.length,
                orderby: this.request.orderby,
                order: this.request.order,
                search: this.request.search,
                company: this.request.company,
                country: this.request.country,
                firstName: this.request.firstName,
                lastName: this.request.lastName,
                // disabled: "false",
            })
            .toPromise();

        this.loading = false;

        if (!items.success) {
            this.dialogService.showDialog(items.message);

            return;
        }

        this.jobReferences = items.jobReferences;
        this.isArchived = !this.jobReferences.some((x) => !x.disabled);
    }

    async loadCandidatesFromQueryJobReference() {
        this.loading = true;

        const jobReferencesCandidateIds = this.jobReferences.map(
            (x) => x.candidateIdFromJobs,
        );

        const getCandidatesFromReferences = await this.candidateService
            .getAllCandidates({
                getCandidatesRequest: {
                    candidateIdsFromReferences:
                        jobReferencesCandidateIds.join(','),
                    includePercentageAdvancement: 'true',
                },
            })
            .toPromise();

        this.loading = false;

        if (!getCandidatesFromReferences.success) {
            this.dialogService.showDialog(getCandidatesFromReferences.message);

            return;
        }

        this.candidates = getCandidatesFromReferences.candidates;
    }

    displayInitial(dto: JobReferenceDto) {
        if (dto.isCompany) {
            return dto.companyName?.charAt(0);
        }

        if (dto.isPrivatePerson) {
            return (
                dto.privatePersonFirstName?.charAt(0) +
                '' +
                dto.privatePersonLastName?.charAt(0)
            );
        }

        return '';
    }

    redirectToCandidate() {
        this.router.navigate([this.RoutesList.CandidatesList], {
            queryParams: {
                referenceName:
                    this.jobReferences[0].companyName ??
                    this.jobReferences[0].privatePersonFirstName,
                referenceType: this.jobReferences[0].isCompany
                    ? 'company'
                    : 'privatePerson',
            },
        });
    }

    async checkCustomerAlreadyExistBeforeGenerate(
        reference: JobReferencesDetailsDto,
    ) {
        this.loading = true;

        const getAlreadyCustomerCreatedFromReference =
            await this.customerService
                .checkCustomerAlreadyCreateFromReference({
                    jobReferenceDto: reference,
                })
                .toPromise();

        this.loading = false;

        if (!getAlreadyCustomerCreatedFromReference.alreadyExist) {
            const dialog = await this.dialogService.showConfirmDialog(
                this.translate.instant('JobReference.CreateCustomerDialog'),
                { okLabel: this.translate.instant('JobReference.Confirm') },
            );

            if (dialog.okClicked) {
                this.generateCustomerFromReference(reference, false);
            } else {
                return;
            }
        }

        if (getAlreadyCustomerCreatedFromReference.alreadyExist) {
            const dialog: CustomerListDialogResponse =
                await this.dialogService.showCustomDialogAwaitable({
                    component: CustomerListDialog,
                    data: getAlreadyCustomerCreatedFromReference.customers,
                });

            if (dialog.cancel) {
                return;
            } else if (dialog.createNew) {
                this.generateCustomerFromReference(reference, false);
            } else {
                this.generateCustomerFromReference(
                    reference,
                    true,
                    dialog.customer.id,
                );
            }
        }
    }

    async generateCustomerFromReference(
        reference: JobReferencesDetailsDto,
        overwrite: boolean,
        customerId?: string,
    ) {
        // console.log("🚀 ~ JobReferencesDetailsComponent ~ generateCustomerFromReference ~ reference", reference);
        this.loading = true;

        const saveNewCustomerResponse = await this.customerService
            .createCustomerFromReference({
                generateCustomerFromeReferenceRequest: {
                    jobReferenceDto: reference,
                    overwrite: overwrite,
                    customerId: customerId || '',
                },
            })
            .toPromise();

        if (!saveNewCustomerResponse.success) {
            this.dialogService.showDialog(saveNewCustomerResponse.message);
            this.loading = false;

            return;
        }

        reference.customerHasBeenCreated = true;

        const setCustomerHasBeenCreatedResponse = await this.jobReferenceService
            .createOrUpdateJobReference({ jobReferenceDto: reference })
            .toPromise();

        this.loading = false;

        if (!setCustomerHasBeenCreatedResponse.success) {
            this.dialogService.showDialog(
                setCustomerHasBeenCreatedResponse.message,
            );

            return;
        }

        this.dialogService.showSnackBar(
            this.translate.instant('JobReference.CustomerCreationSuccess'),
        );
    }

    async archiveJobReferences() {
        const dialogResult = await this.dialogService.showConfirmDialog(
            this.translate.instant('JobReference.ArchiveMessage'),
        );

        if (!dialogResult.okClicked) {
            return;
        }

        const ids = this.jobReferences.map((x) => x.jobRefId);

        this.loading = true;

        const archiveJobReferencesResponse = await this.jobReferenceService
            .archiveJobReferences({ requestBody: ids })
            .toPromise();

        this.loading = false;
        if (!archiveJobReferencesResponse.success) {
            this.dialogService.showDialog(archiveJobReferencesResponse.message);
        } else {
            this.dialogService.showSnackBar(
                this.translate.instant('JobReference.RefsBeenArchived'),
            );
        }

        this.router.navigateByUrl('/' + this.RoutesList.JobReferences);
        // await this.loadJobReferences();
    }
}
