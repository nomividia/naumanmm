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
exports.ApiKeyGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const environment_1 = require("../../environment/environment");
const require_api_key_decorator_1 = require("../decorators/require-api-key.decorator");
let ApiKeyGuard = class ApiKeyGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requireApiKey = this.reflector.get(require_api_key_decorator_1.REQUIRE_API_KEY, context.getHandler());
        if (!requireApiKey) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key'];
        if (!apiKey || apiKey !== environment_1.Environment.ApiKey) {
            throw new common_1.UnauthorizedException('Invalid API key');
        }
        return true;
    }
};
ApiKeyGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], ApiKeyGuard);
exports.ApiKeyGuard = ApiKeyGuard;
//# sourceMappingURL=api-key-guard.js.map