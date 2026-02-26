import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { CommonModulesList } from '../../app/app.module';
import { ApplicationSourceListComponent } from './application-source-list.component';

@NgModule({
    imports: [...CommonModulesList, RouterModule, MatPaginatorModule],
    declarations: [ApplicationSourceListComponent],
    exports: [ApplicationSourceListComponent],
})
export class ApplicationSourceListModule {}
