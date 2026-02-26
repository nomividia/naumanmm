import { HttpClient } from '@angular/common/http';
import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'nextalys-angular-tools';
import { DateHelpers } from 'nextalys-js-helpers';
import { BrowserFileHelpers } from 'nextalys-js-helpers/dist/browser-file-helpers';
import { ImagesHelper } from '../../../../shared/images.helper';
import { RefData } from '../../../../shared/ref-data';
import { RoutesList } from '../../../../shared/routes';
import {
    ApplyStatus,
    AppTypes,
    CandidateFileType,
} from '../../../../shared/shared-constants';
import { GenericError } from '../../environments/constants';
import { environment } from '../../environments/environment';
import { BasePageComponent } from '../../pages/base/base-page.component';
import {
    AppFileDto,
    AppValueDto,
    CandidateApplicationDto,
    CandidateApplicationsService,
    CandidateDto,
    CandidatesService,
    GdriveService,
    GetCandidateApplicationResponse,
    GetCandidateResponse,
} from '../../providers/api-client.generated';
import { ReferentialProvider } from '../../providers/referential.provider';
import {
    CandidateJobAssociatonData,
    CandidateJobAssociatonDialog,
    CandidateJobAssociatonResult,
} from '../candidate-job-association-dialog/candidate-job-association-dialog.component';
import {
    CandidateToTransfer,
    CandidateTransferDialogComponent,
    CandidateTransferResult,
} from '../candidate-transfer-dialog/candidate-transfer-dialog.component';
import { TransferCandidateApplicationMailDialogComponent } from '../transfer-candidate-application-mail-dialog/transfer-candidate-application-mail-dialog.component';

export interface TransferCandidateApplicationData {
    candidateApplication: CandidateApplicationDto;
}

@Component({
    selector: 'app-candidate-application-informations',
    templateUrl: './candidate-application-informations.component.html',
    styleUrls: [
        '../../pages/base/edit-page-style.scss',
        './candidate-application-informations.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class CandidateApplicationInformationsComponent extends BasePageComponent {
    linkedCandidate: CandidateDto;
    RefData = RefData;
    candidateApplication: CandidateApplicationDto;
    candidateApplyStatusList: AppValueDto[] = [];
    pendingStatut = ApplyStatus.Pending;
    toBeSortedStatut = ApplyStatus.ToBeSorted;
    DateHelpers = DateHelpers;
    pdfBase64: string;
    partnerPdfBase64: string;
    pdfDataUrl: SafeResourceUrl | null = null;
    partnerPdfDataUrl: SafeResourceUrl | null = null;
    ImagesHelper = ImagesHelper;
    firstLoaded = false;
    candidatePicture: string;
    fileToDisplay = {
        resume: true,
        photo: false,
        partnerResume: false,
    };

    @Input() disabled: boolean;
    @Input() candidateApplicationId: string;
    @Input() forCandidate: boolean;

    @Output()
    onArchive = new EventEmitter<boolean>();
    @Output()
    onLoaded = new EventEmitter<CandidateApplicationDto>();
    @Input() loading: boolean;

    constructor(
        private candidateApplicationsService: CandidateApplicationsService,
        private dialogService: DialogService,
        private router: Router,
        private refProvider: ReferentialProvider,
        private httpClient: HttpClient,
        private translate: TranslateService,
        private candidatesService: CandidatesService,
        private gDriveService: GdriveService,
        private sanitizer: DomSanitizer,
    ) {
        super();
    }

    async ngOnInit() {
        await this.init();
    }

    isUsCountry() {
        return this.candidateApplication?.address?.country === 'US';
    }

    async init() {
        this.loading = true;

        if (!this.candidateApplicationId) {
            this.dialogService.showSnackBar(
                this.translate.instant(
                    'CandidateApplication.NoApplicationsFound',
                ),
            );

            if (this.forCandidate) {
                this.router.navigateByUrl(
                    '/' + RoutesList.CandidateApplicationsList,
                );
            } else {
                this.router.navigateByUrl(
                    '/' + RoutesList.Candidate_MyApplications,
                );
            }
        }

        let getCandidateApplicationResponse;

        if (this.forCandidate) {
            getCandidateApplicationResponse =
                await this.candidateApplicationsService
                    .getMyCandidateApplicationDetail({
                        id: this.candidateApplicationId,
                    })
                    .toPromise();
        } else {
            getCandidateApplicationResponse =
                await this.candidateApplicationsService
                    .getCandidateApplication({
                        id: this.candidateApplicationId,
                    })
                    .toPromise();
        }

        if (!getCandidateApplicationResponse.success) {
            return this.dialogService.showDialog(
                getCandidateApplicationResponse.message,
            );
        }

        this.candidateApplication =
            getCandidateApplicationResponse.candidateApplication;
        // console.log('candidate applicationid', this.candidateApplication?.candidateId);
        this.onLoaded.emit(this.candidateApplication);

        if (this.candidateApplication?.candidateId) {
            let getCandidateResponse: GetCandidateResponse;

            if (this.candidateApplication.candidateId) {
                const specificRelations =
                    'candidateStatus,candidateStatus.translations,files,files.file,files.fileType';
                if (this.forCandidate) {
                    getCandidateResponse = await this.candidatesService
                        .getMyDossier({ specificRelations: specificRelations })
                        .toPromise();
                } else {
                    getCandidateResponse = await this.candidatesService
                        .getCandidate({
                            id: this.candidateApplication.candidateId,
                            specificRelations: specificRelations,
                        })
                        .toPromise();
                }
                this.linkedCandidate = getCandidateResponse?.candidate;
            }
        }

        this.setCandidatePicture();

        try {
            if (
                this.linkedCandidate &&
                this.candidateApplication.linkedToCandidate &&
                this.getCandidateResumeFile()
            ) {
                const candidateResumeFile = this.getCandidateResumeFile();
                const response = await this.GlobalAppService.getBlobFile(
                    this.httpClient,
                    '/api/gdrive/downloadGloudStorageFile/' +
                        candidateResumeFile.fileId +
                        '?returnBlob=true',
                    'get',
                    null,
                    { component: this },
                );

                if (response.success) {
                    this.candidateApplication.mainResumeFile =
                        candidateResumeFile?.file;
                    this.candidateApplication.resumeFileBase64 =
                        await BrowserFileHelpers.readFile(
                            response.blob,
                            'base64',
                        );
                    this.candidateApplication.resumeFileBase64MimeType =
                        this.candidateApplication?.mainResumeFile?.mimeType;
                } else if (!environment.production) {
                    // Fallback for development: try to load from local static files
                    await this.loadLocalPdfFallback();
                }
            }

            if (
                this.candidateApplication.resumeFileBase64 &&
                this.candidateApplication.resumeFileBase64MimeType
            ) {
                if (
                    this.candidateApplication.resumeFileBase64MimeType.indexOf(
                        'image/',
                    ) !== -1
                ) {
                    this.candidateApplication.resumeFileBase64 =
                        BrowserFileHelpers.base64ToDataUri(
                            this.candidateApplication.resumeFileBase64,
                            this.candidateApplication.resumeFileBase64MimeType,
                        );
                } else if (
                    this.candidateApplication.resumeFileBase64MimeType.indexOf(
                        'pdf',
                    ) !== -1
                ) {
                    this.pdfBase64 = this.candidateApplication.resumeFileBase64;
                    // Update the sanitized PDF data URL
                    if (this.pdfBase64) {
                        const dataUrl = `data:application/pdf;base64,${this.pdfBase64}`;
                        this.pdfDataUrl =
                            this.sanitizer.bypassSecurityTrustResourceUrl(
                                dataUrl,
                            );
                    }
                }
            }

            if (this.candidateApplication.mainPhotoBase64) {
                this.candidateApplication.mainPhotoBase64 =
                    BrowserFileHelpers.base64ToDataUri(
                        this.candidateApplication.mainPhotoBase64,
                        this.candidateApplication.mainPhotoBase64MimeType,
                    );
            }

            if (
                this.candidateApplication.partnerResumeFileBase64 &&
                this.candidateApplication.partnerResumeFileBase64MimeType.indexOf(
                    'image/',
                ) !== -1
            ) {
                this.candidateApplication.partnerResumeFileBase64 =
                    BrowserFileHelpers.base64ToDataUri(
                        this.candidateApplication.partnerResumeFileBase64,
                        this.candidateApplication
                            .partnerResumeFileBase64MimeType,
                    );
            } else if (
                this.candidateApplication.partnerResumeFileBase64 &&
                this.candidateApplication.partnerResumeFileBase64MimeType.indexOf(
                    'pdf',
                ) !== -1
            ) {
                this.partnerPdfBase64 =
                    this.candidateApplication.partnerResumeFileBase64;
                // Update the sanitized partner PDF data URL
                if (this.partnerPdfBase64) {
                    const dataUrl = `data:application/pdf;base64,${this.partnerPdfBase64}`;
                    this.partnerPdfDataUrl =
                        this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
                }
            }
        } catch (err) {
            console.log('Log ~ err', err);
        }

        const candidateApplyStatusResponse =
            await this.refProvider.getTypeValues(
                AppTypes.ApplyStatusCode,
                true,
            );

        if (candidateApplyStatusResponse) {
            this.candidateApplyStatusList = candidateApplyStatusResponse;
        }
        // console.log("🚀 ~ init ~ this.candidateApplication ", this.candidateApplication);

        if (!this.forCandidate) {
            if (
                this.candidateApplication &&
                this.candidateApplicationId &&
                !this.candidateApplication.seen
            ) {
                await this.candidateApplicationsService
                    .setCandidateApplicationSeen({
                        id: this.candidateApplicationId,
                    })
                    .toPromise();
                this.candidateApplication.seen = true;
            }
        }

        this.loading = false;
        this.firstLoaded = true;
    }

    private getCandidateResumeFile() {
        return this.linkedCandidate?.files?.find(
            (x) => x.fileType?.code === CandidateFileType.MainResume,
        );
    }

    async acceptCandidateApplication() {
        const acceptBtn = await this.dialogService.showConfirmDialog(
            this.translate.instant('CandidateApplication.PreventAcceptDialog'),
            {
                okLabel: 'Global.Yes',
                closeOnClickOutside: true,
                cancelLabel: 'Global.No',
                okClass: 'app-green-button',
                // showCloseButton: true,
            },
        );

        if (!acceptBtn.okClicked) {
            return;
        }

        await this.afterDialogChangeStatus(true, !this.linkedCandidate);
    }

    private async afterDialogChangeStatus(
        accept: boolean,
        createCandidate: boolean,
        isPlatform: boolean = false,
    ) {
        let response: GetCandidateApplicationResponse;
        let candidatesJobsIds: string[] = [];
        let genderId: string;

        if (createCandidate) {
            const candidateCurrentJobResponse =
                await this.associateJobToCandidate();
            // console.log("🚀 ~ afterDialogChangeStatus ~ candidateCurrentJobResponse", candidateCurrentJobResponse)
            if (!candidateCurrentJobResponse?.validated) {
                this.loading = false;
                return;
            }

            candidatesJobsIds = candidateCurrentJobResponse.selectedJobs;

            if (candidateCurrentJobResponse.selectedGender) {
                genderId = candidateCurrentJobResponse.selectedGender.id;
            }
        }

        this.loading = true;

        if (accept) {
            response = await this.candidateApplicationsService
                .validateCandidateApplication({
                    validateCandidateApplicationRequest: {
                        id: this.candidateApplicationId,
                        candidateCurrentJobIds: candidatesJobsIds,
                        giveAtsAccess: this.linkedCandidate ? false : true,
                        genderId: genderId,
                    },
                })
                .toPromise();
        } else {
            response = await this.candidateApplicationsService
                .refuseCandidateApplication({
                    refuseCandidateApplicationRequest: {
                        id: this.candidateApplicationId,
                        createCandidate: createCandidate,
                        candidateCurrentJobIds: candidatesJobsIds,
                        giveAtsAccess: true,
                        genderId: genderId,
                        isPlatform: isPlatform,
                    },
                })
                .toPromise();
        }

        this.loading = false;

        if (!response.success) {
            this.dialogService.showDialog(response.message);

            return;
        }

        //TODO : traduire ces messages
        if (accept) {
            if (this.linkedCandidate) {
                this.dialogService.showSnackBar(
                    this.translate.instant(
                        'CandidateApplication.AcceptedDialog',
                    ),
                );
                this.router.navigateByUrl(
                    '/' +
                        RoutesList.CandidatesList +
                        '/' +
                        this.linkedCandidate.id,
                );
            } else {
                // this.dialogService.showSnackBar(this.translate.instant('CandidateApplication.AcceptedDialog'), this.translate.instant('CandidateApplication.ClickHereToSeeDialog'), null, () => {
                //     if (response.candidateApplication?.candidateId) {
                //         this.router.navigateByUrl('/' + RoutesList.CandidatesList + '/' + response.candidateApplication.candidateId);
                //     }
                // });

                this.dialogService.showSnackBar(
                    this.translate.instant(
                        'CandidateApplication.AcceptedDialog',
                    ),
                );
                this.router.navigateByUrl(
                    '/' +
                        RoutesList.CandidatesList +
                        '/' +
                        response.candidateApplication.candidateId,
                );
            }
            // this.router.navigateByUrl('/' + RoutesList.CandidateApplicationsList);
        } else {
            if (createCandidate && !this.linkedCandidate) {
                this.dialogService.showSnackBar(
                    this.translate.instant(
                        'CandidateApplication.RefusedAndConservedDialog',
                    ),
                );

                return this.router.navigateByUrl(
                    '/' + RoutesList.CandidateApplicationsList,
                );
            } else {
                this.dialogService.showSnackBar(
                    this.translate.instant(
                        'CandidateApplication.RefusedDialog',
                    ),
                );
                this.router.navigateByUrl(
                    '/' + RoutesList.CandidateApplicationsList,
                );
            }
        }
    }

    async refuseCandidateApplication() {
        if (this.linkedCandidate) {
            const dialogResult = await this.dialogService.showConfirmDialog(
                this.translate.instant(
                    'CandidateApplication.PreventRefuseDialog',
                ),
            );

            if (dialogResult.okClicked) {
                await this.afterDialogChangeStatus(false, false);
            }
        } else {
            if (!this.candidateApplication?.candidateId) {
                const linkToCandidateResponse = await this.sendApiRequest(
                    this.candidateApplicationsService.linkCandidateApplicationToCandidateFromMail(
                        { id: this.candidateApplication.id },
                    ),
                );

                if (!linkToCandidateResponse.success) {
                    this.dialogService.showDialog(
                        linkToCandidateResponse.message,
                    );
                    return;
                }

                if (linkToCandidateResponse.candidateApplication?.candidateId) {
                    this.candidateApplication.candidateId =
                        linkToCandidateResponse.candidateApplication.candidateId;
                }
            }

            if (this.candidateApplication?.candidateId) {
                const dialogResult = await this.dialogService.showConfirmDialog(
                    this.translate.instant(
                        'CandidateApplication.PreventRefuseDialog',
                    ),
                );

                if (!dialogResult.okClicked) {
                    return;
                }

                await this.afterDialogChangeStatus(false, false);
            } else {
                this.dialogService.showDialog(
                    this.translate.instant(
                        'CandidateApplication.RemoveOrNotCandidateDataDialog',
                    ),
                    {
                        // cancelLabel: this.translate.instant('CandidateApplication.RemoveCandidateData'),
                        // okLabel: this.translate.instant('CandidateApplication.CreateCandidate'),
                        // cancelIcon: 'clear',
                        // okIcon: 'person_add',
                        // closeOnClickOutside: true,
                        // showCloseButton: true,
                        exitOnClickOutside: true,
                        buttons: [
                            {
                                Callback: async () => {
                                    await this.afterDialogChangeStatus(
                                        false,
                                        true,
                                    );
                                    // await this.sendApiRequest(
                                    //     this.candidateApplicationsService.sendMailAfterCandidateApplicationRefused(
                                    //         {
                                    //             id: this.candidateApplicationId,
                                    //             type: 'CandidateApplicationRefusedCreateCandidate',
                                    //         },
                                    //     ),
                                    // );
                                },
                                CloseDialog: true,
                                Index: 0,
                                Label: this.translate.instant(
                                    'CandidateApplication.CreateCandidate',
                                ),
                                matIcon: 'person_add',
                            },
                            {
                                Callback: async () => {
                                    await this.afterDialogChangeStatus(
                                        false,
                                        false,
                                        true,
                                    );
                                    await this.sendApiRequest(
                                        this.candidateApplicationsService.sendMailAfterCandidateApplicationRefused(
                                            {
                                                id: this.candidateApplicationId,
                                                type: 'CandidateApplicationRefusedCandidatesPlatform',
                                            },
                                        ),
                                    );
                                },
                                CloseDialog: true,
                                Index: 1,
                                Label: this.translate.instant(
                                    'CandidateApplication.CandidatePlatform',
                                ),
                                matIcon: 'contact_phone',
                            },
                            // {
                            //     Callback: async () => {
                            //         await this.afterDialogChangeStatus(
                            //             false,
                            //             false,
                            //         );
                            //         await this.sendApiRequest(
                            //             this.candidateApplicationsService.sendMailAfterCandidateApplicationRefused(
                            //                 {
                            //                     id: this.candidateApplicationId,
                            //                     type: 'CandidateApplicationRefusedCoupleFormation',
                            //                 },
                            //             ),
                            //         );
                            //     },
                            //     CloseDialog: true,
                            //     Index: 2,
                            //     Label: this.translate.instant(
                            //         'CandidateApplication.FormationCouple',
                            //     ),
                            //     matIcon: 'local_library',
                            // },
                        ],
                    },
                );
                // if (refuseBtn.okClicked || refuseBtn.cancelClicked) {
                //     await this.afterDialogChangeStatus(false, refuseBtn.okClicked);
                // }
            }
        }
    }

    public getAge(birthdate: Date) {
        if (!birthdate) {
            return;
        }

        return DateHelpers.getAge(birthdate);
    }

    async downloadFile(file: AppFileDto) {
        this.GlobalAppService.ShowMainLoadingOverlay();
        this.loading = true;

        const downloadResponse =
            await this.GlobalAppService.downloadGCloudStorageFile(
                this.httpClient,
                file,
                { component: this },
            );

        if (!downloadResponse.success) {
            this.dialogService.showDialog(GenericError);
        }

        this.loading = false;
        this.GlobalAppService.HideMainLoadingOverlay();
    }

    onSelectTypeFileChangeFileDisplayed(
        type: 'resume' | 'photo' | 'partnerResume',
    ) {
        this.fileToDisplay = {
            partnerResume: false,
            photo: false,
            resume: false,
        };

        switch (type) {
            case 'resume':
                this.fileToDisplay.resume = true;
                break;
            case 'photo':
                this.fileToDisplay.photo = true;
                break;
            case 'partnerResume':
                this.fileToDisplay.partnerResume = true;
                break;
        }
    }

    onSetArchive() {
        this.disabled = true;
        this.onArchive.emit(this.disabled);
    }

    async setUnseen() {
        this.loading = true;
        const candidateApplicationsResponse = await this.sendApiRequest(
            this.candidateApplicationsService.setCandidateApplicationUnseen({
                setCandidateApplicationUnseenRequest: {
                    candidateApplicationId: this.candidateApplicationId,
                },
            }),
        );
        this.loading = false;

        if (!candidateApplicationsResponse.success) {
            this.dialogService.showDialog(
                candidateApplicationsResponse.message,
            );

            return;
        }

        this.candidateApplication.seen = false;
        this.dialogService.showSnackBar(
            this.translate.instant('CandidateApplication.SettedAsUnseen'),
        );
    }

    async deleteCandidateApplication() {
        const dialog = await this.dialogService.showConfirmDialog(
            this.translate.instant('Dialog.RemoveCandidateApplication'),
            {
                okLabel: this.translate.instant('Global.Yes'),
                cancelLabel: this.translate.instant('Global.No'),
            },
        );

        if (dialog.cancelClicked) {
            return;
        }

        this.loading = true;

        const removeCandidateApplicationResponse =
            await this.candidateApplicationsService
                .deleteCandidateApplications({
                    ids: this.candidateApplicationId,
                })
                .toPromise();
        this.loading = false;

        if (!removeCandidateApplicationResponse.success) {
            return this.dialogService.showDialog(
                removeCandidateApplicationResponse.message,
            );
        }

        this.router.navigateByUrl('/' + RoutesList.CandidateApplicationsList);
    }

    isDocumentPdfOrImage(appFile: AppFileDto) {
        if (
            appFile.mimeType !== 'application/pdf' &&
            !appFile.mimeType.includes('image')
        ) {
            return false;
        }

        return true;
    }

    isDocumentWord(appFile: AppFileDto) {
        return (
            appFile.mimeType ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        );
    }

    private setCandidatePicture() {
        if (!this.linkedCandidate && !this.candidateApplication) {
            this.candidatePicture = ImagesHelper.getGenderImage();

            return;
        }

        if (
            this.linkedCandidate &&
            this.candidateApplication.linkedToCandidate
        ) {
            this.candidatePicture = ImagesHelper.getCandidatePicture(
                this.linkedCandidate,
            );

            return;
        }

        this.candidatePicture = ImagesHelper.getCandidateApplicationPicture(
            environment.apiBaseUrl,
            this.candidateApplication,
        );
    }

    downloadResume() {
        if (!this.candidateApplication.mainResumeFile) {
            return;
        }

        // const fileName = SharedCandidatesHelpers.getCandidateFileNameWithExtension({ file: this.candidateApplication.mainResumeFile });
        const fileName = this.candidateApplication.mainResumeFile.name;

        if (this.pdfBase64) {
            BrowserFileHelpers.downloadFile({
                base64: this.pdfBase64,
                fileName: fileName,
                mimeType: this.candidateApplication.mainResumeFile.mimeType,
            });
        } else if (this.candidateApplication.resumeFileBase64) {
            BrowserFileHelpers.downloadFile({
                dataUri: this.candidateApplication.resumeFileBase64,
                fileName: fileName,
            });
        }
    }

    async openPrivateExchange() {
        let guid = this.candidateApplication.guidExchange ?? null;

        if (!this.candidateApplication.guidExchange) {
            this.loading = true;

            const generateGuidExchangeResponse =
                await this.candidateApplicationsService
                    .generateGuidExchangeAndSendEmail({
                        id: this.candidateApplication.id,
                    })
                    .toPromise();
            this.loading = false;

            if (!generateGuidExchangeResponse.success) {
                this.dialogService.showDialog(
                    generateGuidExchangeResponse.message,
                );

                return;
            }

            if (!generateGuidExchangeResponse.guid) {
                return;
            }

            guid = generateGuidExchangeResponse.guid;
        }

        this.router.navigateByUrl(
            '/' + this.RoutesList.AnonymousExchange + '/' + guid,
        );
    }

    // This function should open a dialog with a selector of the users with role recruiter and RH and a subject and a text area to write the message
    async transferCandidateApplicationByMail() {
        const data: TransferCandidateApplicationData = {
            candidateApplication: this.candidateApplication,
        };

        return await this.dialogService.showCustomDialogAwaitable({
            component: TransferCandidateApplicationMailDialogComponent,
            data,
            exitOnClickOutside: true,
            maxWidth: '1000px',
        });
    }

    private async associateJobToCandidate() {
        const data: CandidateJobAssociatonData = {
            isGenderDefined: !!this.candidateApplication.genderId,
        };

        return await this.dialogService.showCustomDialogAwaitable<CandidateJobAssociatonResult>(
            {
                component: CandidateJobAssociatonDialog,
                data,
                exitOnClickOutside: false,
                minHeight: '40vh',
                minWidth: '20vw',
            },
        );
    }

    getCountryFromCode(code: string) {
        if (!code) {
            return;
        }

        return RefData.getCountryLabel(code);
    }

    async transferCandidateApplication() {
        const data: CandidateToTransfer = {
            id: this.candidateApplication.id,
        };

        return await this.dialogService.showCustomDialogAwaitable<CandidateTransferResult>(
            {
                component: CandidateTransferDialogComponent,
                data,
                exitOnClickOutside: false,
                minHeight: '40vh',
                minWidth: '20vw',
            },
        );
    }

    // Fallback method for development - loads PDF from local static files
    private async loadLocalPdfFallback() {
        try {
            // Try to load a PDF from the local uploads directory
            const candidateId =
                this.linkedCandidate?.id ||
                this.candidateApplication?.candidateId;
            if (!candidateId) return;

            // Use fetch to get the PDF from the static file server
            const pdfUrl = `${environment.apiBaseUrl}/uploads/candidates/${candidateId}/4029485b-6518-4d0b-810d-7c3967c22ee8.pdf`;

            const response = await fetch(pdfUrl);
            if (response.ok) {
                const blob = await response.blob();
                const base64 = await BrowserFileHelpers.readFile(
                    blob,
                    'base64',
                );

                this.candidateApplication.resumeFileBase64 = base64;
                this.candidateApplication.resumeFileBase64MimeType =
                    'application/pdf';
                // Update the pdfBase64 and sanitized URL for the fallback
                this.pdfBase64 = base64;
                if (this.pdfBase64) {
                    const dataUrl = `data:application/pdf;base64,${this.pdfBase64}`;
                    this.pdfDataUrl =
                        this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
                }
                console.log('✅ Loaded PDF from local fallback:', pdfUrl);
            } else {
                console.log(
                    '❌ Failed to load PDF from local fallback:',
                    pdfUrl,
                );
            }
        } catch (error) {
            console.log('❌ Error loading local PDF fallback:', error);
        }
    }
}
