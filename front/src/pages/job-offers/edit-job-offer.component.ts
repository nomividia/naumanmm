import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'nextalys-angular-tools';
import { ImagesHelper } from '../../../../shared/images.helper';
import { RefData } from '../../../../shared/ref-data';
import { RoutesList } from '../../../../shared/routes';
import {
    AppPage,
    AppTypes,
    JobOfferSection,
    JobOfferState,
} from '../../../../shared/shared-constants';
import {
    SendJobOfferMailDialogComponent,
    SendJobOfferMailDialogData,
} from '../../components/send-job-offer-mail-dialog/send-job-offer-mail-dialog.component';
import { GenericUnloadMessage } from '../../environments/constants';
import {
    AppValueDto,
    CandidateApplicationsService,
    CandidateDto,
    CandidateJobOfferHistoryService,
    CandidatesService,
    CustomerDto,
    CustomersService,
    JobOfferDto,
    JobOffersService,
    MailService,
    UserDto,
    UsersService,
} from '../../providers/api-client.generated';
import { ReferentialProvider } from '../../providers/referential.provider';
import { BaseEditPageComponent } from '../base/base-edit-page.component';

@Component({
    selector: 'app-edit-job-offer',
    templateUrl: './edit-job-offer.component.html',
    styleUrls: [
        './edit-job-offer.component.scss',
        '../base/edit-page-style.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class EditJobOfferComponent extends BaseEditPageComponent<
    JobOfferDto,
    JobOffersService
> {
    consultantList?: UserDto[];
    jobList: AppValueDto[];
    contractTypeList: AppValueDto[];
    statesList: AppValueDto[];
    jobOffer: JobOfferDto;
    jobOfferId: string;
    newCustomer: CustomerDto;
    tempCustomer: string;
    tempConsultant: string;
    modifyStatus: boolean;

    customersList: CustomerDto[] = [];
    createCustomerMode = false;
    isNewJobOffer = false;
    candidateTimeline: any[] = [];
    candidateTimelineLoading: boolean = false;
    linkedCandidate: CandidateDto;
    linkedCandidateLoading: boolean = false;
    editModes: JobOfferSection = {
        informations: false,
        descriptions: false,
        consultant: false,
        customer: false,
        linkedCandidate: false,
        candidateTimeline: false,
    };

    countriesList = RefData.countriesListForCurrentLanguage;
    ImageHelpers = ImagesHelper;
    RefData = RefData;

    constructor(
        route: ActivatedRoute,
        router: Router,
        dialogService: DialogService,
        private jobOfferService: JobOffersService,
        private userService: UsersService,
        private referentialProvider: ReferentialProvider,
        private customerService: CustomersService,
        private translate: TranslateService,
        private candidateApplicationsService: CandidateApplicationsService,
        private mailService: MailService,
        private candidatesService: CandidatesService,
        private candidateJobOfferHistoryService: CandidateJobOfferHistoryService,
    ) {
        super(
            dialogService,
            AppPage.JobOfferEdit,
            route,
            router,
            jobOfferService,
            'id',
            'jobOffer',
            'jobOfferDto',
            'getJobOffer',
            'createOrUpdateJobOffer',
            RoutesList.JobOffers,
            'id',
            null,
            GenericUnloadMessage,
        );
        this.init();
    }

    private async init() {
        const routeParams = this.route.snapshot.params.id;

        if (routeParams === 'new') {
            this.isNewJobOffer = true;
            this.editModes = {
                consultant: true,
                descriptions: true,
                informations: true,
                customer: true,
                linkedCandidate: false,
                candidateTimeline: false,
            };
            this.unloadMessage =
                'Êtes vous certain de vouloir annuler la rédaction de cette offre ? Les modifications ne seront pas sauvegardées';
        }

        this.consultantList = [];

        const userResponse = await this.GlobalAppService.getConsultantOrRHList(
            this.userService,
            this,
        );

        if (userResponse.success) {
            this.consultantList = userResponse.users;
        }

        const appTypes = await this.referentialProvider.getTypesValues(
            [
                // AppTypes.JobCategoryCode,
                AppTypes.ContractTypeCode,
                AppTypes.JobOfferStateCode,
            ],
            true,
        );

        // this.jobList = appTypes.find(x => x.code === AppTypes.JobCategoryCode).appValues;
        this.contractTypeList = appTypes.find(
            (x) => x.code === AppTypes.ContractTypeCode,
        ).appValues;
        this.statesList = appTypes
            .find((x) => x.code === AppTypes.JobOfferStateCode)
            .appValues?.sort((a, b) => a.order - b.order);

        const getCustomerListResponse = await this.customerService
            .getAllCustomers({})
            .toPromise();

        if (!getCustomerListResponse.success) {
            this.dialogService.showDialog(getCustomerListResponse.message);
        }

        this.customersList = getCustomerListResponse.customers;

        if (this.entity.customerId) {
            if (this.entity.customer?.isPrivatePerson) {
                this.tempCustomer =
                    this.entity.customer.lastName +
                    ' - ' +
                    this.entity.customer.firstName;
            }

            if (this.entity.customer?.isCompany) {
                this.tempCustomer = this.entity.customer.companyName;
            }
        }
    }

    async loadLinkedCandidate() {
        if (!this.entity?.id) {
            return;
        }

        try {
            this.linkedCandidateLoading = true;

            // Check the timeline for the most recent LINKED action that hasn't been followed by an UNLINKED action
            const linkedCandidateTimelineResponse =
                await this.candidateJobOfferHistoryService
                    .candidateJobOfferHistoryControllerGetJobOfferHistory({
                        jobOfferId: this.entity.id,
                        jobOfferId2: this.entity.id,
                        candidateId: '',
                        start: 0,
                        length: 10,
                        orderby: 'actionDate',
                        order: 'DESC',
                    })
                    .toPromise();

            if (
                linkedCandidateTimelineResponse.success &&
                linkedCandidateTimelineResponse.history
            ) {
                // Update timeline data
                this.candidateTimeline =
                    linkedCandidateTimelineResponse.history.map(
                        (entry: any) => ({
                            id: entry.id,
                            firstName: entry.candidateFirstName,
                            lastName: entry.candidateLastName,
                            linkedDate: entry.actionDate,
                            action: entry.action,
                        }),
                    );

                // Find the most recent LINKED action that hasn't been followed by an UNLINKED action
                let latestLinkedEntry = null;
                for (const entry of linkedCandidateTimelineResponse.history) {
                    if (entry.action === 'LINKED') {
                        latestLinkedEntry = entry;
                        break;
                    } else if (entry.action === 'UNLINKED') {
                        // If we find an UNLINKED action, there's no currently linked candidate
                        break;
                    }
                }

                if (latestLinkedEntry) {
                    // Get the candidate details for the most recent linked entry
                    const candidateResponse = await this.candidatesService
                        .getCandidate({
                            id: latestLinkedEntry.candidateId,
                        })
                        .toPromise();

                    if (
                        candidateResponse.success &&
                        candidateResponse.candidate
                    ) {
                        this.linkedCandidate = candidateResponse.candidate;
                        return;
                    }
                }
            }

            // If no linked candidate found, set to null
            this.linkedCandidate = null;
        } catch (error) {
            console.error('Error loading linked candidate:', error);
            this.linkedCandidate = null;
        } finally {
            this.linkedCandidateLoading = false;
        }
    }

    async loadCandidateTimeline() {
        // If timeline is already loaded during linked candidate loading, skip
        if (this.candidateTimeline.length > 0) {
            return;
        }

        this.candidateTimelineLoading = true;
        if (!this.entity?.id) {
            return;
        }
        try {
            const response = await this.candidateJobOfferHistoryService
                .candidateJobOfferHistoryControllerGetJobOfferHistory({
                    jobOfferId: this.entity.id,
                    jobOfferId2: this.entity.id,
                    candidateId: '',
                    start: 0,
                    length: 100,
                    orderby: 'actionDate',
                    order: 'DESC',
                })
                .toPromise();
            if (response.success && response.history) {
                this.candidateTimeline = response.history.map((entry: any) => ({
                    id: entry.id,
                    firstName: entry.candidateFirstName,
                    lastName: entry.candidateLastName,
                    linkedDate: entry.actionDate,
                    action: entry.action,
                }));
            } else {
                this.candidateTimeline = [];
            }
        } catch (error) {
            console.error('Error loading candidate timeline:', error);
            this.candidateTimeline = [];
        } finally {
            this.candidateTimelineLoading = false;
        }
    }

    async afterInitEditPageData() {
        await this.loadLinkedCandidate();
        // Timeline is already loaded during linked candidate loading
        this.candidateTimelineLoading = false;
    }

    beforeSaveCheck() {
        if (!this.entity) {
            return;
        }

        const errors: string[] = [];

        if (!this.entity.title) {
            errors.push(this.translate.instant('JobOffersErrors.Title'));
        }

        if (!this.entity.ref) {
            errors.push(this.translate.instant('JobOffersErrors.Ref'));
        }

        if (!this.entity.city) {
            errors.push(this.translate.instant('JobOffersErrors.City'));
        }

        if (!this.entity.country) {
            errors.push(this.translate.instant('JobOffersErrors.Country'));
        }

        if (!this.entity.jobId) {
            errors.push(this.translate.instant('JobOffersErrors.JobLinked'));
        }

        if (this.entity.applyInCouple == null) {
            errors.push(this.translate.instant('JobOffersErrors.OnCouple'));
        }

        if (!this.entity.consultantId) {
            errors.push(this.translate.instant('JobOffersErrors.Consultant'));
        }

        if (!this.entity.jobDescription) {
            errors.push(this.translate.instant('JobOffersErrors.Description'));
        }

        if (!this.entity.publicLink) {
            errors.push(this.translate.instant('JobOffersErrors.Link'));
        }

        // if (!this.entity.customerId)
        //     errors.push(this.translate.instant('JobOffersErrors.Customer'));

        return errors;
    }

    onEditClick(key: keyof JobOfferSection) {
        if (this.editModes.customer) {
            if (this.createCustomerMode) {
                this.dialogService.showDialog(
                    this.translate.instant('Customer.ErrorsCreate'),
                );

                return;
            }
        }

        if (this.editModes[key]) {
            this.save();
        }

        this.editModes[key] = !this.editModes[key];
    }

    async generateJobOffer(exit?: boolean): Promise<any> {
        if (!this.hasPendingModifications) {
            return;
        }

        const errors = this.beforeSaveCheck();

        if (errors.length) {
            this.dialogService.showDialog(
                this.translate.instant('Errors.NeedToFillList') +
                    '<ul>' +
                    errors.map((x) => (x = '<li>' + x + '</li>')).join('') +
                    '</ul>',
            );

            return;
        }

        const isJobOfferSaved = await super.save(exit);

        if (!isJobOfferSaved) {
            return;
        }

        if (!this.isNewJobOffer) {
            for (const key in this.editModes) {
                this.editModes[key as keyof JobOfferSection] = false;
            }
        }

        if (this.isNewJobOffer) {
            this.isNewJobOffer = false;
            this.editModes = {
                consultant: false,
                descriptions: false,
                informations: false,
                customer: false,
                linkedCandidate: false,
                candidateTimeline: false,
            };
        }
    }

    async onSendJobOfferByMail() {
        const data: SendJobOfferMailDialogData = {
            jobOffer: this.entity,
        };

        await this.dialogService.showCustomDialogAwaitable({
            component: SendJobOfferMailDialogComponent,
            data,
            exitOnClickOutside: true,
            maxWidth: '1000px',
        });
    }

    async onArchive() {
        this.loading = true;

        const okRes = await this.dialogService.showConfirmDialog(
            this.translate.instant('Dialog.ArchiveJobOffer'),
            { okLabel: 'Global.Yes', cancelLabel: 'Global.No' },
        );

        // if (okRes.okClicked) {
        //     const jobOfferResponse = await this.jobOfferService
        //         .archiveJobOffers({ requestBody: [this.entity.id] })
        //         .toPromise();

        //     if (jobOfferResponse.success) {
        //         this.dialogService.showSnackBar(
        //             "l'annonce à bien été archivée",
        //         );
        //         this.router.navigate([RoutesList.JobOffers]);
        //     }
        // }

        this.loading = false;
    }

    displayInitial(dto: CustomerDto) {
        if (dto.isPrivatePerson) {
            return dto.firstName?.charAt(0) + '' + dto.lastName?.charAt(0);
        }

        if (dto.isCompany) {
            return dto.companyName?.charAt(0);
        }
    }

    gotToCustomerInfos() {
        this.router.navigateByUrl(
            '/' + RoutesList.Customers + '/' + this.entity.customerId,
        );
    }

    async removeJobOffer() {
        const dialog = await this.dialogService.showConfirmDialog(
            this.translate.instant('Dialog.RemoveJobOffer'),
            { okLabel: 'Global.Yes', cancelLabel: 'Global.No' },
        );

        if (dialog.cancelClicked) {
            return;
        }

        this.loading = true;

        const removeJobOfferResponse = await this.jobOfferService
            .deleteJobOffers({ ids: this.entity.id })
            .toPromise();

        this.loading = false;

        if (!removeJobOfferResponse.success) {
            return this.dialogService.showDialog(
                removeJobOfferResponse.message,
            );
        }

        this.router.navigateByUrl('/' + RoutesList.JobOffers);
    }

    navigateToApplicationForJobOffer() {
        // const query =
    }

    getStateClassColor() {
        if (!this.entity) {
            return;
        }

        let color: string;

        switch (this.entity.state?.code) {
            case JobOfferState.Activated:
                color = 'btn-green';
                break;
            case JobOfferState.Suspended:
                color = 'btn-grey';
                break;
            case JobOfferState.Closed:
                color = 'btn-red';
                break;
        }

        return 'statut-btn ' + color;
    }

    async onStateChange() {
        this.hasPendingModifications = true;

        this.modifyStatus = !this.modifyStatus;
        await this.save();

        if (this.entity.state.label === 'Filled') {
            const request = {
                jobOfferId: this.entity.id,
                excludePlaced: 'true',
            };

            this.candidateApplicationsService
                .sendPositionFilledEmail(request)
                .toPromise();
        }
    }

    stateLabel() {
        return this.entity && this.entity.state
            ? this.entity.state.label
            : 'Candidate.EditStatus';
    }

    onStateClicked() {
        this.modifyStatus = !this.modifyStatus;
    }

    initializeNewCustomer() {
        this.createCustomerMode = true;
        this.newCustomer = {};
    }

    async saveCustomer() {
        const errors: string[] = [];

        if (this.newCustomer) {
            // console.log("🚀 ~ EditJobOfferComponent ~ saveCustomer ~ this.newCustomer", this.newCustomer);
            if (
                this.newCustomer.isPrivatePerson == null &&
                this.newCustomer.isCompany == null
            ) {
                errors.push(
                    this.translate.instant('Experience.ErrorCustomerType'),
                );
            }

            if (this.newCustomer.isPrivatePerson) {
                if (!this.newCustomer.lastName) {
                    errors.push(
                        this.translate.instant('ErrorsCandidate.NameUndefined'),
                    );
                }

                if (!this.newCustomer.firstName) {
                    errors.push(
                        this.translate.instant(
                            'ErrorsCandidate.FirstNameUndefined',
                        ),
                    );
                }
            }

            if (this.newCustomer.isCompany) {
                if (!this.newCustomer.companyName) {
                    errors.push(
                        this.translate.instant(
                            'Experience.ErrorJobRefCompanyName',
                        ),
                    );
                }
            }

        }
        if (errors.length) {
            this.dialogService.showDialog(
                this.translate.instant('Errors.ErrorList') +
                    '<ul>' +
                    errors.map((x) => (x = '<li>' + x + '</li>')).join('') +
                    '</ul>',
            );

            return;
        }

        if (!this.hasPendingModifications) {
            return;
        }

        this.loading = true;

        const saveCustomerResponse = await this.customerService
            .createOrUpdateCustomer({ customerDto: this.newCustomer })
            .toPromise();

        this.loading = false;

        if (!saveCustomerResponse.success) {
            this.dialogService.showDialog(saveCustomerResponse.message);
        }

        this.setCustomerFromAutocomplete(saveCustomerResponse.customer);
        this.dialogService.showSnackBar('Nouveau client enregistré.');
        this.customersList.push(saveCustomerResponse.customer);
        this.createCustomerMode = false;
    }

    setCustomerFromAutocomplete(event: CustomerDto) {
        if (!event) {
            return;
        }

        this.entity.customerId = event.id;

        if (event.isPrivatePerson) {
            this.tempCustomer = event.lastName + ' - ' + event.firstName;
        } else if (event.isCompany) {
            this.tempCustomer = event.companyName;
        }
    }

    setCandidateFromAutocomplete(event: UserDto) {
        if (!event) {
            return;
        }

        this.entity.consultantId = event.id;
        this.tempConsultant = event.lastName + ' - ' + event.firstName;
    }

    setCustomerCompanyOrPerson() {
        if (!this.entity) {
            return;
        }

        if (this.newCustomer.isCompany) {
            this.newCustomer.isPrivatePerson = false;
            this.newCustomer.firstName = null;
            this.newCustomer.lastName = null;
        }

        if (!this.newCustomer.isCompany) {
            this.newCustomer.isPrivatePerson = true;
            this.newCustomer.companyName = null;
        }
    }
}
