import { DateHelpers } from "nextalys-js-helpers";

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

export class CacheManager {
    public static storageProvider: ICacheStorageProvider;

    public static verbose = false;

    public static log(...args: any[]) {
        if (!this.verbose) {
            return;
        }

        console.log(...args);
    }

    /**
     * @param keys object keys to load
     * @param localStorageKey key in storage
     * @param dataKeyField property field unique to identify data
     * @param getDataMethod method to load data that is not in cache
     * @param getDataResponseField field from response that contains the loaded data
     * @param appVersion application version
     * @param expirationTime expiration time (in hours)
     */
    public static async getDataFromCache<T>(
        keys: string[],
        localStorageKey: string,
        dataKeyField: string,
        getDataMethod: (
            joinedKeys: string[]
        ) => Promise<{ success: boolean; message?: string }>,
        getDataResponseField: string,
        appVersion: string,
        expirationTime?: number
    ): Promise<T[]> {
        const dataNeedRefresh: string[] = [];
        let valuesToReturn: T[] = [];
        let valuesFromLocalStorage: CacheData<T>[];

        if (this.storageProvider) {
            //check in local storage
            valuesFromLocalStorage = await this.storageProvider.getObject(
                localStorageKey
            );

            if (valuesFromLocalStorage && valuesFromLocalStorage.length) {
                for (const valueFromLocalStorage of valuesFromLocalStorage) {
                    if (!valueFromLocalStorage || !valueFromLocalStorage.data) {
                        continue;
                    }

                    const dataKeyValue = (valueFromLocalStorage.data as any)[
                        dataKeyField
                    ];

                    if (
                        !dataKeyValue ||
                        (keys != null && keys.indexOf(dataKeyValue) === -1)
                    ) {
                        continue;
                    }

                    if (
                        !valueFromLocalStorage.saveDate ||
                        !valueFromLocalStorage.appVersion ||
                        valueFromLocalStorage.appVersion !== appVersion
                    ) {
                        dataNeedRefresh.push(dataKeyValue);

                        continue;
                    }

                    let expired = false;

                    if (!!expirationTime && expirationTime > 0) {
                        const dateExpiration = DateHelpers.addHoursToDate(
                            new Date(valueFromLocalStorage.saveDate),
                            expirationTime
                        );

                        expired =
                            dateExpiration.getTime() <= new Date().getTime();
                    }

                    if (expired) {
                        dataNeedRefresh.push(dataKeyValue);
                    } else {
                        // console.log('getting app type from local storage => ', appTypeWrapper.appType.code);
                        // this.log('get data from cache => ', valueFromLocalStorage.data);
                        valuesToReturn.push(valueFromLocalStorage.data);
                    }
                }
            } else if (keys == null) {
                //here to force update when no key passed
                dataNeedRefresh.push("DUMMY_STRING_TO_GET_FULL_DATA");
            }
        }

        if (!valuesFromLocalStorage) {
            valuesFromLocalStorage = [];
        }

        if (keys != null) {
            for (const key of keys) {
                if (
                    !valuesToReturn.some(
                        (x) => (x as any)[dataKeyField] === key
                    ) &&
                    dataNeedRefresh.indexOf(key) === -1
                ) {
                    dataNeedRefresh.push(key);
                }
            }
        }

        if (dataNeedRefresh.length === 0) {
            return valuesToReturn;
        }

        if (!getDataMethod) {
            return valuesToReturn;
        }

        if (keys != null) {
            this.log("calling api for codes => ", dataNeedRefresh.join(","));
        } else {
            this.log("calling api for all data " + localStorageKey);
        }

        const getValuesResponse = await getDataMethod(dataNeedRefresh);

        if (!getValuesResponse.success) {
            throw new Error(getValuesResponse.message);
        }

        if (keys == null) {
            valuesFromLocalStorage = [];
            valuesToReturn = [];
        }

        for (const value of (getValuesResponse as any)[getDataResponseField]) {
            let dataFromLs = valuesFromLocalStorage.find(
                (x) =>
                    !!x.data &&
                    (x.data as any)[dataKeyField] === value[dataKeyField]
            );

            if (!dataFromLs || keys == null) {
                dataFromLs = { appVersion: appVersion };
                valuesFromLocalStorage.push(dataFromLs);
            }

            dataFromLs.appVersion = appVersion;
            dataFromLs.data = value;
            dataFromLs.saveDate = Date.now();
            valuesToReturn.push(value);
        }

        if (this.storageProvider) {
            // this.log('save codes in storage => ', valuesFromLocalStorage);
            await this.storageProvider.setObject(
                localStorageKey,
                valuesFromLocalStorage
            );
        }

        return valuesToReturn;
    }

    /**
     * @param localStorageKey key in storage
     * @param getDataMethod method to load data that is not in cache
     * @param getDataResponseField field from response that contains the loaded data
     * @param appVersion application version
     * @param expirationTime expiration time (in hours)
     */
    public static async getDataFromCacheSimple<T>(
        localStorageKey: string,
        getDataMethod: () => Promise<{ success: boolean; message?: string }>,
        getDataResponseField: string,
        appVersion: string,
        expirationTime?: number
    ): Promise<T> {
        let dataNeedRefresh = true;
        let valueFromLocalStorage: CacheData<T>;

        if (this.storageProvider) {
            //check in local storage
            valueFromLocalStorage = await this.storageProvider.getObject(
                localStorageKey
            );
            if (valueFromLocalStorage) {
                if (
                    !valueFromLocalStorage.saveDate ||
                    !valueFromLocalStorage.appVersion ||
                    valueFromLocalStorage.appVersion !== appVersion
                ) {
                    dataNeedRefresh = true;
                } else {
                    let expired = false;

                    if (!!expirationTime && expirationTime > 0) {
                        const dateExpiration = DateHelpers.addHoursToDate(
                            new Date(valueFromLocalStorage.saveDate),
                            expirationTime
                        );
                        expired =
                            dateExpiration.getTime() <= new Date().getTime();
                    }

                    if (expired) {
                        dataNeedRefresh = true;
                    } else {
                        dataNeedRefresh = false;
                    }
                }
            }
            if (!dataNeedRefresh && valueFromLocalStorage) {
                return valueFromLocalStorage.data;
            }
        }

        if (!getDataMethod) {
            return null;
        }

        this.log("calling api for all data " + localStorageKey);
        const getValuesResponse = await getDataMethod();

        if (!getValuesResponse.success) {
            throw new Error(getValuesResponse.message);
        }

        valueFromLocalStorage = {
            data: (getValuesResponse as any)[getDataResponseField],
            appVersion: appVersion,
            saveDate: Date.now(),
        };

        if (this.storageProvider) {
            // this.log('save codes in storage => ', valuesFromLocalStorage);
            await this.storageProvider.setObject(
                localStorageKey,
                valueFromLocalStorage
            );
        }

        return valueFromLocalStorage.data;
    }

    static async removeFromCacheSimple(localStorageKey: string) {
        if (!this.storageProvider) {
            return;
        }

        await this.storageProvider.removeKey(localStorageKey);
    }

    static async removeFromCache<T>(
        keys: string[],
        localStorageKey: string,
        dataKeyField: string
    ) {
        if (!this.storageProvider) {
            return;
        }

        let valuesFromLocalStorage: CacheData<T>[] =
            await this.storageProvider.getObject(localStorageKey);

        if (!valuesFromLocalStorage) {
            return;
        }

        valuesFromLocalStorage = valuesFromLocalStorage.filter(
            (x) =>
                !!x.data && keys.indexOf((x.data as any)[dataKeyField]) === -1
        );

        await this.storageProvider.setObject(
            localStorageKey,
            valuesFromLocalStorage
        );
    }
}
