import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { CommonModulesList } from '../../app/app.module';
import { SendFolderCustomerDialogModule } from '../send-folder-customer/send-folder-dialog.module';
import { CandidateListMinified } from './candidate-list-minified.component';

@NgModule({
    imports: [
        ...CommonModulesList,
        RouterModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        SendFolderCustomerDialogModule,
    ],
    declarations: [CandidateListMinified],
    exports: [CandidateListMinified],
})
export class CandidateListMinifiedModule {}
