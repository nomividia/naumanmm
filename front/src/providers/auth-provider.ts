import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { MainHelpers } from 'nextalys-js-helpers';
import { EventsCollector } from 'nextalys-js-helpers/dist/events';
import { additionalUserFieldsForTokenPayload } from '../../../shared/auth';
import { JwtPayload } from '../../../shared/jwt-payload';
import {
    CustomSocketEventType,
    refreshTokenLsKey,
    RolesList,
} from '../../../shared/shared-constants';
import { accessTokenLsKey } from '../environments/constants';
import { NxsFirebaseAuthService } from '../modules/firebase/firebase-auth.service';
import { AuthDataService } from '../services/auth-data.service';
import { CommonDataService } from '../services/common-data.service';
import {
    EventsHandler,
    HandleLoginResponseData,
} from '../services/events.handler';
import { GlobalAppService } from '../services/global.service';
import { SocketService } from '../services/socket.service';
import {
    AuthService,
    GenericResponse,
    LoginResponse,
    LoginViewModel,
    SocialLoginRequest,
    UserDto,
    UsersService,
} from './api-client.generated';
import { AppCookieService } from './app-cookie-service';
import { LocalStorageService } from './local-storage.service';
import { ReferentialProvider } from './referential.provider';
export const logAsRequesterIdKey = 'logAsRequesterId';

@Injectable()
export class AuthProvider {
    static instance: AuthProvider;
    private refreshTokenIntervalId: any;
    public hasBeenLoggedOutMessage: string;
    private eventsCollector = new EventsCollector();

    constructor(
        private authService: AuthService,
        @Inject(PLATFORM_ID) private platformId: any,
        private appCookieService: AppCookieService,
        private usersService: UsersService,
        private referentialProvider: ReferentialProvider,
    ) {
        AuthProvider.instance = this;
        const sub = EventsHandler.HandleLoginResponseEvent.subscribe(
            (data: HandleLoginResponseData) => {
                this.handleRefreshTokenFromResponse(data);
            },
        );
        this.eventsCollector.collect(sub);
        const sub2 = EventsHandler.ForceLogoutEvent.subscribe((message) => {
            this.logout();
            this.hasBeenLoggedOutMessage =
                'Vous avez été déconnecté.<br/><br/>Raison : ' + message;
            // window.location.reload();
        });
        this.eventsCollector.collect(sub2);
        this.getAllUsers();
    }

    private handleRefreshTokenFromResponse(data: HandleLoginResponseData) {
        if (
            !data ||
            !data.response ||
            !data.response.success ||
            !data.response.token
        ) {
            return;
        }

        const decoded: JwtPayload = this.getDecodedAccessToken(
            data.response.token,
        );

        if (!decoded) {
            return;
        }

        //user connecté différent du refresh token : pas censé se produire
        // if (AuthDataService.currentUser && AuthDataService.currentUser.id !== decoded.id)
        //     return;
        this.handleLoginResponse(
            data.response,
            data.fromRefreshToken,
            data.forceLogout,
        );
    }

    ngOnDestroy() {
        this.eventsCollector.unsubscribeAll();
    }

    public async login(loginViewModel: LoginViewModel) {
        const response = await this.authService
            .login({ loginViewModel: loginViewModel })
            .toPromise();
        this.handleLoginResponse(response, false, false);

        if (response.success) {
            EventsHandler.UserLogged.next();
        }

        return response;
    }

    public async loginWithToken(loginToken: string) {
        const response = await this.authService
            .loginWithToken({
                loginWithTokenRequest: { loginToken: loginToken },
            })
            .toPromise();
        this.handleLoginResponse(response, false, false);

        return response;
    }

    getDecodedAccessToken(token: string): JwtPayload {
        try {
            return jwt_decode(token);
        } catch (err) {
            return null;
        }
    }

    public async initAuthProvider() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const requesterToken =
            LocalStorageService.getFromLocalStorage(logAsRequesterIdKey);

        if (!!requesterToken) {
            AuthDataService.currentRequester = this.getUserFromAccessToken(
                requesterToken,
                false,
            );
        }

        await this.refreshToken();
        this.refreshTokenLoop();
        this.getAllUsers();
        EventsHandler.AuthServiceInitialized.next();
        CommonDataService.authProviderInitialized = true;
    }

    private refreshTokenLoop() {
        // const interval = 1800000; //every 30 minutes
        //const interval = 30000;//every 30 seconds
        const interval = 60000; //every 1 minute

        if (this.refreshTokenIntervalId) {
            clearInterval(this.refreshTokenIntervalId);
        }

        this.refreshTokenIntervalId = setInterval(() => {
            this.refreshToken();
        }, interval);
    }

    public getUserFromAccessToken(
        accessToken: string,
        setCurrentUser: boolean,
    ) {
        let user: UserDto;

        if (!accessToken) {
            return null;
        }

        try {
            const decoded: JwtPayload = this.getDecodedAccessToken(accessToken);
            if (!decoded) {
                return null;
            }
            // console.log('decoded', decoded);
            user = {
                disabled: false,
                mail: decoded.mail,
                userName: decoded.userName,
                id: decoded.id,
                rolesString: decoded.roles,
                language: decoded.language,
                languageId: decoded.languageId,
                pushSubscriptions: [],
                image: decoded.imagePhysicalName
                    ? {
                          name: decoded.imageName,
                          mimeType: null,
                          physicalName: decoded.imagePhysicalName,
                      }
                    : null,
                firstName: decoded.firstName,
            };

            for (const fieldName of additionalUserFieldsForTokenPayload) {
                (user as any)[fieldName] = (decoded as any)[fieldName];
            }

            if (setCurrentUser) {
                AuthDataService.currentUser = user;
                if (AuthDataService.currentUser.id) {
                    SocketService.setUserId(AuthDataService.currentUser.id);
                }
            }
        } catch (err) {
            user = null;
        }

        return user;
    }

    public async logout() {
        const userId = AuthDataService.currentUser?.id;
        AuthDataService.currentUser = null;
        AuthDataService.currentAuthToken = null;
        AuthDataService.currentRequester = null;
        LocalStorageService.removeFromLocalStorage(accessTokenLsKey);
        LocalStorageService.removeFromLocalStorage(logAsRequesterIdKey);
        this.appCookieService.delete(accessTokenLsKey);
        this.appCookieService.delete(logAsRequesterIdKey);
        this.referentialProvider.clearCache();

        if (userId) {
            SocketService.sendEvent(CustomSocketEventType.UserLogout, userId);
        }

        try {
            await NxsFirebaseAuthService.signOut();
        } catch (err) {
            console.log('Log: AuthProvider -> logout -> err', err);
        }
    }

    public handleLoginResponse(
        response: LoginResponse,
        fromRefreshToken: boolean,
        forceLogout: boolean,
    ) {
        // console.log("Log: AuthProvider -> handleLoginResponse -> handleLoginResponse", response, fromRefreshToken);
        if (response.success) {
            AuthDataService.currentAuthToken = response.token;
            LocalStorageService.saveInLocalStorage(
                accessTokenLsKey,
                AuthDataService.currentAuthToken,
            );
            this.appCookieService.set(
                accessTokenLsKey,
                AuthDataService.currentAuthToken,
            );

            if (response.refreshToken) {
                this.appCookieService.set(
                    refreshTokenLsKey,
                    response.refreshToken,
                );
            }

            this.getUserFromAccessToken(AuthDataService.currentAuthToken, true);
        } else {
            if (
                forceLogout ||
                (fromRefreshToken &&
                    response.statusCode &&
                    response.statusCode === 403)
            ) {
                this.logout();
                this.hasBeenLoggedOutMessage =
                    'Vous avez été déconnecté.<br/><br/>Raison : ' +
                    response.message;
            }
        }

        this.getAllUsers();
    }

    private async refreshToken() {
        AuthDataService.currentAuthToken =
            LocalStorageService.getFromLocalStorage(accessTokenLsKey);
        // console.log(': AuthProvider -> refreshToken -> refreshToken');
        this.getUserFromAccessToken(AuthDataService.currentAuthToken, true);

        if (AuthDataService.currentUser) {
            await this.refreshTokenIfNeeded();
        }
    }

    public async refreshTokenIfNeeded(): Promise<GenericResponse> {
        if (!AuthDataService.currentAuthToken) {
            return { success: false };
        }

        const decoded: JwtPayload = this.getDecodedAccessToken(
            AuthDataService.currentAuthToken,
        );

        if (!decoded) {
            return { success: false };
        }

        const timeDiff = decoded.exp * 1000 - new Date().getTime();

        if (timeDiff <= 0) {
            //expired
            // console.log(': AuthProvider -> refreshToken -> refreshToken needed');
            if (AuthDataService.currentRequester) {
                this.backToOriginalRequester();

                return;
            }

            return await this.authService.refreshToken().toPromise();
        }

        return { success: false };
    }

    public async socialLogin(socialLoginRequest: SocialLoginRequest) {
        return await this.authService
            .socialLogin({ socialLoginRequest: socialLoginRequest })
            .toPromise();
    }

    isAdminAuthenticated() {
        return GlobalAppService.userHasRole(
            AuthDataService.currentUser,
            RolesList.Admin,
        );
    }

    public async logAs(userId: string) {
        if (
            !GlobalAppService.userHasRole(
                AuthDataService.currentUser,
                RolesList.Admin,
            )
        ) {
            return;
        }

        let requesterToken =
            LocalStorageService.getFromLocalStorage(logAsRequesterIdKey);

        if (requesterToken) {
            return;
        }

        requesterToken = AuthDataService.currentAuthToken;
        const response = await this.authService
            .logAs({ logAsRequest: { userId: userId } })
            .toPromise();

        if (response.success) {
            LocalStorageService.saveInLocalStorage(
                logAsRequesterIdKey,
                requesterToken,
            );
            this.appCookieService.set(logAsRequesterIdKey, requesterToken);
            AuthDataService.currentRequester = MainHelpers.cloneObject(
                AuthDataService.currentUser,
            );
            this.handleLoginResponse(response as LoginResponse, false, false);
        }

        return response;
    }

    public backToOriginalRequester() {
        const requesterToken =
            LocalStorageService.getFromLocalStorage(logAsRequesterIdKey);

        if (!requesterToken) {
            return;
        }

        LocalStorageService.removeFromLocalStorage(logAsRequesterIdKey);
        this.appCookieService.delete(logAsRequesterIdKey);
        AuthDataService.currentRequester = null;
        LocalStorageService.saveInLocalStorage(
            accessTokenLsKey,
            requesterToken,
        );
        window.location = window.location;
    }

    private async getAllUsers() {
        if (
            !GlobalAppService.userHasRole(
                AuthDataService.currentUser,
                RolesList.Admin,
            )
        ) {
            return;
        }

        if (
            !AuthDataService.currentUser ||
            (AuthDataService.UsersList && AuthDataService.UsersList.length > 0)
        ) {
            return;
        }

        const response = await GlobalAppService.sendApiRequest(
            this.usersService.getAllUsers({
                start: 0,
                length: 100,
                roles: [
                    RolesList.Admin,
                    RolesList.Consultant,
                    RolesList.RH,
                ].join(','),
                includeRoles: 'true',
            }),
        );

        if (response.success) {
            AuthDataService.UsersList.splice(
                0,
                AuthDataService.UsersList.length,
            );

            if (response.users.length > 0) {
                AuthDataService.UsersList.push(...response.users);
            }

            AuthDataService.MapConnectedUsers();
            AuthDataService.usersListLoaded = true;
        }
    }

    public async getUpdatedAccessToken() {
        //Token is intercepted and decoded by http interceptor
        return await this.authService.getUpdatedAccessToken().toPromise();
    }
}
