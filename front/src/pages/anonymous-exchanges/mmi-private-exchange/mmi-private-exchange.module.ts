import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModulesList } from '../../../app/app.module';
import { AnonymousExchangeModule } from '../../../components/anonymous-exchange/anonymous-exchange.module';
import { DrawerContainerModule } from '../../../components/drawer-container/drawer-container.module';
import { MmiPrivateExchangeComponent } from './mmi-private-exchange.component';

const route: Routes = [
    {
        path: '',
        component: MmiPrivateExchangeComponent,
    },
];

@NgModule({
    declarations: [MmiPrivateExchangeComponent],
    imports: [
        ...CommonModulesList,
        RouterModule.forChild(route),
        DrawerContainerModule,
        AnonymousExchangeModule,
    ],
    exports: [RouterModule],
})
export class MmiPrivateExchangeModule {}
