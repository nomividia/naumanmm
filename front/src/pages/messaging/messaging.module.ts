import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModulesList } from '../../app/app.module';
import { DrawerContainerModule } from '../../components/drawer-container/drawer-container.module';
import { ExchangesModule } from '../../components/exchanges/exchanges.module';
import { MessagingComponent } from './messaging.component';

const Routes = [
    {
        path: '',
        component: MessagingComponent,
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(Routes),
        ...CommonModulesList,
        DrawerContainerModule,
        ExchangesModule,
    ],
    declarations: [MessagingComponent],
    exports: [RouterModule],
})
export class MessagingModule {}
