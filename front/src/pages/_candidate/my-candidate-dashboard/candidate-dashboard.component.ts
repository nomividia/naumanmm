import { Component, ViewEncapsulation } from '@angular/core';
import { DialogService } from 'nextalys-angular-tools';
import { CandidateApplyDialog } from '../../../components/candidate-apply-dialog/candidate-apply-dialog.component';
import {
    CandidatesService,
    JobOffersService,
} from '../../../providers/api-client.generated';
import { LanguageProvider } from '../../../providers/language.provider';
import { BasePageComponent } from '../../base/base-page.component';

@Component({
    selector: 'app-my-dahsboard',
    templateUrl: './candidate-dashboard.component.html',
    styleUrls: [
        './candidate-dashboard.component.scss',
        '../../../components/base/base-simple-list.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class CandidateDashboardComponent extends BasePageComponent {
    applicationsLength: number;
    advancementPercent: number;
    matchingJobs: number;

    constructor(
        private candidateService: CandidatesService,
        private readonly dialogService: DialogService,
        private jobOfferService: JobOffersService,
    ) {
        super();
        this.init();
    }

    async init() {
        this.loading = true;
        await this.getCandidate();
        await this.getCandidateMatchingConditionsAndJobs();
        this.loading = false;
    }

    async getCandidate() {
        const getCandidateResponse = await this.candidateService
            .getMyDossier({
                includeAddresses: 'true',
                includeContracts: 'true',
                includePets: 'true',
                includeChildren: 'true',
            })
            .toPromise();
        // console.log("🚀 ~ CandidateDashboardComponent ~ init ~ getCandidateResponse", getCandidateResponse);

        if (!getCandidateResponse.success) {
            this.dialogService.showSnackBar(getCandidateResponse.message);
            return;
        }

        this.applicationsLength =
            getCandidateResponse.candidate.candidateApplicationsLength;
        const getAdvancementPercent =
            getCandidateResponse.candidate.candidateAdvancementPercent;

        if (getAdvancementPercent > 100) {
            this.advancementPercent = 100;
        } else {
            this.advancementPercent = getAdvancementPercent;
        }
    }

    async getCandidateMatchingConditionsAndJobs() {
        const getCandidateMatchingFiltersResponse = await this.candidateService
            .getCandidateJobsConditions()
            .toPromise();

        if (!getCandidateMatchingFiltersResponse.success) {
            this.dialogService.showSnackBar(
                getCandidateMatchingFiltersResponse.message,
            );

            return;
        }

        const getJobOfferListByCandidateFilterRelation =
            await this.sendApiRequest(
                this.jobOfferService.getAllJobOffers({
                    applyInCouple:
                        getCandidateMatchingFiltersResponse.applyInCouple
                            ? 'true'
                            : 'false',
                    contractTypeId:
                        getCandidateMatchingFiltersResponse.contractTypeId,
                    city: getCandidateMatchingFiltersResponse.city,
                    jobIds: getCandidateMatchingFiltersResponse.candidateJobIds.join(
                        ',',
                    ),
                }),
            );

        if (!getJobOfferListByCandidateFilterRelation.success) {
            this.dialogService.showSnackBar(
                getJobOfferListByCandidateFilterRelation.message,
            );
        } else {
            this.matchingJobs =
                getJobOfferListByCandidateFilterRelation.jobOffers.length ?? 0;
        }
    }

    openApplyDialog() {
        this.dialogService.showCustomDialog({
            component: CandidateApplyDialog,
        });
    }

    get agenciesUrl(): string {
        const currentLang = LanguageProvider.currentLanguageCode;
        if (currentLang === 'fr') {
            return 'https://www.personneldemaison.agency/contact/';
        }
        return 'https://www.householdstaff.agency/contact/';
    }
}
