import { FileHelpers } from 'nextalys-node-helpers';
import * as path from 'path';
import { CacheManager } from '../../shared/cache-manager';
import { AvailableLanguageCodes } from '../../shared/shared-constants';
import { Environment } from '../environment/environment';
import { TranslationDto } from '../models/dto/translation-dto';
import { AppLogger } from './tools/logger.service';

interface TranslationsKeyValue {
    [key: string]: string;
}

interface TranslationData {
    lang: string;
    values: TranslationsKeyValue;
}

const AppTranslationsKeyPrefix = 'translations_';

export class TranslationService {
    static translationsData: TranslationData[] = [];

    static getStaticTranslationFile(languageCode: string) {
        return path.join(
            Environment.ApiBasePath,
            '..',
            Environment.EnvName === 'development' ? 'front' : 'browser',
            Environment.EnvName === 'development' ? 'src' : '',
            'assets',
            'i18n',
            languageCode + '.json',
        );
    }

    static async loadTranslationFile(languageCode: string) {
        if (!languageCode) {
            return;
        }

        const filePath = this.getStaticTranslationFile(languageCode);
        const fileContent = (await FileHelpers.readFile(
            filePath,
            true,
        )) as string;
        let langTranslations = this.translationsData.find(
            (x) => x.lang === languageCode,
        );

        if (!langTranslations) {
            langTranslations = { lang: languageCode, values: {} };
            this.translationsData.push(langTranslations);
        }

        try {
            if (!fileContent) {
                throw new Error(
                    'Unable to get translation file for lang ' +
                        languageCode +
                        ' - file : ' +
                        filePath,
                );
            }

            langTranslations.values = JSON.parse(fileContent);
            await CacheManager.storageProvider.setObject(
                AppTranslationsKeyPrefix + languageCode,
                langTranslations,
            );
        } catch (err) {
            await AppLogger.error('loadTranslationFile ERROR', err);
            langTranslations.values = {};
        }
        // console.log("Log: TranslationService -> loadTranslationFile -> this.translationsData", this.translationsData);
    }

    static async loadAllTranslationsFiles() {
        for (const languageCode of AvailableLanguageCodes) {
            await TranslationService.loadTranslationFile(languageCode);
        }
    }

    static async getTranslation(languageCode: string, key: string) {
        if (!languageCode || !key) {
            return;
        }

        let langTranslations = this.translationsData.find(
            (x) => x.lang === languageCode,
        );

        if (!langTranslations) {
            console.log('loading traduction from cache');
            langTranslations = { lang: languageCode, values: {} };
            this.translationsData.push(langTranslations);
            const langTranslationsFromCache =
                await CacheManager.getDataFromCache<TranslationData>(
                    [languageCode],
                    AppTranslationsKeyPrefix + languageCode,
                    'lang',
                    null,
                    null,
                    '1',
                    null,
                );

            if (
                langTranslationsFromCache &&
                langTranslationsFromCache.length > 0
            ) {
                langTranslations.values = langTranslationsFromCache[0].values;
            }
        }

        key = key.trim();

        if (
            langTranslations &&
            langTranslations.values &&
            Object.keys(langTranslations.values).length > 0
        ) {
            if (key.indexOf('.') !== -1 && key.indexOf(' ') === -1) {
                const arr = key.split('.');
                if (arr.length === 2)
                    return langTranslations.values[arr[0]][arr[1]];
                else if (arr.length === 3)
                    return langTranslations.values[arr[0]][arr[1]][arr[2]];
                else
                    return langTranslations.values[arr[0]][arr[1]][arr[2]][
                        arr[3]
                    ];
            }

            return langTranslations.values[key] || key;
        }

        return null;
    }

    static getDbTranslation<T extends { translations?: TranslationDto[] }>(
        item: T,
        fieldName: keyof T,
        languageId: string,
    ) {
        if (!fieldName || !item) {
            return null;
        }

        if (!item.translations?.length || !languageId) {
            return item[fieldName];
        }

        const translation = item.translations.find(
            (x) => x.entityField === fieldName && x.languageId === languageId,
        );

        if (!translation) {
            return item[fieldName];
        }

        return translation.value;
    }
}
