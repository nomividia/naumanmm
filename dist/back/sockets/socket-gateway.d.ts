import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CustomSocketEventType, SocketEventPayload } from '../../shared/shared-constants';
import { GetUserConnectionsResponse, RefreshSocketResponse } from './socket-data';
export declare class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    server: Server;
    handleDisconnect(client: Socket): Promise<void>;
    handleConnection(client: Socket, ...args: any[]): Promise<void>;
    afterInit(server: Server): void;
    setUserId(client: Socket, userId: string): Promise<string>;
    onUserLogout(client: Socket, userId: string): Promise<string>;
    getSocketConnectionIdsFromFirebase(userIds: string[]): Promise<string[]>;
    private p_sendEventToClient;
    sendEventToClient(evt: CustomSocketEventType, data?: SocketEventPayload, userIds?: string[]): Promise<void>;
    getSocketConnectionsList(refreshResponse: RefreshSocketResponse): Promise<GetUserConnectionsResponse>;
}
