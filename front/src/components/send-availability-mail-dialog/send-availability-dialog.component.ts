import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from 'nextalys-angular-tools';
import { RegexHelpers } from 'nextalys-js-helpers/dist/regex-helpers';
import { MailContent } from '../../../../back/shared/mail-content';
import {
    defaultAppLanguage,
    SenderMailList,
} from '../../../../shared/shared-constants';
import {
    CandidateDto,
    JobOffersService,
    MailService,
} from '../../providers/api-client.generated';
import { LanguageProvider } from '../../providers/language.provider';
import { BaseComponent } from '../base/base.component';

export class SendAvailabilityDialogData {
    candidate?: CandidateDto;
}

@Component({
    selector: 'app-send-availability-dialog',
    templateUrl: './send-availability-dialog.component.html',
    styleUrls: ['./send-availability-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SendAvailabilityDialogComponent
    extends BaseComponent
    implements OnInit
{
    loading: boolean;
    mailError: string;

    SenderMailList = SenderMailList;

    mailObject: {
        object?: string;
        content?: string;
        email?: string;
        sender?: string;
    } = {};

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: SendAvailabilityDialogData,
        public dialogRef: MatDialogRef<SendAvailabilityDialogData>,
        private jobOffersService: JobOffersService,
        private dialogService: DialogService,
        private mailService: MailService,
    ) {
        super();
    }

    ngOnInit() {
        console.log(this.data);

        const mailData = MailContent.getMailContentAndSubject(
            'SendFollwUpAvailability',
            false,
            (LanguageProvider.currentLanguage?.code as any) ||
                defaultAppLanguage,
            null,
            [this.data?.candidate?.firstName],
        );

        this.mailObject.object = mailData.subject;
        this.mailObject.content = mailData.content;

        this.mailObject.email = this.data?.candidate?.email;

        // this.mailObject.content = 'Bonjour,<br />Nous pensons que cette offre d\'emploi peut vous interesser : <a href="'
        //     + this.data.jobOffer.publicLink + '">' + this.data.jobOffer.publicLink +
        //     '</a><br />Vous pouvez postuler directement sur la page de l\'offre.<br />L\'équipe MMI';
    }

    async onValidate() {
        this.mailError = null;

        if (!this.mailObject.content) {
            this.dialogService.showDialog('Veuillez saisir une message');
            return;
        }

        if (
            this.mailObject.email &&
            !RegexHelpers.isValidEmail(this.mailObject.email)
        ) {
            this.mailError = 'Veuillez saisir une adresse email valide';
        }

        if (
            this.mailError ||
            !this.mailObject.sender ||
            !this.mailObject.email
        ) {
            return;
        }

        this.loading = true;
        const sendMailResponse = await this.mailService
            .sendMail({
                mailRequest: {
                    content: this.mailObject.content,
                    email: this.mailObject.email,
                    object: this.mailObject.object,
                    sender: this.mailObject.sender,
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
