import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DialogService } from 'nextalys-angular-tools';
import { DateHelpers } from 'nextalys-js-helpers';
import { ImagesHelper } from '../../../../shared/images.helper';
import { RefData } from '../../../../shared/ref-data';
import { RoutesList } from '../../../../shared/routes';
import {
    AppTypes,
    CandidateFileType,
    CandidateStatus,
} from '../../../../shared/shared-constants';
import {
    CandidateDto,
    CandidateJobDto,
} from '../../providers/api-client.generated';
import { ReferentialProvider } from '../../providers/referential.provider';
import { BaseComponent } from '../base/base.component';
import { CandidateNotesDialogComponent } from '../candidate-notes-dialog/candidate-notes-dialog/candidate-notes-dialog.component';

interface CandidateWithFilteredJobs extends CandidateDto {
    filteredCandidateJobs?: CandidateJobDto[];
}

@Component({
    selector: 'app-candidate-list-minified',
    templateUrl: './candidate-list-minified.component.html',
    styleUrls: [
        './candidate-list-minified.component.scss',
        '../../components/base/base-simple-list.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class CandidateListMinified extends BaseComponent implements OnInit {
    pCandidates: CandidateWithFilteredJobs[];

    ImagesHelper = ImagesHelper;
    RefData = RefData;
    RoutesList = RoutesList;
    CandidateStatus = CandidateStatus;

    private appTypeIdToCode: Record<string, string> = {};
    private categoryCodeToColor: Record<string, string> = {
        [AppTypes.JobCategoryCode]: '#6b7280',
        [AppTypes.JobNannyCategoryCode]: '#ef4444',
        [AppTypes.JobYachtingCategoryCode]: '#3b82f6',
        [AppTypes.JobHotellerieCategoryCode]: '#f97316',
        [AppTypes.JobRetailCategoryCode]: '#8b5cf6',
        [AppTypes.JobRestaurationCategoryCode]: '#10b981',
        [AppTypes.JobCuisineCategoryCode]: '#22c55e',
        [AppTypes.JobSpaCategoryCode]: '#eab308',
        [AppTypes.JobAdministratifHotellerieCategoryCode]: '#0ea5e9',
    };

    @Input() loading = false;
    @Input() searchTerm = '';
    @Input() set candidates(value: CandidateDto[]) {
        this.pCandidates = value;

        if (!this.pCandidates) {
            return;
        }

        for (const candidate of this.pCandidates) {
            candidate.filteredCandidateJobs = this.getCandidateJobsToList(
                candidate.candidateJobs,
            );
        }
    }

    constructor(
        private dialogService: DialogService,
        private referentialProvider: ReferentialProvider,
    ) {
        super();
    }

    async ngOnInit() {
        try {
            const appTypes =
                await this.referentialProvider.getTypesValuesJobs();
            if (appTypes?.length) {
                for (const type of appTypes) {
                    if (type?.id && type?.code) {
                        this.appTypeIdToCode[type.id] = type.code;
                    }
                }
            }
        } catch (err) {
            // ignore errors and fall back to default color
        }
    }

    public getAgeCandidates(numberDays: number) {
        if (!numberDays) {
            return;
        }

        const yearCountDays = 365;
        const divideResult = Math.floor(numberDays / yearCountDays).toFixed(0);

        return divideResult;
    }

    public getAge(birthdate: Date) {
        if (!birthdate) {
            return;
        }

        return DateHelpers.getAge(birthdate);
    }

    hadAnyResume(candidate: CandidateDto) {
        return candidate.files?.some(
            (x) =>
                x.fileType &&
                x.fileType.code === CandidateFileType.MainResume &&
                x.fileId &&
                x.file?.externalFilePath,
        );
    }

    // async openMMiResume(candidate: CandidateDto) {
    //     let file;

    //     if (
    //         candidate.candidateResume?.[0]?.file?.externalFilePath &&
    //         candidate.candidateResume[0]?.resumeCompleted
    //     ) {
    //         file = candidate.candidateResume?.[0]?.file;
    //     }

    //     if (!file) {
    //         file = candidate.files?.find(
    //             (x) =>
    //                 x.fileType &&
    //                 x.fileType.code === CandidateFileType.MainResume &&
    //                 x.fileId &&
    //                 x.file?.externalFilePath,
    //         )?.file;
    //     }

    //     if (!file) {
    //         return;
    //     }

    //     const data: BigImageDialogData = {
    //         file,
    //         useOriginalSize: true,
    //         isResume: true,
    //         candidateName: candidate.firstName + '_' + candidate.lastName,
    //         candidate: candidate,
    //     };

    //     await this.dialogService.showCustomDialogAwaitable({
    //         component: BigImageDialogComponent,
    //         data,
    //         exitOnClickOutside: true,
    //     });
    // }

    private getCandidateJobsToList(candidateJobs: CandidateJobDto[]) {
        const distinctArray: CandidateJobDto[] = [];

        if (!candidateJobs?.length) {
            return distinctArray;
        }

        for (const item of candidateJobs) {
            if (!item.jobId || !item.inActivity) {
                continue;
            }

            const index = distinctArray.findIndex(
                (x) => x.jobId === item.jobId,
            );

            if (index === -1) {
                distinctArray.push(item);
            }
        }

        return distinctArray;
    }

    async showCandidateNotesDialog(candidate: CandidateDto) {
        await this.dialogService.showCustomDialogAwaitable({
            component: CandidateNotesDialogComponent,
            data: candidate,
            exitOnClickOutside: true,
            width: '50%',
            maxWidth: 1000,
        });
    }

    getCategoryColor(candidate: CandidateDto): string {
        const currentJob = candidate?.candidateCurrentJobs?.[0]?.currentJob;
        const appTypeId = currentJob?.appTypeId;
        const code = appTypeId ? this.appTypeIdToCode[appTypeId] : undefined;
        if (code && this.categoryCodeToColor[code]) {
            return this.categoryCodeToColor[code];
        }
        return '#000000';
    }

    getCategoryLabel(candidate: CandidateDto): string {
        const currentJob = candidate?.candidateCurrentJobs?.[0]?.currentJob;
        const appTypeId = currentJob?.appTypeId;
        const code = appTypeId ? this.appTypeIdToCode[appTypeId] : undefined;

        if (code) {
            // Retourner le label de la catégorie basé sur le code
            switch (code) {
                case AppTypes.JobCategoryCode:
                    return 'Category.General';
                case AppTypes.JobNannyCategoryCode:
                    return 'Category.Nanny';
                case AppTypes.JobYachtingCategoryCode:
                    return 'Category.Yachting';
                case AppTypes.JobHotellerieCategoryCode:
                    return 'Category.Hospitality';
                case AppTypes.JobRetailCategoryCode:
                    return 'Category.Retail';
                case AppTypes.JobRestaurationCategoryCode:
                    return 'Category.Restaurant';
                case AppTypes.JobCuisineCategoryCode:
                    return 'Category.Kitchen';
                case AppTypes.JobSpaCategoryCode:
                    return 'Category.Spa';
                case AppTypes.JobAdministratifHotellerieCategoryCode:
                    return 'Category.HospitalityAdministration';
                default:
                    return 'Category.Other';
            }
        }

        // Si pas de job actuel, retourner la clé de traduction
        return 'Category.NoJob';
    }

    /**
     * Highlights search terms in text by wrapping matching text in spans
     * @param text The text to search in
     * @param searchTerm The term to highlight
     * @returns HTML string with highlighted terms
     */
    highlightSearchTerm(text: string, searchTerm: string): string {
        if (!text || !searchTerm || !searchTerm.trim()) {
            return text || '';
        }

        const trimmedSearchTerm = searchTerm.trim();
        const regex = new RegExp(
            `(${this.escapeRegExp(trimmedSearchTerm)})`,
            'gi',
        );

        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }

    /**
     * Escapes special regex characters in a string
     * @param string The string to escape
     * @returns Escaped string safe for use in regex
     */
    private escapeRegExp(string: string): string {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
