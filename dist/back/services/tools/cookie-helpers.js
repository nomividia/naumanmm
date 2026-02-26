"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieHelpers = void 0;
class CookieHelpers {
    static setCookie(reply, key, value, options) {
        if (!reply)
            return;
        reply.setCookie(key, value, options);
    }
    static getCookie(req, key) {
        if (!req || !req.cookies)
            return null;
        return req.cookies[key];
    }
    static deleteCookie(reply, key, options) {
        if (!reply)
            return;
        reply.clearCookie(key, options);
    }
}
exports.CookieHelpers = CookieHelpers;
//# sourceMappingURL=cookie-helpers.js.map