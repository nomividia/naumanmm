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
exports.GetConnectedConsultantsResponse = exports.GetUserStatsResponse = exports.GetHasUserAcceptedTOSResponse = exports.GetUsersResponse = exports.GetUserResponse = exports.UserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const candidate_dto_1 = require("../../modules/candidates/candidate-dto");
const base_search_responses_1 = require("../responses/base-search-responses");
const generic_response_1 = require("../responses/generic-response");
const app_file_dto_1 = require("./app-file-dto");
const app_value_dto_1 = require("./app-value-dto");
const base_dto_1 = require("./base.dto");
const language_dto_1 = require("./language-dto");
const translation_dto_1 = require("./translation-dto");
const user_role_dto_1 = require("./user-role-dto");
class UserDto extends base_dto_1.BaseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserDto.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], UserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => user_role_dto_1.UserRoleDto, isArray: true }),
    __metadata("design:type", Array)
], UserDto.prototype, "roles", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Array)
], UserDto.prototype, "rolesString", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], UserDto.prototype, "mail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], UserDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], UserDto.prototype, "phoneFix", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Array)
], UserDto.prototype, "pushSubscriptions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], UserDto.prototype, "languageId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", language_dto_1.LanguageDto)
], UserDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], UserDto.prototype, "presentation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => translation_dto_1.TranslationDto, isArray: true }),
    __metadata("design:type", Array)
], UserDto.prototype, "translations", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], UserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], UserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], UserDto.prototype, "facebookUserId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], UserDto.prototype, "googleUserId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => app_file_dto_1.AppFileDto }),
    __metadata("design:type", app_file_dto_1.AppFileDto)
], UserDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], UserDto.prototype, "imageId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], UserDto.prototype, "recoverToken", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], UserDto.prototype, "recoverTokenExpirationDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], UserDto.prototype, "refreshToken", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => candidate_dto_1.CandidateDto }),
    __metadata("design:type", candidate_dto_1.CandidateDto)
], UserDto.prototype, "candidate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], UserDto.prototype, "candidateId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], UserDto.prototype, "genderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => app_value_dto_1.AppValueDto }),
    __metadata("design:type", app_value_dto_1.AppValueDto)
], UserDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], UserDto.prototype, "TOSAccepted", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], UserDto.prototype, "loginToken", void 0);
exports.UserDto = UserDto;
class GetUserResponse extends generic_response_1.GenericResponse {
    constructor() {
        super(...arguments);
        this.user = null;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", UserDto)
], GetUserResponse.prototype, "user", void 0);
exports.GetUserResponse = GetUserResponse;
class GetUsersResponse extends base_search_responses_1.BaseSearchResponse {
    constructor() {
        super(...arguments);
        this.users = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => UserDto, isArray: true }),
    __metadata("design:type", Array)
], GetUsersResponse.prototype, "users", void 0);
exports.GetUsersResponse = GetUsersResponse;
class GetHasUserAcceptedTOSResponse extends generic_response_1.GenericResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GetHasUserAcceptedTOSResponse.prototype, "hasAcceptedTOS", void 0);
exports.GetHasUserAcceptedTOSResponse = GetHasUserAcceptedTOSResponse;
class GetUserStatsResponse extends generic_response_1.GenericResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetUserStatsResponse.prototype, "jobOfferLinked", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetUserStatsResponse.prototype, "candidatePlaced", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetUserStatsResponse.prototype, "candidateLinked", void 0);
exports.GetUserStatsResponse = GetUserStatsResponse;
class GetConnectedConsultantsResponse extends generic_response_1.GenericResponse {
    constructor() {
        super(...arguments);
        this.connectedConsultants = 0;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetConnectedConsultantsResponse.prototype, "connectedConsultants", void 0);
exports.GetConnectedConsultantsResponse = GetConnectedConsultantsResponse;
//# sourceMappingURL=user-dto.js.map