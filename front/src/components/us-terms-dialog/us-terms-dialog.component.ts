import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

export const US_TERMS_VERSION = 'v1.0';

@Component({
    selector: 'app-us-terms-dialog',
    templateUrl: './us-terms-dialog.component.html',
    styleUrls: ['./us-terms-dialog.component.scss'],
})
export class UsTermsDialogComponent {
    constructor(public dialogRef: MatDialogRef<UsTermsDialogComponent>) {
        // Prevent closing by clicking outside or pressing ESC
        this.dialogRef.disableClose = true;
    }

    onAccept(): void {
        this.dialogRef.close(true);
    }

    onDecline(): void {
        this.dialogRef.close(false);
    }
}
