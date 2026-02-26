"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const note_item_file_entity_1 = require("../../entities/note-item-file.entity");
const note_item_entity_1 = require("../../entities/note-item.entity");
const auth_tools_service_1 = require("../../services/auth-tools.service");
const app_common_module_1 = require("../../shared/app-common.module");
const shared_module_1 = require("../../shared/shared-module");
const candidate_resume_module_1 = require("../candidate-resume/candidate-resume.module");
const file_module_1 = require("../file/file.module");
const gdrive_module_1 = require("../gdrive/gdrive.module");
const histories_service_1 = require("../history/histories.service");
const history_entity_1 = require("../history/history.entity");
const mail_module_1 = require("../mail/mail.module");
const notifications_module_1 = require("../notifications/notifications.module");
const users_module_1 = require("../users/users.module");
const candidate_children_entity_1 = require("./candidate-children/candidate-children.entity");
const candidate_contract_entity_1 = require("./candidate-contract.entity");
const candidate_country_entity_1 = require("./candidate-country/candidate-country.entity");
const candidate_current_jobs_entity_1 = require("./candidate-current-jobs/candidate-current-jobs.entity");
const candidate_department_entity_1 = require("./candidate-department/candidate-department.entity");
const candidate_file_entity_1 = require("./candidate-file.entity");
const candidate_job_offer_history_module_1 = require("./candidate-job-offer-history/candidate-job-offer-history.module");
const candidate_jobs_entity_1 = require("./candidate-jobs.entity");
const candidate_language_entity_1 = require("./candidate-language/candidate-language.entity");
const candidate_licences_entity_1 = require("./candidate-licences/candidate-licences.entity");
const candidate_pet_entity_1 = require("./candidate-pets/candidate-pet.entity");
const candidate_readonly_property_entity_1 = require("./candidate-readonly/candidate-readonly-property.entity");
const candidate_entity_1 = require("./candidate.entity");
const candidates_controller_1 = require("./candidates.controller");
const candidates_service_1 = require("./candidates.service");
let CandidateModule = class CandidateModule {
};
CandidateModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => app_common_module_1.AppCommonModule),
            typeorm_1.TypeOrmModule.forFeature([
                candidate_entity_1.Candidate,
                note_item_entity_1.NoteItem,
                note_item_file_entity_1.NoteItemFile,
                candidate_jobs_entity_1.CandidateJob,
                candidate_language_entity_1.CandidateLanguage,
                candidate_children_entity_1.CandidateChildren,
                candidate_licences_entity_1.CandidateLicence,
                candidate_file_entity_1.CandidateFile,
                candidate_readonly_property_entity_1.CandidateReadonlyProperty,
                candidate_pet_entity_1.CandidatePet,
                candidate_contract_entity_1.CandidateContract,
                candidate_country_entity_1.CandidateCountry,
                history_entity_1.History,
                candidate_current_jobs_entity_1.CandidateCurrentJob,
                candidate_department_entity_1.CandidateDepartment,
            ]),
            (0, common_1.forwardRef)(() => file_module_1.FileModule),
            (0, common_1.forwardRef)(() => gdrive_module_1.GDriveModule),
            (0, common_1.forwardRef)(() => mail_module_1.MailModule),
            (0, common_1.forwardRef)(() => shared_module_1.SharedModule),
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
            (0, common_1.forwardRef)(() => notifications_module_1.NotificationsModule),
            (0, common_1.forwardRef)(() => candidate_resume_module_1.CandidateResumeModule),
            (0, common_1.forwardRef)(() => candidate_job_offer_history_module_1.CandidateJobOfferHistoryModule),
        ],
        controllers: [candidates_controller_1.CandidatesController],
        providers: [candidates_service_1.CandidateService, histories_service_1.HistoriesService, auth_tools_service_1.AuthToolsService],
        exports: [candidates_service_1.CandidateService],
    })
], CandidateModule);
exports.CandidateModule = CandidateModule;
//# sourceMappingURL=candidates.module.js.map