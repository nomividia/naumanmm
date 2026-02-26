import { CookieSerializeOptions } from '@fastify/cookie';
import { FastifyReply, FastifyRequest } from 'fastify';
export class CookieHelpers {
    static setCookie(
        reply: FastifyReply,
        key: string,
        value: string,
        options?: CookieSerializeOptions,
    ) {
        if (!(reply as any)) return;
        reply.setCookie(key, value, options);
    }

    static getCookie(req: FastifyRequest, key: string) {
        if (!req || !(req as any).cookies) return null;
        return req.cookies[key];
    }

    static deleteCookie(
        reply: FastifyReply,
        key: string,
        options: CookieSerializeOptions,
    ) {
        if (!(reply as any)) return;
        reply.clearCookie(key, options);
    }
}
