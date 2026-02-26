import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
    name: 'localizedTime',
    //   pure: false,
})
export class LocalizedTimePipe implements PipeTransform {
    constructor(private translateService: TranslateService) {}

    transform(value: Date | string, format?: string): string {
        const currentLang = this.translateService.currentLang || 'en';

        if (!format) {
            format = currentLang !== 'fr' ? 'hh:mm a' : 'HH:mm';
        }

        const datePipe = new DatePipe(currentLang);

        return datePipe.transform(value, format);
    }
}
