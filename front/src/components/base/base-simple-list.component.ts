import { Directive } from '@angular/core';
import { DialogService } from 'nextalys-angular-tools';
import { AppPage } from '../../../../shared/shared-constants';
import { BaseRequest } from './base-types';
import { NxsBaseList } from './nxs-base-list.component';

@Directive({})
export abstract class BaseSimpleList<
    ItemType extends { id?: string | number },
    RequestType extends BaseRequest,
> extends NxsBaseList<ItemType, RequestType> {
    constructor(
        protected responseDataFieldName: string,
        protected dialogService: DialogService,
        loadOnInit: boolean = true,
        unloadMessage: string = null,
        appPage: AppPage = null,
    ) {
        super(
            responseDataFieldName,
            dialogService,
            loadOnInit,
            unloadMessage,
            appPage,
        );
    }
}
