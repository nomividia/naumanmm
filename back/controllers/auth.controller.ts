import {
    Body,
    Controller,
    HttpCode,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { RolesList } from '../../shared/shared-constants';
import {
    BackToOriginalRequest,
    LogAsRequest,
    LoginResponse,
    LoginViewModel,
    LoginWithTokenRequest,
    RegisterRequest,
    SendRecoverPasswordMailRequest,
    SocialLoginRequest,
    UpdateUserPasswordRequest,
} from '../models/requests/auth-requests';
import { GenericResponse } from '../models/responses/generic-response';
import { AuthToolsService } from '../services/auth-tools.service';
import { AuthService } from '../services/auth.service';
import { RolesGuard } from '../services/guards/roles-guard';
import { Roles } from '../services/roles.decorator';
import { BaseController } from '../shared/base.controller';

@Controller('auth')
@ApiTags('auth')
export class AuthController extends BaseController {
    constructor(
        private readonly authService: AuthService,
        private readonly authToolsService: AuthToolsService,
    ) {
        super();
    }

    @Post('login')
    @ApiOperation({ summary: 'Login user', operationId: 'login' })
    @ApiResponse({
        status: 200,
        description: 'Login response',
        type: LoginResponse,
    })
    @HttpCode(200)
    async login(
        @Body() loginViewModel: LoginViewModel,
    ): Promise<LoginResponse> {
        return await this.authService.login(loginViewModel, null);
    }

    @Post('refresh-token')
    @ApiOperation({ summary: 'refresh token', operationId: 'refreshToken' })
    @ApiResponse({
        status: 200,
        description: 'Generic Response',
        type: GenericResponse,
    })
    @HttpCode(200)
    async refreshToken(
        @Req() request: FastifyRequest,
    ): Promise<GenericResponse> {
        return await this.authService.refreshToken(request);
    }

    @Post('register')
    @ApiOperation({ summary: 'register', operationId: 'register' })
    @ApiResponse({
        status: 200,
        description: 'Generic Response',
        type: GenericResponse,
    })
    @HttpCode(200)
    async register(@Body() request: RegisterRequest): Promise<GenericResponse> {
        return await this.authService.register(request);
    }

    @Post('social-login')
    @ApiOperation({ summary: 'register', operationId: 'socialLogin' })
    @ApiResponse({
        status: 200,
        description: 'Generic Response',
        type: GenericResponse,
    })
    @HttpCode(200)
    @ApiBearerAuth()
    async socialLogin(
        @Body() request: SocialLoginRequest,
    ): Promise<GenericResponse> {
        return await this.authService.loginWithSocialProvider(request);
    }

    @Post('log-as')
    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin)
    @ApiOperation({ summary: 'logAs', operationId: 'logAs' })
    @ApiResponse({
        status: 200,
        description: 'Generic Response',
        type: GenericResponse,
    })
    @HttpCode(200)
    @ApiBearerAuth()
    async logAs(@Body() request: LogAsRequest): Promise<GenericResponse> {
        return await this.authService.logAs(request);
    }

    @Post('back-to-original-requester')
    @ApiOperation({
        summary: 'backToOriginalRequester',
        operationId: 'backToOriginalRequester',
    })
    @ApiResponse({
        status: 200,
        description: 'Generic Response',
        type: GenericResponse,
    })
    @HttpCode(200)
    async backToOriginalRequester(
        @Body() request: BackToOriginalRequest,
    ): Promise<GenericResponse> {
        return await this.authService.backToOriginalRequester(request);
    }

    @Post('change-user-password-from-recover-token')
    @ApiOperation({
        summary: 'Update user password',
        operationId: 'changeUserPasswordFromRecoverToken',
    })
    @ApiResponse({
        status: 200,
        description: 'Update user password',
        type: GenericResponse,
    })
    @HttpCode(200)
    async changeUserPasswordFromRecoverToken(
        @Body() request: UpdateUserPasswordRequest,
    ): Promise<GenericResponse> {
        return await this.authService.changeUserPasswordFromRecoverToken(
            request.recoverPasswordToken,
            request.newPassword,
        );
    }

    @Post('send-recover-password-mail')
    @ApiOperation({
        summary: 'Send recover password mail',
        operationId: 'sendRecoverPasswordMail',
    })
    @ApiResponse({
        status: 200,
        description: 'Send recover password mail',
        type: GenericResponse,
    })
    @HttpCode(200)
    async sendRecoverPasswordMail(
        @Body() request: SendRecoverPasswordMailRequest,
    ): Promise<GenericResponse> {
        return await this.authService.sendRecoverPasswordMail(request.mail);
    }

    @UseGuards(RolesGuard)
    @Post('get-updated-access-token')
    @ApiOperation({
        summary: 'get-updated-access-token',
        operationId: 'getUpdatedAccessToken',
    })
    @ApiResponse({
        status: 200,
        description: 'Generic Response',
        type: GenericResponse,
    })
    @HttpCode(200)
    @ApiBearerAuth()
    async getUpdatedAccessToken(): Promise<GenericResponse> {
        return this.authService.getUpdatedAccessToken(this.authToolsService);
    }

    @Post('login-with-token')
    @ApiOperation({
        summary: 'Login user with token',
        operationId: 'loginWithToken',
    })
    @ApiResponse({
        status: 200,
        description: 'Login response',
        type: LoginResponse,
    })
    @HttpCode(200)
    async loginWithToken(
        @Body() req: LoginWithTokenRequest,
    ): Promise<LoginResponse> {
        return await this.authService.login(null, req?.loginToken);
    }
}
