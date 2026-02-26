import { Component, ViewEncapsulation } from '@angular/core';
import { BasePageComponent } from '../../base/base-page.component';

@Component({
    selector: 'app-my-mmi-resume',
    templateUrl: './my-mmi-resume.component.html',
    styleUrls: [
        '../../base/edit-page-style.scss',
        './my-mmi-resume.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class MyMmiResumeComponent extends BasePageComponent {
    candidateId: string;

    constructor() {
        super();
        this.init();
    }

    init() {
        const candidateId = this.AuthDataService.currentUser?.candidateId;
        if (candidateId) {
            this.candidateId = candidateId;
        }
    }
}
