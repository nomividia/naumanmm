import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { CommonModulesList } from '../../app/app.module';
import { DrawerContainerModule } from '../../components/drawer-container/drawer-container.module';
import { AppTypesListComponent } from './app-types.component';

const Routes = [
    {
        path: '',
        component: AppTypesListComponent,
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
    ],
    declarations: [AppTypesListComponent],
    exports: [RouterModule],
})
export class AppTypesListModule {}
