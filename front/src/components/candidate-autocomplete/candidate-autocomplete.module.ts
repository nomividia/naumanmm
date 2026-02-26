import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NextalysAngularModule } from 'nextalys-angular-tools';
import { CommonModulesList } from '../../app/app.module';
import { CandidateAutocompleteComponent } from './candidate-autocomplete.component';

@NgModule({
    imports: [...CommonModulesList, FormsModule, NextalysAngularModule],
    declarations: [CandidateAutocompleteComponent],
    exports: [CandidateAutocompleteComponent],
})
export class CandidateAutocompleteModule {}
