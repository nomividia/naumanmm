import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'nextalys-angular-tools';
import {
    AddingFileFailedData,
    FileUploadData,
    FileUploadOptions,
} from 'nextalys-file-upload';
import { MainHelpers } from 'nextalys-js-helpers';
import { Subject } from 'rxjs';
import { SharedCandidatesHelpers } from '../../../../shared/candidates-helpers';
import {
    AppTypes,
    CandidateFileType,
    CandidateFileTypeMultipleWrapper,
} from '../../../../shared/shared-constants';
import { SharedService } from '../../../../shared/shared-service';
import {
    AppValueDto,
    CandidateDto,
    CandidateFileDto,
    CandidatesService,
    GetCandidateResponse,
} from '../../providers/api-client.generated';
import { ReferentialProvider } from '../../providers/referential.provider';
import { BaseComponent } from '../base/base.component';
import {
    BigImageDialogComponent,
    BigImageDialogData,
} from '../big-image-dialog/big-image-dialog.component';

interface DocumentTypeList {
    label: string;
    values: CandidateAllFilesWrapper[];
}

interface DocumentWrapper {
    profile: DocumentTypeList;
    experience: DocumentTypeList;
    etatCivil: DocumentTypeList;
    diplomes: DocumentTypeList;
    transports: DocumentTypeList;
    complements: DocumentTypeList;
}

export interface CandidateAllFilesWrapperSingleFile {
    candidateFilesOptions: FileUploadOptions;
    candidateFilesUploadData: FileUploadData;
    label?: string;
    candidateFileDto: CandidateFileDto;
    editMode?: boolean;
}

export interface CandidateAllFilesWrapper {
    fileType: AppValueDto;
    isMandatory?: boolean;
    files?: CandidateAllFilesWrapperSingleFile[];
    isMultiple: boolean;
}

@Component({
    selector: 'app-candidate-files',
    templateUrl: './candidate-files.component.html',
    styleUrls: ['./candidate-files.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CandidateFilesComponent extends BaseComponent {
    candidate: CandidateDto;
    fileTypesWrapper: DocumentWrapper;
    candidateFileTypes: AppValueDto[];

    candidateResumeId: string = null;
    isConsultantOrAdmin = false;

    @Input('candidate')
    set setCandidate(val: CandidateDto) {
        this.candidate = val;
        this.setDataFilesWrapper();
    }
    @Input()
    loading = false;

    @Output()
    filesChanged = new EventEmitter<void>();
    @Output()
    onLoading = new EventEmitter<boolean>();

    constructor(
        private referentialProvider: ReferentialProvider,
        private translate: TranslateService,
        private candidateService: CandidatesService,
        private dialogService: DialogService,
    ) {
        super();

        this.isConsultantOrAdmin = this.GlobalAppService.userHasOneOfRoles(
            this.AuthDataService.currentUser,
            [
                this.RolesList.Consultant,
                this.RolesList.Admin,
                this.RolesList.AdminTech,
                this.RolesList.RH,
            ],
        );
    }

    ngOnInit() {
        this.init();
    }

    private async init() {
        this.candidateFileTypes = await this.referentialProvider.getTypeValues(
            AppTypes.CandidateFileType,
            true,
        );
        this.candidateFileTypes?.sort((a, b) => a.order - b.order);
    }

    private isFileMandatory(fileTypeId: string) {
        return !!this.candidate?.files?.find((x) => x.fileTypeId === fileTypeId)
            ?.isMandatory;
    }

    private createFileTypeList(fileTypesCodes: CandidateFileType[]) {
        if (!this.candidate) {
            return [];
        }

        const fileTypes = [];

        for (const fileType of fileTypesCodes) {
            const item = this.candidateFileTypes?.find(
                (x) => x.code === fileType,
            );

            if (item) {
                fileTypes.push(item);
            }
        }

        if (!fileTypes.length) {
            return [];
        }

        const filesTypesInWrapper: CandidateAllFilesWrapper[] = [];

        for (const item of fileTypes) {
            let fileTypeWrapper = filesTypesInWrapper.find(
                (x) => x.fileType.code === item.code,
            );

            if (!fileTypeWrapper) {
                fileTypeWrapper = {
                    fileType: item,
                    files: [],
                    isMandatory: this.isFileMandatory(item?.id),
                    isMultiple:
                        CandidateFileTypeMultipleWrapper[
                            item?.code as CandidateFileType
                        ],
                };
                filesTypesInWrapper.push(fileTypeWrapper);

                if (this.candidate.files?.length) {
                    for (const candidateFileDto of this.candidate.files.filter(
                        (x) => !!x?.fileType && x.fileType.code === item.code,
                    )) {
                        this.initCandidateSingleFile(
                            fileTypeWrapper,
                            candidateFileDto,
                        );
                    }
                }
            }
        }
        // if (this.isConsultantOrAdmin)
        return filesTypesInWrapper;
        // return filesTypesInWrapper.filter(x => x.isMandatory);
    }

    private initCandidateSingleFile(
        candidateAllFilesWrapper: CandidateAllFilesWrapper,
        candidateFileDto: CandidateFileDto,
    ) {
        const label: string = SharedCandidatesHelpers.generateCandidateFileName(
            candidateFileDto,
            this.candidate,
            false,
        );
        const labelFormatted: string =
            SharedCandidatesHelpers.generateCandidateFileName(
                candidateFileDto,
                this.candidate,
                true,
            );

        if (candidateFileDto?.file && !candidateFileDto.file.name) {
            candidateFileDto.file.name = labelFormatted;
        }

        let allowedFileTypes = ['pdf', 'image', 'doc'];

        if (
            candidateAllFilesWrapper.fileType.code ===
            CandidateFileType.MainPhoto
        ) {
            allowedFileTypes = ['image'];
        }

        candidateAllFilesWrapper.files.push({
            candidateFileDto: candidateFileDto,
            label:
                (label || 'Document') +
                ' N°' +
                (candidateAllFilesWrapper.files.length + 1),
            candidateFilesUploadData: {},
            candidateFilesOptions: {
                controller: {
                    openFilePicker: new Subject(),
                    reset: new Subject(),
                },
                allowedFileTypes: allowedFileTypes as any,
                filesCount: 1,
                maxWidth: 1200,
                usePica: true,
                maxWidthForThumbnails: 90,
            },
        });
    }

    checkCandidateFileUploaded(
        candidateAllFilesWrapperSingleFile: CandidateAllFilesWrapperSingleFile,
    ) {
        return !!candidateAllFilesWrapperSingleFile?.candidateFileDto?.file
            ?.externalFilePath;
    }

    private async setDataFilesWrapper() {
        if (!this.candidateFileTypes) {
            await this.init();
        }

        const fileTypesWrapper: DocumentWrapper = {
            profile: {
                label: await this.translate.get('Files.Profile').toPromise(),
                values: [],
            },
            experience: {
                label: await this.translate.get('Files.Experience').toPromise(),
                values: [],
            },
            etatCivil: {
                label: await this.translate.get('Files.Legals').toPromise(),
                values: [],
            },
            diplomes: {
                label: await this.translate.get('Files.Diplomas').toPromise(),
                values: [],
            },
            transports: {
                label: await this.translate.get('Files.Transport').toPromise(),
                values: [],
            },
            complements: {
                label: await this.translate
                    .get('Files.Supplements')
                    .toPromise(),
                values: [],
            },
        };

        fileTypesWrapper.profile.values.push(
            ...this.createFileTypeList([
                CandidateFileType.MainPhoto,
                CandidateFileType.MainResume,
                CandidateFileType.PartnerResume,
                // CandidateFileType.PhotoWithWorkClothes,
            ]),
        );

        fileTypesWrapper.experience.values.push(
            ...this.createFileTypeList([
                CandidateFileType.LastThreeWorkCertificates,
                CandidateFileType.LastThreeLettersOfReference,
                CandidateFileType.VariousRecruitmentTestOrSkills,
                CandidateFileType.SalarySheets,
                CandidateFileType.BlankMoralityInvestigationReport,
            ]),
        );

        fileTypesWrapper.etatCivil.values.push(
            ...this.createFileTypeList([
                CandidateFileType.IdentityCard,
                CandidateFileType.Passport,
                CandidateFileType.ProofOfAddress,
                CandidateFileType.NationalNumbers,
                CandidateFileType.CriminalRecord,
            ]),
        );

        fileTypesWrapper.diplomes.values.push(
            ...this.createFileTypeList([
                CandidateFileType.FlightLicence,
                CandidateFileType.SeaDiploma,
                CandidateFileType.VariousDiploma,
                CandidateFileType.ChildcareCertificate,
                CandidateFileType.CareAssistantDiploma,
                CandidateFileType.FirstAidAndCPRCertificate,
                CandidateFileType.SpecialNeedsOrPostPartumTraining,
                CandidateFileType.ButlerOrHouseholdManagementCertificate,
            ]),
        );

        fileTypesWrapper.transports.values.push(
            ...this.createFileTypeList([
                CandidateFileType.DrivingPointStatementFR,
                CandidateFileType.StatementInsuranceInformationFR,
                CandidateFileType.CarLicence,
                CandidateFileType.MotorbikeLicence,
                CandidateFileType.BoatLicence,
            ]),
        );
        fileTypesWrapper.complements.values.push(
            ...this.createFileTypeList([
                CandidateFileType.ExtractFromKBis,
                CandidateFileType.PhotoOfDishes,
                CandidateFileType.Other,
            ]),
        );

        const wrapperValues = [
            fileTypesWrapper.profile.values,
            fileTypesWrapper.experience.values,
            fileTypesWrapper.etatCivil.values,
            fileTypesWrapper.diplomes.values,
            fileTypesWrapper.transports.values,
            fileTypesWrapper.complements.values,
        ];

        for (const values of wrapperValues) {
            for (const item of values) {
                const isAlreadySet = this.isFileTypeAlreadySet(
                    item.fileType.id,
                );

                if (!isAlreadySet) {
                    this.addFileTypeToUpload(item);
                }
            }
        }

        this.fileTypesWrapper = fileTypesWrapper;
    }

    openFileSelect(file: CandidateAllFilesWrapperSingleFile) {
        file?.candidateFilesOptions?.controller?.reset?.next();
        file?.candidateFilesOptions?.controller?.openFilePicker?.next();
    }

    async saveSingleFileItem(
        file: CandidateAllFilesWrapperSingleFile,
        fromFileUpload: boolean,
    ) {
        this.loading = true;
        this.onLoading.emit(this.loading);

        if (!file.candidateFileDto.file) {
            file.candidateFileDto.file = {} as any;
        }

        if (fromFileUpload) {
            file.candidateFileDto.file.id = undefined;
            file.candidateFileDto.fileId = undefined;

            //récupération type et nom de fichier
            file.candidateFileDto.file.mimeType =
                file?.candidateFilesUploadData?.fileItems[0]?.file.type;
            file.candidateFileDto.file.physicalName =
                file?.candidateFilesUploadData?.fileItems[0]?.file?.name;

            //génération automatique du nom
            file.candidateFileDto.file.name =
                SharedCandidatesHelpers.generateCandidateFileName(
                    file.candidateFileDto,
                    this.candidate,
                    true,
                );
        }

        if (!this.candidate.files.some((x) => x === file.candidateFileDto)) {
            this.candidate.files.push(file.candidateFileDto);
        }

        let saveResponse: GetCandidateResponse;
        const candidateClone = MainHelpers.cloneObject(this.candidate);

        for (const fileItem of candidateClone.files) {
            delete fileItem.fileType;
        }

        if (this.isConsultantOrAdmin) {
            saveResponse = await this.candidateService
                .createOrUpdateCandidate({
                    saveCandidateRequest: {
                        candidate: candidateClone,
                        includeFiles: 'true',
                    },
                })
                .toPromise();
        } else {
            saveResponse = await this.candidateService
                .saveMyDossier({
                    saveCandidateRequest: {
                        candidate: candidateClone,
                        includeFiles: 'true',
                    },
                })
                .toPromise();
        }

        if (!saveResponse.success) {
            this.dialogService.showDialog(saveResponse.message);
        } else if (saveResponse.candidate?.files?.length) {
            this.candidate.candidateAdvancementPercent =
                saveResponse.candidate.candidateAdvancementPercent;
            const newFiles: CandidateFileDto[] = [];

            for (const fileWrapper of saveResponse.candidate.files) {
                newFiles.push(fileWrapper);
            }

            this.candidate.files.splice(0, this.candidate.files.length);
            this.candidate.files.push(...newFiles);
        }

        this.setDataFilesWrapper();
        this.loading = false;
        this.onLoading.emit(this.loading);
    }

    onCompleteItem(file: CandidateAllFilesWrapperSingleFile, evtData: any) {
        this.saveSingleFileItem(file, true);
    }

    onAddingFileFailed(data: AddingFileFailedData) {
        if (data?.code === 'incorrectFileType') {
            this.dialogService.showDialog(
                this.translate.instant('Global.IncorrectFileType'),
            );
        }

        this.loading = false;
    }

    addFileTypeToUpload(item: CandidateAllFilesWrapper) {
        const newCandidateFile: CandidateFileDto = {
            fileType: item.fileType,
            fileTypeId: item.fileType.id,
            candidateId: this.candidate.id,
            file: {} as any,
            isMandatory: item.isMandatory,
        };

        if (!this.candidate.files) {
            this.candidate.files = [];
        }

        // this.candidate.files.push(newCandidateFile);
        this.initCandidateSingleFile(item, newCandidateFile);
        // if (emitFilesChanged) {
        // this.filesChanged.emit();
        // }

        return newCandidateFile;
    }

    async deleteFile(
        file: CandidateAllFilesWrapperSingleFile,
        showConfirm: boolean,
        emitFilesChanged: boolean,
        candidateAllFilesWrapper: CandidateAllFilesWrapper,
        removeChildFromList: boolean,
    ) {
        if (
            SharedService.userHasRole(
                this.AuthDataService.currentUser,
                this.RolesList.Candidate,
            )
        ) {
            //fix temporaire pour éviter que les candidats voient les "Resume with notes"
            if (
                !this.candidateCanOpenFile(file?.candidateFileDto?.file?.name)
            ) {
                const msg = await this.translate
                    .get('Files.RemoveNotAuthorized')
                    .toPromise();
                this.dialogService.showDialog(msg);

                return;
            }
        }

        if (
            removeChildFromList &&
            candidateAllFilesWrapper &&
            candidateAllFilesWrapper.isMultiple &&
            candidateAllFilesWrapper.files?.length &&
            candidateAllFilesWrapper.files.length > 1
        ) {
            this.removeFileUploadChild(candidateAllFilesWrapper, file);

            return;
        }

        if (showConfirm) {
            const dialog = await this.dialogService.showConfirmDialog(
                this.translate.instant('Global.ConfirmDelete'),
                {
                    okLabel: this.translate.instant('Global.Delete'),
                    cancelLabel: this.translate.instant('Global.Cancel'),
                },
            );

            if (!dialog.okClicked) {
                return false;
            }
        }

        file.candidateFileDto.file = null;
        file.candidateFileDto.fileId = null;

        if (emitFilesChanged) {
            this.filesChanged.emit();
        }

        return true;
    }

    canOpenFileDisplay(fileItemWrapper: CandidateAllFilesWrapperSingleFile) {
        if (
            SharedService.userHasRole(
                this.AuthDataService.currentUser,
                this.RolesList.Candidate,
            )
        ) {
            //fix temporaire pour éviter que les candidats voient les "Resume with notes"
            if (
                !this.candidateCanOpenFile(
                    fileItemWrapper?.candidateFileDto?.file?.name,
                )
            ) {
                return false;
            }
        }

        return true;
    }

    async openEditMode(fileItemWrapper: CandidateAllFilesWrapperSingleFile) {
        if (
            SharedService.userHasRole(
                this.AuthDataService.currentUser,
                this.RolesList.Candidate,
            )
        ) {
            //fix temporaire pour éviter que les candidats voient les "Resume with notes"
            if (
                !this.candidateCanOpenFile(
                    fileItemWrapper?.candidateFileDto?.file?.name,
                )
            ) {
                const msg = await this.translate
                    .get('Files.FileNotAuthorized')
                    .toPromise();
                this.dialogService.showDialog(msg);

                return;
            }
        }

        fileItemWrapper.editMode = true;
    }

    lastItemDefined(item: CandidateAllFilesWrapper) {
        return !item?.files?.some((x) => !this.fileDefined(x));
    }

    async removeFileUploadChild(
        item: CandidateAllFilesWrapper,
        file: CandidateAllFilesWrapperSingleFile,
    ) {
        if (
            SharedService.userHasRole(
                this.AuthDataService.currentUser,
                this.RolesList.Candidate,
            )
        ) {
            if (item.isMandatory && item.isMultiple && item.files.length <= 1) {
                const msg = await this.translate
                    .get('Files.RemoveNotAuthorized')
                    .toPromise();
                this.dialogService.showDialog(msg);
                return;
            }
        }

        const index = item.files.findIndex(
            (x) =>
                x.candidateFileDto &&
                x.candidateFileDto.fileId === file.candidateFileDto?.fileId,
        );

        if (index !== -1) {
            const fileToRemove = item.files[index];
            const result = await this.deleteFile(
                item.files[index],
                !!fileToRemove?.candidateFileDto?.file,
                false,
                null,
                false,
            );

            if (result) {
                item.files.splice(index, 1);

                if (fileToRemove.candidateFileDto?.id) {
                    const candidateFileIndexToRemove =
                        this.candidate.files.findIndex(
                            (x) => x.id === fileToRemove.candidateFileDto.id,
                        );

                    if (candidateFileIndexToRemove !== -1) {
                        this.candidate.files.splice(
                            candidateFileIndexToRemove,
                            1,
                        );
                    }
                }
                this.filesChanged.emit();
            }
        }
    }

    private isFileTypeAlreadySet(fileTypeId: string) {
        if (!this.candidate.files?.length) {
            return false;
        }

        const index = this.candidate.files.findIndex(
            (x) => x.fileTypeId === fileTypeId,
        );

        if (index === -1) {
            return false;
        }

        return true;
    }

    onCandidateFileWrapperChange(item: CandidateAllFilesWrapper) {
        const isAlreadySet = this.isFileTypeAlreadySet(item.fileType.id);

        if (!isAlreadySet) {
            const newCandidateFile = this.addFileTypeToUpload(item);

            if (item.isMandatory) {
                this.candidate.files.push(newCandidateFile);
            }
        } else {
            this.candidate.files.find(
                (x) => x.fileTypeId === item.fileType.id,
            ).isMandatory = item.isMandatory;
        }

        this.filesChanged.emit();
    }

    private candidateCanOpenFile(fileName: string) {
        // console.log("Log ~ file: candidate-files.component.ts:361 ~ CandidateFilesComponent ~ candidateCanOpenFile ~ fileName", fileName);
        if (!fileName) {
            return true;
        }

        fileName = fileName.toLowerCase();
        fileName = MainHelpers.getFileWithoutExtension(fileName);

        if (fileName.indexOf('note') !== -1) {
            return false;
        }

        if (
            fileName.indexOf('resume') !== -1 &&
            fileName.indexOf('note') !== -1
        ) {
            return false;
        }

        if (fileName.indexOf('cv') !== -1 && fileName.indexOf('note') !== -1) {
            return false;
        }

        if (fileName === 'resume') {
            return false;
        }

        if (fileName === 'cv') {
            return false;
        }

        if (fileName === 'notes') {
            return false;
        }

        if (fileName === 'note') {
            return false;
        }

        return true;
    }

    async openFileDialog(
        candidateAllFilesWrapperSingleFile: CandidateAllFilesWrapperSingleFile,
    ) {
        //fix temporaire pour éviter que les candidats voient les "Resume with notes"
        if (
            !this.candidateCanOpenFile(
                candidateAllFilesWrapperSingleFile?.candidateFileDto?.file
                    ?.name,
            ) &&
            SharedService.userHasRole(
                this.AuthDataService.currentUser,
                this.RolesList.Candidate,
            )
        ) {
            const msg = await this.translate
                .get('Files.FileNotAuthorized')
                .toPromise();
            this.dialogService.showDialog(msg);

            return;
        }

        const data: BigImageDialogData = {
            file: candidateAllFilesWrapperSingleFile?.candidateFileDto?.file,
            useOriginalSize: true,
            candidateName:
                (this.candidate.firstName || '') +
                '_' +
                (this.candidate.lastName || ''),
            fileTypeLabel:
                candidateAllFilesWrapperSingleFile?.candidateFileDto?.fileType
                    ?.label,
        };

        if (!data?.file) {
            return;
        }

        this.dialogService.showCustomDialog({
            component: BigImageDialogComponent,
            data,
            exitOnClickOutside: true,
        });
    }

    saveFileName(fileItemWrapper: CandidateAllFilesWrapperSingleFile) {
        //fix temporaire pour éviter que les candidats voient les "Resume with notes"
        if (
            !this.candidateCanOpenFile(
                fileItemWrapper?.candidateFileDto?.file?.name,
            ) &&
            SharedService.userHasRole(
                this.AuthDataService.currentUser,
                this.RolesList.Candidate,
            )
        ) {
            this.dialogService.showDialog('Invalid filename');

            return;
        }

        this.saveSingleFileItem(fileItemWrapper, false);
    }

    getFileNameWithExtension(
        fileItemWrapper: CandidateAllFilesWrapperSingleFile,
    ) {
        return SharedCandidatesHelpers.getCandidateFileNameWithExtension(
            fileItemWrapper.candidateFileDto,
        );
    }

    fileDefined(fileItemWrapper: CandidateAllFilesWrapperSingleFile) {
        return (
            !!fileItemWrapper?.candidateFileDto?.file &&
            !!fileItemWrapper?.candidateFileDto?.file?.externalFilePath
        );
    }
}
