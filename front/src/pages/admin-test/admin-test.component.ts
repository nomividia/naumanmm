import { Component, ViewEncapsulation } from '@angular/core';
import { DialogService } from 'nextalys-angular-tools';
import { CustomSocketEventType } from '../../../../shared/shared-constants';
import { FirebaseEventsManager } from '../../modules/firebase/firebase-events-manager';
import {
    ApiSocketService,
    NotificationsService,
    UserDto,
} from '../../providers/api-client.generated';
import { AuthDataService } from '../../services/auth-data.service';
import { SocketService } from '../../services/socket.service';
import { BasePageComponent } from '../base/base-page.component';

@Component({
    selector: 'app-admin-test',
    templateUrl: './admin-test.component.html',
    // styleUrls: ['../../components/base/base-mat-table.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AdminTestComponent extends BasePageComponent {
    usersList = AuthDataService.UsersList;

    selectedUsers: UserDto[] = [];

    constructor(
        public dialogService: DialogService,
        private notificationsService: NotificationsService,
        private apiSocketService: ApiSocketService,
    ) {
        super();

        this.subscribeToObservable(
            FirebaseEventsManager.onEvent('SingleEvent'),
            (data) => {
                this.dialogService.showSnackBar(
                    'FROM Firebase : ' + (data.data as string),
                );
            },
        );

        SocketService.subscribeToEvent(
            CustomSocketEventType.NewMessage,
            this.eventsCollector,
            (data) => {
                this.dialogService.showSnackBar(
                    'FROM SOCKET : ' + (data.data as string),
                );
            },
        );
    }

    async sendNotification(sendToAllSocket: boolean) {
        if (this.selectedUsers.length === 0) {
            return;
        }

        this.GlobalAppService.ShowMainLoadingOverlay();

        const response = await this.sendApiRequest(
            this.notificationsService.sendNotificationTest({
                userId: this.selectedUsers[0].id,
                sendToAllSocket: sendToAllSocket ? 'true' : 'false',
            }),
        );

        if (!response.success) {
            this.dialogService.showDialog(response.message);
        }

        this.GlobalAppService.HideMainLoadingOverlay();
    }

    async sendEvent() {
        if (this.selectedUsers.length === 0) {
            return;
        }

        this.GlobalAppService.ShowMainLoadingOverlay();
        const response = await this.notificationsService
            .sendEventTest({ userId: this.selectedUsers[0].id })
            .toPromise();

        if (!response.success) {
            this.dialogService.showDialog(response.message);
        }

        this.GlobalAppService.HideMainLoadingOverlay();
    }

    async sendEventSocket(fromFirebase: boolean, sendToAllSocket: boolean) {
        if (this.selectedUsers.length === 0) {
            return;
        }

        this.GlobalAppService.ShowMainLoadingOverlay();

        const response = await this.sendApiRequest(
            this.notificationsService.sendEventTestSocket({
                userId: this.selectedUsers[0].id,
                fromFirebase: fromFirebase ? 'true' : '',
                sendToAllSocket: sendToAllSocket ? 'true' : 'false',
            }),
        );

        if (!response.success) {
            this.dialogService.showDialog(response.message);
        }

        this.GlobalAppService.HideMainLoadingOverlay();
    }

    async getSocketConnections() {
        // const response = await this.apiSocketService.getSocketConnections().toPromise();
        // console.log("Log: AdminTestComponent -> response", response);
    }
}
