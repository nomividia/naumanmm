import { NgModule } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { NxsIntlTelInputModule } from 'nextalys-angular-tools';
import { NxsFileUploadModule } from 'nextalys-file-upload';
import {
    nxsInternalResizeImageConfig_Token,
    NxsResizeImageConfig,
} from 'nxs-image-resizer';
import { CommonModulesList } from '../../app/app.module';
import { DrawerContainerModule } from '../../components/drawer-container/drawer-container.module';
import { ImageLibraryModule } from '../../components/image-library/image-library.module';
import { environment } from '../../environments/environment';
import { CanLeaveGenericGuard } from '../../providers/guards/can-leave-generic.guard';
import { AuthDataService } from '../../services/auth-data.service';
import { EditUserComponent } from './edit-user.component';

const Routes = [
    {
        path: '',
        component: EditUserComponent,
        canDeactivate: [CanLeaveGenericGuard],
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(Routes),
        ...CommonModulesList,
        DrawerContainerModule,
        ImageLibraryModule,
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
        NxsIntlTelInputModule,
        MatSlideToggleModule,
    ],
    providers: [
        {
            provide: nxsInternalResizeImageConfig_Token,
            useValue: {
                picaActivatedFeatures: environment.picaActivatedFeatures,
            } as NxsResizeImageConfig,
        },
    ],
    declarations: [EditUserComponent],
    exports: [RouterModule],
})
export class EditUserModule {}
