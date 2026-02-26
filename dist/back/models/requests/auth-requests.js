"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginWithTokenRequest = exports.LoginResponse = exports.SendRecoverPasswordMailRequest = exports.UpdateUserPasswordRequest = exports.BackToOriginalRequest = exports.LogAsRequest = exports.SocialLoginRequest = exports.LoginViewModel = exports.RegisterRequest = void 0;
const swagger_1 = require("@nestjs/swagger");
const generic_response_1 = require("../responses/generic-response");
class RegisterRequest {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'email of user',
        required: false,
        type: String,
    }),
    __metadata("design:type", String)
], RegisterRequest.prototype, "mail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'password of user',
        required: false,
        type: String,
    }),
    __metadata("design:type", String)
], RegisterRequest.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'firstName of user',
        required: false,
        type: String,
    }),
    __metadata("design:type", String)
], RegisterRequest.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'lastName of user',
        required: false,
        type: String,
    }),
    __metadata("design:type", String)
], RegisterRequest.prototype, "lastName", void 0);
exports.RegisterRequest = RegisterRequest;
class LoginViewModel {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LoginViewModel.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LoginViewModel.prototype, "password", void 0);
exports.LoginViewModel = LoginViewModel;
class SocialLoginRequest extends RegisterRequest {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SocialLoginRequest.prototype, "facebookUserId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SocialLoginRequest.prototype, "googleUserId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SocialLoginRequest.prototype, "twitterUserId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SocialLoginRequest.prototype, "photoUrl", void 0);
exports.SocialLoginRequest = SocialLoginRequest;
class LogAsRequest {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'userId',
        required: true,
        type: String,
    }),
    __metadata("design:type", String)
], LogAsRequest.prototype, "userId", void 0);
exports.LogAsRequest = LogAsRequest;
class BackToOriginalRequest {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'requesterToken',
        required: true,
        type: String,
    }),
    __metadata("design:type", String)
], BackToOriginalRequest.prototype, "requesterToken", void 0);
exports.BackToOriginalRequest = BackToOriginalRequest;
class UpdateUserPasswordRequest {
}
__decorate([
    (0, swagger_1.ApiProperty)({ required: true }),
    __metadata("design:type", String)
], UpdateUserPasswordRequest.prototype, "recoverPasswordToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true }),
    __metadata("design:type", String)
], UpdateUserPasswordRequest.prototype, "newPassword", void 0);
exports.UpdateUserPasswordRequest = UpdateUserPasswordRequest;
class SendRecoverPasswordMailRequest {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SendRecoverPasswordMailRequest.prototype, "mail", void 0);
exports.SendRecoverPasswordMailRequest = SendRecoverPasswordMailRequest;
class LoginResponse extends generic_response_1.GenericResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LoginResponse.prototype, "refreshToken", void 0);
exports.LoginResponse = LoginResponse;
class LoginWithTokenRequest {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LoginWithTokenRequest.prototype, "loginToken", void 0);
exports.LoginWithTokenRequest = LoginWithTokenRequest;
//# sourceMappingURL=auth-requests.js.map