import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { CommonModulesList } from '../../app/app.module';
import { DrawerContainerModule } from '../../components/drawer-container/drawer-container.module';
import { JobDetailsDialogComponent } from './job-details-dialog.component';
import { JobsListComponent } from './jobs-list.component';

const Routes = [
    {
        path: '',
        component: JobsListComponent,
    },
];

@NgModule({
    declarations: [JobsListComponent, JobDetailsDialogComponent],
    imports: [
        RouterModule.forChild(Routes),
        ...CommonModulesList,
        DrawerContainerModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
    ],
    exports: [RouterModule],
})
export class JobsListModule {}
