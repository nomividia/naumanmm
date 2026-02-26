import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { Environment } from '../../environment/environment';
import { REQUIRE_API_KEY } from '../decorators/require-api-key.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requireApiKey = this.reflector.get<boolean>(
            REQUIRE_API_KEY,
            context.getHandler(),
        );

        if (!requireApiKey) {
            return true;
        }

        const request = context.switchToHttp().getRequest<FastifyRequest>();
        const apiKey = request.headers['x-api-key'] as string;

        if (!apiKey || apiKey !== Environment.ApiKey) {
            throw new UnauthorizedException('Invalid API key');
        }

        return true;
    }
}
