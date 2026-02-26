import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModulesList } from '../../app/app.module';
import { JobOffersAutocompleteModule } from '../job-offers-autocomplete/job-offers-autocomplete.module';
import { CandidateApplyDialog } from './candidate-apply-dialog.component';

@NgModule({
    imports: [
        ...CommonModulesList,
        JobOffersAutocompleteModule,
        MatChipsModule,
    ],
    declarations: [CandidateApplyDialog],
    exports: [CandidateApplyDialog],
})
export class CandidateApplyDialogModule {}
