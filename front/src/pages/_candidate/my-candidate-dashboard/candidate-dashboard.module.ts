import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { CommonModulesList } from '../../../app/app.module';
import { CandidateApplyDialogModule } from '../../../components/candidate-apply-dialog/candidate-apply-dialog.module';
import { DrawerContainerModule } from '../../../components/drawer-container/drawer-container.module';
import { CandidateDashboardComponent } from './candidate-dashboard.component';

const Routes = [
    {
        path: '',
        component: CandidateDashboardComponent,
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(Routes),
        ...CommonModulesList,
        DrawerContainerModule,
        MatDividerModule,
        CandidateApplyDialogModule,
    ],
    declarations: [CandidateDashboardComponent],
    exports: [RouterModule],
})
export class CandidateDashboardModule {}
