import { NgModule } from '@angular/core';
import { CommonModulesList } from '../../app/app.module';
import { ExchangesComponent } from './exchanges.component';

@NgModule({
    imports: [...CommonModulesList],
    declarations: [ExchangesComponent],
    exports: [ExchangesComponent],
})
export class ExchangesModule {}
