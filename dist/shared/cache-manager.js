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
exports.CacheManager = void 0;
const nextalys_js_helpers_1 = require("nextalys-js-helpers");
class CacheManager {
    static log(...args) {
        if (!this.verbose) {
            return;
        }
        console.log(...args);
    }
    static getDataFromCache(keys, localStorageKey, dataKeyField, getDataMethod, getDataResponseField, appVersion, expirationTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataNeedRefresh = [];
            let valuesToReturn = [];
            let valuesFromLocalStorage;
            if (this.storageProvider) {
                valuesFromLocalStorage = yield this.storageProvider.getObject(localStorageKey);
                if (valuesFromLocalStorage && valuesFromLocalStorage.length) {
                    for (const valueFromLocalStorage of valuesFromLocalStorage) {
                        if (!valueFromLocalStorage || !valueFromLocalStorage.data) {
                            continue;
                        }
                        const dataKeyValue = valueFromLocalStorage.data[dataKeyField];
                        if (!dataKeyValue ||
                            (keys != null && keys.indexOf(dataKeyValue) === -1)) {
                            continue;
                        }
                        if (!valueFromLocalStorage.saveDate ||
                            !valueFromLocalStorage.appVersion ||
                            valueFromLocalStorage.appVersion !== appVersion) {
                            dataNeedRefresh.push(dataKeyValue);
                            continue;
                        }
                        let expired = false;
                        if (!!expirationTime && expirationTime > 0) {
                            const dateExpiration = nextalys_js_helpers_1.DateHelpers.addHoursToDate(new Date(valueFromLocalStorage.saveDate), expirationTime);
                            expired =
                                dateExpiration.getTime() <= new Date().getTime();
                        }
                        if (expired) {
                            dataNeedRefresh.push(dataKeyValue);
                        }
                        else {
                            valuesToReturn.push(valueFromLocalStorage.data);
                        }
                    }
                }
                else if (keys == null) {
                    dataNeedRefresh.push("DUMMY_STRING_TO_GET_FULL_DATA");
                }
            }
            if (!valuesFromLocalStorage) {
                valuesFromLocalStorage = [];
            }
            if (keys != null) {
                for (const key of keys) {
                    if (!valuesToReturn.some((x) => x[dataKeyField] === key) &&
                        dataNeedRefresh.indexOf(key) === -1) {
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
            }
            else {
                this.log("calling api for all data " + localStorageKey);
            }
            const getValuesResponse = yield getDataMethod(dataNeedRefresh);
            if (!getValuesResponse.success) {
                throw new Error(getValuesResponse.message);
            }
            if (keys == null) {
                valuesFromLocalStorage = [];
                valuesToReturn = [];
            }
            for (const value of getValuesResponse[getDataResponseField]) {
                let dataFromLs = valuesFromLocalStorage.find((x) => !!x.data &&
                    x.data[dataKeyField] === value[dataKeyField]);
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
                yield this.storageProvider.setObject(localStorageKey, valuesFromLocalStorage);
            }
            return valuesToReturn;
        });
    }
    static getDataFromCacheSimple(localStorageKey, getDataMethod, getDataResponseField, appVersion, expirationTime) {
        return __awaiter(this, void 0, void 0, function* () {
            let dataNeedRefresh = true;
            let valueFromLocalStorage;
            if (this.storageProvider) {
                valueFromLocalStorage = yield this.storageProvider.getObject(localStorageKey);
                if (valueFromLocalStorage) {
                    if (!valueFromLocalStorage.saveDate ||
                        !valueFromLocalStorage.appVersion ||
                        valueFromLocalStorage.appVersion !== appVersion) {
                        dataNeedRefresh = true;
                    }
                    else {
                        let expired = false;
                        if (!!expirationTime && expirationTime > 0) {
                            const dateExpiration = nextalys_js_helpers_1.DateHelpers.addHoursToDate(new Date(valueFromLocalStorage.saveDate), expirationTime);
                            expired =
                                dateExpiration.getTime() <= new Date().getTime();
                        }
                        if (expired) {
                            dataNeedRefresh = true;
                        }
                        else {
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
            const getValuesResponse = yield getDataMethod();
            if (!getValuesResponse.success) {
                throw new Error(getValuesResponse.message);
            }
            valueFromLocalStorage = {
                data: getValuesResponse[getDataResponseField],
                appVersion: appVersion,
                saveDate: Date.now(),
            };
            if (this.storageProvider) {
                yield this.storageProvider.setObject(localStorageKey, valueFromLocalStorage);
            }
            return valueFromLocalStorage.data;
        });
    }
    static removeFromCacheSimple(localStorageKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.storageProvider) {
                return;
            }
            yield this.storageProvider.removeKey(localStorageKey);
        });
    }
    static removeFromCache(keys, localStorageKey, dataKeyField) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.storageProvider) {
                return;
            }
            let valuesFromLocalStorage = yield this.storageProvider.getObject(localStorageKey);
            if (!valuesFromLocalStorage) {
                return;
            }
            valuesFromLocalStorage = valuesFromLocalStorage.filter((x) => !!x.data && keys.indexOf(x.data[dataKeyField]) === -1);
            yield this.storageProvider.setObject(localStorageKey, valuesFromLocalStorage);
        });
    }
}
exports.CacheManager = CacheManager;
CacheManager.verbose = false;
//# sourceMappingURL=cache-manager.js.map