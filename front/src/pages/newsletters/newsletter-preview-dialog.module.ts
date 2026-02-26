import { NgModule } from '@angular/core';
import { CommonModulesList } from '../../app/app.module';
import { NewsLetterPreviewDialogComponent } from './newsletter-preview-dialog.component';

@NgModule({
    imports: [...CommonModulesList],
    declarations: [NewsLetterPreviewDialogComponent],
    exports: [NewsLetterPreviewDialogComponent],
})
export class NewsLetterPreviewDialogModule {}
