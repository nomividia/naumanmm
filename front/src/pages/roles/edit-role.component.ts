import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, IDialogResult } from 'nextalys-angular-tools';
import { MainHelpers } from 'nextalys-js-helpers';
import { RoutesList } from '../../../../shared/routes';
import { AppPage } from '../../../../shared/shared-constants';
import { GenericUnloadMessage } from '../../environments/constants';
import {
    AppRightDto,
    AppRightsService,
    UserRoleDto,
    UsersRolesService,
} from '../../providers/api-client.generated';
import { BaseEditPageComponent } from '../base/base-edit-page.component';

interface AppRightWrapper {
    right: AppRightDto;
    checked: boolean;
}

@Component({
    selector: 'app-edit-role',
    templateUrl: './edit-role.component.html',
    styleUrls: ['../base/edit-page-style.scss', './edit-role.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AppEditRoleComponent
    extends BaseEditPageComponent<UserRoleDto, UsersRolesService>
    implements OnInit
{
    rightsList: AppRightWrapper[] = [];

    constructor(
        usersRolesService: UsersRolesService,
        private appRightsService: AppRightsService,
        dialogService: DialogService,
        route: ActivatedRoute,
        router: Router,
    ) {
        super(
            dialogService,
            AppPage.AdminEditRole,
            route,
            router,
            usersRolesService,
            'id',
            'userRole',
            'userRoleDto',
            'getUserRole',
            'createOrUpdateRole',
            RoutesList.AdminRoles,
            'id',
            null,
            GenericUnloadMessage,
        );
    }

    async afterInitEditPageData() {
        const getRightsResponse = await this.appRightsService
            .getAppRights({})
            .toPromise();
        this.rightsList = [];

        if (getRightsResponse.success) {
            for (const appRight of getRightsResponse.appRights) {
                this.rightsList.push({
                    right: appRight,
                    checked: this.entity.rights?.some(
                        (x) => x.id === appRight.id,
                    ),
                });
            }
        }
    }

    async save(exit?: boolean) {
        if (!this.entity.role) {
            this.entity.role = MainHelpers.replaceAll(
                MainHelpers.formatToUrl(this.entity.label),
                '-',
                '_',
            );
        }

        this.entity.rights = this.rightsList
            .filter((x) => x.checked)
            .map<AppRightDto>((x) => ({
                id: x.right.id,
                code: undefined,
                label: undefined,
            }));

        return await super.save(exit);
    }
    async archiveOrActiveUser() {
        let dialogResult: IDialogResult;

        if (!this.entity.enabled) {
            dialogResult = await this.dialogService.showConfirmDialog(
                'Êtes-vous sûr de vouloir activer ce rôle ?',
            );
        } else
            dialogResult = await this.dialogService.showConfirmDialog(
                'Êtes-vous sûr de vouloir archiver ce rôle ?',
            );

        if (!dialogResult.okClicked) {
            return;
        }

        this.entity.enabled = !this.entity.enabled;
        this.save();
    }
}
