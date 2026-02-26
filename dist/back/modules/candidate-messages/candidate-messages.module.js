"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateMessagesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_tools_service_1 = require("../../services/auth-tools.service");
const app_common_module_1 = require("../../shared/app-common.module");
const socket_module_1 = require("../../sockets/socket-module");
const candidates_module_1 = require("../candidates/candidates.module");
const candidate_message_entity_1 = require("./candidate-message.entity");
const candidate_messages_controller_1 = require("./candidate-messages.controller");
const candidate_messages_service_1 = require("./candidate-messages.service");
let CandidateMessagesModule = class CandidateMessagesModule {
};
CandidateMessagesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            app_common_module_1.AppCommonModule,
            typeorm_1.TypeOrmModule.forFeature([candidate_message_entity_1.CandidateMessage]),
            candidates_module_1.CandidateModule,
            socket_module_1.SocketModule,
        ],
        controllers: [candidate_messages_controller_1.CandidateMessagesController],
        providers: [candidate_messages_service_1.CandidateMessagesService, auth_tools_service_1.AuthToolsService],
        exports: [candidate_messages_service_1.CandidateMessagesService],
    })
], CandidateMessagesModule);
exports.CandidateMessagesModule = CandidateMessagesModule;
//# sourceMappingURL=candidate-messages.module.js.map