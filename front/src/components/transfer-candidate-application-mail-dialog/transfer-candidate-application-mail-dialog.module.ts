import { NgModule } from '@angular/core';
import { NxsRichEditorModule } from 'nextalys-rich-editor';
import { CommonModulesList } from '../../app/app.module';
import { TransferCandidateApplicationMailDialogComponent } from './transfer-candidate-application-mail-dialog.component';

@NgModule({
    imports: [...CommonModulesList, NxsRichEditorModule],
    declarations: [TransferCandidateApplicationMailDialogComponent],
    exports: [TransferCandidateApplicationMailDialogComponent],
})
export class TransferandidateApplicationMailDialogModule {}
