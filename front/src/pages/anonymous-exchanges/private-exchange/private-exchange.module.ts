import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModulesList } from '../../../app/app.module';
import { AnonymousExchangeModule } from '../../../components/anonymous-exchange/anonymous-exchange.module';
import { PrivateExchangeComponent } from './private-exchange.component';

const route: Routes = [
    {
        path: '',
        component: PrivateExchangeComponent,
    },
];

@NgModule({
    declarations: [PrivateExchangeComponent],
    imports: [
        ...CommonModulesList,
        RouterModule.forChild(route),
        AnonymousExchangeModule,
    ],
    exports: [RouterModule],
})
export class PrivateExchangeModule {}
