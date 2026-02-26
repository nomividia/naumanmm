import { NgModule } from '@angular/core';
import { CommonModulesList } from '../../app/app.module';
import { CustomerListDialog } from './customer-list-dialog.component';

@NgModule({
    imports: [...CommonModulesList],
    declarations: [CustomerListDialog],
    exports: [CustomerListDialog],
})
export class CustomerListDialogModule {}
