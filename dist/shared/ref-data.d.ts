import { CandidateDtoSimple } from "./candidates-helpers";
export interface IntlLanguage {
    code: string;
    label: string;
}
export declare class RefData {
    static countriesListForCurrentLanguage: {
        code: string;
        label: string;
    }[];
    static currentLanguageCode: string;
    static languages: IntlLanguage[];
    private static languagesListInitialized;
    private static countriesListInitialized;
    static setCurrentLanguage(currentLanguageCode: string): void;
    static setLanguagesListForCurrentLanguage(currentLanguageCode?: string): void;
    static orderCandidateCountries(candidate: CandidateDtoSimple): {
        code: string;
        label: string;
    }[];
    static orderCountriesList(list: {
        code: string;
        label: string;
    }[], setFullList?: boolean): void;
    private static setCountriesListForCurrentLanguage;
    static getLanguageName(languageCode: string, currentLanguageCode?: string): string;
    static getCountriesList(languageCode: string): {
        [key: string]: string;
    };
    static getCountryLabel(countryCode: string, languageCode?: string): string;
    static getCountryCode(countryLabel: string, languageCode?: string): string;
}
