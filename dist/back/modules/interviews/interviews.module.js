"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_tools_service_1 = require("../../services/auth-tools.service");
const app_common_module_1 = require("../../shared/app-common.module");
const candidates_module_1 = require("../candidates/candidates.module");
const mail_module_1 = require("../mail/mail.module");
const interview_entity_1 = require("./interview.entity");
const interviews_controller_1 = require("./interviews.controller");
const interviews_service_1 = require("./interviews.service");
let InterviewsModule = class InterviewsModule {
};
InterviewsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            app_common_module_1.AppCommonModule,
            typeorm_1.TypeOrmModule.forFeature([interview_entity_1.Interview]),
            mail_module_1.MailModule,
            candidates_module_1.CandidateModule,
        ],
        controllers: [interviews_controller_1.InterviewsController],
        providers: [interviews_service_1.InterviewsService, auth_tools_service_1.AuthToolsService],
        exports: [interviews_service_1.InterviewsService],
    })
], InterviewsModule);
exports.InterviewsModule = InterviewsModule;
//# sourceMappingURL=interviews.module.js.map