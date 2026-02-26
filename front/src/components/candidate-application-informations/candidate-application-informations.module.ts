import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { NextalysPdfViewerModule } from 'nextalys-pdf-viewer';
import { CommonModulesList } from '../../app/app.module';
import { CandidateJobAssociatonDialogModule } from '../candidate-job-association-dialog/candidate-job-association-dialog.module';
import { CandidateTransferDialogModule } from '../candidate-transfer-dialog/candidate-transfer-dialog.module';
import { TransferandidateApplicationMailDialogModule } from '../transfer-candidate-application-mail-dialog/transfer-candidate-application-mail-dialog.module';
import { CandidateApplicationInformationsComponent } from './candidate-application-informations.component';

// import { NxsDocViewerModule } from 'nxs-doc-viewer';
@NgModule({
    imports: [
        ...CommonModulesList,
        NextalysPdfViewerModule,
        RouterModule,
        MatTabsModule,
        TransferandidateApplicationMailDialogModule,
        CandidateJobAssociatonDialogModule,
        // NxsDocViewerModule,
        CandidateTransferDialogModule,
    ],
    declarations: [CandidateApplicationInformationsComponent],
    exports: [CandidateApplicationInformationsComponent],
})
export class CandidateApplicationInformationsModule {}
