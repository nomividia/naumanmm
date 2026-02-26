import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'nextalys-angular-tools';
import { RoutesList } from '../../../../shared/routes';
import {
    CandidateApplicationDto,
    CandidateApplicationsService,
} from '../../providers/api-client.generated';
import { BasePageComponent } from '../base/base-page.component';

@Component({
    selector: 'app-details-candidate-application',
    templateUrl: './details-candidate-application.component.html',
    styleUrls: [
        '../base/edit-page-style.scss',
        './details-candidate-application.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class DetailsCandidateApplicationComponent extends BasePageComponent {
    candidateApplication: CandidateApplicationDto;
    candidateApplicationId: string;

    constructor(
        private dialogService: DialogService,
        private route: ActivatedRoute,
        private router: Router,
        private candidateApplicationService: CandidateApplicationsService,
        private translate: TranslateService,
    ) {
        super();
        this.init();
    }

    private init() {
        this.loading = true;
        this.candidateApplicationId = this.route.snapshot.params.id;

        if (!this.candidateApplicationId) {
            this.dialogService.showSnackBar(
                "Aucune candidature n'a été trouvée",
            ); //TODO : traduire
            this.router.navigateByUrl(
                '/' + RoutesList.CandidateApplicationsList,
            );

            return;
        }

        this.loading = false;
    }

    onLoaded(candidateApplicationDto: CandidateApplicationDto) {
        this.candidateApplication = candidateApplicationDto;
    }

    async onArchive(disable: boolean) {
        this.loading = true;
        this.candidateApplication.disabled = disable;

        const response = await this.candidateApplicationService
            .archiveCandidateApplications({
                requestBody: [this.candidateApplicationId],
            })
            .toPromise();

        if (response.success) {
            this.dialogService.showSnackBar(
                this.translate.instant(
                    'CandidateApplication.ApplicationArchived',
                ),
            );
        } else {
            this.dialogService.showSnackBar(response.message);
        }

        this.loading = false;
    }
}
