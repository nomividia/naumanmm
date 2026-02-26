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
exports.ApiSocketController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shared_constants_1 = require("../../shared/shared-constants");
const roles_guard_1 = require("../services/guards/roles-guard");
const pm2_helpers_1 = require("../services/pm2-helpers");
const roles_decorator_1 = require("../services/roles.decorator");
const base_controller_1 = require("../shared/base.controller");
const socket_data_1 = require("./socket-data");
const socket_gateway_1 = require("./socket-gateway");
let ApiSocketController = class ApiSocketController extends base_controller_1.BaseController {
    constructor(socketGateway) {
        super();
        this.socketGateway = socketGateway;
    }
    getSocketConnections() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new socket_data_1.GetUserConnectionsWrapperResponse();
            const selfResponse = yield this.socketGateway.getSocketConnectionsList(null);
            response.connectionsWrapper = socket_data_1.SocketData.UserConnectionsListByPM2App;
            response.success = true;
            response.currentPm2AppId = pm2_helpers_1.PM2Helpers.pm2AppId;
            return response;
        });
    }
};
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.AdminTech),
    (0, common_1.Get)('getSocketConnections'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'getSocketConnections',
        operationId: 'getSocketConnections',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'GetUserConnectionsResponse',
        type: socket_data_1.GetUserConnectionsWrapperResponse,
    }),
    (0, common_1.HttpCode)(200),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApiSocketController.prototype, "getSocketConnections", null);
ApiSocketController = __decorate([
    (0, common_1.Controller)('api-socket'),
    (0, swagger_1.ApiTags)('api-socket'),
    __metadata("design:paramtypes", [socket_gateway_1.SocketGateway])
], ApiSocketController);
exports.ApiSocketController = ApiSocketController;
//# sourceMappingURL=socket-controller.js.map