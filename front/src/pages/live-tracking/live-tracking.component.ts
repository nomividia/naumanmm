import { Component, ViewEncapsulation } from '@angular/core';
import { DateHelpers } from 'nextalys-js-helpers';
import { NxsList } from 'nextalys-js-helpers/dist/nxs-list';
import {
    CustomSocketEventType,
    FirebaseRealTimeDatabaseEnabled,
} from '../../../../shared/shared-constants';
import { NxsFirebaseUserWithConnections } from '../../../../shared/shared-types';
import { BaseComponent } from '../../components/base/base.component';
import {
    ApiSocketService,
    UserConnectionsByPM2App,
} from '../../providers/api-client.generated';
import { SocketService } from '../../services/socket.service';

interface LiveTrackingUser {
    userId: string;
    userName: string;
    connections: {
        socketConnection?: string;
        date?: string | Date;
        page?: string;
    }[];
    firebaseId?: string;
    userLink?: string;
}

interface LiveTrackingUserByApp {
    users: LiveTrackingUser[];
    anonymousUsers: LiveTrackingUser[];
    pm2AppId: number;
}

@Component({
    selector: 'app-live-tracking',
    templateUrl: './live-tracking.component.html',
    styleUrls: ['./live-tracking.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LiveTrackingComponent extends BaseComponent {
    currentPM2AppId: number = 0;
    // LiveTrackingService = FirebaseRealTimeAuthService;
    private socketUsersList: UserConnectionsByPM2App[] = [];
    // private allSocketConnections: string[] = [];
    // private anonymousConnections: SocketConnection[] = [];

    FirebaseRealTimeDatabaseEnabled = FirebaseRealTimeDatabaseEnabled;
    // get connectedUsers(): LiveTrackingUserByApp[] {
    //     if (FirebaseRealTimeDatabaseEnabled) {
    //         return this.transformListToLiveTrackingList(FirebaseRealTimeAuthService.connectedUsers);
    //     }
    //     else {
    //         return this.transformListToLiveTrackingList(this.socketUsersList);
    //     }
    // }
    // get anonymousUsers(): LiveTrackingUserByApp[] {
    //     if (FirebaseRealTimeDatabaseEnabled) {
    //         return this.transformListToLiveTrackingList(FirebaseRealTimeAuthService.anonymousUsers);
    //     }
    //     else {
    //         return this.transformListToLiveTrackingList(this.anonymousConnections.map<UserConnections>(x => ({ userId: 'anonymous', connections: [{ connectionId: x.connectionId, appPM2Id: x.appPM2Id }] })));
    //     }
    // }
    allUsers: LiveTrackingUserByApp[] = [];

    constructor(private apiSocketService: ApiSocketService) {
        super();
        this.init();

        SocketService.subscribeToEvent(
            CustomSocketEventType.RetrieveSocketConnectionsList,
            this.eventsCollector,
            (data) => {
                console.log(
                    'Log ~ file: live-tracking.component.ts ~ line 66 ~ LiveTrackingComponent ~ SocketService.subscribeToEvent ~ data',
                    data,
                );
            },
        );
    }

    async init() {
        // if (!FirebaseRealTimeDatabaseEnabled) {
        const response = await this.sendApiRequest(
            this.apiSocketService.getSocketConnections(),
        );

        console.log(
            'Log ~ file: live-tracking.component.ts ~ line 59 ~ LiveTrackingComponent ~ init ~ response',
            response,
        );

        if (response.success) {
            this.currentPM2AppId = response.currentPm2AppId;
            this.socketUsersList = response.connectionsWrapper;
            // this.allSocketConnections = response.allSocketConnections || [];
            // this.anonymousConnections = this.allSocketConnections.filter(x => !this.socketUsersList.some(y => y.connections.indexOf(x) !== -1));
            this.allUsers = this.transformListToLiveTrackingList(
                this.socketUsersList,
            );
        }

        this.setInterval(() => {
            // this.init();
        }, 5000);

        // }
    }
    private transformListToLiveTrackingList(
        usersList: (NxsFirebaseUserWithConnections | UserConnectionsByPM2App)[],
    ) {
        // if (FirebaseRealTimeDatabaseEnabled) {
        //     return (usersList as NxsFirebaseUserWithConnections[]).map<LiveTrackingUserByApp>(x => ({
        //         userId: x.appUserId,
        //         userName: x.appUserName,
        //         connections: x.connections,
        //     }));
        // }
        // else {
        const listByApp: LiveTrackingUserByApp[] = [];

        for (const usersWrapper of usersList as UserConnectionsByPM2App[]) {
            let users =
                usersWrapper.connectionsWrapper.connections.map<LiveTrackingUser>(
                    (y) => ({
                        userId: y.userId,
                        userName: y.userId,
                        connections: y.connections.map((z) => ({
                            date: z.date,
                            socketConnection: z.connectionId,
                        })),
                    }),
                );

            users = users.filter((x) => !!x.connections?.length);

            if (this.AuthDataService.UsersList?.length) {
                for (const userWrapper of users) {
                    const userFromList = this.AuthDataService.UsersList?.find(
                        (x) => x.id === userWrapper.userId,
                    );

                    if (userFromList) {
                        userWrapper.userName = userFromList.userName;
                        userWrapper.userLink =
                            '/' +
                            this.RoutesList.AdminUsers +
                            '/' +
                            userFromList.userName;
                    }
                }
            }

            const allUserConnectionsIds = new NxsList(users)
                ?.SelectMany((x) => new NxsList(x.connections))
                ?.ToArray()
                ?.map((x) => x.socketConnection);

            const anonymousUsers =
                usersWrapper.connectionsWrapper.allSocketConnections
                    .filter(
                        (x) =>
                            !allUserConnectionsIds?.length ||
                            allUserConnectionsIds.indexOf(x.connectionId) ===
                                -1,
                    )
                    .map<LiveTrackingUser>((y) => ({
                        userId: 'anonymous',
                        userName: 'anonymous',
                        connections: [
                            { socketConnection: y.connectionId, date: y.date },
                        ],
                    }));

            listByApp.push({
                anonymousUsers: anonymousUsers,
                pm2AppId: usersWrapper.pm2AppId,
                users: users,
            });
        }

        return listByApp;
        // return (usersList as UserConnectionsByPM2App[]).map<LiveTrackingUserByApp>(x => ({
        //     anonymousUsers: [],
        //     pm2AppId: 1,
        //     users: x.connectionsWrapper.connections.map<LiveTrackingUser>(y => ({
        //         userId: y.userId,
        //         userName: y.userId,
        //         connections: y.connections.map(z => ({ date: new Date(), socketConnection: z.connectionId })),
        //     })),
        // }));
        // }
    }

    getUserLastConnection(user: LiveTrackingUser, returnSocketId?: boolean) {
        if (!user) {
            return '';
        }

        if (!user.connections || user.connections.length === 0) {
            return '';
        }

        if (!user.connections[0].date) {
            return;
        }

        if (returnSocketId) {
            return user.connections[0].socketConnection;
        } else {
            return DateHelpers.formatDate(
                user.connections[0].date as Date,
                true,
            );
        }
    }
}
