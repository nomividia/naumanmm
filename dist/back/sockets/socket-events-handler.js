"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketEventsHandler = void 0;
const pm2_helpers_1 = require("../services/pm2-helpers");
const socket_data_1 = require("./socket-data");
class SocketEventsHandler {
    static handleDisconnect(server) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield socket_data_1.SocketData.RefreshUserConnectionsFromAllConnectionsList(server);
        });
    }
    static onUserLogout(client, userId, server) {
        return __awaiter(this, void 0, void 0, function* () {
            const userConnectionsList = yield socket_data_1.SocketData.GetUserConnections();
            const userConnections = userConnectionsList.find((x) => x.userId === userId);
            let resfreshResponse;
            if (userConnections) {
                const connectionToRemove = userConnections.connections.findIndex((x) => x.connectionId === client.id);
                if (connectionToRemove !== -1) {
                    userConnections.connections.splice(connectionToRemove, 1);
                    yield socket_data_1.SocketData.UpdateUserConnections(userConnectionsList);
                    resfreshResponse =
                        yield socket_data_1.SocketData.RefreshUserConnectionsFromAllConnectionsList(server);
                }
            }
            return { clientId: client.id, resfreshResponse: resfreshResponse };
        });
    }
    static setUserId(client, userId, server) {
        return __awaiter(this, void 0, void 0, function* () {
            const userConnectionsList = yield socket_data_1.SocketData.GetUserConnections();
            const user = userConnectionsList.find((x) => x.userId === userId);
            if (!user) {
                userConnectionsList.push({
                    userId: userId,
                    connections: [
                        { connectionId: client.id, appPM2Id: pm2_helpers_1.PM2Helpers.pm2AppId },
                    ],
                });
            }
            else {
                if (!user.connections)
                    user.connections = [];
                if (user.connections.findIndex((x) => x.connectionId === client.id) === -1)
                    user.connections.push({
                        connectionId: client.id,
                        appPM2Id: pm2_helpers_1.PM2Helpers.pm2AppId,
                    });
            }
            yield socket_data_1.SocketData.UpdateUserConnections(userConnectionsList);
            const resfreshResponse = yield socket_data_1.SocketData.RefreshUserConnectionsFromAllConnectionsList(server);
            return { clientId: client.id, resfreshResponse: resfreshResponse };
        });
    }
}
exports.SocketEventsHandler = SocketEventsHandler;
//# sourceMappingURL=socket-events-handler.js.map