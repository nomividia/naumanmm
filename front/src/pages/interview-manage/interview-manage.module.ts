import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModulesList } from '../../app/app.module';
import { DrawerContainerModule } from '../../components/drawer-container/drawer-container.module';
import { InterviewsManageComponent } from './interview-manage.component';

const Routes = [
    {
        path: '',
        component: InterviewsManageComponent,
    },
];

@NgModule({
    declarations: [InterviewsManageComponent],
    imports: [
        RouterModule.forChild(Routes),
        ...CommonModulesList,
        DrawerContainerModule,
    ],
})
export class InterviewsManageModule {}
