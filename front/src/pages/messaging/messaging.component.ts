import { Component, ViewEncapsulation } from '@angular/core';
import { DialogService } from 'nextalys-angular-tools';
import { ImagesHelper } from '../../../../shared/images.helper';
import {
    AppPage,
    CandidateMessageSenderType,
} from '../../../../shared/shared-constants';
import { DbTranslatePipe } from '../../pipes/db-translate.pipe';
import {
    CandidateDto,
    CandidateMessagesService,
} from '../../providers/api-client.generated';
import { AuthDataService } from '../../services/auth-data.service';
import { EventsHandler } from '../../services/events.handler';
import { BasePageComponent } from '../base/base-page.component';

@Component({
    selector: 'app-messaging',
    templateUrl: './messaging.component.html',
    styleUrls: ['./messaging.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MessagingComponent extends BasePageComponent {
    candidates: CandidateDto[];
    selectedCandidat: CandidateDto;
    isLoadingCandidates = false;

    CandidateMessageSenderType = CandidateMessageSenderType;
    ImagesHelper = ImagesHelper;

    constructor(
        private candidateMessagesService: CandidateMessagesService,
        private dialogService: DialogService,
    ) {
        super(null, null, AppPage.Messaging);
    }

    ngOnInit() {
        this.loadCandidate();
        this.subscribeToEvent(EventsHandler.NewCandidateMessage, () => {
            this.onNewMessage();
        });
    }

    private async onNewMessage() {
        const getCandidatesResponse = await this.candidateMessagesService
            .getCandidatesForMessaging({
                consultantId: AuthDataService.currentUser?.id,
            })
            .toPromise();

        if (getCandidatesResponse.success) {
            for (const candidate of getCandidatesResponse.candidates) {
                const candidateInList = this.candidates.find(
                    (x) => x.id === candidate.id,
                );

                if (candidateInList) {
                    candidateInList.candidateMessagesUnseen =
                        candidate.candidateMessagesUnseen;
                } else {
                    this.candidates.push(candidate);
                }
            }
        }
    }

    async loadCandidate() {
        this.isLoadingCandidates = true;
        try {
            const getCandidatesResponse = await this.candidateMessagesService
                .getCandidatesForMessaging({
                    consultantId: AuthDataService.currentUser?.id,
                })
                .toPromise();

            if (!getCandidatesResponse.success) {
                this.dialogService.showDialog(getCandidatesResponse.message);
            } else {
                this.candidates = getCandidatesResponse.candidates;
                // console.log("🚀 ~ this.candidates", this.candidates);
            }
        } finally {
            this.isLoadingCandidates = false;
        }
    }

    async selectCandidate(item: CandidateDto) {
        this.selectedCandidat = item;
        item.candidateMessagesUnseen = false;
        // this.GlobalAppService.loadUnseenMessages(this.candidateMessagesService, true);
        const response = await this.candidateMessagesService
            .setCandidatesMessagesToSeen({ candidateId: item.id })
            .toPromise();

        if (response.success) {
            this.GlobalAppService.unSeenMessagesCount =
                response.unSeenMessagesCount;
        }
    }

    getJobLabels(candidateCurrentJobs: any[]): string {
        if (!candidateCurrentJobs || candidateCurrentJobs.length === 0) {
            return '';
        }

        return candidateCurrentJobs
            .map((job) =>
                DbTranslatePipe.dbTranslateValue('label', job.currentJob),
            )
            .join(', ');
    }
}
