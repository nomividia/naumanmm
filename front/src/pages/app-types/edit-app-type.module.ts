import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModulesList } from '../../app/app.module';
import { DrawerContainerModule } from '../../components/drawer-container/drawer-container.module';
import { EditAppTypeComponent } from './edit-app-type.component';

const Routes = [
    {
        path: '',
        component: EditAppTypeComponent,
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(Routes),
        ...CommonModulesList,
        DrawerContainerModule,
        DragDropModule,
    ],
    declarations: [EditAppTypeComponent],
    exports: [RouterModule],
})
export class EditAppTypeModule {}
