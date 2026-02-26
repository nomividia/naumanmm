import { NgModule } from '@angular/core';
import { NxsRichEditorModule } from 'nextalys-rich-editor';
import { CommonModulesList } from '../../app/app.module';
import { SendJobOfferMailDialogComponent } from './send-job-offer-mail-dialog.component';

@NgModule({
    imports: [...CommonModulesList, NxsRichEditorModule],
    declarations: [SendJobOfferMailDialogComponent],
    exports: [SendJobOfferMailDialogComponent],
})
export class SendJobOfferMailDialogModule {}
