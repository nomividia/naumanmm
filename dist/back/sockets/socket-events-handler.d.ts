import { Server, Socket } from 'socket.io';
import { RefreshSocketResponse } from './socket-data';
export declare class SocketEventsHandler {
    static handleDisconnect(server: Server): Promise<RefreshSocketResponse>;
    static onUserLogout(client: Socket, userId: string, server: Server): Promise<{
        clientId: string;
        resfreshResponse: RefreshSocketResponse;
    }>;
    static setUserId(client: Socket, userId: string, server: Server): Promise<{
        clientId: string;
        resfreshResponse: RefreshSocketResponse;
    }>;
}
