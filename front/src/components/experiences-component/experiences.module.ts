import { NgModule } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import {
    NxsIntlTelInputModule,
    NxsYearMonthPickerModule,
} from 'nextalys-angular-tools';
import { NxsRichEditorModule } from 'nextalys-rich-editor';
import { CommonModulesList } from '../../app/app.module';
import { CustomDatePickerModule } from '../../modules/date-picker/date-picker.module';
import { AddressModule } from '../address/address.module';
import { JobSelectorModule } from '../jobs-selector/jobs-selector.module';
import { ExperiencesComponent } from './experiences.component';

@NgModule({
    imports: [
        ...CommonModulesList,
        CustomDatePickerModule,
        NxsYearMonthPickerModule,
        AddressModule,
        NxsIntlTelInputModule,
        MatRadioModule,
        JobSelectorModule,
        NxsRichEditorModule,
    ],
    declarations: [ExperiencesComponent],
    exports: [ExperiencesComponent],
})
export class ExperiencesModule {}
