import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'nextalys-angular-tools';
import {
    CandidateApplicationsService,
    JobOfferDto,
} from '../../providers/api-client.generated';
import { FrontCandidateHelpers } from '../../services/front-candidate-helpers';
import { BaseComponent } from '../base/base.component';
import { JobOffersAutocompleteComponent } from '../job-offers-autocomplete/job-offers-autocomplete.component';

@Component({
    selector: 'app-candidate-apply-dialog',
    templateUrl: './candidate-apply-dialog.component.html',
    styleUrls: ['./candidate-apply-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CandidateApplyDialog extends BaseComponent {
    @ViewChild(JobOffersAutocompleteComponent)
    autocompleteComponent: JobOffersAutocompleteComponent;

    loading = false;
    currentJobOffer: JobOfferDto;
    currentJobOfferList: JobOfferDto[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private data: any,
        private dialogRef: MatDialogRef<CandidateApplyDialog>,
        private candidateApplicationsService: CandidateApplicationsService,
        public dialogService: DialogService,
        private translateService: TranslateService,
    ) {
        super();
    }

    removeJobFromSelection(jobOffer: JobOfferDto) {
        const index = this.currentJobOfferList.findIndex(
            (x) => x.id === jobOffer.id,
        );

        if (index !== -1) {
            this.currentJobOfferList.splice(index, 1);
        }
    }

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

    cancel() {
        this.dialogRef.close();
    }

    async validate() {
        if (!this.currentJobOfferList?.length) {
            return;
        }

        await FrontCandidateHelpers.applyToJobOffers(
            this,
            this.currentJobOfferList.map((x) => x.id),
        );

        this.dialogRef.close(true);
    }
}
