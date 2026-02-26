import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'nextalys-angular-tools';
import { RefData } from '../../../../shared/ref-data';
import { RoutesList } from '../../../../shared/routes';
import { AppPage, AppTypes } from '../../../../shared/shared-constants';
import {
    SendFolderCustomerDialogComponent,
    SendFolderCustomerDialogData,
} from '../../components/send-folder-customer/send-folder-dialog.component';
import { GenericUnloadMessage } from '../../environments/constants';
import {
    AddressDto,
    AppValueDto,
    CustomerDto,
    CustomersService,
    JobOfferDto,
    JobOffersService,
} from '../../providers/api-client.generated';
import { ReferentialProvider } from '../../providers/referential.provider';
import { BaseEditPageComponent } from '../base/base-edit-page.component';

interface EditModesInterface {
    informations: boolean;
    contact: boolean;
}

@Component({
    selector: 'app-edit-customer',
    templateUrl: './edit-customer.component.html',
    styleUrls: [
        '../base/edit-page-style.scss',
        './edit-customer.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class EditCustomerComponent extends BaseEditPageComponent<
    CustomerDto,
    CustomersService
> {
    customer: CustomerDto;
    customerId: string;

    jobReferenceFunctions?: AppValueDto[] = [];
    jobOffersLinked: JobOfferDto[] = [];
    isNewCustomer = false;
    editModes: EditModesInterface = {
        informations: false,
        contact: false,
    };

    RefData = RefData;

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        public customerService: CustomersService,
        public dialogService: DialogService,
        private translate: TranslateService,
        private jobOfferService: JobOffersService,
        private referentialProvider: ReferentialProvider,
    ) {
        super(
            dialogService,
            AppPage.CustomerEdit,
            route,
            router,
            customerService,
            'id',
            'customer',
            'customerDto',
            'getCustomer',
            'createOrUpdateCustomer',
            RoutesList.Customers,
            'id',
            null,
            GenericUnloadMessage,
        );
        this.init();
    }

    async init() {
        const routeParams = this.route.snapshot.params.id;

        if (routeParams === 'new') {
            this.isNewCustomer = true;
            this.editModes = { informations: true, contact: true };
            this.unloadMessage =
                'Êtes vous certain de vouloir annuler la création de ce client ? Les modifications ne seront pas sauvegardées';
        } else {
            const getJobOffersResponse = await this.jobOfferService
                .getAllJobOffers({ customerIds: routeParams })
                .toPromise();

            if (!getJobOffersResponse.success) {
                this.dialogService.showDialog(getJobOffersResponse.message);
            }

            this.jobOffersLinked = getJobOffersResponse.jobOffers;
            console.log(
                '🚀 ~ EditCustomerComponent ~ init ~ this.jobOffersLinked ',
                this.jobOffersLinked,
            );
        }

        const appTypes = await this.referentialProvider.getTypesValues(
            [AppTypes.JobReferenceFunctionCode],
            true,
        );
        const tempJobReferenceFunctions = appTypes.find(
            (x) => x.code === AppTypes.JobReferenceFunctionCode,
        ).appValues;
        this.jobReferenceFunctions = tempJobReferenceFunctions.sort(
            (a, b) => a.order - b.order,
        );
    }

    beforeSaveCheck() {
        const errors: string[] = [];

        if (this.entity) {
            if (this.entity.isPrivatePerson) {
                if (!this.entity.lastName) {
                    errors.push(
                        this.translate.instant('ErrorsCandidate.NameUndefined'),
                    );
                }

                if (!this.entity.firstName) {
                    errors.push(
                        this.translate.instant(
                            'ErrorsCandidate.FirstNameUndefined',
                        ),
                    );
                }
            }

            if (this.entity.isCompany) {
                if (!this.entity.companyName) {
                    errors.push(
                        this.translate.instant('Customer.ErrorNoCompanyName'),
                    );
                }
            }

            if (!this.entity.dateOfContact) {
                errors.push(
                    this.translate.instant(
                        'ErrorsCandidate.DateOfContactUndefined',
                    ),
                );
            }
            // if (this.entity.addresses && this.entity.addresses.length) {
            //     this.entity.addresses.forEach(x => {
            //         if (!x.lineOne)
            //             errors.push(this.translate.instant('AddressErrors.LineUndefined'));
            //         if (!x.postalCode)
            //             errors.push(this.translate.instant('AddressErrors.PostalCodeUndefined'));
            //         if (!x.city)
            //             errors.push(this.translate.instant('AddressErrors.CityUndefined'));
            //         if (!x.country)
            //             errors.push(this.translate.instant('AddressErrors.CountryUndefined'));
            //     });
            // }
        }
        return errors;
    }

    addAddress() {
        if (!this.entity.addresses?.length) {
            this.entity.addresses = [];
        }

        this.entity.addresses.push({
            lineOne: undefined,
            lineTwo: undefined,
            city: undefined,
            postalCode: undefined,
            label: undefined,
            country: undefined,
            customerId: this.entity?.id ? this.entity.id : undefined,
        });

        this.hasPendingModifications = true;
    }

    removeAddress(address: AddressDto) {
        if (!address || !this.entity.addresses) {
            return;
        }

        const addressIndex = this.entity.addresses.indexOf(address);

        if (addressIndex > -1) {
            this.entity.addresses.splice(addressIndex, 1);
        }

        this.hasPendingModifications = true;
    }

    onEditClick(key: keyof EditModesInterface) {
        if (this.editModes[key]) {
            this.save();
        }

        this.editModes[key] = !this.editModes[key];
    }

    async save(exit?: boolean): Promise<any> {
        const errors = this.beforeSaveCheck();

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

        await super.save(exit);

        if (!this.isNewCustomer) {
            for (const key in this.editModes) {
                this.editModes[key as keyof EditModesInterface] = false;
            }
        }

        if (this.isNewCustomer) {
            this.isNewCustomer = false;
            this.editModes = { contact: false, informations: false };
        }
    }

    async deleteCustomer() {
        const dialog = await this.dialogService.showConfirmDialog(
            this.translate.instant('Dialog.RemoveCustomer'),
            { okLabel: 'Global.Delete', cancelLabel: 'Global.Cancel' },
        );

        if (dialog.cancelClicked) {
            return;
        }

        this.loading = true;

        const removeCutomerResponse = await this.customerService
            .deleteCustomers({ ids: this.entity.id })
            .toPromise();

        this.loading = false;

        if (!removeCutomerResponse.success) {
            return this.dialogService.showDialog(removeCutomerResponse.message);
        }

        this.router.navigateByUrl('/' + RoutesList.Customers);
    }

    setCustomerCompanyOrPerson() {
        if (!this.entity) {
            return;
        }

        if (this.entity.isCompany) {
            this.entity.isPrivatePerson = false;
            this.entity.firstName = null;
            this.entity.lastName = null;
        }

        if (!this.entity.isCompany) {
            this.entity.isPrivatePerson = true;
            this.entity.companyName = null;
        }
    }

    setHeaderTitle(): string {
        if (!this.entity) {
            return this.translate.instant('Menu.CreateCustomer');
        }

        if (this.entity.isCompany) {
            return this.entity.companyName;
        }

        if (this.entity.isPrivatePerson) {
            return this.entity.firstName + ' ' + this.entity.lastName;
        }
    }

    async openSendToCustomerDialog() {
        const dialogData: SendFolderCustomerDialogData = {
            mode: 'sendResumes',
            customer: this.entity,
        };

        await this.dialogService.showCustomDialogAwaitable({
            component: SendFolderCustomerDialogComponent,
            exitOnClickOutside: false,
            data: dialogData,
            minHeight: '80vh',
            minWidth: '70vw',
        });
    }
}
