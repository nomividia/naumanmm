import { Component, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DialogService } from 'nextalys-angular-tools';
import { ImagesHelper } from '../../../../shared/images.helper';
import {
    RequestLocalStorageKeys,
    RolesList,
} from '../../../../shared/shared-constants';
import { BaseSimpleList } from '../../components/base/base-simple-list.component';
import {
    GenericResponse,
    GetUserRolesRequestParams,
    UserDto,
    UserRoleDto,
    UsersRolesService,
    UsersService,
} from '../../providers/api-client.generated';
import { LocalStorageService } from '../../providers/local-storage.service';

export interface GetUserRolesRequestParamsCustom
    extends GetUserRolesRequestParams {
    selectedRoleCodes: string[];
}

@Component({
    selector: 'app-users-list',
    templateUrl: './users-list.component.html',
    styleUrls: [
        '../../components/base/base-simple-list.component.scss',
        './users-list.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class UsersListComponent extends BaseSimpleList<
    UserDto,
    GetUserRolesRequestParamsCustom
> {
    //selectedRoleCodes: string[] = [RolesList.Consultant];
    rolesList: UserRoleDto[] = [];

    ImagesHelper = ImagesHelper;

    constructor(
        private usersService: UsersService,
        dialogService: DialogService,
        private usersRolesService: UsersRolesService,
    ) {
        super('users', dialogService, false);

        this.subscribeToObservable(this.datasourceLoaded, () => {
            LocalStorageService.saveObjectInLocalStorage(
                RequestLocalStorageKeys.Users,
                this.request,
            );
        });

        this.initPage();
    }

    ngOnInit() {
        this.request = LocalStorageService.getObjectFromLocalStorage(
            RequestLocalStorageKeys.Users,
        ) || {
            selectedRoleCodes: [
                RolesList.Consultant,
                RolesList.Newsletter,
                RolesList.RH,
            ],
        };
    }

    async initPage() {
        const response = await this.usersRolesService
            .getUserRoles({ includeDisabled: 'false' })
            .toPromise();

        if (response.success) {
            this.rolesList = response.userRoles.filter(
                (x) => x.role !== RolesList.Candidate,
            );
        }

        this.loadData(true);
    }

    public loadCustomData(): Promise<GenericResponse> {
        this.request.orderby = 'creationDate';
        this.request.order = 'desc';

        return this.sendApiRequest(
            this.usersService.getAllUsers({
                start: this.request.start,
                length: this.request.length,
                orderby: this.request.orderby,
                order: this.request.order,
                search: this.request.search,
                roles: this.request.selectedRoleCodes
                    .filter((x) => !!x)
                    .join(','),
                includeDisabled:
                    this.request.includeDisabled?.toString() ?? 'false',
                includeCandidate: 'true',
                includeImage: 'true',
                includeRoles: 'true',
            }),
        );
    }

    public async removeCustomData(ids: string[]): Promise<GenericResponse> {
        return this.usersService
            .deleteUsers({ userIds: ids.join(',') })
            .toPromise();
    }

    public async archiveCustomData(ids: string[]): Promise<GenericResponse> {
        return this.usersService
            .archiveUsers({ userIds: ids.join(',') })
            .toPromise();
    }

    displayRoles(roles: UserRoleDto[]) {
        if (!roles?.length) {
            return '';
        }

        return roles.map((x) => x.label).join(' / ');
    }

    onTabChange(event: MatTabChangeEvent) {
        // console.log("Log ~ file: users-list.component.ts ~ line 63 ~ UsersListComponent ~ onTabChange ~ event", event);
        this.request.selectedRoleCodes = [];
        let roleFilter: string;

        if (event.index === 0) {
            roleFilter = RolesList.Consultant;
        } else if (event.index === 1) {
            roleFilter = RolesList.Candidate;
        }

        if (roleFilter) {
            this.request.selectedRoleCodes = [roleFilter];
        } else {
            this.request.selectedRoleCodes = [];
        }

        this.loadData();
    }
}
