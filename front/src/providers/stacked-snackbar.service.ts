import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { BaseComponent } from '../components/base/base.component';
import { SnackNotificationComponent } from '../components/snack-notif/snack-notification.component';
import { SnackbarNotificationPayload } from '../services/events.handler';

@Injectable()
export class StackedSnackBarService extends BaseComponent {
    private snackbarsToUnstack: SnackbarNotificationPayload[] = [];
    private currentSnackbar: SnackbarNotificationPayload = null;

    constructor(private matSnackBar: MatSnackBar) {
        super();
    }

    openNotificationSnackbar(data: SnackbarNotificationPayload) {
        this.snackbarsToUnstack.push(data);
        this.unstack();
    }

    openSnackbar(message: string, opts?: MatSnackBarConfig) {
        this.snackbarsToUnstack.push({ message, opts });
        this.unstack();
    }

    extendsMatSnackbarOptions(
        opts: MatSnackBarConfig,
        extendOpts: MatSnackBarConfig,
    ) {
        if (extendOpts) {
            if (extendOpts.duration) opts.duration = extendOpts.duration;
        }
    }

    unstack() {
        if (this.currentSnackbar) {
            return;
        }

        if (this.snackbarsToUnstack && this.snackbarsToUnstack.length > 0) {
            this.currentSnackbar = this.snackbarsToUnstack[0];
            const opts: MatSnackBarConfig = { duration: 30000 };
            opts.data = this.currentSnackbar;
            this.extendsMatSnackbarOptions(opts, this.currentSnackbar.opts);
            const snackbar = this.matSnackBar.openFromComponent(
                SnackNotificationComponent,
                opts,
            );
            const sub = snackbar.afterDismissed().subscribe(() => {
                this.currentSnackbar = null;
                this.unstack();
            });
            this.eventsCollector.collect(sub);
            this.snackbarsToUnstack.splice(0, 1);
        }
    }
}
