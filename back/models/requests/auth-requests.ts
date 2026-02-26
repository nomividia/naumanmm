import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GenericResponse } from '../responses/generic-response';

export class RegisterRequest {
    @ApiProperty({
        description: 'email of user',
        required: false,
        type: String,
    })
    mail?: string;

    @ApiProperty({
        description: 'password of user',
        required: false,
        type: String,
    })
    password?: string;

    @ApiProperty({
        description: 'firstName of user',
        required: false,
        type: String,
    })
    firstName?: string;

    @ApiProperty({
        description: 'lastName of user',
        required: false,
        type: String,
    })
    lastName?: string;
}

export class LoginViewModel {
    @ApiProperty()
    userName: string;

    @ApiProperty()
    password: string;
}

export class SocialLoginRequest extends RegisterRequest {
    @ApiPropertyOptional()
    facebookUserId?: string;

    @ApiPropertyOptional()
    googleUserId?: string;

    @ApiPropertyOptional()
    twitterUserId?: string;

    @ApiPropertyOptional()
    photoUrl?: string;
}

export class LogAsRequest {
    @ApiProperty({
        description: 'userId',
        required: true,
        type: String,
    })
    userId: string;
}

export class BackToOriginalRequest {
    @ApiProperty({
        description: 'requesterToken',
        required: true,
        type: String,
    })
    requesterToken: string;
}

export class UpdateUserPasswordRequest {
    @ApiProperty({ required: true })
    recoverPasswordToken: string;

    @ApiProperty({ required: true })
    newPassword: string;
}

export class SendRecoverPasswordMailRequest {
    @ApiProperty()
    mail: string;
}

export class LoginResponse extends GenericResponse {
    @ApiProperty()
    refreshToken: string;
}

export class LoginWithTokenRequest {
    @ApiProperty()
    loginToken: string;
}
