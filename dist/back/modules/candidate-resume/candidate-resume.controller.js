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
exports.CandidateResumesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const base_controller_1 = require("../../shared/base.controller");
const candidate_resume_service_1 = require("./candidate-resume.service");
const candidate_resume_dto_1 = require("./candidate-resume-dto");
let CandidateResumesController = class CandidateResumesController extends base_controller_1.BaseController {
    constructor(candidateResumeService) {
        super();
        this.candidateResumeService = candidateResumeService;
    }
    generateCandidateResume(candidateId, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pdfData = yield this.candidateResumeService.generateCandidateResume(candidateId, body);
            res.header('Content-Type', pdfData.mimeType);
            res.header('Content-Disposition', `inline; filename="${pdfData.fileName}"`);
            res.header('Content-Length', pdfData.buffer.length.toString());
            return res.send(pdfData.buffer);
        });
    }
};
__decorate([
    (0, common_1.Post)('generate/:candidateId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Generate candidate resume',
        operationId: 'generateCandidateResume',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Generate candidate resume as PDF blob',
        content: {
            'application/pdf': {
                schema: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('candidateId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, candidate_resume_dto_1.GenerateCandidateResumeDto, Object]),
    __metadata("design:returntype", Promise)
], CandidateResumesController.prototype, "generateCandidateResume", null);
CandidateResumesController = __decorate([
    (0, common_1.Controller)('candidate-resumes'),
    (0, swagger_1.ApiTags)('candidate-resumes'),
    __metadata("design:paramtypes", [candidate_resume_service_1.CandidateResumeService])
], CandidateResumesController);
exports.CandidateResumesController = CandidateResumesController;
//# sourceMappingURL=candidate-resume.controller.js.map