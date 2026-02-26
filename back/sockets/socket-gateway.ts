import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { DateHelpers } from 'nextalys-js-helpers';
import { Server, Socket } from 'socket.io';
import {
    CustomSocketEventType,
    SocketEventPayload,
} from '../../shared/shared-constants';
import { Environment } from '../environment/environment';
import { FirebaseService } from '../modules/firebase/firebase-service';
import { PM2Helpers } from '../services/pm2-helpers';
import {
    GetUserConnectionsResponse,
    RefreshSocketResponse,
    SocketConnection,
    SocketData,
    UserConnectionsByPM2App,
} from './socket-data';
import { SocketEventsHandler } from './socket-events-handler';

@WebSocketGateway()
export class SocketGateway
    implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
    @WebSocketServer()
    server: Server;
    async handleDisconnect(client: Socket) {
        const refreshResponse = await SocketEventsHandler.handleDisconnect(
            this.server,
        );
        if (Environment.PM2ClusterMode) {
            const getSocketResponse = await this.getSocketConnectionsList(
                refreshResponse,
            );
            PM2Helpers.sendDataToAllAppProcesses(
                {
                    eventName: 'RetrieveSocketConnectionsList',
                    data: {
                        pm2Id: PM2Helpers.pm2AppId,
                        data: getSocketResponse,
                    },
                },
                true,
            );
        }
        await this.sendEventToClient(
            CustomSocketEventType.AnyUserSocketDisconnected,
        );
    }

    async handleConnection(client: Socket, ...args: any[]) {
        const socketDate = SocketData.SocketConnectionsWithDates.find(
            (x) => x.connectionId === client.id,
        );
        if (!socketDate) {
            SocketData.SocketConnectionsWithDates.push({
                connectionId: client.id,
                date: DateHelpers.convertUTCDateToLocalDate(new Date()),
            });
        }
        if (Environment.PM2ClusterMode) {
            const getSocketResponse = await this.getSocketConnectionsList(null);
            PM2Helpers.sendDataToAllAppProcesses(
                {
                    eventName: 'RetrieveSocketConnectionsList',
                    data: {
                        pm2Id: PM2Helpers.pm2AppId,
                        data: getSocketResponse,
                    },
                },
                true,
            );
        }
    }

    afterInit(server: Server) {
        console.log('SOCKET afterInit ~ PM2 APP ID', PM2Helpers.pm2AppId);
        this.server = server;
        if (!Environment.PM2ClusterMode) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        PM2Helpers.onPM2Data.subscribe(async (data) => {
            if (data?.eventName === 'SendSocketEventToAllClients') {
                // console.log("Log ~ file: socket-gateway.ts ~ line 24 ~ SocketGateway ~ PM2Helpers.onPM2Data.subscribe ~ SendSocketEventToAllClients", data);
                const args: any[] = data?.data;
                if (args?.length && args?.length >= 2) {
                    this.server?.emit(args[0], args[1]);
                }
            } else if (data?.eventName === 'SendSocketEventToSpecificUsers') {
                // console.log("Receive PM2 Data self = " + PM2Helpers.pm2AppId, data.eventName, data?.data?.userIds?.length, data?.data?.args?.length);
                const dataWrapper: { userIds: string[]; args: any[] } =
                    data?.data;
                const socketArgs = dataWrapper?.args;
                if (
                    dataWrapper?.userIds?.length &&
                    socketArgs?.length &&
                    socketArgs.length >= 2
                ) {
                    await this.p_sendEventToClient(
                        socketArgs[0],
                        socketArgs[1],
                        dataWrapper.userIds,
                        false,
                    );
                }
            } else if (data?.eventName === 'RetrieveSocketConnectionsList') {
                const dataWrapper: { data?: any; pm2Id: number } = data?.data;
                // console.log("Log ~ file: socket-gateway.ts ~ line 30 ~ SocketGateway ~ PM2Helpers.onPM2Data.subscribe RetrieveSocketConnectionsList ~ dataWrapper", dataWrapper);

                if (dataWrapper?.pm2Id != null) {
                    let listWrapper =
                        SocketData.UserConnectionsListByPM2App.find(
                            (x) => x.pm2AppId === dataWrapper?.pm2Id,
                        );
                    if (!listWrapper) {
                        listWrapper = new UserConnectionsByPM2App();
                        listWrapper.pm2AppId = dataWrapper.pm2Id;
                        SocketData.UserConnectionsListByPM2App.push(
                            listWrapper,
                        );
                    }
                    listWrapper.connectionsWrapper = dataWrapper.data;
                    // console.log("Log ~ file: socket-gateway.ts ~ line 30 ~ SocketGateway ~ PM2Helpers.onPM2Data.subscribe RetrieveSocketConnectionsList ~ dataWrapper", dataWrapper.userIds);
                    // const socketConnectionsResponse = await this.getSocketConnectionsList();
                    // this.p_sendEventToClient(CustomSocketEventType.RetrieveSocketConnectionsList, { date: new Date(), data: data }, dataWrapper.userIds, false);
                }
            }
        });
    }

    @SubscribeMessage(CustomSocketEventType.ClientSetUserId)
    async setUserId(client: Socket, userId: string): Promise<string> {
        const response = await SocketEventsHandler.setUserId(
            client,
            userId,
            this.server,
        );
        if (Environment.PM2ClusterMode && response?.resfreshResponse) {
            const getSocketResponse = await this.getSocketConnectionsList(
                response.resfreshResponse,
            );
            PM2Helpers.sendDataToAllAppProcesses(
                {
                    eventName: 'RetrieveSocketConnectionsList',
                    data: {
                        pm2Id: PM2Helpers.pm2AppId,
                        data: getSocketResponse,
                    },
                },
                true,
            );
        }
        await this.sendEventToClient(
            CustomSocketEventType.AnyUserSocketConnected,
        );
        return client.id;
    }

    @SubscribeMessage(CustomSocketEventType.UserLogout)
    async onUserLogout(client: Socket, userId: string): Promise<string> {
        const response = await SocketEventsHandler.onUserLogout(
            client,
            userId,
            this.server,
        );
        if (Environment.PM2ClusterMode && response?.resfreshResponse) {
            const getSocketResponse = await this.getSocketConnectionsList(
                response.resfreshResponse,
            );
            PM2Helpers.sendDataToAllAppProcesses(
                {
                    eventName: 'RetrieveSocketConnectionsList',
                    data: {
                        pm2Id: PM2Helpers.pm2AppId,
                        data: getSocketResponse,
                    },
                },
                true,
            );
        }
        return client.id;
    }

    public async getSocketConnectionIdsFromFirebase(userIds: string[]) {
        const users = await FirebaseService.getUsersData(userIds);
        const connections: string[] = [];
        for (const user of users) {
            if (!user.connections) continue;
            for (const connectionKey in user.connections) {
                if (user.connections[connectionKey].socketConnection)
                    connections.push(
                        user.connections[connectionKey].socketConnection,
                    );
            }
        }
        return connections;
    }

    private async p_sendEventToClient(
        evt: CustomSocketEventType,
        data?: SocketEventPayload,
        userIds?: string[],
        sendToPM2OtherApps = true,
    ) {
        // console.log("Log ~ file: socket-gateway.ts ~ line 67 ~ SocketGateway ~ sendEventToClient ~ sendEventToClient", userIds, data);
        if (data) {
            if (!data.date) data.date = new Date();
        }
        if (!userIds) {
            this.server?.emit(evt, data);
            if (sendToPM2OtherApps) {
                PM2Helpers.sendDataToAllAppProcesses(
                    {
                        eventName: 'SendSocketEventToAllClients',
                        data: [evt, data],
                    },
                    true,
                );
            }
            return;
        }
        // console.log('will try to send event socket from pm2 app ', PM2Helpers.pm2AppId, userIds.length, SocketData.UserConnectionsList.map(x => x.userId));
        let connectionsIds: SocketConnection[] = [];
        //if (!getSocketConnectionsFromFirebase || !Environment.FirebaseEnabled) {
        await SocketData.RefreshUserConnectionsFromAllConnectionsList(
            this.server,
        );
        // console.log("Log ~ file: socket-gateway.ts:128 ~ SocketGateway ~ p_sendEventToClient ~ refreshResponse.allConnections", refreshResponse.allConnections);
        // if (!SocketData.UserConnectionsList || SocketData.UserConnectionsList.length === 0)
        //     return;
        // console.log("Log ~ file: socket-gateway.ts:131 ~ SocketGateway ~ p_sendEventToClient ~ SocketData.UserConnectionsList", refreshResponse.userConnections);

        const connections = SocketData.UserConnectionsList.filter((x) => {
            return userIds.indexOf(x.userId) !== -1;
        });
        // console.log("will try to send event socket ~ connections filtered", connections);
        connections.forEach((conn) => {
            connectionsIds.push(...conn.connections);
        });

        // console.log('will try to send event socket - connectionsIds', connectionsIds.length);
        // }
        // else {
        //     const firebaseConnections = await this.getSocketConnectionIdsFromFirebase(userIds);
        //     connectionsIds = firebaseConnections.map<SocketConnection>(x => ({ appPM2Id: 0, connectionId: x }));
        // }
        if (connectionsIds.length > 0) {
            const listSelf = connectionsIds.filter(
                (x) => x.appPM2Id === PM2Helpers.pm2AppId,
            );
            for (const connectionIdWrapper of listSelf) {
                this.server
                    ?.to(connectionIdWrapper.connectionId)
                    ?.emit(evt, data);
            }
        }
        if (sendToPM2OtherApps) {
            // console.log('sending socket data to other processes PM2 - from ' + PM2Helpers.pm2AppId + '...', userIds.length);
            PM2Helpers.sendDataToAllAppProcesses(
                {
                    eventName: 'SendSocketEventToSpecificUsers',
                    data: { userIds: userIds, args: [evt, data] },
                },
                true,
            );
        }
    }

    public async sendEventToClient(
        evt: CustomSocketEventType,
        data?: SocketEventPayload,
        userIds?: string[],
    ) {
        return await this.p_sendEventToClient(evt, data, userIds, true);
    }

    async getSocketConnectionsList(refreshResponse: RefreshSocketResponse) {
        const response = new GetUserConnectionsResponse(true);
        response.allSocketConnections = [];
        if (!refreshResponse) {
            refreshResponse =
                await SocketData.RefreshUserConnectionsFromAllConnectionsList(
                    this.server,
                );
        }
        response.allSocketConnections = refreshResponse.allConnections;
        response.connections = SocketData.UserConnectionsList;
        let listWrapper = SocketData.UserConnectionsListByPM2App.find(
            (x) => x.pm2AppId === PM2Helpers.pm2AppId,
        );
        if (!listWrapper) {
            listWrapper = new UserConnectionsByPM2App();
            listWrapper.pm2AppId = PM2Helpers.pm2AppId;
            SocketData.UserConnectionsListByPM2App.push(listWrapper);
        }
        listWrapper.connectionsWrapper = response;
        // console.log("Log ~ file: socket-gateway.ts ~ line 30 ~ SocketGateway ~ PM2Helpers.onPM2Data.subscribe RetrieveSocketConnectionsList ~ dataWrapper", dataWrapper.userIds);
        // const socketConnectionsResponse = await this.getSocketConnectionsList();
        // this.p_sendEventToClient(CustomSocketEventType.RetrieveSocketConnectionsList, { date: new Date(), data: data }, dataWrapper.userIds, false);
        return response;
    }
}
