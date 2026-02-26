import { Observable, Subject } from 'rxjs';
import { Environment } from '../../environment/environment';
const redis = require('redis');

type RedisChannel = 'PlanJobs';
export class RedisManager {
    private static Prefix = Environment.db_name + '_';
    private static ObsChannels: { [index: string]: Subject<string> } = {};
    private static getRedisClient() {
        let client: any = null;
        try {
            client = redis.createClient({
                retry_strategy: (options) => {
                    if (
                        options.error &&
                        options.error.code === 'ECONNREFUSED'
                    ) {
                        // End reconnecting on a specific error and flush all commands with
                        // a individual error
                        return new Error('The server refused the connection');
                    }
                    if (options.total_retry_time > 1000 * 60 * 2) {
                        // End reconnecting after a specific timeout and flush all commands
                        // with a individual error
                        return new Error('Retry time exhausted');
                    }
                    if (options.attempt > 10) {
                        // End reconnecting with built in error
                        return undefined;
                    }
                    // reconnect after
                    return Math.min(options.attempt * 100, 3000);
                },
            });
            client.on('error', (error) => {});
        } catch (err) {
            console.error(err);
        }
        return client;
    }

    public static remove(key: string) {
        return new Promise<void>((resolve, reject) => {
            if (!Environment.UseRedis) {
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

    public static get(key: string) {
        return new Promise<string>((resolve, reject) => {
            if (!Environment.UseRedis) {
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

    public static async getObject<T>(key: string) {
        const val = await this.get(key);
        if (val) return JSON.parse(val) as T;
        return null;
    }

    public static set(key: string, value: string) {
        return new Promise((resolve, reject) => {
            if (!Environment.UseRedis) {
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

    public static async setObject(key: string, value: any) {
        if (typeof value === 'undefined') value = null;
        return await this.set(key, JSON.stringify(value));
    }

    public static send(channel: RedisChannel, value?: string) {
        if (!value) value = '';
        if (!Environment.UseRedis) {
            if (!this.ObsChannels[channel]) {
                this.ObsChannels[channel] = new Subject<string>();
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

    public static onMessage(channel: RedisChannel) {
        if (!Environment.UseRedis) {
            if (!this.ObsChannels[channel]) {
                this.ObsChannels[channel] = new Subject<string>();
            }
            return this.ObsChannels[channel].asObservable();
        }

        return new Observable<string>((observer) => {
            const client = this.getRedisClient();
            if (!client) {
                observer.error('Redis client cannot be instanciated');
                return;
            }
            client.subscribe(this.Prefix + channel); //subscribe to Pub channel
            client.on('message', (channelArg, message) => {
                observer.next(message);
            });
        });
    }
}
