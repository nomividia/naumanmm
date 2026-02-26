import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { CommonModulesList } from '../../app/app.module';
import { DrawerContainerModule } from '../../components/drawer-container/drawer-container.module';
import { CanLeaveGenericGuard } from '../../providers/guards/can-leave-generic.guard';
import { AppEditRoleComponent } from './edit-role.component';

const Routes = [
    {
        path: '',
        component: AppEditRoleComponent,
        canDeactivate: [CanLeaveGenericGuard],
    },
];

@NgModule({
    declarations: [AppEditRoleComponent],
    imports: [
        RouterModule.forChild(Routes),
        ...CommonModulesList,
        DrawerContainerModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
    ],
    exports: [RouterModule],
})
export class EditRoleModule {}
