import { Component, ViewEncapsulation } from '@angular/core';
import { DialogService } from 'nextalys-angular-tools';
import { BaseMatTable } from '../../components/base/base-mat-table.component';
import { BaseRequest } from '../../components/base/base-types';
import {
    AppTypeDto,
    GenericResponse,
    ReferentialService,
} from '../../providers/api-client.generated';

@Component({
    selector: 'app-types',
    templateUrl: './app-types.component.html',
    styleUrls: [
        '../../components/base/base-mat-table.component.scss',
        './app-types.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class AppTypesListComponent extends BaseMatTable<
    AppTypeDto,
    BaseRequest
> {
    cellTextMaxLength = 300;

    constructor(
        private referentialService: ReferentialService,
        dialogService: DialogService,
    ) {
        super('appTypes', dialogService);

        this.setAutoVisibleColumns([
            {
                label: 'Nom',
                name: 'label',
                sortable: true,
            },
            {
                label: 'Code',
                name: 'code',
                sortable: true,
            },
        ]);

        this.setAdditionalVisibleColumns([
            { order: -1, name: 'items-selection' },
            { order: 20, name: 'actions' },
        ]);

        this.flushColumns();
    }

    public loadCustomData(): Promise<GenericResponse> {
        return this.referentialService
            .getAppTypes({
                start: this.request.start,
                length: this.request.length,
                orderby: this.request.orderby,
                order: this.request.order,
                search: this.request.search,
            })
            .toPromise();
    }
}
