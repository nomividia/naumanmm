import { CookieSerializeOptions } from '@fastify/cookie';
import { FastifyReply, FastifyRequest } from 'fastify';
export declare class CookieHelpers {
    static setCookie(reply: FastifyReply, key: string, value: string, options?: CookieSerializeOptions): void;
    static getCookie(req: FastifyRequest, key: string): string;
    static deleteCookie(reply: FastifyReply, key: string, options: CookieSerializeOptions): void;
}
