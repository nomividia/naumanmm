/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable max-len */
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DateHelpers, MainHelpers } from 'nextalys-js-helpers';
import { BrowserFileHelpers } from 'nextalys-js-helpers/dist/browser-file-helpers';
import { EventsCollector } from 'nextalys-js-helpers/dist/events';
import { lastValueFrom, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { defaultHomePageForUser, homePagesByRoles } from '../../../shared/auth';
import { RoutesList } from '../../../shared/routes';
import {
    AppDirectories,
    AppPage,
    CustomSocketEventType,
    RolesList,
} from '../../../shared/shared-constants';
import { SharedService } from '../../../shared/shared-service';
import { BaseComponent } from '../components/base/base.component';
import { environment } from '../environments/environment';
import { DbTranslatePipe } from '../pipes/db-translate.pipe';
import {
    AppFileDto,
    AppValueDto,
    CandidateApplicationsService,
    CandidateMessagesService,
    GenericResponse,
    UserDto,
    UserRoleDto,
    UsersService,
} from '../providers/api-client.generated';
import { AuthDataService } from './auth-data.service';
import { EventsHandler } from './events.handler';
import { SocketService } from './socket.service';

interface GetBlobFileOptions {
    component?: { sendApiRequest: (obs: Observable<any>) => Promise<any> };
    destroySubject?: Subject<any>;
    eventsCollector?: EventsCollector;
}

interface GetBlobFileResponse extends GenericResponse {
    blob?: Blob;
    mimeType?: string;
}

// interface SocketEventWrapper {
//     customSocketEventType: CustomSocketEventType,
//     methodToCallWithArgs: (service: CandidateApplicationsService | CandidateMessagesService, forceReload?: boolean) => Promise<void>,
//     evtIfSeen: 'CandidateApplicationHasBeenSeen' | 'MessageHasBeenSeen';
//     evtIfNew: 'NewMessage' | 'NewCandidateApplication';
//     service: CandidateApplicationsService | CandidateMessagesService;
// }
export class GlobalAppService {
    public static currentPage: AppPage;
    public static currentPageMeta?: any;
    public static unSeenCandidateApplication?: number;
    public static unSeenMessagesCount?: number;
    static UserRolesList: UserRoleDto[] = [];

    public static ShowMainLoadingOverlay(message?: string) {
        if (typeof document === 'undefined') {
            return;
        }

        const elements = document.getElementsByClassName('mainLoadingOverlay');

        if (elements && elements.length === 1) {
            (elements[0] as HTMLElement).style.display = 'block';

            const elementsMessage = document.getElementsByClassName(
                'mainLoadingOverlayMessage',
            );

            if (elementsMessage && elementsMessage.length > 0) {
                const elementMessage = elementsMessage[0];
                if (message) {
                    elementMessage.innerHTML = message;
                } else {
                    elementMessage.innerHTML = '';
                }
            }
        }
    }

    public static HideMainLoadingOverlay() {
        if (typeof document === 'undefined') {
            return;
        }

        const elements = document.getElementsByClassName('mainLoadingOverlay');

        if (elements && elements.length === 1) {
            (elements[0] as HTMLElement).style.display = 'none';
        }
    }

    public static userHasRole(user: UserDto, role: string) {
        return SharedService.userHasRole(user, role);
    }

    public static userHasOneOfRoles(user: UserDto, roles: string[]) {
        return SharedService.userHasOneOfRoles(user, roles);
    }

    public static userHasOneOfRights(user: UserDto, rights: string[]) {
        if (!this.UserRolesList?.length) {
            return;
        }

        return SharedService.userHasOneOfRights(
            user,
            this.UserRolesList,
            rights,
        );
    }

    public static userHasRight(user: UserDto, right: string) {
        if (!this.UserRolesList?.length) {
            return;
        }

        return SharedService.userHasRight(user, this.UserRolesList, right);
    }

    public static getPublicImagePath(imageName: string) {
        let baseUrl = '';

        if (!environment.production) {
            baseUrl = environment.apiBaseUrl;
        }

        return (
            baseUrl +
            '/' +
            AppDirectories.Uploads +
            '/' +
            AppDirectories.Images +
            '/' +
            imageName
        );
    }

    static async loadUnseenCandidateApplication(
        candidateApplicationService?: CandidateApplicationsService,
        forceReload?: boolean,
    ) {
        if (!AuthDataService.currentUser) {
            return;
        }

        if (
            !this.userHasOneOfRoles(AuthDataService.currentUser, [
                RolesList.Admin,
                RolesList.Consultant,
                RolesList.AdminTech,
                RolesList.RH,
            ])
        ) {
            return;
        }

        if (
            GlobalAppService.unSeenCandidateApplication != null &&
            !forceReload
        ) {
            return;
        }

        await AuthDataService.waitForAuthServiceInitialized();

        const response = await this.sendApiRequest(
            candidateApplicationService.getUnSeenCandidateApplications(),
        );

        if (response.success) {
            GlobalAppService.unSeenCandidateApplication =
                response.unSeenCandidateApplication;
        }
    }

    static init(
        eventsCollector: EventsCollector,
        candidateApplicationService: CandidateApplicationsService,
        candidateMessageService: CandidateMessagesService,
    ) {
        if (
            this.userHasOneOfRoles(AuthDataService.currentUser, [
                RolesList.Admin,
                RolesList.Candidate,
                RolesList.Consultant,
                RolesList.AdminTech,
                RolesList.RH,
            ])
        ) {
            if (
                this.userHasOneOfRoles(AuthDataService.currentUser, [
                    RolesList.Admin,
                    RolesList.Consultant,
                    RolesList.AdminTech,
                    RolesList.RH,
                ])
            ) {
                SocketService.subscribeToEvent(
                    CustomSocketEventType.RefreshUnseenCandidateApplications,
                    eventsCollector,
                    (data) => {
                        const socketData = data?.data as {
                            id: string;
                            type: 'new' | 'seen';
                        };
                        this.loadUnseenCandidateApplication(
                            candidateApplicationService,
                            true,
                        );

                        if (socketData?.type === 'seen') {
                            EventsHandler.CandidateApplicationHasBeenSeen.next(
                                socketData?.id,
                            );
                        } else if (socketData?.type === 'new') {
                            EventsHandler.NewCandidateApplication.next(
                                socketData?.id,
                            );
                        }
                    },
                );
            }

            SocketService.subscribeToEvent(
                CustomSocketEventType.NewCandidateMessage,
                eventsCollector,
                (data) => {
                    this.loadUnseenMessages(candidateMessageService, true);
                    EventsHandler.NewCandidateMessage.next(data?.data);
                },
            );

            this.loadUnseenCandidateApplication(
                candidateApplicationService,
                false,
            );
            this.loadUnseenMessages(candidateMessageService, false);
        }
    }

    // private static subscribeToSocketEvents(item: SocketEventWrapper, eventsCollector: EventsCollector) {
    //     SocketService.subscribeToEvent(item.customSocketEventType, eventsCollector, (data) => {
    //         const socketData = data?.data as { id: string; type: 'new' | 'seen' };
    //         item.methodToCallWithArgs(item.service, true);
    //         if (socketData?.type === 'seen')
    //             EventsHandler[item.evtIfSeen].next(socketData?.id);
    //         else if (socketData?.type === 'new')
    //             EventsHandler[item.evtIfNew].next(socketData?.id);
    //     });
    // }

    public static async getBlobFile(
        httpClient: HttpClient,
        endPoint: string,
        method = 'get',
        data?: any,
        opts?: GetBlobFileOptions,
    ) {
        const genericResponse: GetBlobFileResponse = { success: false };

        try {
            let sendRequestMethod: (
                obs: Observable<any>,
                subj?: Subject<any>,
                eventsCollector?: EventsCollector,
            ) => Promise<any>;

            if (opts?.component) {
                sendRequestMethod = opts?.component?.sendApiRequest?.bind(this);
            } else {
                sendRequestMethod = this.sendApiRequest.bind(this);
            }
            //const options = { responseType: 'blob' }; there is no use of this
            // this.http refers to HttpClient. Note here that you cannot use the generic get<Blob> as it does not compile: instead you "choose" the appropriate API in this way.

            let reqObservable: Observable<any>;

            if (method === 'get') {
                reqObservable = httpClient.get(
                    environment.apiBaseUrl + endPoint,
                    { responseType: 'blob', observe: 'response' },
                );
            } else {
                reqObservable = httpClient.post(
                    environment.apiBaseUrl + endPoint,
                    data,
                    { responseType: 'blob', observe: 'response' },
                );
            }

            const reqArgs: [Observable<any>, Subject<any>?, EventsCollector?] =
                [reqObservable];

            if (opts?.destroySubject) {
                reqArgs.push(opts.destroySubject);
            }

            if (opts?.eventsCollector) {
                reqArgs.push(opts.eventsCollector);
            }

            const blobResponse = await sendRequestMethod(...reqArgs);
            genericResponse.statusCode = blobResponse.status;

            if (blobResponse.ok) {
                genericResponse.blob = blobResponse.body;
                genericResponse.mimeType =
                    blobResponse.headers.get('Content-Type');
                genericResponse.success = true;
            } else {
                throw new Error(blobResponse.statusText);
            }
            // console.log("Log ~ file: list-temp-workers.component.ts ~ line 465 ~ ListTempWorkerComponent ~ exportToExcelFormat ~ blobResponse", blobResponse);
        } catch (err) {
            genericResponse.error = err;
        }

        return genericResponse;
    }

    public static async downloadBlobFile(
        httpClient: HttpClient,
        endPoint: string,
        fileName: string,
        method = 'get',
        data?: any,
        opts?: GetBlobFileOptions,
    ) {
        const response = await this.getBlobFile(
            httpClient,
            endPoint,
            method,
            data,
            opts,
        );

        if (response.success) {
            BrowserFileHelpers.downloadFile({
                fileName: fileName,
                blobData: response.blob,
                mimeType: response.mimeType,
            });
        }

        return response;
    }

    static async downloadGDriveFile(
        httpClient: HttpClient,
        file: AppFileDto,
        opts?: GetBlobFileOptions,
    ) {
        if (!file?.externalId) {
            return;
        }

        return await this.downloadBlobFile(
            httpClient,
            '/api/gdrive/downloadGDriveFile/' +
                file.externalId +
                '?returnBlob=true',
            file.name,
            'get',
            null,
            opts,
        );
    }

    static async downloadGCloudStorageFile(
        httpClient: HttpClient,
        file: AppFileDto,
        opts?: GetBlobFileOptions,
    ) {
        if (!file?.externalFilePath) {
            return;
        }

        return await this.downloadBlobFile(
            httpClient,
            '/api/gdrive/downloadGloudStorageFile/' +
                file.id +
                '?returnBlob=true',
            file.name,
            'get',
            null,
            opts,
        );
    }

    static toUtcDateRecursive(obj: any) {
        for (const key in obj) {
            if (typeof obj[key] !== 'object') {
                continue;
            }

            if (
                obj[key] &&
                typeof obj[key] === 'object' &&
                typeof (obj[key] as Date).getTime === 'function' &&
                typeof (obj[key] as Date).getMonth === 'function' &&
                typeof (obj[key] as Date).getFullYear === 'function'
            ) {
                obj[key] = DateHelpers.toUtcDate(obj[key] as Date) as any;
            } else {
                this.toUtcDateRecursive(obj[key]);
            }
        }
    }

    static getCurrentUserPicture() {
        let url = environment.apiBaseUrl + '/uploads';

        if (AuthDataService.currentUser.candidateId) {
            url += '/candidates/' + AuthDataService.currentUser.candidateId;
        } else {
            url += '/users/' + AuthDataService.currentUser.id;
        }

        return url + '/' + AuthDataService.currentUser.image.physicalName;
    }

    static async loadUnseenMessages(
        candidateMessageService: CandidateMessagesService,
        forceReload: boolean,
    ) {
        await AuthDataService.waitForAuthServiceInitialized();

        if (
            !AuthDataService.currentUser ||
            (GlobalAppService.unSeenMessagesCount != null && !forceReload)
        ) {
            return;
        }

        const response = await candidateMessageService
            .getUnSeenMessagesCount()
            .toPromise();

        if (response.success) {
            GlobalAppService.unSeenMessagesCount = response.unSeenMessagesCount;
        }
    }
    private static getLoginRedirectParameter() {
        const loginRedirect =
            MainHelpers.getUrlParameterByName('loginredirect');

        if (!loginRedirect) {
            return '';
        }

        return decodeURIComponent(loginRedirect);
    }
    static redirectToLoginPage(router: Router) {
        let currentPathName = window.location.pathname;

        if (currentPathName && currentPathName.startsWith('/')) {
            currentPathName = currentPathName.substring(1);
        }

        if (!currentPathName || currentPathName === '/') {
            currentPathName = null;
        }

        const queryParamObject: any = {};

        if (currentPathName || window.location.search) {
            queryParamObject.loginredirect =
                (currentPathName || '') + (window.location.search || '');
        }

        router.navigate(['/' + RoutesList.Login], {
            queryParams: queryParamObject,
        });
    }

    private static getHomePageByRole(role: RolesList) {
        return homePagesByRoles?.find((x) => x.role === role)?.homePage || '/';
    }

    private static getHomePageByRolesList(roles: RolesList[]) {
        if (!roles?.length) {
            return defaultHomePageForUser;
        }

        for (const role of roles) {
            if (homePagesByRoles.some((x) => x.role === role)) {
                return this.getHomePageByRole(role);
            }
        }

        return defaultHomePageForUser;
    }

    static getHomePageByUser() {
        return this.getHomePageByRolesList(
            AuthDataService.currentUser.rolesString as any[],
        );
    }

    static afterLoginRedirect(router: Router, useAngularRouter = true) {
        const decodedUri = this.getLoginRedirectParameter();
        const baseUrl = this.getHomePageByUser();

        if (!decodedUri) {
            if (useAngularRouter) router.navigate([baseUrl]);
            else window.location.href = baseUrl;
            return;
        }

        if (useAngularRouter) {
            const queryParameters =
                MainHelpers.getUrlQueryParametersList(decodedUri);
            const baseUrlFromRedirectUri = decodedUri.split('?')[0] || '';
            router.navigate(['/' + baseUrlFromRedirectUri], {
                queryParams: queryParameters,
            });
        } else {
            window.location.href = decodedUri;
        }
    }

    static sendApiRequest<T>(
        method: Observable<T>,
        destroySubject?: Subject<any>,
        eventsCollector?: EventsCollector,
    ): Promise<T> {
        let obs = method;

        if (destroySubject) {
            obs = obs.pipe(takeUntil(destroySubject));
        }
        // const sub = obs.subscribe(data => {
        //     resolve(data);
        // });
        // eventsCollector?.collect(sub);
        return lastValueFrom(obs);
    }

    static currentUserIsOnlyConsultant() {
        return (
            SharedService.userHasRole(
                AuthDataService.currentUser,
                RolesList.Consultant,
            ) &&
            !SharedService.userHasOneOfRoles(AuthDataService.currentUser, [
                RolesList.RH,
                RolesList.Admin,
                RolesList.AdminTech,
            ])
        );
    }

    static currentUserIsConsultant() {
        return SharedService.userHasRole(
            AuthDataService.currentUser,
            RolesList.Consultant,
        );
    }

    static currentUserIsConsultantOrRH() {
        return SharedService.userHasOneOfRoles(AuthDataService.currentUser, [
            RolesList.Consultant,
            RolesList.RH,
        ]);
    }

    static async getConsultantOrRHList(
        userService: UsersService,
        baseComponent: BaseComponent,
    ) {
        return await baseComponent.sendApiRequest(
            userService.getAllUsers({
                roles: [RolesList.Consultant, RolesList.RH, RolesList.Admin].join(','),
            }),
        );
    }

    static dbTranslateAppValue(element: AppValueDto) {
        return DbTranslatePipe.dbTranslateValue('label', element);
    }

    static getConsultantDisplay(element: UserDto) {
        return element.lastName.toUpperCase() + ' ' + element.firstName;
    }

    static print(baseComponent?: any, closeMenu = true, delay = 200) {
        if (typeof window === 'undefined') {
            return;
        }

        if (closeMenu) {
            EventsHandler.CloseLeftMenu.next();
        } else {
            delay = 0;
        }

        let method: (cb: () => void, del: number) => void =
            baseComponent?.setTimeout?.bind(this);

        if (method == null) {
            method = setTimeout;
        }

        method.apply(this, [
            () => {
                window.print();
            },
            delay,
        ]);
    }
}
