import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModulesList } from '../../app/app.module';
import { DrawerContainerModule } from '../../components/drawer-container/drawer-container.module';
import { NotFoundComponent } from './not-found.component';

const Routes = [
    {
        path: '',
        component: NotFoundComponent,
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(Routes),
        ...CommonModulesList,
        DrawerContainerModule,
    ],
    declarations: [NotFoundComponent],
    exports: [RouterModule],
})
export class NotFoundModule {}
