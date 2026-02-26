import {
    CacheManager,
    ICacheStorageProvider,
} from '../../../shared/cache-manager';
import { Environment } from '../../environment/environment';
import { RedisManager } from './redis.manager';

export class InMemoryCache {
    static localDict: { key: string; value?: string }[] = [];

    public static save(key: string, value: string): void {
        let data = this.localDict.find((x) => x.key === key);
        if (!data) {
            data = { key };
            this.localDict.push(data);
        }
        data.value = value;
    }

    public static saveObject(key: string, value: any): void {
        if (!value) value = null;
        this.save(key, JSON.stringify(value));
    }

    public static getObject<T>(key: string): any {
        const value = this.get(key);
        if (!value) return null;
        let obj = null;
        try {
            obj = JSON.parse(value);
        } catch (err) {
            console.error('getObject', err);
        }
        return obj as T;
    }

    public static remove(key: string): void {
        const index = this.localDict.findIndex((x) => x.key === key);
        if (index !== -1) this.localDict.splice(index, 1);
    }

    public static get(key: string): string {
        const data = this.localDict.find((x) => x.key === key);
        if (data) return data.value;
        return null;
    }
}
export class BackCacheProvider implements ICacheStorageProvider {
    localDict: { key: string; value: any }[] = [];

    removeKey(key: string): Promise<void> {
        if (!Environment.UseRedis || !Environment.UseRedisCache) {
            return new Promise<void>((resolve) => {
                InMemoryCache.remove(key);
                resolve();
            });
        }
        return RedisManager.remove(key);
    }

    getObject<T>(key: string): Promise<T> {
        if (!Environment.UseRedis || !Environment.UseRedisCache) {
            return new Promise<T>((resolve) => {
                resolve(InMemoryCache.getObject<T>(key));
            });
        }
        return RedisManager.getObject<T>(key);
    }

    getString(key: string): Promise<string> {
        if (!Environment.UseRedis || !Environment.UseRedisCache) {
            return new Promise<string>((resolve) => {
                resolve(InMemoryCache.get(key));
            });
        }
        return RedisManager.get(key);
    }

    setObject(key: string, value: any): Promise<void> {
        if (!Environment.UseRedis || !Environment.UseRedisCache) {
            return new Promise<void>((resolve) => {
                InMemoryCache.saveObject(key, value);
                resolve();
            });
        }
        return RedisManager.setObject(key, value) as Promise<void>;
    }
}
export class BackCacheManager {
    static initialized = false;
    static init() {
        if (this.initialized) return;
        CacheManager.verbose = Environment.EnvName === 'development';
        CacheManager.storageProvider = new BackCacheProvider();
        this.initialized = true;
    }

    static async setValue(key: string, value: any) {
        // console.log('set in back cache manager', key, value);
        await CacheManager.storageProvider.setObject(key, value);
    }
    static async getValue<T = any>(key: string) {
        // const fromCache = await CacheManager.storageProvider.getObject<T>(key);
        // console.log('get from back cache manager', key, fromCache);
        return await CacheManager.storageProvider.getObject<T>(key);
    }
}
