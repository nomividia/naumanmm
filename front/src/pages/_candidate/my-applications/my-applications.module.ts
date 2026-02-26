import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModulesList } from '../../../app/app.module';
import { CandidateApplicationListMinifiedModule } from '../../../components/candidate-application-list/candidate-applications-list-minified.module';
import { CandidateApplyDialogModule } from '../../../components/candidate-apply-dialog/candidate-apply-dialog.module';
import { DrawerContainerModule } from '../../../components/drawer-container/drawer-container.module';
import { MyApplicationsComponent } from './my-applications.component';

const Routes = [
    {
        path: '',
        component: MyApplicationsComponent,
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(Routes),
        ...CommonModulesList,
        DrawerContainerModule,
        CandidateApplicationListMinifiedModule,
        CandidateApplyDialogModule,
    ],
    declarations: [MyApplicationsComponent],
    exports: [RouterModule],
})
export class MyApplicationsModule {}
