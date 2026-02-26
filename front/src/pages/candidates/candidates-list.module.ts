import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { NxsMultipleSelectModule } from 'nextalys-angular-tools';
import { CommonModulesList } from '../../app/app.module';
import { CandidateListMinifiedModule } from '../../components/candidate-list/candidate-list-minified.module';
import { CandidateNotesDialogModule } from '../../components/candidate-notes-dialog/candidate-notes-dialog.module';
import { CityChipsModule } from '../../components/city-chips/city-chips.module';
import { DepartmentsAutocompleteModule } from '../../components/departments-autocomplete/departments-autocomplete.module';
import { DrawerContainerModule } from '../../components/drawer-container/drawer-container.module';
import { JobSelectorModule } from '../../components/jobs-selector/jobs-selector.module';
import { SendFolderCustomerDialogModule } from '../../components/send-folder-customer/send-folder-dialog.module';
import { ListCandidatesComponent } from './candidates-list.component';

const Routes = [
    {
        path: '',
        component: ListCandidatesComponent,
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
        CandidateListMinifiedModule,
        JobSelectorModule,
        SendFolderCustomerDialogModule,
        NxsMultipleSelectModule,
        DepartmentsAutocompleteModule,
        CandidateNotesDialogModule,
        CityChipsModule,
    ],
    declarations: [ListCandidatesComponent],
    exports: [RouterModule],
})
export class ListCandidatesModule {}
