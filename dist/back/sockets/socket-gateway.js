"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.SocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const nextalys_js_helpers_1 = require("nextalys-js-helpers");
const socket_io_1 = require("socket.io");
const shared_constants_1 = require("../../shared/shared-constants");
const environment_1 = require("../environment/environment");
const firebase_service_1 = require("../modules/firebase/firebase-service");
const pm2_helpers_1 = require("../services/pm2-helpers");
const socket_data_1 = require("./socket-data");
const socket_events_handler_1 = require("./socket-events-handler");
let SocketGateway = class SocketGateway {
    handleDisconnect(client) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshResponse = yield socket_events_handler_1.SocketEventsHandler.handleDisconnect(this.server);
            if (environment_1.Environment.PM2ClusterMode) {
                const getSocketResponse = yield this.getSocketConnectionsList(refreshResponse);
                pm2_helpers_1.PM2Helpers.sendDataToAllAppProcesses({
                    eventName: 'RetrieveSocketConnectionsList',
                    data: {
                        pm2Id: pm2_helpers_1.PM2Helpers.pm2AppId,
                        data: getSocketResponse,
                    },
                }, true);
            }
            yield this.sendEventToClient(shared_constants_1.CustomSocketEventType.AnyUserSocketDisconnected);
        });
    }
    handleConnection(client, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const socketDate = socket_data_1.SocketData.SocketConnectionsWithDates.find((x) => x.connectionId === client.id);
            if (!socketDate) {
                socket_data_1.SocketData.SocketConnectionsWithDates.push({
                    connectionId: client.id,
                    date: nextalys_js_helpers_1.DateHelpers.convertUTCDateToLocalDate(new Date()),
                });
            }
            if (environment_1.Environment.PM2ClusterMode) {
                const getSocketResponse = yield this.getSocketConnectionsList(null);
                pm2_helpers_1.PM2Helpers.sendDataToAllAppProcesses({
                    eventName: 'RetrieveSocketConnectionsList',
                    data: {
                        pm2Id: pm2_helpers_1.PM2Helpers.pm2AppId,
                        data: getSocketResponse,
                    },
                }, true);
            }
        });
    }
    afterInit(server) {
        console.log('SOCKET afterInit ~ PM2 APP ID', pm2_helpers_1.PM2Helpers.pm2AppId);
        this.server = server;
        if (!environment_1.Environment.PM2ClusterMode) {
            return;
        }
        pm2_helpers_1.PM2Helpers.onPM2Data.subscribe((data) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if ((data === null || data === void 0 ? void 0 : data.eventName) === 'SendSocketEventToAllClients') {
                const args = data === null || data === void 0 ? void 0 : data.data;
                if ((args === null || args === void 0 ? void 0 : args.length) && (args === null || args === void 0 ? void 0 : args.length) >= 2) {
                    (_a = this.server) === null || _a === void 0 ? void 0 : _a.emit(args[0], args[1]);
                }
            }
            else if ((data === null || data === void 0 ? void 0 : data.eventName) === 'SendSocketEventToSpecificUsers') {
                const dataWrapper = data === null || data === void 0 ? void 0 : data.data;
                const socketArgs = dataWrapper === null || dataWrapper === void 0 ? void 0 : dataWrapper.args;
                if (((_b = dataWrapper === null || dataWrapper === void 0 ? void 0 : dataWrapper.userIds) === null || _b === void 0 ? void 0 : _b.length) &&
                    (socketArgs === null || socketArgs === void 0 ? void 0 : socketArgs.length) &&
                    socketArgs.length >= 2) {
                    yield this.p_sendEventToClient(socketArgs[0], socketArgs[1], dataWrapper.userIds, false);
                }
            }
            else if ((data === null || data === void 0 ? void 0 : data.eventName) === 'RetrieveSocketConnectionsList') {
                const dataWrapper = data === null || data === void 0 ? void 0 : data.data;
                if ((dataWrapper === null || dataWrapper === void 0 ? void 0 : dataWrapper.pm2Id) != null) {
                    let listWrapper = socket_data_1.SocketData.UserConnectionsListByPM2App.find((x) => x.pm2AppId === (dataWrapper === null || dataWrapper === void 0 ? void 0 : dataWrapper.pm2Id));
                    if (!listWrapper) {
                        listWrapper = new socket_data_1.UserConnectionsByPM2App();
                        listWrapper.pm2AppId = dataWrapper.pm2Id;
                        socket_data_1.SocketData.UserConnectionsListByPM2App.push(listWrapper);
                    }
                    listWrapper.connectionsWrapper = dataWrapper.data;
                }
            }
        }));
    }
    setUserId(client, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield socket_events_handler_1.SocketEventsHandler.setUserId(client, userId, this.server);
            if (environment_1.Environment.PM2ClusterMode && (response === null || response === void 0 ? void 0 : response.resfreshResponse)) {
                const getSocketResponse = yield this.getSocketConnectionsList(response.resfreshResponse);
                pm2_helpers_1.PM2Helpers.sendDataToAllAppProcesses({
                    eventName: 'RetrieveSocketConnectionsList',
                    data: {
                        pm2Id: pm2_helpers_1.PM2Helpers.pm2AppId,
                        data: getSocketResponse,
                    },
                }, true);
            }
            yield this.sendEventToClient(shared_constants_1.CustomSocketEventType.AnyUserSocketConnected);
            return client.id;
        });
    }
    onUserLogout(client, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield socket_events_handler_1.SocketEventsHandler.onUserLogout(client, userId, this.server);
            if (environment_1.Environment.PM2ClusterMode && (response === null || response === void 0 ? void 0 : response.resfreshResponse)) {
                const getSocketResponse = yield this.getSocketConnectionsList(response.resfreshResponse);
                pm2_helpers_1.PM2Helpers.sendDataToAllAppProcesses({
                    eventName: 'RetrieveSocketConnectionsList',
                    data: {
                        pm2Id: pm2_helpers_1.PM2Helpers.pm2AppId,
                        data: getSocketResponse,
                    },
                }, true);
            }
            return client.id;
        });
    }
    getSocketConnectionIdsFromFirebase(userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield firebase_service_1.FirebaseService.getUsersData(userIds);
            const connections = [];
            for (const user of users) {
                if (!user.connections)
                    continue;
                for (const connectionKey in user.connections) {
                    if (user.connections[connectionKey].socketConnection)
                        connections.push(user.connections[connectionKey].socketConnection);
                }
            }
            return connections;
        });
    }
    p_sendEventToClient(evt, data, userIds, sendToPM2OtherApps = true) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (data) {
                if (!data.date)
                    data.date = new Date();
            }
            if (!userIds) {
                (_a = this.server) === null || _a === void 0 ? void 0 : _a.emit(evt, data);
                if (sendToPM2OtherApps) {
                    pm2_helpers_1.PM2Helpers.sendDataToAllAppProcesses({
                        eventName: 'SendSocketEventToAllClients',
                        data: [evt, data],
                    }, true);
                }
                return;
            }
            let connectionsIds = [];
            yield socket_data_1.SocketData.RefreshUserConnectionsFromAllConnectionsList(this.server);
            const connections = socket_data_1.SocketData.UserConnectionsList.filter((x) => {
                return userIds.indexOf(x.userId) !== -1;
            });
            connections.forEach((conn) => {
                connectionsIds.push(...conn.connections);
            });
            if (connectionsIds.length > 0) {
                const listSelf = connectionsIds.filter((x) => x.appPM2Id === pm2_helpers_1.PM2Helpers.pm2AppId);
                for (const connectionIdWrapper of listSelf) {
                    (_c = (_b = this.server) === null || _b === void 0 ? void 0 : _b.to(connectionIdWrapper.connectionId)) === null || _c === void 0 ? void 0 : _c.emit(evt, data);
                }
            }
            if (sendToPM2OtherApps) {
                pm2_helpers_1.PM2Helpers.sendDataToAllAppProcesses({
                    eventName: 'SendSocketEventToSpecificUsers',
                    data: { userIds: userIds, args: [evt, data] },
                }, true);
            }
        });
    }
    sendEventToClient(evt, data, userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.p_sendEventToClient(evt, data, userIds, true);
        });
    }
    getSocketConnectionsList(refreshResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new socket_data_1.GetUserConnectionsResponse(true);
            response.allSocketConnections = [];
            if (!refreshResponse) {
                refreshResponse =
                    yield socket_data_1.SocketData.RefreshUserConnectionsFromAllConnectionsList(this.server);
            }
            response.allSocketConnections = refreshResponse.allConnections;
            response.connections = socket_data_1.SocketData.UserConnectionsList;
            let listWrapper = socket_data_1.SocketData.UserConnectionsListByPM2App.find((x) => x.pm2AppId === pm2_helpers_1.PM2Helpers.pm2AppId);
            if (!listWrapper) {
                listWrapper = new socket_data_1.UserConnectionsByPM2App();
                listWrapper.pm2AppId = pm2_helpers_1.PM2Helpers.pm2AppId;
                socket_data_1.SocketData.UserConnectionsListByPM2App.push(listWrapper);
            }
            listWrapper.connectionsWrapper = response;
            return response;
        });
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], SocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)(shared_constants_1.CustomSocketEventType.ClientSetUserId),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], SocketGateway.prototype, "setUserId", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(shared_constants_1.CustomSocketEventType.UserLogout),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], SocketGateway.prototype, "onUserLogout", null);
SocketGateway = __decorate([
    (0, websockets_1.WebSocketGateway)()
], SocketGateway);
exports.SocketGateway = SocketGateway;
//# sourceMappingURL=socket-gateway.js.map