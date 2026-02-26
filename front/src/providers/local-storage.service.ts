import { AppLocalStorage } from 'nextalys-js-helpers/dist/browser-helpers';
export class LocalStorageService {
    static throwsException = false;

    static init(throwsException: boolean) {
        this.throwsException = throwsException;
        AppLocalStorage.init(this.throwsException);
    }

    public static saveInLocalStorage(key: string, value: string): void {
        AppLocalStorage.setString(key, value);
    }

    public static saveObjectInLocalStorage(key: string, value: any): void {
        AppLocalStorage.setItem(key, value);
    }

    public static getObjectFromLocalStorage<T = any>(key: string): T {
        return AppLocalStorage.getItem<T>(key);
    }

    public static removeFromLocalStorage(key: string): void {
        AppLocalStorage.removeItem(key);
    }

    public static getFromLocalStorage(key: string): string {
        return AppLocalStorage.getString(key);
    }

    public static getAllKeys(keyStartsWith?: string): string[] {
        return AppLocalStorage.getAllKeys(keyStartsWith);
    }
}
