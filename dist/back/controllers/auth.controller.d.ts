import { FastifyRequest } from 'fastify';
import { BackToOriginalRequest, LogAsRequest, LoginResponse, LoginViewModel, LoginWithTokenRequest, RegisterRequest, SendRecoverPasswordMailRequest, SocialLoginRequest, UpdateUserPasswordRequest } from '../models/requests/auth-requests';
import { GenericResponse } from '../models/responses/generic-response';
import { AuthToolsService } from '../services/auth-tools.service';
import { AuthService } from '../services/auth.service';
import { BaseController } from '../shared/base.controller';
export declare class AuthController extends BaseController {
    private readonly authService;
    private readonly authToolsService;
    constructor(authService: AuthService, authToolsService: AuthToolsService);
    login(loginViewModel: LoginViewModel): Promise<LoginResponse>;
    refreshToken(request: FastifyRequest): Promise<GenericResponse>;
    register(request: RegisterRequest): Promise<GenericResponse>;
    socialLogin(request: SocialLoginRequest): Promise<GenericResponse>;
    logAs(request: LogAsRequest): Promise<GenericResponse>;
    backToOriginalRequester(request: BackToOriginalRequest): Promise<GenericResponse>;
    changeUserPasswordFromRecoverToken(request: UpdateUserPasswordRequest): Promise<GenericResponse>;
    sendRecoverPasswordMail(request: SendRecoverPasswordMailRequest): Promise<GenericResponse>;
    getUpdatedAccessToken(): Promise<GenericResponse>;
    loginWithToken(req: LoginWithTokenRequest): Promise<LoginResponse>;
}
