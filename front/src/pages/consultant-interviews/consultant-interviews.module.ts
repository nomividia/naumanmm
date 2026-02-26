import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { CommonModulesList } from '../../app/app.module';
import { DetailInterviewDialogModule } from '../../components/detail-interview-dialog/detail-interview-dialog.module';
import { DrawerContainerModule } from '../../components/drawer-container/drawer-container.module';
import { InterviewListModule } from '../candidates/interview-list/interview-list.module';
import { ConsultantInterviewsComponent } from './consultant-interviews.component';

const Routes = [
    {
        path: '',
        component: ConsultantInterviewsComponent,
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
        InterviewListModule,
        DetailInterviewDialogModule,
    ],
    declarations: [ConsultantInterviewsComponent],
    exports: [RouterModule],
})
export class ConsultantInterviewsModule {}
