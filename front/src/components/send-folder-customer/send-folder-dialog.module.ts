import { NgModule } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModulesList } from '../../app/app.module';
import { CandidateAutocompleteModule } from '../candidate-autocomplete/candidate-autocomplete.module';
import { CustomersAutocompleteModule } from '../customers-autocomplete/customers-autocomplete.module';
import { SendFolderCustomerDialogComponent } from './send-folder-dialog.component';

@NgModule({
    declarations: [SendFolderCustomerDialogComponent],
    imports: [
        ...CommonModulesList,
        CustomersAutocompleteModule,
        MatSlideToggleModule,
        CandidateAutocompleteModule,
    ],
    exports: [SendFolderCustomerDialogComponent],
})
export class SendFolderCustomerDialogModule {}
