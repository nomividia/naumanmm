import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModulesList } from '../../app/app.module';
import { RecoverPasswordComponent } from './recover-password.component';

const Routes = [
    {
        path: '',
        component: RecoverPasswordComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(Routes), ...CommonModulesList],
    declarations: [RecoverPasswordComponent],
    exports: [RouterModule],
})
export class RecoverPasswordModule {}
