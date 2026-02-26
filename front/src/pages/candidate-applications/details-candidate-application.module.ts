import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NextalysPdfViewerModule } from 'nextalys-pdf-viewer';
import { CommonModulesList } from '../../app/app.module';
import { CandidateApplicationInformationsModule } from '../../components/candidate-application-informations/candidate-application-informations.module';
import { DrawerContainerModule } from '../../components/drawer-container/drawer-container.module';
import { CanLeaveGenericGuard } from '../../providers/guards/can-leave-generic.guard';
import { DetailsCandidateApplicationComponent } from './details-candidate-application.component';

const Routes = [
    {
        path: '',
        component: DetailsCandidateApplicationComponent,
        canDeactivate: [CanLeaveGenericGuard],
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(Routes),
        ...CommonModulesList,
        DrawerContainerModule,
        NextalysPdfViewerModule,
        CandidateApplicationInformationsModule,
    ],
    declarations: [DetailsCandidateApplicationComponent],
    exports: [RouterModule],
})
export class DetailsCandidateApplicationModule {}
