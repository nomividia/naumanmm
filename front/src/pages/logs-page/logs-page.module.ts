import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxsLogsManagerModule } from 'nextalys-logs-manager';
import { CommonModulesList } from '../../app/app.module';
import { DrawerContainerModule } from '../../components/drawer-container/drawer-container.module';
import { accessTokenLsKey } from '../../environments/constants';
import { environment } from '../../environments/environment';
import { LogsPageComponent } from './logs-page.component';

export function getAuthToken() {
    if (typeof localStorage === 'undefined') {
        return '';
    }

    return localStorage.getItem(accessTokenLsKey);
}

const Routes = [
    {
        path: '',
        component: LogsPageComponent,
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(Routes),
        ...CommonModulesList,
        DrawerContainerModule,
        NxsLogsManagerModule.forRoot({
            getLogsUrl:
                environment.apiBaseUrlWithPrefix +
                '/referential/getLogFileContent',
            removeLogFileUrl:
                environment.apiBaseUrlWithPrefix + '/referential/removeLogFile',
            getAuthToken: getAuthToken,
            maxLogsFileList: 30,
        }),
    ],
    declarations: [LogsPageComponent],
    exports: [RouterModule],
})
export class LogsPageModule {}
