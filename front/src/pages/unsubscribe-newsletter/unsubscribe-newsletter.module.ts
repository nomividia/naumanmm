import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModulesList } from '../../app/app.module';
import { CanLeaveGenericGuard } from '../../providers/guards/can-leave-generic.guard';
import { UnsubscribeNewsletterComponent } from './unsubscribe-newsletter.component';

const Routes = [
    {
        path: '',
        component: UnsubscribeNewsletterComponent,
        canDeactivate: [CanLeaveGenericGuard],
    },
];

@NgModule({
    imports: [RouterModule.forChild(Routes), ...CommonModulesList],
    declarations: [UnsubscribeNewsletterComponent],
    exports: [RouterModule],
})
export class UnsubscribeNewsletterModule {}
