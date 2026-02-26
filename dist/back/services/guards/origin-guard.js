"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OriginGuard = void 0;
const common_1 = require("@nestjs/common");
const environment_1 = require("../../environment/environment");
let OriginGuard = class OriginGuard {
    constructor() {
        this.allowedOrigins = [
            environment_1.Environment.BaseURL,
            'https://login.morganmallet.agency',
            'https://morganmallet.agency',
        ];
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const origin = request.headers.origin || request.headers.referer;
        if (environment_1.Environment.EnvName === 'development' && !origin) {
            return true;
        }
        if (origin) {
            const isAllowed = this.allowedOrigins.some((allowed) => origin.startsWith(allowed));
            if (isAllowed) {
                return true;
            }
        }
        throw new common_1.ForbiddenException('Access denied: Invalid origin');
    }
};
OriginGuard = __decorate([
    (0, common_1.Injectable)()
], OriginGuard);
exports.OriginGuard = OriginGuard;
//# sourceMappingURL=origin-guard.js.map