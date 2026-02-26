"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthToolsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthToolsService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const auth_1 = require("../../shared/auth");
const auth_custom_rules_1 = require("./auth-custom-rules");
const base_service_1 = require("./base-service");
const cookie_helpers_1 = require("./tools/cookie-helpers");
let AuthToolsService = AuthToolsService_1 = class AuthToolsService extends base_service_1.ApplicationBaseService {
    constructor(fastifyRequest, jwtService) {
        super();
        this.fastifyRequest = fastifyRequest;
        this.jwtService = jwtService;
    }
    getLanguagesFromRequest() {
        var _a, _b;
        return (_b = (_a = this.fastifyRequest) === null || _a === void 0 ? void 0 : _a.languages) === null || _b === void 0 ? void 0 : _b.call(_a);
    }
    getLanguageFromRequest() {
        var _a;
        return (_a = this.getLanguagesFromRequest()) === null || _a === void 0 ? void 0 : _a[0];
    }
    getLanguageFromHeader() {
        var _a, _b;
        let lang = ((_b = (_a = this.fastifyRequest) === null || _a === void 0 ? void 0 : _a.headers) === null || _b === void 0 ? void 0 : _b['nxs-lang']) || 'en';
        if (typeof lang !== 'string') {
            return 'en';
        }
        return lang;
    }
    getLanguageFromRequestSplitted() {
        let lang = this.getLanguageFromRequest();
        if (lang.indexOf('-') !== -1) {
            lang = lang.split('-')[0];
        }
        return lang;
    }
    static createUserToken(jwtService, user) {
        var _a, _b;
        try {
            if (!user)
                return null;
            let roles = [];
            if (user.roles)
                roles = user.roles.map((x) => x.role);
            const payload = {
                id: user.id,
                userName: user.userName,
                roles: roles,
                language: user.language,
                languageId: user.languageId,
                mail: user.mail,
                firstName: user.firstName,
                imageName: ((_a = user.image) === null || _a === void 0 ? void 0 : _a.name) || null,
                imagePhysicalName: ((_b = user.image) === null || _b === void 0 ? void 0 : _b.physicalName) || null,
            };
            for (const fieldName of auth_1.additionalUserFieldsForTokenPayload) {
                payload[fieldName] = user[fieldName];
            }
            (0, auth_custom_rules_1.additionalUserFieldsForTokenPayloadFunction)(payload, user);
            return jwtService.sign(payload, { expiresIn: '10h' });
        }
        catch (err) {
            console.log(err);
        }
    }
    static getRequestFromContext(context) {
        if (!context)
            return null;
        const httpContext = context.switchToHttp();
        if (!httpContext)
            return null;
        const request = httpContext.getRequest();
        if (!request)
            return null;
        return request;
    }
    static getResponseFromContext(context) {
        if (!context)
            return null;
        const httpContext = context.switchToHttp();
        if (!httpContext)
            return null;
        const response = httpContext.getResponse();
        if (!response)
            return null;
        return response;
    }
    static getJwtPayloadFromRequest(jwtService, request, ignoreExpiration) {
        if (!request || !request.headers || !request.headers.authorization)
            return { error: 'NoTokenError' };
        return AuthToolsService_1.getJwtPayloadFromAuthHeader(jwtService, request.headers.authorization, ignoreExpiration);
    }
    static getJwtTokenFromAuthHeader(authorizationHeader) {
        if (authorizationHeader &&
            authorizationHeader.indexOf('Bearer') !== -1) {
            const tokenArray = authorizationHeader.split('Bearer ');
            if (tokenArray.length > 1) {
                return tokenArray[1];
            }
        }
        return null;
    }
    static getJwtPayloadFromAuthHeader(jwtService, authorizationHeader, ignoreExpiration) {
        const jwtToken = this.getJwtTokenFromAuthHeader(authorizationHeader);
        if (jwtToken)
            return AuthToolsService_1.decodeToken(jwtService, jwtToken, ignoreExpiration);
        return { error: 'NoTokenError' };
    }
    static decodeToken(jwtService, encodedToken, ignoreExpiration) {
        let decoded = null;
        let error;
        try {
            decoded = jwtService.verify(encodedToken, {
                ignoreExpiration: ignoreExpiration,
            });
        }
        catch (err) {
            if (err === null || err === void 0 ? void 0 : err.name)
                error = err.name;
        }
        return { payload: decoded, error: error };
    }
    getCurrentPayload(ignoreExpiration) {
        if (!this.fastifyRequest)
            return null;
        return AuthToolsService_1.getJwtPayloadFromRequest(this.jwtService, this.fastifyRequest, ignoreExpiration).payload;
    }
    getCurrentPayloadFromHeaderOrCookie(ignoreExpiration) {
        if (!this.fastifyRequest)
            return null;
        const jwtPayload = AuthToolsService_1.getJwtPayloadFromRequest(this.jwtService, this.fastifyRequest, ignoreExpiration).payload;
        if (jwtPayload)
            return jwtPayload;
        const accessTokenCookie = cookie_helpers_1.CookieHelpers.getCookie(this.fastifyRequest, 'access_token');
        if (!accessTokenCookie)
            return null;
        const decodeResponse = AuthToolsService_1.decodeToken(this.jwtService, accessTokenCookie, ignoreExpiration);
        if (!decodeResponse.error)
            return decodeResponse.payload;
        return null;
    }
};
AuthToolsService = AuthToolsService_1 = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Optional)()),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object, jwt_1.JwtService])
], AuthToolsService);
exports.AuthToolsService = AuthToolsService;
//# sourceMappingURL=auth-tools.service.js.map