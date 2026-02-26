import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModulesList } from '../../app/app.module';
import { CandidateApplicationListMinified } from './candidate-applications-list-minified.component';

@NgModule({
    imports: [
        ...CommonModulesList,
        RouterModule,
        TranslateModule,
        MatPaginatorModule,
    ],
    declarations: [CandidateApplicationListMinified],
    exports: [CandidateApplicationListMinified],
})
export class CandidateApplicationListMinifiedModule {}
