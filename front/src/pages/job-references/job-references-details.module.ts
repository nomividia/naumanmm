import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { CommonModulesList } from '../../app/app.module';
import { CandidateListMinifiedModule } from '../../components/candidate-list/candidate-list-minified.module';
import { CustomerListDialogModule } from '../../components/customer-list-dialog/customer-list-dialog.module';
import { DrawerContainerModule } from '../../components/drawer-container/drawer-container.module';
import { JobReferencesDetailsComponent } from './job-references-details.component';

const Routes = [
    {
        path: '',
        component: JobReferencesDetailsComponent,
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(Routes),
        ...CommonModulesList,
        DrawerContainerModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        CustomerListDialogModule,
        MatTabsModule,
        CandidateListMinifiedModule,
    ],
    declarations: [JobReferencesDetailsComponent],
    exports: [RouterModule],
})
export class JobReferencesDetailsModule {}
