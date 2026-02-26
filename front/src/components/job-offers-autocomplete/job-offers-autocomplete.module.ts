import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NextalysAngularModule } from 'nextalys-angular-tools';
import { CommonModulesList } from '../../app/app.module';
import { JobOffersAutocompleteComponent } from './job-offers-autocomplete.component';

@NgModule({
    imports: [...CommonModulesList, FormsModule, NextalysAngularModule],
    declarations: [JobOffersAutocompleteComponent],
    exports: [JobOffersAutocompleteComponent],
})
export class JobOffersAutocompleteModule {}
