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
exports.RedisManager = void 0;
const rxjs_1 = require("rxjs");
const environment_1 = require("../../environment/environment");
const redis = require('redis');
class RedisManager {
    static getRedisClient() {
        let client = null;
        try {
            client = redis.createClient({
                retry_strategy: (options) => {
                    if (options.error &&
                        options.error.code === 'ECONNREFUSED') {
                        return new Error('The server refused the connection');
                    }
                    if (options.total_retry_time > 1000 * 60 * 2) {
                        return new Error('Retry time exhausted');
                    }
                    if (options.attempt > 10) {
                        return undefined;
                    }
                    return Math.min(options.attempt * 100, 3000);
                },
            });
            client.on('error', (error) => { });
        }
        catch (err) {
            console.error(err);
        }
        return client;
    }
    static remove(key) {
        return new Promise((resolve, reject) => {
            if (!environment_1.Environment.UseRedis) {
                resolve(null);
                return;
            }
            const client = this.getRedisClient();
            if (!client) {
                reject('Redis client cannot be instanciated');
                return;
            }
            client.del(this.Prefix + key, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    static get(key) {
        return new Promise((resolve, reject) => {
            if (!environment_1.Environment.UseRedis) {
                resolve(null);
                return;
            }
            const client = this.getRedisClient();
            if (!client) {
                reject('Redis client cannot be instanciated');
                return;
            }
            client.get(this.Prefix + key, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data);
            });
        });
    }
    static getObject(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const val = yield this.get(key);
            if (val)
                return JSON.parse(val);
            return null;
        });
    }
    static set(key, value) {
        return new Promise((resolve, reject) => {
            if (!environment_1.Environment.UseRedis) {
                resolve();
                return;
            }
            const client = this.getRedisClient();
            if (!client) {
                reject('Redis client cannot be instanciated');
                return;
            }
            client.set(this.Prefix + key, value, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data);
            });
        });
    }
    static setObject(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof value === 'undefined')
                value = null;
            return yield this.set(key, JSON.stringify(value));
        });
    }
    static send(channel, value) {
        if (!value)
            value = '';
        if (!environment_1.Environment.UseRedis) {
            if (!this.ObsChannels[channel]) {
                this.ObsChannels[channel] = new rxjs_1.Subject();
            }
            this.ObsChannels[channel].next(value);
            return;
        }
        const client = this.getRedisClient();
        if (!client) {
            return;
        }
        client.publish(this.Prefix + channel, value);
    }
    static onMessage(channel) {
        if (!environment_1.Environment.UseRedis) {
            if (!this.ObsChannels[channel]) {
                this.ObsChannels[channel] = new rxjs_1.Subject();
            }
            return this.ObsChannels[channel].asObservable();
        }
        return new rxjs_1.Observable((observer) => {
            const client = this.getRedisClient();
            if (!client) {
                observer.error('Redis client cannot be instanciated');
                return;
            }
            client.subscribe(this.Prefix + channel);
            client.on('message', (channelArg, message) => {
                observer.next(message);
            });
        });
    }
}
exports.RedisManager = RedisManager;
RedisManager.Prefix = environment_1.Environment.db_name + '_';
RedisManager.ObsChannels = {};
//# sourceMappingURL=redis.manager.js.map