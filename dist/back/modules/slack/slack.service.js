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
exports.SlackService = void 0;
const common_1 = require("@nestjs/common");
const slack_helpers_1 = require("nextalys-node-helpers/dist/slack-helpers");
const environment_1 = require("../../environment/environment");
const generic_response_1 = require("../../models/responses/generic-response");
const base_service_1 = require("../../services/base-service");
const logger_service_1 = require("../../services/tools/logger.service");
let SlackService = class SlackService extends base_service_1.ApplicationBaseService {
    constructor() {
        super();
    }
    sendSlackNotification(to, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                if (!environment_1.Environment.SlackToken) {
                    return new generic_response_1.GenericResponse(false, 'slack token not provided');
                }
                slack_helpers_1.SlackManager.init(environment_1.Environment.SlackToken);
                yield slack_helpers_1.SlackManager.sendMessage(message, to);
                yield logger_service_1.AppLogger.loggerInstance.log("Envoi d'un message sur Slack : " + message);
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
};
SlackService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SlackService);
exports.SlackService = SlackService;
//# sourceMappingURL=slack.service.js.map