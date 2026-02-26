import { CommonModule } from '@angular/common';
import { Injectable, NgModule } from '@angular/core';
import {
    DateAdapter,
    MAT_DATE_LOCALE,
    MatNativeDateModule,
    NativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { defaultAppLanguage } from '../../../../shared/shared-constants';
import { LanguageProvider } from '../../providers/language.provider';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
    getFirstDayOfWeek(): number {
        if (LanguageProvider.currentLanguageCode === 'fr') return 1;
        return 0;
    }

    parse(value: any): Date | null {
        if (LanguageProvider.currentLanguageCode !== 'fr') {
            return super.parse(value);
        }

        if (typeof value === 'string' && value.indexOf('/') > -1) {
            const str = value.split('/');
            const year = Number(str[2]);
            const month = Number(str[1]) - 1;
            const date = Number(str[0]);
            return new Date(year, month, date);
        }

        const timestamp = typeof value === 'number' ? value : Date.parse(value);

        return isNaN(timestamp) ? null : new Date(timestamp);
    }
}
@NgModule({
    imports: [CommonModule, MatDatepickerModule, MatNativeDateModule],
    providers: [
        { provide: DateAdapter, useClass: CustomDateAdapter },
        {
            provide: MAT_DATE_LOCALE,
            useValue:
                LanguageProvider.currentLanguageCodeWithCulture ||
                LanguageProvider.currentLanguageCode,
        },
        // { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
    ],
    exports: [MatDatepickerModule],
})
export class CustomDatePickerModule {
    constructor(_adapter: DateAdapter<any>) {
        const langCode =
            LanguageProvider.currentLanguageCodeWithCulture ||
            LanguageProvider.currentLanguageCode ||
            defaultAppLanguage;
        _adapter.setLocale(langCode);
    }
}
