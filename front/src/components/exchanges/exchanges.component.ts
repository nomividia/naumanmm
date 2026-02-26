import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'nextalys-angular-tools';
import { MainHelpers } from 'nextalys-js-helpers';
import {
    CandidateMessageSenderType,
    CustomSocketEventType,
} from '../../../../shared/shared-constants';
import {
    CandidateMessageDto,
    CandidateMessagesService,
    UsersService,
} from '../../providers/api-client.generated';
import { SocketService } from '../../services/socket.service';
import { BaseComponent } from '../base/base.component';

export interface CandidateMessageWrapper extends CandidateMessageDto {
    loading?: boolean;
}

@Component({
    selector: 'app-exchanges',
    templateUrl: './exchanges.component.html',
    styleUrls: [
        '../../pages/base/edit-page-style.scss',
        './exchanges.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class ExchangesComponent extends BaseComponent {
    candidateId: string;
    newCandidateMessageContent: string;
    candidateMessages: CandidateMessageWrapper[];
    loading: boolean;
    anyConsultantConnected: boolean;

    CandidateMessageSenderType = CandidateMessageSenderType;

    @Input() selectCandidateName: string;
    @Input() selectCandidateFirstName: string;
    @Input() senderType: CandidateMessageSenderType;
    @Input('candidateId') set setCandidateId(val: string) {
        this.candidateId = val;
        this.loadCandidateMessages(true);
    }

    @ViewChild('exchangesContainer') exchangesContainer: ElementRef;

    @Output() onCandidateMessageSended = new EventEmitter();

    constructor(
        private candidateMessagesService: CandidateMessagesService,
        private dialogService: DialogService,
        private translate: TranslateService,
        private usersService: UsersService,
    ) {
        super();
        this.init();
    }

    private async setAnyConsultantConnectedState() {
        // console.log("setAnyConsultantConnectedState");
        if (
            this.GlobalAppService.userHasOneOfRoles(
                this.AuthDataService.currentUser,
                [this.RolesList.Candidate],
            )
        ) {
            // console.log('load connected consultants ');
            if (!this.AuthDataService.currentUser) {
                return;
            }

            const response = await this.usersService
                .getConnectedConsultants()
                .toPromise();

            if (response.success) {
                this.anyConsultantConnected = !!response.connectedConsultants;
            }
        } else {
            // console.log('AVOID load connected consultants ');
        }
    }

    async init() {
        SocketService.subscribeToEvent(
            CustomSocketEventType.NewCandidateMessage,
            this.eventsCollector,
            (data) => {
                // console.log('data', data);
                if (this.candidateId === data.data) {
                    this.loadCandidateMessages(false);
                }
            },
        );

        if (
            this.GlobalAppService.userHasOneOfRoles(
                this.AuthDataService.currentUser,
                [this.RolesList.Candidate],
            )
        ) {
            SocketService.subscribeToEvent(
                CustomSocketEventType.AnyUserSocketDisconnected,
                this.eventsCollector,
                () => {
                    this.setAnyConsultantConnectedState();
                },
            );
            SocketService.subscribeToEvent(
                CustomSocketEventType.AnyUserSocketConnected,
                this.eventsCollector,
                () => {
                    this.setAnyConsultantConnectedState();
                },
            );
        }

        await this.setAnyConsultantConnectedState();
    }

    private async loadCandidateMessages(showLoading: boolean) {
        if (!this.candidateId) {
            return;
        }

        if (showLoading) {
            this.loading = true;
        }

        if (
            this.candidateId === this.AuthDataService.currentUser.candidateId &&
            this.AuthDataService.currentUser.candidateId
        ) {
            const getMyCandidateMessagesResponse =
                await this.candidateMessagesService
                    .getMyCandidateMessages()
                    .toPromise();

            if (!getMyCandidateMessagesResponse.success) {
                this.dialogService.showDialog(
                    getMyCandidateMessagesResponse.message,
                );
            } else {
                this.candidateMessages = this.prepareMessagesList(
                    getMyCandidateMessagesResponse.candidateMessages,
                );
                this.GlobalAppService.unSeenMessagesCount = 0;
                this.scrollExchangesContainerToBottom();
            }

            this.loading = false;

            return;
        }

        const getCandidateMessagesResponse = await this.candidateMessagesService
            .getAllCandidateMessages({
                candidateId: this.candidateId,
            })
            .toPromise();

        if (!getCandidateMessagesResponse.success) {
            this.dialogService.showDialog(getCandidateMessagesResponse.message);
        } else {
            this.candidateMessages = this.prepareMessagesList(
                getCandidateMessagesResponse.candidateMessages,
            );
            this.GlobalAppService.unSeenMessagesCount =
                getCandidateMessagesResponse.unSeenMessagesCount;
            this.scrollExchangesContainerToBottom();
        }

        this.loading = false;
    }

    private prepareMessagesList(
        messagesList: CandidateMessageDto[],
    ): CandidateMessageWrapper[] {
        return messagesList?.map((x) => this.prepareMessage(x)) || [];
    }

    private prepareMessage(message: CandidateMessageDto) {
        message.content = MainHelpers.replaceAll(
            message.content,
            '\n',
            '<br/>',
        );

        return message;
    }

    async sendNewCandidateMessage(evt: Event) {
        if (
            !this.newCandidateMessageContent ||
            !MainHelpers.replaceAll(this.newCandidateMessageContent, '\n', '')
        ) {
            return;
        }
        evt?.preventDefault();

        if (!this.candidateMessages) {
            this.candidateMessages = [];
        }

        const messageContent = this.newCandidateMessageContent;
        // this.loading = true;
        const messageToSend = {
            loading: true,
            content: messageContent,
            creationDate: new Date(),
            seen: false,
            senderType: this.senderType,
            senderId: this.AuthDataService.currentUser.id,
            candidateId: this.candidateId,
        };
        this.candidateMessages.push(this.prepareMessage(messageToSend));
        this.newCandidateMessageContent = '';
        this.scrollExchangesContainerToBottom();
        const saveCandidateMessageResponse = await this.candidateMessagesService
            .sendNewCandidateMessage({
                candidateMessageDto: {
                    content: messageContent,
                    candidateId: this.candidateId,
                    senderId: this.AuthDataService.currentUser.id,
                    senderType: this.senderType,
                },
            })
            .toPromise();
        messageToSend.loading = false;

        if (!saveCandidateMessageResponse.success) {
            this.dialogService.showDialog(saveCandidateMessageResponse.message);
        } else {
            this.onCandidateMessageSended.emit();
            this.loadCandidateMessages(false);
        }
        // this.loading = false;
    }

    private scrollExchangesContainerToBottom() {
        setTimeout(() => {
            if (this.exchangesContainer)
                this.exchangesContainer.nativeElement.scrollTop =
                    this.exchangesContainer.nativeElement.scrollHeight;
        }, 100);
    }

    async archiveOrDeleteExchange(remove = false) {
        let translateToApply: string;

        if (remove) {
            translateToApply = this.translate.instant(
                'Dialog.RemoveConversation',
            );
        } else {
            translateToApply = this.translate.instant(
                'Dialog.ArchiveConversation',
            );
        }

        const dialog = await this.dialogService.showConfirmDialog(
            translateToApply,
            { okLabel: 'Global.Yes', cancelLabel: 'Global.No' },
        );

        if (dialog.cancelClicked) {
            return;
        }

        this.loading = true;

        if (remove) {
            const removeExchangeResponse = await this.candidateMessagesService
                .deleteAllCandidateMessages({ candidateId: this.candidateId })
                .toPromise();

            if (!removeExchangeResponse.success) {
                this.dialogService.showDialog(removeExchangeResponse.message);
            }
        } else {
            const archiveExchangeResponse = await this.candidateMessagesService
                .archiveAllCandidateMessages({ candidateId: this.candidateId })
                .toPromise();

            if (!archiveExchangeResponse.success) {
                this.dialogService.showDialog(archiveExchangeResponse.message);
            }
        }

        await this.loadCandidateMessages(true);
        this.loading = false;
    }
}
