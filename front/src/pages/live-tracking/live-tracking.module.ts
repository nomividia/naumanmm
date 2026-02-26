import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModulesList } from '../../app/app.module';
import { DrawerContainerModule } from '../../components/drawer-container/drawer-container.module';
import { LiveTrackingComponent } from './live-tracking.component';

const Routes = [
    {
        path: '',
        component: LiveTrackingComponent,
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(Routes),
        ...CommonModulesList,
        DrawerContainerModule,
    ],
    declarations: [LiveTrackingComponent],
    exports: [RouterModule],
})
export class LiveTrackingModule {}
