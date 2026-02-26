import { Directive, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { DialogService } from 'nextalys-angular-tools';
import { Subject } from 'rxjs';
import { AppPage } from '../../../../shared/shared-constants';
import { BasePageComponent } from '../../pages/base/base-page.component';
import { GenericResponse } from '../../providers/api-client.generated';
import { BaseRequest, BaseWrapper } from './base-types';

@Directive({})
export abstract class NxsBaseList<
    ItemType extends { id?: string | number },
    RequestType extends BaseRequest,
    GetListResponse = any,
> extends BasePageComponent {
    cellTextMaxLength = 40;
    removeDialogText =
        'Êtes-vous sûr de vouloir supprimer les éléments sélectionnés ?';
    archiveDialogText =
        'Êtes-vous sûr de vouloir archiver les éléments sélectionnés ?';
    public request: RequestType = {} as RequestType;
    datasource: BaseWrapper<ItemType>[];
    items: ItemType[];

    public errorMessage: string;
    public loadDataTimeoutId: any;
    public loading: boolean = true;
    public itemsChecked: ItemType[] = [];
    public filteredItemsCount: number = 0;
    public itemCheckedChangeEmitter = new Subject<ItemType>();
    public datasourceLoaded = new Subject<void>();
    public onItemRemoved = new Subject<ItemType>();
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    private paginatorEventsBinded = false;
    public abstract loadCustomData(): Promise<GenericResponse>;

    constructor(
        protected responseDataFieldName: keyof GetListResponse,
        protected dialogService: DialogService,
        protected loadOnInit: boolean = true,
        unloadMessage: string = null,
        appPage?: AppPage,
    ) {
        super(null, unloadMessage, appPage);
    }

    ngAfterViewInit(): void {
        this.init();
    }

    public isExpandedAfterLoadingData(): boolean {
        return false;
    }

    public loadDataDelayed(delay?: number) {
        if (delay == null) {
            delay = 500;
        }

        if (this.loadDataTimeoutId) {
            clearTimeout(this.loadDataTimeoutId);
        }

        this.loadDataTimeoutId = this.setTimeout(() => {
            this.loadData();
        }, delay);
    }

    public async loadData(resetPage: boolean = true) {
        this.itemsChecked = [];
        if (!this.request) {
            this.request = {} as RequestType;
        }

        if (this.paginator) {
            if (resetPage) {
                this.paginator.pageIndex = 0;
            }

            this.request.start =
                this.paginator.pageIndex * this.paginator.pageSize;
            this.request.length = this.paginator.pageSize;
        } else {
            //defaults
            this.request.length = 20;
            this.request.start = 0 * 20;
        }

        this.loading = true;
        const response = await this.loadCustomData();
        this.loading = false;

        if (response.success) {
            const items = (response as any)[
                this.responseDataFieldName
            ] as any[];
            this.datasource = items.map<BaseWrapper<ItemType>>(
                (x: ItemType) => ({
                    item: x,
                    expanded: this.isExpandedAfterLoadingData(),
                }),
            );
            this.items = items;
            this.filteredItemsCount = (response as any).filteredResults;
            this.datasourceLoaded.next();
        } else {
            this.dialogService.showDialog(response.message);
        }
    }

    public removeCustomData(
        ids: (string | number)[],
    ): Promise<GenericResponse> {
        return Promise.resolve({ success: true } as GenericResponse);
    }

    public archiveCustomData(
        ids: (string | number)[],
    ): Promise<GenericResponse> {
        return Promise.resolve({ success: true } as GenericResponse);
    }

    public isItemChecked(wrapper: BaseWrapper<ItemType>): boolean {
        return this.itemsChecked.some((x) => x === wrapper.item);
    }

    public itemCheckedChange(
        wrapper: BaseWrapper<ItemType>,
        checked: boolean,
        unselectOthers?: boolean,
        evt?: MouseEvent,
    ) {
        if (
            evt &&
            ((evt.target as HTMLElement).tagName.toLowerCase() === 'button' ||
                (evt.target as HTMLElement).tagName.toLowerCase() ===
                    'mat-icon')
        ) {
            evt.preventDefault();

            return;
        }

        if (unselectOthers) {
            this.itemsChecked = [];
        }

        if (this.itemsChecked.indexOf(wrapper.item) !== -1 && !checked) {
            this.itemsChecked.splice(
                this.itemsChecked.indexOf(wrapper.item),
                1,
            );
        } else if (this.itemsChecked.indexOf(wrapper.item) === -1 && checked) {
            this.itemsChecked.push(wrapper.item);
        }

        this.itemCheckedChangeEmitter.next(wrapper.item);
    }

    public async removeSelectedItems(archive?: boolean) {
        if (this.itemsChecked.length === 0) {
            return;
        }

        const dialogResult = await this.dialogService.showConfirmDialog(
            archive ? this.archiveDialogText : this.removeDialogText,
        );

        if (!dialogResult.okClicked) {
            return;
        }

        let response: GenericResponse;

        if (archive) {
            response = await this.archiveCustomData(
                this.itemsChecked.map((x) => x.id),
            );
        } else {
            response = await this.removeCustomData(
                this.itemsChecked.map((x) => x.id),
            );
        }

        if (!response.success) {
            this.loading = true;
            this.dialogService.showDialog(response.message);
        } else {
            await this.loadData(true);

            for (const item of this.itemsChecked) {
                this.onItemRemoved.next(item);
            }

            this.itemsChecked = [];
        }

        this.loading = false;
    }

    private bindPaginatorEvents() {
        if (this.paginatorEventsBinded || !this.paginator) {
            //|| this.bindPaginatorEventsRetries > 10
            return;
        }
        // if (!this.paginator) {
        //     this.bindPaginatorEventsRetries++;
        //     setTimeout(() => {
        //         this.bindPaginatorEvents();
        //     }, 300);
        //     return;
        // }
        const subscription = this.paginator.page.subscribe(() => {
            this.loadData(false);
        });
        this.eventsCollector.collect(subscription);
        this.paginatorEventsBinded = true;
        this.afterInit();
    }

    public init() {
        this.bindPaginatorEvents();
    }

    private async afterInit() {
        if (this.loadOnInit) {
            await this.AuthDataService.waitForAuthServiceInitialized();
            this.loadData(false);
        }
    }

    resetDatasource() {
        this.items = [];
        this.datasource = [];
    }
}
