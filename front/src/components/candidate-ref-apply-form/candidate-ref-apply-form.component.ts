import {
    Component,
    ElementRef,
    ViewChild,
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
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { ApplyStatus, AppTypes } from '../../../../shared/shared-constants';
import { BasePageComponent } from '../../pages/base/base-page.component';
import {
    AppFileDto,
    AppValueDto,
    CandidateApplicationDto,
    CandidateApplicationsService,
} from '../../providers/api-client.generated';
import { ReferentialProvider } from '../../providers/referential.provider';

@Component({
    selector: 'app-candidate-ref-apply-form',
    templateUrl: 'candidate-ref-apply-form.component.html',
    styleUrls: [
        '../candidate-apply-form/candidate-apply-form.component.scss',
        './candidate-ref-apply-form.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class CandidateRefApplyForm extends BasePageComponent {
    candidateApplication: CandidateApplicationDto;
    acceptCG: boolean;

    cvUploadData: FileUploadData = {};
    imageUploadOptions: FileUploadOptions = {
        allowedFileTypes: ['image', 'pdf'],
        maxWidth: 1080,
    };

    candidateApplyStatusList: AppValueDto[];

    @ViewChild('offerForm') offerForm?: ElementRef<HTMLFormElement>;

    constructor(
        private dialogService: DialogService,
        private recaptchaV3Service: ReCaptchaV3Service,
        private referentialProvider: ReferentialProvider,
        private candidateApplicationService: CandidateApplicationsService,
        private translate: TranslateService,
    ) {
        super();
        this.init();
    }

    async init() {
        this.candidateApplication = {} as any;

        const candidateApplyStatusResponse =
            await this.referentialProvider.getTypeValues(
                AppTypes.ApplyStatusCode,
                true,
            );

        if (candidateApplyStatusResponse) {
            this.candidateApplyStatusList = candidateApplyStatusResponse;
        }
    }

    onCompleteItems() {
        this.loading = true;
        const files: AppFileDto[] = this.cvUploadData.fileItems.map<AppFileDto>(
            (x) => ({
                physicalName: x.file.name,
                name: x.alias,
                mimeType: x.file.type,
            }),
        );
        // console.log("Log ~ file: candidate-apply-form.component.ts ~ line 131 ~ CandidateApplyForm ~ onCompleteItems ~ files", files);
        this.loading = false;
    }

    onAddingFileFailed(data: AddingFileFailedData) {
        if (data?.code === 'incorrectFileType') {
            this.dialogService.showDialog(
                this.translate.instant('Global.IncorrectFileType'),
            );
        }
    }

    private beforeSubmitCheck() {
        const errors: string[] = [];

        if (!this.candidateApplication) {
            return;
        }

        if (!this.candidateApplication.firstName) {
            errors.push('prénom');
        }

        if (!this.candidateApplication.lastName) {
            errors.push('nom');
        }

        if (!this.candidateApplication.email) {
            errors.push('email');
        }

        // if (!this.candidateApplication.jobOfferLinked)
        //     errors.push('la reférence de l\'annonce');

        return errors;
    }

    async submitForm() {
        if (this.beforeSubmitCheck().length) {
            this.dialogService.showDialog(
                'Les champs suivant doivent être rempli : <br> <ul> ' +
                    this.beforeSubmitCheck()
                        .map((x) => (x = '<li>' + x + '</li>'))
                        .join('') +
                    '</ul>',
            );

            return;
        }

        const recaptchaToken = await this.recaptchaV3Service
            .execute('candidateApplicationFormSubmit')
            .toPromise();
        this.loading = true;
        const cloneCandidateApplication = MainHelpers.cloneObject(
            this.candidateApplication,
        );
        cloneCandidateApplication.applyStatusId =
            this.candidateApplyStatusList.find(
                (x) => x.code === ApplyStatus.Pending,
            ).id;

        // if (this.candidateApplication.jobOfferLinked) {
        //     cloneCandidateApplication.jobOfferLinkedId = cloneCandidateApplication.jobOfferLinked.id;
        //     cloneCandidateApplication.jobOfferLinked = null;
        // }

        if (this.cvUploadData?.fileItems?.length) {
            const mainResumeFiles: AppFileDto[] =
                this.cvUploadData.fileItems.map<AppFileDto>((x) => ({
                    physicalName: x.file.name,
                    name: x.alias,
                    mimeType: x.file.type,
                }));
            cloneCandidateApplication.mainResumeFile = mainResumeFiles[0];
        }

        const saveCandidateApplyResponse =
            await this.candidateApplicationService
                .createOrUpdateRefCandidateApplication({
                    submitCandidateApplicationFormRequest: {
                        candidateApplication: cloneCandidateApplication,
                        recaptchaToken: recaptchaToken,
                    },
                })
                .toPromise();

        if (!saveCandidateApplyResponse.success) {
            this.dialogService.showDialog(saveCandidateApplyResponse.message);
        } else {
            this.dialogService.showSnackBar(
                'Votre demande a bien été transmise',
            );
            this.candidateApplication = {} as any;
            this.candidateApplication.address = {} as any;
            this.offerForm.nativeElement.reset();
        }

        this.loading = false;
    }
}
