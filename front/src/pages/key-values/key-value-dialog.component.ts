import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { KeyValueDto } from '../../providers/api-client.generated';

@Component({
    selector: 'app-key-value-dialog',
    templateUrl: './key-value-dialog.component.html',
    // styleUrls: ['./name.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class KeyValueDialogComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public keyValueDto: KeyValueDto,
        public dialogRef: MatDialogRef<KeyValueDialogComponent>,
    ) {}

    validate() {
        if (!this.keyValueDto.key) {
            return;
        }

        this.dialogRef.close(this.keyValueDto);
    }
}
