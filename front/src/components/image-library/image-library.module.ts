import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FileUploadOptions, NxsFileUploadModule } from 'nextalys-file-upload';
import {
    nxsInternalResizeImageConfig_Token,
    NxsResizeImageConfig,
} from 'nxs-image-resizer';
import { environment } from '../../environments/environment';
import { AppImageDto } from '../../providers/api-client.generated';
import { AuthDataService } from '../../services/auth-data.service';
import { ImageLibraryDialogComponent } from './image-library-dialog.component';
import { ImageLibraryComponent } from './image-library.component';

@NgModule({
    declarations: [ImageLibraryComponent, ImageLibraryDialogComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        NxsFileUploadModule.forRoot({
            fileUploadUrl: environment.uploadImageUrl,
            resizeImageConfig: {
                usePica: true,
                //picaActivatedFeatures: environment.picaActivatedFeatures,
            },
            debugMode: !environment.production,
            authToken: AuthDataService.currentAuthToken,
            useTranslations: true,
        }),
    ],
    exports: [],
    providers: [
        {
            provide: nxsInternalResizeImageConfig_Token,
            useValue: {
                picaActivatedFeatures: environment.picaActivatedFeatures,
            } as NxsResizeImageConfig,
        },
    ],
})
export class ImageLibraryModule {
    static async openDialog(
        matDialog: MatDialog,
        fileUploadOptions?: FileUploadOptions,
    ): Promise<AppImageDto> {
        const dialog = matDialog.open(ImageLibraryDialogComponent, {
            panelClass: 'image-library-dialog-wrapper',
            data: !!fileUploadOptions ? fileUploadOptions : {},
        });

        return await dialog.afterClosed().toPromise();
    }
}
