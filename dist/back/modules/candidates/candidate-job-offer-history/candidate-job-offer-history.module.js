"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateJobOfferHistoryModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const app_common_module_1 = require("../../../shared/app-common.module");
const candidate_job_offer_history_controller_1 = require("./candidate-job-offer-history.controller");
const candidate_job_offer_history_entity_1 = require("./candidate-job-offer-history.entity");
const candidate_job_offer_history_service_1 = require("./candidate-job-offer-history.service");
let CandidateJobOfferHistoryModule = class CandidateJobOfferHistoryModule {
};
CandidateJobOfferHistoryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => app_common_module_1.AppCommonModule),
            typeorm_1.TypeOrmModule.forFeature([candidate_job_offer_history_entity_1.CandidateJobOfferHistory]),
        ],
        controllers: [candidate_job_offer_history_controller_1.CandidateJobOfferHistoryController],
        providers: [candidate_job_offer_history_service_1.CandidateJobOfferHistoryService],
        exports: [candidate_job_offer_history_service_1.CandidateJobOfferHistoryService],
    })
], CandidateJobOfferHistoryModule);
exports.CandidateJobOfferHistoryModule = CandidateJobOfferHistoryModule;
//# sourceMappingURL=candidate-job-offer-history.module.js.map