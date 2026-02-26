import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxsMultipleSelectModule } from 'nextalys-angular-tools';
import { CommonModulesList } from '../../app/app.module';
import { DrawerContainerModule } from '../../components/drawer-container/drawer-container.module';
import { AdminTestComponent } from './admin-test.component';

const Routes = [
    {
        path: '',
        component: AdminTestComponent,
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(Routes),
        DrawerContainerModule,
        ...CommonModulesList,
        NxsMultipleSelectModule,
    ],
    declarations: [AdminTestComponent],
    exports: [RouterModule],
})
export class AdminTestModule {}
