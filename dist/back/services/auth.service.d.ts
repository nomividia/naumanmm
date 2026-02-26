import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { GetUserResponse, UserDto } from '../models/dto/user-dto';
import { BackToOriginalRequest, LogAsRequest, LoginResponse, LoginViewModel, RegisterRequest, SocialLoginRequest } from '../models/requests/auth-requests';
import { GenericResponse } from '../models/responses/generic-response';
import { ActivityLogsService } from '../modules/activity-logs/activity-logs.service';
import { AuthToolsService } from './auth-tools.service';
import { ApplicationBaseService } from './base-service';
import { MailService } from './tools/mail.service';
import { UsersService } from './users.service';
export declare class AuthService extends ApplicationBaseService {
    usersService: UsersService;
    readonly jwtService: JwtService;
    private readonly activityLogsService;
    private mailService;
    constructor(usersService: UsersService, jwtService: JwtService, activityLogsService: ActivityLogsService, mailService: MailService);
    login(loginViewModel: LoginViewModel, loginToken: string): Promise<LoginResponse>;
    private createAndSaveRefreshTokenIfNeeded;
    refreshToken(request: FastifyRequest): Promise<LoginResponse>;
    register(request: RegisterRequest): Promise<GenericResponse>;
    loginWithSocialProvider(request: SocialLoginRequest): Promise<GenericResponse>;
    logAs(request: LogAsRequest): Promise<GenericResponse>;
    backToOriginalRequester(request: BackToOriginalRequest): Promise<GenericResponse>;
    generateRecoverPasswordToken(user: UserDto, mustGenerateToken?: boolean, expirationInDays?: number): Promise<GetUserResponse>;
    sendRecoverPasswordMail(mail: string): Promise<GenericResponse>;
    changeUserPasswordFromRecoverToken(recoverToken: string, userPassword: string): Promise<GenericResponse>;
    getUpdatedAccessToken(authToolsService: AuthToolsService): Promise<GenericResponse>;
    loginWithToken(): void;
}
