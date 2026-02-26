import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModulesList } from '../../app/app.module';
import { ApplicationSourceListModule } from '../../components/application-source-list/application-source-list.module';
import { DrawerContainerModule } from '../../components/drawer-container/drawer-container.module';
import { JobOfferListMinifiedModule } from '../../components/job-offer-list/job-offer-list-minified.module';
import { RecruitmentActivityListModule } from '../../components/recruitment-activity-list/recruitment-activity-list.module';
import { HomeComponent } from './home.component';

const Routes = [
    {
        path: '',
        component: HomeComponent,
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(Routes),
        ...CommonModulesList,
        DrawerContainerModule,
        JobOfferListMinifiedModule,
        RecruitmentActivityListModule,
        ApplicationSourceListModule,
    ],
    declarations: [HomeComponent],
    exports: [RouterModule],
})
export class HomeModule {}
