import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModulesList } from '../../app/app.module';
import { JobOffersAutocompleteModule } from '../job-offers-autocomplete/job-offers-autocomplete.module';
import { CandidateTransferDialogComponent } from './candidate-transfer-dialog.component';

@NgModule({
    imports: [
        ...CommonModulesList,
        JobOffersAutocompleteModule,
        MatChipsModule,
    ],
    declarations: [CandidateTransferDialogComponent],
    exports: [CandidateTransferDialogComponent],
})
export class CandidateTransferDialogModule {}
