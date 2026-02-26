"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateResumeModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const app_language_entity_1 = require("../../entities/app-language.entity");
const app_type_entity_1 = require("../../entities/app-type.entity");
const app_value_entity_1 = require("../../entities/app-value.entity");
const referential_service_1 = require("../../services/referential.service");
const pdf_service_1 = require("../../services/tools/pdf.service");
const translation_service_1 = require("../../services/translation.service");
const app_common_module_1 = require("../../shared/app-common.module");
const shared_module_1 = require("../../shared/shared-module");
const candidate_entity_1 = require("../candidates/candidate.entity");
const candidates_module_1 = require("../candidates/candidates.module");
const gdrive_module_1 = require("../gdrive/gdrive.module");
const candidate_resume_controller_1 = require("./candidate-resume.controller");
const candidate_resume_service_1 = require("./candidate-resume.service");
let CandidateResumeModule = class CandidateResumeModule {
};
CandidateResumeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([app_value_entity_1.AppValue, app_type_entity_1.AppType, app_language_entity_1.AppLanguage, candidate_entity_1.Candidate]),
            (0, common_1.forwardRef)(() => app_common_module_1.AppCommonModule),
            (0, common_1.forwardRef)(() => candidates_module_1.CandidateModule),
            (0, common_1.forwardRef)(() => shared_module_1.SharedModule),
            (0, common_1.forwardRef)(() => gdrive_module_1.GDriveModule),
        ],
        controllers: [candidate_resume_controller_1.CandidateResumesController],
        providers: [
            candidate_resume_service_1.CandidateResumeService,
            pdf_service_1.PdfService,
            translation_service_1.TranslationService,
            referential_service_1.ReferentialService,
        ],
        exports: [candidate_resume_service_1.CandidateResumeService],
    })
], CandidateResumeModule);
exports.CandidateResumeModule = CandidateResumeModule;
//# sourceMappingURL=candidate-resume.module.js.map