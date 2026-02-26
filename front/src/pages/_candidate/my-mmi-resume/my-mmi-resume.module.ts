import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModulesList } from '../../../app/app.module';
import { CandidateResumeModule } from '../../../components/candidate-resume-component/candidate-resume.module';
import { DrawerContainerModule } from '../../../components/drawer-container/drawer-container.module';
import { CanLeaveGenericGuard } from '../../../providers/guards/can-leave-generic.guard';
import { MyMmiResumeComponent } from './my-mmi-resume.component';

const Routes = [
    {
        path: '',
        component: MyMmiResumeComponent,
        canDeactivate: [CanLeaveGenericGuard],
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(Routes),
        ...CommonModulesList,
        DrawerContainerModule,
        CandidateResumeModule,
    ],
    declarations: [MyMmiResumeComponent],
    exports: [RouterModule],
})
export class MyMmiResumeModule {}
