import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { CommonModulesList } from '../../app/app.module';
import { JobOfferListMinifiedComponent } from './job-offer-list.minified.component';

@NgModule({
    imports: [...CommonModulesList, RouterModule, MatPaginatorModule],
    declarations: [JobOfferListMinifiedComponent],
    exports: [JobOfferListMinifiedComponent],
})
export class JobOfferListMinifiedModule {}
