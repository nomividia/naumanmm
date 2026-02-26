import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'nextalys-angular-tools';
import {
    NewsletterTemplateDto,
    NewsletterTemplatesService,
} from '../../providers/api-client.generated';
import { BaseComponent } from '../base/base.component';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NewsletterTemplatesDialogComponentData {}

export interface NewsletterTemplatesDialogComponentResult {
    newsletterTemplate: NewsletterTemplateDto;
}

@Component({
    selector: 'app-newsletter-templates-dialog',
    templateUrl: './newsletter-templates-dialog.component.html',
    styleUrls: ['./newsletter-templates-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NewsletterTemplatesDialogComponent extends BaseComponent {
    newsletterTemplates: NewsletterTemplateDto[];
    newNewsletterTemplate: NewsletterTemplateDto;
    loading: boolean;
    addOrEditTemplateMode: boolean;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private data: NewsletterTemplatesDialogComponentData,
        public dialogRef: MatDialogRef<NewsletterTemplatesDialogComponent>,
        private dialogService: DialogService,
        private newsletterTemplatesService: NewsletterTemplatesService,
        private translateService: TranslateService,
    ) {
        super();
    }

    async ngOnInit() {
        await this.loadNewsletterTemplates();
    }

    private async loadNewsletterTemplates() {
        this.loading = true;
        const getNewsletterTemplatesResponse =
            await this.newsletterTemplatesService
                .getAllNewsletterTemplates({})
                .toPromise();
        this.loading = false;

        if (!getNewsletterTemplatesResponse.success) {
            this.dialogService.showDialog(
                getNewsletterTemplatesResponse.message,
            );

            return;
        }

        this.newsletterTemplates =
            getNewsletterTemplatesResponse.newsletterTemplates;
    }

    onAddNewTemplate() {
        this.newNewsletterTemplate = { content: '', title: '' };
        this.addOrEditTemplateMode = true;
    }

    async saveNewTemplate() {
        if (
            !this.newNewsletterTemplate?.content ||
            !this.newNewsletterTemplate?.title
        ) {
            return;
        }

        this.loading = true;
        const saveResponse = await this.newsletterTemplatesService
            .createOrUpdateNewsletterTemplate({
                newsletterTemplateDto: this.newNewsletterTemplate,
            })
            .toPromise();
        this.loading = false;

        if (!saveResponse.success) {
            this.dialogService.showDialog(saveResponse.message);

            return;
        }

        if (!this.newsletterTemplates) {
            this.newsletterTemplates = [];
        }

        if (!this.newNewsletterTemplate.id) {
            this.newsletterTemplates.push(this.newNewsletterTemplate);
            this.dialogService.showSnackBar(
                this.translateService.instant('Newsletter.NewTemplateAdded'),
            );
        } else {
            this.dialogService.showSnackBar(
                this.translateService.instant('Newsletter.TemplateEdited'),
            );
        }

        this.cancelNewTemplateCreation();
    }

    cancelNewTemplateCreation() {
        this.addOrEditTemplateMode = false;
        this.newNewsletterTemplate = null;
    }

    async onDelete(item: NewsletterTemplateDto) {
        const dialogResult = await this.dialogService.showConfirmDialog(
            this.translateService.instant('Global.ConfirmDelete'),
        );

        if (!dialogResult?.okClicked) {
            return;
        }

        this.loading = true;
        const deleteResponse = await this.newsletterTemplatesService
            .deleteNewsletterTemplates({
                ids: item.id,
            })
            .toPromise();
        this.loading = false;

        if (!deleteResponse.success) {
            this.dialogService.showDialog(deleteResponse.message);

            return;
        }

        const index = this.newsletterTemplates.findIndex(
            (x) => x.id === item.id,
        );

        if (index !== -1) {
            this.newsletterTemplates.splice(index, 1);
        }

        this.dialogService.showSnackBar(
            this.translateService.instant('Newsletter.TemplatedDeleted'),
        );
    }

    onEdit(item: NewsletterTemplateDto) {
        this.newNewsletterTemplate = item;
        this.addOrEditTemplateMode = true;
    }

    async onUseTemplate(item: NewsletterTemplateDto) {
        if (!item?.content) {
            return;
        }

        const dialogResult = await this.dialogService.showConfirmDialog(
            this.translateService.instant('Newsletter.UseTemplateConfirm'),
        );

        if (!dialogResult?.okClicked) {
            return;
        }

        const data: NewsletterTemplatesDialogComponentResult = {
            newsletterTemplate: item,
        };

        this.dialogRef.close(data);
    }
}
