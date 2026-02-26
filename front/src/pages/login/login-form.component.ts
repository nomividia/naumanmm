import {
    Component,
    EventEmitter,
    NgZone,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'nextalys-angular-tools';
import { BaseComponent } from '../../components/base/base.component';
import { GenericError } from '../../environments/constants';
import {
    FirebaseAuthProvider,
    NxsFirebaseAuthService,
} from '../../modules/firebase/firebase-auth.service';
import {
    AuthService,
    GenericResponse,
    LoginViewModel,
    SocialLoginRequest,
} from '../../providers/api-client.generated';
import { AuthProvider } from '../../providers/auth-provider';
@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LoginFormComponent extends BaseComponent {
    public errorMessage: string;

    public model: LoginViewModel = { userName: '', password: '' };
    public passwordVisible: boolean = false;
    public loading: boolean = false;
    showForgotPasswordForm = true;
    forgotPasswordForm = false;
    socialLogin = false;
    forgotPasswordMail = '';

    @Output() afterLogin = new EventEmitter<GenericResponse>();

    constructor(
        private authProvider: AuthProvider,
        private authService: AuthService,
        private dialogService: DialogService,
        private ngZone: NgZone,
        private translateService: TranslateService,
    ) {
        super();
        if (this.authProvider.hasBeenLoggedOutMessage) {
            this.errorMessage = this.authProvider.hasBeenLoggedOutMessage;
        }
    }

    public async login(provider: FirebaseAuthProvider) {
        if (!provider && (!this.model.userName || !this.model.password)) {
            return;
        }

        this.loading = true;
        this.errorMessage = '';

        try {
            let response: GenericResponse;

            if (provider) {
                let socialLoginRequest: SocialLoginRequest;
                let userMail: string = null;

                const signInResponse =
                    await NxsFirebaseAuthService.signInWithPopup(provider);

                if (signInResponse && signInResponse.user) {
                    userMail = !!signInResponse.user.email
                        ? signInResponse.user.email
                        : (signInResponse.additionalUserInfo.profile as any)
                              .email;
                }

                switch (provider) {
                    case 'Google':
                        socialLoginRequest = {
                            mail: userMail,
                            photoUrl: (
                                signInResponse.additionalUserInfo.profile as any
                            ).picture,
                            firstName: (
                                signInResponse.additionalUserInfo.profile as any
                            ).given_name,
                            lastName: (
                                signInResponse.additionalUserInfo.profile as any
                            ).family_name,
                            googleUserId: (
                                signInResponse.additionalUserInfo.profile as any
                            ).id,
                        };
                        break;
                    case 'Facebook':
                        socialLoginRequest = {
                            mail: userMail,
                            photoUrl: (
                                signInResponse.additionalUserInfo.profile as any
                            ).picture.data.url,
                            firstName: (
                                signInResponse.additionalUserInfo.profile as any
                            ).first_name,
                            lastName: (
                                signInResponse.additionalUserInfo.profile as any
                            ).last_name,
                            facebookUserId: (
                                signInResponse.additionalUserInfo.profile as any
                            ).id,
                        };
                        break;
                    case 'Twitter':
                        socialLoginRequest = {
                            mail: userMail,
                            photoUrl: (
                                signInResponse.additionalUserInfo.profile as any
                            ).profile_image_url_https,
                            firstName: (
                                signInResponse.additionalUserInfo.profile as any
                            ).name,
                            twitterUserId: (
                                signInResponse.additionalUserInfo.profile as any
                            ).id_str,
                        };
                        socialLoginRequest.lastName =
                            socialLoginRequest.firstName;
                        break;
                }

                if (socialLoginRequest) {
                    response = await this.authProvider.socialLogin(
                        socialLoginRequest,
                    );
                }
            } else {
                response = await this.authProvider.login(this.model);
            }

            // if (google) {
            //     const signInResponse = await this.angularFireAuth.signInWithPopup(new auth.GoogleAuthProvider());
            //     // console.log("Log: LoginFormComponent -> login -> signInResponse", signInResponse);
            //     //socialUser = await this.authProvider.signInWithGoogle();
            //     socialUser = new SocialUser();
            //     socialUser.firstName = (signInResponse.additionalUserInfo.profile as any).given_name;
            //     socialUser.lastName = (signInResponse.additionalUserInfo.profile as any).family_name;
            //     socialUser.id = (signInResponse.additionalUserInfo.profile as any).id;
            //     socialUser.email = (signInResponse.additionalUserInfo.profile as any).email;
            //     socialUser.photoUrl = (signInResponse.additionalUserInfo.profile as any).picture;
            //     socialUser.provider = GoogleLoginProvider.PROVIDER_ID;
            //     // console.log("Log: LoginFormComponent -> login -> socialUser", socialUser);
            // }
            // else if (facebook)
            //     socialUser = await this.authProvider.signInWithFacebook();

            // if (socialUser)
            //     response = await this.authProvider.socialLogin(socialUser);
            // console.log("Log: LoginFormComponent -> login -> response", response);

            if (!response.success) {
                this.errorMessage = response.message;
            } else {
                this.afterLogin.next(response);
            }
        } catch (err) {
            console.log('login error', err);
            let handled = false;

            if (err && err.code) {
                switch (err.code) {
                    case 'auth/popup-closed-by-user':
                        handled = true;
                        break;
                }
            }
            // console.log("Log: BaseLoginForm -> socialLogin -> err", err);
            if (!handled) {
                if (err && err.message) {
                    this.errorMessage = err.message;
                } else {
                    this.errorMessage = err;
                }
            }
            if (this.errorMessage) {
                this.dialogService.showDialog(GenericError);
            }
        }

        this.ngZone.run(() => {
            this.loading = false;
        });
    }

    async sendForgotPasswordMail() {
        if (!this.forgotPasswordMail) {
            return;
        }

        this.loading = true;

        const response = await this.authService
            .sendRecoverPasswordMail({
                sendRecoverPasswordMailRequest: {
                    mail: this.forgotPasswordMail,
                },
            })
            .toPromise();

        this.loading = false;

        if (!response.success) {
            this.dialogService.showDialog(response.message);
        } else {
            const msg = await this.translateService
                .get('Login.ResetPasswordMailSent')
                .toPromise();

            this.dialogService.showDialog(msg);
            this.resetModel();
        }
    }

    resetModel() {
        this.forgotPasswordForm = false;
        this.forgotPasswordMail = '';
        this.model = { password: '', userName: '' };
    }
}
