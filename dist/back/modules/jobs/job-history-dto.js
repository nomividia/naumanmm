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
exports.JobHistoryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const job_dto_1 = require("./job-dto");
class JobHistoryDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobHistoryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => job_dto_1.JobDto }),
    __metadata("design:type", job_dto_1.JobDto)
], JobHistoryDto.prototype, "job", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], JobHistoryDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], JobHistoryDto.prototype, "jobId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], JobHistoryDto.prototype, "result", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], JobHistoryDto.prototype, "duration", void 0);
exports.JobHistoryDto = JobHistoryDto;
//# sourceMappingURL=job-history-dto.js.map