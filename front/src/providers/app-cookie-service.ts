import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AppCookieService {
    constructor(private cookieService: CookieService) {}

    set(key: string, value: string, days = 365) {
        this.cookieService.set(
            key,
            value,
            days,
            '/',
            undefined,
            !!environment.production,
            'Strict',
        );
    }

    delete(key: string) {
        this.cookieService.delete(key, '/');
    }

    get(key: string) {
        return this.cookieService.get(key);
    }
}
