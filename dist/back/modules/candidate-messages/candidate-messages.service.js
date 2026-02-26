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
exports.CandidateMessagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const shared_constants_1 = require("../../../shared/shared-constants");
const app_error_1 = require("../../models/app-error");
const generic_response_1 = require("../../models/responses/generic-response");
const base_model_service_1 = require("../../services/base-model.service");
const candidate_dto_1 = require("../candidates/candidate-dto");
const candidates_service_1 = require("../candidates/candidates.service");
const candidate_message_dto_1 = require("./candidate-message-dto");
const candidate_message_entity_1 = require("./candidate-message.entity");
let CandidateMessagesService = class CandidateMessagesService extends base_model_service_1.ApplicationBaseModelService {
    constructor(repository, candidateService) {
        super();
        this.repository = repository;
        this.candidateService = candidateService;
        this.modelOptions = {
            getManyResponse: candidate_message_dto_1.GetCandidateMessagesResponse,
            getOneResponse: candidate_message_dto_1.GetCandidateMessageResponse,
            getManyResponseField: 'candidateMessages',
            getOneResponseField: 'candidateMessage',
            getManyRelations: ['sender'],
            getOneRelations: ['sender', 'candidate'],
            repository: this.repository,
            entity: candidate_message_entity_1.CandidateMessage,
            archiveField: 'archived',
            archiveFieldValue: true,
        };
    }
    createOrUpdate(dto, ...toDtoParameters) {
        const _super = Object.create(null, {
            createOrUpdate: { get: () => super.createOrUpdate }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield _super.createOrUpdate.call(this, dto, toDtoParameters);
            try {
                const candidate = yield this.candidateService.repository.findOne({
                    where: { id: dto.candidateId },
                });
                if (!candidate) {
                    throw new app_error_1.AppErrorWithMessage('Error candidate');
                }
                candidate.lastCandidateMessageSendedDate =
                    response.candidateMessage.creationDate;
                yield this.candidateService.repository.save(candidate);
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    getCandidateForMessaging(consultantSenderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new candidate_dto_1.GetCandidatesForMessageResponse();
            try {
                const getCandidateResponse = yield this.candidateService.findAll({
                    where: { lastCandidateMessageSendedDate: (0, typeorm_2.Not)((0, typeorm_2.IsNull)()) },
                    order: { lastCandidateMessageSendedDate: 'DESC' },
                }, false, [
                    'files',
                    'files.file',
                    'files.fileType',
                    'candidateCurrentJobs',
                    'candidateCurrentJobs.currentJob',
                    'candidateCurrentJobs.currentJob.translations',
                ]);
                const unseenCandidateMessages = yield this.repository.find({
                    where: { seen: false },
                });
                const consultantMessagesList = yield this.repository.find({
                    where: { senderId: consultantSenderId },
                });
                const messagesWithConsultant = yield this.repository.find({
                    where: { senderType: 'consultant' },
                });
                if (unseenCandidateMessages) {
                    for (const candidate of getCandidateResponse.candidates) {
                        candidate.candidateMessagesUnseen =
                            unseenCandidateMessages.some((x) => x.candidateId === candidate.id &&
                                x.senderType ===
                                    shared_constants_1.CandidateMessageSenderType.Candidate);
                    }
                }
                response.candidates = getCandidateResponse.candidates.filter((x) => consultantMessagesList.find((y) => y.candidateId === x.id) ||
                    !messagesWithConsultant.find((y) => y.candidateId === x.id));
                response.unseenCandidateMessages = unseenCandidateMessages.filter((x) => x.senderType === shared_constants_1.CandidateMessageSenderType.Candidate).length;
                response.success = true;
            }
            catch (err) {
                throw new app_error_1.AppErrorWithMessage(err);
            }
            return response;
        });
    }
    archiveOrRemoveAllCandidateMessage(candidateId, remove) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                const candidateResponse = yield this.candidateService.findOne({
                    where: { id: candidateId },
                });
                const getCandidateAllMessages = yield this.findAll({
                    where: { candidateId: candidateId },
                });
                const messageIds = getCandidateAllMessages.candidateMessages.map((x) => x.id);
                if (remove) {
                    this.delete(messageIds);
                }
                else {
                    yield this.archive(messageIds);
                }
                candidateResponse.candidate.lastCandidateMessageSendedDate = null;
                yield this.candidateService.createOrUpdateWithoutRelations(candidateResponse.candidate);
                response.success = true;
            }
            catch (err) {
                throw new app_error_1.AppErrorWithMessage(err);
            }
            return response;
        });
    }
};
CandidateMessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(candidate_message_entity_1.CandidateMessage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        candidates_service_1.CandidateService])
], CandidateMessagesService);
exports.CandidateMessagesService = CandidateMessagesService;
//# sourceMappingURL=candidate-messages.service.js.map