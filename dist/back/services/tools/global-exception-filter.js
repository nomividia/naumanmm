"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const generic_response_1 = require("../../models/responses/generic-response");
let GlobalExceptionFilter = class GlobalExceptionFilter extends core_1.BaseExceptionFilter {
    catch(exception, host) {
        var _a;
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const jsonResponse = new generic_response_1.GenericResponse();
        if (!(exception instanceof common_1.NotFoundException)) {
            exception.originalUrl =
                (_a = ctx.getRequest()) === null || _a === void 0 ? void 0 : _a.url;
            jsonResponse.handleError(exception);
            response.send(jsonResponse);
        }
        else {
            const request = ctx.getRequest();
            const status = (exception === null || exception === void 0 ? void 0 : exception.getStatus) ? exception.getStatus() : 0;
            response.status(status).send({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
            });
        }
    }
};
GlobalExceptionFilter = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
exports.GlobalExceptionFilter = GlobalExceptionFilter;
//# sourceMappingURL=global-exception-filter.js.map