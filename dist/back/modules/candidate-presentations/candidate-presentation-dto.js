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
exports.CandidatePresentationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_dto_1 = require("../../models/dto/base.dto");
class CandidatePresentationDto extends base_dto_1.BaseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ required: true }),
    __metadata("design:type", String)
], CandidatePresentationDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], CandidatePresentationDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true }),
    __metadata("design:type", String)
], CandidatePresentationDto.prototype, "candidateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Boolean)
], CandidatePresentationDto.prototype, "isDefault", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], CandidatePresentationDto.prototype, "displayOrder", void 0);
exports.CandidatePresentationDto = CandidatePresentationDto;
//# sourceMappingURL=candidate-presentation-dto.js.map