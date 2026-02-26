import { NgModule } from '@angular/core';
import { CommonModulesList } from '../../app/app.module';
import { DepartmentsAutocompleteModule } from '../departments-autocomplete/departments-autocomplete.module';
import { AddressComponent } from './address.component';

@NgModule({
    imports: [...CommonModulesList, DepartmentsAutocompleteModule],
    declarations: [AddressComponent],
    exports: [AddressComponent],
})
export class AddressModule {}
