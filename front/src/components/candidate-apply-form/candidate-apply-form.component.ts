import {
    Component,
    ElementRef,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'nextalys-angular-tools';
import {
    AddingFileFailedData,
    FileUploadData,
    FileUploadOptions,
} from 'nextalys-file-upload';
import { DateHelpers, MainHelpers } from 'nextalys-js-helpers';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Subject } from 'rxjs';
import { RefData } from '../../../../shared/ref-data';
import { ApplyStatus, AppTypes } from '../../../../shared/shared-constants';
import {
    SharedCountryService,
    SharedService,
} from '../../../../shared/shared-service';
import { BasePageComponent } from '../../pages/base/base-page.component';
import {
    AppFileDto,
    AppValueDto,
    CandidateApplicationDto,
    CandidateDepartmentDto,
    JobOfferDto,
    JobOffersService,
} from '../../providers/api-client.generated';
import { CandidateApplicationsService } from '../../providers/api-client.generated/api/candidateApplications.service';
import { LanguageProvider } from '../../providers/language.provider';
import { ReferentialProvider } from '../../providers/referential.provider';
import { FrontCandidateHelpers } from '../../services/front-candidate-helpers';
import { Department } from '../../services/geo.service';
import { DepartmentsAutocompleteComponent } from '../departments-autocomplete/departments-autocomplete.component';
import { JobOffersAutocompleteComponent } from '../job-offers-autocomplete/job-offers-autocomplete.component';
import { UsTermsDialogComponent, US_TERMS_VERSION } from '../us-terms-dialog/us-terms-dialog.component';

const defaultJobsUrl =
    'https://www.personneldemaison.agency/jobs--emplois-personnel-de-maison.html';

@Component({
    selector: 'app-candidate-apply',
    templateUrl: './candidate-apply-form.component.html',
    styleUrls: ['./candidate-apply-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CandidateApplyForm extends BasePageComponent {
    candidateApplication: CandidateApplicationDto = {} as any;
    applyForCouple: boolean;
    acceptCG: boolean;
    currentJobOffer: JobOfferDto;
    relationshipStatusList: AppValueDto[];
    genderList: AppValueDto[];
    candidateApplyStatusList: AppValueDto[];
    jobOfferCategory: AppValueDto[];
    jobOfferList: JobOfferDto[] = [];
    cvUploadData: FileUploadData = {};
    imageUploadData: FileUploadData = {};
    partnerCVUploadData: FileUploadData = {};
    jobsSelection: JobOfferDto[] = [];
    countriesSelectedCodes: string[];
    selectedDepartment: Department;
    countryCode: string;

    private refFromUrl: string = '';
    jobs_url: string = defaultJobsUrl;
    private usCountryFromUrl: string = '';
    private usCountry = false;
    modeWithoutGenderAndBirthDate = false;
    refFromUrlLink: string = '';
    introBtnClass: 'white' | 'blue' = 'white';
    allowedCountry = true;
    SharedCountryService = SharedCountryService;
    hideApplicationType = false;
    hideAdRefForm = false;
    showSingleButtonCandidatureSpontanee = false;
    countryFieldFilled = false;
    step = 0;
    requestError = '';
    loading = false;
    formSent = false;
    RefData = RefData;
    usTermsAccepted = false;
    countriesWithNoGenderAndBirthDate: string[] = [
        'US', // États-Unis
        'EG', // Égypte
        'TR', // Turquie
        'IQ', // Irak
        'IR', // Perse (Iran)
        'SY', // Syrie
        'LB', // Liban
        'JO', // Jordanie
        'IL', // Israël
        'SA', // Arabie Saoudite
        'AE', // Émirats du Golfe (Émirats arabes unis)
        'KW', // Koweït
        'BH', // Bahreïn
        'QA', // Qatar
        'YE', // Yémen (inclut Aden, aujourd'hui une ville du Yémen)
    ];

    imageUploadOptions: FileUploadOptions = {
        controller: {
            openFilePicker: new Subject(),
            reset: new Subject(),
        },
        allowedMimeTypes: [
            'image/jpeg',
            'image/png',
            'image/bmp',
            'image/webp',
        ] as any,
        filesCount: 1,
        maxWidth: 700,
        usePica: true,
        maxWidthForThumbnails: 90,
        fileMaxSize: 3145728,
        maxFileSizeBeforeResize: 14680064,
    }; //3MO - 1
    // 4 MO //14680064
    cvUploadOptions: FileUploadOptions = {
        controller: {
            openFilePicker: new Subject(),
            reset: new Subject(),
        },
        allowedMimeTypes: [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'text/plain',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
        ] as any,
        filesCount: 1,
        maxWidth: 1500,
        usePica: true,
        maxWidthForThumbnails: 90,
        fileMaxSize: 3145728,
        maxFileSizeBeforeResize: 14680064,
    }; //3MO - 14 MO //14680064

    partnerCVUploadOptions: FileUploadOptions = {
        controller: {
            openFilePicker: new Subject(),
            reset: new Subject(),
        },
        allowedMimeTypes: [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'text/plain',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
        ] as any,
        filesCount: 1,
        maxWidth: 1500,
        usePica: true,
        maxWidthForThumbnails: 90,
        fileMaxSize: 3145728,
        maxFileSizeBeforeResize: 14680064,
    };

    @ViewChild(DepartmentsAutocompleteComponent)
    departmentsAutocompleteComponent: DepartmentsAutocompleteComponent;
    @ViewChild(JobOffersAutocompleteComponent)
    autocompleteComponent: JobOffersAutocompleteComponent;
    @ViewChild('offerForm')
    offerForm: ElementRef<HTMLFormElement>;

    constructor(
        private candidateApplicationService: CandidateApplicationsService,
        private dialogService: DialogService,
        private referentialProvider: ReferentialProvider,
        private recaptchaV3Service: ReCaptchaV3Service,
        private jobOfferService: JobOffersService,
        private translate: TranslateService,
        private activatedRoute: ActivatedRoute,
        private dialog: MatDialog,
    ) {
        super();

        this.subscribeToObservable(
            this.activatedRoute.queryParams,
            (params) => {
                this.init(params);
            },
        );
    }

    private setModeWithoutGenderAndBirthDate() {
        this.modeWithoutGenderAndBirthDate =
            !!this.usCountry ||
            !!this.applyForCouple ||
            this.countriesWithNoGenderAndBirthDate.includes(this.countryCode);
    }

    private async setFormParams(params: Params) {
        this.refFromUrl = params['ref'];

        this.jobs_url = params['jobs_url'];
        this.jobs_url = this.jobs_url || defaultJobsUrl;

        this.usCountryFromUrl = params['us'];
        this.usCountry = this.usCountryFromUrl === 'true';
        this.setModeWithoutGenderAndBirthDate();
        const iframeHomeParam = params['iframe-home'];
        this.showSingleButtonCandidatureSpontanee = iframeHomeParam === 'true';
        const blueParam = params['blue'];

        if (blueParam === 'true') {
            this.introBtnClass = 'blue';
        }

        if (this.refFromUrl) {
            this.refFromUrlLink = '&ref=' + this.refFromUrl;
        }

        await this.queryParamsChange();
    }

    openFileSelectForCv() {
        this.cvUploadOptions.controller?.reset?.next();
        this.cvUploadOptions.controller?.openFilePicker?.next();
    }

    openFileSelectForPartnerCv() {
        this.partnerCVUploadOptions.controller?.reset?.next();
        this.partnerCVUploadOptions.controller?.openFilePicker?.next();
    }

    openFileSelectForPortraitPhoto() {
        this.imageUploadOptions.controller?.reset?.next();
        this.imageUploadOptions.controller?.openFilePicker?.next();
    }

    private async queryParamsChange() {
        if (!this.candidateApplication) {
            this.candidateApplication = {} as any;
        }

        if (this.showSingleButtonCandidatureSpontanee) {
            if (this.candidateApplication) {
                this.candidateApplication.spontaneousApplication = true;
                this.hideApplicationType = true;
            }
        }

        const jobOfferFromUrl = await FrontCandidateHelpers.handleJobRefFromUrl(
            this,
            this.refFromUrl,
        );

        if (jobOfferFromUrl) {
            this.currentJobOffer = jobOfferFromUrl;
            this.hideApplicationType = true;

            if (this.candidateApplication) {
                this.candidateApplication.spontaneousApplication = false;
            }

            if (this.currentJobOffer) {
                this.hideAdRefForm = true;
            }

            this.addJobOfferInSelectionList();
        }
    }

    applyForCoupleChange() {
        this.candidateApplication.inCouple = this.applyForCouple;
        this.setModeWithoutGenderAndBirthDate();
    }

    private async init(params: Params) {
        this.loading = true;

        if (params.lang) {
            LanguageProvider.setLanguageFromUrl(true);
        }

        await this.setFormParams(params);

        // const ipAllowedResponse = await this.sendApiRequest(
        //     this.candidateApplicationService.isCountryAllowed(),
        // );

        let testMode = false;

        if (this.environment.envName === 'production') {
            testMode = false;
        }

        if (testMode) {
            this.countryCode = 'FR';
            this.allowedCountry = false;
        }

        if (!this.candidateApplication) {
            this.candidateApplication = {} as any;
        }

        if (this.candidateApplication) {
            this.candidateApplication.address = {} as any;
        }

        try {
            const appTypes = await this.referentialProvider.getTypesValues(
                [
                    AppTypes.RelationshipStatusCode,
                    AppTypes.PersonGenderCode,
                    AppTypes.ApplyStatusCode,
                    // AppTypes.JobCategoryCode,
                ],
                true,
            );

            this.genderList = appTypes.find(
                (x) => x.code === AppTypes.PersonGenderCode,
            ).appValues;
            this.relationshipStatusList = appTypes.find(
                (x) => x.code === AppTypes.RelationshipStatusCode,
            ).appValues;
            this.candidateApplyStatusList = appTypes.find(
                (x) => x.code === AppTypes.ApplyStatusCode,
            ).appValues;
            // this.jobOfferCategory = appTypes.find(x => x.code === AppTypes.JobCategoryCode).appValues;
        } catch (error) {}

        // await MainHelpers.sleep(500);
        // this.setFormParams(this.activatedRoute.snapshot.queryParams);
        // this.candidateApplication.candidateApplicationJobs = [];
        this.loading = false;
    }

    beforeSubmitCheck() {
        this.setModeWithoutGenderAndBirthDate();
        const birthDateAndGenderRequired =
            !this.modeWithoutGenderAndBirthDate &&
            SharedCountryService.showCandidateDetailFields(
                this.candidateApplication,
            );
        const errors: string[] = [];

        if (!this.candidateApplication) {
            errors.push('Veuillez remplir le formulaire');
        }

        if (
            !this.candidateApplication.birthDate &&
            birthDateAndGenderRequired
        ) {
            errors.push(
                this.translate.instant('ErrorsCandidate.BirthDateUndefined'),
            );
        }

        if (!this.candidateApplication.email) {
            errors.push(
                this.translate.instant('ErrorsCandidate.EmailUndefined'),
            );
        }

        if (!this.candidateApplication.firstName) {
            errors.push(
                this.translate.instant('ErrorsCandidate.FirstNameUndefined'),
            );
        }

        if (!this.candidateApplication.genderId && birthDateAndGenderRequired) {
            errors.push(
                this.translate.instant('ErrorsCandidate.GenderUndefined'),
            );
        }

        if (!this.candidateApplication.lastName) {
            errors.push(
                this.translate.instant('ErrorsCandidate.NameUndefined'),
            );
        }

        if (!this.candidateApplication.phone) {
            errors.push(
                this.translate.instant('ErrorsCandidate.PhoneUndefined'),
            );
        }

        if (!this.candidateApplication.professionId) {
            errors.push(this.translate.instant('ErrorsCandidate.JobUndefined'));
        }
        // if (!this.candidateApplication.relationshipStatusId)
        //     errors.push(this.translate.instant('ErrorsCandidate.RelationshipUndefined'));
        if (!this.candidateApplication.skills) {
            errors.push(
                this.translate.instant('ErrorsCandidate.SkillsUndefined'),
            );
        }

        if (!this.acceptCG) {
            errors.push(this.translate.instant('ErrorsCandidate.AcceptTOS'));
        }

        if (this.candidateApplication?.address?.country === 'US') {
            if (this.candidateApplication.allowed_to_work_us == null) {
                errors.push(
                    this.translate.instant(
                        'Vous devez répondre à la question',
                    ) +
                        ' : ' +
                        this.translate.instant(
                            'Êtes-vous autorisé à travailler aux États-Unis ?',
                        ),
                );
            }

            if (this.candidateApplication.require_sponsorship_us == null) {
                errors.push(
                    this.translate.instant(
                        'Vous devez répondre à la question',
                    ) +
                        ' : ' +
                        this.translate.instant(
                            "Aurez-vous besoin, maintenant ou à l'avenir, d'un parrainage pour travailler aux États-Unis ?",
                        ),
                );
            }
        }

        if (
            !this.candidateApplication.address.lineOne ||
            !this.candidateApplication.address.city ||
            !this.candidateApplication.address.postalCode ||
            !this.candidateApplication.address.country ||
            !this.candidateApplication.address.department
        ) {
            errors.push(this.translate.instant('AddressErrors.AllAdressInput'));
        }

        if (this.applyForCouple === true) {
            if (!this.candidateApplication.partnerLastName) {
                errors.push(
                    this.translate.instant(
                        'ErrorsCandidate.PartnerNameUndefined',
                    ),
                );
            }
            // if (!this.candidateApplication.partnerGenderId)
            //     errors.push(this.translate.instant('ErrorsCandidate.PartnerGenderUndefined'));
            // if (!this.candidateApplication.partnerBirthDate)
            //     errors.push(this.translate.instant('ErrorsCandidate.PartnerBirthDateUndefined'));
        }

        if (this.candidateApplication.spontaneousApplication == null) {
            errors.push(
                this.translate.instant('ErrorsCandidate.ApplicationType'),
            );
            console.log(
                'ErrorsCandidate.ApplicationType this.candidateApplication.candidateApplicationJobs:',
                this.candidateApplication.candidateApplicationJobs,
                this.candidateApplication.spontaneousApplication,
            );
        }

        if (
            this.candidateApplication.spontaneousApplication === false &&
            !this.candidateApplication.candidateApplicationJobs?.length
        ) {
            console.log(
                'ErrorsCandidate.JobRefApplication this.candidateApplication.candidateApplicationJobs:',
                this.candidateApplication.candidateApplicationJobs,
                this.candidateApplication.spontaneousApplication,
            );
            errors.push(
                this.translate.instant('ErrorsCandidate.JobRefApplication'),
            );
        }

        if (!this.cvUploadData?.fileItems?.length) {
            errors.push(this.translate.instant('ErrorsCandidate.CVMandatory'));
        }

        if (
            this.applyForCouple &&
            !this.partnerCVUploadData?.fileItems?.length
        ) {
            errors.push(
                this.translate.instant('ErrorsCandidate.PartnerCVMandatory'),
            );
        }

        return errors;
    }

    private checkDataFormat() {
        this.setModeWithoutGenderAndBirthDate();
        const errors: string[] = [];

        if (!SharedService.isValidEmail(this.candidateApplication.email)) {
            errors.push(
                this.translate.instant('ErrorsCandidate.EmailNotFormat'),
            );
        }

        const birthDateAndGenderRequired =
            !this.modeWithoutGenderAndBirthDate &&
            SharedCountryService.showCandidateDetailFields(
                this.candidateApplication,
            );

        if (birthDateAndGenderRequired) {
            if (!DateHelpers.isValidDate(this.candidateApplication.birthDate)) {
                errors.push(
                    this.translate.instant(
                        'ErrorsCandidate.BirthdateNotFormat',
                    ),
                );
            } else if (
                !this.checkIfMajor(this.candidateApplication.birthDate)
            ) {
                errors.push(
                    this.translate.instant('ErrorsCandidate.NeedToBeMajor'),
                );
            }
        }

        // if (this.candidateApplication.partnerBirthDate) {
        //     if (!DateHelpers.isValidDate(this.candidateApplication.partnerBirthDate)) {
        //         errors.push(this.translate.instant('ErrorsCandidate.PartnerBirthdateFormat'));
        //     }
        //     else if (!this.checkIfMajor(this.candidateApplication.partnerBirthDate)) {
        //         errors.push(this.translate.instant('ErrorsCandidate.PartnerNeedToBeMajor'));
        //     }
        // }
        if (this.candidateApplication.spontaneousApplication) {
            this.candidateApplication.candidateApplicationJobs = [];
            console.log(
                'checkDataFormat - spontaneousApplication ~ reset this.candidateApplication.candidateApplicationJobs:',
                this.candidateApplication.candidateApplicationJobs,
                this.candidateApplication.spontaneousApplication,
            );
        }

        if (this.candidateApplication.address.postalCode.length > 20) {
            errors.push(
                this.translate.instant('ErrorsCandidate.PostalCodeNotFormat'),
            );
        }

        return errors;
    }

    onCompleteItems() {
        this.loading = false;
    }

    onAddingFileFailed(data: AddingFileFailedData) {
        if (data?.code === 'incorrectFileType') {
            this.dialogService.showDialog(
                this.translate.instant('Global.IncorrectFileType'),
            );
        } else {
            this.dialogService.showDialog(data.message);
        }

        this.loading = false;
    }

    async submitForm() {
        if (this.beforeSubmitCheck().length) {
            return this.dialogService.showDialog(
                this.translate.instant('Errors.ErrorList') +
                    '<ul>' +
                    this.beforeSubmitCheck()
                        .map((x) => (x = '<li>' + x + '</li>'))
                        .join('') +
                    '</ul>',
            );
        }

        const formatErrors = this.checkDataFormat();

        if (formatErrors?.length) {
            this.dialogService.showDialog(
                this.translate.instant('Errors.ErrorList') +
                    '<ul>' +
                    formatErrors
                        .map((x) => (x = '<li>' + x + '</li>'))
                        .join('') +
                    '</ul>',
            );

            return;
        }

        const recaptchaToken = await this.recaptchaV3Service
            .execute('candidateApplicationFormSubmit')
            .toPromise();

        this.candidateApplication.candidateCountries =
            this.countriesSelectedCodes?.map((x) => ({ country: x })) || [];
        this.loading = true;

        const cloneCandidateApplication = MainHelpers.cloneObject(
            this.candidateApplication,
        );

        cloneCandidateApplication.applyStatusId =
            this.candidateApplyStatusList.find(
                (x) => x.code === ApplyStatus.Pending,
            ).id;

        cloneCandidateApplication.birthDate = DateHelpers.toUtcDate(
            this.candidateApplication.birthDate,
        );

        if (this.applyForCouple) {
            cloneCandidateApplication.inCouple = true;
        }

        this.loading = true;

        if (this.cvUploadData?.fileItems?.length) {
            const mainResumeFiles: AppFileDto[] =
                this.cvUploadData.fileItems.map<AppFileDto>((x) => ({
                    physicalName: x.file.name,
                    name: x.alias,
                    mimeType: x.file.type,
                }));
            cloneCandidateApplication.mainResumeFile = mainResumeFiles[0];
        }

        if (this.imageUploadData?.fileItems?.length) {
            const photoFile: AppFileDto[] =
                this.imageUploadData.fileItems.map<AppFileDto>((x) => ({
                    physicalName: x.file.name,
                    name: x.alias,
                    mimeType: x.file.type,
                }));
            cloneCandidateApplication.photoFile = photoFile[0];
        }

        if (this.partnerCVUploadData?.fileItems?.length) {
            const partnerResumeFile: AppFileDto[] =
                this.partnerCVUploadData.fileItems.map<AppFileDto>((x) => ({
                    physicalName: x.file.name,
                    name: x.alias,
                    mimeType: x.file.type,
                }));
            cloneCandidateApplication.partnerResumeFile = partnerResumeFile[0];
        }

        const saveCandidateApplyResponse = await this.sendApiRequest(
            this.candidateApplicationService.createOrUpdateCandidateApplication(
                {
                    submitCandidateApplicationFormRequest: {
                        candidateApplication: cloneCandidateApplication,
                        recaptchaToken: recaptchaToken,
                        language: LanguageProvider.currentLanguageCode,
                    },
                },
            ),
        );

        if (!saveCandidateApplyResponse.success) {
            this.dialogService.showDialog(saveCandidateApplyResponse.message);
        } else {
            this.dialogService.showSnackBar(
                this.translate.instant('CandidateApplication.FormularySent'),
            );

            const selectedJobs =
                this.candidateApplication.candidateApplicationJobs;
            const spontaneousApplication =
                !!this.candidateApplication.spontaneousApplication;
            this.candidateApplication = {} as any;
            this.candidateApplication.candidateApplicationJobs = selectedJobs;
            this.candidateApplication.spontaneousApplication =
                spontaneousApplication;

            this.candidateApplication.address = {} as any;
            this.offerForm.nativeElement.reset();
            this.formSent = true;
            this.step = 2;
        }

        this.loading = false;
    }

    private checkIfMajor(dateToVerify: Date) {
        if (!dateToVerify) {
            return false;
        }

        const todayDate = new Date();
        const numberDays = DateHelpers.daysDiff(dateToVerify, todayDate);
        const yearCountDays = 365;
        const compareDate = Number(
            Math.floor(numberDays / yearCountDays).toFixed(0),
        );

        return compareDate >= 18;
    }

    loadJobOffer = async (input: string) => {
        this.loading = true;
        const response = await this.sendApiRequest(
            this.jobOfferService.getAllJobOffers({ search: input }),
        );
        if (response.success) {
            return response.jobOffers.map((x) => x.ref);
        }

        this.loading = false;

        return [];
    };

    addJobOfferInSelectionList() {
        if (!this.currentJobOffer?.id) {
            return;
        }

        if (!this.candidateApplication.candidateApplicationJobs) {
            this.candidateApplication.candidateApplicationJobs = [];
        }

        if (
            this.candidateApplication.candidateApplicationJobs?.some(
                (x) => x.jobOfferId === this.currentJobOffer.id,
            )
        ) {
            this.autocompleteComponent?.clear();
            this.candidateApplication.spontaneousApplication = false;
            console.log(
                'addJobOfferInSelectionList - ALREADY EXISTS ~ this.candidateApplication.candidateApplicationJobs:',
                this.candidateApplication.candidateApplicationJobs,
                this.candidateApplication.spontaneousApplication,
            );

            return;
        }

        this.candidateApplication.candidateApplicationJobs.push({
            candidateApplicationId: undefined,
            jobOffer: MainHelpers.cloneObject(this.currentJobOffer),
            jobOfferId: this.currentJobOffer.id,
        });
        // console.log("Log ~ CandidateApplyForm ~ addJobOfferInSelectionList ~    this.candidateApplication.candidateApplicationJobs:", this.candidateApplication.candidateApplicationJobs);
        this.candidateApplication.spontaneousApplication = false;
        console.log(
            'addJobOfferInSelectionList - NOT EXISTS ~ this.candidateApplication.candidateApplicationJobs:',
            this.candidateApplication.candidateApplicationJobs,
            this.candidateApplication.spontaneousApplication,
        );
        this.autocompleteComponent?.clear();
    }

    removeJobFromSelection(item: JobOfferDto) {
        const index =
            this.candidateApplication.candidateApplicationJobs?.findIndex(
                (x) => x.jobOffer.id === item.id,
            );
        if (index != null && index !== -1) {
            this.candidateApplication.candidateApplicationJobs.splice(index, 1);
        }
    }

    removeCandidateDepartment(candidateDepartment: CandidateDepartmentDto) {
        if (!this.candidateApplication.candidateDepartments) {
            return;
        }

        const index = this.candidateApplication.candidateDepartments.findIndex(
            (x) => x === candidateDepartment,
        );

        if (index !== -1) {
            this.candidateApplication.candidateDepartments.splice(index, 1);
        }
    }

    getCountryFromCode(code: string) {
        return this.RefData.getCountryLabel(code);
    }

    /**
     * Checks if a string starts with a vowel (for French grammar rules)
     * @param text The text to check
     * @returns true if the text starts with a vowel, false otherwise
     */
    private startsWithVowel(text: string): boolean {
        if (!text || text.length === 0) return false;
        const firstChar = text.charAt(0).toLowerCase();
        return [
            'a',
            'e',
            'i',
            'o',
            'u',
            'y',
            'à',
            'â',
            'ä',
            'é',
            'è',
            'ê',
            'ë',
            'î',
            'ï',
            'ô',
            'ö',
            'ù',
            'û',
            'ü',
            'ÿ',
        ].includes(firstChar);
    }

    /**
     * Gets the appropriate French preposition based on whether the job title starts with a vowel
     * @param jobTitle The job title to check
     * @returns "d'" if the title starts with a vowel, "de" otherwise
     */
    private getFrenchPreposition(jobTitle: string): string {
        return this.startsWithVowel(jobTitle) ? "d'" : 'de';
    }

    /**
     * Gets the formatted apply position text with proper French grammar
     * @returns The formatted text for applying to a position
     */
    getApplyPositionText(): string {
        const currentLang = this.translate.currentLang || 'en';

        if (currentLang === 'fr' && this.currentJobOffer?.title) {
            const preposition = this.getFrenchPreposition(
                this.currentJobOffer.title,
            );
            return `Postuler pour le poste ${preposition}`;
        }

        return this.translate.instant(
            'CandidateApplication.CandidateForm.ApplyForPosition',
        );
    }

    onDepartmentSelection(dptNum?: string) {
        if (!this.candidateApplication.candidateDepartments) {
            this.candidateApplication.candidateDepartments = [];
        }

        if (!dptNum) {
            dptNum = this.selectedDepartment?.num;
        }

        if (!dptNum) {
            return;
        }

        const index = this.candidateApplication.candidateDepartments.findIndex(
            (x) => x.department === dptNum,
        );

        if (index !== -1) {
            return;
        }

        this.candidateApplication.candidateDepartments.push({
            candidateId: this.candidateApplication.id,
            department: dptNum,
        });

        this.selectedDepartment = null;
        this.departmentsAutocompleteComponent?.clear();
    }

    clickCandidatureSpontanee() {
        if (this.candidateApplication) {
            this.candidateApplication.spontaneousApplication = true;
        }

        this.step = 1;
    }

    async onCountryChange() {
        // Check if USA is selected
        if (this.candidateApplication?.address?.country === 'US') {
            // If already accepted, don't show dialog again
            if (this.usTermsAccepted) {
                this.countryFieldFilled = true;
                return;
            }

            // Show US terms dialog
            const dialogRef = this.dialog.open(UsTermsDialogComponent, {
                width: '90vw',
                maxWidth: '600px',
                disableClose: true,
            });

            const accepted = await dialogRef.afterClosed().toPromise();

            if (accepted) {
                // User accepted terms
                this.usTermsAccepted = true;
                this.countryFieldFilled = true;
                this.acceptCG = true; // Mark general terms as accepted for US candidates

                // Store acceptance timestamp and version
                this.candidateApplication.usTermsAcceptedAt = new Date();
                this.candidateApplication.usTermsVersion = US_TERMS_VERSION;
            } else {
                // User declined - reset country selection
                this.usTermsAccepted = false;
                this.countryFieldFilled = false;
                this.acceptCG = false;
                this.candidateApplication.address.country = null;
                this.candidateApplication.usTermsAcceptedAt = null;
                this.candidateApplication.usTermsVersion = null;

                // Show message to user
                this.dialogService.showDialog(
                    this.translate.instant('CandidateApplication.CandidateForm.MustAcceptTermsToApply') ||
                    'You must accept the terms and conditions to apply for positions in the United States.'
                );
            }
        } else {
            // Not USA, proceed normally
            this.countryFieldFilled = this.candidateApplication?.address?.country != null;
            this.usTermsAccepted = false;
            this.acceptCG = false; // Reset acceptCG when switching from US to another country
            this.candidateApplication.usTermsAcceptedAt = null;
            this.candidateApplication.usTermsVersion = null;
        }
    }
}
