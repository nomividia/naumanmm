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
exports.GetMailConfigResponse = exports.SendTestEmailRequest = void 0;
const swagger_1 = require("@nestjs/swagger");
const generic_response_1 = require("../../models/responses/generic-response");
class SendTestEmailRequest {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SendTestEmailRequest.prototype, "recipients", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SendTestEmailRequest.prototype, "from", void 0);
exports.SendTestEmailRequest = SendTestEmailRequest;
class GetMailConfigResponse extends generic_response_1.GenericResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetMailConfigResponse.prototype, "mailProvider", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetMailConfigResponse.prototype, "host", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetMailConfigResponse.prototype, "port", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetMailConfigResponse.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetMailConfigResponse.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GetMailConfigResponse.prototype, "secure", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetMailConfigResponse.prototype, "mailSender", void 0);
exports.GetMailConfigResponse = GetMailConfigResponse;
//# sourceMappingURL=mail.dto.js.map