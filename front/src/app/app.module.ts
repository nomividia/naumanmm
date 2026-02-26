import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, registerLocaleData } from '@angular/common';
import {
    HTTP_INTERCEPTORS,
    HttpClient,
    HttpClientModule,
} from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MissingTranslationHandler,
    MissingTranslationHandlerParams,
    TranslateLoader,
    TranslateModule,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NextalysAngularCommonModule } from 'nextalys-angular-common';
import { NextalysAngularModule } from 'nextalys-angular-tools';
import { CookieService } from 'ngx-cookie-service';
import { defaultAppLanguage } from '../../../shared/shared-constants';
import { TOSDialogModule } from '../components/tos-dialog/tos-dialog.module';
import { LAZY_WIDGETS } from '../environments/constants';
import { environment } from '../environments/environment';
import { NxsFirebaseMainModule } from '../modules/firebase/firebase-main-module';
import {
    ApiModule,
    AuthService,
    Configuration,
    ConfigurationParameters,
    NotificationsService,
    PdfService,
    UsersService,
} from '../providers/api-client.generated';
import { BASE_PATH } from '../providers/api-client.generated/variables';
import { AuthProvider } from '../providers/auth-provider';
import { AuthGuard } from '../providers/guards/auth-guard';
import { CanLeaveGenericGuard } from '../providers/guards/can-leave-generic.guard';
import { AppHomeGuard } from '../providers/guards/home-guard';
import { RightGuard } from '../providers/guards/right-guard';
import { RoleGuard } from '../providers/guards/role-guard';
import { CustomHttpInterceptor } from '../providers/http-interceptor';
import { LanguageProvider } from '../providers/language.provider';
import { NotificationsManager } from '../providers/notifications-manager.service';
import { ReferentialProvider } from '../providers/referential.provider';
import { ServerResponseService } from '../providers/server-response.service';
import { StackedSnackBarService } from '../providers/stacked-snackbar.service';
import { UpdateService } from '../providers/sw-update.service';
import { WebPushProvider } from '../providers/web-push.provider';
import {
    LazyLoaderService,
    lazyArrayToObj,
} from '../services/lazy-loader.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared.module';

registerLocaleData(localeFr, 'fr');

function getLocaleIdDynamic(languageProvider: LanguageProvider): string {
    try {
        languageProvider?.init();
    } catch (error) {
        console.log('getLocaleIdDynamic - error:', error);
    }

    return (
        LanguageProvider.currentLanguageCodeWithCulture ||
        LanguageProvider.currentLanguageCode ||
        defaultAppLanguage
    );
}

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export class TranslateHandler implements MissingTranslationHandler {
    handle(params: MissingTranslationHandlerParams) {
        // console.error('*** Missing text for:', params);
        // return '#Missing translation#'; // here u can return translation
        return params.key; // here u can return translation
    }
}

export const CommonModulesList = [
    CommonModule,
    SharedModule,
    MatIconModule,
    MatSelectModule,
    MatAutocompleteModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatDialogModule,
    MatTooltipModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatMenuModule,
    MatBadgeModule,
    MatProgressBarModule,
    TranslateModule,
    NextalysAngularModule.forRoot({
        dialogOptions: {
            customDialogDefaultClass: ['mmi-custom-dialog'],
            allDialogDefaultClass: ['mmi-dialog'],
            confirmDialogDefaultClass: ['mmi-confirm-dialog'],
            simpleDialogDefaultClass: ['mmi-simple-dialog'],
            promptDialogDefaultClass: ['mmi-prompt-dialog'],
            useTranslations: true,
        },
    }),
    NextalysAngularCommonModule,
    TextFieldModule,
    TOSDialogModule,
];

export function apiConfigFactory(): Configuration {
    const params: ConfigurationParameters = {
        // set configuration parameters here.
        apiKeys: {},
        withCredentials: true,
    };

    return new Configuration(params);
}

@NgModule({
    declarations: [AppComponent],
    exports: [],
    imports: [
        BrowserModule.withServerTransition({
            appId: 'app-root',
        }),
        AppRoutingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            },
            missingTranslationHandler: [
                {
                    provide: MissingTranslationHandler,
                    useClass: TranslateHandler,
                },
            ],
        }),
        NextalysAngularModule.forRoot({}),
        ...CommonModulesList,
        HttpClientModule,
        ApiModule.forRoot(apiConfigFactory),
        NxsFirebaseMainModule,
    ],
    providers: [
        //API Services (generated from swagger)
        AuthService,
        PdfService,
        UsersService,
        NotificationsService,
        //FIN API Services

        CookieService,
        AuthProvider,
        AuthGuard,
        CanLeaveGenericGuard,
        RoleGuard,
        RightGuard,
        NotificationsManager,
        WebPushProvider,
        LanguageProvider,
        ServerResponseService,
        ReferentialProvider,
        UpdateService,
        StackedSnackBarService,
        LazyLoaderService,
        { provide: LAZY_WIDGETS, useFactory: lazyArrayToObj },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CustomHttpInterceptor,
            multi: true,
        },
        { provide: BASE_PATH, useValue: environment.apiBaseUrl },
        {
            provide: MAT_DATE_LOCALE,
            // useValue: 'fr',
            useFactory: (languageProvider: LanguageProvider) => {
                return getLocaleIdDynamic(languageProvider);
            },
            deps: [LanguageProvider],
        },
        {
            provide: LOCALE_ID,
            // useValue: 'fr',
            useFactory: (languageProvider: LanguageProvider) => {
                return getLocaleIdDynamic(languageProvider);
            },
            deps: [LanguageProvider],
        },
        AppHomeGuard,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
