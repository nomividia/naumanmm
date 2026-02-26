import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslateModule } from '@ngx-translate/core';
import { NxsFileUploadModule } from 'nextalys-file-upload';
import { environment } from '../../environments/environment';
import { AuthDataService } from '../../services/auth-data.service';
import { JobOffersAutocompleteModule } from '../job-offers-autocomplete/job-offers-autocomplete.module';
import { SelectJobOfferDialogComponent } from './select-job-offer-dialog.component';

@NgModule({
    declarations: [SelectJobOfferDialogComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatStepperModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule,
        TranslateModule,
        JobOffersAutocompleteModule,
        NxsFileUploadModule.forRoot({
            fileUploadUrl: environment.uploadMediaUrl,
            debugMode: !environment.production,
            authToken: AuthDataService.currentAuthToken,
            useTranslations: true,
        }),
    ],
    exports: [SelectJobOfferDialogComponent],
})
export class SelectJobOfferDialogModule {}
