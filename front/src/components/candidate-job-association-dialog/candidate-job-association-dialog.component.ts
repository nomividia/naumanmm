import {
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'nextalys-angular-tools';
import { takeUntil } from 'rxjs/operators';
import { AppTypes } from '../../../../shared/shared-constants';
import { AppValueDto } from '../../providers/api-client.generated';
import { ReferentialProvider } from '../../providers/referential.provider';
import { BaseComponent } from '../base/base.component';

export interface CandidateJobAssociatonData {
    isGenderDefined?: boolean;
}

export interface CandidateJobAssociatonResult {
    validated: boolean;
    selectedJobs: string[];
    selectedGender?: AppValueDto;
}

@Component({
    selector: 'app-candidate-job-association-dialog',
    templateUrl: './candidate-job-association-dialog.component.html',
    styleUrls: ['./candidate-job-association-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CandidateJobAssociatonDialog
    extends BaseComponent
    implements OnInit, OnDestroy
{
    selectedCurrentJobIds: string[];
    loading: boolean;
    selectedGender: AppValueDto;

    jobList: AppValueDto[] = [];
    genders: AppValueDto[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: CandidateJobAssociatonData,
        private dialogRef: MatDialogRef<CandidateJobAssociatonDialog>,
        private referentialService: ReferentialProvider,
        private dialogService: DialogService,
        private translateService: TranslateService,
    ) {
        super();
        this.init();
    }

    ngOnInit() {
        // Subscribe to language changes and reload job data
        this.translateService.onLangChange
            .pipe(takeUntil(this.destroySubject))
            .subscribe(() => {
                this.init();
            });
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    async init() {
        const response = await this.referentialService.getTypesValuesJobs([
            AppTypes.PersonGenderCode,
        ]);

        if (response.length) {
            for (const item of response.filter(
                (x) => x.code !== AppTypes.PersonGenderCode,
            )) {
                this.jobList.push(...item.appValues);
            }

            this.genders = response.find(
                (x) => x.code === AppTypes.PersonGenderCode,
            ).appValues;
        }
    }

    getJobLabel(selectedId: string) {
        if (!selectedId || !this.jobList.length) {
            return null;
        }

        return this.jobList.find((x) => x.id === selectedId);
    }

    onCurrentJobsChange() {}

    validate() {
        // if (!this.data.isGenderDefined && !this.selectedGender) {
        //     return;
        // }
        this.dialogRef.close({
            validated: true,
            selectedJobs: this.selectedCurrentJobIds,
            selectedGender: this.selectedGender,
        });
    }

    cancel() {
        this.dialogRef.close();
    }
}
