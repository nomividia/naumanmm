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
exports.TranslationService = void 0;
const nextalys_node_helpers_1 = require("nextalys-node-helpers");
const path = require("path");
const cache_manager_1 = require("../../shared/cache-manager");
const shared_constants_1 = require("../../shared/shared-constants");
const environment_1 = require("../environment/environment");
const logger_service_1 = require("./tools/logger.service");
const AppTranslationsKeyPrefix = 'translations_';
class TranslationService {
    static getStaticTranslationFile(languageCode) {
        return path.join(environment_1.Environment.ApiBasePath, '..', environment_1.Environment.EnvName === 'development' ? 'front' : 'browser', environment_1.Environment.EnvName === 'development' ? 'src' : '', 'assets', 'i18n', languageCode + '.json');
    }
    static loadTranslationFile(languageCode) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!languageCode) {
                return;
            }
            const filePath = this.getStaticTranslationFile(languageCode);
            const fileContent = (yield nextalys_node_helpers_1.FileHelpers.readFile(filePath, true));
            let langTranslations = this.translationsData.find((x) => x.lang === languageCode);
            if (!langTranslations) {
                langTranslations = { lang: languageCode, values: {} };
                this.translationsData.push(langTranslations);
            }
            try {
                if (!fileContent) {
                    throw new Error('Unable to get translation file for lang ' +
                        languageCode +
                        ' - file : ' +
                        filePath);
                }
                langTranslations.values = JSON.parse(fileContent);
                yield cache_manager_1.CacheManager.storageProvider.setObject(AppTranslationsKeyPrefix + languageCode, langTranslations);
            }
            catch (err) {
                yield logger_service_1.AppLogger.error('loadTranslationFile ERROR', err);
                langTranslations.values = {};
            }
        });
    }
    static loadAllTranslationsFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const languageCode of shared_constants_1.AvailableLanguageCodes) {
                yield TranslationService.loadTranslationFile(languageCode);
            }
        });
    }
    static getTranslation(languageCode, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!languageCode || !key) {
                return;
            }
            let langTranslations = this.translationsData.find((x) => x.lang === languageCode);
            if (!langTranslations) {
                console.log('loading traduction from cache');
                langTranslations = { lang: languageCode, values: {} };
                this.translationsData.push(langTranslations);
                const langTranslationsFromCache = yield cache_manager_1.CacheManager.getDataFromCache([languageCode], AppTranslationsKeyPrefix + languageCode, 'lang', null, null, '1', null);
                if (langTranslationsFromCache &&
                    langTranslationsFromCache.length > 0) {
                    langTranslations.values = langTranslationsFromCache[0].values;
                }
            }
            key = key.trim();
            if (langTranslations &&
                langTranslations.values &&
                Object.keys(langTranslations.values).length > 0) {
                if (key.indexOf('.') !== -1 && key.indexOf(' ') === -1) {
                    const arr = key.split('.');
                    if (arr.length === 2)
                        return langTranslations.values[arr[0]][arr[1]];
                    else if (arr.length === 3)
                        return langTranslations.values[arr[0]][arr[1]][arr[2]];
                    else
                        return langTranslations.values[arr[0]][arr[1]][arr[2]][arr[3]];
                }
                return langTranslations.values[key] || key;
            }
            return null;
        });
    }
    static getDbTranslation(item, fieldName, languageId) {
        var _a;
        if (!fieldName || !item) {
            return null;
        }
        if (!((_a = item.translations) === null || _a === void 0 ? void 0 : _a.length) || !languageId) {
            return item[fieldName];
        }
        const translation = item.translations.find((x) => x.entityField === fieldName && x.languageId === languageId);
        if (!translation) {
            return item[fieldName];
        }
        return translation.value;
    }
}
exports.TranslationService = TranslationService;
TranslationService.translationsData = [];
//# sourceMappingURL=translation.service.js.map