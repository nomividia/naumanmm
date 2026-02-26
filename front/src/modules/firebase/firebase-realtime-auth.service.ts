import { DateHelpers, MainHelpers } from 'nextalys-js-helpers';
import { EventsCollector } from 'nextalys-js-helpers/dist/events';
import { SharedService } from '../../../../shared/shared-service';
import {
    FirebaseRefs,
    INxsFireConnectedUsers,
    NxsFirebaseConnection,
    NxsFirebaseUser,
    NxsFirebaseUserWithConnections,
} from '../../../../shared/shared-types';
import { environment } from '../../environments/environment';
import {
    AppUserConnection,
    AuthDataService,
    ConnectedUserWithPages,
} from '../../services/auth-data.service';
import { EventsHandler } from '../../services/events.handler';
import { GlobalAppService } from '../../services/global.service';
import { SocketService } from '../../services/socket.service';
import { NxsFirebaseAuthService } from './firebase-auth.service';
import { NxsFirebaseRealTimeDatabaseService } from './firebase-realtime-database.service';

interface RtOptions {
    watchFullUsersListChange?: boolean;
    saveAnonymousConnection?: boolean;
}

export class FirebaseRealTimeAuthService {
    private static NxsFireAnonymousUsers: INxsFireConnectedUsers = {};
    private static NxsFireLoggedUsers: INxsFireConnectedUsers = {};
    private static NxsFireCurrentConnectedUser: NxsFirebaseUser = null;
    private static initialized = false;
    private static initializing = false;
    private static connectionId: string;
    private static eventsCollector = new EventsCollector();
    public static anonymousUsers: NxsFirebaseUserWithConnections[] = [];
    public static connectedUsers: NxsFirebaseUserWithConnections[] = [];
    private static currentConnection: NxsFirebaseConnection;

    private static async pInit(opts?: RtOptions) {
        if (this.initialized || this.initializing) {
            return;
        }

        if (!opts) {
            opts = {};
        }

        if (!AuthDataService.currentUser && !opts.saveAnonymousConnection) {
            return;
        }

        this.initializing = true;
        this.connectionId = MainHelpers.generateGuid();

        if (!AuthDataService.currentUser) {
            const userResponse =
                await NxsFirebaseAuthService.signInAnonymously();

            this.NxsFireCurrentConnectedUser = { uid: userResponse.user.uid };
        } else {
            this.NxsFireCurrentConnectedUser = {
                uid: AuthDataService.currentUser.id,
            };
        }

        this.subscribeToFullUsersList(opts);
        this.onUserChanged();
        this.initializing = false;
        this.initialized = true;
    }

    private static onUserChanged() {
        if (!this.NxsFireCurrentConnectedUser) {
            this.NxsFireCurrentConnectedUser = { uid: null, appUserId: null };
        }

        let baseRef: string;

        if (AuthDataService.currentUser) {
            baseRef = FirebaseRefs.NxsLoggedUsers;
            this.NxsFireCurrentConnectedUser.appUserId =
                AuthDataService.currentUser.id;
            this.NxsFireCurrentConnectedUser.appUserName =
                AuthDataService.currentUser.userName;
            this.NxsFireCurrentConnectedUser.uid =
                AuthDataService.currentUser.id;
        } else {
            this.NxsFireCurrentConnectedUser.appUserId = '';
            this.NxsFireCurrentConnectedUser.appUserName = '';
            baseRef = FirebaseRefs.NxsUsers;
        }

        NxsFirebaseRealTimeDatabaseService.instance.angularFireDatabase.database
            .ref(
                baseRef +
                    '/' +
                    this.NxsFireCurrentConnectedUser.uid +
                    '/connections/' +
                    this.connectionId,
            )
            .onDisconnect()
            .remove();
        this.saveCurrentUserConnection();
        this.setCurrentUserId();
    }

    private static subscribeToFullUsersList(opts?: RtOptions) {
        if (!opts) {
            opts = {};
        }

        if (
            !opts.watchFullUsersListChange ||
            !AuthDataService.currentUser ||
            !SharedService.userIsAdminTech(AuthDataService.currentUser)
        ) {
            return;
        }

        const sub1 =
            NxsFirebaseRealTimeDatabaseService.instance.angularFireDatabase
                .object(FirebaseRefs.NxsUsers)
                .valueChanges()
                .subscribe((val: INxsFireConnectedUsers) => {
                    this.onUsersListChanged(val, true);
                });

        this.eventsCollector.collect(sub1);

        const sub2 =
            NxsFirebaseRealTimeDatabaseService.instance.angularFireDatabase
                .object(FirebaseRefs.NxsLoggedUsers)
                .valueChanges()
                .subscribe((val: INxsFireConnectedUsers) => {
                    this.onUsersListChanged(val, false);
                });

        this.eventsCollector.collect(sub2);
    }

    private static onUsersListChanged(
        usersList: INxsFireConnectedUsers,
        anonymous: boolean,
    ) {
        if (!usersList) {
            return;
        }

        if (anonymous) {
            this.NxsFireAnonymousUsers = usersList;
        } else {
            this.NxsFireLoggedUsers = usersList;
        }

        if (
            (this.NxsFireCurrentConnectedUser &&
                this.NxsFireCurrentConnectedUser.uid &&
                usersList[this.NxsFireCurrentConnectedUser.uid] &&
                this.NxsFireCurrentConnectedUser.appUserId &&
                !anonymous) ||
            (!this.NxsFireCurrentConnectedUser.appUserId && anonymous)
        ) {
            this.NxsFireCurrentConnectedUser =
                usersList[this.NxsFireCurrentConnectedUser.uid];
        }
        this.createUserConnections();
    }

    private static sortUsers(users: NxsFirebaseUserWithConnections[]) {
        if (!users || users.length === 0) {
            return;
        }

        for (const user of users) {
            user.connections.sort((a, b) => {
                if (!a.date) {
                    return -1;
                }

                if (!b.date) {
                    return 1;
                }

                return (a.date as Date).getTime() - (b.date as Date).getTime();
            });
        }
    }
    private static parseDates(users: NxsFirebaseUserWithConnections[]) {
        if (!users || users.length === 0) {
            return;
        }

        for (const user of users) {
            for (const connection of user.connections) {
                if (!(connection.date as Date).getTime) {
                    connection.date = new Date(connection.date);
                }
            }
        }
    }

    private static createUserConnectionsFromUsersList(
        usersList: INxsFireConnectedUsers,
        anonymous: boolean,
    ) {
        if (anonymous) {
            this.anonymousUsers = [];
        } else {
            this.connectedUsers = [];
        }

        for (const firebaseUserId in usersList) {
            const firebaseUser = usersList[firebaseUserId];
            if (
                firebaseUser &&
                firebaseUser.connections &&
                Object.keys(firebaseUser.connections).length > 0
            ) {
                let userWrapper: NxsFirebaseUserWithConnections;

                if (!anonymous) {
                    userWrapper = this.connectedUsers.find(
                        (x) => x.appUserId === firebaseUserId,
                    );

                    if (!userWrapper) {
                        userWrapper = {
                            appUserId: firebaseUserId,
                            appUserName: firebaseUser.appUserName,
                            connections: [],
                        };
                        this.connectedUsers.push(userWrapper);
                    }
                } else {
                    userWrapper = {
                        connections: [],
                        firebaseId: firebaseUserId,
                    };
                    this.anonymousUsers.push(userWrapper);
                }

                for (const connection in firebaseUser.connections) {
                    userWrapper.connections.push(
                        firebaseUser.connections[connection],
                    );
                }
            }
        }
    }

    private static createUserConnections() {
        this.createUserConnectionsFromUsersList(this.NxsFireLoggedUsers, false);
        this.createUserConnectionsFromUsersList(
            this.NxsFireAnonymousUsers,
            true,
        );
        this.parseDates(this.anonymousUsers);
        this.parseDates(this.connectedUsers);
        this.sortUsers(this.anonymousUsers);
        this.sortUsers(this.connectedUsers);

        AuthDataService.ConnectedUsersList =
            this.connectedUsers.map<ConnectedUserWithPages>((x) => ({
                userId: x.appUserId,
                connections: x.connections.map<AppUserConnection>((y) => ({
                    connection: y.id,
                    page: { page: y.page, data: y.pageMeta },
                })),
            }));
    }

    static async saveCurrentUserConnection() {
        if (
            !this.connectionId ||
            !this.NxsFireCurrentConnectedUser ||
            !this.NxsFireCurrentConnectedUser.uid
        ) {
            return;
        }
        if (!this.currentConnection) {
            this.currentConnection = {};
        }

        if (!this.currentConnection.date) {
            this.currentConnection.date = DateHelpers.formatDateISO8601(
                new Date(),
            );
        }

        this.currentConnection.id = this.connectionId;
        this.currentConnection.page = GlobalAppService.currentPage;
        this.currentConnection.pageMeta = GlobalAppService.currentPageMeta;

        if (!this.currentConnection.page) {
            this.currentConnection.page = null;
        }

        if (!this.currentConnection.pageMeta) {
            this.currentConnection.pageMeta = null;
        }

        this.currentConnection.socketConnection = SocketService.socket?.id;

        if (!this.currentConnection.socketConnection) {
            this.currentConnection.socketConnection = null;
        }

        let baseRef: string;

        if (this.NxsFireCurrentConnectedUser.appUserId) {
            baseRef = FirebaseRefs.NxsLoggedUsers;
        } else {
            baseRef = FirebaseRefs.NxsUsers;
        }

        try {
            await NxsFirebaseRealTimeDatabaseService.instance.angularFireDatabase
                .object(
                    baseRef +
                        '/' +
                        this.NxsFireCurrentConnectedUser.uid +
                        '/connections/' +
                        this.connectionId,
                )
                .set(this.currentConnection);
        } catch (err) {
            console.error(err);
        }
    }

    static async setCurrentUserId() {
        if (
            !this.NxsFireCurrentConnectedUser ||
            !this.NxsFireCurrentConnectedUser.uid ||
            !this.NxsFireCurrentConnectedUser.appUserId
        ) {
            return;
        }

        await NxsFirebaseRealTimeDatabaseService.instance.angularFireDatabase
            .object(
                FirebaseRefs.NxsLoggedUsers +
                    '/' +
                    this.NxsFireCurrentConnectedUser.uid,
            )
            .update({
                appUserId: this.NxsFireCurrentConnectedUser.appUserId,
                appUserName: this.NxsFireCurrentConnectedUser.appUserName,
                uid: this.NxsFireCurrentConnectedUser.uid,
            } as NxsFirebaseUser);
    }

    static init(opts?: RtOptions) {
        if (
            !environment.liveTrackingEnabled ||
            !environment.production ||
            !NxsFirebaseRealTimeDatabaseService.instance ||
            !NxsFirebaseRealTimeDatabaseService.instance.angularFireDatabase
        ) {
            return;
        }

        const sub = EventsHandler.AuthServiceInitialized.subscribe(() => {
            this.pInit(opts);
        });

        this.eventsCollector.collect(sub);

        const sub2 = AuthDataService.currentUserChanged.subscribe(() => {
            this.onUserChanged();
        });

        this.eventsCollector.collect(sub2);

        const sub3 = SocketService.onSocketConnectionIdReceived.subscribe(
            () => {
                if (
                    this.currentConnection &&
                    !this.currentConnection.socketConnection &&
                    SocketService.socket.id
                ) {
                    this.saveCurrentUserConnection();
                }
            },
        );

        this.eventsCollector.collect(sub3);

        if (environment.liveTrackingPageEnabled) {
            const sub4 = EventsHandler.PageChanged.subscribe(() => {
                this.saveCurrentUserConnection();
            });

            this.eventsCollector.collect(sub4);
        }
    }
}
