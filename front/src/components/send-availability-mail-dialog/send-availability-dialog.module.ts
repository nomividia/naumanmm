import { NgModule } from '@angular/core';
import { NxsRichEditorModule } from 'nextalys-rich-editor';
import { CommonModulesList } from '../../app/app.module';
import { SendAvailabilityDialogComponent } from './send-availability-dialog.component';

@NgModule({
    imports: [...CommonModulesList, NxsRichEditorModule],
    declarations: [SendAvailabilityDialogComponent],
    exports: [SendAvailabilityDialogComponent],
})
export class SendAvailabilityDialogModule {}
