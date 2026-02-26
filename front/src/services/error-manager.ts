import { DialogButton, DialogService } from 'nextalys-angular-tools';
import { AuthProvider } from '../providers/auth-provider';
import { BaseComponentSimple, BaseSimpleError } from './simple-types';

export class ErrorManager {
    private static dialogService: DialogService;
    static GenericError =
        "Une erreur s'est produite, veuillez réessayer ultérieurement.";

    static init(dialogService: DialogService) {
        this.dialogService = dialogService;
    }

    static handleErrorResponse(
        response: BaseSimpleError,
        baseComponent: BaseComponentSimple,
        showReportButton = true,
    ): boolean {
        if (!!response?.success) {
            return false;
        }

        if (!response || response.success || !this?.dialogService?.showDialog) {
            return false;
        }

        const closeButtonDefault = {
            Label: 'Fermer',
            matIcon: 'close',
            CloseDialog: true,
            Callback: () => {},
            Index: 1,
        };
        let buttons: DialogButton[] = [closeButtonDefault];
        const dialogContent = response.message || this.GenericError;
        // if (dialogContent.indexOf('Voici le code d\'erreur à transmettre à l\'administrateur') !== -1) {
        let errorGuid: string;

        if (response.errorGuid) {
            errorGuid = response.errorGuid;
        } else {
            // console.log("Log ~ file: error-manager.ts:9 ~ ErrorManager ~ handleErrorResponse ~ dialogContent", dialogContent);
            const regex =
                /([{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?)/;
            // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
            const match = dialogContent.match(regex);
            if (match?.length && match.length > 1 && match[1]) {
                errorGuid = match[1];
            }
        }

        if (errorGuid && AuthProvider.instance?.isAdminAuthenticated()) {
            buttons = [
                {
                    matIcon: 'visibility',
                    Label: "Afficher l'erreur",
                    CloseDialog: false,
                    Callback: (arg) => {
                        arg.dialog.close();
                        this.dialogService.showDialog(
                            '<div class="d-flex" style="gap:12px">' +
                                response.message +
                                '</div>',
                        );
                        // baseComponent.sendApiRequest(this.globalDataService.reportError(errorGuid, window?.location?.href, window?.navigator?.userAgent));
                    },
                    Index: 0,
                },
                ...buttons,
            ];
        }

        // console.log("Log ~ file: error-manager.ts:14 ~ ErrorManager ~ handleErrorResponse ~ match[1]", match[1]);
        // }
        this.dialogService?.showDialog(dialogContent, {
            buttons: buttons,
            exitOnClickOutside: true,
        });
        return true;
    }
}
