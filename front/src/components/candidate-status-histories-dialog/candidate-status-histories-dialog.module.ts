import { NgModule } from '@angular/core';
import { CommonModulesList } from '../../app/app.module';
import { CandidateStatusHistoriesDialogComponent } from './candidate-status-histories-dialog.component';

@NgModule({
    declarations: [CandidateStatusHistoriesDialogComponent],
    imports: [...CommonModulesList],
    exports: [CandidateStatusHistoriesDialogComponent],
})
export class CandidateStatusHistoriesDialogModule {}
