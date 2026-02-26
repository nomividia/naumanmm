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
exports.GetLanguageResponse = exports.GetLanguagesResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
const language_dto_1 = require("../dto/language-dto");
const generic_response_1 = require("./generic-response");
class GetLanguagesResponse extends generic_response_1.GenericResponse {
    constructor() {
        super(...arguments);
        this.languages = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => language_dto_1.LanguageDto, isArray: true }),
    __metadata("design:type", Array)
], GetLanguagesResponse.prototype, "languages", void 0);
exports.GetLanguagesResponse = GetLanguagesResponse;
class GetLanguageResponse extends generic_response_1.GenericResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", language_dto_1.LanguageDto)
], GetLanguageResponse.prototype, "language", void 0);
exports.GetLanguageResponse = GetLanguageResponse;
//# sourceMappingURL=languages-responses.js.map