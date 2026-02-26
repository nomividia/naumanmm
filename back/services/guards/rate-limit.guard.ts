import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

interface RateLimitRecord {
    count: number;
    resetTime: number;
}

@Injectable()
export class RateLimitGuard implements CanActivate {
    private requests = new Map<string, RateLimitRecord>();
    private readonly maxRequests = 100; // Max requests per window
    private readonly windowMs = 15 * 60 * 1000; // 15 minutes

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<FastifyRequest>();
        const ip = request.ip || request.headers['x-forwarded-for'] || 'unknown';
        
        const now = Date.now();
        const record = this.requests.get(ip as string);

        if (!record || now > record.resetTime) {
            this.requests.set(ip as string, {
                count: 1,
                resetTime: now + this.windowMs,
            });
            return true;
        }

        if (record.count >= this.maxRequests) {
            throw new HttpException(
                'Too many requests, please try again later',
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }

        record.count++;
        return true;
    }
}
