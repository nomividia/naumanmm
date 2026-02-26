import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NextalysAngularModule } from 'nextalys-angular-tools';
import { CommonModulesList } from '../../app/app.module';
import { DepartmentsAutocompleteComponent } from './departments-autocomplete.component';

@NgModule({
    imports: [...CommonModulesList, FormsModule, NextalysAngularModule],
    declarations: [DepartmentsAutocompleteComponent],
    exports: [DepartmentsAutocompleteComponent],
})
export class DepartmentsAutocompleteModule {}
