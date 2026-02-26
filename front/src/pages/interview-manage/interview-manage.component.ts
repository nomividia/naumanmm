import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'nextalys-angular-tools';
import { InterviewHelpers } from '../../../../shared/interview-helpers';
import { InterviewConfirmationStatus } from '../../../../shared/shared-constants';
import { BaseComponent } from '../../components/base/base.component';
import {
    InterviewDto,
    InterviewsService,
} from '../../providers/api-client.generated';
import { LanguageProvider } from '../../providers/language.provider';

@Component({
    selector: 'app-interview-manage',
    templateUrl: './interview-manage.component.html',
    styleUrls: ['./interview-manage.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class InterviewsManageComponent extends BaseComponent implements OnInit {
    interviewGuid: string;
    candidateResponse: InterviewConfirmationStatus;
    currentInterview: InterviewDto;
    agencyPlace: string;

    alreadyRefused = false;
    alreadyAccepted = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private interviewsService: InterviewsService,
        private dialogService: DialogService,
    ) {
        super();
    }

    async ngOnInit() {
        this.interviewGuid = this.route.snapshot.paramMap.get('guid');
        const interviewResponse =
            this.route.snapshot.queryParamMap.get('response');

        if (
            this.interviewGuid &&
            interviewResponse !== null &&
            (interviewResponse === InterviewConfirmationStatus.ACCEPTED ||
                interviewResponse === InterviewConfirmationStatus.REFUSED)
        ) {
            this.candidateResponse = interviewResponse;
        } else {
            this.dialogService.showDialog('Page incorrecte');
            // this.router
            //TODO : redirect to /
            return;
        }

        const saveResponse = await this.sendApiRequest(
            this.interviewsService.saveInterviewResponse({
                guid: this.interviewGuid,
                response: this.candidateResponse,
            }),
        );

        if (!saveResponse.success) {
            this.dialogService.showDialog(saveResponse.message);

            return;
        }

        this.currentInterview = saveResponse.interview;
        this.alreadyAccepted = saveResponse.alreadyAccepted;
        this.alreadyRefused = saveResponse.alreadyRefused;

        if (this.currentInterview.agencyPlace) {
            this.agencyPlace = InterviewHelpers.getInterviewPlaceAddress(
                this.currentInterview.agencyPlace as any,
                LanguageProvider.currentLanguageCode as 'fr' | 'en',
            );
        }

        // const notifyResponse = await this.interviewService.notifyConsultantByMail({ interviewDto: saveResponse.interview }).toPromise();
        // if (!notifyResponse.success)
        //     this.dialogService.showDialog(notifyResponse.message);
    }

    backToHome() {
        this.router.navigateByUrl('/');
    }
}
