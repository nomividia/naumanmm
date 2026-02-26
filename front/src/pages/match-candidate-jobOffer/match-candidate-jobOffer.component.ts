import { Component, ViewEncapsulation } from '@angular/core';
import { DialogService } from 'nextalys-angular-tools';
import { AppPage } from '../../../../shared/shared-constants';
import { GetJobOffersRequest } from '../../components/job-offer-list/job-offer-list.minified.component';
import { CandidatesService } from '../../providers/api-client.generated';
import { BasePageComponent } from '../base/base-page.component';

@Component({
    selector: 'app-matching-candidate-job-offer',
    templateUrl: 'match-candidate-jobOffer.component.html',
    styleUrls: ['match-candidate-jobOffer.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MatchCandidateJobOfferComponent extends BasePageComponent {
    request: GetJobOffersRequest = { filterByMobility: true };
    typesLoaded = false;

    constructor(
        private candidateService: CandidatesService,
        private dialogService: DialogService,
    ) {
        super(null, null, AppPage.MatchingCandidateJobOffer);
        this.loadFilterData();
    }

    async loadFilterData() {
        this.loading = true;
        this.request.jobIds = [];

        const candidateJobsConditionResponse = await this.candidateService
            .getCandidateJobsConditions()
            .toPromise();

        if (!candidateJobsConditionResponse.success) {
            this.dialogService.showDialog(
                candidateJobsConditionResponse.message,
            );
        }

        this.request.jobIds = candidateJobsConditionResponse.candidateJobIds;
        this.request.applyInCouple =
            candidateJobsConditionResponse.applyInCouple;
        this.request.city = candidateJobsConditionResponse.city;
        this.request.contractTypeId =
            candidateJobsConditionResponse.contractTypeId;

        // console.log(this.request);

        this.typesLoaded = true;
        this.loading = false;
    }
}
