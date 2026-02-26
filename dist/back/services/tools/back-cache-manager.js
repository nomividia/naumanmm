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
exports.BackCacheManager = exports.BackCacheProvider = exports.InMemoryCache = void 0;
const cache_manager_1 = require("../../../shared/cache-manager");
const environment_1 = require("../../environment/environment");
const redis_manager_1 = require("./redis.manager");
class InMemoryCache {
    static save(key, value) {
        let data = this.localDict.find((x) => x.key === key);
        if (!data) {
            data = { key };
            this.localDict.push(data);
        }
        data.value = value;
    }
    static saveObject(key, value) {
        if (!value)
            value = null;
        this.save(key, JSON.stringify(value));
    }
    static getObject(key) {
        const value = this.get(key);
        if (!value)
            return null;
        let obj = null;
        try {
            obj = JSON.parse(value);
        }
        catch (err) {
            console.error('getObject', err);
        }
        return obj;
    }
    static remove(key) {
        const index = this.localDict.findIndex((x) => x.key === key);
        if (index !== -1)
            this.localDict.splice(index, 1);
    }
    static get(key) {
        const data = this.localDict.find((x) => x.key === key);
        if (data)
            return data.value;
        return null;
    }
}
exports.InMemoryCache = InMemoryCache;
InMemoryCache.localDict = [];
class BackCacheProvider {
    constructor() {
        this.localDict = [];
    }
    removeKey(key) {
        if (!environment_1.Environment.UseRedis || !environment_1.Environment.UseRedisCache) {
            return new Promise((resolve) => {
                InMemoryCache.remove(key);
                resolve();
            });
        }
        return redis_manager_1.RedisManager.remove(key);
    }
    getObject(key) {
        if (!environment_1.Environment.UseRedis || !environment_1.Environment.UseRedisCache) {
            return new Promise((resolve) => {
                resolve(InMemoryCache.getObject(key));
            });
        }
        return redis_manager_1.RedisManager.getObject(key);
    }
    getString(key) {
        if (!environment_1.Environment.UseRedis || !environment_1.Environment.UseRedisCache) {
            return new Promise((resolve) => {
                resolve(InMemoryCache.get(key));
            });
        }
        return redis_manager_1.RedisManager.get(key);
    }
    setObject(key, value) {
        if (!environment_1.Environment.UseRedis || !environment_1.Environment.UseRedisCache) {
            return new Promise((resolve) => {
                InMemoryCache.saveObject(key, value);
                resolve();
            });
        }
        return redis_manager_1.RedisManager.setObject(key, value);
    }
}
exports.BackCacheProvider = BackCacheProvider;
class BackCacheManager {
    static init() {
        if (this.initialized)
            return;
        cache_manager_1.CacheManager.verbose = environment_1.Environment.EnvName === 'development';
        cache_manager_1.CacheManager.storageProvider = new BackCacheProvider();
        this.initialized = true;
    }
    static setValue(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield cache_manager_1.CacheManager.storageProvider.setObject(key, value);
        });
    }
    static getValue(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield cache_manager_1.CacheManager.storageProvider.getObject(key);
        });
    }
}
exports.BackCacheManager = BackCacheManager;
BackCacheManager.initialized = false;
//# sourceMappingURL=back-cache-manager.js.map