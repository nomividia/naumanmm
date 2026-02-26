import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalAppService } from '../../services/global.service';

@Component({
    selector: 'app-login-dialog',
    template: '<app-login-form (afterLogin)="afterLogin()"></app-login-form>',
    styles: [''],
    encapsulation: ViewEncapsulation.None,
})
export class LoginDialogComponent {
    constructor(
        private dialogRef: MatDialogRef<LoginDialogComponent>,
        private router: Router,
    ) {}

    afterLogin() {
        this.dialogRef.close();
        GlobalAppService.afterLoginRedirect(this.router);
    }
}
