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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpiredTokenExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const shared_constants_1 = require("../../../shared/shared-constants");
const expired_token_exception_1 = require("./expired-token-exception");
let ExpiredTokenExceptionFilter = class ExpiredTokenExceptionFilter {
    constructor() { }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        response.status(403);
        response.send({
            success: false,
            message: 'Token expiré',
            statusCode: shared_constants_1.AppResponseCode.ExpiredToken,
        });
    }
};
ExpiredTokenExceptionFilter = __decorate([
    (0, common_1.Catch)(expired_token_exception_1.ExpiredTokenException),
    __metadata("design:paramtypes", [])
], ExpiredTokenExceptionFilter);
exports.ExpiredTokenExceptionFilter = ExpiredTokenExceptionFilter;
//# sourceMappingURL=expired-token-filter.js.map