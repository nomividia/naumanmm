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
exports.GetCandidateJobOfferHistoryRequest = exports.CreateCandidateJobOfferHistoryRequest = exports.CandidateJobOfferHistoryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const job_offer_dto_1 = require("../../job-offers/job-offer-dto");
const candidate_dto_1 = require("../candidate-dto");
const candidate_file_dto_1 = require("../candidate-file-dto");
const candidate_job_offer_history_entity_1 = require("./candidate-job-offer-history.entity");
class CandidateJobOfferHistoryDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateJobOfferHistoryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateJobOfferHistoryDto.prototype, "candidateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", candidate_dto_1.CandidateDto)
], CandidateJobOfferHistoryDto.prototype, "candidate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateJobOfferHistoryDto.prototype, "jobOfferId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", job_offer_dto_1.JobOfferDto)
], CandidateJobOfferHistoryDto.prototype, "jobOffer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: candidate_job_offer_history_entity_1.CandidateJobOfferAction }),
    __metadata("design:type", String)
], CandidateJobOfferHistoryDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateJobOfferHistoryDto.prototype, "candidateFirstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CandidateJobOfferHistoryDto.prototype, "candidateLastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CandidateJobOfferHistoryDto.prototype, "actionDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Date)
], CandidateJobOfferHistoryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], CandidateJobOfferHistoryDto.prototype, "contractFileId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", candidate_file_dto_1.CandidateFileDto)
], CandidateJobOfferHistoryDto.prototype, "contractFile", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CandidateJobOfferHistoryDto.prototype, "creationDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CandidateJobOfferHistoryDto.prototype, "modifDate", void 0);
exports.CandidateJobOfferHistoryDto = CandidateJobOfferHistoryDto;
class CreateCandidateJobOfferHistoryRequest {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateCandidateJobOfferHistoryRequest.prototype, "candidateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateCandidateJobOfferHistoryRequest.prototype, "jobOfferId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: candidate_job_offer_history_entity_1.CandidateJobOfferAction }),
    __metadata("design:type", String)
], CreateCandidateJobOfferHistoryRequest.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateCandidateJobOfferHistoryRequest.prototype, "candidateFirstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateCandidateJobOfferHistoryRequest.prototype, "candidateLastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Date)
], CreateCandidateJobOfferHistoryRequest.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], CreateCandidateJobOfferHistoryRequest.prototype, "contractFileId", void 0);
exports.CreateCandidateJobOfferHistoryRequest = CreateCandidateJobOfferHistoryRequest;
class GetCandidateJobOfferHistoryRequest {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], GetCandidateJobOfferHistoryRequest.prototype, "jobOfferId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], GetCandidateJobOfferHistoryRequest.prototype, "candidateId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], GetCandidateJobOfferHistoryRequest.prototype, "start", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], GetCandidateJobOfferHistoryRequest.prototype, "length", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], GetCandidateJobOfferHistoryRequest.prototype, "orderby", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], GetCandidateJobOfferHistoryRequest.prototype, "order", void 0);
exports.GetCandidateJobOfferHistoryRequest = GetCandidateJobOfferHistoryRequest;
//# sourceMappingURL=candidate-job-offer-history-dto.js.map