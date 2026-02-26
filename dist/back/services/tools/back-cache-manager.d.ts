import { ICacheStorageProvider } from '../../../shared/cache-manager';
export declare class InMemoryCache {
    static localDict: {
        key: string;
        value?: string;
    }[];
    static save(key: string, value: string): void;
    static saveObject(key: string, value: any): void;
    static getObject<T>(key: string): any;
    static remove(key: string): void;
    static get(key: string): string;
}
export declare class BackCacheProvider implements ICacheStorageProvider {
    localDict: {
        key: string;
        value: any;
    }[];
    removeKey(key: string): Promise<void>;
    getObject<T>(key: string): Promise<T>;
    getString(key: string): Promise<string>;
    setObject(key: string, value: any): Promise<void>;
}
export declare class BackCacheManager {
    static initialized: boolean;
    static init(): void;
    static setValue(key: string, value: any): Promise<void>;
    static getValue<T = any>(key: string): Promise<T>;
}
