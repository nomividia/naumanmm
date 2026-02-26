import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'nextalys-angular-tools';
import { ImagesHelper } from '../../../../../shared/images.helper';
import { InterviewConfirmationStatus } from '../../../../../shared/shared-constants';
import { RoutesList } from '../../../../../shared/routes';
import { BaseComponent } from '../../../components/base/base.component';
import {
    InterviewDto,
    InterviewsService,
} from '../../../providers/api-client.generated';

@Component({
    selector: 'app-interview-list',
    templateUrl: 'interview-list.component.html',
    styleUrls: ['interview-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class InterviewListComponent extends BaseComponent {
    ImageHelper = ImagesHelper;
    InterviewConfirmationStatus = InterviewConfirmationStatus;

    @Input() loading: boolean;
    @Input() candidateInterviewsList: InterviewDto[];
    @Input() displayCandidate: boolean;
    @Input() displayConsultant: boolean = true;
    @Input() openDialogDataOnClick: boolean = false;
    @Input() mode: 'candidate' | 'consultant' | 'editCandidate' = 'candidate';

    @Output() onInterviewClick = new EventEmitter<InterviewDto>();

    constructor(
        public dialogService: DialogService,
        public translate: TranslateService,
        private interviewsService: InterviewsService,
        private router: Router,
    ) {
        super();
    }

    ngOnInit() {
        //
    }

    getInterviewLabel(interview: InterviewDto) {
        const today = new Date();

        if (today.getTime() < interview.date.getTime()) {
            return this.translate.instant('Global.InComing');
        }

        return this.translate.instant('Global.Past');
    }

    onClickInterview(inteview: InterviewDto) {
        this.onInterviewClick.emit(inteview);
    }

    onClickCandidate(event: MouseEvent, interview: InterviewDto) {
        // Stop propagation to prevent the interview click handler from firing
        event.stopPropagation();

        if (interview.candidate?.id) {
            this.router.navigate([RoutesList.CandidatesList, interview.candidate.id]);
        }
    }

    async sendMail(interview: InterviewDto) {
        const dialogResponse = await this.dialogService.showConfirmDialog(
            this.translate.instant('Interview.ClickContinueToSendMail'),
            {
                okLabel: this.translate.instant('Interview.Continue'),
                cancelLabel: this.translate.instant('Interview.Cancel'),
            },
        );

        if (dialogResponse.okClicked) {
            this.sendMailInterview(interview);
        }
    }

    private async sendMailInterview(interview: InterviewDto) {
        this.loading = true;

        const sendMailResponse = await this.sendApiRequest(
            this.interviewsService.sendInterviewMailToCandidate({
                id: interview.id,
            }),
        );

        this.loading = false;

        if (!sendMailResponse.success) {
            this.dialogService.showDialog(sendMailResponse.message);

            return;
        }
        //TODO : translate
        this.dialogService.showSnackBar(
            'Le mail a bien été envoyé au candidat',
        );
    }
}
