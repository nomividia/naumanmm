import { Location } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'nextalys-angular-tools';
import { DateHelpers } from 'nextalys-js-helpers';
import { environment } from '../../../environments/environment';
import {
    NotificationDto,
    UsersService,
} from '../../../providers/api-client.generated';
import { AuthProvider } from '../../../providers/auth-provider';
import { LanguageProvider } from '../../../providers/language.provider';
import { NotificationsManager } from '../../../providers/notifications-manager.service';
import { PwaProvider } from '../../../providers/pwa-provider';
import { WebPushProvider } from '../../../providers/web-push.provider';
import { EventsHandler } from '../../../services/events.handler';
import { BaseComponent } from '../../base/base.component';
import { ConnectAsDialog } from '../../connect-as-dialog/connect-as-dialog.component';

const oneHour = 3600000;
const oneMinute = 60000;

@Component({
    selector: 'header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent extends BaseComponent implements OnInit {
    public PwaProvider = PwaProvider;
    LanguageProvider = LanguageProvider;

    private searchInputTimeoutId: any = null;
    public showInstallButton = false;

    @Input() title: string;
    @Input() link: string;
    @Input() linkText: string;
    @Input() smallText: string;
    @Input() menuExpanded: boolean;
    @Input() hasSearchInput = false;
    @Input() searchInputDelay = 300;
    @Input() searchInputText = '';
    @Input() subTitle: string;
    @Input() endIcon: string;
    @Input() showPendingModification: boolean = false;
    @Input() searchInputDisabled: boolean = false;

    @Output() inputSearchChange = new EventEmitter<string>();

    public get unseenNotificationsCount() {
        return this.notificationsManager.notificationsList.filter(
            (x) => !x.seen,
        ).length;
    }

    constructor(
        private authProvider: AuthProvider,
        public notificationsManager: NotificationsManager,
        private dialogService: DialogService,
        private languageProvider: LanguageProvider,
        private matDialog: MatDialog,
        private webPushProvider: WebPushProvider,
        private translateService: TranslateService,
        private usersService: UsersService,
        private location: Location,
    ) {
        super();
    }

    ngOnInit(): void {
        PwaProvider.init();
        this.eventsCollector.collect(
            PwaProvider.showInstallButton.subscribe((show: boolean) => {
                this.showInstallButton = show;
            }),
        );
    }

    async logout() {
        const dialogResult = await this.dialogService.showConfirmDialog(
            this.translateService.instant('Global.ConfirmLogout'),
        );

        if (!dialogResult.okClicked) {
            return;
        }

        this.authProvider.logout();
    }

    expandOrCollapseMenu() {
        this.menuExpanded = !this.menuExpanded;
        EventsHandler.ExpandOrCollapseMenuEvent.next();
    }

    backToPreviousPage() {
        this.location.back();
    }

    goToProfile() {}

    expandNotifications() {}

    expandProfile() {}

    resetUnseenNotificationsCount() {
        this.notificationsManager.setNotificationsSeen();
    }

    getNotificationDate(notificationDate: Date) {
        if (!notificationDate) {
            return '';
        }

        const dateNow = new Date();

        const diffTime = dateNow.getTime() - notificationDate.getTime();
        if (diffTime < oneHour) {
            if (diffTime < oneMinute) {
                return "A l'instant";
            } else {
                return (
                    'Il y a ' + Math.trunc(diffTime / oneMinute) + ' minute(s)'
                );
            }
        } else if (diffTime < 12 * oneHour) {
            return 'Il y a ' + Math.round(diffTime / oneHour) + ' heure(s)';
        } else {
            if (DateHelpers.daysDiff(dateNow, notificationDate) === 0) {
                return (
                    "Aujourd'hui à " + DateHelpers.formatTime(notificationDate)
                );
            } else {
                return (
                    'Le ' +
                    DateHelpers.formatDate(notificationDate) +
                    ' à ' +
                    DateHelpers.formatTime(notificationDate)
                );
            }
        }
    }

    showAboutDialog() {
        this.dialogService.showDialog(
            `
        <div style="text-align:center">
        <br/>
        <img style="height:120px;" src="/assets/logos/logo-new.png"/>
        <br/>
        <br/>
        <p style="font-size:16px">${environment.appName} - CRM</p>
        <br/>
        Version <b>${environment.version}</b>
        <br/>
        <br/>
        <br/>
<i>Développé par Nextalys</i>
        </div>
        `,
            {
                buttons: [
                    {
                        Label: 'Fermer',
                        CloseDialog: true,
                        Callback: null,
                        Index: 0,
                    },
                ],
            },
        );
    }

    showConnectAsDialog() {
        if (this.AuthDataService.currentRequester) {
            this.GlobalAppService.ShowMainLoadingOverlay();
            this.authProvider.backToOriginalRequester();
        } else {
            this.matDialog.open(ConnectAsDialog);
        }
    }

    requestPushPermission() {
        this.webPushProvider.subscribeToPush();
    }

    onSearchInputChange() {
        if (this.searchInputTimeoutId) {
            clearTimeout(this.searchInputTimeoutId);
        }

        this.searchInputTimeoutId = setTimeout(() => {
            this.inputSearchChange.emit(this.searchInputText);
        }, this.searchInputDelay);
    }

    handleNotificationClick(notification: NotificationDto) {
        if (!notification?.url) {
            return;
        }

        window.open(notification.url, '_blank');
    }

    getNotificationTitle(notification: NotificationDto) {
        return (
            notification.title +
            ' - ' +
            this.getNotificationDate(notification.creationDate)
        );
    }

    changeLanguage(langCode: string) {
        // console.log("Log ~ file: header.component.ts ~ line 168 ~ HeaderComponent ~ changeLanguage ~ langCode", langCode);
        this.languageProvider.changeLanguage(langCode);
        this.usersService.updateMyLanguage({ langCode: langCode }).toPromise();
    }
}
