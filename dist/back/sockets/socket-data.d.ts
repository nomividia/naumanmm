import { Server } from 'socket.io';
import { GenericResponse } from '../models/responses/generic-response';
export declare class RefreshSocketResponse {
    allConnections: SocketConnection[];
    userConnections: UserConnections[];
}
export declare class SocketConnection {
    appPM2Id: number;
    connectionId: string;
    date?: Date;
}
export declare class UserConnections {
    userId: string;
    connections: SocketConnection[];
}
export declare class GetUserConnectionsResponse extends GenericResponse {
    connections: UserConnections[];
    allSocketConnections: SocketConnection[];
}
export declare class UserConnectionsByPM2App {
    connectionsWrapper: GetUserConnectionsResponse;
    pm2AppId: number;
}
export declare class GetUserConnectionsWrapperResponse extends GenericResponse {
    connectionsWrapper: UserConnectionsByPM2App[];
    currentPm2AppId: number;
}
export declare class SocketData {
    static UserConnectionsList: UserConnections[];
    static UserConnectionsListByPM2App: UserConnectionsByPM2App[];
    static SocketConnectionsWithDates: {
        connectionId: string;
        date: Date;
    }[];
    static GetUserConnections(): Promise<UserConnections[]>;
    static UpdateUserConnections(connections: UserConnections[]): Promise<void>;
    static SaveUserConnections(): Promise<void>;
    static GetAllConnections(server: Server): Promise<string[]>;
    static RefreshUserConnectionsFromAllConnectionsList(server: Server): Promise<RefreshSocketResponse>;
}
