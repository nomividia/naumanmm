import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { DialogService } from 'nextalys-angular-tools';
import { BaseComponent } from '../../components/base/base.component';
import { GlobalAppService } from '../../services/global.service';

@Injectable()
export class CanLeaveGenericGuard implements CanDeactivate<BaseComponent> {
    constructor(private dialogService: DialogService) {}

    async canDeactivate(component: BaseComponent): Promise<boolean> {
        if (component.hasPendingModifications && component.unloadMessage) {
            GlobalAppService.HideMainLoadingOverlay();
            const dialogResult = await this.dialogService.showConfirmDialog(
                component.unloadMessage,
            );

            if (dialogResult.okClicked) {
                GlobalAppService.ShowMainLoadingOverlay();
                return true;
            } else {
                GlobalAppService.HideMainLoadingOverlay();
                return false;
            }
        }

        return true;
    }
}
