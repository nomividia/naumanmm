import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DateHelpers } from 'nextalys-js-helpers';
import { AppLocalStorage } from 'nextalys-js-helpers/dist/browser-helpers';
import { Observable, from, of } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { AppResponseCode } from '../../../shared/shared-constants';
import {
    GenericError,
    OfflineMessage,
    accessTokenLsKey,
} from '../environments/constants';
import { environment } from '../environments/environment';
import { EventsHandler } from '../services/events.handler';
import { GenericResponse, LoginResponse } from './api-client.generated';
import { LanguageProvider } from './language.provider';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
    public static ReadBlob(blb: Blob) {
        return new Promise<string>((resolve) => {
            if (
                !blb ||
                typeof blb !== 'object' ||
                typeof FileReader === 'undefined'
            ) {
                resolve(null);

                return;
            }

            try {
                const reader = new FileReader();
                reader.onload = () => {
                    resolve(reader.result as string);
                };
                reader.readAsText(blb);
            } catch (err) {
                resolve(null);
            }
        });
    }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpEvent<any>> {
        if (request.headers.get('skip')) {
            return next.handle(request);
        }

        let mustClone = false;
        const headersToAdd: any = {};

        if (LanguageProvider.currentLanguageCode) {
            headersToAdd['nxs-lang'] = LanguageProvider.currentLanguageCode;
            mustClone = true;
        }

        const jwtToken = AppLocalStorage.getString(accessTokenLsKey);

        if (jwtToken) {
            // request = request.clone({
            //     setHeaders: {
            //         Authorization: `Bearer ${jwtToken}`,
            //     },
            // });
            headersToAdd.Authorization = `Bearer ${jwtToken}`;
            mustClone = true;
        }

        if (mustClone) {
            request = request.clone({
                setHeaders: headersToAdd,
                // headers: request.headers
                //     // .set('Content-Type', 'application/json')

                //     .set('x-nxs-lang', LanguageProvider.currentLanguageCode)
                //     .set('Authorization', `Bearer ${jwtToken}`)
                // // .set('header3', 'header 3 value')
            });
        }

        // req.headers.set('Content-Type', 'application/json')
        // .set('header2', 'header 2 value')
        // .set('header3', 'header 3 value')

        // request = request.clone({
        //     headers: request.headers.set('nxs-lang', LanguageProvider.currentLanguageCode),
        // });
        // request = request.clone({
        //     setHeaders: {
        //         CustomLang: LanguageProvider.currentLanguageCode,
        //     },
        // });

        let handle = next.handle(request);

        if (environment.httpDelay) {
            handle = from(handle).pipe(delay(environment.httpDelay));
        }

        return handle.pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    if (
                        event.body &&
                        event.headers.get('content-type') &&
                        event.headers
                            .get('content-type')
                            .indexOf('application/json') !== -1
                    ) {
                        try {
                            // console.log('is json', event.body);
                            DateHelpers.parseAllDatesRecursive(
                                event.body,
                                true,
                            );
                            const genericResponse: GenericResponse = event.body;
                            const fromRefreshToken =
                                request.url.indexOf('/auth/refresh-token') !==
                                -1;

                            if (genericResponse.token || fromRefreshToken) {
                                EventsHandler.HandleLoginResponseEvent.next({
                                    response: genericResponse as LoginResponse,
                                    fromRefreshToken: fromRefreshToken,
                                    forceLogout: false,
                                });
                            }
                            if (
                                genericResponse &&
                                !genericResponse.success &&
                                !genericResponse.message
                            ) {
                                genericResponse.message = GenericError;
                            }
                        } catch (err) {
                            console.error(
                                'Http request failed : ',
                                err.message,
                            );
                        }

                        try {
                            // CustomHttpInterceptor.ReadBlob(event.body).then((data: string) => {
                            //     console.log(': CustomHttpInterceptor -> &&event.headers.get -> data', data);
                            //     //console.log('is json', event.body);
                            //     MainHelpers.convertAllDatesInObject(JSON.parse(data));
                            //     console.log(': CustomHttpInterceptor -> &&event.headers.get -> data after', data);
                            // });
                        } catch (err) {
                            console.error(
                                'Http request failed : ',
                                err.message,
                            );
                        }
                    }
                }
                return event;
            }),

            catchError((err) => {
                if (err instanceof HttpErrorResponse) {
                    // errorMessage = (err).message;
                    // statusCode = (err).status;
                    if (err.status === 582) {
                        //maintenance mode
                        // this.router.navigate(['/maintenance']);
                        window.location.href = '/assets/maintenance.html';
                        return of(
                            new HttpResponse<GenericResponse>({
                                body: {
                                    message: 'Mode maintenance',
                                    success: false,
                                },
                            }),
                        );
                    }
                }

                // console.log("Log ~ file: http-interceptor.ts:112 ~ CustomHttpInterceptor ~ intercept ~ err:", err);
                if (err?.headers?.get('nxs-ignore-interceptor')) {
                    return of(
                        new HttpResponse<GenericResponse>({
                            body: err?.body,
                            headers: err.headers,
                            status: err.status,
                            statusText: err.statusText,
                        }),
                    );
                }

                let errorMessage = '';
                let statusCode = 500;

                if (err instanceof HttpErrorResponse) {
                    errorMessage = err.message;
                    statusCode = err.status;
                }

                if (window.navigator && !window.navigator.onLine) {
                    // console.log('offline');
                    errorMessage = OfflineMessage;
                }

                if (statusCode === 500 || statusCode === 0) {
                    errorMessage = GenericError;
                    console.error('Http request failed : ', err.message);
                }

                if (statusCode === 403) {
                    if (
                        err?.error?.statusCode === AppResponseCode.ExpiredToken
                    ) {
                        EventsHandler.ForceLogoutEvent.next(
                            err?.error?.message,
                        );
                    }

                    if (err?.error?.message) {
                        errorMessage =
                            'Vous avez été déconnecté : ' + err.error.message;
                    }
                }

                return of(
                    new HttpResponse<GenericResponse>({
                        body: {
                            message: errorMessage,
                            success: false,
                            statusCode: statusCode,
                        },
                    }),
                );
            }),
        );
    }
}
