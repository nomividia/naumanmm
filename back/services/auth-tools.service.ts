import {
    ExecutionContext,
    Inject,
    Injectable,
    Optional,
    Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';
import { additionalUserFieldsForTokenPayload } from '../../shared/auth';
import { JwtPayload } from '../../shared/jwt-payload';
import { UserDto } from '../models/dto/user-dto';
import { additionalUserFieldsForTokenPayloadFunction } from './auth-custom-rules';
import { ApplicationBaseService } from './base-service';
import { CookieHelpers } from './tools/cookie-helpers';

export type JwtDecodeError =
    | 'TokenExpiredError'
    | 'JsonWebTokenError'
    | 'NoTokenError'
    | 'NoRequestData';

export interface DecodeTokenResponse {
    payload?: JwtPayload;
    error?: JwtDecodeError;
}

@Injectable({ scope: Scope.REQUEST })
export class AuthToolsService extends ApplicationBaseService {
    constructor(
        @Optional()
        @Inject(REQUEST)
        public readonly fastifyRequest: FastifyRequest,
        public readonly jwtService: JwtService,
    ) {
        super();
    }

    getLanguagesFromRequest() {
        return (this.fastifyRequest as any)?.languages?.();
    }

    getLanguageFromRequest() {
        return this.getLanguagesFromRequest()?.[0];
    }

    getLanguageFromHeader(): 'fr' | 'en' {
        let lang = this.fastifyRequest?.headers?.['nxs-lang'] || 'en';
        if (typeof lang !== 'string') {
            return 'en';
        }
        return lang as any;
    }

    getLanguageFromRequestSplitted() {
        let lang = this.getLanguageFromRequest();
        if (lang.indexOf('-') !== -1) {
            lang = lang.split('-')[0];
        }
        return lang;
    }

    public static createUserToken(jwtService: JwtService, user: UserDto) {
        try {
            if (!user) return null;
            let roles: string[] = [];
            if (user.roles) roles = user.roles.map((x) => x.role);
            const payload: JwtPayload = {
                id: user.id,
                userName: user.userName,
                roles: roles,
                language: user.language,
                languageId: user.languageId,
                mail: user.mail,
                firstName: user.firstName,
                imageName: user.image?.name || null,
                imagePhysicalName: user.image?.physicalName || null,
            };
            for (const fieldName of additionalUserFieldsForTokenPayload) {
                (payload as any)[fieldName] = (user as any)[fieldName];
            }
            additionalUserFieldsForTokenPayloadFunction(payload, user);
            // return jwtService.sign(payload, { expiresIn: '1day' });
            return jwtService.sign(payload, { expiresIn: '10h' });
            // return jwtService.sign(payload, { expiresIn: 15 });
        } catch (err) {
            console.log(err);
        }
    }

    public static getRequestFromContext(
        context: ExecutionContext,
    ): FastifyRequest {
        if (!context) return null;
        const httpContext = context.switchToHttp();
        if (!httpContext) return null;
        const request = httpContext.getRequest<FastifyRequest>();
        if (!request) return null;
        return request;
    }

    public static getResponseFromContext(
        context: ExecutionContext,
    ): FastifyReply {
        if (!context) return null;
        const httpContext = context.switchToHttp();
        if (!httpContext) return null;
        const response = httpContext.getResponse();
        if (!response) return null;
        return response;
    }

    public static getJwtPayloadFromRequest(
        jwtService: JwtService,
        request: FastifyRequest,
        ignoreExpiration: boolean,
    ): DecodeTokenResponse {
        if (!request || !request.headers || !request.headers.authorization)
            return { error: 'NoTokenError' };
        return AuthToolsService.getJwtPayloadFromAuthHeader(
            jwtService,
            request.headers.authorization,
            ignoreExpiration,
        );
    }

    public static getJwtTokenFromAuthHeader(
        authorizationHeader: string,
    ): string {
        if (
            authorizationHeader &&
            authorizationHeader.indexOf('Bearer') !== -1
        ) {
            const tokenArray = authorizationHeader.split('Bearer ');
            if (tokenArray.length > 1) {
                return tokenArray[1];
            }
        }
        return null;
    }

    public static getJwtPayloadFromAuthHeader(
        jwtService: JwtService,
        authorizationHeader: string,
        ignoreExpiration: boolean,
    ): DecodeTokenResponse {
        const jwtToken = this.getJwtTokenFromAuthHeader(authorizationHeader);
        if (jwtToken)
            return AuthToolsService.decodeToken(
                jwtService,
                jwtToken,
                ignoreExpiration,
            );
        return { error: 'NoTokenError' };
    }

    public static decodeToken(
        jwtService: JwtService,
        encodedToken: string,
        ignoreExpiration: boolean,
    ): DecodeTokenResponse {
        let decoded: JwtPayload = null;
        let error: JwtDecodeError;
        try {
            decoded = jwtService.verify(encodedToken, {
                ignoreExpiration: ignoreExpiration,
            });
        } catch (err) {
            if (err?.name) error = err.name;
        }
        return { payload: decoded, error: error };
    }

    public getCurrentPayload(ignoreExpiration: boolean): JwtPayload {
        if (!this.fastifyRequest) return null;
        return AuthToolsService.getJwtPayloadFromRequest(
            this.jwtService,
            this.fastifyRequest,
            ignoreExpiration,
        ).payload;
    }

    public getCurrentPayloadFromHeaderOrCookie(
        ignoreExpiration: boolean,
    ): JwtPayload {
        if (!this.fastifyRequest) return null;
        const jwtPayload = AuthToolsService.getJwtPayloadFromRequest(
            this.jwtService,
            this.fastifyRequest,
            ignoreExpiration,
        ).payload;
        if (jwtPayload) return jwtPayload;

        const accessTokenCookie = CookieHelpers.getCookie(
            this.fastifyRequest,
            'access_token',
        );
        if (!accessTokenCookie) return null;
        const decodeResponse = AuthToolsService.decodeToken(
            this.jwtService,
            accessTokenCookie,
            ignoreExpiration,
        );
        if (!decodeResponse.error) return decodeResponse.payload;
        return null;
    }
}
