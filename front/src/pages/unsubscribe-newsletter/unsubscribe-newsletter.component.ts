import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'nextalys-angular-tools';
import { MainHelpers } from 'nextalys-js-helpers';
import { NewsletterService } from '../../providers/api-client.generated';
import { BasePageComponent } from '../base/base-page.component';

@Component({
    selector: 'app-unsubscribe-newsletter',
    templateUrl: './unsubscribe-newsletter.component.html',
    styleUrls: ['./unsubscribe-newsletter.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class UnsubscribeNewsletterComponent extends BasePageComponent {
    unsubscribeGuid: string;

    unsubscribeSucess: boolean = false;
    unsubscribeError: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private newsletterService: NewsletterService,
        private dialogService: DialogService,
    ) {
        super();
        this.unsubscribeGuid = this.route.snapshot.paramMap.get('guid');
    }

    ngOnInit() {
        this.unsubscribeFromNewsletter();
    }

    private async unsubscribeFromNewsletter() {
        if (!this.unsubscribeGuid) {
            return;
        }

        const response = await this.sendApiRequest(
            this.newsletterService.unsubscribeFromNewsletter({
                unsubscribeFromNewsletterRequest: {
                    guid: this.unsubscribeGuid,
                },
            }),
        );

        if (!response.success) {
            this.unsubscribeError = true;
            this.dialogService.showDialog(response.message);

            return;
        }

        await MainHelpers.sleep(2000);
        this.unsubscribeSucess = true;
    }
}
