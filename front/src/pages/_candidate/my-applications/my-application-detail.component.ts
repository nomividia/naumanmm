import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppPage } from '../../../../../shared/shared-constants';
import { BasePageComponent } from '../../base/base-page.component';

@Component({
    selector: 'app-my-application-detail',
    templateUrl: './my-application-detail.component.html',
    styleUrls: ['./my-application-detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MyApplicationDetailComponent extends BasePageComponent {
    candidateApplicationId: string;

    constructor(private route: ActivatedRoute) {
        super(null, null, AppPage.MyApplications);

        this.route.params.subscribe((params) => {
            this.candidateApplicationId = params.id;
        });
    }
}
