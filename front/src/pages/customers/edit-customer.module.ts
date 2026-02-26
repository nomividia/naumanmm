import { NgModule } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { RouterModule } from '@angular/router';
import { NxsIntlTelInputModule } from 'nextalys-angular-tools';
import { CommonModulesList } from '../../app/app.module';
import { AddressModule } from '../../components/address/address.module';
import { DrawerContainerModule } from '../../components/drawer-container/drawer-container.module';
import { ImageLibraryModule } from '../../components/image-library/image-library.module';
import { SendFolderCustomerDialogModule } from '../../components/send-folder-customer/send-folder-dialog.module';
import { CustomDatePickerModule } from '../../modules/date-picker/date-picker.module';
import { CanLeaveGenericGuard } from '../../providers/guards/can-leave-generic.guard';
import { EditCustomerComponent } from './edit-customer.component';

const Routes = [
    {
        path: '',
        component: EditCustomerComponent,
        canDeactivate: [CanLeaveGenericGuard],
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(Routes),
        ...CommonModulesList,
        AddressModule,
        DrawerContainerModule,
        ImageLibraryModule,
        NxsIntlTelInputModule,
        CustomDatePickerModule,
        MatRadioModule,
        SendFolderCustomerDialogModule,
    ],
    declarations: [EditCustomerComponent],
    exports: [RouterModule],
})
export class EditCustomerModule {}
