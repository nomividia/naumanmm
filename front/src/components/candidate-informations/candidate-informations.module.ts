import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import { NxsIntlTelInputModule } from 'nextalys-angular-tools';
import { NxsFileUploadModule } from 'nextalys-file-upload';
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
import { ExperiencesModule } from '../experiences-component/experiences.module';
import { ImageLibraryModule } from '../image-library/image-library.module';
import { JobSelectorModule } from '../jobs-selector/jobs-selector.module';
import { LanguageModule } from '../language/language.module';
import { StarNoteModule } from '../star-note/star-note.module';
import { CandidateInformationsComponent } from './candidate-informations.component';

@NgModule({
    imports: [
        ...CommonModulesList,
        AddressModule,
        ImageLibraryModule,
        NxsIntlTelInputModule,
        CustomDatePickerModule,
        StarNoteModule,
        MatCheckboxModule,
        LanguageModule,
        ExperiencesModule,
        JobSelectorModule,
        DepartmentsAutocompleteModule,
        MatChipsModule,
        MatRadioModule,
        NxsFileUploadModule.forRoot({
            fileUploadUrl: environment.uploadMediaUrl,
            resizeImageConfig: {
                usePica: true,
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
    declarations: [CandidateInformationsComponent],
    exports: [CandidateInformationsComponent],
})
export class CandidateInformationsModule {}
