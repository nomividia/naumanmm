import { Server, Socket } from 'socket.io';
import { PM2Helpers } from '../services/pm2-helpers';
import {
    RefreshSocketResponse,
    SocketData,
    UserConnections,
} from './socket-data';

export class SocketEventsHandler {
    static async handleDisconnect(server: Server) {
        return await SocketData.RefreshUserConnectionsFromAllConnectionsList(
            server,
        );
    }

    static async onUserLogout(client: Socket, userId: string, server: Server) {
        const userConnectionsList = await SocketData.GetUserConnections();
        const userConnections = userConnectionsList.find(
            (x) => x.userId === userId,
        );
        let resfreshResponse: RefreshSocketResponse;
        if (userConnections) {
            const connectionToRemove = userConnections.connections.findIndex(
                (x) => x.connectionId === client.id,
            );
            if (connectionToRemove !== -1) {
                userConnections.connections.splice(connectionToRemove, 1);
                await SocketData.UpdateUserConnections(userConnectionsList);
                resfreshResponse =
                    await SocketData.RefreshUserConnectionsFromAllConnectionsList(
                        server,
                    );
            }
        }
        return { clientId: client.id, resfreshResponse: resfreshResponse };
    }

    static async setUserId(client: Socket, userId: string, server: Server) {
        const userConnectionsList = await SocketData.GetUserConnections();
        const user: UserConnections = userConnectionsList.find(
            (x) => x.userId === userId,
        );
        if (!user) {
            userConnectionsList.push({
                userId: userId,
                connections: [
                    { connectionId: client.id, appPM2Id: PM2Helpers.pm2AppId },
                ],
            });
        } else {
            if (!user.connections) user.connections = [];
            if (
                user.connections.findIndex(
                    (x) => x.connectionId === client.id,
                ) === -1
            )
                user.connections.push({
                    connectionId: client.id,
                    appPM2Id: PM2Helpers.pm2AppId,
                });
        }
        await SocketData.UpdateUserConnections(userConnectionsList);
        const resfreshResponse =
            await SocketData.RefreshUserConnectionsFromAllConnectionsList(
                server,
            );
        return { clientId: client.id, resfreshResponse: resfreshResponse };
    }
}
