import {
    Component,
    Inject,
    Input,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from 'nextalys-angular-tools';
import {
    AppTypes,
    CandidateFileType,
    CandidateStatus,
} from '../../../../shared/shared-constants';
import {
    CandidateDto,
    CandidateFileDto,
    CandidatesService,
    CandidateResumeOptions,
    CustomerDto,
    SendCandidateByEmailRequest,
    AddressDto,
    CandidateResumesService,
    GenerateCandidateResumeRequestParams,
    InterviewsService,
} from '../../providers/api-client.generated';
import { TranslateService } from '@ngx-translate/core';
import { ReferentialProvider } from '../../providers/referential.provider';
import { BaseComponent } from '../base/base.component';

export class SendFolderCustomerDialogData {
    candidate?: CandidateDto;
    mode: 'sendResumes' | 'sendCandidate';
    customer?: CustomerDto;
    selectResumeByDefault?: boolean;
}

interface CandidateFilesWrapper {
    selected: boolean;
    file: CandidateFileDto;
}

interface CandidateWrapper {
    candidate: CandidateDto;
    language: 'fr' | 'en';
    showAge: boolean;
    showNationality: boolean;
}

@Component({
    selector: 'app-send-folder-customer-dialog',
    templateUrl: './send-folder-dialog.component.html',
    styleUrls: ['./send-folder-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SendFolderCustomerDialogComponent
    extends BaseComponent
    implements OnInit
{
    selectedCustomer: CustomerDto;
    selectedCandidate: CandidateDto;

    candidateFilesWrapper: CandidateFilesWrapper[] = [];
    candidateFilesToSend: CandidateFileDto[] = [];
    candidates: CandidateWrapper[] = [];
    candidateStatusListIds: string[] = [];
    canSelectCustomers = true;
    loading: boolean = false;
    candidateNotEligible: boolean = false;
    email: string = '';
    subject: string = '';
    body: string = '';
    candidate: CandidateDto = {} as CandidateDto;
    customer: CustomerDto = {} as CustomerDto;
    emailToSend: SendCandidateByEmailRequest =
        {} as SendCandidateByEmailRequest;

    @Input() mode: 'sendResumes' | 'sendCandidate';

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: SendFolderCustomerDialogData,
        public dialogRef: MatDialogRef<SendFolderCustomerDialogComponent>,
        private candidateService: CandidatesService,
        private candidateResumesService: CandidateResumesService,
        private interviewsService: InterviewsService,
        private dialogService: DialogService,
        private referentialProvider: ReferentialProvider,
        private translateService: TranslateService,
    ) {
        super();
    }

    async ngOnInit() {
        this.mode = this.data.mode;

        if (this.mode === 'sendResumes') {
            this.customer = this.data?.customer;
            this.email = this.customer?.email; // Si on utilise l'autocomplete on renseigne l'email.

            if (this.customer) {
                this.canSelectCustomers = false;
            }

            const appTypes = await this.referentialProvider.getTypesValues(
                // On récupère les status des candidats
                [AppTypes.CandidateStatusCode],
                true,
            );
            // console.log("Log ~ SendFolderCustomerDialogComponent ~ ngOnInit ~ appTypes:", appTypes);
            const defaultCandidateStatusList = appTypes.find(
                (x) => x.code === AppTypes.CandidateStatusCode,
            ).appValues;
            const candidateStatusList = defaultCandidateStatusList.filter(
                (x) =>
                    x.code === CandidateStatus.Referenced ||
                    x.code === CandidateStatus.BeingReferenced,
            ); // Choix des status à récupérer
            this.candidateStatusListIds = candidateStatusList.map((x) => x.id);
            // console.log("Log ~ SendFolderCustomerDialogComponent ~ ngOnInit ~      this.candidateStatusListIds:", this.candidateStatusListIds);
        }

        if (this.mode === 'sendCandidate') {
            this.candidate = this.data.candidate;
            this.loading = true;

            try {
                // Check if the current consultant has interviewed this candidate in the last 14 days
                const eligibilityResponse = await this.interviewsService
                    .checkCandidatesInterviewEligibility({
                        checkCandidatesInterviewEligibilityRequest: {
                            candidateIds: [this.candidate.id],
                        },
                    })
                    .toPromise();

                if (!eligibilityResponse.success) {
                    this.dialogService.showSnackBar(
                        this.translateService.instant('CandidateSendResume.EligibilityCheckError'),
                    );
                    this.candidateNotEligible = true;
                    this.loading = false;
                    return;
                }

                const eligibility = eligibilityResponse.eligibilities?.[0];

                if (!eligibility?.isEligible) {
                    // Candidate has no recent interview with current consultant
                    const message = this.translateService.instant(
                        'CandidateSendResume.NoRecentInterview',
                        {
                            candidateName: `${this.candidate.firstName} ${this.candidate.lastName}`,
                        },
                    );
                    this.dialogService.showSnackBar(message);
                    this.candidateNotEligible = true;
                    this.loading = false;
                    return;
                }
            } catch (error) {
                console.error('Error checking interview eligibility:', error);
                this.dialogService.showSnackBar(
                    this.translateService.instant('CandidateSendResume.EligibilityCheckError'),
                );
                this.candidateNotEligible = true;
                this.loading = false;
                return;
            }

            this.loading = false;

            for (const file of this.candidate.files) {
                // Ajout de tous les fichiers upload par le candidat.
                if (file.fileId) {
                    if (
                        this.data.selectResumeByDefault &&
                        file.fileType?.code === CandidateFileType.MainResume
                    ) {
                        this.candidateFilesWrapper.push({
                            selected: true,
                            file: file,
                        });
                        this.onSelectFile(file);
                    } else
                        this.candidateFilesWrapper.push({
                            selected: false,
                            file: file,
                        });
                }
            }
        }
    }

    onSelectCustomer() {
        this.email = this.selectedCustomer.email; // Si on utilise l'autocomplete on renseigne l'email.
    }

    onSelectFile(file: CandidateFileDto) {
        if (this.candidateFilesToSend.length) {
            const index = this.candidateFilesToSend.findIndex(
                (x) => x.fileId === file.fileId,
            ); // On vérifie que le fichier n'est pas déjà dans la liste. Pour éviter les doublons.

            if (index !== -1) {
                // Cas où seulement un fichier est upload.
                if (this.candidateFilesToSend.length === 1) {
                    this.candidateFilesToSend = [];
                } else {
                    this.candidateFilesToSend.splice(index, 1);
                    // Cas où au moins 2 fichiers sont uploads.
                }

                return;
            }
        }
        this.candidateFilesToSend.push(file); // Si le fichier n'est pas déjà upload on l'ajoute
        // console.log("🚀 ~ SendFolderCustomerDialogComponent ~ selectAllFiles ~  this.candidateFilesToSend", this.candidateFilesToSend);
    }

    selectAllFiles() {
        this.loading = true;

        if (
            this.candidateFilesToSend.length ===
            this.candidateFilesWrapper.length
        ) {
            this.candidateFilesWrapper.forEach((file) => {
                file.selected = false;
            });
            this.candidateFilesToSend = []; //Pas de mise en commun pour pouvoir passer dans le if
        } else {
            this.candidateFilesToSend = []; //Pas de mise en commun pour pouvoir passer dans le if
            this.candidateFilesWrapper.forEach((file) => {
                file.selected = true;
            });
            this.candidateFilesToSend.push(
                ...this.candidateFilesWrapper.map((x) => x.file),
            );
        }

        this.loading = false;
    }

    async sendEmail() {
        this.loading = true;
        let customerName = '';

        if (this.selectedCustomer && this.selectedCustomer.isCompany) {
            customerName = this.selectedCustomer.companyName;
        } else if (
            this.selectedCustomer &&
            this.selectedCustomer.isPrivatePerson
        ) {
            customerName =
                this.selectedCustomer.firstName +
                ' ' +
                this.selectedCustomer.lastName?.toUpperCase();
        }

        if (this.mode === 'sendCandidate') {
            this.emailToSend = {
                // Dans le cas où on envoie un dossier de candidat
                to: this.email,
                subject: this.subject,
                body: this.body,
                candidateFiles: this.candidateFilesToSend,
                candidatePublicLink: '',
                candidateId: this.candidate.id,
                customerName: this.selectedCustomer ? customerName : '',
                mode: this.mode,
            };
        }

        if (this.mode === 'sendResumes') {
            // Dans le cas où on envoie plusieurs CV
            // Build resume options for each candidate
            const candidateResumeOptions: CandidateResumeOptions[] =
                this.candidates.map((wrapper) => ({
                    candidateId: wrapper.candidate.id,
                    language: wrapper.language,
                    showAge: wrapper.showAge,
                    showNationality: wrapper.showNationality,
                    selectedJobId:
                        wrapper.candidate.candidateCurrentJobs?.[0]?.currentJob
                            ?.id || '',
                }));

            this.emailToSend = {
                to: this.email,
                subject: this.subject,
                body: this.body,
                customerName: this.selectedCustomer ? customerName : '',
                candidatesIds:
                    this.candidates.map((x) => x.candidate.id).join(',') ??
                    null,
                mode: this.mode,
                candidateResumeOptions: candidateResumeOptions,
            };
        }
        const sendMailResponse = await this.candidateService
            .sendCandidateFolderByMail({
                sendCandidateByEmailRequest: this.emailToSend,
            })
            .toPromise();
        this.loading = false;

        if (!sendMailResponse.success) {
            this.dialogService.showSnackBar(sendMailResponse.message);
        } else {
            this.dialogService.showSnackBar(
                'Email envoyé au consultant avec succés.',
            );
        }

        this.dialogRef.close();
    }

    isUSCandidate(candidate: CandidateDto): boolean {
        return (
            candidate?.nationality === 'US' ||
            candidate?.addresses?.some(
                (address: AddressDto) => address.country === 'US',
            )
        );
    }

    async onCandidateSelected() {
        if (!this.selectedCandidate?.id) {
            return;
        }

        // Check if candidate already exists in the list
        if (this.candidates.some((c) => c.candidate.id === this.selectedCandidate.id)) {
            this.selectedCandidate = null;
            return;
        }

        this.loading = true;

        try {
            // Check if the current consultant has interviewed this candidate in the last 14 days
            const eligibilityResponse = await this.interviewsService
                .checkCandidatesInterviewEligibility({
                    checkCandidatesInterviewEligibilityRequest: {
                        candidateIds: [this.selectedCandidate.id],
                    },
                })
                .toPromise();

            if (!eligibilityResponse.success) {
                this.dialogService.showSnackBar(
                    this.translateService.instant('CandidateSendResume.EligibilityCheckError'),
                );
                this.selectedCandidate = null;
                this.loading = false;
                return;
            }

            const eligibility = eligibilityResponse.eligibilities?.[0];

            if (!eligibility?.isEligible) {
                // Candidate has no recent interview with current consultant
                const message = this.translateService.instant(
                    'CandidateSendResume.NoRecentInterview',
                    {
                        candidateName: `${this.selectedCandidate.firstName} ${this.selectedCandidate.lastName}`,
                    },
                );
                this.dialogService.showSnackBar(message);
                this.selectedCandidate = null;
                this.loading = false;
                return;
            }

            // Check if candidate is from US
            const isUS = this.isUSCandidate(this.selectedCandidate);

            // Create wrapper with default options
            const candidateWrapper: CandidateWrapper = {
                candidate: this.selectedCandidate,
                language: 'fr',
                showAge: !isUS, // Don't show age for US candidates by default
                showNationality: !isUS, // Don't show nationality for US candidates by default
            };

            this.candidates.push(candidateWrapper);
            this.selectedCandidate = null;
            this.setTimeout(() => {
                this.selectedCandidate = null;
                document
                    .getElementsByClassName(
                        'send-resume-candidates-list-end-anchor',
                    )
                    ?.item(0)
                    ?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                        inline: 'nearest',
                    });
            }, 100);
            this.setTimeout(() => {
                this.selectedCandidate = null;
            }, 300);
        } catch (error) {
            console.error('Error checking interview eligibility:', error);
            this.dialogService.showSnackBar(
                this.translateService.instant('CandidateSendResume.EligibilityCheckError'),
            );
            this.selectedCandidate = null;
        } finally {
            this.loading = false;
        }
    }

    sendDisabled() {
        if (this.loading) {
            return true;
        }

        if (this.candidateNotEligible) {
            return true;
        }

        if (!this.email || !this.subject || !this.body) {
            return true;
        }

        if (
            this.mode === 'sendCandidate' &&
            !this.candidateFilesWrapper?.filter((x) => x.selected)?.length
        ) {
            return true;
        }

        return false;
    }

    async previewCandidateResume(candidateWrapper: CandidateWrapper) {
        this.loading = true;
        try {
            const pdfBlob = await this.candidateResumesService
                .generateCandidateResume({
                    candidateId: candidateWrapper.candidate.id,
                    generateCandidateResumeDto: {
                        language: candidateWrapper.language,
                        showAge: candidateWrapper.showAge,
                        showNationality: candidateWrapper.showNationality,
                        selectedJobId:
                            candidateWrapper.candidate.candidateCurrentJobs?.[0]
                                ?.currentJob?.id || '',
                    },
                } as GenerateCandidateResumeRequestParams)
                .toPromise();

            // Create a URL for the blob and open it in a new tab
            const url = window.URL.createObjectURL(pdfBlob);
            window.open(url, '_blank');

            // Clean up the URL after a delay to ensure the browser has time to load it
            this.setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 1000);
        } catch (error) {
            console.error('Error generating PDF preview:', error);
            this.dialogService.showSnackBar(
                'An error occurred while generating the preview.',
            );
        } finally {
            this.loading = false;
        }
    }
}
