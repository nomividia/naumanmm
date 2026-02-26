import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { CommonModulesList } from '../../app/app.module';
import { RecruitmentActivityListComponent } from './recruitment-activity-list.component';

@NgModule({
    imports: [...CommonModulesList, RouterModule, MatPaginatorModule],
    declarations: [RecruitmentActivityListComponent],
    exports: [RecruitmentActivityListComponent],
})
export class RecruitmentActivityListModule {}
