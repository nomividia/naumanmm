import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { NxsMultipleSelectModule } from 'nextalys-angular-tools';
import { CommonModulesList } from '../../app/app.module';
import { CandidateApplicationListMinifiedModule } from '../../components/candidate-application-list/candidate-applications-list-minified.module';
import { CityChipsModule } from '../../components/city-chips/city-chips.module';
import { DrawerContainerModule } from '../../components/drawer-container/drawer-container.module';
import { JobOffersAutocompleteModule } from '../../components/job-offers-autocomplete/job-offers-autocomplete.module';
import { JobSelectorModule } from '../../components/jobs-selector/jobs-selector.module';
import { SecuredImageModule } from '../../components/secured-image/secured-image.module';
import { ListCandidateApplicationsComponent } from './candidate-applications-list.component';

const Routes = [
    {
        path: '',
        component: ListCandidateApplicationsComponent,
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
        SecuredImageModule,
        CandidateApplicationListMinifiedModule,
        JobOffersAutocompleteModule,
        JobSelectorModule,
        NxsMultipleSelectModule,
        CityChipsModule,
    ],
    declarations: [ListCandidateApplicationsComponent],
    exports: [RouterModule],
})
export class ListCandidateApplicationsModule {}
