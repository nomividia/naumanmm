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
exports.SocketData = exports.GetUserConnectionsWrapperResponse = exports.UserConnectionsByPM2App = exports.GetUserConnectionsResponse = exports.UserConnections = exports.SocketConnection = exports.RefreshSocketResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
const environment_1 = require("../environment/environment");
const generic_response_1 = require("../models/responses/generic-response");
const pm2_helpers_1 = require("../services/pm2-helpers");
const redis_manager_1 = require("../services/tools/redis.manager");
class RefreshSocketResponse {
}
exports.RefreshSocketResponse = RefreshSocketResponse;
class SocketConnection {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SocketConnection.prototype, "appPM2Id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], SocketConnection.prototype, "connectionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], SocketConnection.prototype, "date", void 0);
exports.SocketConnection = SocketConnection;
class UserConnections {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserConnections.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: SocketConnection, isArray: true }),
    __metadata("design:type", Array)
], UserConnections.prototype, "connections", void 0);
exports.UserConnections = UserConnections;
class GetUserConnectionsResponse extends generic_response_1.GenericResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => UserConnections, isArray: true }),
    __metadata("design:type", Array)
], GetUserConnectionsResponse.prototype, "connections", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => SocketConnection, isArray: true }),
    __metadata("design:type", Array)
], GetUserConnectionsResponse.prototype, "allSocketConnections", void 0);
exports.GetUserConnectionsResponse = GetUserConnectionsResponse;
class UserConnectionsByPM2App {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => GetUserConnectionsResponse }),
    __metadata("design:type", GetUserConnectionsResponse)
], UserConnectionsByPM2App.prototype, "connectionsWrapper", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UserConnectionsByPM2App.prototype, "pm2AppId", void 0);
exports.UserConnectionsByPM2App = UserConnectionsByPM2App;
class GetUserConnectionsWrapperResponse extends generic_response_1.GenericResponse {
    constructor() {
        super(...arguments);
        this.connectionsWrapper = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => UserConnectionsByPM2App, isArray: true }),
    __metadata("design:type", Array)
], GetUserConnectionsWrapperResponse.prototype, "connectionsWrapper", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetUserConnectionsWrapperResponse.prototype, "currentPm2AppId", void 0);
exports.GetUserConnectionsWrapperResponse = GetUserConnectionsWrapperResponse;
class SocketData {
    static GetUserConnections() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!environment_1.Environment.UseRedis)
                return this.UserConnectionsList;
            this.UserConnectionsList = yield redis_manager_1.RedisManager.getObject('UserConnections');
            if (!this.UserConnectionsList)
                this.UserConnectionsList = [];
            return this.UserConnectionsList;
        });
    }
    static UpdateUserConnections(connections) {
        return __awaiter(this, void 0, void 0, function* () {
            this.UserConnectionsList = connections;
            yield this.SaveUserConnections();
        });
    }
    static SaveUserConnections() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!environment_1.Environment.UseRedis)
                return;
            yield redis_manager_1.RedisManager.setObject('UserConnections', this.UserConnectionsList);
        });
    }
    static GetAllConnections(server) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!server) {
                return [];
            }
            try {
                const socketsList = yield server.fetchSockets();
                return (socketsList === null || socketsList === void 0 ? void 0 : socketsList.map((x) => x.id)) || [];
            }
            catch (error) {
                return [];
            }
        });
    }
    static RefreshUserConnectionsFromAllConnectionsList(server) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const connections = yield this.GetAllConnections(server);
            if (!connections || connections.length === 0) {
                yield this.UpdateUserConnections([]);
                this.SocketConnectionsWithDates = [];
                return { allConnections: [], userConnections: [] };
            }
            const userConnections = yield this.GetUserConnections();
            for (const userConnection of userConnections) {
                userConnection.connections = userConnection.connections.filter((x) => connections.indexOf(x.connectionId) !== -1);
            }
            this.SocketConnectionsWithDates =
                this.SocketConnectionsWithDates.filter((x) => connections.indexOf(x.connectionId) !== -1);
            for (const userConnectionsWrapper of userConnections) {
                for (const userConnection of userConnectionsWrapper.connections) {
                    userConnection.date = (_a = this.SocketConnectionsWithDates.find((x) => x.connectionId === userConnection.connectionId)) === null || _a === void 0 ? void 0 : _a.date;
                }
            }
            const allConnections = [];
            for (const socketConnection of connections) {
                allConnections.push({
                    appPM2Id: pm2_helpers_1.PM2Helpers.pm2AppId,
                    connectionId: socketConnection,
                    date: (_b = this.SocketConnectionsWithDates.find((x) => x.connectionId === socketConnection)) === null || _b === void 0 ? void 0 : _b.date,
                });
            }
            yield this.UpdateUserConnections(userConnections);
            return {
                allConnections: allConnections,
                userConnections: userConnections,
            };
        });
    }
}
exports.SocketData = SocketData;
SocketData.UserConnectionsList = [];
SocketData.UserConnectionsListByPM2App = [];
SocketData.SocketConnectionsWithDates = [];
//# sourceMappingURL=socket-data.js.map