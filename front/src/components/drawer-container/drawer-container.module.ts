import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { CommonModulesList } from '../../app/app.module';
import { ConnectAsDialog } from '../connect-as-dialog/connect-as-dialog.component';
import { DrawerContainerComponent } from './drawer-container.component';
import { HeaderComponent } from './header/header.component';
import { LeftSideComponent } from './left-side/left-side.component';
import { MainMenuItem } from './menu-item/main-menu-item.component';

@NgModule({
    imports: [
        ...CommonModulesList,
        RouterModule,
        MatExpansionModule,
        MatListModule,
    ],
    declarations: [
        DrawerContainerComponent,
        HeaderComponent,
        LeftSideComponent,
        ConnectAsDialog,
        MainMenuItem,
    ],
    exports: [DrawerContainerComponent],
})
export class DrawerContainerModule {}
