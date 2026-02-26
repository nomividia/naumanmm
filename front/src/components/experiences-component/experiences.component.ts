/* eslint-disable no-underscore-dangle */
import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'nextalys-angular-tools';
import { NxsRichEditorOptions } from 'nextalys-rich-editor';
import { NxsList } from 'nextalys-js-helpers/dist/nxs-list';
import {
    AppTypes,
    JobReferenceFunction,
} from '../../../../shared/shared-constants';
import { SharedService } from '../../../../shared/shared-service';
import { CandidateJobStatus } from '../../../../shared/types/candidate-job-status.type';
import { DbTranslatePipe } from '../../pipes/db-translate.pipe';
import {
    AddressDto,
    AppValueDto,
    CandidateJobDto,
    CandidatesService,
} from '../../providers/api-client.generated';
import { JobReferenceDto } from '../../providers/api-client.generated/model/jobReferenceDto';
import { ReferentialProvider } from '../../providers/referential.provider';
import { BaseComponent } from '../base/base.component';

@Component({
    selector: 'experiences-component',
    templateUrl: './experiences.component.html',
    styleUrls: ['./experiences.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ExperiencesComponent extends BaseComponent {
    tempJobReferenceAddress: AddressDto;

    jobReferenceFunctions?: AppValueDto[] = [];
    employerProfileFunctions?: AppValueDto[] = [];
    candidateExperiences: CandidateJobDto[];
    showChild = false;
    loading = false;
    notesRefVisible = false;
    isConsultant = false;
    CandidateJobStatus = CandidateJobStatus;
    CandidateJobDto = CandidateJobDto;

    richEditorOptions: NxsRichEditorOptions = {
        showFontStylesButtons: true,
        showListButtons: true,
        showHeadersButton: true,
        showIndentButtons: true,
        showCleanButton: true,
        showColorsButton: false,
        showBgColorsButton: false,
        showSizesButton: false,
        showLinkButton: false,
        showHtmlDialogButton: false,
    };

    // Track collapsed state for each experience card
    collapsedCards: { [key: number]: boolean } = {};

    // Track which experiences have "Other" job selected for reactive updates
    otherJobSelectedMap: Map<string, boolean> = new Map();

    @Input() set jobList(val: AppValueDto[]) {
        this._jobList = val;
        console.log('jobList set with length:', val?.length);

        // When jobList is loaded, update the map for all existing experiences
        if (val?.length && this.candidateExperiences?.length) {
            console.log(
                'Updating otherJobSelectedMap for existing experiences',
            );
            this.candidateExperiences.forEach((experience) => {
                if (experience.jobId) {
                    const selectedJob = val.find(
                        (j) => j.id === experience.jobId,
                    );
                    const isOther = selectedJob?.code === 'jobcategory_autres';
                    const experienceKey = this.getExperienceKey(experience);
                    console.log(
                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                        `Experience ${experienceKey}: job code = ${selectedJob?.code}, isOther = ${isOther}`,
                    );
                    this.otherJobSelectedMap.set(experienceKey, isOther);
                }
            });
        }
    }
    get jobList(): AppValueDto[] {
        return this._jobList;
    }
    private _jobList?: AppValueDto[];

    @Input() candidateId?: string;
    @Input('candidateExperiences') set setCandidateExperiences(
        val: CandidateJobDto[],
    ) {
        if (val?.length) {
            for (const candidateExperience of val) {
                if (!candidateExperience.jobReference) {
                    candidateExperience.jobReference = {} as any;
                }
                // Set default type if not present
                if (!candidateExperience.type) {
                    candidateExperience.type = CandidateJobDto.TypeEnum.Job;
                }
            }
        }

        this.candidateExperiences = val;
        this.sortExperiences();
    }

    @Output() onModification = new EventEmitter<boolean>();
    @Output() onStatusChange = new EventEmitter<void>();

    constructor(
        private dialogService: DialogService,
        private referentialProvider: ReferentialProvider,
        private translate: TranslateService,
        private candidatesService: CandidatesService,
    ) {
        super();
        this.init();
        this.notesRefVisible =
            SharedService.userHasRole(
                this.AuthDataService.currentUser,
                this.RolesList.Consultant,
            ) ||
            SharedService.userHasRole(
                this.AuthDataService.currentUser,
                this.RolesList.Admin,
            ) ||
            SharedService.userHasRole(
                this.AuthDataService.currentUser,
                this.RolesList.RH,
            );
        this.isConsultant = SharedService.userIsConsultant(
            this.AuthDataService.currentUser,
        );
    }

    async init() {
        // if (this.mode === 'resume')
        //     return;
        const appTypes = await this.referentialProvider.getTypesValues(
            [AppTypes.JobReferenceFunctionCode, AppTypes.EmployerProfilCode],
            true,
        );
        const tempJobReferenceFunctions = appTypes.find(
            (x) => x.code === AppTypes.JobReferenceFunctionCode,
        ).appValues;
        this.jobReferenceFunctions = tempJobReferenceFunctions.sort(
            (a, b) => a.order - b.order,
        );
        const tempEmployerProfile = appTypes.find(
            (x) => x.code === AppTypes.EmployerProfilCode,
        ).appValues;
        this.employerProfileFunctions = tempEmployerProfile.sort(
            (a, b) => a.order - b.order,
        );
    }

    ngOnInit() {
        this.sortExperiences();
    }

    private sortExperiences() {
        if (this.candidateExperiences?.length) {
            this.candidateExperiences = new NxsList(this.candidateExperiences)
                .OrderByDescending((x) => x.experienceStartDate)
                .ToArray();
        }
    }

    addNewExperience() {
        if (!this.candidateExperiences) {
            this.candidateExperiences = [];
        }

        this.candidateExperiences.push({
            jobReference: {} as any,
            type: CandidateJobDto.TypeEnum.Job, // Default to JOB type
            inActivity: false,
        });
        this.emitModification();
    }

    async removeExperience(experience: CandidateJobDto) {
        const dialog = await this.dialogService.showConfirmDialog(
            'Voulez vous vraiment supprimer cette expérience ?',
            { okLabel: 'Global.Yes', cancelLabel: 'Global.Cancel' },
        );

        if (dialog.cancelClicked) {
            return;
        }

        const index = this.candidateExperiences.indexOf(experience);

        if (index !== -1) {
            this.candidateExperiences.splice(index, 1);
        }
        this.emitModification();
    }

    async onJobChange(experience: CandidateJobDto) {
        // Clear jobName if the selected job is not "Other"
        console.log('experience', experience);

        // Look up the job from jobList to get the current selection
        let selectedJob = this.jobList?.find((j) => j.id === experience.jobId);
        console.log('selectedJob from jobList', selectedJob);

        // If jobList is empty or job not found, fetch from referential service
        if (!selectedJob && experience.jobId) {
            console.log(
                'jobList is empty, fetching job from referential service',
            );
            const jobTypes =
                await this.referentialProvider.getTypesValuesJobs();
            // Flatten all jobs from all categories
            const allJobs: AppValueDto[] = [];
            jobTypes.forEach((category) => {
                if (category.appValues) {
                    allJobs.push(...category.appValues);
                }
            });
            selectedJob = allJobs.find((j) => j.id === experience.jobId);
            console.log('selectedJob from referential', selectedJob);
        }

        // Check by code instead of label (more reliable across languages)
        const isOther = selectedJob?.code === 'jobcategory_autres';

        // Update the map for reactive UI updates
        const experienceKey = this.getExperienceKey(experience);
        this.otherJobSelectedMap.set(experienceKey, isOther);

        if (!isOther) {
            experience.jobName = null;
        }

        this.emitModification();
    }

    onTypeChange(experience: CandidateJobDto) {
        // Handle type change logic if needed
        // Currently just emitting modification, but could add specific logic here
        console.log(
            'Type changed for experience:',
            experience.id,
            'to:',
            experience.type,
        );
        this.emitModification();
    }

    getExperienceKey(experience: CandidateJobDto): string {
        // Use ID if available, otherwise use index
        return (
            experience.id ||
            `temp_${this.candidateExperiences.indexOf(experience)}`
        );
    }

    isOtherJobSelected(experience: CandidateJobDto): boolean {
        if (!experience.jobId) {
            return false;
        }

        const experienceKey = this.getExperienceKey(experience);

        // Check the map first for reactive updates (when user changes selection)
        if (this.otherJobSelectedMap.has(experienceKey)) {
            return this.otherJobSelectedMap.get(experienceKey);
        }

        // Fallback: Try to find the job in jobList first
        let selectedJob = this.jobList?.find((j) => j.id === experience.jobId);

        // If not found in jobList, use the job object from the experience (loaded from backend)
        if (!selectedJob && experience.job) {
            selectedJob = experience.job;
        }

        const isOther = selectedJob?.code === 'jobcategory_autres';

        // Cache the result in the map
        this.otherJobSelectedMap.set(experienceKey, isOther);

        console.log(
            'isOtherJobSelected - selectedJob:',
            selectedJob,
            'isOther:',
            isOther,
        );
        return isOther;
    }

    onJobReferenceChange(jobRef: JobReferenceDto) {
        if (!jobRef) {
            return;
        }

        const isJobRefCodeOther =
            this.jobReferenceFunctions.find(
                (x) => x.id === jobRef.jobRefFunctionId,
            )?.code === JobReferenceFunction.Autre;

        if (!isJobRefCodeOther) {
            jobRef.otherFunction = null;
        }

        jobRef.jobRefFunctionId = this.jobReferenceFunctions.find(
            (x) => x.id === jobRef.jobRefFunctionId,
        )?.id;
    }

    // checkNameOrCompanyBeforeValidate() {
    //     const errors: string[] = [];
    //     for (const experience of this.candidateExperiences) {
    //         if (!experience.jobReference.isCompany && !experience.jobReference.isPrivatePerson) {
    //             errors.push(this.translate.instant('Experience.ErrorJobRefType'));
    //         }
    //         if (experience.jobReference.isPrivatePerson && !experience.jobReference.isCompany) {
    //             if (!experience.jobReference.privatePersonFirstName)
    //                 errors.push(this.translate.instant('Experience.ErrorJobRefFirstName'));
    //             if (!experience.jobReference.privatePersonLastName)
    //                 errors.push(this.translate.instant('Experience.ErrorJobRefLastName'));
    //         }
    //         if (experience.jobReference.isCompany && !experience.jobReference.isPrivatePerson) {
    //             if (!experience.jobReference.companyName)
    //                 errors.push(this.translate.instant('Experience.ErrorJobRefCompanyName'));
    //         }
    //         if (experience.jobReference.isCompany || experience.jobReference.isPrivatePerson) {
    //             if (!experience.jobReference.addresses?.length)
    //                 errors.push(this.translate.instant('Experience.ErrorJobRefLocation'));
    //         }
    //         if (errors.length)
    //             console.log("🚀 ~ ExperiencesComponent ~ checkNameOrCompanyBeforeValidate ~ errors", errors);
    //         continue;
    //     }
    //     console.log("🚀 ~ ExperiencesComponent ~ checkNameOrCompanyBeforeValidate ~ errors", errors);
    //     return errors;
    // }

    emitModification() {
        this.hasPendingModifications = true;
        // if (this.checkNameOrCompanyBeforeValidate()?.length) {
        //     this.dialogService.showDialog(this.translate.instant('Errors.ErrorList') + '<ul>' + this.checkNameOrCompanyBeforeValidate().map(x => x = '<li>' + x + '</li>').join('') + '</ul>');
        //     return;
        // }
        this.onModification.emit(this.hasPendingModifications);
    }

    isExperienceFullCompleted(): boolean {
        // Always allow adding new experiences
        return true;
    }

    addNewJobReference(experience: CandidateJobDto) {
        /*if (!experience.jobReference)
            return; */
        experience.jobReference = {} as any;
        this.emitModification();
    }

    hasJobId(experience: CandidateJobDto) {
        if (!experience.jobId) {
            experience.inActivity = false;

            return false;
        }

        return true;
    }

    onInActivityChange(experience: CandidateJobDto) {
        if (experience.inActivity) {
            experience.experienceEndDate = null;
            experience.leavingReason = null;
        }
        this.emitModification();
    }

    displayOtherJobRefFunctionInput(jobRef: JobReferenceDto) {
        if (!jobRef.jobRefFunctionId) {
            return false;
        }

        let jobRefId: string;

        if (jobRef.jobRefFunctionId) {
            jobRefId = jobRef.jobRefFunctionId;
        } else if (jobRef.jobRefFunction.id) {
            jobRefId = jobRef.jobRefFunction.id;
        }

        if (
            this.jobReferenceFunctions.find((x) => x.id === jobRefId)?.code ===
            JobReferenceFunction.Autre
        ) {
            return true;
        } else {
            return false;
        }
    }

    addAddress(experience: CandidateJobDto) {
        if (!experience.jobReference) {
            return;
        }

        if (!experience.jobReference.addresses?.length) {
            experience.jobReference.addresses = [];
        }

        experience.jobReference.addresses.push({
            lineOne: undefined,
            lineTwo: undefined,
            city: undefined,
            postalCode: undefined,
            label: undefined,
            country: undefined,
            jobReferenceId: experience.jobReferenceId,
        });
        this.hasPendingModifications = true;
    }

    removeAddress(address: AddressDto, experience: CandidateJobDto) {
        if (!experience.jobReference) {
            return;
        }

        if (!address || !experience.jobReference.addresses) {
            return;
        }

        const addressIndex = experience.jobReference.addresses.indexOf(address);

        if (addressIndex > -1) {
            experience.jobReference.addresses.splice(addressIndex, 1);
        }

        this.hasPendingModifications = true;
    }

    setJobReferenceCompanyOrPerson(ref: JobReferenceDto) {
        if (ref.isCompany) {
            ref.privatePersonFirstName = '';
            ref.privatePersonLastName = '';
        } else {
            ref.companyName = '';
        }
        this.emitModification();
    }

    // Status change methods
    async validateJob(experience: CandidateJobDto) {
        await this.updateJobStatus(experience, CandidateJobStatus.VALIDATED);
    }

    async refuseJob(experience: CandidateJobDto) {
        await this.updateJobStatus(experience, CandidateJobStatus.REFUSED);
    }

    async resetJobStatus(experience: CandidateJobDto) {
        await this.updateJobStatus(experience, CandidateJobStatus.PENDING);
    }

    // Check if there are any pending jobs
    hasPendingJobs(): boolean {
        if (!this.candidateExperiences?.length) {
            return false;
        }
        return this.candidateExperiences.some(
            (exp) => exp.id && exp.status === CandidateJobStatus.PENDING,
        );
    }

    // Validate all pending jobs
    async validateAllJobs() {
        const pendingJobs = this.candidateExperiences.filter(
            (exp) => exp.id && exp.status === CandidateJobStatus.PENDING,
        );

        if (!pendingJobs.length) {
            return;
        }

        try {
            this.loading = true;

            const response = await this.candidatesService
                .updateCandidateJobsStatus({
                    updateCandidateJobsStatusRequest: {
                        candidateId: this.candidateId,
                        candidateJobUpdates: pendingJobs.map((job) => ({
                            candidateJobId: job.id,
                            status: CandidateJobStatus.VALIDATED,
                        })),
                    },
                })
                .toPromise();

            if (response.success) {
                // Update local status for all pending jobs
                pendingJobs.forEach((job) => {
                    job.status = CandidateJobStatus.VALIDATED;
                });
                this.emitModification();
                this.onStatusChange.emit();
                this.dialogService.showDialog(
                    this.translate.instant('Candidate.JobStatusUpdated'),
                );
            } else {
                this.dialogService.showDialog(
                    response.message || 'Error updating job status',
                );
            }
        } catch (error) {
            console.error('Error validating all jobs:', error);
            this.dialogService.showDialog('Error updating job status');
        } finally {
            this.loading = false;
        }
    }

    // Refuse all pending jobs
    async refuseAllJobs() {
        const pendingJobs = this.candidateExperiences.filter(
            (exp) => exp.id && exp.status === CandidateJobStatus.PENDING,
        );

        if (!pendingJobs.length) {
            return;
        }

        try {
            this.loading = true;

            const response = await this.candidatesService
                .updateCandidateJobsStatus({
                    updateCandidateJobsStatusRequest: {
                        candidateId: this.candidateId,
                        candidateJobUpdates: pendingJobs.map((job) => ({
                            candidateJobId: job.id,
                            status: CandidateJobStatus.REFUSED,
                        })),
                    },
                })
                .toPromise();

            if (response.success) {
                // Update local status for all pending jobs
                pendingJobs.forEach((job) => {
                    job.status = CandidateJobStatus.REFUSED;
                });
                this.emitModification();
                this.onStatusChange.emit();
                this.dialogService.showDialog(
                    this.translate.instant('Candidate.JobStatusUpdated'),
                );
            } else {
                this.dialogService.showDialog(
                    response.message || 'Error updating job status',
                );
            }
        } catch (error) {
            console.error('Error refusing all jobs:', error);
            this.dialogService.showDialog('Error updating job status');
        } finally {
            this.loading = false;
        }
    }

    private async updateJobStatus(
        experience: CandidateJobDto,
        status: CandidateJobStatus,
    ) {
        try {
            this.loading = true;

            const response = await this.candidatesService
                .updateCandidateJobsStatus({
                    updateCandidateJobsStatusRequest: {
                        candidateId: this.candidateId,
                        candidateJobUpdates: [
                            {
                                candidateJobId: experience.id,
                                status: status,
                            },
                        ],
                    },
                })
                .toPromise();

            if (response.success) {
                // Update the local experience status
                experience.status = status;
                this.emitModification();
                this.onStatusChange.emit();

                // Show success message
                this.dialogService.showDialog(
                    this.translate.instant('Candidate.JobStatusUpdated'),
                );
            } else {
                this.dialogService.showDialog(
                    response.message || 'Error updating job status',
                );
            }
        } catch (error) {
            console.error('Error updating job status:', error);
            this.dialogService.showDialog('Error updating job status');
        } finally {
            this.loading = false;
        }
    }

    // Toggle card collapsed/expanded state
    toggleCard(index: number): void {
        this.collapsedCards[index] = !this.collapsedCards[index];
    }

    // Get the job label for display in collapsed summary
    getJobLabel(experience: CandidateJobDto): string {
        if (experience.job) {
            return (
                DbTranslatePipe.dbTranslateValue('label', experience.job) ||
                experience.job.label
            );
        }
        if (experience.jobName) {
            return experience.jobName;
        }
        return this.translate.instant('Experience.jobNotCompleted');
    }
}
