import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from 'nextalys-angular-tools';
import { AppTypes } from '../../../../shared/shared-constants';
import {
    AppValueDto,
    GetHistoryRequestParams,
    HistoryDto,
    HistoryService,
    ReferentialService,
} from '../../providers/api-client.generated';
import { BaseComponent } from '../base/base.component';

@Component({
    selector: 'app-candidate-status-histories-dialog',
    templateUrl: './candidate-status-histories-dialog.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: [
        './candidate-status-histories-dialog.component.scss',
        '../../pages/base/edit-page-style.scss',
    ],
})
export class CandidateStatusHistoriesDialogComponent
    extends BaseComponent
    implements OnInit
{
    loading: boolean;
    appValues: AppValueDto[];

    histories: HistoryDto[] = [];
    hasPendingModification = false;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: GetHistoryRequestParams,
        public dialogRef: MatDialogRef<CandidateStatusHistoriesDialogComponent>,
        private dialogService: DialogService,
        private historiesService: HistoryService,
        private referentialService: ReferentialService,
    ) {
        super();
    }

    ngOnInit() {
        this.loadHistories();
    }

    private async loadHistories() {
        this.loading = true;

        const historiesResponse = await this.historiesService
            .getAllHistories(this.data)
            .toPromise();
        this.loading = false;

        if (!historiesResponse.success) {
            this.dialogService.showDialog(historiesResponse.message);

            return;
        }

        this.histories = historiesResponse.histories;

        if (this.histories?.length) {
            this.histories.sort((a, b) => b.date.getTime() - a.date.getTime());
        }

        await this.loadAppValue();
    }

    private async loadAppValue() {
        this.loading = true;
        const valueResponse = await this.referentialService
            .getTypeValues({
                appTypeCode: AppTypes.CandidateStatusCode,
                includeTranslations: 'true',
            })
            .toPromise();
        this.loading = false;

        if (valueResponse.success) {
            this.appValues = valueResponse.appType.appValues;
        }
    }

    public getAppValue(code: string) {
        if (!this.appValues?.length) {
            return;
        }

        return this.appValues.find((x) => x.code === code);
    }
}
