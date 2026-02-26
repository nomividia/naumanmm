"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefData = void 0;
const LanguagesManager = require("@cospired/i18n-iso-languages");
const CountryManager = require("i18n-iso-countries");
const shared_constants_1 = require("./shared-constants");
CountryManager.registerLocale(require("i18n-iso-countries/langs/en.json"));
CountryManager.registerLocale(require("i18n-iso-countries/langs/fr.json"));
LanguagesManager.registerLocale(require("@cospired/i18n-iso-languages/langs/en.json"));
LanguagesManager.registerLocale(require("@cospired/i18n-iso-languages/langs/fr.json"));
class RefData {
    static setCurrentLanguage(currentLanguageCode) {
        this.currentLanguageCode = currentLanguageCode;
        this.setCountriesListForCurrentLanguage();
        this.setLanguagesListForCurrentLanguage();
    }
    static setLanguagesListForCurrentLanguage(currentLanguageCode) {
        let languageCodeHasChanged = false;
        if (currentLanguageCode) {
            languageCodeHasChanged =
                currentLanguageCode !== this.currentLanguageCode;
            this.currentLanguageCode = currentLanguageCode;
        }
        if (!languageCodeHasChanged && this.languagesListInitialized) {
            return;
        }
        const languagesList = LanguagesManager.getNames(this.currentLanguageCode);
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
    }
    static orderCandidateCountries(candidate) {
        var _a;
        if (!((_a = candidate === null || candidate === void 0 ? void 0 : candidate.candidateCountries) === null || _a === void 0 ? void 0 : _a.length)) {
            return [];
        }
        const countries = candidate.candidateCountries.map((x) => ({
            code: x.country,
            label: RefData.getCountryLabel(x.country),
        }));
        RefData.orderCountriesList(countries);
        return countries;
    }
    static orderCountriesList(list, setFullList) {
        const countries = this.getCountriesList(this.currentLanguageCode);
        const firstCountriesToTake = ["FR", "ES", "AE", "GB", "US"].reverse();
        const newContriesList = {};
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
            if (a.label > b.label)
                return 1;
            if (a.label < b.label)
                return -1;
            return 0;
        });
        for (const firstCountryToTake of firstCountriesToTake) {
            if (Object.prototype.hasOwnProperty.call(countriesToAdd, firstCountryToTake)) {
                const val = countriesToAdd[firstCountryToTake];
                list.unshift({ code: firstCountryToTake, label: val });
            }
        }
    }
    static setCountriesListForCurrentLanguage(currentLanguageCode) {
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
    static getLanguageName(languageCode, currentLanguageCode) {
        var _a;
        if (!languageCode) {
            return "";
        }
        this.setLanguagesListForCurrentLanguage(currentLanguageCode);
        return (_a = this.languages.find((x) => x.code === languageCode)) === null || _a === void 0 ? void 0 : _a.label;
    }
    static getCountriesList(languageCode) {
        if (!languageCode) {
            return null;
        }
        if (shared_constants_1.AvailableLanguageCodes.indexOf(languageCode) === -1) {
            languageCode = shared_constants_1.defaultAppLanguage;
        }
        return CountryManager.getNames(languageCode);
    }
    static getCountryLabel(countryCode, languageCode) {
        if (!languageCode) {
            languageCode = this.currentLanguageCode;
        }
        if (!countryCode || !languageCode) {
            return "";
        }
        if (shared_constants_1.AvailableLanguageCodes.indexOf(languageCode) === -1) {
            languageCode = shared_constants_1.defaultAppLanguage;
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
    static getCountryCode(countryLabel, languageCode) {
        if (!languageCode) {
            languageCode = this.currentLanguageCode;
        }
        if (!countryLabel || !languageCode) {
            return null;
        }
        if (shared_constants_1.AvailableLanguageCodes.indexOf(languageCode) === -1) {
            languageCode = shared_constants_1.defaultAppLanguage;
        }
        const countries = this.getCountriesList(languageCode);
        if (!countries) {
            return null;
        }
        for (const countryCode in countries) {
            if (Object.prototype.hasOwnProperty.call(countries, countryCode)) {
                const val = countries[countryCode];
                if (val &&
                    val.trim().toLowerCase() ===
                        countryLabel.trim().toLowerCase()) {
                    return countryCode;
                }
            }
        }
        return null;
    }
}
exports.RefData = RefData;
RefData.countriesListForCurrentLanguage = [];
RefData.currentLanguageCode = shared_constants_1.defaultAppLanguage;
RefData.languages = [];
RefData.languagesListInitialized = false;
RefData.countriesListInitialized = false;
//# sourceMappingURL=ref-data.js.map