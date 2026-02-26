import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { SnackNotificationComponent } from '../components/snack-notif/snack-notification.component';
import { TranslationInputComponent } from '../components/translations/translation-input.component';
import { CompletedFieldDirective } from '../directives/completed-field-directive';
import { InputBackgroundDirective } from '../directives/input-background';
import { LazyImgDirective } from '../directives/lazy-image-directive';
import { DbTranslatePipe } from '../pipes/db-translate.pipe';
import { DecodeUriPipe } from '../pipes/decode-uri.pipe';
import { LocalizedDatePipe } from '../pipes/localized-date.pipe';
import { LocalizedTimePipe } from '../pipes/localized-time';
import { ShortenStringPipe } from '../pipes/shorten-string.pipe';
import { SortByPipe } from '../pipes/sort-by.pipe';
import { TruncatePipe } from '../pipes/truncate.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatSelectModule,
        RouterModule,
    ],
    declarations: [
        TranslationInputComponent,
        DbTranslatePipe,
        DecodeUriPipe,
        SnackNotificationComponent,
        TruncatePipe,
        CompletedFieldDirective,
        InputBackgroundDirective,
        LazyImgDirective,
        SortByPipe,
        ShortenStringPipe,
        LocalizedDatePipe,
        LocalizedTimePipe,
    ],
    exports: [
        DbTranslatePipe,
        DecodeUriPipe,
        TruncatePipe,
        TranslationInputComponent,
        InputBackgroundDirective,
        SnackNotificationComponent,
        CompletedFieldDirective,
        LazyImgDirective,
        SortByPipe,
        ShortenStringPipe,
        LocalizedDatePipe,
        LocalizedTimePipe,
    ],
})
export class SharedModule { }