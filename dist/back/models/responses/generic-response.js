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
exports.GetItemsListResponse = exports.GetItemResponse = exports.GenericResponseWithData = exports.GenericResponse = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nextalys_js_helpers_1 = require("nextalys-js-helpers");
const utils_1 = require("../../../shared/utils");
const logger_service_1 = require("../../services/tools/logger.service");
const app_error_1 = require("../app-error");
class GenericResponse {
    constructor(success = false, message = undefined) {
        this.success = success;
        this.message = message;
    }
    handleError(error, preventLogToFile) {
        return __awaiter(this, void 0, void 0, function* () {
            this.originalError = error;
            this.success = false;
            let errorToLog;
            if (error instanceof app_error_1.AppErrorWithMessage) {
                this.message = error.message;
                errorToLog = this.message;
                if (error.technicalMessage) {
                    errorToLog +=
                        '\n - Technical message : ' + error.technicalMessage;
                }
                this.statusCode = error.code;
            }
            else if (error instanceof app_error_1.AppError) {
                if (error.technicalMessage)
                    this.error = error.technicalMessage;
                else
                    this.error = error.message;
                this.statusCode = error.code;
                this.errorGuid = error.guid;
                errorToLog =
                    this.error +
                        '\n---Stack---\n' +
                        error.stack +
                        '\n---End of Stack---';
            }
            else if (error instanceof Error) {
                this.error = error.message;
                errorToLog =
                    this.error +
                        '\n---Stack---\n' +
                        error.stack +
                        '\n---End of Stack---';
            }
            else {
                this.error = error;
                errorToLog = this.error;
            }
            let isForbiddenException = false;
            if (error instanceof common_1.ForbiddenException) {
                isForbiddenException = true;
            }
            const originalUrl = error === null || error === void 0 ? void 0 : error.originalUrl;
            if (originalUrl) {
                errorToLog += '\n - URL : ' + originalUrl;
            }
            if (!this.message) {
                if (!this.errorGuid)
                    this.errorGuid = nextalys_js_helpers_1.MainHelpers.generateGuid();
                this.message = `Une erreur s'est produite. Voici le code d'erreur à transmettre à l'administrateur :${this.errorGuid}.`;
            }
            if (!preventLogToFile) {
                if (this.errorGuid)
                    yield logger_service_1.AppLogger.loggerInstance.errorWithId(errorToLog, this.errorGuid);
                else
                    yield logger_service_1.AppLogger.loggerInstance.error(errorToLog);
            }
        });
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GenericResponse.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], GenericResponse.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], GenericResponse.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], GenericResponse.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], GenericResponse.prototype, "errorGuid", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], GenericResponse.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    utils_1.NonEnumerable,
    __metadata("design:type", Object)
], GenericResponse.prototype, "originalError", void 0);
exports.GenericResponse = GenericResponse;
class GenericResponseWithData extends GenericResponse {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    __metadata("design:type", Object)
], GenericResponseWithData.prototype, "data", void 0);
exports.GenericResponseWithData = GenericResponseWithData;
class GetItemResponse extends GenericResponse {
}
exports.GetItemResponse = GetItemResponse;
class GetItemsListResponse extends GenericResponse {
}
exports.GetItemsListResponse = GetItemsListResponse;
//# sourceMappingURL=generic-response.js.map