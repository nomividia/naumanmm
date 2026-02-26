import { NgModule } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { CommonModulesList } from '../../../app/app.module';
import { DetailInterviewDialogModule } from '../../../components/detail-interview-dialog/detail-interview-dialog.module';
import { DrawerContainerModule } from '../../../components/drawer-container/drawer-container.module';
import { ExchangesModule } from '../../../components/exchanges/exchanges.module';
import { InterviewListModule } from '../../candidates/interview-list/interview-list.module';
import { MmiAndMeComponent } from './mmi-and-me.component';

const Routes = [
    {
        path: '',
        component: MmiAndMeComponent,
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(Routes),
        ...CommonModulesList,
        DrawerContainerModule,
        MatTabsModule,
        ExchangesModule,
        InterviewListModule,
        MatNativeDateModule,
        DetailInterviewDialogModule,
    ],
    declarations: [MmiAndMeComponent],
    exports: [RouterModule],
})
export class MmiAndMeModule {}
