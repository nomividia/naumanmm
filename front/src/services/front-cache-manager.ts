import {
    CacheManager,
    ICacheStorageProvider,
} from '../../../shared/cache-manager';
import { environment } from '../environments/environment';
import { LocalStorageService } from '../providers/local-storage.service';
export class FrontCacheProvider implements ICacheStorageProvider {
    removeKey(key: string): Promise<void> {
        try {
            LocalStorageService.removeFromLocalStorage(key);
        } catch (error) {
            console.error(error);
        }

        return Promise.resolve();
    }

    getObject<T>(key: string): Promise<T> {
        let obj: any = null;
        try {
            obj = LocalStorageService.getObjectFromLocalStorage(key);
        } catch (error) {
            console.error(error);
        }

        return Promise.resolve(obj);
    }

    getString(key: string): Promise<string> {
        let obj: string;
        try {
            obj = LocalStorageService.getFromLocalStorage(key);
        } catch (error) {
            console.error(error);
        }

        return Promise.resolve(obj);
    }

    setObject(key: string, value: any): Promise<void> {
        try {
            LocalStorageService.saveObjectInLocalStorage(key, value);
        } catch (error) {
            console.error(error);
        }

        return Promise.resolve();
    }
}

export class FrontCacheManager {
    static initialized = false;

    static init() {
        if (this.initialized) {
            return;
        }

        CacheManager.verbose = !environment.production;
        CacheManager.storageProvider = new FrontCacheProvider();
        this.initialized = true;
    }
}
