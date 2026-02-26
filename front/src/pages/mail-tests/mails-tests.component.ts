import { Component, ViewEncapsulation } from '@angular/core';
import { DialogService } from 'nextalys-angular-tools';
import { AppPage } from '../../../../shared/shared-constants';
import {
    GetMailConfigResponse,
    MailService,
} from '../../providers/api-client.generated';
import { BasePageComponent } from '../base/base-page.component';

@Component({
    selector: 'app-mails-tests',
    templateUrl: './mails-tests.component.html',
    styleUrls: ['./mails-tests.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MailsTestsComponent extends BasePageComponent {
    mailConfigResponse: GetMailConfigResponse;

    from = '';
    recipients = '';

    constructor(
        private mailService: MailService,
        private dialogService: DialogService,
    ) {
        super(null, null, AppPage.MailsTests);
        this.loadConfig();
    }

    async loadConfig() {
        const response = await this.sendApiRequest(
            this.mailService.getMailConfig(),
        );

        if (response.success) {
            this.mailConfigResponse = response;
            this.from = response.mailSender;
        }
    }

    async sendMail() {
        this.GlobalAppService.ShowMainLoadingOverlay(
            'Envoi du mail en cours...',
        );

        const response = await this.sendApiRequest(
            this.mailService.sendTestEmail({
                sendTestEmailRequest: {
                    from: this.from,
                    recipients: this.recipients,
                },
            }),
        );

        this.GlobalAppService.HideMainLoadingOverlay();

        if (!response.success) {
            this.dialogService.showDialog(response.message);
        } else {
            this.dialogService.showDialog('E-mail envoyé avec succès !');
        }
    }
}
