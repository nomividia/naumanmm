import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DialogService } from 'nextalys-angular-tools';
import { AppPage } from '../../../../../shared/shared-constants';
import { CandidateApplicationListMinified } from '../../../components/candidate-application-list/candidate-applications-list-minified.component';
import { CandidateApplyDialog } from '../../../components/candidate-apply-dialog/candidate-apply-dialog.component';
import { GetAllCandidateApplicationsRequestParams } from '../../../providers/api-client.generated';
import { ApiClientHelpers } from '../../../services/api-client.helpers';
import { FrontCandidateHelpers } from '../../../services/front-candidate-helpers';
import { BasePageComponent } from '../../base/base-page.component';

@Component({
    selector: 'app-my-applications',
    templateUrl: './my-applications.component.html',
    styleUrls: ['./my-applications.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MyApplicationsComponent extends BasePageComponent {
    refFromUrl: string;

    request: GetAllCandidateApplicationsRequestParams = {};

    @ViewChild('candidateListComponent')
    candidateListComponent: CandidateApplicationListMinified;

    constructor(
        public dialogService: DialogService,
        private route: ActivatedRoute,
    ) {
        super(null, null, AppPage.MyApplications);
        this.subscribeToObservable(this.route.queryParams, (params) => {
            this.setFormParams(params);
        });
    }

    private async setFormParams(params: Params) {
        //http://localhost:4243/mes-candidatures?open-apply-dialog=true&ref=2422
        this.refFromUrl = params['ref'];
        const openApplyDialog = params['open-apply-dialog'];
        const jobOfferFromUrl = await FrontCandidateHelpers.handleJobRefFromUrl(
            this,
            this.refFromUrl,
        );

        if (jobOfferFromUrl) {
            this.GlobalAppService.ShowMainLoadingOverlay(
                ApiClientHelpers.translateService.instant('Global.Loading') +
                    '...',
            );
            const applyResult = await FrontCandidateHelpers.applyToJobOffers(
                this,
                [jobOfferFromUrl.id],
                false,
            );
            this.GlobalAppService.HideMainLoadingOverlay();

            if (applyResult) {
                this.loadDataComponent();
            }
        } else if (openApplyDialog === 'true') {
            this.openApplyDialog();
        }
    }

    loadDataDelayedComponent() {
        this.candidateListComponent?.loadDataDelayed();
    }

    loadDataComponent() {
        this.candidateListComponent?.loadData();
    }

    async openApplyDialog() {
        const dialogResponse =
            await this.dialogService.showCustomDialogAwaitable<boolean>({
                component: CandidateApplyDialog,
            });

        if (dialogResponse) {
            this.loadDataComponent();
        }
    }
}
