// import { countries as libCountries } from 'countries-list';
// import * as langmap from 'langmap';
import * as LanguagesManager from "@cospired/i18n-iso-languages";
import * as CountryManager from "i18n-iso-countries";

import { CandidateDtoSimple } from "./candidates-helpers";
import { AvailableLanguageCodes, defaultAppLanguage } from "./shared-constants";

CountryManager.registerLocale(require("i18n-iso-countries/langs/en.json"));
CountryManager.registerLocale(require("i18n-iso-countries/langs/fr.json"));

LanguagesManager.registerLocale(
    require("@cospired/i18n-iso-languages/langs/en.json")
);
LanguagesManager.registerLocale(
    require("@cospired/i18n-iso-languages/langs/fr.json")
);

export interface IntlLanguage {
    code: string;
    label: string;
}

export class RefData {
    static countriesListForCurrentLanguage: { code: string; label: string }[] =
        [];
    static currentLanguageCode: string = defaultAppLanguage;
    // static languages: IntlLanguage[] = Object.keys(langmap).map(x => ({ code: x, english: langmap[x].englishName, native: langmap[x].nativeName }));
    static languages: IntlLanguage[] = [];
    private static languagesListInitialized = false;
    private static countriesListInitialized = false;

    static setCurrentLanguage(currentLanguageCode: string) {
        this.currentLanguageCode = currentLanguageCode;
        this.setCountriesListForCurrentLanguage();
        this.setLanguagesListForCurrentLanguage();
    }

    static setLanguagesListForCurrentLanguage(currentLanguageCode?: string) {
        let languageCodeHasChanged = false;

        if (currentLanguageCode) {
            languageCodeHasChanged =
                currentLanguageCode !== this.currentLanguageCode;
            this.currentLanguageCode = currentLanguageCode;
        }

        if (!languageCodeHasChanged && this.languagesListInitialized) {
            return;
        }

        const languagesList = LanguagesManager.getNames(
            this.currentLanguageCode
        );

        this.languages.splice(0, this.languages.length);
        let firstLanguagesToTake = ["fr", "en", "es"];
        const entries = Object.entries(languagesList);

        for (const [code, label] of entries) {
            if (firstLanguagesToTake.some((x) => x === code)) {
                continue;
            }

            this.languages.push({ code: code, label: label });
        }

        this.languages.sort((a, b) => {
            if (a.label < b.label) {
                return -1;
            }

            if (a.label > b.label) {
                return 1;
            }

            return 0;
        });

        firstLanguagesToTake = firstLanguagesToTake.reverse();

        for (const firstLanguageToTake of firstLanguagesToTake) {
            const entry = entries.find((x) => firstLanguageToTake === x[0]);

            if (entry) {
                this.languages.unshift({ code: entry[0], label: entry[1] });
            }
        }

        this.languagesListInitialized = true;
        // this.languages.unshift(...entries.filter(x => firstLanguagesToTake.indexOf(x[0]) !== -1).map<IntlLanguage>(x => ({ code: x[0], label: x[1] })));
        // console.log("Log ~ file: ref-data.ts ~ line 31 ~ RefData ~  this.languages", this.languages);
    }

    public static orderCandidateCountries(
        candidate: CandidateDtoSimple
    ): { code: string; label: string }[] {
        if (!candidate?.candidateCountries?.length) {
            return [];
        }

        const countries: { code: string; label: string }[] =
            candidate.candidateCountries.map((x) => ({
                code: x.country,
                label: RefData.getCountryLabel(x.country),
            }));

        RefData.orderCountriesList(countries);

        return countries;
    }

    public static orderCountriesList(
        list: { code: string; label: string }[],
        setFullList?: boolean
    ) {
        const countries = this.getCountriesList(this.currentLanguageCode);
        const firstCountriesToTake = ["FR", "ES", "AE", "GB", "US"].reverse();
        const newContriesList: { [key: string]: string } = {};

        if (!setFullList) {
            for (const code of Object.keys(countries)) {
                if (list.some((x) => x.code === code)) {
                    newContriesList[code] = countries[code];
                }
            }
        }

        const countriesToAdd = setFullList ? countries : newContriesList;

        list.splice(0, list.length);

        for (const countryCode in countriesToAdd) {
            if (Object.prototype.hasOwnProperty.call(countries, countryCode)) {
                const val = countries[countryCode];
                if (firstCountriesToTake.some((x) => x === countryCode)) {
                    continue;
                }

                if (countryCode && val) {
                    list.push({ code: countryCode, label: val });
                }
            }
        }

        list.sort((a, b) => {
            if (a.label > b.label) return 1;
            if (a.label < b.label) return -1;
            return 0;
        });

        for (const firstCountryToTake of firstCountriesToTake) {
            if (
                Object.prototype.hasOwnProperty.call(
                    countriesToAdd,
                    firstCountryToTake
                )
            ) {
                const val = countriesToAdd[firstCountryToTake];
                list.unshift({ code: firstCountryToTake, label: val });
            }
        }
    }

    private static setCountriesListForCurrentLanguage(
        currentLanguageCode?: string
    ) {
        let languageCodeHasChanged = false;

        if (currentLanguageCode) {
            languageCodeHasChanged =
                currentLanguageCode !== this.currentLanguageCode;

            this.currentLanguageCode = currentLanguageCode;
        }

        if (!languageCodeHasChanged && this.countriesListInitialized) {
            return;
        }

        this.orderCountriesList(this.countriesListForCurrentLanguage, true);

        this.countriesListInitialized = true;
    }

    static getLanguageName(languageCode: string, currentLanguageCode?: string) {
        if (!languageCode) {
            return "";
        }

        this.setLanguagesListForCurrentLanguage(currentLanguageCode);

        return this.languages.find((x) => x.code === languageCode)?.label;
    }

    static getCountriesList(languageCode: string): { [key: string]: string } {
        if (!languageCode) {
            return null;
        }

        if (AvailableLanguageCodes.indexOf(languageCode) === -1) {
            languageCode = defaultAppLanguage;
        }

        return CountryManager.getNames(languageCode);
    }

    static getCountryLabel(countryCode: string, languageCode?: string): string {
        if (!languageCode) {
            languageCode = this.currentLanguageCode;
        }

        if (!countryCode || !languageCode) {
            return "";
        }

        if (AvailableLanguageCodes.indexOf(languageCode) === -1) {
            languageCode = defaultAppLanguage;
        }

        const countries = this.getCountriesList(languageCode);

        if (!countries) {
            return "";
        }

        const key = Object.keys(countries).find((x) => x === countryCode);

        if (!key) {
            return "";
        }

        return countries[key];
    }

    static getCountryCode(countryLabel: string, languageCode?: string): string {
        if (!languageCode) {
            languageCode = this.currentLanguageCode;
        }

        if (!countryLabel || !languageCode) {
            return null;
        }

        if (AvailableLanguageCodes.indexOf(languageCode) === -1) {
            languageCode = defaultAppLanguage;
        }

        const countries = this.getCountriesList(languageCode);

        if (!countries) {
            return null;
        }

        for (const countryCode in countries) {
            if (Object.prototype.hasOwnProperty.call(countries, countryCode)) {
                const val = countries[countryCode];
                if (
                    val &&
                    val.trim().toLowerCase() ===
                        countryLabel.trim().toLowerCase()
                ) {
                    return countryCode;
                }
            }
        }
        return null;
    }
}
