/* eslint-disable @typescript-eslint/require-await */
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DialogService } from 'nextalys-angular-tools';
import { DateHelpers } from 'nextalys-js-helpers';
import { BrowserFileHelpers } from 'nextalys-js-helpers/dist/browser-file-helpers';
import { ImagesHelper } from '../../../../shared/images.helper';
import { RefData } from '../../../../shared/ref-data';
import { AppTypes } from '../../../../shared/shared-constants';
import { ArchiveFakeAppValueCode } from '../../environments/constants';
import {
    CandidateApplicationDto,
    CandidateApplicationsService,
    GenericResponse,
    GetAllCandidateApplicationsRequestParams,
} from '../../providers/api-client.generated';
import { ReferentialProvider } from '../../providers/referential.provider';
import { EventsHandler } from '../../services/events.handler';
import { BaseSimpleList } from '../base/base-simple-list.component';

@Component({
    selector: 'app-candidate-applications-list-minified',
    templateUrl: 'candidate-applications-list-minified.component.html',
    styleUrls: [
        'candidate-applications-list-minified.component.scss',
        '../../components/base/base-simple-list.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class CandidateApplicationListMinified
    extends BaseSimpleList<
        CandidateApplicationDto,
        GetAllCandidateApplicationsRequestParams
    >
    implements OnInit
{
    @Input() requestComponent: GetAllCandidateApplicationsRequestParams & {
        applyStatusListSelected?: string[];
        candidateStatusListSelected?: string[];
        cityArray?: string[];
        locationsArray?: string[];
    };
    @Input() currentCandidateApplications: boolean;
    @Input() displayApplicationStatus: boolean = false;
    @Input() displayCandidateStatus: boolean = false;

    ImagesHelper = ImagesHelper;
    RefData = RefData;

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

    constructor(
        dialogService: DialogService,
        private candidateApplicationService: CandidateApplicationsService,
        private referentialProvider: ReferentialProvider,
    ) {
        super('candidateApplications', dialogService, true);

        this.subscribeToObservable(this.datasourceLoaded, () => {
            try {
                for (const item of this.items) {
                    if (item.mainPhotoBase64) {
                        item.mainPhotoBase64 =
                            BrowserFileHelpers.base64ToDataUri(
                                item.mainPhotoBase64,
                                item.mainPhotoBase64MimeType,
                            );
                    }
                }
            } catch (err) {
                console.log(
                    'Log ~ file: candidate-applications-list.component.ts ~ line 100 ~ ListCandidateApplicationsComponent ~ this.subscribeToObservable ~ err',
                    err,
                );
            }
        });

        this.subscribeToEvent(
            EventsHandler.CandidateApplicationHasBeenSeen,
            (id) => {
                const item = this.items.find((x) => x.id === id);

                if (!item) {
                    return;
                }

                item.seen = true;
            },
        );

        this.subscribeToEvent(EventsHandler.NewCandidateApplication, (id) => {
            if (this.paginator?.pageIndex === 0) {
                this.loadData(false);
            }
        });
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
            // ignore: fallback color will be used
        }
    }

    public async loadCustomData(): Promise<GenericResponse> {
        this.request.orderby =
            this.requestComponent.orderby ||
            this.request.orderby ||
            'creationDate';
        this.request.order =
            this.requestComponent.order || this.request.order || 'DESC';
        this.request.search = this.requestComponent.search;
        this.request.applyStatus =
            this.requestComponent.applyStatusListSelected?.join(',');
        this.request.candidateStatus = this.requestComponent.candidateStatus;
        this.request.applyInCouple = this.requestComponent.applyInCouple;
        this.request.jobOfferRef = this.requestComponent.jobOfferRef;
        this.request.jobOfferId = this.requestComponent.jobOfferId;
        this.request.jobCategory = this.requestComponent.jobCategory;

        if (
            this.request.jobCategory &&
            typeof this.request.jobCategory !== 'string' &&
            Array.isArray(this.request.jobCategory)
        ) {
            this.request.jobCategory = (
                this.request.jobCategory as string[]
            ).join(',');
        }

        this.request.candidateId = this.requestComponent.candidateId;
        this.request.showOnlyUnSeen =
            typeof this.requestComponent.showOnlyUnSeen === 'boolean'
                ? this.requestComponent.showOnlyUnSeen
                    ? 'true'
                    : 'false'
                : this.requestComponent.showOnlyUnSeen;
        this.request.spontaneousApplication =
            typeof this.requestComponent.spontaneousApplication === 'boolean'
                ? this.requestComponent.spontaneousApplication
                    ? 'true'
                    : 'false'
                : this.requestComponent.spontaneousApplication;
        this.request.onlyNewCandidate =
            typeof this.requestComponent.onlyNewCandidate === 'boolean'
                ? this.requestComponent.onlyNewCandidate
                    ? 'true'
                    : 'false'
                : this.requestComponent.onlyNewCandidate;
        this.request.hideSpontaneousApplications =
            typeof this.requestComponent.hideSpontaneousApplications ===
            'boolean'
                ? this.requestComponent.hideSpontaneousApplications
                    ? 'true'
                    : 'false'
                : this.requestComponent.hideSpontaneousApplications;

        if (this.requestComponent.consultantIds) {
            this.request.consultantIds = (
                this.requestComponent.consultantIds as any as string[]
            ).join(',');
        }

        // Convert location arrays to comma-separated strings
        if (
            this.requestComponent.cityArray &&
            Array.isArray(this.requestComponent.cityArray)
        ) {
            this.request.city = this.requestComponent.cityArray.join(',');
        } else {
            this.request.city = this.requestComponent.city;
        }

        if (
            this.requestComponent.locationsArray &&
            Array.isArray(this.requestComponent.locationsArray)
        ) {
            this.request.locations =
                this.requestComponent.locationsArray.join(',');
        } else {
            this.request.locations = this.requestComponent.locations;
        }

        this.request.department = this.requestComponent.department;

        let requestIncludeDisabled = false;

        if (
            this.requestComponent.applyStatus &&
            this.requestComponent.applyStatus.indexOf(
                ArchiveFakeAppValueCode,
            ) !== -1
        ) {
            requestIncludeDisabled = true;
        }

        this.request.includeDisabled = requestIncludeDisabled
            ? 'true'
            : 'false';

        if (this.currentCandidateApplications) {
            return this.candidateApplicationService
                .getMyCandidateApplications(this.request)
                .toPromise();
        }

        return this.candidateApplicationService
            .getAllCandidateApplications(this.request)
            .toPromise();
    }

    public getAge(birthdate: Date) {
        if (!birthdate) {
            return;
        }

        return DateHelpers.getAge(birthdate);
    }

    getCategoryColor(application: CandidateApplicationDto): string {
        const appTypeId =
            application?.profession?.appTypeId ||
            application?.candidateApplicationJobs?.[0]?.jobOffer?.job
                ?.appTypeId;

        const code = appTypeId ? this.appTypeIdToCode[appTypeId] : undefined;
        if (code && this.categoryCodeToColor[code]) {
            return this.categoryCodeToColor[code];
        }
        return '#000000';
    }

    getCategoryLabel(application: CandidateApplicationDto): string {
        const appTypeId =
            application?.profession?.appTypeId ||
            application?.candidateApplicationJobs?.[0]?.jobOffer?.job
                ?.appTypeId;

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

        // Si pas de profession ou job, retourner la clé de traduction
        return 'Category.NoJob';
    }

    get searchTerm(): string {
        return this.requestComponent?.search || '';
    }

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

    private escapeRegExp(str: string): string {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
