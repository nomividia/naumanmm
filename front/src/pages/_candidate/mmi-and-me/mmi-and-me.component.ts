import { Component, ViewEncapsulation } from '@angular/core';
import { DialogService } from 'nextalys-angular-tools';
import {
    AppPage,
    CandidateMessageSenderType,
} from '../../../../../shared/shared-constants';
import {
    DetailInterviewDialogComponent,
    DetailInterviewDialogData,
} from '../../../components/detail-interview-dialog/detail-interview-dialog.component';
import {
    InterviewDto,
    InterviewsService,
} from '../../../providers/api-client.generated';
import { BasePageComponent } from '../../base/base-page.component';

@Component({
    selector: 'app-mmi-and-me',
    templateUrl: './mmi-and-me.component.html',
    styleUrls: [
        './mmi-and-me.component.scss',
        '../../../components/base/base-simple-list.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class MmiAndMeComponent extends BasePageComponent {
    candidatId: string;

    CandidateMessageSenderType = CandidateMessageSenderType;

    interviewList: InterviewDto[] = [];

    constructor(
        public interviewService: InterviewsService,
        public dialogService: DialogService,
    ) {
        super(null, null, AppPage.MmiAndMe);
    }

    ngOnInit() {
        this.candidatId = this.AuthDataService.currentUser.candidateId;
        this.loadInterviews();
    }

    private async loadInterviews() {
        const interviewResponse = await this.sendApiRequest(
            this.interviewService.getMyInterviews(),
        );

        if (!interviewResponse.success) {
            this.dialogService.showDialog(interviewResponse.message);
        }

        this.interviewList = interviewResponse.interviews;
    }

    async openDetailInterviewDialog(interview: InterviewDto) {
        if (!interview || !this.candidatId) {
            return;
        }

        const data: DetailInterviewDialogData = {
            interview,
            candidateId: this.candidatId,
            readOnly: true,
        };

        await this.dialogService.showCustomDialogAwaitable({
            component: DetailInterviewDialogComponent,
            data,
            exitOnClickOutside: true,
        });
    }
}
