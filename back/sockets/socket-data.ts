import { ApiProperty } from '@nestjs/swagger';
import { Server } from 'socket.io';
import { Environment } from '../environment/environment';
import { GenericResponse } from '../models/responses/generic-response';
import { PM2Helpers } from '../services/pm2-helpers';
import { RedisManager } from '../services/tools/redis.manager';
export class RefreshSocketResponse {
    allConnections: SocketConnection[];
    userConnections: UserConnections[];
}

export class SocketConnection {
    @ApiProperty()
    appPM2Id: number;
    @ApiProperty({ type: String })
    connectionId: string;
    @ApiProperty({ type: String, format: 'date-time' })
    date?: Date;
}

export class UserConnections {
    @ApiProperty()
    userId: string;
    @ApiProperty({ type: SocketConnection, isArray: true })
    connections: SocketConnection[];
}

export class GetUserConnectionsResponse extends GenericResponse {
    @ApiProperty({ type: () => UserConnections, isArray: true })
    connections: UserConnections[];

    @ApiProperty({ type: () => SocketConnection, isArray: true })
    allSocketConnections: SocketConnection[];
}

export class UserConnectionsByPM2App {
    @ApiProperty({ type: () => GetUserConnectionsResponse })
    connectionsWrapper: GetUserConnectionsResponse;
    @ApiProperty()
    pm2AppId: number;
}

export class GetUserConnectionsWrapperResponse extends GenericResponse {
    @ApiProperty({ type: () => UserConnectionsByPM2App, isArray: true })
    connectionsWrapper: UserConnectionsByPM2App[] = [];
    @ApiProperty()
    currentPm2AppId: number;
}

export class SocketData {
    static UserConnectionsList: UserConnections[] = [];
    static UserConnectionsListByPM2App: UserConnectionsByPM2App[] = [];
    static SocketConnectionsWithDates: { connectionId: string; date: Date }[] =
        [];

    public static async GetUserConnections(): Promise<UserConnections[]> {
        if (!Environment.UseRedis) return this.UserConnectionsList;
        this.UserConnectionsList = await RedisManager.getObject(
            'UserConnections',
        );
        if (!this.UserConnectionsList) this.UserConnectionsList = [];
        return this.UserConnectionsList;
    }

    public static async UpdateUserConnections(connections: UserConnections[]) {
        this.UserConnectionsList = connections;
        await this.SaveUserConnections();
    }

    public static async SaveUserConnections() {
        if (!Environment.UseRedis) return;
        await RedisManager.setObject(
            'UserConnections',
            this.UserConnectionsList,
        );
    }

    public static async GetAllConnections(server: Server): Promise<string[]> {
        if (!server) {
            return [];
        }
        try {
            const socketsList = await server.fetchSockets();
            return socketsList?.map((x) => x.id) || [];
        } catch (error) {
            return [];
        }
    }

    public static async RefreshUserConnectionsFromAllConnectionsList(
        server: Server,
    ): Promise<RefreshSocketResponse> {
        const connections = await this.GetAllConnections(server);
        if (!connections || connections.length === 0) {
            await this.UpdateUserConnections([]);
            this.SocketConnectionsWithDates = [];
            return { allConnections: [], userConnections: [] };
        }
        const userConnections = await this.GetUserConnections();
        for (const userConnection of userConnections) {
            userConnection.connections = userConnection.connections.filter(
                (x) => connections.indexOf(x.connectionId) !== -1,
            );
        }
        this.SocketConnectionsWithDates =
            this.SocketConnectionsWithDates.filter(
                (x) => connections.indexOf(x.connectionId) !== -1,
            );

        for (const userConnectionsWrapper of userConnections) {
            for (const userConnection of userConnectionsWrapper.connections) {
                userConnection.date = this.SocketConnectionsWithDates.find(
                    (x) => x.connectionId === userConnection.connectionId,
                )?.date;
            }
        }
        const allConnections: SocketConnection[] = [];
        for (const socketConnection of connections) {
            allConnections.push({
                appPM2Id: PM2Helpers.pm2AppId,
                connectionId: socketConnection,
                date: this.SocketConnectionsWithDates.find(
                    (x) => x.connectionId === socketConnection,
                )?.date,
            });
        }
        await this.UpdateUserConnections(userConnections);
        return {
            allConnections: allConnections,
            userConnections: userConnections,
        };
    }
}
