"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceInterceptor = void 0;
const common_1 = require("@nestjs/common");
let MaintenanceInterceptor = class MaintenanceInterceptor {
    intercept(context, next) {
        var _a, _b;
        const url = (_b = (_a = context === null || context === void 0 ? void 0 : context.switchToHttp()) === null || _a === void 0 ? void 0 : _a.getRequest()) === null || _b === void 0 ? void 0 : _b.url;
        if (url && url.startsWith('/api')) {
            return context
                .switchToHttp()
                .getResponse()
                .status(582)
                .send({
                success: false,
                message: 'Maintenance Mode',
                statusCode: 582,
            });
        }
        return next.handle();
    }
};
MaintenanceInterceptor = __decorate([
    (0, common_1.Injectable)()
], MaintenanceInterceptor);
exports.MaintenanceInterceptor = MaintenanceInterceptor;
//# sourceMappingURL=maintenance-interceptor.js.map