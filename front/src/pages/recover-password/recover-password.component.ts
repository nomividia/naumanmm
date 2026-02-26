import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'nextalys-angular-tools';
import { AuthService } from '../../providers/api-client.generated';
import { BasePageComponent } from '../base/base-page.component';

@Component({
    selector: 'app-recover-password',
    templateUrl: './recover-password.component.html',
    // styleUrls: ['./login-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class RecoverPasswordComponent extends BasePageComponent {
    mode: 'forgot-password' | 'password-creation' = 'forgot-password';
    loading = false;
    newPassword = '';
    newPasswordConfirm = '';
    token = '';

    constructor(
        route: ActivatedRoute,
        private authService: AuthService,
        public dialogService: DialogService,
        private router: Router,
        private translateService: TranslateService,
    ) {
        super();
        this.subscribeToObservable(route.params, (params) => {
            this.token = params.recoverPasswordToken;
        });
        this.subscribeToObservable(route.queryParams, (params) => {
            this.mode =
                params.passwordcreation && params.passwordcreation === '1'
                    ? 'password-creation'
                    : 'forgot-password';
        });
    }

    async changePassword() {
        if (!this.token) {
            return;
        }

        if (!this.newPassword || !this.newPasswordConfirm) {
            return;
        }
        if (this.newPassword !== this.newPasswordConfirm) {
            return;
        }

        this.loading = true;

        const response = await this.sendApiRequest(
            this.authService.changeUserPasswordFromRecoverToken({
                updateUserPasswordRequest: {
                    newPassword: this.newPassword,
                    recoverPasswordToken: this.token,
                },
            }),
        );

        this.loading = false;

        if (!response.success) {
            this.dialogService.showDialog(response.message);
        } else {
            const msg = await this.translateService
                .get('Login.ResetPasswordSuccess')
                .toPromise();
            this.dialogService.showDialog(msg);
            this.router.navigateByUrl('/' + this.RoutesList.Login);
        }
    }
}
