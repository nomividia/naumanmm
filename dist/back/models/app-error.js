"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppErrorWithMessage = exports.AppError = void 0;
const nextalys_js_helpers_1 = require("nextalys-js-helpers");
class AppError extends Error {
    constructor(technicalMessage, code) {
        super(technicalMessage);
        this.technicalMessage = technicalMessage;
        this.code = code;
        this.guid = nextalys_js_helpers_1.MainHelpers.generateGuid();
    }
    static getBadRequestError(message) {
        return new AppError('Bad Request' + (!!message ? ' - ' + message : ''), 400);
    }
    static getForbiddenError(message) {
        return new AppError('Forbidden' + (!!message ? ' - ' + message : ''), 403);
    }
}
exports.AppError = AppError;
class AppErrorWithMessage extends AppError {
    constructor(message, code) {
        super(message, code);
        this.message = message;
        this.code = code;
        this.message = message;
    }
}
exports.AppErrorWithMessage = AppErrorWithMessage;
//# sourceMappingURL=app-error.js.map