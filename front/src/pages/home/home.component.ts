import { Component, ViewEncapsulation } from '@angular/core';
import { AppPage } from '../../../../shared/shared-constants';
import { UsersService } from '../../providers/api-client.generated';
import { AuthDataService } from '../../services/auth-data.service';
import { BasePageComponent } from '../base/base-page.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class HomeComponent extends BasePageComponent {
    hasUserAcceptedTOS: boolean;
    jobOfferLinkedCount: number;
    candidatePlacedCount: number;
    candidateLinkedCount: number;
    isJobOfferClicked: boolean;
    isRecruitmentActivityClicked: boolean;
    isApplicationSourceClicked: boolean;
    consultantFilterRequest: { consultantIds: string[] };

    constructor(private usersService: UsersService) {
        super(null, null, AppPage.Home);
    }

    ngOnInit() {
        this.isJobOfferClicked = false;
        this.isRecruitmentActivityClicked = false;
        this.isApplicationSourceClicked = false;
        this.consultantFilterRequest = {
            consultantIds: [AuthDataService.currentUser.id],
        };
        this.getUserStat();
    }

    async getUserStat() {
        if (!this.GlobalAppService.currentUserIsConsultantOrRH()) {
            return;
        }

        this.loading = true;

        const userStatResponse = await this.usersService
            .getConsultantStats({ userId: AuthDataService.currentUser.id })
            .toPromise();

        if (userStatResponse.success) {
            this.jobOfferLinkedCount = userStatResponse.jobOfferLinked;
            this.candidateLinkedCount = userStatResponse.candidatePlaced;
            this.candidateLinkedCount = userStatResponse.candidateLinked;
        }

        this.loading = false;
    }

    jobOfferClicked() {
        this.isJobOfferClicked = true;
        this.isRecruitmentActivityClicked = false;
        this.isApplicationSourceClicked = false;
    }

    recruitmentActivityClicked() {
        this.isJobOfferClicked = false;
        this.isRecruitmentActivityClicked = true;
        this.isApplicationSourceClicked = false;
    }

    applicationSourceClicked() {
        this.isJobOfferClicked = false;
        this.isRecruitmentActivityClicked = false;
        this.isApplicationSourceClicked = true;
    }
}
