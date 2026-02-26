import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from 'nextalys-angular-tools';
import { MailContent } from '../../../../back/shared/mail-content';
import {
    AppMainSender,
    defaultAppLanguage,
} from '../../../../shared/shared-constants';
import { SharedService } from '../../../../shared/shared-service';
import {
    JobOfferDto,
    JobOffersService,
    MailService,
} from '../../providers/api-client.generated';
import { LanguageProvider } from '../../providers/language.provider';
import { BaseComponent } from '../base/base.component';

export interface SendJobOfferMailDialogData {
    jobOffer: JobOfferDto;
}

@Component({
    selector: 'app-send-job-offer-mail-dialog',
    templateUrl: 'send-job-offer-mail-dialog.component.html',
    styleUrls: ['./send-job-offer-mail-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SendJobOfferMailDialogComponent
    extends BaseComponent
    implements OnInit
{
    loading: boolean;
    mailError: string;

    SenderMailList = [AppMainSender];

    mailObject: {
        object?: string;
        content?: string;
        email?: string;
        sender?: string;
    } = {};

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: SendJobOfferMailDialogData,
        public dialogRef: MatDialogRef<SendJobOfferMailDialogComponent>,
        private jobOffersService: JobOffersService,
        private dialogService: DialogService,
        private mailService: MailService,
    ) {
        super();
    }

    ngOnInit() {
        const mailData = MailContent.getMailContentAndSubject(
            'SendJobOfferToCandidate',
            true,
            (LanguageProvider.currentLanguage?.code as any) ||
                defaultAppLanguage,
            null,
            [this.data.jobOffer.publicLink],
        );

        this.mailObject.object =
            mailData.subject + ' - ' + this.data.jobOffer.title;
        this.mailObject.content = mailData.content;

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
            !SharedService.isValidEmail(this.mailObject.email)
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
