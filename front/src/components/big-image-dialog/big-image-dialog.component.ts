import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DialogService } from 'nextalys-angular-tools';
import { BrowserFileHelpers } from 'nextalys-js-helpers/dist/browser-file-helpers';
import { SharedCandidatesHelpers } from '../../../../shared/candidates-helpers';
import { GenericError } from '../../environments/constants';
import { AppFileDto, CandidateDto } from '../../providers/api-client.generated';
import { GlobalAppService } from '../../services/global.service';
import { BaseComponent } from '../base/base.component';
import {
    SendFolderCustomerDialogComponent,
    SendFolderCustomerDialogData,
} from '../send-folder-customer/send-folder-dialog.component';

export interface BigImageDialogData {
    file: AppFileDto;
    useOriginalSize?: boolean;
    candidateName?: string;
    fileTypeLabel?: string;
    isResume?: boolean;
    candidate?: CandidateDto;
}

@Component({
    selector: 'app-big-image-dialog',
    templateUrl: './big-image-dialog.component.html',
    styleUrls: ['./big-image-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BigImageDialogComponent extends BaseComponent implements OnInit {
    loading: boolean;
    base64: string;
    dataUri: string;
    pdfDataUrl: SafeResourceUrl | null = null;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: BigImageDialogData,
        public dialogRef: MatDialogRef<BigImageDialogComponent>,
        private dialogService: DialogService,
        private httpClient: HttpClient,
        private sanitizer: DomSanitizer,
    ) {
        super();
    }

    ngOnInit() {
        this.getFileDataUri();
    }

    async getFileDataUri() {
        this.GlobalAppService.ShowMainLoadingOverlay();
        this.loading = true;
        let errors = false;

        try {
            const response = await GlobalAppService.getBlobFile(
                this.httpClient,
                '/api/gdrive/downloadGloudStorageFile/' +
                    this.data.file.id +
                    '?returnBlob=true',
                'get',
                null,
                { component: this },
            );

            if (!response.success) {
                this.dialogService.showDialog(GenericError);
            }

            if (this.data.file.mimeType.indexOf('image') !== -1) {
                this.dataUri = await BrowserFileHelpers.readFile(
                    response.blob,
                    'dataUri',
                );
            } else {
                this.base64 = await BrowserFileHelpers.readFile(
                    response.blob,
                    'base64',
                );
                // Update the sanitized PDF data URL
                if (this.base64) {
                    const dataUrl = `data:application/pdf;base64,${this.base64}`;
                    this.pdfDataUrl =
                        this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
                }
            }
        } catch (err) {
            errors = true;
        }

        this.loading = false;
        this.GlobalAppService.HideMainLoadingOverlay();

        if (errors) {
            this.dialogRef.close();
        }
    }

    printFile() {
        // Print functionality - opens PDF in new window for printing
        if (this.base64) {
            const printWindow = window.open();
            printWindow.document.write(`
                <html>
                    <head><title>Print PDF</title></head>
                    <body style="margin: 0;">
                        <iframe src="data:application/pdf;base64,${this.base64}"
                                style="width: 100%; height: 100vh; border: none;">
                        </iframe>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        }
    }

    downloadFile() {
        let fileName: string;

        if (!this.data.candidateName || this.data.candidateName === '_') {
            this.data.candidateName = '';
        }

        if (this.data.candidateName) {
            if (this.data.isResume) {
                fileName = this.data.candidateName + '_MMI_RESUME.pdf';
            } else if (this.data.fileTypeLabel) {
                // fileName = this.data.candidateName + "_" + this.data.fileTypeLabel.replace(' ', '_');
                fileName =
                    SharedCandidatesHelpers.getCandidateFileNameWithExtension({
                        file: this.data.file,
                    });
            } else {
                fileName =
                    SharedCandidatesHelpers.getCandidateFileNameWithExtension({
                        file: this.data.file,
                    });
            }
        } else {
            if (this.data.isResume) {
                fileName = 'No_Name_MMI_RESUME.pdf';
            } else {
                fileName =
                    SharedCandidatesHelpers.getCandidateFileNameWithExtension({
                        file: this.data.file,
                    });
            }
        }

        if (this.base64) {
            BrowserFileHelpers.downloadFile({
                base64: this.base64,
                fileName: fileName,
                mimeType: this.data.file.mimeType,
            });
        } else if (this.dataUri) {
            BrowserFileHelpers.downloadFile({
                dataUri: this.dataUri,
                fileName: fileName,
            });
        }
    }

    isDocumentPrintable() {
        if (this.data.file.mimeType !== 'application/pdf') {
            return false;
        }

        return true;
    }

    isDocumentPdfOrImage() {
        if (
            this.data.file.mimeType !== 'application/pdf' &&
            !this.data.file.mimeType.includes('image')
        ) {
            return false;
        }

        return true;
    }

    async openSendToCustomerDialog() {
        const dialogData: SendFolderCustomerDialogData = {
            mode: 'sendCandidate',
            candidate: this.data.candidate,
            selectResumeByDefault: true,
        };

        await this.dialogService.showCustomDialogAwaitable({
            component: SendFolderCustomerDialogComponent,
            exitOnClickOutside: false,
            data: dialogData,
            minHeight: '80vh',
            minWidth: '70vw',
        });
    }
}
