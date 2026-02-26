import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { NxsMultipleSelectModule } from 'nextalys-angular-tools';
import { CommonModulesList } from '../../app/app.module';
import { DrawerContainerModule } from '../../components/drawer-container/drawer-container.module';
import { JobOfferListMinifiedModule } from '../../components/job-offer-list/job-offer-list-minified.module';
import { JobSelectorModule } from '../../components/jobs-selector/jobs-selector.module';
import { ListJobOffersComponent } from './list-job-offers.component';

const Routes = [
    {
        path: '',
        component: ListJobOffersComponent,
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
        JobOfferListMinifiedModule,
        JobSelectorModule,
        NxsMultipleSelectModule,
    ],
    declarations: [ListJobOffersComponent],
    exports: [ListJobOffersComponent, RouterModule],
})
export class ListJobOffersModule {}
