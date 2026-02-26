import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CommonModulesList } from '../../app/app.module';
import { JobSelectorComponent } from './jobs-selector.component';

@NgModule({
    imports: [
        ...CommonModulesList,
        ReactiveFormsModule,
        NgxMatSelectSearchModule,
    ],
    declarations: [JobSelectorComponent],
    exports: [JobSelectorComponent],
})
export class JobSelectorModule {}
