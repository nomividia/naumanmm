import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'nextalys-angular-tools';
import { capitalize } from '../../../../shared/utils/capitalize';
import {
    MailService,
    UsersService,
} from '../../providers/api-client.generated';
import { AuthDataService } from '../../services/auth-data.service';
import { BaseComponent } from '../base/base.component';
import { TransferCandidateApplicationData } from '../candidate-application-informations/candidate-application-informations.component';

@Component({
    selector: 'app-transfer-candidate-application-mail-dialog',
    templateUrl: 'transfer-candidate-application-mail-dialog.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class TransferCandidateApplicationMailDialogComponent
    extends BaseComponent
    implements OnInit
{
    public loading: boolean;
    public mailError: string;
    public currentUserMail = AuthDataService.currentUser.mail;
    public RecipientList: { name: string; value: string }[] = [];
    public selectedRecipient: { name: string; value: string } | null = null;
    public mailObject: {
        object?: string;
        content?: string;
        email?: string;
        sender?: string;
    } = {};

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: TransferCandidateApplicationData,
        public dialogRef: MatDialogRef<TransferCandidateApplicationMailDialogComponent>,
        private dialogService: DialogService,
        private mailService: MailService,
        private userService: UsersService,
        private ngxTranslateService: TranslateService,
    ) {
        super();
    }

    ngOnInit() {
        this.mailObject.object = this.ngxTranslateService.instant(
            'CandidateApplication.TransferCandidateApplication.CandidateApplicationSubject',
            {
                firstName: this.data.candidateApplication.firstName,
                lastName: this.data.candidateApplication.lastName,
            },
        );
        this.getRecipientList();
    }

    async getRecipientList() {
        this.loading = true;
        const consultantResponse =
            await this.GlobalAppService.getConsultantOrRHList(
                this.userService,
                this,
            );

        if (consultantResponse.success) {
            this.RecipientList = consultantResponse.users
                .map((user) => ({
                    name: `${capitalize(user.firstName)} ${capitalize(
                        user.lastName,
                    )}`,
                    value: user.mail,
                }))
                .sort((a, b) => a.name.localeCompare(b.name));
        }

        this.loading = false;
    }

    onRecipientChange(recipient: { name: string; value: string }) {
        this.selectedRecipient = recipient;
        this.mailObject.email = recipient.value;
    }

    async onValidate() {
        this.mailError = null;

        if (!this.mailObject.content) {
            this.dialogService.showDialog('Veuillez saisir une message');
            return;
        }

        if (!this.selectedRecipient) {
            this.dialogService.showDialog(
                'Veuillez sélectionner un destinataire',
            );
            return;
        }

        this.loading = true;

        const buttonText: string = this.ngxTranslateService.instant(
            'CandidateApplication.TransferCandidateApplication.GoToCandidateApplication',
        );

        const sendMailResponse = await this.mailService
            .sendMail({
                mailRequest: {
                    content: `${this.mailObject.content} <br><br>
                        <a style="
                            display: inline-block;
                            background: #d76004;
                            color: #fff;
                            font-weight: 500;
                            border-radius: 8px;
                            padding: 10px 20px;
                            text-align: center;
                            text-decoration: none;
                            box-shadow: 0 2px 6px 0 rgba(0,0,0,0.2);
                            font-size: 14px;
                            font-family: Roboto, 'Helvetica Neue', sans-serif;
                        " href="${this.environment.baseUrl}/candidatures/${this.data.candidateApplication.id}">${buttonText}</a>`,
                    email: this.selectedRecipient.value,
                    object: this.mailObject.object,
                    sender: this.currentUserMail,
                },
            })
            .toPromise();

        if (!sendMailResponse.success) {
            this.dialogService.showDialog(sendMailResponse.message);
        } else {
            this.dialogService.showSnackBar('Mail envoyé');
            this.dialogRef.close();
        }

        this.loading = false;
    }
}
