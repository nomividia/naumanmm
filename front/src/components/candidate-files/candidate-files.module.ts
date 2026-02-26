import { NgModule } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NxsFileUploadModule } from 'nextalys-file-upload';
import {
    nxsInternalResizeImageConfig_Token,
    NxsResizeImageConfig,
} from 'nxs-image-resizer';
import { CommonModulesList } from '../../app/app.module';
import { environment } from '../../environments/environment';
import { AuthDataService } from '../../services/auth-data.service';
import { BigImageDialogModule } from '../big-image-dialog/big-image-dialog.module';
import { CandidateFilesComponent } from './candidate-files.component';

@NgModule({
    imports: [
        ...CommonModulesList,
        MatSlideToggleModule,
        BigImageDialogModule,
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
    declarations: [CandidateFilesComponent],
    exports: [CandidateFilesComponent],
})
export class CandidateFilesModule {}
