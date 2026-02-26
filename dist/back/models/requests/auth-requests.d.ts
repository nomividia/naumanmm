import { GenericResponse } from '../responses/generic-response';
export declare class RegisterRequest {
    mail?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
}
export declare class LoginViewModel {
    userName: string;
    password: string;
}
export declare class SocialLoginRequest extends RegisterRequest {
    facebookUserId?: string;
    googleUserId?: string;
    twitterUserId?: string;
    photoUrl?: string;
}
export declare class LogAsRequest {
    userId: string;
}
export declare class BackToOriginalRequest {
    requesterToken: string;
}
export declare class UpdateUserPasswordRequest {
    recoverPasswordToken: string;
    newPassword: string;
}
export declare class SendRecoverPasswordMailRequest {
    mail: string;
}
export declare class LoginResponse extends GenericResponse {
    refreshToken: string;
}
export declare class LoginWithTokenRequest {
    loginToken: string;
}
