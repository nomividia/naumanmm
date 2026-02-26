import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users.service';
import { JwtAuthGuard } from './jwt-auth-guard';
export declare class RolesGuard extends JwtAuthGuard {
    private readonly reflector;
    constructor(reflector: Reflector, jwtService: JwtService, usersService: UsersService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
