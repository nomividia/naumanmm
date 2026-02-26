import { NgModule } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { RouterModule } from '@angular/router';
import { NxsIntlTelInputModule } from 'nextalys-angular-tools';
import { CommonModulesList } from '../../app/app.module';
import { ConsultantsAutocompleteModule } from '../../components/consultants-autocomplete/consultant-autocomplete.module';
import { CustomersAutocompleteModule } from '../../components/customers-autocomplete/customers-autocomplete.module';
import { DrawerContainerModule } from '../../components/drawer-container/drawer-container.module';
import { JobSelectorModule } from '../../components/jobs-selector/jobs-selector.module';
import { SendJobOfferMailDialogModule } from '../../components/send-job-offer-mail-dialog/send-job-offer-mail-dialog.module';
import { CustomDatePickerModule } from '../../modules/date-picker/date-picker.module';
import { CanLeaveGenericGuard } from '../../providers/guards/can-leave-generic.guard';
import { EditJobOfferComponent } from './edit-job-offer.component';

const Routes = [
    {
        path: '',
        component: EditJobOfferComponent,
        canDeactivate: [CanLeaveGenericGuard],
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(Routes),
        ...CommonModulesList,
        DrawerContainerModule,
        SendJobOfferMailDialogModule,
        CustomDatePickerModule,
        NxsIntlTelInputModule,
        CustomersAutocompleteModule,
        ConsultantsAutocompleteModule,
        MatRadioModule,
        JobSelectorModule,
    ],
    declarations: [EditJobOfferComponent],
    exports: [RouterModule],
})
export class EditCandidateModule {}
