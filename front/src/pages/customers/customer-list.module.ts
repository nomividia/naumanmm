import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { NxsMultipleSelectModule } from 'nextalys-angular-tools';
import { CommonModulesList } from '../../app/app.module';
import { DrawerContainerModule } from '../../components/drawer-container/drawer-container.module';
import { CustomerListComponent } from './customer-list.component';

const Routes = [
    {
        path: '',
        component: CustomerListComponent,
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
        NxsMultipleSelectModule,
    ],
    declarations: [CustomerListComponent],
    exports: [RouterModule],
})
export class CustomerListModule {}
