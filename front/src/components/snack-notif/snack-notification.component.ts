import { Component, Inject, OnInit } from '@angular/core';
import {
    MAT_SNACK_BAR_DATA,
    MatSnackBarRef,
} from '@angular/material/snack-bar';
import { SnackbarNotificationPayload } from '../../services/events.handler';

@Component({
    selector: 'app-snack-notification',
    templateUrl: './snack-notification.component.html',
    styleUrls: ['./snack-notification.component.scss'],
})
export class SnackNotificationComponent implements OnInit {
    constructor(
        @Inject(MAT_SNACK_BAR_DATA)
        public snackData: SnackbarNotificationPayload,
        public matSnackBarRef: MatSnackBarRef<SnackNotificationComponent>,
    ) {
        if (snackData.routerLink || snackData.url) {
            snackData.actionName = null;

            if (!snackData.actionLabel) {
                snackData.actionLabel = 'Ouvrir';
            }
        }
    }

    ngOnInit(): void {}

    public handleAction(action: string) {
        // console.log('handleAction TODO', this.snackData.data.url);
        window.open(this.snackData.url);
    }
}
