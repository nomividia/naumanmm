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
exports.CandidatePresentationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const candidate_presentation_entity_1 = require("../../entities/candidate-presentation.entity");
let CandidatePresentationsService = class CandidatePresentationsService {
    constructor(candidatePresentationRepository) {
        this.candidatePresentationRepository = candidatePresentationRepository;
    }
    findAllByCandidateId(candidateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const presentations = yield this.candidatePresentationRepository.find({
                where: { candidateId, disabled: false },
                order: { displayOrder: 'ASC', creationDate: 'ASC' },
            });
            return presentations.map((p) => p.toDto());
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const presentation = yield this.candidatePresentationRepository.findOne({
                where: { id },
            });
            if (!presentation) {
                throw new Error('Candidate presentation not found');
            }
            return presentation.toDto();
        });
    }
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            if (dto.isDefault) {
                yield this.candidatePresentationRepository.update({ candidateId: dto.candidateId, isDefault: true }, { isDefault: false });
            }
            const presentation = new candidate_presentation_entity_1.CandidatePresentation();
            presentation.fromDto(dto);
            const saved = yield this.candidatePresentationRepository.save(presentation);
            return saved.toDto();
        });
    }
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield this.candidatePresentationRepository.findOne({
                where: { id },
            });
            if (!existing) {
                throw new Error('Candidate presentation not found');
            }
            if (dto.isDefault && !existing.isDefault) {
                yield this.candidatePresentationRepository.update({ candidateId: dto.candidateId, isDefault: true }, { isDefault: false });
            }
            existing.fromDto(dto);
            const saved = yield this.candidatePresentationRepository.save(existing);
            return saved.toDto();
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const presentation = yield this.candidatePresentationRepository.findOne({
                where: { id },
            });
            if (!presentation) {
                throw new Error('Candidate presentation not found');
            }
            presentation.disabled = true;
            yield this.candidatePresentationRepository.save(presentation);
        });
    }
    setAsDefault(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const presentation = yield this.candidatePresentationRepository.findOne({
                where: { id },
            });
            if (!presentation) {
                throw new Error('Candidate presentation not found');
            }
            yield this.candidatePresentationRepository.update({ candidateId: presentation.candidateId, isDefault: true }, { isDefault: false });
            presentation.isDefault = true;
            const saved = yield this.candidatePresentationRepository.save(presentation);
            return saved.toDto();
        });
    }
    getDefaultPresentation(candidateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const presentation = yield this.candidatePresentationRepository.findOne({
                where: { candidateId, isDefault: true, disabled: false },
            });
            return presentation ? presentation.toDto() : null;
        });
    }
};
CandidatePresentationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(candidate_presentation_entity_1.CandidatePresentation)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CandidatePresentationsService);
exports.CandidatePresentationsService = CandidatePresentationsService;
//# sourceMappingURL=candidate-presentations.service.js.map