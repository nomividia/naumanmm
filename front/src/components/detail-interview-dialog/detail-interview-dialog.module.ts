import { NgModule } from '@angular/core';
import { NxsDateTimePickerModule } from 'nextalys-angular-tools';
import { CommonModulesList } from '../../app/app.module';
import { CustomDatePickerModule } from '../../modules/date-picker/date-picker.module';
import { DetailInterviewDialogComponent } from './detail-interview-dialog.component';

@NgModule({
    imports: [
        ...CommonModulesList,
        CustomDatePickerModule,
        NxsDateTimePickerModule,
    ],
    declarations: [DetailInterviewDialogComponent],
    exports: [DetailInterviewDialogComponent],
})
export class DetailInterviewDialogModule {}
