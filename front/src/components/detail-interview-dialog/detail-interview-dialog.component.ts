import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'nextalys-angular-tools';
import { MainHelpers } from 'nextalys-js-helpers';
import {
    InterviewConfirmationStatus,
    RolesList,
} from '../../../../shared/shared-constants';
import {
    CandidateDto,
    CandidatesService,
    InterviewDto,
    InterviewsService,
    JobOfferDto,
    JobOffersService,
    LanguageDto,
    UserDto,
    UsersService,
} from '../../providers/api-client.generated';
import { GoogleTranslateService } from '../../providers/api-client.generated/api/googleTranslate.service';
import { GlobalAppService } from '../../services/global.service';
import { BaseComponent } from '../base/base.component';

export interface DetailInterviewDialogResponse {
    interview?: InterviewDto;
    candidate?: CandidateDto;
    reload?: boolean;
}

export interface DetailInterviewDialogData {
    interview: InterviewDto;
    candidateId: string;
    defaultConsultantId?: string;
    readOnly?: boolean;
    candidate?: CandidateDto;
}

@Component({
    selector: 'app-detail-interview-dialog',
    templateUrl: 'detail-interview-dialog.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: [
        './detail-interview-dialog.component.scss',
        '../../pages/base/edit-page-style.scss',
    ],
})
export class DetailInterviewDialogComponent
    extends BaseComponent
    implements OnInit
{
    loading: boolean;
    interviewTime: string;
    interviewClone: InterviewDto;
    consultantList: UserDto[];
    consultant: UserDto;
    candidateLanguage: LanguageDto;
    isDefaultLanguage: boolean;
    showOriginalComment: boolean;
    translatedComment: string;
    originalComment: string;

    InterviewConfirmationStatus = InterviewConfirmationStatus;

    isInterviewEditable: boolean = true;
    isPastInterview: boolean = false;
    hasPendingModification = false;

    // Job offer autocomplete properties
    jobOfferSuggestions: JobOfferDto[] = [];
    private autocompleteTimeout: any;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: DetailInterviewDialogData,
        public dialogRef: MatDialogRef<DetailInterviewDialogComponent>,
        private interviewsService: InterviewsService,
        private dialogService: DialogService,
        private translateService: TranslateService,
        private userService: UsersService,
        private candidatesService: CandidatesService,
        private googleTranslateService: GoogleTranslateService,
        private jobOffersService: JobOffersService,
    ) {
        super();
    }

    async ngOnInit() {
        this.showOriginalComment = true;
        this.loading = true;
        // this.data.interview.candidate =this.data.candidate;
        this.interviewClone = MainHelpers.cloneObject(
            this.data.interview,
            true,
        );

        if (this.interviewClone.date) {
            const interviewDate = new Date(this.interviewClone.date);
            this.isPastInterview = interviewDate < new Date();
        }

        if (
            this.interviewClone &&
            GlobalAppService.userHasRole(
                this.AuthDataService.currentUser,
                RolesList.Consultant || RolesList.AdminTech || RolesList.Admin,
            )
        ) {
            this.isInterviewEditable = true;
            /* if (this.data.interview?.date) {
                 this.interviewTime = this.data.interview.date.toLocaleTimeString();
                 const today = new Date();
                 if (today.getTime() > this.data.interview?.date.getTime())
                     this.isInterviewEditable = false;
             }*/
        }

        if (this.data.readOnly) {
            this.isInterviewEditable = false;
            this.consultant = this.interviewClone.consultant;
        } else {
            await this.loadConsultants();
        }

        await this.getCandidateMainLanguage();

        this.loading = false;
    }

    private async loadConsultants() {
        this.consultantList = [];
        const getUsersResponse =
            await this.GlobalAppService.getConsultantOrRHList(
                this.userService,
                this,
            );
        // console.log("🚀 ~ DetailInterviewDialogComponent ~ loadConsultants ~ getUsersResponse", getUsersResponse);
        if (!getUsersResponse.success) {
            this.dialogService.showDialog(getUsersResponse.message);
        } else {
            this.consultantList = getUsersResponse.users;
            // console.log("🚀 ~ DetailInterviewDialogComponent ~ loadConsultants ~ this.consultantList", this.consultantList);
            if (!this.isInterviewEditable) {
                this.getConsultantById();
            }

            if (!this.data.interview.consultantId) {
                this.interviewClone.consultantId =
                    this.data.defaultConsultantId;
            }
        }
    }

    private getConsultantById() {
        if (!this.data.readOnly) {
            this.consultant = this.consultantList.find(
                (x) => x.id === this.interviewClone.consultantId,
            );
        }
    }

    async addOrEditInterview() {
        this.loading = true;
        this.interviewClone.candidateId = this.data.candidateId;

        if (
            !this.interviewClone.candidateId ||
            !this.interviewClone.date ||
            !this.interviewClone.title
        ) {
            this.dialogService.showDialog(
                this.translateService.instant('Global.PleaseFillAllFields'),
            );
            this.loading = false;

            return;
        }

        if (!this.interviewClone.consultantId) {
            this.loading = false;

            return this.dialogService.showDialog(
                this.translateService.instant('Interview.MustSetConsultant'),
            );
        }

        const interviewCloneToSend = MainHelpers.cloneObject(
            this.interviewClone,
        );
        this.GlobalAppService.toUtcDateRecursive(interviewCloneToSend);

        const addInterviewResponse = await this.interviewsService
            .createOrUpdateInterview({ interviewDto: interviewCloneToSend })
            .toPromise();

        if (!addInterviewResponse.success) {
            this.dialogService.showDialog(addInterviewResponse.message);
        } else {
            // Refresh candidate data to get updated status
            if (this.data.candidateId) {
                const getCandidateResponse = await this.candidatesService
                    .getCandidate({
                        id: this.data.candidateId,
                        specificRelations:
                            'candidateStatus,candidateStatus.translations',
                    })
                    .toPromise();

                if (
                    getCandidateResponse.success &&
                    getCandidateResponse.candidate
                ) {
                    // Emit an event to notify parent components about the candidate update
                    this.dialogRef.close({
                        interview: addInterviewResponse.interview,
                        candidate: getCandidateResponse.candidate,
                        reload: true,
                    });
                }
            }

            if (!this.interviewClone.id) {
                this.dialogService.showSnackBar(
                    this.translateService.instant('Interview.InterviewAdded'),
                );
            } else {
                this.dialogService.showSnackBar(
                    this.translateService.instant(
                        'Interview.InterviewModified',
                    ),
                );
            }
        }

        this.loading = false;
    }

    async deleteInterview() {
        const dialogResult = await this.dialogService.showConfirmDialog(
            this.translateService.instant('Global.ConfirmDelete'),
        );

        if (!dialogResult.okClicked) {
            return;
        }

        this.loading = true;
        const deleteInterviewResponse = await this.interviewsService
            .deleteInterviews({ ids: this.data.interview.id })
            .toPromise();

        if (!deleteInterviewResponse.success) {
            this.dialogService.showDialog(deleteInterviewResponse.message);
        } else {
            this.dialogService.showSnackBar(
                this.translateService.instant('Interview.InterviewDeleted'),
            );
            this.dialogRef.close({ reload: true });
        }

        this.loading = false;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    async closeDialog() {
        if (!this.hasPendingModifications) {
            return this.dialogRef.close();
        }

        const dialog = await this.dialogService.showConfirmDialog(
            'Vous avez des modifications en attente, souhaitez vous quitter ?',
            { okLabel: 'Oui', cancelLabel: 'Annuler' },
        );

        if (dialog.cancelClicked) {
            return;
        }

        this.dialogRef.close();
    }

    private async getCandidateMainLanguage() {
        const getCandidateMainLanguageResponse = await this.sendApiRequest(
            this.candidatesService.getCandidateMainLanguage({
                id: this.data.candidateId,
            }),
        );
        // if (!getCandidateMainLanguageResponse.success) {
        //     // this.dialogService.showDialog(getCandidateMainLanguageResponse.message);
        //     return;
        // }
        if (getCandidateMainLanguageResponse.language) {
            this.candidateLanguage = getCandidateMainLanguageResponse.language;
            this.isDefaultLanguage =
                getCandidateMainLanguageResponse.isDefaultLanguage;
        }
    }

    translateText(comment: string, showOriginal: boolean) {
        if (showOriginal) {
            this.showOriginalComment = true;
            this.interviewClone.comment = this.originalComment;
        } else if (comment) {
            const data = {
                text: comment,
            };

            this.originalComment = comment;

            this.googleTranslateService.translate(data).subscribe(
                (response) => {
                    this.interviewClone.comment =
                        response.translations[0].translatedText;
                    this.showOriginalComment = false;
                },
                (error) => {
                    console.error('Error translating text', error);
                },
            );
        }
    }

    // Job offer autocompletion for interview title
    loadJobOffersForAutocomplete = async (
        searchText: string,
    ): Promise<JobOfferDto[]> => {
        try {
            const requestData = {
                start: 0,
                length: 50, // Limit results for better performance
                search: searchText,
                status: 'true', // Only active job offers
            };

            const response = await this.sendApiRequest(
                this.jobOffersService.getAllJobOffers(requestData),
            );

            if (!response.success) {
                return [];
            }

            return response.jobOffers || [];
        } catch (error) {
            console.error('Error loading job offers for autocomplete:', error);
            return [];
        }
    };

    // Format job offer for display in autocomplete
    formatJobOfferForDisplay = (jobOffer: JobOfferDto): string => {
        const parts = [];

        // Add job reference number
        if (jobOffer.ref) {
            parts.push(jobOffer.ref);
        }

        // Add job title
        if (jobOffer.title) {
            parts.push(jobOffer.title);
        }

        // Add location (city, state, country)
        const locationParts = [];
        if (jobOffer.city) {
            locationParts.push(jobOffer.city);
        }
        // if (jobOffer.state?.label) {
        //     locationParts.push(jobOffer.state.label);
        // }
        if (jobOffer.country) {
            locationParts.push(jobOffer.country);
        }

        if (locationParts.length > 0) {
            parts.push(locationParts.join(', '));
        }

        return parts.join(' - ');
    };

    // Handle job offer selection
    onJobOfferSelected(jobOffer: JobOfferDto) {
        if (jobOffer) {
            // The formatted string is already set by the [value] binding
            // We just need to mark that there are pending modifications
            this.hasPendingModifications = true;
        }
    }

    // Handle input changes for autocomplete
    onTitleInputChange(event: any) {
        const value = event.target.value;
        this.hasPendingModifications = true;

        // Clear previous timeout
        if (this.autocompleteTimeout) {
            clearTimeout(this.autocompleteTimeout);
        }

        // Only search if we have at least 2 characters
        if (value && value.length >= 2) {
            this.autocompleteTimeout = setTimeout(() => {
                this.loadJobOffersForAutocomplete(value).then((suggestions) => {
                    this.jobOfferSuggestions = suggestions;
                });
            }, 300); // 300ms delay to avoid too many API calls
        } else {
            this.jobOfferSuggestions = [];
        }
    }
}
