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
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const linqts_1 = require("linqts");
const shared_constants_1 = require("../../../shared/shared-constants");
const auth_tools_service_1 = require("../auth-tools.service");
const cookie_helpers_1 = require("../tools/cookie-helpers");
const expired_token_exception_1 = require("./expired-token-exception");
class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(jwtService, usersService) {
        super('jwt');
        this.jwtService = jwtService;
        this.usersService = usersService;
    }
    canActivate(context) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.canAccessForRole(context);
        });
    }
    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new common_1.UnauthorizedException();
        }
        return user;
    }
    canAccessForRole(context, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = auth_tools_service_1.AuthToolsService.getRequestFromContext(context);
            const decodeResponse = this.getAccessTokenFromHeadersOrCookie(request);
            if (decodeResponse === null || decodeResponse === void 0 ? void 0 : decodeResponse.payload) {
                if (roles === null || roles === void 0 ? void 0 : roles.length) {
                    return (decodeResponse.payload.roles &&
                        new linqts_1.List(roles)
                            .Intersect(new linqts_1.List(decodeResponse.payload.roles))
                            .Any());
                }
                else
                    return true;
            }
            else {
            }
            if (decodeResponse.error === 'TokenExpiredError') {
                let refreshTokenOk = false;
                if (request) {
                    const refreshTokenFromCookie = cookie_helpers_1.CookieHelpers.getCookie(request, shared_constants_1.refreshTokenLsKey);
                    if (refreshTokenFromCookie) {
                        const findUserResponse = yield this.usersService.findOne({
                            where: { refreshToken: refreshTokenFromCookie },
                        });
                        refreshTokenOk =
                            findUserResponse.success &&
                                findUserResponse.user &&
                                !findUserResponse.user.disabled;
                    }
                }
                if (!refreshTokenOk)
                    throw new expired_token_exception_1.ExpiredTokenException();
                else
                    return true;
            }
            return false;
        });
    }
    isJwtTokenDefinedInHeaderOrCookie(context) {
        const request = auth_tools_service_1.AuthToolsService.getRequestFromContext(context);
        if (!request)
            return false;
        if (request.headers && request.headers.authorization) {
            const jwtToken = auth_tools_service_1.AuthToolsService.getJwtTokenFromAuthHeader(request.headers.authorization);
            if (!!jwtToken)
                return true;
        }
        const accessTokenCookie = cookie_helpers_1.CookieHelpers.getCookie(request, 'access_token');
        if (!accessTokenCookie)
            return false;
        if (!!accessTokenCookie)
            return true;
        return false;
    }
    getAccessTokenFromHeadersOrCookie(request) {
        if (!request)
            return { error: 'NoRequestData' };
        let decodeResponse = auth_tools_service_1.AuthToolsService.getJwtPayloadFromRequest(this.jwtService, request, false);
        if (decodeResponse.error !== 'NoTokenError') {
            return decodeResponse;
        }
        const accessTokenCookie = cookie_helpers_1.CookieHelpers.getCookie(request, 'access_token');
        if (!accessTokenCookie)
            return { error: 'NoTokenError' };
        decodeResponse = auth_tools_service_1.AuthToolsService.decodeToken(this.jwtService, accessTokenCookie, false);
        return decodeResponse;
    }
}
exports.JwtAuthGuard = JwtAuthGuard;
//# sourceMappingURL=jwt-auth-guard.js.map