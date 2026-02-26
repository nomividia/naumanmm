"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnonymousExchangeModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const app_common_module_1 = require("../../shared/app-common.module");
const socket_module_1 = require("../../sockets/socket-module");
const candidate_applications_module_1 = require("../candidates-application/candidate-applications.module");
const file_module_1 = require("../file/file.module");
const anonymous_exchange_entity_1 = require("./anonymous-exchange.entity");
const anonymous_exchanges_controller_1 = require("./anonymous-exchanges.controller");
const anonymous_exchanges_service_1 = require("./anonymous-exchanges.service");
let AnonymousExchangeModule = class AnonymousExchangeModule {
};
AnonymousExchangeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            app_common_module_1.AppCommonModule,
            typeorm_1.TypeOrmModule.forFeature([anonymous_exchange_entity_1.AnonymousExchange]),
            socket_module_1.SocketModule,
            file_module_1.FileModule,
            candidate_applications_module_1.CandidatApplicationModule,
        ],
        controllers: [anonymous_exchanges_controller_1.AnonymousExchangesController],
        providers: [anonymous_exchanges_service_1.AnonymousExchangesService],
        exports: [anonymous_exchanges_service_1.AnonymousExchangesService],
    })
], AnonymousExchangeModule);
exports.AnonymousExchangeModule = AnonymousExchangeModule;
//# sourceMappingURL=anonymous-exchanges.module.js.map