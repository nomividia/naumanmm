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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobReferencesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const base_model_service_1 = require("../../services/base-model.service");
const job_reference_dto_1 = require("./job-reference-dto");
const job_reference_entity_1 = require("./job-reference.entity");
let JobReferencesService = class JobReferencesService extends base_model_service_1.ApplicationBaseModelService {
    constructor(repository) {
        super();
        this.repository = repository;
        this.modelOptions = {
            getManyResponse: job_reference_dto_1.GetJobReferencesResponse,
            getOneResponse: job_reference_dto_1.GetJobReferenceResponse,
            getManyResponseField: 'jobReferences',
            getOneResponseField: 'jobReference',
            getManyRelations: ['jobRefFunction', 'addresses'],
            getOneRelations: ['jobRefFunction', 'addresses'],
            repository: this.repository,
            entity: job_reference_entity_1.JobReference,
            archiveField: 'disabled',
            archiveFieldValue: true,
        };
    }
};
JobReferencesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_reference_entity_1.JobReference)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], JobReferencesService);
exports.JobReferencesService = JobReferencesService;
//# sourceMappingURL=job-references.service.js.map