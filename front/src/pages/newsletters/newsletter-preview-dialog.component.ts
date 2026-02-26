import {
    Component,
    ElementRef,
    Inject,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from 'nextalys-angular-tools';
import { BaseComponent } from '../../components/base/base.component';
import { NewsletterService } from '../../providers/api-client.generated';

@Component({
    selector: 'app-newsletter-preview-dialog',
    templateUrl: './newsletter-preview-dialog.component.html',
    styleUrls: ['./newsletter-preview-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NewsLetterPreviewDialogComponent extends BaseComponent {
    loading = false;

    @ViewChild('previewFrame') iframe: ElementRef<HTMLIFrameElement>;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: { id: string; beforeSendMode?: boolean },
        public dialogRef: MatDialogRef<NewsLetterPreviewDialogComponent>,
        private newsletterService: NewsletterService,
        private dialogService: DialogService,
    ) {
        super();
        this.dialogRef?.addPanelClass('newsletter-preview-dialog-wrapper');
        this.loadData();
    }

    async loadData() {
        if (!this.data?.id) {
            return;
        }

        const response = await this.sendApiRequest(
            this.newsletterService.previewNewsletter({ id: this.data.id }),
        );

        if (!response.success) {
            this.dialogService.showDialog(response.message);

            return;
        }

        this.iframe?.nativeElement?.contentWindow.document?.open();
        this.iframe?.nativeElement?.contentWindow.document?.write(
            response.message,
        );
        const width = window.innerWidth > 0 ? window.innerWidth : screen.width;
        // console.log("Log ~ file: newsletter-preview-dialog.component.ts ~ line 41 ~ NewsLetterPreviewDialogComponent ~ loadData ~ width", width);

        if (width > 700 && this.iframe.nativeElement.contentWindow.document) {
            const doc = this.iframe.nativeElement.contentWindow.document;
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            const otherhead = doc.getElementsByTagName('head')[0];

            if (otherhead) {
                const styleTag = doc.createElement('style');
                styleTag.innerHTML =
                    'html {transform: scale(0.50);transform-origin:top;}';
                otherhead.appendChild(styleTag);
            }
        }

        this.iframe?.nativeElement?.contentWindow.document?.close();
    }

    cancel() {
        this.dialogRef.close(false);
    }

    validate() {
        this.dialogRef.close(true);
    }
}
