import { TranslationDto } from '../models/dto/translation-dto';
interface TranslationsKeyValue {
    [key: string]: string;
}
interface TranslationData {
    lang: string;
    values: TranslationsKeyValue;
}
export declare class TranslationService {
    static translationsData: TranslationData[];
    static getStaticTranslationFile(languageCode: string): string;
    static loadTranslationFile(languageCode: string): Promise<void>;
    static loadAllTranslationsFiles(): Promise<void>;
    static getTranslation(languageCode: string, key: string): Promise<any>;
    static getDbTranslation<T extends {
        translations?: TranslationDto[];
    }>(item: T, fieldName: keyof T, languageId: string): string | T[keyof T];
}
export {};
