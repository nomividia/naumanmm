import { NgModule } from '@angular/core';
import { CommonModulesList } from '../../app/app.module';
import { JobSelectorModule } from '../jobs-selector/jobs-selector.module';
import { CandidateJobAssociatonDialog } from './candidate-job-association-dialog.component';

@NgModule({
    imports: [...CommonModulesList, JobSelectorModule],
    declarations: [CandidateJobAssociatonDialog],
    exports: [CandidateJobAssociatonDialog],
})
export class CandidateJobAssociatonDialogModule {}
