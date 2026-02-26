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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateJobOfferHistoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const base_model_service_1 = require("../../../services/base-model.service");
const candidate_job_offer_history_entity_1 = require("./candidate-job-offer-history.entity");
let CandidateJobOfferHistoryService = class CandidateJobOfferHistoryService extends base_model_service_1.ApplicationBaseModelService {
    constructor(repository) {
        super();
        this.repository = repository;
    }
    createHistoryEntry(candidateId, jobOfferId, action, candidateFirstName, candidateLastName, startDate, contractFileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const historyEntry = new candidate_job_offer_history_entity_1.CandidateJobOfferHistory();
            historyEntry.candidateId = candidateId;
            historyEntry.jobOfferId = jobOfferId;
            historyEntry.action = action;
            historyEntry.candidateFirstName = candidateFirstName;
            historyEntry.candidateLastName = candidateLastName;
            historyEntry.actionDate = new Date();
            historyEntry.startDate = startDate;
            historyEntry.contractFileId = contractFileId;
            const savedEntry = yield this.repository.save(historyEntry);
            return savedEntry.toDto();
        });
    }
    getJobOfferHistory(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryBuilder = this.repository
                    .createQueryBuilder('history')
                    .leftJoinAndSelect('history.candidate', 'candidate')
                    .leftJoinAndSelect('history.jobOffer', 'jobOffer')
                    .leftJoinAndSelect('jobOffer.customer', 'customer')
                    .leftJoinAndSelect('history.contractFile', 'contractFile')
                    .leftJoinAndSelect('contractFile.file', 'contractFileAppFile');
                if (request.jobOfferId) {
                    queryBuilder.where('history.jobOfferId = :jobOfferId', {
                        jobOfferId: request.jobOfferId,
                    });
                }
                if (request.candidateId) {
                    queryBuilder.andWhere('history.candidateId = :candidateId', {
                        candidateId: request.candidateId,
                    });
                }
                queryBuilder.orderBy('history.actionDate', 'DESC');
                if (request.start !== undefined && request.length !== undefined) {
                    queryBuilder.skip(request.start).take(request.length);
                }
                const [history, totalCount] = yield queryBuilder.getManyAndCount();
                return {
                    success: true,
                    history: history.map((entry) => entry.toDto()),
                    totalCount,
                };
            }
            catch (error) {
                return {
                    success: false,
                    message: error.message,
                };
            }
        });
    }
    getCandidateHistory(candidateId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getJobOfferHistory({ candidateId });
        });
    }
};
CandidateJobOfferHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(candidate_job_offer_history_entity_1.CandidateJobOfferHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CandidateJobOfferHistoryService);
exports.CandidateJobOfferHistoryService = CandidateJobOfferHistoryService;
//# sourceMappingURL=candidate-job-offer-history.service.js.map