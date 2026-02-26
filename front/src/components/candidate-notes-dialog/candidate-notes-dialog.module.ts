import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { NxsDateTimePickerModule } from 'nextalys-angular-tools';
import { CommonModulesList } from '../../app/app.module';
import { CustomDatePickerModule } from '../../modules/date-picker/date-picker.module';
import { CandidateNotesDialogComponent } from './candidate-notes-dialog/candidate-notes-dialog.component';

@NgModule({
    imports: [
        ...CommonModulesList,
        CustomDatePickerModule,
        NxsDateTimePickerModule,
        MatTableModule,
    ],
    declarations: [CandidateNotesDialogComponent],
    exports: [CandidateNotesDialogComponent],
})
export class CandidateNotesDialogModule {}
