import { Component, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'nextalys-angular-tools';
import {
    AppTypes,
    NewsletterState,
    RequestLocalStorageKeys,
} from '../../../../shared/shared-constants';
import { SharedHelpers } from '../../../../shared/shared-service';
import { BaseSimpleList } from '../../components/base/base-simple-list.component';
import { BaseRequest } from '../../components/base/base-types';
import {
    AppValueDto,
    GenericResponse,
    NewsletterDto,
    NewsletterService,
} from '../../providers/api-client.generated';
import { LocalStorageService } from '../../providers/local-storage.service';
import { ReferentialProvider } from '../../providers/referential.provider';

interface GetNewslettersRequest extends BaseRequest {
    includeDisabled?: boolean;
    statusIds?: string[];
    year?: number;
    month?: number;
}

@Component({
    selector: 'app-list-newsletters',
    templateUrl: './list-newsletters.component.html',
    styleUrls: [
        './list-newsletters.component.scss',
        '../../components/base/base-simple-list.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class ListNewslettersComponent extends BaseSimpleList<
    NewsletterDto,
    GetNewslettersRequest
> {
    statesList: AppValueDto[];
    yearList: number[];

    monthList: { label: string; value: number }[] = [];
    newsletters: NewsletterDto[] = [];

    NewsletterState = NewsletterState;

    constructor(
        public dialogService: DialogService,
        private newsletterService: NewsletterService,
        private refProvider: ReferentialProvider,
        private translate: TranslateService,
    ) {
        super('newsletters', dialogService, false);

        this.subscribeToObservable(this.datasourceLoaded, () => {
            LocalStorageService.saveObjectInLocalStorage(
                RequestLocalStorageKeys.Newsletters,
                this.request,
            );
        });

        this.loadInitial();
    }

    private loadYearsAndMonths() {
        this.yearList = SharedHelpers.getYearListFromYear();
        this.loadMonthList();
    }

    private async loadInitial() {
        this.request.statusIds = [];
        this.request =
            LocalStorageService.getObjectFromLocalStorage(
                RequestLocalStorageKeys.Newsletters,
            ) || {};

        if (!this.request.year) {
            this.request.year = new Date().getFullYear();
        }

        this.loadYearsAndMonths();

        if (!this.request.statusIds?.length) {
            await this.loadFilterData();
        }

        await this.loadFilterData();
        await this.loadData();
        this.sortData();
    }

    private async onlyLoadAndSort() {
        await this.loadData();
        this.sortData();
    }

    private sortData() {
        this.items?.sort(
            (a, b) => b.modifDate.getTime() - a.modifDate.getTime(),
        );
    }

    public isExpandedAfterLoadingData(): boolean {
        return false;
    }

    public loadCustomData(): Promise<GenericResponse> {
        const monthFilter =
            this.request.month != null ? this.request.month.toString() : null;
        const yearFilter =
            this.request.year != null ? this.request.year.toString() : null;
        return this.newsletterService
            .getAllNewsletters({
                start: this.request.start,
                length: this.request.length,
                orderby: 'creationDate',
                order: 'desc',
                search: this.request.search,
                statusIdList: this.request.statusIds.join(','),
                year: yearFilter,
                month: monthFilter,
                //includeArchived: this.request.includeDisabled === true ? 'true' : 'false',
            })
            .toPromise();
    }

    resetMonthFilter() {
        this.request.month = null;
    }

    private async loadFilterData() {
        this.loading = true;

        const appTypes = await this.refProvider.getTypesValues(
            [AppTypes.NewsletterStateCode],
            true,
        );

        this.statesList = appTypes.find(
            (x) => x.code === AppTypes.NewsletterStateCode,
        ).appValues;
        // console.log("🚀 ~ loadFilterData ~ this.statesList", this.statesList)

        this.request.statusIds = [];

        const draftStatusId = this.statesList.find(
            (x) => x.code === NewsletterState.Draft,
        )?.id;
        const sentStatusId = this.statesList.find(
            (x) => x.code === NewsletterState.Sent,
        )?.id;
        const sentSibStatusId = this.statesList.find(
            (x) => x.code === NewsletterState.Sent_SendInBlue,
        )?.id;
        const pendingStatusId = this.statesList.find(
            (x) => x.code === NewsletterState.Pending,
        )?.id;

        if (sentStatusId) {
            this.request.statusIds.push(sentStatusId);
        }

        if (draftStatusId) {
            this.request.statusIds.push(draftStatusId);
        }

        if (sentSibStatusId) {
            this.request.statusIds.push(sentSibStatusId);
        }

        if (pendingStatusId) {
            this.request.statusIds.push(pendingStatusId);
        }
    }

    loadMonthList() {
        this.monthList = SharedHelpers.loadMonthListPassedFromYear(
            this.request.year,
        );
    }

    async duplicateNewsletter(newsletter: NewsletterDto) {
        const okDialog = await this.dialogService.showConfirmDialog(
            this.translate.instant('Newsletter.DoYouWantToDuplicate'),
        );

        if (okDialog.cancelClicked || okDialog.closedWithCloseButton) {
            return;
        }

        this.loading = true;

        const duplicateResponse = await this.newsletterService
            .duplicateNewsletter({ id: newsletter.id })
            .toPromise();

        this.loading = false;

        if (!duplicateResponse.success) {
            this.dialogService.showDialog(duplicateResponse.message);

            return;
        }

        this.dialogService.showSnackBar(
            this.translate.instant('Newsletter.DuplicateSuccess'),
        );

        this.onlyLoadAndSort();
    }
}
