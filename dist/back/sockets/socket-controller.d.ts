import { BaseController } from '../shared/base.controller';
import { GetUserConnectionsWrapperResponse } from './socket-data';
import { SocketGateway } from './socket-gateway';
export declare class ApiSocketController extends BaseController {
    private socketGateway;
    constructor(socketGateway: SocketGateway);
    getSocketConnections(): Promise<GetUserConnectionsWrapperResponse>;
}
