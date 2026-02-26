import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NextalysAngularModule } from 'nextalys-angular-tools';
import { CommonModulesList } from '../../app/app.module';
import { CustomersAutocompleteComponent } from './customers-autocomplete.component';

@NgModule({
    imports: [...CommonModulesList, FormsModule, NextalysAngularModule],
    declarations: [CustomersAutocompleteComponent],
    exports: [CustomersAutocompleteComponent],
})
export class CustomersAutocompleteModule {}
