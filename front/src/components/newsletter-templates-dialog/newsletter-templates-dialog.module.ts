import { NgModule } from '@angular/core';
import { CommonModulesList } from '../../app/app.module';
import { NewsletterTemplatesDialogComponent } from './newsletter-templates-dialog.component';

@NgModule({
    imports: [...CommonModulesList],
    declarations: [NewsletterTemplatesDialogComponent],
    exports: [NewsletterTemplatesDialogComponent],
})
export class NewsletterTemplatesDialogModule {}
