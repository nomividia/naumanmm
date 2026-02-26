"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedCandidatesHelpers = void 0;
const nextalys_js_helpers_1 = require("nextalys-js-helpers");
const common_file_helpers_1 = require("nextalys-js-helpers/dist/common-file-helpers");
const shared_constants_1 = require("./shared-constants");
class SharedCandidatesHelpers {
    static generateCandidateFileName(candidateFile, candidate, format) {
        var _a;
        let label = "new-file";
        if (!((_a = candidateFile === null || candidateFile === void 0 ? void 0 : candidateFile.fileType) === null || _a === void 0 ? void 0 : _a.code)) {
            return label;
        }
        switch (candidateFile.fileType.code) {
            case shared_constants_1.CandidateFileType.VariousDiploma:
                label = "Diplôme";
                break;
            case shared_constants_1.CandidateFileType.LastThreeLettersOfReference:
                label = "Lettre de référence";
                break;
            case shared_constants_1.CandidateFileType.LastThreeWorkCertificates:
                label = "Certificat";
                break;
            case shared_constants_1.CandidateFileType.PhotoOfDishes:
                label = "Photo";
                break;
            case shared_constants_1.CandidateFileType.Other:
                label = "Autre document";
                break;
            case shared_constants_1.CandidateFileType.MainPhoto:
                label = "Photo";
                break;
            case shared_constants_1.CandidateFileType.MainResume:
                label = "CV";
                break;
            case shared_constants_1.CandidateFileType.Passport:
                label = "Passeport";
                break;
            case shared_constants_1.CandidateFileType.IdentityCard:
                label = "CNI";
                break;
            case shared_constants_1.CandidateFileType.SalarySheets:
                label = "Fiche de salaire";
                break;
        }
        if (candidateFile.fileType.code !== shared_constants_1.CandidateFileType.Other &&
            candidate &&
            ((candidate === null || candidate === void 0 ? void 0 : candidate.firstName) || (candidate === null || candidate === void 0 ? void 0 : candidate.lastName))) {
            label += "-" + candidate.firstName + "-" + candidate.lastName;
        }
        if (format) {
            label = nextalys_js_helpers_1.MainHelpers.formatToUrl(label);
        }
        return label;
    }
    static getCandidateFileNameWithExtension(fileWrapper) {
        var _a, _b;
        if (!((_a = fileWrapper === null || fileWrapper === void 0 ? void 0 : fileWrapper.file) === null || _a === void 0 ? void 0 : _a.mimeType)) {
            return ((_b = fileWrapper === null || fileWrapper === void 0 ? void 0 : fileWrapper.file) === null || _b === void 0 ? void 0 : _b.name) || "";
        }
        return (fileWrapper.file.name +
            "." +
            common_file_helpers_1.CommonFileHelpers.getFileExtensionFromMimeType(fileWrapper.file.mimeType));
    }
    static getCandidateMainLanguage(candidateDto, appLanguages) {
        var _a, _b;
        let candidateLanguage = candidateDto === null || candidateDto === void 0 ? void 0 : candidateDto.language;
        if (appLanguages === null || appLanguages === void 0 ? void 0 : appLanguages.length) {
            const candidateLanguagesList = candidateDto === null || candidateDto === void 0 ? void 0 : candidateDto.candidateLanguages;
            if (candidateLanguagesList === null || candidateLanguagesList === void 0 ? void 0 : candidateLanguagesList.length) {
                let candidateLanguageCode = null;
                const orderedLevels = [
                    shared_constants_1.LevelLanguage.Maternelle,
                    shared_constants_1.LevelLanguage.Courant,
                    shared_constants_1.LevelLanguage.Scolaire,
                ];
                for (const langLevel of orderedLevels) {
                    const langFoundItem = candidateLanguagesList.find((x) => {
                        var _a, _b;
                        return ((_a = x === null || x === void 0 ? void 0 : x.levelLanguage) === null || _a === void 0 ? void 0 : _a.code) &&
                            ((_b = x === null || x === void 0 ? void 0 : x.levelLanguage) === null || _b === void 0 ? void 0 : _b.code) === langLevel;
                    });
                    if (langFoundItem === null || langFoundItem === void 0 ? void 0 : langFoundItem.languageCode) {
                        candidateLanguageCode = langFoundItem.languageCode;
                        break;
                    }
                }
                if (!candidateLanguageCode) {
                    candidateLanguageCode =
                        (_b = (_a = candidateDto === null || candidateDto === void 0 ? void 0 : candidateDto.candidateLanguages) === null || _a === void 0 ? void 0 : _a.map((x) => x === null || x === void 0 ? void 0 : x.languageCode)) === null || _b === void 0 ? void 0 : _b[0];
                }
                if (candidateLanguageCode) {
                    candidateLanguage = appLanguages === null || appLanguages === void 0 ? void 0 : appLanguages.find((x) => x.code === candidateLanguageCode);
                }
            }
        }
        return candidateLanguage;
    }
    static getCandidateOrUserMainLanguage(candidateDto, userDto, referentialService) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            let appLanguage = userDto === null || userDto === void 0 ? void 0 : userDto.language;
            let getLanguagesResponse;
            let isDefaultLanguage = false;
            if (!appLanguage) {
                if (referentialService) {
                    getLanguagesResponse =
                        yield (referentialService === null || referentialService === void 0 ? void 0 : referentialService.getAllLanguages());
                }
                if (!!(userDto === null || userDto === void 0 ? void 0 : userDto.languageId)) {
                    appLanguage = (_a = getLanguagesResponse === null || getLanguagesResponse === void 0 ? void 0 : getLanguagesResponse.languages) === null || _a === void 0 ? void 0 : _a.find((x) => x.id === userDto.languageId);
                }
                if (!appLanguage) {
                    appLanguage = SharedCandidatesHelpers.getCandidateMainLanguage(candidateDto, getLanguagesResponse === null || getLanguagesResponse === void 0 ? void 0 : getLanguagesResponse.languages);
                }
            }
            if (!appLanguage &&
                ((_b = getLanguagesResponse === null || getLanguagesResponse === void 0 ? void 0 : getLanguagesResponse.languages) === null || _b === void 0 ? void 0 : _b.length) &&
                ((_c = candidateDto === null || candidateDto === void 0 ? void 0 : candidateDto.addresses) === null || _c === void 0 ? void 0 : _c.length)) {
                const country = (_e = (_d = candidateDto === null || candidateDto === void 0 ? void 0 : candidateDto.addresses) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.country;
                if (country) {
                    const langCode = SharedCandidatesHelpers.getDefaultLanguage(null, country);
                    if (langCode) {
                        appLanguage = (_f = getLanguagesResponse === null || getLanguagesResponse === void 0 ? void 0 : getLanguagesResponse.languages) === null || _f === void 0 ? void 0 : _f.find((x) => x.code === langCode);
                        isDefaultLanguage = true;
                    }
                }
            }
            return { language: appLanguage, isDefaultLanguage };
        });
    }
    static getMailSenderFromCandidate(candidateDto, userDto, referentialService, consultantEmail) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            let jobAppTypeCode;
            let appLanguage;
            if (candidateDto) {
                jobAppTypeCode = (_d = (_c = (_b = (_a = candidateDto === null || candidateDto === void 0 ? void 0 : candidateDto.candidateCurrentJobs) === null || _a === void 0 ? void 0 : _a.find((x) => { var _a, _b; return !!((_b = (_a = x === null || x === void 0 ? void 0 : x.currentJob) === null || _a === void 0 ? void 0 : _a.appType) === null || _b === void 0 ? void 0 : _b.code); })) === null || _b === void 0 ? void 0 : _b.currentJob) === null || _c === void 0 ? void 0 : _c.appType) === null || _d === void 0 ? void 0 : _d.code;
            }
            if (candidateDto || userDto) {
                const response = yield this.getCandidateOrUserMainLanguage(candidateDto, userDto, referentialService);
                appLanguage = response.language;
            }
            return this.getMailSender(jobAppTypeCode, appLanguage === null || appLanguage === void 0 ? void 0 : appLanguage.code, undefined, consultantEmail);
        });
    }
    static getMailSenderFromCandidateApplication(candidateApplication, forceLangCode, consultantEmail) {
        var _a, _b, _c, _d, _e;
        const jobAppTypeCode = (_b = (_a = candidateApplication === null || candidateApplication === void 0 ? void 0 : candidateApplication.profession) === null || _a === void 0 ? void 0 : _a.appType) === null || _b === void 0 ? void 0 : _b.code;
        const country = ((_d = (_c = candidateApplication === null || candidateApplication === void 0 ? void 0 : candidateApplication.addresses) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.country) ||
            ((_e = candidateApplication === null || candidateApplication === void 0 ? void 0 : candidateApplication.address) === null || _e === void 0 ? void 0 : _e.country);
        return this.getMailSender(jobAppTypeCode, forceLangCode, country, consultantEmail);
    }
    static getLanguageFromCandidateApplication(candidateApplication) {
        var _a, _b, _c;
        const country = ((_b = (_a = candidateApplication === null || candidateApplication === void 0 ? void 0 : candidateApplication.addresses) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.country) ||
            ((_c = candidateApplication === null || candidateApplication === void 0 ? void 0 : candidateApplication.address) === null || _c === void 0 ? void 0 : _c.country);
        return SharedCandidatesHelpers.getDefaultLanguage(null, country);
    }
    static getLanguageFromCandidate(candidateDto, referentialService) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.getCandidateOrUserMainLanguage(candidateDto, null, referentialService);
            return response.language;
        });
    }
    static getMailSender(jobAppTypeCode, lang, countryCode, consultantEmail) {
        return shared_constants_1.AppMainSender;
        const personnelDeMaisonMailSenderFR = "contact@personneldemaison.agency";
        const personnelDeMaisonMailSenderEN = "contact@householdstaff.agency";
        const yachtingMailSenderFR = "contact@recrutementyacht.agency";
        const yachtingMailSenderEN = "contact@yachtcrew.agency";
        lang = SharedCandidatesHelpers.getDefaultLanguage(lang, countryCode);
        let mailSender = personnelDeMaisonMailSenderFR;
        if (lang === "en") {
            mailSender = personnelDeMaisonMailSenderEN;
        }
        if (jobAppTypeCode) {
            switch (jobAppTypeCode) {
                case shared_constants_1.AppTypes.JobCategoryCode:
                    switch (lang) {
                        case "fr":
                            mailSender = personnelDeMaisonMailSenderFR;
                            break;
                        case "en":
                            mailSender = personnelDeMaisonMailSenderEN;
                            break;
                    }
                    break;
                case shared_constants_1.AppTypes.JobNannyCategoryCode:
                    switch (lang) {
                        case "fr":
                            mailSender = personnelDeMaisonMailSenderFR;
                            break;
                        case "en":
                            mailSender = personnelDeMaisonMailSenderEN;
                            break;
                    }
                    break;
                case shared_constants_1.AppTypes.JobYachtingCategoryCode:
                    switch (lang) {
                        case "fr":
                            mailSender = yachtingMailSenderFR;
                            break;
                        case "en":
                            mailSender = yachtingMailSenderEN;
                            break;
                    }
                    break;
            }
        }
        return mailSender;
    }
    static getDefaultLanguage(lang, countryCode) {
        if (!lang && !!countryCode) {
            switch (countryCode.toLowerCase()) {
                case "fr":
                case "ch":
                    lang = "fr";
                    break;
                case "ai":
                case "us":
                case "gb":
                case "au":
                case "za":
                    lang = "en";
                    break;
                default:
                    lang = "en";
            }
        }
        if (!lang) {
            lang = "en";
        }
        if (lang !== "fr" && lang !== "en") {
            lang = "en";
        }
        return lang;
    }
}
exports.SharedCandidatesHelpers = SharedCandidatesHelpers;
//# sourceMappingURL=candidates-helpers.js.map