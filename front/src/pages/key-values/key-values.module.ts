import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { CommonModulesList } from '../../app/app.module';
import { DrawerContainerModule } from '../../components/drawer-container/drawer-container.module';
import { KeyValueDialogComponent } from './key-value-dialog.component';
import { KeyValuesPageComponent } from './key-values.component';

const Routes = [
    {
        path: '',
        component: KeyValuesPageComponent,
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
    declarations: [KeyValuesPageComponent, KeyValueDialogComponent],
    exports: [RouterModule],
})
export class KeyValuesModule {}
