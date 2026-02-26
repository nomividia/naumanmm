import { Directive, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { DialogService } from 'nextalys-angular-tools';
import { DateHelpers } from 'nextalys-js-helpers';
import { AppPage } from '../../../../shared/shared-constants';
import { BaseRequest, BaseWrapper } from './base-types';
import { NxsBaseList } from './nxs-base-list.component';

interface CustomColumnData<T> {
    label: string;
    name: string;
    sortable?: boolean;
    displayFunction?: (x: T) => string;
    cssClass?: string;
    isDateTime?: boolean;
    isDate?: boolean;
    isTooltipDate?: boolean;
    isTooltipDateTime?: boolean;
    tooltip?: (x: T) => string;
}

@Directive({})
export abstract class BaseMatTable<
    T extends { id?: string | number },
    Y extends BaseRequest,
    GetListResponse = any,
> extends NxsBaseList<T, Y, GetListResponse> {
    public autoColumnsNames: string[];
    public autoColumnsDict: CustomColumnData<T>[];
    public additionalColumns: { order: number; name: string }[];
    public allVisibleColumns: string[];

    @ViewChild(MatSort, { static: false })
    set setSort(val: MatSort) {
        this.request.order = val.direction;
        this.request.orderby = val.active;
    }

    constructor(
        protected responseDataFieldName: keyof GetListResponse,
        protected dialogService: DialogService,
        appPage?: AppPage,
        loadOnInit: boolean = true,
        unloadMessage: string = null,
    ) {
        super(
            responseDataFieldName,
            dialogService,
            loadOnInit,
            unloadMessage,
            appPage,
        );
    }

    public setAutoVisibleColumns(columnsDict: CustomColumnData<T>[]) {
        this.autoColumnsDict = columnsDict;
        this.autoColumnsNames = this.autoColumnsDict.map((x) => x.name);
    }

    public setAdditionalVisibleColumns(
        columns: { order: number; name: string }[],
    ) {
        this.additionalColumns = columns;
    }

    public flushColumns() {
        if (!this.additionalColumns) {
            this.additionalColumns = [];
        }

        if (!this.autoColumnsNames) {
            this.autoColumnsNames = [];
        }

        const columnsClone = this.additionalColumns;
        let order = 0;
        this.autoColumnsNames.forEach((x) => {
            columnsClone.push({ name: x, order: order });
            order++;
        });
        columnsClone.sort((x, y) => {
            return x.order - y.order;
        });
        // console.log("Log: flushColumns -> columnsClone", columnsClone);
        this.allVisibleColumns = [...columnsClone.map((x) => x.name)];
    }

    public getAutoColumnLabel(columnName: string) {
        if (this.autoColumnsDict.find((x) => x.name === columnName)) {
            return this.autoColumnsDict.find((x) => x.name === columnName)
                .label;
        } else {
            return '';
        }
    }

    public getAutoColumnTooltip(
        element: BaseWrapper<T>,
        columnName: string,
    ): string {
        const columnData = this.autoColumnsDict.find(
            (x) => x.name === columnName,
        );

        if (columnData && columnData.tooltip) {
            return columnData.tooltip(element.item);
        }

        if (
            (element.item as any)[columnName] &&
            (columnData.isTooltipDate || columnData.isTooltipDateTime)
        ) {
            return DateHelpers.formatDate(
                (element.item as any)[columnName],
                columnData.isTooltipDateTime,
            );
        }

        return undefined;
    }

    public getAutoColumnSortable(columnName: string) {
        return !!this.autoColumnsDict?.find((x) => x.name === columnName)
            ?.sortable;
    }

    public getAutoColumnCssClass(columnName: string) {
        return this.autoColumnsDict?.find((x) => x.name === columnName)
            ?.cssClass;
    }

    public getAutoColumnValue(
        element: BaseWrapper<T>,
        columnName: string,
    ): string {
        const columnData = this.autoColumnsDict.find(
            (x) => x.name === columnName,
        );

        if (columnData && columnData.displayFunction) {
            return columnData.displayFunction(element.item);
        }

        if (
            (element.item as any)[columnName] &&
            (columnData.isDate || columnData.isDateTime)
        ) {
            return DateHelpers.formatDate(
                (element.item as any)[columnName],
                columnData.isDateTime,
            );
        }

        let val: string = '';

        if (!val && (element.item as any)[columnName]) {
            if (
                (element.item as any)[columnName].length >
                this.cellTextMaxLength - 3
            ) {
                val =
                    ((element.item as any)[columnName] as string).substring(
                        0,
                        this.cellTextMaxLength - 3,
                    ) + '...';
            } else {
                val = (element.item as any)[columnName];
            }
        }

        return val;
    }

    sortChange(evt: { active: string; direction: string }) {
        if (!this.request || !evt.direction) {
            return;
        }

        this.request.orderby = evt.active;
        this.request.order = evt.direction as 'asc' | 'desc';
        this.loadData(false);
    }
}
