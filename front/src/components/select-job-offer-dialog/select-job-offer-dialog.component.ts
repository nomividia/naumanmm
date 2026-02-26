import { Component, Inject, OnDestroy, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { TranslateService } from '@ngx-translate/core';
import { FileUploadData, FileUploadOptions } from 'nextalys-file-upload';
import { Subject } from 'rxjs';
import { JobOfferDto } from '../../providers/api-client.generated';

export interface SelectJobOfferDialogData {
    candidateName: string;
}

export interface SelectJobOfferDialogResponse {
    selectedJobOffer: JobOfferDto;
    startDate: Date;
    contractFileUploadData: FileUploadData;
}

@Component({
    selector: 'app-select-job-offer-dialog',
    templateUrl: './select-job-offer-dialog.component.html',
    styleUrls: ['./select-job-offer-dialog.component.scss'],
})
export class SelectJobOfferDialogComponent implements OnDestroy {
    selectedJobOffer: JobOfferDto;
    noAvailableJobOffers: boolean = false;

    startDate: Date = null;
    contractFileUploadData: FileUploadData = {};
    contractFileOptions: FileUploadOptions = {
        controller: {
            openFilePicker: new Subject(),
            reset: new Subject(),
        },
        allowedFileTypes: ['pdf', 'doc', 'image'],
        filesCount: 1,
    };
    isContractUploaded: boolean = false;

    @ViewChild('stepper') stepper: MatStepper;

    constructor(
        public dialogRef: MatDialogRef<SelectJobOfferDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: SelectJobOfferDialogData,
        private translate: TranslateService,
    ) {}

    ngOnDestroy(): void {
        this.contractFileOptions.controller.openFilePicker.complete();
        this.contractFileOptions.controller.reset.complete();
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onConfirm(): void {
        if (!this.canConfirm) {
            return;
        }

        const response: SelectJobOfferDialogResponse = {
            selectedJobOffer: this.selectedJobOffer,
            startDate: this.startDate,
            contractFileUploadData: this.contractFileUploadData,
        };
        this.dialogRef.close(response);
    }

    onJobOfferSelected(jobOffer: JobOfferDto): void {
        this.selectedJobOffer = jobOffer;
    }

    onContractFileComplete(): void {
        console.log('onContractFileComplete called');
        console.log('contractFileUploadData', this.contractFileUploadData);
        console.log('fileItems length', this.contractFileUploadData?.fileItems?.length);
        if (this.contractFileUploadData?.fileItems?.length > 0) {
            this.isContractUploaded = true;
            console.log('isContractUploaded set to true');
        } else {
            console.log('fileItems is empty or undefined');
        }
    }

    openContractFilePicker(): void {
        this.contractFileOptions.controller.reset.next();
        this.contractFileOptions.controller.openFilePicker.next();
    }

    onNext(): void {
        this.stepper.next();
    }

    get canConfirm(): boolean {
        return this.isContractUploaded && this.startDate !== null;
    }
}
