import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';
import { List } from 'linqts';
import { refreshTokenLsKey } from '../../../shared/shared-constants';
import { AuthToolsService, DecodeTokenResponse } from '../auth-tools.service';
import { CookieHelpers } from '../tools/cookie-helpers';
import { UsersService } from '../users.service';
import { ExpiredTokenException } from './expired-token-exception';

export abstract class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        protected jwtService: JwtService,
        protected usersService: UsersService,
    ) {
        super('jwt');
    }

    async canActivate(context: ExecutionContext) {
        return await this.canAccessForRole(context);
    }

    handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }

    async canAccessForRole(
        context: ExecutionContext,
        roles?: string[],
    ): Promise<boolean> {
        // if (Environment.EnvName === 'development')
        //     return true;
        const request = AuthToolsService.getRequestFromContext(context);
        const decodeResponse = this.getAccessTokenFromHeadersOrCookie(request);
        if (decodeResponse?.payload) {
            if (roles?.length) {
                return (
                    decodeResponse.payload.roles &&
                    new List(roles)
                        .Intersect(new List(decodeResponse.payload.roles))
                        .Any()
                );
            } else return true;
        } else {
            // const tokenDefined = this.isJwtTokenDefinedInHeaderOrCookie(context);
            // if (tokenDefined) {
            //     const httpResponse = AuthToolsService.getResponseFromContext(context);
            //     httpResponse.set('nxs-force-logout', 'true');
            //     console.log('Setting nxs-force-logout');
            // }
        }
        if (decodeResponse.error === 'TokenExpiredError') {
            let refreshTokenOk = false;
            if (request) {
                const refreshTokenFromCookie = CookieHelpers.getCookie(
                    request,
                    refreshTokenLsKey,
                );
                if (refreshTokenFromCookie) {
                    const findUserResponse = await this.usersService.findOne({
                        where: { refreshToken: refreshTokenFromCookie },
                    });
                    refreshTokenOk =
                        findUserResponse.success &&
                        findUserResponse.user &&
                        !findUserResponse.user.disabled;
                }
            }
            if (!refreshTokenOk) throw new ExpiredTokenException();
            else return true;
        }
        return false;
    }

    private isJwtTokenDefinedInHeaderOrCookie(context: ExecutionContext) {
        const request = AuthToolsService.getRequestFromContext(context);
        if (!request) return false;
        if (request.headers && request.headers.authorization) {
            const jwtToken = AuthToolsService.getJwtTokenFromAuthHeader(
                request.headers.authorization,
            );
            if (!!jwtToken) return true;
        }
        const accessTokenCookie = CookieHelpers.getCookie(
            request,
            'access_token',
        );
        if (!accessTokenCookie) return false;
        if (!!accessTokenCookie) return true;
        return false;
    }

    private getAccessTokenFromHeadersOrCookie(
        request: FastifyRequest,
    ): DecodeTokenResponse {
        if (!request) return { error: 'NoRequestData' };
        let decodeResponse = AuthToolsService.getJwtPayloadFromRequest(
            this.jwtService,
            request,
            false,
        );
        if (decodeResponse.error !== 'NoTokenError') {
            return decodeResponse;
        }
        const accessTokenCookie = CookieHelpers.getCookie(
            request,
            'access_token',
        );
        if (!accessTokenCookie) return { error: 'NoTokenError' };
        decodeResponse = AuthToolsService.decodeToken(
            this.jwtService,
            accessTokenCookie,
            false,
        );
        return decodeResponse;
    }
}
