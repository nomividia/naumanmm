import { NgModule } from '@angular/core';
import { NextalysPdfViewerModule } from 'nextalys-pdf-viewer';
import { CommonModulesList } from '../../app/app.module';
import { BigImageDialogComponent } from './big-image-dialog.component';

@NgModule({
    imports: [...CommonModulesList, NextalysPdfViewerModule],
    declarations: [BigImageDialogComponent],
    exports: [BigImageDialogComponent],
})
export class BigImageDialogModule {}
