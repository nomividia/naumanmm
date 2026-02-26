import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxsFileUploadModule } from 'nextalys-file-upload';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import {
    nxsInternalResizeImageConfig_Token,
    NxsResizeImageConfig,
} from 'nxs-image-resizer';
import { CommonModulesList } from '../../app/app.module';
import { environment } from '../../environments/environment';
import { AuthDataService } from '../../services/auth-data.service';
import { AddressModule } from '../address/address.module';
import { JobOffersAutocompleteModule } from '../job-offers-autocomplete/job-offers-autocomplete.module';
import { CandidateRefApplyForm } from './candidate-ref-apply-form.component';

const Routes = [
    {
        path: '',
        component: CandidateRefApplyForm,
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(Routes),
        ...CommonModulesList,
        NxsFileUploadModule.forRoot({
            fileUploadUrl: environment.uploadMediaUrl,
            resizeImageConfig: {
                usePica: true,
                //picaActivatedFeatures: environment.picaActivatedFeatures,
            },
            debugMode: !environment.production,
            authToken: AuthDataService.currentAuthToken,
            useTranslations: true,
        }),
        RecaptchaV3Module,
        JobOffersAutocompleteModule,
        AddressModule,
        RecaptchaV3Module,
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

    declarations: [CandidateRefApplyForm],
    exports: [RouterModule],
})
export class CandidateRefApplyFormModule {}
