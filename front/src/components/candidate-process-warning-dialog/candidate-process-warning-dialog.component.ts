import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CandidateStatus } from '../../../../shared/shared-constants';
import { BaseComponent } from '../base/base.component';

export interface CandidateProcessWarningDialogData {
    candidateName: string;
    warningType: CandidateStatus.InProcess | CandidateStatus.NotSelected;
}

export interface CandidateProcessWarningDialogResponse {
    understood: boolean;
}

@Component({
    selector: 'app-candidate-process-warning-dialog',
    templateUrl: './candidate-process-warning-dialog.component.html',
    styleUrls: ['./candidate-process-warning-dialog.component.scss'],
})
export class CandidateProcessWarningDialogComponent extends BaseComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: CandidateProcessWarningDialogData,
        private dialogRef: MatDialogRef<CandidateProcessWarningDialogComponent>,
        private translateService: TranslateService,
    ) {
        super();
    }

    getWarningTitle(): string {
        if (this.data.warningType === CandidateStatus.NotSelected) {
            return this.translateService.instant(
                'Candidate.NotSelectedWarningTitle',
            );
        }
        return this.translateService.instant('Candidate.ProcessWarningTitle');
    }

    getWarningMessage(): string {
        if (this.data.warningType === CandidateStatus.NotSelected) {
            return this.translateService.instant(
                'Candidate.NotSelectedWarningMessage',
                { candidateName: this.data.candidateName },
            );
        }
        return this.translateService.instant(
            'Candidate.ProcessWarningMessage',
            { candidateName: this.data.candidateName },
        );
    }

    getWarningDetails(): string {
        if (this.data.warningType === CandidateStatus.NotSelected) {
            return this.translateService.instant(
                'Candidate.NotSelectedWarningDetails',
            );
        }
        return this.translateService.instant('Candidate.ProcessWarningDetails');
    }

    onUnderstand(): void {
        this.dialogRef.close({ understood: true });
    }
}
