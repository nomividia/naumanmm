export interface ICacheStorageProvider {
    getObject<T>(key: string): Promise<T>;
    getString(key: string): Promise<string>;
    setObject(key: string, value: any): Promise<void>;
    removeKey(key: string): Promise<void>;
}
export interface CacheData<T> {
    data?: T;
    saveDate?: number;
    appVersion: string;
}
export declare class CacheManager {
    static storageProvider: ICacheStorageProvider;
    static verbose: boolean;
    static log(...args: any[]): void;
    static getDataFromCache<T>(keys: string[], localStorageKey: string, dataKeyField: string, getDataMethod: (joinedKeys: string[]) => Promise<{
        success: boolean;
        message?: string;
    }>, getDataResponseField: string, appVersion: string, expirationTime?: number): Promise<T[]>;
    static getDataFromCacheSimple<T>(localStorageKey: string, getDataMethod: () => Promise<{
        success: boolean;
        message?: string;
    }>, getDataResponseField: string, appVersion: string, expirationTime?: number): Promise<T>;
    static removeFromCacheSimple(localStorageKey: string): Promise<void>;
    static removeFromCache<T>(keys: string[], localStorageKey: string, dataKeyField: string): Promise<void>;
}
