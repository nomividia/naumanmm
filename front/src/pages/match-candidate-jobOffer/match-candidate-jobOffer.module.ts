import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModulesList } from '../../app/app.module';
import { DrawerContainerModule } from '../../components/drawer-container/drawer-container.module';
import { JobOfferListMinifiedModule } from '../../components/job-offer-list/job-offer-list-minified.module';
import { MatchCandidateJobOfferComponent } from './match-candidate-jobOffer.component';

const Routes = [
    {
        path: '',
        component: MatchCandidateJobOfferComponent,
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(Routes),
        ...CommonModulesList,
        JobOfferListMinifiedModule,
        DrawerContainerModule,
    ],
    declarations: [MatchCandidateJobOfferComponent],
    exports: [MatchCandidateJobOfferComponent],
})
export class MatchCandidateJobOfferModule {}
