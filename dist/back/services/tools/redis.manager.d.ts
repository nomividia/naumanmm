import { Observable } from 'rxjs';
declare type RedisChannel = 'PlanJobs';
export declare class RedisManager {
    private static Prefix;
    private static ObsChannels;
    private static getRedisClient;
    static remove(key: string): Promise<void>;
    static get(key: string): Promise<string>;
    static getObject<T>(key: string): Promise<T>;
    static set(key: string, value: string): Promise<unknown>;
    static setObject(key: string, value: any): Promise<unknown>;
    static send(channel: RedisChannel, value?: string): void;
    static onMessage(channel: RedisChannel): Observable<string>;
}
export {};
