import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModulesList } from '../../../app/app.module';
import { CandidateApplicationInformationsModule } from '../../../components/candidate-application-informations/candidate-application-informations.module';
import { DrawerContainerModule } from '../../../components/drawer-container/drawer-container.module';
import { MyApplicationDetailComponent } from './my-application-detail.component';

const Routes = [
    {
        path: '',
        component: MyApplicationDetailComponent,
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(Routes),
        ...CommonModulesList,
        DrawerContainerModule,
        CandidateApplicationInformationsModule,
    ],
    declarations: [MyApplicationDetailComponent],
    exports: [RouterModule],
})
export class MyApplicationDetailModule {}
