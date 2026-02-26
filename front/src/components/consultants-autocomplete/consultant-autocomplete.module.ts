import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NextalysAngularModule } from 'nextalys-angular-tools';
import { CommonModulesList } from '../../app/app.module';
import { ConsultantsAutocompleteComponent } from './consultant-autocomplete.component';

@NgModule({
    imports: [...CommonModulesList, FormsModule, NextalysAngularModule],
    declarations: [ConsultantsAutocompleteComponent],
    exports: [ConsultantsAutocompleteComponent],
})
export class ConsultantsAutocompleteModule {}
