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
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const sms_helpers_1 = require("nextalys-node-helpers/dist/sms-helpers");
const environment_1 = require("../../environment/environment");
const generic_response_1 = require("../../models/responses/generic-response");
const base_service_1 = require("../../services/base-service");
const logger_service_1 = require("../../services/tools/logger.service");
const types_1 = require("../../shared/types");
let SmsService = class SmsService extends base_service_1.ApplicationBaseService {
    constructor() {
        super();
    }
    canSendSms() {
        if (environment_1.Environment.IgnoreAllSmsSending) {
            return false;
        }
        if (environment_1.Environment.EnvName !== 'production') {
            return false;
        }
        return true;
    }
    prepareData(data) {
        var _a;
        if ((_a = data === null || data === void 0 ? void 0 : data.to) === null || _a === void 0 ? void 0 : _a.length) {
            data.to = data.to.filter((x) => !!x.contactPhone);
        }
    }
    getProvider() {
        if (environment_1.Environment.SendInBlueApiKey &&
            environment_1.Environment.SmsProvider === 'SendInBlue') {
            return new sms_helpers_1.SendInBlueSmsProvider({
                sendInBlueApiKey: environment_1.Environment.SendInBlueApiKey,
            });
        }
        return null;
    }
    sendSms(data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                if (!this.canSendSms()) {
                    return new generic_response_1.GenericResponse(true);
                }
                this.prepareData(data);
                const sendResponse = yield ((_a = this.getProvider()) === null || _a === void 0 ? void 0 : _a.sendSMS(data));
                response.success = !!(sendResponse === null || sendResponse === void 0 ? void 0 : sendResponse.success);
                if (!response.success) {
                    yield logger_service_1.AppLogger.error('Unable to send sms', sendResponse.error);
                }
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    sendNewsletter(data) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                if (!this.canSendSms()) {
                    return new generic_response_1.GenericResponse(true);
                }
                this.prepareData(data);
                const sendResponse = yield ((_a = this.getProvider()) === null || _a === void 0 ? void 0 : _a.sendNewsletter(data));
                response.success = !!(sendResponse === null || sendResponse === void 0 ? void 0 : sendResponse.success);
                yield logger_service_1.AppLogger.log('sendNewsletter response - success = ' + sendResponse.success, sendResponse.data);
                if (!response.success) {
                    yield logger_service_1.AppLogger.loggerInstance.error('Unable to send newsletter', sendResponse.error);
                }
                else {
                    response.message = (_b = sendResponse === null || sendResponse === void 0 ? void 0 : sendResponse.data) === null || _b === void 0 ? void 0 : _b.newsletterId;
                }
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    sendNewsletterWithListId(data, listId) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new types_1.SendNewsletterResponse();
            try {
                if (!this.canSendSms()) {
                    return new types_1.SendNewsletterResponse(true);
                }
                const newsletterResponse = yield this.getProvider().sendNewsletterWithListId(data, listId);
                response.success = newsletterResponse.success;
                response.listId = (_a = newsletterResponse.data) === null || _a === void 0 ? void 0 : _a.listId;
                response.newsletterId = (_b = newsletterResponse.data) === null || _b === void 0 ? void 0 : _b.newsletterId;
                yield logger_service_1.AppLogger.log('SMS service - sendNewsletterWithListId response - success = ' +
                    newsletterResponse.success);
                if (!response.success) {
                    yield logger_service_1.AppLogger.loggerInstance.error('SMS service - Unable to send newsletter', newsletterResponse.error);
                }
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    createNewsletterList(data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new types_1.SendNewsletterResponse();
            try {
                if (!this.canSendSms()) {
                    return new types_1.SendNewsletterResponse(true);
                }
                const newsletterResponse = yield this.getProvider().createNewsletterList(data);
                response.success = newsletterResponse.success;
                response.listId = (_a = newsletterResponse === null || newsletterResponse === void 0 ? void 0 : newsletterResponse.data) === null || _a === void 0 ? void 0 : _a.listId;
                yield logger_service_1.AppLogger.log('sms service - createNewsletterList response - success = ' +
                    newsletterResponse.success);
                if (!response.success) {
                    yield logger_service_1.AppLogger.loggerInstance.error('sms service - Unable to create newsletter list', newsletterResponse.error);
                }
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    getNewsletter(newsletterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponseWithData();
            try {
                const newsletterResponse = yield this.getProvider().getNewsletter(newsletterId);
                response.success = newsletterResponse.success;
                response.data = newsletterResponse.data;
                response.error = newsletterResponse.error;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
};
SmsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SmsService);
exports.SmsService = SmsService;
//# sourceMappingURL=sms.service.js.map