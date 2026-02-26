import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'nextalys-angular-tools';
import { MainHelpers } from 'nextalys-js-helpers';
import { RefData } from '../../../../../shared/ref-data';
import { RoutesList } from '../../../../../shared/routes';
import { AppPage, AppTypes } from '../../../../../shared/shared-constants';
import { SharedService } from '../../../../../shared/shared-service';
import { GenericUnloadMessage } from '../../../environments/constants';
import {
    AppValueDto,
    CandidateDto,
    CandidateResumesService,
    CandidatesService,
    CreateOrUpdateCandidateRequestParams,
    GetAllCandidateApplicationsRequestParams,
    GetCandidateRequestParams,
} from '../../../providers/api-client.generated';
import { ReferentialProvider } from '../../../providers/referential.provider';
import { BaseEditPageComponent } from '../../base/base-edit-page.component';

@Component({
    selector: 'app-my-dossier',
    templateUrl: './my-dossier.component.html',
    styleUrls: [
        '../../../pages/base/edit-page-style.scss',
        './my-dossier.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class MyDossierComponent extends BaseEditPageComponent<
    CandidateDto,
    CandidatesService
> {
    jobList: AppValueDto[];
    jobReferenceFunctions: AppValueDto[];

    RefData = RefData;

    MMIResumeHasBeenCompleted = false;
    editMode = false;
    isConsultant: boolean = false;
    tabIndex: number = 0;
    candidateAdvancementPercent = 0;
    additionalParameters?: GetCandidateRequestParams = {} as any;
    getCandidateApplicationsRequest: GetAllCandidateApplicationsRequestParams =
        {};

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        public candidateService: CandidatesService,
        public dialogService: DialogService,
        public referentialProvider: ReferentialProvider,
        public translate: TranslateService,
        public candidateResumeService: CandidateResumesService,
    ) {
        super(
            dialogService,
            AppPage.MyDossier,
            route,
            router,
            candidateService,
            null,
            'candidate',
            'candidateDto',
            'getMyDossier',
            'saveMyDossier',
            RoutesList.CandidatesList,
            'id',
            null,
            GenericUnloadMessage,
        );
        this.route.queryParams.subscribe((params) => {
            if (params.switchToDocument) {
                this.tabIndex = 0; // Files tab is now at index 0 (was previously index 2)
            }
        });

        this.setAdditionalParameters();
        this.init();
        this.isConsultant = SharedService.userIsConsultant(
            this.AuthDataService.currentUser,
        );
    }

    async init() {
        const appTypes = await this.referentialProvider.getTypesValues(
            [
                // AppTypes.JobCategoryCode,
                AppTypes.JobReferenceFunctionCode,
            ],
            true,
        );
        // this.jobList = appTypes.find(x => x.code === AppTypes.JobCategoryCode).appValues;
        const tempJobReferenceFunctions = appTypes.find(
            (x) => x.code === AppTypes.JobReferenceFunctionCode,
        ).appValues;
        this.jobReferenceFunctions = tempJobReferenceFunctions.sort(
            (a, b) => a.order - b.order,
        );
    }

    onTabChange() {
        const mustReload = this.setAdditionalParameters();

        if (mustReload) {
            this.reloadData();
        }
    }

    private setAdditionalParameters() {
        this.additionalParameters = {} as any;
        let mustReload = false;

        switch (this.tabIndex) {
            case 0:
                //Files (was previously case 2, but now it's the first visible tab)
                this.additionalParameters.includeFiles = 'true';
                this.additionalParameters.includeResume = 'true';
                mustReload = true;

                break;
            // case 0: // General Info tab - commented out in HTML
            //     this.additionalParameters.includeAddresses = 'true';
            //     this.additionalParameters.includeCurrentJobs = 'true';
            //     this.additionalParameters.includePets = 'true';
            //     this.additionalParameters.includeLicences = 'true';
            //     // this.additionalParameters.includeNoteItems = 'true';
            //     this.additionalParameters.includeLanguages = 'true';
            //     // this.additionalParameters.includeConsultant = 'true';
            //     this.additionalParameters.includeContracts = 'true';
            //     this.additionalParameters.includeCountries = 'true';
            //     this.additionalParameters.includeChildren = 'true';
            //     this.additionalParameters.includeResume = 'true';
            //     this.additionalParameters.includeBasicInformations = 'true';

            //     mustReload = true;

            //     break;
            // case 1: // References tab - commented out in HTML
            //     //references
            //     this.additionalParameters.includeCandidateJobs = 'true';
            //     mustReload = true;

            //     break;
            case 1:
                //MMI Resume (was previously case 3)

                // this.additionalParameters.includeResume = 'true';
                // // this.additionalParameters.includeCurrentJobs = 'true';
                // // this.additionalParameters.includeCandidateJobs = 'true';
                // this.additionalParameters.includeLicences = 'true';
                // this.additionalParameters.includePets = 'true';
                // this.additionalParameters.includeAddresses = 'true';
                // this.additionalParameters.includeLanguages = 'true';
                // this.additionalParameters.includeContracts = 'true';
                // this.additionalParameters.includeCountries = 'true';
                // this.additionalParameters.includeFiles = 'true';
                // this.additionalParameters.includeChildren = 'true';

                mustReload = false;

                break;
            case 2:
            case 3:
                //interviews (was previously case 4 and 5)
                mustReload = false;

                break;
        }

        return mustReload;
    }

    afterInitEditPageData() {
        if (this.entity) {
            // Update advancement percent regardless of tab (was previously only on tab 0 - General Info)
            this.candidateAdvancementPercent =
                this.entity.candidateAdvancementPercent;

            if (this.entity.files) {
                this.entity.files = this.entity.files.filter(
                    (x) => x.isMandatory || x.fileId,
                );
            }

            // if (this.entity.candidateResume?.[0]?.resumeCompleted) {
            //     this.MMIResumeHasBeenCompleted = true;
            // }
        }
    }

    beforeSaveCheck() {
        const errors: string[] = [];
        const additionalParameters: CreateOrUpdateCandidateRequestParams =
            {} as any;
        additionalParameters.saveCandidateRequest = MainHelpers.cloneObject(
            this.additionalParameters,
        ) as any;
        additionalParameters.saveCandidateRequest.candidate = this.entity;

        this.additionalParametersForSave = additionalParameters;

        return errors;
    }

    onEditClick() {
        if (this.editMode) {
            if (!this.hasPendingModifications) {
                this.editMode = false;

                return;
            }

            const errors = this.beforeSaveCheck();

            if (!errors.length) {
                // console.log(this.entity.candidateJobs);
                this.save();
                this.editMode = false;
            } else {
                this.dialogService.showDialog(
                    this.translate.instant('Errors.ErrorList') +
                        '<ul>' +
                        errors.map((x) => (x = '<li>' + x + '</li>')).join('') +
                        '</ul>',
                );
            }
        } else {
            this.editMode = true;
        }
    }

    emitModification() {
        this.hasPendingModifications = true;
    }

    isReadonly(key: string) {
        return this.entity.candidateReadonlyProperties.some(
            (x) => x.candidateReadonlyField === key,
        );
    }
}
