import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Environment } from '../../environment/environment';

@Injectable()
export class OriginGuard implements CanActivate {
    private readonly allowedOrigins: string[] = [
        Environment.BaseURL,
        'https://login.morganmallet.agency',
        'https://morganmallet.agency',
    ];

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<FastifyRequest>();
        const origin = request.headers.origin || request.headers.referer;

        // Allow requests without origin (e.g., direct API calls from server, Postman in dev)
        if (Environment.EnvName === 'development' && !origin) {
            return true;
        }

        // Check if origin is allowed
        if (origin) {
            const isAllowed = this.allowedOrigins.some((allowed) =>
                origin.startsWith(allowed),
            );

            if (isAllowed) {
                return true;
            }
        }

        throw new ForbiddenException('Access denied: Invalid origin');
    }
}
