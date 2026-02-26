import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { List } from 'linqts';
import { DialogService } from 'nextalys-angular-tools';
import {
    FileUploadData,
    FileUploadOptions,
} from 'nextalys-file-upload';
import { DateHelpers, MainHelpers } from 'nextalys-js-helpers';
import { Subject } from 'rxjs';
import { ImagesHelper } from '../../../../shared/images.helper';
import { IntlLanguage, RefData } from '../../../../shared/ref-data';
import {
    AppTypes,
    CandidateSection,
    JobHousedEnum,
} from '../../../../shared/shared-constants';
import {
    SharedCountryService,
    SharedService,
} from '../../../../shared/shared-service';
import { environment } from '../../environments/environment';
import { BasePageComponent } from '../../pages/base/base-page.component';
import {
    AddressDto,
    AppFileDto,
    AppValueDto,
    CandidateAllergiesEnum,
    CandidateChildrenDto,
    CandidateCountryDto,
    CandidateDepartmentDto,
    CandidateDto,
    CandidateLanguageDto,
    CandidateLicenceDto,
    CandidatePetDto,
    CandidatesService,
    NoteItemDto,
    NoteItemFileDto,
    UserDto,
    UsersService,
} from '../../providers/api-client.generated';
import { GoogleTranslateService } from '../../providers/api-client.generated/api/googleTranslate.service';
import { LanguageProvider } from '../../providers/language.provider';
import { ReferentialProvider } from '../../providers/referential.provider';
import { Department } from '../../services/geo.service';
import {
    BigImageDialogComponent,
    BigImageDialogData,
} from '../big-image-dialog/big-image-dialog.component';
import { DepartmentsAutocompleteComponent } from '../departments-autocomplete/departments-autocomplete.component';

export interface NoteFileUploadWrapper {
    noteItemId: string;
    fileUploadOptions: FileUploadOptions;
    fileUploadData: FileUploadData;
    existingFiles: NoteItemFileDto[];
}

@Component({
    selector: 'candidate-informations-component',
    templateUrl: './candidate-informations.component.html',
    styleUrls: [
        '../../pages/base/edit-page-style.scss',
        './candidate-informations.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class CandidateInformationsComponent extends BasePageComponent {
    entity: CandidateDto;
    firstAddress: AddressDto;
    countriesSelectedCodes: string[];
    selectedDepartment: Department;
    notesToDisplay: NoteItemDto[];
    genderList: AppValueDto[];
    relationshipStatusList: AppValueDto[];
    jobList: AppValueDto[];
    licencesList: AppValueDto[];
    contractTypes: AppValueDto[];
    levelLanguageList: AppValueDto[];
    candidateComment: string;
    jobReferenceFunctions: AppValueDto[];
    selectedContractTypesIds: string[];
    hasNoLicenceDriver: boolean;
    currentEditNote: NoteItemDto;
    editModes: CandidateSection = {
        informations: false,
        complement: false,
        contact: false,
        location: false,
        documents: false,
        conditions: false,
        jobs: false,
        notes: false,
        consultant: false,
        currentJobs: false,
        skills: false,
    };

    RefData = RefData;
    languagesList = RefData.languages;
    DateHelpers = DateHelpers;

    licenceChecked: AppValueDto[] = [];
    tempLanguagesList: IntlLanguage[] = [];
    consultantList: UserDto[] = [];
    selectedCurrentJobIds: string[] = [];
    candidateLanguages: CandidateLanguageDto[] = [];
    partnerCandidateLangues: CandidateLanguageDto[] = [];
    countriesSelected: { code: string; label: string }[] = [];
    JobHousedEnum: string[] = Object.values(JobHousedEnum);

    isEditingNotes = false;
    addNewNote = false;
    isNew = false;
    private notesGroupCount = 3;
    inputText: string = '';
    translatedText: string = '';
    SharedService = SharedService;
    ImageHelpers = ImagesHelper;
    CandidateAllergiesEnum = CandidateAllergiesEnum;
    SharedCountryService = SharedCountryService;

    // Note file upload properties
    noteFileUploadWrappers: Map<string, NoteFileUploadWrapper> = new Map();
    newNoteFileUploadOptions: FileUploadOptions;
    newNoteFileUploadData: FileUploadData;
    newNoteUploadedFiles: {
        file: { name: string; mimeType: string };
        physicalName: string;
    }[] = [];
    environment = environment;

    // Resume upload for new candidate
    resumeUploadData: FileUploadData = {};
    resumeUploadOptions: FileUploadOptions;
    resumeFileUploaded = false;

    @Input() isMyDossier = false;
    @Input() showNotes: boolean;
    @Input() showConditions: boolean;
    @Input() showLanguage: boolean;
    @Input() showConsultant: boolean;
    @Input('entity') set setEntity(value: CandidateDto) {
        this.entity = value;
        this.setNoteToDisplay();
    }
    @Input('isNew') set setIsNew(v: boolean) {
        if (v) {
            this.editModes.informations = true;
            this.editModes.contact = true;
            this.editModes.skills = true;
            this.editModes.consultant = true;
            this.editModes.currentJobs = true;
            this.editModes.conditions = true;
            this.entity.note = 0;
            this.initResumeUpload();
        }
        this.isNew = v;
    }

    @ViewChild(DepartmentsAutocompleteComponent)
    departmentsAutocompleteComponent: DepartmentsAutocompleteComponent;

    @Output() onSave = new EventEmitter<void>();
    @Output() onModification = new EventEmitter<boolean>();

    constructor(
        private referentialProvider: ReferentialProvider,
        private dialogService: DialogService,
        private userService: UsersService,
        private translate: TranslateService,
        private candidatesService: CandidatesService,
        private googleTranslateService: GoogleTranslateService,
    ) {
        super();
        //this.init();
    }

    ngOnInit() {
        this.init();
    }

    getLanguageCode() {
        return LanguageProvider.currentLanguageCode;
    }

    async init() {
        const appTypes = await this.referentialProvider.getTypesValues(
            [
                AppTypes.ContractTypeCode,
                AppTypes.PersonGenderCode,
                AppTypes.RelationshipStatusCode,
                // AppTypes.JobCategoryCode,
                AppTypes.CandidateStatusCode,
                AppTypes.LicenceTypeCode,
                AppTypes.CandidateFileType,
                AppTypes.LevelLanguageCode,
                AppTypes.JobReferenceFunctionCode,
            ],
            true,
        );

        if (
            this.GlobalAppService.userHasOneOfRoles(
                this.AuthDataService.currentUser,
                [
                    this.RolesList.Consultant,
                    this.RolesList.Admin,
                    this.RolesList.AdminTech,
                    this.RolesList.RH,
                ],
            )
        ) {
            const consultantResponse =
                await this.GlobalAppService.getConsultantOrRHList(
                    this.userService,
                    this,
                );

            if (consultantResponse.success) {
                this.consultantList = consultantResponse.users;
            }
        }

        this.genderList = appTypes.find(
            (x) => x.code === AppTypes.PersonGenderCode,
        ).appValues;
        this.relationshipStatusList = appTypes.find(
            (x) => x.code === AppTypes.RelationshipStatusCode,
        ).appValues;
        // this.jobList = appTypes.find(x => x.code === AppTypes.JobCategoryCode).appValues;
        this.licencesList = appTypes
            .find((x) => x.code === AppTypes.LicenceTypeCode)
            ?.appValues?.sort((a, b) => a.order - b.order);
        this.contractTypes = appTypes.find(
            (x) => x.code === AppTypes.ContractTypeCode,
        ).appValues;
        this.levelLanguageList = appTypes
            .find((x) => x.code === AppTypes.LevelLanguageCode)
            ?.appValues?.sort((a, b) => a.order - b.order);
        this.tempLanguagesList = MainHelpers.cloneObject(this.languagesList);
        this.languagesList = RefData.languages;
        const tempJobReferenceFunctions = appTypes.find(
            (x) => x.code === AppTypes.JobReferenceFunctionCode,
        ).appValues;
        this.jobReferenceFunctions = tempJobReferenceFunctions.sort(
            (a, b) => a.order - b.order,
        );
        this.reloadLanguages();
        this.countriesSelected = RefData.countriesListForCurrentLanguage.filter(
            (x) =>
                this.entity.candidateCountries?.some(
                    (y) => y.country === x.code,
                ),
        );
        this.countriesSelectedCodes = this.countriesSelected.map((x) =>
            x.code.toLowerCase(),
        );

        // console.log("🚀 ~ CandidateInformationsComponent ~ init ~ this.entity", this.entity);
        if (this.entity.candidateLicences) {
            // for (const candidateLicence of this.entity.candidateLicences) {
            //     const licenceIndex = this.licencesList.findIndex(x => x.code === candidateLicence.licence?.code);
            //     if (licenceIndex !== -1) {
            //         const elem = this.licencesList.find(x => x.id === candidateLicence.licenceId);
            //         this.licenceChecked.push(elem);
            //     }
            // }
        }

        if (this.entity.candidateContracts?.length) {
            this.selectedContractTypesIds = this.entity.candidateContracts.map(
                (x) => x.contractTypeId,
            );
        }

        this.setNoteToDisplay();

        if (this.entity.hasLicenceDriver !== undefined) {
            this.hasNoLicenceDriver = !this.entity.hasLicenceDriver;
        }

        if (this.entity.candidateCurrentJobs) {
            for (const currentJob of this.entity.candidateCurrentJobs) {
                this.selectedCurrentJobIds.push(currentJob.currentJobId);
            }
        }

        this.candidateLanguages =
            this.entity.candidateLanguages?.filter(
                (x) => !x.isPartnerLanguage,
            ) || [];
        this.partnerCandidateLangues =
            this.entity.candidateLanguages?.filter(
                (x) => x.isPartnerLanguage,
            ) || [];

        if (this.entity && !this.entity.addresses?.length) {
            this.entity.addresses = [{} as AddressDto];
        }

        this.firstAddress = this.entity.addresses[0] || {};
    }

    isUsCountry() {
        return this.entity?.addresses?.[0]?.country === 'US';
    }

    public getCountryFromCode(code: string) {
        if (!code) {
            return;
        }

        return RefData.getCountryLabel(code);
    }

    compareFn(a: CandidateCountryDto, b: CandidateCountryDto) {
        return a && b ? a.id === b.id : a === b;
    }

    beforeSaveCheck() {
        console.log(this.entity);
        const errors: string[] = [];

        this.entity.candidateLanguages = [
            ...this.candidateLanguages,
            ...this.partnerCandidateLangues,
        ];
        // console.log('🚀 ~ beforeSaveCheck ~ this.entity.candidateLanguages', this.entity.candidateLanguages);

        if (this.entity) {
            if (this.editModes.informations) {
                if (!this.entity.lastName) {
                    errors.push(
                        this.translate.instant('ErrorsCandidate.NameUndefined'),
                    );
                }

                if (!this.entity.firstName) {
                    errors.push(
                        this.translate.instant(
                            'ErrorsCandidate.FirstNameUndefined',
                        ),
                    );
                }

                // if (
                //     !this.entity.birthDate &&
                //     SharedCountryService.showCandidateDetailFields(this.entity)
                // ) {
                //     errors.push(
                //         this.translate.instant(
                //             'ErrorsCandidate.BirthDateUndefined',
                //         ),
                //     );
                // }

                // if (
                //     !this.entity.genderId &&
                //     SharedCountryService.showCandidateDetailFields(this.entity)
                // ) {
                //     errors.push(
                //         this.translate.instant(
                //             'ErrorsCandidate.GenderUndefined',
                //         ),
                //     );
                // }

                // if (
                //     !this.entity.relationshipStatusId &&
                //     SharedCountryService.showCandidateDetailFields(this.entity)
                // ) {
                //     errors.push(
                //         this.translate.instant(
                //             'ErrorsCandidate.RelationshipUndefined',
                //         ),
                //     );
                // }

                // if (
                //     !this.entity.nationality &&
                //     SharedCountryService.showCandidateDetailFields(this.entity)
                // ) {
                //     errors.push(
                //         this.translate.instant(
                //             'ErrorsCandidate.NationalityUndefined',
                //         ),
                //     );
                // }

                if (this.isUsCountry()) {
                    if (this.entity.allowed_to_work_us == null) {
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

                    if (this.entity.require_sponsorship_us == null) {
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
            }

            if (this.isNew && this.selectedCurrentJobIds.length === 0) {
                errors.push(
                    this.translate.instant(
                        'ErrorsCandidate.CurrentJobUndefined',
                    ),
                );
            }

            if (this.isNew && !this.resumeUploadData?.fileItems?.length) {
                errors.push(
                    this.translate.instant('ErrorsCandidate.CVMandatory'),
                );
            }

            if (this.editModes.location && !this.isNew) {
                if (this.entity.addresses && this.entity.addresses.length) {
                    this.entity.addresses.forEach((x) => {
                        if (!x.lineOne) {
                            errors.push(
                                this.translate.instant(
                                    'AddressErrors.LineUndefined',
                                ),
                            );
                        }

                        if (!x.postalCode) {
                            errors.push(
                                this.translate.instant(
                                    'AddressErrors.PostalCodeUndefined',
                                ),
                            );
                        }

                        if (!x.city) {
                            errors.push(
                                this.translate.instant(
                                    'AddressErrors.CityUndefined',
                                ),
                            );
                        }

                        if (!x.country) {
                            errors.push(
                                this.translate.instant(
                                    'AddressErrors.CountryUndefined',
                                ),
                            );
                        }

                        if (!x.department) {
                            errors.push(
                                this.translate.instant(
                                    'AddressErrors.StateUndefined',
                                ),
                            );
                        }
                    });
                }
            }

            if (this.editModes.complement) {
                if (
                    this.entity.candidateChildrens &&
                    this.entity.candidateChildrens.length &&
                    !this.entity.hasNoChildren
                ) {
                    this.entity.candidateChildrens.forEach((x) => {
                        if (!x.age) {
                            errors.push(
                                this.translate.instant(
                                    'ErrorsCandidate.ChildAgeUndefined',
                                ),
                            );
                        }
                    });
                }

                if (this.entity.hasNoChildren) {
                    this.entity.candidateChildrens = [];
                }

                if (this.entity.animal) {
                    this.entity.candidatePets = [];
                }

                if (
                    this.entity.candidatePets &&
                    this.entity.candidatePets.length &&
                    this.entity.animal
                ) {
                    this.entity.candidatePets.forEach((x) => {
                        if (!x.type && !x.type) {
                            errors.push(
                                this.translate.instant(
                                    'ErrorsCandidate.PetsQuantityTypeUndefined',
                                ),
                            );
                        }
                    });
                }
            }

            if (this.editModes.contact) {
                if (!SharedService.isValidEmail(this.entity.email)) {
                    errors.push(
                        this.translate.instant(
                            'ErrorsCandidate.EmailNotFormat',
                        ),
                    );
                }

                if (!this.entity.phone) {
                    errors.push(
                        this.translate.instant(
                            'ErrorsCandidate.PhoneUndefined',
                        ),
                    );
                }
            }

            if (this.editModes.language) {
                if (this.entity.candidateLanguages?.length) {
                    this.entity.candidateLanguages.forEach((x) => {
                        if (!x.languageCode) {
                            errors.push(
                                this.translate.instant(
                                    'ErrorsCandidate.LanguageUndefined',
                                ),
                            );
                        }

                        if (!x.levelLanguageId) {
                            errors.push(
                                this.translate.instant(
                                    'ErrorsCandidate.LevelLanguageUndefined',
                                ),
                            );
                        }
                    });
                }
            }

            if (this.editModes.jobs) {
                if (this.entity.candidateJobs?.length) {
                    this.entity.candidateJobs.forEach((x) => {
                        if (!x.jobId) {
                            errors.push(
                                this.translate.instant(
                                    'ErrorsCandidate.JobUndefined',
                                ),
                            );
                        }
                    });
                }
            }
        }

        if (this.candidateComment) {
            if (!this.entity.noteItems) {
                this.entity.noteItems = [];
            }

            this.entity.noteItems.push({
                candidateId: this.entity.id,
                consultantId: this.AuthDataService.currentUser.id,
                content: this.candidateComment,
                modifDate: new Date(),
            });
        }

        if (this.countriesSelected?.length) {
            this.entity.candidateCountries = this.countriesSelected.map(
                (x) => ({ country: x.code }),
            );
        } else {
            this.entity.candidateCountries = [];
        }

        this.candidateComment = null;

        return errors;
    }

    canLookMore() {
        return this.entity.noteItems?.length > this.notesToDisplay?.length;
    }

    lookMore() {
        const currentIndex = this.notesToDisplay.length;
        const nbToLoad = this.notesGroupCount;

        for (let i = 0; i < nbToLoad; i++) {
            if (this.entity.noteItems[currentIndex + i])
                this.notesToDisplay.push(
                    this.entity.noteItems[currentIndex + i],
                );
        }

        // this.notesToDisplay.forEach((note) => {
        //     note.showOriginal = true;
        // });
    }

    getCountriesMobility(): string {
        if (!this.entity.candidateCountries?.length) {
            return this.translate.instant('Global.NotInformed');
        }

        const countries = RefData.orderCandidateCountries(this.entity);

        return countries.map((x) => x.label).join(', ');
    }

    onEditClick(key: keyof CandidateSection) {
        this.addNewNote = false;
        this.isEditingNotes = false;

        if (this.editModes[key]) {
            if (!this.hasPendingModifications) {
                this.editModes[key] = false;

                return;
            }

            const errors = this.beforeSaveCheck();

            if (!errors.length) {
                // console.log("🚀 ~ CandidateInformationsComponent ~ onEditClick ~ this.entity", this.entity);
                this.mapCandidateContracts();
                this.onSave.emit();
                this.afterSaveSended();

                for (const keyMode in this.editModes) {
                    this.editModes[keyMode as keyof CandidateSection] = false;
                }
            } else {
                this.dialogService.showDialog(
                    this.translate.instant('Errors.ErrorList') +
                        '<ul>' +
                        errors.map((x) => (x = '<li>' + x + '</li>')).join('') +
                        '</ul>',
                );
            }
        } else {
            this.editModes[key] = true;
        }
    }

    addCandidateChildren() {
        if (!this.entity.candidateChildrens) {
            this.entity.candidateChildrens = [];
        }

        const length = this.entity.candidateChildrens.length;

        this.entity.candidateChildrens.push({ childNumber: length + 1 });
        this.emitModification();
    }

    removeChild(item: CandidateChildrenDto) {
        if (!item) {
            return;
        }

        const index = this.entity.candidateChildrens.indexOf(item);
        if (index !== -1) {
            this.entity.candidateChildrens.splice(index, 1);
        }

        this.emitModification();
    }

    addCandidatePet() {
        if (!this.entity.candidatePets) {
            this.entity.candidatePets = [];
        }

        const length = new List(this.entity.candidatePets).Max();
        this.entity.candidatePets.push({ petNumber: length + 1 });
        this.emitModification();
    }

    removeCandidatePet(pet: CandidatePetDto) {
        if (!pet) {
            return;
        }

        const index = this.entity.candidatePets.indexOf(pet);

        if (index !== -1) {
            this.entity.candidatePets.splice(index, 1);
        }

        this.emitModification();
    }

    addCandidateLicence() {
        if (!this.entity.candidateLicences) {
            this.entity.candidateLicences = [];
        }

        this.entity.candidateLicences.push({ candidateId: this.entity.id });
        this.emitModification();
    }

    removeCandidateLicence(licence: CandidateLicenceDto) {
        if (!licence) {
            return;
        }

        const index = this.entity.candidateLicences.indexOf(licence);
        if (index !== -1) {
            this.entity.candidateLicences.splice(index, 1);
        }

        this.emitModification();
    }

    addNote() {
        this.addNewNote = true;
        this.candidateComment = null;
        this.initNewNoteFileUpload();
    }

    confirmNewNote() {
        if (!this.candidateComment) {
            return;
        }

        // Create new note with pending files
        const newNote: NoteItemDto = {
            consultantId: this.AuthDataService.currentUser.id,
            content: this.candidateComment,
            files: this.newNoteUploadedFiles.map((f) => ({
                file: {
                    physicalName: f.physicalName,
                    name: f.file.name,
                    mimeType: f.file.mimeType || 'application/octet-stream',
                },
            })),
        };

        this.entity.noteItems.push(newNote);
        this.cancelNewNote();
        this.onSave.emit();
        this.setNoteToDisplay();
    }

    cancelNewNote() {
        this.candidateComment = null;
        this.addNewNote = false;
        this.newNoteUploadedFiles = [];
    }

    onMainCountryChange() {
        this.emitModification(true);
        this.editModes.location = true;
    }

    updateNote() {
        this.currentEditNote.content = this.candidateComment;
        const index = this.entity.noteItems.findIndex(
            (x) => x.id === this.currentEditNote.id,
        );
        if (index !== -1) {
            this.entity.noteItems[index].content = this.currentEditNote.content;
        }

        this.currentEditNote = null;
        this.editModes.notes = false;
        this.isEditingNotes = false;
        this.candidateComment = null;
        this.onSave.emit();
        this.setNoteToDisplay();
    }

    editSelectedNote(note: NoteItemDto) {
        this.currentEditNote = note;
        this.editModes.notes = true;
        this.isEditingNotes = true;
        this.addNewNote = false;
        this.candidateComment = this.currentEditNote.content;
    }

    async deleteNote(id: string) {
        if (!id) {
            return;
        }

        const dialog = await this.dialogService.showConfirmDialog(
            this.translate.instant('Experience.DialogRemove'),
        );

        if (dialog.cancelClicked) {
            return;
        }

        const indexToRemove = this.entity.noteItems.findIndex(
            (x) => x.id === id,
        );

        if (indexToRemove !== -1) {
            this.entity.noteItems.splice(indexToRemove, 1);
            this.emitModification();
            this.onSave.emit();
        }
    }

    addAddress() {
        this.loading = true;

        if (this.entity.addresses?.length) {
            this.entity.addresses = [];
        }

        this.entity.addresses.push({} as any);

        this.loading = false;
    }

    addAdditionalEmail() {
        if (!this.entity.additionalEmails) {
            this.entity.additionalEmails = [];
        }
        this.entity.additionalEmails.push('');
        this.emitModification();
    }

    removeAdditionalEmail(index: number) {
        this.entity.additionalEmails.splice(index, 1);
        this.emitModification();
    }

    trackByIndex(index: number) {
        return index;
    }

    joinCandidateLicenceToDisplay(list: CandidateLicenceDto[]) {
        if (!list.length) {
            return;
        }

        const stringArray = [];

        for (const licence of list) {
            stringArray.push(licence.licence?.label);
        }

        const listToReturn = stringArray.join(', ');

        return listToReturn;
    }

    joinCandidateLicenceWithCountryToDisplay(list: CandidateLicenceDto[]) {
        if (!list.length) {
            return;
        }

        const stringArray = [];

        for (const licence of list) {
            stringArray.push(
                licence.licence?.label +
                    ' : ' +
                    RefData.getCountryLabel(licence.countryCode),
            );
        }

        const listToReturn = stringArray.join('<br />');

        return listToReturn;
    }

    logger() {
        console.log(this.entity);
    }

    private afterSaveSended() {
        this.setNoteToDisplay();
    }

    private setNoteToDisplay() {
        if (this.entity.noteItems) {
            this.notesToDisplay = MainHelpers.cloneObject(
                this.entity.noteItems,
            );

            if (this.entity.noteItems.length > this.notesGroupCount) {
                this.notesToDisplay = this.entity.noteItems.slice(
                    0,
                    this.notesGroupCount,
                );
            }

            // Initialize file upload wrappers for existing notes
            for (const note of this.notesToDisplay) {
                if (note.id) {
                    this.initNoteFileUpload(note);
                }
            }
        }
    }

    private reloadLanguages() {
        if (!this.tempLanguagesList?.length) {
            this.tempLanguagesList = [];
        }

        this.tempLanguagesList = this.languagesList.filter(
            (x) =>
                !this.entity.candidateLanguages?.some(
                    (y) => y.languageCode === x.code,
                ),
        );
    }

    isPageBlocEditable(pageBloc: string) {
        if (
            this.GlobalAppService.userHasOneOfRoles(
                this.AuthDataService.currentUser,
                [
                    this.RolesList.RH,
                    this.RolesList.Admin,
                    this.RolesList.AdminTech,
                    this.RolesList.Consultant,
                ],
            )
        ) {
            return true;
        }

        if (!this.entity.candidateReadonlyProperties?.length) {
            return true;
        }

        return !this.entity.candidateReadonlyProperties
            .map((x) => x.candidateReadonlyField)
            .includes(pageBloc);
    }

    getConsultantName(consultantId: string) {
        return (
            this.consultantList?.find((x) => x.id === consultantId)?.firstName +
                ' ' +
                this.consultantList.find((x) => x.id === consultantId)
                    ?.lastName || ''
        );
    }

    emitModification(hasPendingModification = true) {
        // console.log(this.entity);

        this.hasPendingModifications = hasPendingModification;
        this.onModification.emit(this.hasPendingModifications);
    }

    private mapCandidateContracts() {
        if (!this.selectedContractTypesIds?.length) {
            this.entity.candidateContracts = [];
            return;
        }

        this.entity.candidateContracts = [];

        for (const item of this.selectedContractTypesIds) {
            this.entity.candidateContracts.push({ contractTypeId: item });
        }
    }

    hasNoLicenceDriverChange() {
        if (this.hasNoLicenceDriver !== undefined) {
            this.entity.hasLicenceDriver = !this.hasNoLicenceDriver;
        } else {
            this.entity.hasLicenceDriver = undefined;
        }

        if (!this.entity.hasLicenceDriver) {
            this.licenceChecked = [];
        }

        this.emitModification();
    }

    onHasNoChildrenChange() {
        // If the candidate changes from having children to not having children,
        // automatically reset dependent children to null
        // Note: hasNoChildren = true means they HAVE children, hasNoChildren = false means they DON'T have children
        console.log(
            'onHasNoChildrenChange called, hasNoChildren:',
            this.entity.hasNoChildren,
        );
        console.log('dependentChildren before:', this.entity.dependentChildren);

        if (!this.entity.hasNoChildren) {
            // If hasNoChildren is false, it means they DON'T have children, so clear dependent children
            this.entity.dependentChildren = null;
            console.log('Cleared dependentChildren to null');
        }

        console.log('dependentChildren after:', this.entity.dependentChildren);
        this.emitModification();
    }

    onGlobalMobilityChange() {
        // If globalMobility is true (No mobility), clear the selected countries
        // Note: globalMobility = true means NO mobility, globalMobility = false means YES mobility
        console.log(
            'onGlobalMobilityChange called, globalMobility:',
            this.entity.globalMobility,
        );

        if (this.entity.globalMobility) {
            // If globalMobility is true, it means they DON'T want mobility, so clear selected countries
            this.countriesSelected = [];
            this.countriesSelectedCodes = [];
            this.entity.candidateCountries = [];
            console.log('Cleared countries selection due to no mobility');
        }

        this.emitModification();
    }

    onCurrentJobsChange() {
        if (!this.entity.candidateCurrentJobs?.length) {
            this.entity.candidateCurrentJobs = [];
        }

        this.entity.candidateCurrentJobs = this.selectedCurrentJobIds.map(
            (x) => ({
                candidateId: this.entity.id,
                currentJobId: x,
            }),
        );
        this.emitModification();
    }

    onLockPageBlock(pageBlockName: string) {
        if (!this.entity.candidateReadonlyProperties?.length) {
            this.entity.candidateReadonlyProperties = [];
        }

        const indexIfExist = this.entity.candidateReadonlyProperties.findIndex(
            (x) => x.candidateReadonlyField === pageBlockName,
        );

        if (indexIfExist > -1) {
            this.entity.candidateReadonlyProperties.splice(indexIfExist, 1);
        } else {
            this.entity.candidateReadonlyProperties.push({
                candidateReadonlyField: pageBlockName,
            });
        }

        this.emitModification();
        this.onSave.emit();
    }

    isPageLock(editKeyMode: string) {
        if (!this.entity.candidateReadonlyProperties?.length) {
            return false;
        }

        return this.entity.candidateReadonlyProperties
            .map((x) => x.candidateReadonlyField)
            .includes(editKeyMode);
    }

    getCandidateAllergyLabel() {
        switch (this.entity.allergy) {
            case CandidateAllergiesEnum.AnyAllergiesCandidateAllergies:
                return this.translate.instant('Candidate.AnyAllergies');
            case CandidateAllergiesEnum.CatCandidateAllergies:
                return this.translate.instant('Candidate.Cat');
            case CandidateAllergiesEnum.DogCandidateAllergies:
                return this.translate.instant('Candidate.Dog');
            case CandidateAllergiesEnum.DogAndCatCandidateAllergies:
                return this.translate.instant('Candidate.DogAndCat');
        }
    }

    setCountriesSelectedCodes(): void {
        if (!this.countriesSelected?.length) {
            return;
        }

        this.countriesSelectedCodes = this.countriesSelected.map((x) =>
            x.code.toLowerCase(),
        );
    }

    onDepartmentSelection(dptNum?: string) {
        if (!this.entity.candidateDepartments) {
            this.entity.candidateDepartments = [];
        }

        if (!dptNum) {
            dptNum = this.selectedDepartment?.num;
        }

        if (!dptNum) {
            return;
        }

        const index = this.entity.candidateDepartments.findIndex(
            (x) => x.department === dptNum,
        );

        if (index !== -1) {
            return;
        }

        this.emitModification();
        this.entity.candidateDepartments.push({
            candidateId: this.entity.id,
            department: dptNum,
        });
        this.selectedDepartment = null;
        this.departmentsAutocompleteComponent?.clear();
        // this.setTimeout(() => {
        //     this.selectedDepartment = null;
        // }, 300);
    }

    removeCandidateDepartment(candidateDepartment: CandidateDepartmentDto) {
        if (!this.entity.candidateDepartments) {
            return;
        }

        const index = this.entity.candidateDepartments.findIndex(
            (x) => x === candidateDepartment,
        );

        if (index !== -1) {
            this.entity.candidateDepartments.splice(index, 1);
            this.emitModification();
        }
    }

    translateText(note: NoteItemDto) {
        if (note.content) {
            const data = {
                text: note.content,
            };

            this.googleTranslateService.translate(data).subscribe(
                (response) => {
                    // note.translatedNote =
                    //     response.translations[0].translatedText;
                    // note.showOriginal = false;
                },
                (error) => {
                    console.error('Error translating text', error);
                },
            );
        }
    }

    showOrignal(note: NoteItemDto) {
        // note.showOriginal = true;
    }

    // Note file upload methods
    initNoteFileUpload(note: NoteItemDto) {
        if (!note?.id || this.noteFileUploadWrappers.has(note.id)) {
            return;
        }

        const fileUploadData: FileUploadData = {};

        const fileUploadOptions: FileUploadOptions = {
            controller: {
                openFilePicker: new Subject(),
                reset: new Subject(),
            },
            allowedFileTypes: ['pdf', 'image', 'doc'],
            maxWidth: 1200,
            maxWidthForThumbnails: 90,
            filesCount: 10,
        };

        this.noteFileUploadWrappers.set(note.id, {
            noteItemId: note.id,
            fileUploadOptions,
            fileUploadData,
            existingFiles: note.files || [],
        });
    }

    getNoteFileUploadWrapper(noteId: string): NoteFileUploadWrapper | undefined {
        return this.noteFileUploadWrappers.get(noteId);
    }

    openNoteFilePicker(noteId: string) {
        const wrapper = this.noteFileUploadWrappers.get(noteId);
        wrapper?.fileUploadOptions?.controller?.reset?.next();
        wrapper?.fileUploadOptions?.controller?.openFilePicker?.next();
    }

    openNewNoteFilePicker() {
        this.newNoteFileUploadOptions?.controller?.reset?.next();
        this.newNoteFileUploadOptions?.controller?.openFilePicker?.next();
    }

    // Resume upload methods for new candidate
    initResumeUpload() {
        this.resumeUploadData = {};
        this.resumeFileUploaded = false;

        this.resumeUploadOptions = {
            controller: {
                openFilePicker: new Subject(),
                reset: new Subject(),
            },
            allowedFileTypes: ['pdf', 'image', 'doc'],
            maxWidth: 1200,
            maxWidthForThumbnails: 90,
            filesCount: 1,
        };
    }

    openResumeFilePicker() {
        this.resumeUploadOptions?.controller?.reset?.next();
        this.resumeUploadOptions?.controller?.openFilePicker?.next();
    }

    onResumeUploadComplete(evtData: any) {
        if (this.resumeUploadData?.fileItems?.length) {
            this.resumeFileUploaded = true;
            this.emitModification();
        }
    }

    getUploadedResumeFile(): { physicalName: string; name: string; mimeType: string } | null {
        if (!this.resumeUploadData?.fileItems?.length) {
            return null;
        }
        const uploadedFile = this.resumeUploadData.fileItems[0];
        return {
            physicalName: uploadedFile.file?.name,
            name: uploadedFile.file?.name,
            mimeType: uploadedFile.file?.type || 'application/octet-stream',
        };
    }

    initNewNoteFileUpload() {
        this.newNoteFileUploadData = {};

        this.newNoteFileUploadOptions = {
            controller: {
                openFilePicker: new Subject(),
                reset: new Subject(),
            },
            allowedFileTypes: ['pdf', 'image', 'doc'],
            maxWidth: 1200,
            maxWidthForThumbnails: 90,
            filesCount: 10,
        };

        this.newNoteUploadedFiles = [];
    }

    async onNoteFileUploadComplete(evtData: any, noteId: string) {
        const wrapper = this.noteFileUploadWrappers.get(noteId);
        if (!wrapper?.fileUploadData?.fileItems?.length) {
            return;
        }

        const uploadedFile = wrapper.fileUploadData.fileItems[0];
        const fileDto: NoteItemFileDto = {
            noteItemId: noteId,
            file: {
                physicalName: uploadedFile.file?.name,
                name: uploadedFile.file?.name,
                mimeType: uploadedFile.file?.type || 'application/octet-stream',
            },
        };

        this.loading = true;
        try {
            const response = await this.candidatesService
                .saveNoteItemFile({ noteItemId: noteId, noteItemFileDto: fileDto })
                .toPromise();

            if (response.success) {
                // Refresh the note to get updated files
                const note = this.entity.noteItems?.find((n) => n.id === noteId);
                if (note) {
                    note.files = note.files || [];
                    note.files.push(fileDto);
                    wrapper.existingFiles = note.files;
                }
                this.dialogService.showSnackBar(
                    this.translate.instant('Global.FileSaved'),
                );
            } else {
                this.dialogService.showDialog(response.message);
            }
        } catch (error) {
            console.error('Error saving note file:', error);
            this.dialogService.showDialog(
                this.translate.instant('Global.Error'),
            );
        }
        this.loading = false;
        // Clear the file items after processing
        wrapper.fileUploadData.fileItems = [];
    }

    async onNewNoteFileUploadComplete(evtData: any) {
        if (!this.newNoteFileUploadData?.fileItems?.length) {
            return;
        }

        const uploadedFile =
            this.newNoteFileUploadData.fileItems[
                this.newNoteFileUploadData.fileItems.length - 1
            ];
        this.newNoteUploadedFiles.push({
            file: {
                name: uploadedFile.file?.name,
                mimeType: uploadedFile.file?.type || 'application/octet-stream',
            },
            physicalName: uploadedFile.file?.name,
        });
    }

    async deleteNoteFile(noteId: string, noteFileId: string) {
        const dialog = await this.dialogService.showConfirmDialog(
            this.translate.instant('Global.ConfirmDelete'),
        );

        if (dialog.cancelClicked) {
            return;
        }

        this.loading = true;
        try {
            const response = await this.candidatesService
                .deleteNoteItemFile({ noteItemFileId: noteFileId })
                .toPromise();

            if (response.success) {
                // Remove from local state
                const wrapper = this.noteFileUploadWrappers.get(noteId);
                if (wrapper) {
                    wrapper.existingFiles = wrapper.existingFiles.filter(
                        (f) => f.id !== noteFileId,
                    );
                }

                const note = this.entity.noteItems?.find((n) => n.id === noteId);
                if (note?.files) {
                    note.files = note.files.filter((f) => f.id !== noteFileId);
                }

                this.dialogService.showSnackBar(
                    this.translate.instant('Global.FileDeleted'),
                );
            } else {
                this.dialogService.showDialog(response.message);
            }
        } catch (error) {
            console.error('Error deleting note file:', error);
            this.dialogService.showDialog(
                this.translate.instant('Global.Error'),
            );
        }
        this.loading = false;
    }

    removeNewNoteFile(index: number) {
        this.newNoteUploadedFiles.splice(index, 1);
    }

    getFileUrl(file: NoteItemFileDto): string {
        if (file?.file?.externalFilePath && file?.file?.id) {
            return `${environment.apiBaseUrl}/api/gdrive/downloadGloudStorageFile/${file.file.id}`;
        }
        return '';
    }

    isNoteFileUploaded(file: NoteItemFileDto): boolean {
        return !!file?.file?.externalFilePath;
    }

    getUploadedNoteFiles(files: NoteItemFileDto[]): NoteItemFileDto[] {
        return files?.filter((f) => this.isNoteFileUploaded(f)) || [];
    }

    openNoteFile(file: NoteItemFileDto) {
        if (!file?.file) {
            return;
        }

        const data: BigImageDialogData = {
            file: file.file,
            useOriginalSize: true,
            candidateName:
                (this.entity?.firstName || '') +
                '_' +
                (this.entity?.lastName || ''),
            fileTypeLabel: 'Note Attachment',
        };

        this.dialogService.showCustomDialog({
            component: BigImageDialogComponent,
            data,
            exitOnClickOutside: true,
        });
    }
}
