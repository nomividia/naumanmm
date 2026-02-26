import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users.service';
declare const JwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare abstract class JwtAuthGuard extends JwtAuthGuard_base {
    protected jwtService: JwtService;
    protected usersService: UsersService;
    constructor(jwtService: JwtService, usersService: UsersService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    handleRequest(err: any, user: any, info: any): any;
    canAccessForRole(context: ExecutionContext, roles?: string[]): Promise<boolean>;
    private isJwtTokenDefinedInHeaderOrCookie;
    private getAccessTokenFromHeadersOrCookie;
}
export {};
