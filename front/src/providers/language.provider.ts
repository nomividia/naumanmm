import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MainHelpers } from 'nextalys-js-helpers';
import { AppLocalStorage } from 'nextalys-js-helpers/dist/browser-helpers';
import { RefData } from '../../../shared/ref-data';
import {
    AvailableLanguageCodes,
    defaultAppLanguage,
} from '../../../shared/shared-constants';
import { LanguageDto, ReferentialService } from './api-client.generated';

@Injectable()
export class LanguageProvider {
    public static languages: LanguageDto[] = [];
    public static currentLanguageCode: string;
    public static currentLanguageCodeWithCulture: string;
    private static initialized = false;
    static instance: LanguageProvider;
    static platformId: any;

    public static get currentLanguage(): LanguageDto {
        if (this.languages?.length) {
            return this.languages.find(
                (x) => x.code === this.currentLanguageCode,
            );
        }

        return { code: this.currentLanguageCode, label: undefined };
    }

    constructor(
        private translate: TranslateService,
        private referentialService: ReferentialService,
        @Optional() @Inject(DOCUMENT) private document: Document,
        @Optional() @Inject(PLATFORM_ID) private platformId: any,
    ) {
        LanguageProvider.instance = this;
        LanguageProvider.platformId = platformId;
    }

    static setLanguageFromUrl(saveLocalStorage = true) {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const langParamFromUrl = MainHelpers.getUrlParameterByName('lang');

        if (
            langParamFromUrl &&
            AvailableLanguageCodes.indexOf(langParamFromUrl) > -1
        ) {
            LanguageProvider.instance.changeLanguage(
                langParamFromUrl,
                saveLocalStorage,
            );
        }
    }

    public init(defaultLang?: string) {
        if (LanguageProvider.initialized) {
            return;
        }

        if (isPlatformBrowser(this.platformId)) {
            const langParamFromUrl = MainHelpers.getUrlParameterByName('lang');

            if (
                langParamFromUrl &&
                AvailableLanguageCodes.indexOf(langParamFromUrl) > -1
            ) {
                defaultLang = langParamFromUrl;
            }
        }

        LanguageProvider.initialized = true;

        if (!defaultLang) {
            defaultLang = AppLocalStorage.getItem('nxs-app-language');
        }

        LanguageProvider.currentLanguageCodeWithCulture =
            AppLocalStorage.getItem('nxs-app-language-with-culture');

        if (!defaultLang) {
            defaultLang = this.translate.getBrowserLang();

            if (AvailableLanguageCodes.indexOf(defaultLang) === -1) {
                defaultLang = defaultAppLanguage;
            } else {
                LanguageProvider.currentLanguageCodeWithCulture =
                    this.translate.getBrowserCultureLang();
                AppLocalStorage.setItem(
                    'nxs-app-language-with-culture',
                    LanguageProvider.currentLanguageCodeWithCulture,
                );
            }
        }
        // console.log("Log ~ file: language.provider.ts:40 ~ LanguageProvider ~ init ~    LanguageProvider.currentLanguageCodeWithCulture:", LanguageProvider.currentLanguageCodeWithCulture);
        // this language will be used as a fallback when a translation isn't found in the current language
        this.translate.setDefaultLang(defaultLang);
        // the lang to use, if the lang isn't available, it will use the current loader to get them
        this.translate.use(defaultLang);
        this.document.documentElement.lang = defaultLang;
        LanguageProvider.currentLanguageCode = defaultLang;
        RefData.setCurrentLanguage(LanguageProvider.currentLanguageCode);
        this.retrieveAllLanguages();
    }

    public changeLanguage(lang: string, saveLocalStorage = true) {
        // console.log("Log ~ LanguageProvider ~ changeLanguage ~ lang:", lang);
        this.translate.use(lang);
        this.document.documentElement.lang = lang;
        LanguageProvider.currentLanguageCode = lang;
        RefData.setCurrentLanguage(LanguageProvider.currentLanguageCode);
        LanguageProvider.currentLanguageCodeWithCulture = null;
        AppLocalStorage.removeItem('nxs-app-language-with-culture');

        if (saveLocalStorage) {
            AppLocalStorage.setItem('nxs-app-language', lang);
        }
    }

    async retrieveAllLanguages() {
        // if (!LanguageProvider.languages || LanguageProvider.languages.length === 0) {
        //     const getLanguagesResponse = await this.referentialService.getAllLanguages(true).toPromise();
        //     if (getLanguagesResponse.success) {
        //         LanguageProvider.languages.splice(0, LanguageProvider.languages.length);
        //         LanguageProvider.languages.push(...getLanguagesResponse.languages);
        //     }
        // }

        const getLanguagesResponse = await this.referentialService
            .getAllLanguages()
            .toPromise();

        if (getLanguagesResponse.success) {
            // const languages = getLanguagesResponse.languages.filter(x => x.translated);
            const languages = getLanguagesResponse.languages;
            // const adminLanguages = getLanguagesResponse.languages.filter(x => x.forAdmin);
            LanguageProvider.languages.splice(0, languages.length);
            LanguageProvider.languages.push(...languages);
            // LanguageProvider.adminLanguages.splice(0, adminLanguages.length);
            // LanguageProvider.adminLanguages.push(...adminLanguages);
            // for (const language of languages) {
            //     if (!LanguageProvider.adminLanguages.some(x => x.id === language.id)) {
            //         LanguageProvider.adminLanguages.push(language);
            //     }
            // }
        }
    }
}
