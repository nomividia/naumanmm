import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from 'nextalys-angular-tools';
import { JobOfferDto } from '../../providers/api-client.generated';
import { ReferentialProvider } from '../../providers/referential.provider';
import { BaseComponent } from '../base/base.component';
import { JobOffersAutocompleteComponent } from '../job-offers-autocomplete/job-offers-autocomplete.component';

export interface CandidateToTransfer {
    id?: string;
}

export interface CandidateTransferResult {
    validated: boolean;
}

@Component({
    selector: 'app-candidate-transfer-dialog',
    templateUrl: './candidate-transfer-dialog.component.html',
    styleUrls: ['./candidate-transfer-dialog.component.scss'],
})
export class CandidateTransferDialogComponent extends BaseComponent {
    loading: boolean;
    currentJobOffer: JobOfferDto;
    autocompleteComponent: JobOffersAutocompleteComponent;

    currentJobOfferList: JobOfferDto[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: CandidateToTransfer,
        private dialogRef: MatDialogRef<CandidateTransferDialogComponent>,
        private referentialService: ReferentialProvider,
        private dialogService: DialogService,
    ) {
        super();
        this.init();
    }

    async init() {}

    addJobOfferInSelectionList() {
        if (!this.currentJobOffer?.id) {
            return;
        }

        if (
            this.currentJobOfferList.some(
                (x) => x.id === this.currentJobOffer.id,
            )
        ) {
            return;
        }

        this.currentJobOfferList.push(this.currentJobOffer);
        this.currentJobOffer = null;
        this.autocompleteComponent?.clear();
    }

    validate() {
        console.log(
            'update candidate application and assign the selected job offer',
        );
    }

    cancel() {
        this.dialogRef.close();
    }
}
