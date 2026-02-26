import {
    Component,
    ElementRef,
    Input,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'nextalys-angular-tools';
import {
    AddingFileFailedData,
    FileUploadData,
    FileUploadOptions,
} from 'nextalys-file-upload';
import { CustomSocketEventType } from '../../../../shared/shared-constants';
import { SharedService } from '../../../../shared/shared-service';
import { BasePageComponent } from '../../pages/base/base-page.component';
import {
    AnonymousExchangeDto,
    AnonymousExchangesService,
    AnonymousMessageSenderType,
    AppFileDto,
    CandidateApplicationDto,
    CandidateApplicationsService,
} from '../../providers/api-client.generated';
import { SocketService } from '../../services/socket.service';

@Component({
    selector: 'anonymous-exchange',
    templateUrl: './anonymous-exchange.component.html',
    styleUrls: ['./anonymous-exchange.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AnonymousExchangeComponent extends BasePageComponent {
    application: CandidateApplicationDto;
    currentGuid: string;
    inputMessage: string;

    SharedService = SharedService;

    exchanges: AnonymousExchangeDto[] = [];
    fileUploadData: FileUploadData = {};
    filesUploadOptions: FileUploadOptions = {
        allowedFileTypes: ['image', 'pdf'],
        filesCount: 1,
        maxWidth: 1500,
        usePica: true,
        maxWidthForThumbnails: 90,
        fileMaxSize: 3145728,
        maxFileSizeBeforeResize: 14680064,
    }; //3MO - 14 MO //14680064

    @Input() exchangeMode: 'fromConsultant' | 'fromPublic';

    @ViewChild('exchangesContainer') exchangesContainer: ElementRef;

    constructor(
        private candidateApplicationService: CandidateApplicationsService,
        private dialogService: DialogService,
        private route: ActivatedRoute,
        private router: Router,
        private translate: TranslateService,
        private anonymousExchangeService: AnonymousExchangesService,
    ) {
        super();
    }

    ngOnInit() {
        this.route.params.subscribe((param) => {
            this.currentGuid = param.id;
            this.getCandidateApplicationFromGuid(param.id);
        });
    }

    async getCandidateApplicationFromGuid(guidExchange: string) {
        // LOAD CANDIDATE APPLICATION
        this.loading = true;
        const getApplicationResponse = await this.candidateApplicationService
            .getCandidateApplicationFromGuid({ guid: guidExchange })
            .toPromise();
        this.loading = false;

        if (!getApplicationResponse.success) {
            this.dialogService.showDialog(getApplicationResponse.message);

            return;
        }

        this.application = getApplicationResponse.candidateApplication;

        await this.getMyAnonymousExchanges();

        SocketService.subscribeToEvent(
            CustomSocketEventType.NewAnonymousMessage,
            this.eventsCollector,
            () => {
                this.getMyAnonymousExchanges();
            },
        );
    }

    async getMyAnonymousExchanges() {
        // GET ONLY MESSAGE FROM APPLICATION ID
        if (!this.application) {
            return;
        }

        this.exchanges = [];
        this.loading = true;
        const getMyGuestAnonymousExchangesResponse =
            await this.anonymousExchangeService
                .getAnonymousExchangeFromApplicationId({
                    candidateApplicationId: this.application.id,
                })
                .toPromise();
        this.loading = false;

        if (!getMyGuestAnonymousExchangesResponse.success) {
            this.dialogService.showDialog(
                getMyGuestAnonymousExchangesResponse.message,
            );

            return;
        }

        this.exchanges = getMyGuestAnonymousExchangesResponse.exchanges;
        this.scrollExchangesContainerToBottom();
    }

    async resendExchangeLinkToCandidateApplication() {
        //SEND LINK FOR GUEST
        if (!this.application.id) {
            return;
        }

        this.loading = true;
        const sendMailResponse = await this.candidateApplicationService
            .sendPrivateExchangeLinkToCandidateApplication({
                id: this.application.id,
            })
            .toPromise();
        this.loading = false;

        if (!sendMailResponse.success) {
            this.dialogService.showDialog(sendMailResponse.message);

            return;
        }

        this.dialogService.showSnackBar(
            this.translate.instant('Email.PrivateLinkSended'),
        );
    }

    async sendNewMessage(sendFile = false) {
        if (!this.inputMessage && !sendFile) {
            return;
        }

        const senderType = this.AuthDataService?.currentUser?.id
            ? AnonymousMessageSenderType.Consultant
            : AnonymousMessageSenderType.Guest;
        const newMessageToSend: AnonymousExchangeDto = {
            candidateApplicationId: this.application?.id ?? null,
            consultantId: this.AuthDataService?.currentUser?.id ?? null,
            messageContent: this.inputMessage,
            senderType: senderType,
            creationDate: new Date(),
        };

        if (this.fileUploadData?.fileItems?.length && sendFile) {
            const mainResumeFiles: AppFileDto[] =
                this.fileUploadData.fileItems.map<AppFileDto>((x) => ({
                    physicalName: x.file.name,
                    name: x.alias,
                    mimeType: x.file.type,
                }));
            newMessageToSend.file = mainResumeFiles[0];
            newMessageToSend.messageContent = this.translate.instant(
                'AnonymousExchange.NewFileUpload',
            );
        }

        this.loading = true;
        const sendMessageResponse = await this.anonymousExchangeService
            .sendNewAnonymousExchange({
                anonymousExchangeDto: newMessageToSend,
            })
            .toPromise();
        this.loading = false;

        if (!sendMessageResponse.success) {
            this.dialogService.showDialog(sendMessageResponse.message);

            return;
        }

        if (!this.exchanges?.length) {
            this.exchanges = [];
        }

        this.exchanges.push(sendMessageResponse.exchange);
        this.inputMessage = null;
    }

    isMessageFromSender(message: AnonymousExchangeDto): boolean {
        // FOR CSS
        const currentUserExist = this.AuthDataService.currentUser?.id
            ? true
            : false;

        if (currentUserExist) {
            if (
                message.consultantId &&
                message.senderType === AnonymousMessageSenderType.Consultant
            ) {
                return true;
            } else {
                return false;
            }
        } else {
            if (
                !message.consultantId &&
                message.senderType === AnonymousMessageSenderType.Guest
            ) {
                return true;
            } else {
                return false;
            }
        }
    }

    private scrollExchangesContainerToBottom() {
        setTimeout(() => {
            console.log(
                '🚀 ~ AnonymousExchangeComponent ~ setTimeout ~ this.exchangesContainer',
                this.exchangesContainer,
            );
            if (this.exchangesContainer)
                this.exchangesContainer.nativeElement.scrollTop =
                    this.exchangesContainer.nativeElement.scrollHeight;
        }, 100);
    }

    onCompleteItems() {
        this.loading = false;

        if (this.fileUploadData?.files?.length) {
            this.sendFileUpload();
        }
    }

    async onAddingFileFailed(data: AddingFileFailedData) {
        if (data?.code === 'incorrectFileType') {
            this.dialogService.showDialog(
                this.translate.instant('Global.IncorrectFileType'),
            );
        } else {
            if (data) {
                this.dialogService.showDialog(data.message);
            } else {
                this.dialogService.showDialog(
                    await this.translate.instant(
                        'AnonymousExchange.ErrorUpload',
                    ),
                );
            }
        }

        this.loading = false;
    }

    async sendFileUpload() {
        if (
            !this.fileUploadData ||
            !this.fileUploadData.fileItems.length ||
            !this.fileUploadData.files.length
        ) {
            return;
        }

        await this.sendNewMessage(true).then(() => {
            this.fileUploadData = {};
        });
    }

    getFileLink(fileId: string): string {
        return (
            this.environment.apiBaseUrl +
            '/api/anonymous-exchanges/exchange-file/?fileId=' +
            fileId +
            '&exchangeGuid=' +
            this.currentGuid
        );
    }

    isFileIsImage(mimeType: string): boolean {
        if (
            mimeType === 'image/gif' ||
            mimeType === 'image/jpeg' ||
            mimeType === 'image/png' ||
            mimeType === 'image/webp'
        ) {
            return true;
        } else {
            return false;
        }
    }
}
