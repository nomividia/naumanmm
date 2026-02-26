import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { RouterModule } from '@angular/router';
import { NxsIntlTelInputModule } from 'nextalys-angular-tools';
import { NxsFileUploadModule } from 'nextalys-file-upload';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import {
    nxsInternalResizeImageConfig_Token,
    NxsResizeImageConfig,
} from 'nxs-image-resizer';
import { CommonModulesList } from '../../app/app.module';
import { environment } from '../../environments/environment';
import { CustomDatePickerModule } from '../../modules/date-picker/date-picker.module';
import { AuthDataService } from '../../services/auth-data.service';
import { AddressModule } from '../address/address.module';
import { DepartmentsAutocompleteModule } from '../departments-autocomplete/departments-autocomplete.module';
import { JobOffersAutocompleteModule } from '../job-offers-autocomplete/job-offers-autocomplete.module';
import { JobSelectorModule } from '../jobs-selector/jobs-selector.module';
import { UsTermsDialogComponent } from '../us-terms-dialog/us-terms-dialog.component';
import { CandidateApplyForm } from './candidate-apply-form.component';

const Routes = [
    {
        path: '',
        component: CandidateApplyForm,
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(Routes),
        ...CommonModulesList,
        NxsFileUploadModule.forRoot({
            fileUploadUrl: environment.uploadMediaUrl,
            resizeImageConfig: { usePica: true },
            debugMode: !environment.production,
            authToken: AuthDataService.currentAuthToken,
            useTranslations: true,
        }),
        NxsIntlTelInputModule,
        CustomDatePickerModule,
        MatDividerModule,
        AddressModule,
        RecaptchaV3Module,
        JobOffersAutocompleteModule,
        MatChipsModule,
        JobSelectorModule,
        DepartmentsAutocompleteModule,
        MatRadioModule,
    ],
    providers: [
        {
            provide: RECAPTCHA_V3_SITE_KEY,
            useValue: environment.googleRecaptchaSiteKey,
        },
        {
            provide: nxsInternalResizeImageConfig_Token,
            useValue: {
                picaActivatedFeatures: environment.picaActivatedFeatures,
            } as NxsResizeImageConfig,
        },
    ],
    declarations: [CandidateApplyForm, UsTermsDialogComponent],
    exports: [RouterModule],
})
export class CandidateApplyFormModule {}
