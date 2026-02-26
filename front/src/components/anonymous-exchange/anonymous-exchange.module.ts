import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxsFileUploadModule } from 'nextalys-file-upload';
import {
    nxsInternalResizeImageConfig_Token,
    NxsResizeImageConfig,
} from 'nxs-image-resizer';
import { CommonModulesList } from '../../app/app.module';
import { environment } from '../../environments/environment';
import { AuthDataService } from '../../services/auth-data.service';
import { AnonymousExchangeComponent } from './anonymous-exchange.component';

@NgModule({
    declarations: [AnonymousExchangeComponent],
    imports: [
        ...CommonModulesList,
        RouterModule,
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
    ],
    providers: [
        {
            provide: nxsInternalResizeImageConfig_Token,
            useValue: {
                picaActivatedFeatures: environment.picaActivatedFeatures,
            } as NxsResizeImageConfig,
        },
    ],
    exports: [AnonymousExchangeComponent],
})
export class AnonymousExchangeModule {}
