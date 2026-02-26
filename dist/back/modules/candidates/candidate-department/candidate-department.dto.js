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
exports.CandidateDepartmentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_dto_1 = require("../../../models/dto/base.dto");
const candidate_application_dto_1 = require("../../candidates-application/candidate-application-dto");
const candidate_dto_1 = require("../candidate-dto");
class CandidateDepartmentDto extends base_dto_1.BaseDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateDepartmentDto.prototype, "candidateId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => candidate_dto_1.CandidateDto }),
    __metadata("design:type", candidate_dto_1.CandidateDto)
], CandidateDepartmentDto.prototype, "candidate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CandidateDepartmentDto.prototype, "candidateApplicationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => candidate_application_dto_1.CandidateApplicationDto }),
    __metadata("design:type", candidate_application_dto_1.CandidateApplicationDto)
], CandidateDepartmentDto.prototype, "candidateApplication", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateDepartmentDto.prototype, "department", void 0);
exports.CandidateDepartmentDto = CandidateDepartmentDto;
//# sourceMappingURL=candidate-department.dto.js.map