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
exports.GetJobResponse = exports.GetJobsResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_search_responses_1 = require("../../models/responses/base-search-responses");
const generic_response_1 = require("../../models/responses/generic-response");
const job_dto_1 = require("./job-dto");
class GetJobsResponse extends base_search_responses_1.BaseSearchResponse {
    constructor() {
        super();
        this.jobs = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => job_dto_1.JobDto, isArray: true }),
    __metadata("design:type", Array)
], GetJobsResponse.prototype, "jobs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GetJobsResponse.prototype, "isOnMainWorker", void 0);
exports.GetJobsResponse = GetJobsResponse;
class GetJobResponse extends generic_response_1.GenericResponse {
    constructor() {
        super();
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => job_dto_1.JobDto }),
    __metadata("design:type", job_dto_1.JobDto)
], GetJobResponse.prototype, "job", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GetJobResponse.prototype, "isOnMainWorker", void 0);
exports.GetJobResponse = GetJobResponse;
//# sourceMappingURL=jobs-responses.js.map