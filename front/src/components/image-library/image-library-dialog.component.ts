import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileUploadOptions } from 'nextalys-file-upload';
import { AppImageDto } from '../../providers/api-client.generated';

@Component({
    selector: 'app-image-library-dialog',
    encapsulation: ViewEncapsulation.None,
    template: `
        <app-image-library
            style="height:90%"
            [fileUploadOptions]="fileUploadOptions"
            (imageSelectedChange)="imageSelectedChange($event)"
        ></app-image-library>
        <div class="buttons-wrapper">
            <button
                [disabled]="!selectedImage"
                style="margin-right: 10px;"
                mat-raised-button
                (click)="validateSelection()"
            >
                Valider
            </button>
            <button mat-raised-button (click)="close()">Annuler</button>
        </div>
    `,
    styles: [
        `
            app-image-library-dialog {
                display: block;
                height: 100%;
                width: 100%;
            }
            .image-library-dialog-wrapper {
                width: 95vw;
                max-width: 95vw !important;
                max-height: 95vh;
                height: 95vh;
            }
            app-image-library-dialog .buttons-wrapper {
                text-align: center;
            }
        `,
    ],
})
export class ImageLibraryDialogComponent implements OnInit {
    public selectedImage: AppImageDto;

    constructor(
        @Inject(MAT_DIALOG_DATA) public fileUploadOptions: FileUploadOptions,
        public dialogRef: MatDialogRef<ImageLibraryDialogComponent>,
    ) {}

    ngOnInit(): void {}

    validateSelection() {
        this.dialogRef.close(this.selectedImage);
    }

    close() {
        this.dialogRef.close();
    }

    imageSelectedChange(image: AppImageDto) {
        this.selectedImage = image;
    }
}
