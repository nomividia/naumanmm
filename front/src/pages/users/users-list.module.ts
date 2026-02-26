import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { CommonModulesList } from '../../app/app.module';
import { DrawerContainerModule } from '../../components/drawer-container/drawer-container.module';
import { UsersListComponent } from './users-list.component';

const Routes = [
    {
        path: '',
        component: UsersListComponent,
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(Routes),
        ...CommonModulesList,
        DrawerContainerModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatTabsModule,
    ],
    declarations: [UsersListComponent],
    exports: [RouterModule],
})
export class UsersListModule {}
