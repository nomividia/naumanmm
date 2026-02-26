import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from 'nextalys-angular-tools';
import { CandidateDto } from '../../../providers/api-client.generated';
import { BaseComponent } from '../../base/base.component';

export interface notesTableHeader {
    name: string;
    date: string;
    note: string;
}

@Component({
    selector: 'app-candidate-notes-dialog',
    templateUrl: './candidate-notes-dialog.component.html',
    styleUrls: ['./candidate-notes-dialog.component.scss'],
})
export class CandidateNotesDialogComponent
    extends BaseComponent
    implements OnInit
{
    candidateData: CandidateDto;

    displayedColumns: string[] = ['name', 'date', 'note'];
    dataSource = this.data.noteItems;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: CandidateDto,
        public dialogRef: MatDialogRef<CandidateNotesDialogComponent>,
        private dialogService: DialogService,
    ) {
        super();
    }

    ngOnInit(): void {}

    closeDialog() {
        this.dialogRef.close();
    }
}
