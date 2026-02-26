import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthProvider } from '../../providers/auth-provider';
import { BasePageComponent } from '../base/base-page.component';
import { LoginDialogComponent } from './login-dialog.component';

@Component({
    selector: 'app-login-page',
    template: '<app-login-form (afterLogin)="afterLogin()"></app-login-form>',
    styles: [
        `
            app-login-page {
                /* background-color:#DEDEDE; */
                display: block;
                min-height: 100vh;
                background-image: url('/assets/imgs/login-mmi.jpg');
                background-position: center;
                background-size: cover;
                background-repeat: no-repeat;
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
})
export class LoginPageComponent extends BasePageComponent implements OnInit {
    private dialogOpened = false;

    constructor(
        private authProvider: AuthProvider,
        private matDialog: MatDialog,
        private router: Router,
    ) {
        super();
    }

    ngOnInit() {
        if (this.AuthDataService.currentUser) {
            this.router.navigate([this.GlobalAppService.getHomePageByUser()]);

            return;
        }
        //   this.openLoginDialog();
    }

    openLoginDialog() {
        if (this.dialogOpened) {
            return;
        }

        this.setTimeout(() => {
            this.dialogOpened = true;
            const dialog = this.matDialog.open(LoginDialogComponent, {
                closeOnNavigation: false,
                disableClose: true,
            });
            const sub = dialog.afterClosed().subscribe(() => {
                this.dialogOpened = false;
            });
            this.eventsCollector.collect(sub);
        }, 50);
    }

    afterLogin() {
        this.GlobalAppService.afterLoginRedirect(this.router);
    }
}
