import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { BasePageComponent } from '../base/base-page.component';
// import { environment } from '../../environments/environment';

@Component({
    selector: 'app-logs-page',
    template: `
        <app-drawer-main-container>
            <nxs-logs-manager
                [downloadFileMethod]="downloadFile.bind(this)"
                [openInNewWindowMethod]="openInNewWindow.bind(this)"
                (logFileChanged)="logFileChanged($event)"
            ></nxs-logs-manager>
        </app-drawer-main-container>
    `,
    styles: [],
})
export class LogsPageComponent extends BasePageComponent {
    logFile: string;
    logType: string;

    constructor() {
        super();
    }

    ngOnInit(): void {}

    downloadFile() {
        if (!this.logFile || !this.logType) {
            return;
        }

        window.open(
            environment.apiBaseUrl +
                '/api/referential/downloadLogFile?date=' +
                this.logFile +
                '&type=' +
                this.logType,
            '_blank',
        );
    }

    openInNewWindow() {
        if (!this.logFile || !this.logType) {
            return;
        }

        window.open(
            environment.apiBaseUrl +
                '/api/referential/downloadLogFile?date=' +
                this.logFile +
                '&type=' +
                this.logType +
                '&dl=0',
            '_blank',
        );
    }

    logFileChanged(data: { logFile: string; logType: string }) {
        // console.log("~ logFileChanged ~ logFile", data.logFile);
        // console.log("~ logFileChanged ~ logType", data.logType);
        this.logFile = data.logFile;
        this.logType = data.logType;
    }
}
