"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const common_1 = require("@nestjs/common");
const nextalys_js_helpers_1 = require("nextalys-js-helpers");
const generic_response_1 = require("../models/responses/generic-response");
class BaseController {
    parseRequest(obj) {
        nextalys_js_helpers_1.DateHelpers.parseAllDatesRecursive(obj, true);
    }
    parseNumberValues(obj, numberFields) {
        if (!obj)
            return;
        for (const key in obj) {
            if (numberFields.indexOf(key) !== -1 &&
                Object.prototype.hasOwnProperty.call(obj, key)) {
                obj[key] = parseFloat(obj[key]);
            }
        }
    }
    sendResponse(response, statusCode, content, ignoreInterceptor) {
        if (!content)
            content = new generic_response_1.GenericResponse(statusCode >= common_1.HttpStatus.OK &&
                statusCode < common_1.HttpStatus.AMBIGUOUS, '');
        if (ignoreInterceptor) {
            response.header('access-control-expose-headers', 'nxs-ignore-interceptor');
            response.header('nxs-ignore-interceptor', 'true');
        }
        return response.status(statusCode).send(content);
    }
    sendResponseOk(response, content, ignoreInterceptor) {
        return this.sendResponse(response, common_1.HttpStatus.OK, ignoreInterceptor, content);
    }
    sendResponseNotFound(response, message, ignoreInterceptor) {
        if (!message)
            message = 'Not Found';
        return this.sendResponse(response, common_1.HttpStatus.NOT_FOUND, new generic_response_1.GenericResponse(false, message), ignoreInterceptor);
    }
    sendResponseInternalServerError(response, message, ignoreInterceptor) {
        if (!message)
            message = 'Error';
        return this.sendResponse(response, common_1.HttpStatus.INTERNAL_SERVER_ERROR, new generic_response_1.GenericResponse(false, message), ignoreInterceptor);
    }
}
exports.BaseController = BaseController;
//# sourceMappingURL=base.controller.js.map