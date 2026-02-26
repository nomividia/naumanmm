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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const nextalys_js_helpers_1 = require("nextalys-js-helpers");
const candidates_helpers_1 = require("../../shared/candidates-helpers");
const routes_1 = require("../../shared/routes");
const shared_constants_1 = require("../../shared/shared-constants");
const environment_1 = require("../environment/environment");
const app_error_1 = require("../models/app-error");
const user_dto_1 = require("../models/dto/user-dto");
const auth_requests_1 = require("../models/requests/auth-requests");
const generic_response_1 = require("../models/responses/generic-response");
const activity_logs_service_1 = require("../modules/activity-logs/activity-logs.service");
const mail_content_1 = require("../shared/mail-content");
const auth_custom_rules_1 = require("./auth-custom-rules");
const auth_tools_service_1 = require("./auth-tools.service");
const base_service_1 = require("./base-service");
const cookie_helpers_1 = require("./tools/cookie-helpers");
const helpers_service_1 = require("./tools/helpers.service");
const mail_service_1 = require("./tools/mail.service");
const users_service_1 = require("./users.service");
let AuthService = class AuthService extends base_service_1.ApplicationBaseService {
    constructor(usersService, jwtService, activityLogsService, mailService) {
        super();
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.activityLogsService = activityLogsService;
        this.mailService = mailService;
    }
    login(loginViewModel, loginToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new auth_requests_1.LoginResponse();
            try {
                if (!loginViewModel && !loginToken) {
                    throw app_error_1.AppError.getBadRequestError();
                }
                if (loginViewModel &&
                    (!loginViewModel.password || !loginViewModel.userName)) {
                    throw app_error_1.AppError.getBadRequestError();
                }
                let findUserResponse;
                if (loginViewModel) {
                    const findUserWhere = [];
                    for (const userField of auth_custom_rules_1.userFieldsForLogin) {
                        const data = {};
                        data[userField] = loginViewModel.userName;
                        findUserWhere.push(data);
                    }
                    findUserResponse = yield this.usersService.findOne({
                        where: findUserWhere,
                        relations: auth_custom_rules_1.UserRelationsForLogin,
                    }, true);
                }
                else {
                    findUserResponse = yield this.usersService.findOne({
                        where: { loginToken: loginToken },
                        relations: auth_custom_rules_1.UserRelationsForLogin,
                    }, true);
                }
                if (!findUserResponse.success)
                    throw new app_error_1.AppError(findUserResponse.error);
                if (!findUserResponse.user)
                    throw new app_error_1.AppErrorWithMessage('Utilisateur ou mot de passe incorrect !', 403);
                if (findUserResponse.user.disabled)
                    throw new app_error_1.AppErrorWithMessage('Utilisateur désactivé. Impossible de se connecter', 403);
                if (loginViewModel) {
                    if (!findUserResponse.user.password)
                        throw new app_error_1.AppErrorWithMessage('Il semble que vous vous êtes déjà connecté via une connexion sans mot de passe. Veuillez utiliser cette méthode de connexion.', 403);
                    if (!(yield helpers_service_1.ApiMainHelpers.comparePasswords(loginViewModel.password, findUserResponse.user.password)))
                        throw new app_error_1.AppErrorWithMessage('Utilisateur ou mot de passe incorrect !', 403);
                }
                response.token = auth_tools_service_1.AuthToolsService.createUserToken(this.jwtService, findUserResponse.user);
                response.refreshToken =
                    yield this.createAndSaveRefreshTokenIfNeeded(findUserResponse.user);
                yield this.activityLogsService.addActivityLog(findUserResponse.user.id, shared_constants_1.ActivityLogCode.Login);
                response.success = true;
            }
            catch (err) {
                response.handleError(err, true);
            }
            return response;
        });
    }
    createAndSaveRefreshTokenIfNeeded(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!!user.refreshToken)
                return user.refreshToken;
            user.refreshToken = nextalys_js_helpers_1.MainHelpers.generateGuid();
            delete user.password;
            delete user.roles;
            const updateUserResponse = yield this.usersService.createOrUpdate(user);
            if (!updateUserResponse.success)
                throw new app_error_1.AppError(updateUserResponse.error);
            return user.refreshToken;
        });
    }
    refreshToken(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new auth_requests_1.LoginResponse();
            try {
                let findUserResponse;
                const refreshTokenFromCookie = cookie_helpers_1.CookieHelpers.getCookie(request, shared_constants_1.refreshTokenLsKey);
                if (refreshTokenFromCookie) {
                    findUserResponse = yield this.usersService.findOne({
                        where: { refreshToken: refreshTokenFromCookie },
                    });
                }
                else {
                    throw new app_error_1.AppError('Invalid request');
                }
                if (!findUserResponse.success) {
                    throw new app_error_1.AppError(findUserResponse.error);
                }
                if (!findUserResponse.user) {
                    throw new app_error_1.AppErrorWithMessage('Utilisateur ou mot de passe incorrect !', 403);
                }
                if (findUserResponse.user.disabled) {
                    throw new app_error_1.AppErrorWithMessage('Utilisateur désactivé. Impossible de se connecter', 403);
                }
                (0, auth_custom_rules_1.AuthCustomRules)(findUserResponse.user);
                yield this.activityLogsService.addActivityLog(findUserResponse.user.id, shared_constants_1.ActivityLogCode.RefreshToken);
                response.token = auth_tools_service_1.AuthToolsService.createUserToken(this.jwtService, findUserResponse.user);
                response.success = true;
            }
            catch (err) {
                response.handleError(err, true);
            }
            return response;
        });
    }
    register(request) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = new generic_response_1.GenericResponse();
            try {
                if (!request.mail || !request.password) {
                    throw new app_error_1.AppErrorWithMessage('Impossible de créer un compte sans adresse e-mail ou sans mot de passe.');
                }
                const userResponse = yield this.usersService.findOne({
                    where: {
                        mail: request.mail,
                    },
                });
                if (!userResponse.success) {
                    throw new app_error_1.AppError(userResponse.error);
                }
                if (userResponse.user) {
                    throw new app_error_1.AppErrorWithMessage('Un compte mail existe déjà avec cette adresse e-mail !');
                }
                const user = new user_dto_1.UserDto();
                user.mail = request.mail;
                user.firstName = request.firstName;
                user.lastName = request.lastName;
                user.password = request.password;
                user.userName = request.mail;
                delete user.roles;
                response = yield this.usersService.createOrUpdate(user, true);
            }
            catch (err) {
                response.handleError(err, true);
            }
            return response;
        });
    }
    loginWithSocialProvider(request) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = new generic_response_1.GenericResponse();
            try {
                if (!request.googleUserId && !request.facebookUserId) {
                    throw new app_error_1.AppError('Unable to connect with Google / Facebook without user id');
                }
                let userResponse;
                let user;
                if (request.mail) {
                    userResponse = yield this.usersService.findOne({
                        where: [
                            {
                                googleUserId: null,
                                facebookUserId: null,
                                mail: request.mail,
                            },
                            {
                                googleUserId: '',
                                facebookUserId: '',
                                mail: request.mail,
                            },
                        ],
                    });
                    if (!userResponse.success) {
                        throw new app_error_1.AppError(userResponse.error);
                    }
                    if (userResponse.user) {
                        user = userResponse.user;
                        user.googleUserId = request.googleUserId;
                        user.facebookUserId = request.facebookUserId;
                        delete user.roles;
                        response = yield this.usersService.createOrUpdate(user, true);
                        response.success = true;
                        return response;
                    }
                }
                userResponse = yield this.usersService.findOne({
                    where: [
                        {
                            googleUserId: request.googleUserId
                                ? request.googleUserId
                                : undefined,
                        },
                        {
                            facebookUserId: request.facebookUserId
                                ? request.facebookUserId
                                : undefined,
                        },
                    ],
                });
                if (!userResponse.success) {
                    throw new app_error_1.AppError(userResponse.error);
                }
                if (userResponse.user) {
                    user = userResponse.user;
                    response.token = auth_tools_service_1.AuthToolsService.createUserToken(this.jwtService, user);
                    response.success = true;
                }
                else {
                    user = new user_dto_1.UserDto();
                    user.firstName = request.firstName;
                    user.lastName = request.lastName;
                    user.googleUserId = request.googleUserId;
                    user.facebookUserId = request.facebookUserId;
                    user.mail = request.mail;
                    if (request.mail)
                        user.userName = request.mail;
                    else if (request.facebookUserId)
                        user.userName = request.facebookUserId;
                    else if (request.googleUserId)
                        user.userName = request.googleUserId;
                    delete user.roles;
                    response = yield this.usersService.createOrUpdate(user, true);
                }
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    logAs(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                const getUserResponse = yield this.usersService.findOne({
                    where: { id: request.userId },
                    relations: auth_custom_rules_1.UserRelationsForLogin,
                });
                if (!getUserResponse.success) {
                    throw new app_error_1.AppError(getUserResponse.error);
                }
                if (!getUserResponse.user) {
                    throw new app_error_1.AppError('User not found !');
                }
                response.token = auth_tools_service_1.AuthToolsService.createUserToken(this.jwtService, getUserResponse.user);
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    backToOriginalRequester(request) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = new generic_response_1.GenericResponse();
            try {
                const decodeResponse = auth_tools_service_1.AuthToolsService.decodeToken(this.jwtService, request.requesterToken, false);
                if (decodeResponse.payload &&
                    decodeResponse.payload.roles.some((x) => x === shared_constants_1.RolesList.Admin)) {
                    response = yield this.logAs({
                        userId: decodeResponse.payload.id,
                    });
                }
                else {
                    throw new app_error_1.AppError('Incorrect requester token !');
                }
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    generateRecoverPasswordToken(user, mustGenerateToken = false, expirationInDays = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            user.recoverToken = nextalys_js_helpers_1.MainHelpers.generateGuid();
            user.recoverTokenExpirationDate = nextalys_js_helpers_1.DateHelpers.addDaysToDate(new Date(), expirationInDays);
            delete user.roles;
            return yield this.usersService.createOrUpdate(user, mustGenerateToken, null);
        });
    }
    sendRecoverPasswordMail(mail) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let response = new generic_response_1.GenericResponse();
            try {
                const findOneOptions = {
                    where: { mail },
                    relations: ['language'],
                };
                let userReponse = yield this.usersService.findOne(findOneOptions);
                if (!userReponse.success) {
                    throw new app_error_1.AppError(userReponse.message);
                }
                if (!userReponse.user) {
                    throw new app_error_1.AppErrorWithMessage("Aucun utilisateur n'a été trouvé avec cette adresse e-mail.");
                }
                delete userReponse.user.roles;
                const userLanguageCode = (_b = (_a = userReponse.user) === null || _a === void 0 ? void 0 : _a.language) === null || _b === void 0 ? void 0 : _b.code;
                userReponse = yield this.generateRecoverPasswordToken(userReponse.user);
                if (userReponse.success && userReponse.user) {
                    let recoverPasswordLink = environment_1.Environment.BaseURL +
                        '/' +
                        routes_1.RoutesList.RecoverPassword +
                        '/' +
                        userReponse.user.recoverToken;
                    if (userLanguageCode)
                        recoverPasswordLink += '?lang=' + userLanguageCode;
                    const mailContentWrapper = mail_content_1.MailContent.getMailContentAndSubject('NewAccountPassword', true, userLanguageCode, null, [recoverPasswordLink]);
                    const mailSender = yield candidates_helpers_1.SharedCandidatesHelpers.getMailSenderFromCandidate(null, userReponse.user, null, undefined);
                    response = yield this.mailService.sendMail({
                        from: { address: mailSender },
                        to: [{ address: mail }],
                        htmlBody: mailContentWrapper.content,
                        subject: mailContentWrapper.subject,
                        templateName: 'mail_auto',
                    });
                }
                else {
                    throw new app_error_1.AppErrorWithMessage("Pas d'utilisateur avec cet email");
                }
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    changeUserPasswordFromRecoverToken(recoverToken, userPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = new generic_response_1.GenericResponse();
            try {
                const findOneOptions = {
                    where: { recoverToken: recoverToken },
                };
                const userResponse = yield this.usersService.findOne(findOneOptions);
                if (!userResponse.success) {
                    throw new app_error_1.AppError(userResponse.message);
                }
                if (!userResponse.user) {
                    throw new app_error_1.AppErrorWithMessage("Impossible de trouver l'utilisateur !");
                }
                if (!userResponse.user.recoverTokenExpirationDate ||
                    userResponse.user.recoverTokenExpirationDate.getTime() <
                        new Date().getTime()) {
                    throw new app_error_1.AppErrorWithMessage('Lien expiré.');
                }
                userResponse.user.recoverToken = null;
                userResponse.user.recoverTokenExpirationDate = null;
                userResponse.user.password = userPassword;
                delete userResponse.user.roles;
                response = yield this.usersService.createOrUpdate(userResponse.user);
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    getUpdatedAccessToken(authToolsService) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                const payload = authToolsService === null || authToolsService === void 0 ? void 0 : authToolsService.getCurrentPayload(false);
                const userResponse = yield this.usersService.findOne({
                    where: { id: payload.id },
                });
                if (!userResponse.success) {
                    throw new app_error_1.AppError(userResponse.message);
                }
                if (!userResponse.user) {
                    throw new app_error_1.AppErrorWithMessage("Impossible de trouver l'utilisateur !");
                }
                response.token = auth_tools_service_1.AuthToolsService.createUserToken(this.jwtService, userResponse.user);
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    loginWithToken() { }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        activity_logs_service_1.ActivityLogsService,
        mail_service_1.MailService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map