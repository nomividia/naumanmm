import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JobOfferRedirectComponent } from './job-offer-redirect.component';

@NgModule({
    declarations: [JobOfferRedirectComponent],
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: JobOfferRedirectComponent,
            },
        ]),
    ],
    exports: [JobOfferRedirectComponent],
})
export class JobOfferRedirectModule {}
