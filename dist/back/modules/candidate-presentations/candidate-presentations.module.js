"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidatePresentationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const candidate_presentation_entity_1 = require("../../entities/candidate-presentation.entity");
const app_common_module_1 = require("../../shared/app-common.module");
const candidate_presentations_controller_1 = require("./candidate-presentations.controller");
const candidate_presentations_service_1 = require("./candidate-presentations.service");
let CandidatePresentationsModule = class CandidatePresentationsModule {
};
CandidatePresentationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => app_common_module_1.AppCommonModule),
            typeorm_1.TypeOrmModule.forFeature([candidate_presentation_entity_1.CandidatePresentation]),
        ],
        controllers: [candidate_presentations_controller_1.CandidatePresentationsController],
        providers: [candidate_presentations_service_1.CandidatePresentationsService],
        exports: [candidate_presentations_service_1.CandidatePresentationsService],
    })
], CandidatePresentationsModule);
exports.CandidatePresentationsModule = CandidatePresentationsModule;
//# sourceMappingURL=candidate-presentations.module.js.map