import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModulesList } from '../../app/app.module';
import { CandidateProcessWarningDialogComponent } from './candidate-process-warning-dialog.component';

@NgModule({
    imports: [
        ...CommonModulesList,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
    ],
    declarations: [CandidateProcessWarningDialogComponent],
    exports: [CandidateProcessWarningDialogComponent],
})
export class CandidateProcessWarningDialogModule {}
