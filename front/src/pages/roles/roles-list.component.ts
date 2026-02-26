import { Component, ViewEncapsulation } from '@angular/core';
import { DialogService } from 'nextalys-angular-tools';
import { BaseMatTable } from '../../components/base/base-mat-table.component';
import {
    GenericResponse,
    GetUserRolesRequestParams,
    UserRoleDto,
    UsersRolesService,
} from '../../providers/api-client.generated';

@Component({
    selector: 'app-roles-list',
    templateUrl: './roles-list.component.html',
    // styleUrls: ['./name.component.scss']
    styleUrls: ['../../components/base/base-mat-table.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AppRolesListComponent extends BaseMatTable<
    UserRoleDto,
    GetUserRolesRequestParams
> {
    cellTextMaxLength = 300;

    constructor(
        private usersRolesService: UsersRolesService,
        dialogService: DialogService,
    ) {
        super('userRoles', dialogService);
        this.setAutoVisibleColumns([
            // {
            //     label: 'Code',
            //     name: 'role',
            //     sortable: true,
            // },
            {
                label: 'Nom',
                name: 'label',
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
        return this.usersRolesService
            .getUserRoles({
                start: this.request.start,
                length: this.request.length,
                orderby: this.request.orderby,
                order: this.request.order,
                search: this.request.search,
                includeDisabled:
                    this.request.includeDisabled?.toString() ?? 'false',
            })
            .toPromise();
    }

    public removeCustomData(ids: (string | number)[]): any {
        return this.usersRolesService
            .deleteRoles({ ids: ids.join(',') })
            .toPromise();
    }

    public archiveCustomData(ids: string[]): Promise<GenericResponse> {
        return this.usersRolesService
            .archiveRoles({ ids: ids.join(',') })
            .toPromise();
    }
}
