import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModulesList } from '../../app/app.module';
import { LoginDialogComponent } from './login-dialog.component';
import { LoginFormComponent } from './login-form.component';
import { LoginPageComponent } from './login-page.component';

const Routes = [
    {
        path: '',
        component: LoginPageComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(Routes), ...CommonModulesList],
    declarations: [
        LoginPageComponent,
        LoginDialogComponent,
        LoginFormComponent,
    ],
    exports: [RouterModule],
})
export class LoginModule {}
