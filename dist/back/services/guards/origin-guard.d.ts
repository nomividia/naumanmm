import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class OriginGuard implements CanActivate {
    private readonly allowedOrigins;
    canActivate(context: ExecutionContext): boolean;
}
