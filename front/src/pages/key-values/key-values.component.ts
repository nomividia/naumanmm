import { Component, ViewEncapsulation } from '@angular/core';
import { DialogService } from 'nextalys-angular-tools';
import { MainHelpers } from 'nextalys-js-helpers';
import { BaseMatTable } from '../../components/base/base-mat-table.component';
import { BaseRequest } from '../../components/base/base-types';
import {
    GenericResponse,
    KeyValueDto,
    KeyValueService,
} from '../../providers/api-client.generated';
import { KeyValueDialogComponent } from './key-value-dialog.component';

@Component({
    selector: 'app-key-values',
    templateUrl: './key-values.component.html',
    styleUrls: ['../../components/base/base-mat-table.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class KeyValuesPageComponent extends BaseMatTable<
    KeyValueDto,
    BaseRequest
> {
    constructor(
        dialogService: DialogService,
        private keyValueService: KeyValueService,
    ) {
        super('keyValues', dialogService);
        this.setAutoVisibleColumns([
            {
                label: 'Clé',
                name: 'key',
                sortable: true,
            },
            {
                label: 'Valeur',
                name: 'value',
                sortable: true,
            },
        ]);
        this.setAdditionalVisibleColumns([
            { order: -1, name: 'items-selection' },
            { order: 20, name: 'actions' },
        ]);
        this.flushColumns();
    }

    public isExpandedAfterLoadingData(): boolean {
        return false;
    }

    public async loadCustomData(): Promise<GenericResponse> {
        return this.keyValueService
            .getKeyValues({
                start: this.request.start,
                length: this.request.length,
                orderby: this.request.orderby,
                order: this.request.order,
                search: this.request.search,
                onlyFrontEditable: 'true',
            })
            .toPromise();
    }

    public removeCustomData(ids: string[]): Promise<GenericResponse> {
        return this.keyValueService
            .deleteKeyValues({ ids: ids.join(',') })
            .toPromise();
    }

    remove(item: KeyValueDto) {
        this.itemsChecked = [item];
        this.removeSelectedItems();
    }

    async openItem(item: KeyValueDto) {
        if (!item) {
            item = { key: '', frontEditable: true };
        }

        const result: KeyValueDto =
            await this.dialogService.showCustomDialogAwaitable({
                component: KeyValueDialogComponent,
                data: MainHelpers.cloneObject(item),
            });

        if (result) {
            const response = await this.keyValueService
                .saveKeyValue({ keyValueDto: result })
                .toPromise();

            if (response.success) {
                this.loadData();
            } else {
                this.dialogService.showDialog(response.message);
            }
        }
    }
}
