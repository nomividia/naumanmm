import { Component, ViewEncapsulation } from '@angular/core';
import { DialogService } from 'nextalys-angular-tools';
import { DateHelpers } from 'nextalys-js-helpers';
import { BaseMatTable } from '../../components/base/base-mat-table.component';
import { BaseRequest } from '../../components/base/base-types';
import {
    ActivityLogDto,
    ActivityLogsService,
    GenericResponse,
} from '../../providers/api-client.generated';

@Component({
    selector: 'app-activity-logs',
    templateUrl: './activity-logs.component.html',
    styleUrls: ['../../components/base/base-mat-table.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ActivityLogsPageComponent extends BaseMatTable<
    ActivityLogDto,
    BaseRequest
> {
    constructor(
        dialogService: DialogService,
        private activityLogsService: ActivityLogsService,
    ) {
        super('logs', dialogService);

        this.setAutoVisibleColumns([
            {
                label: 'Date',
                name: 'date',
                sortable: true,
                displayFunction: (element) => {
                    if (element.date)
                        return DateHelpers.formatDate(element.date, true);
                    return '';
                },
            },
            {
                label: 'Type',
                name: 'typeId',
                sortable: true,
                displayFunction: (element) => {
                    if (element.type) return element.type.label;
                    return '';
                },
            },
            {
                label: 'User',
                name: 'userId',
                sortable: true,
                displayFunction: (element) => {
                    if (element.user) return element.user.userName;
                    return '';
                },
            },
        ]);
        this.flushColumns();
    }

    public isExpandedAfterLoadingData(): boolean {
        return false;
    }

    public async loadCustomData(): Promise<GenericResponse> {
        return this.activityLogsService
            .getActivityLogs({
                start: this.request.start,
                length: this.request.length,
                orderby: this.request.orderby,
                order: this.request.order,
                search: this.request.search,
            })
            .toPromise();
    }
}
