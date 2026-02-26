import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { DialogService } from 'nextalys-angular-tools';
import { RolesList } from '../../../shared/shared-constants';
import { AuthDataService } from '../services/auth-data.service';
import { GlobalAppService } from '../services/global.service';

@Injectable()
export class UpdateService {
    constructor(
        private swUpdate: SwUpdate,
        private dialogService: DialogService,
        private activatedRoute: ActivatedRoute,
    ) {}

    init() {
        // this.onNewVersion();
        if (!this.swUpdate.isEnabled) {
            console.log('Sw not activated');

            return;
        }

        this.swUpdate.versionUpdates.subscribe((evt) => {
            switch (evt.type) {
                case 'VERSION_DETECTED':
                    console.log(
                        `Downloading new app version: ${evt.version.hash}`,
                    );
                    break;
                case 'VERSION_READY':
                    console.log(
                        `Current app version: ${evt.currentVersion.hash}`,
                    );
                    console.log(
                        `New app version ready for use: ${evt.latestVersion.hash}`,
                    );
                    this.onNewVersion();
                    break;
                case 'VERSION_INSTALLATION_FAILED':
                    console.log(
                        `Failed to install app version '${evt.version.hash}': ${evt.error}`,
                    );
                    break;
            }
        });
    }

    private onNewVersion() {
        const preventShowUpgradeSnackBar =
            this.activatedRoute?.snapshot?.data?.preventShowUpgradeSnackBar;

        if (!!preventShowUpgradeSnackBar) {
            return;
        }

        if (!this.mustShowUpdateAppToast()) {
            // console.log('prevent show update dialog');
            return;
        }

        this.dialogService.showCustomSnackBar({
            text: 'Une mise à jour est disponible, cliquez sur "Installer" pour l\'activer.',
            actions: [
                {
                    text: 'Installer',
                    autoClose: false,
                    cb: () => {
                        GlobalAppService.ShowMainLoadingOverlay(
                            "Mise à jour de l'application en cours...",
                        );
                        window.location.reload();
                    },
                    cssClass: 'light-blue',
                },
                {
                    autoClose: true,
                    matIcon: 'close',
                    cssClass: 'white-icon',
                },
            ],
            config: { duration: null },
            actionsInARow: true,
        });
    }

    private mustShowUpdateAppToast() {
        return (
            !!AuthDataService.currentUser?.id &&
            GlobalAppService.userHasOneOfRoles(AuthDataService.currentUser, [
                RolesList.Admin,
                RolesList.AdminTech,
                RolesList.Consultant,
                RolesList.RH,
            ])
        );
    }
}
