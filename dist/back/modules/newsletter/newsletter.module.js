"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const app_common_module_1 = require("../../shared/app-common.module");
const candidate_applications_module_1 = require("../candidates-application/candidate-applications.module");
const candidates_module_1 = require("../candidates/candidates.module");
const mail_module_1 = require("../mail/mail.module");
const sms_module_1 = require("../sms/sms.module");
const newsletter_controller_1 = require("./newsletter.controller");
const newsletter_entity_1 = require("./newsletter.entity");
const newsletter_service_1 = require("./newsletter.service");
let NewsletterModule = class NewsletterModule {
};
NewsletterModule = __decorate([
    (0, common_1.Module)({
        imports: [
            app_common_module_1.AppCommonModule,
            typeorm_1.TypeOrmModule.forFeature([newsletter_entity_1.Newsletter]),
            candidates_module_1.CandidateModule,
            mail_module_1.MailModule,
            sms_module_1.SmsModule,
            candidate_applications_module_1.CandidatApplicationModule,
        ],
        controllers: [newsletter_controller_1.NewsletterController],
        providers: [newsletter_service_1.NewsletterService],
        exports: [newsletter_service_1.NewsletterService],
    })
], NewsletterModule);
exports.NewsletterModule = NewsletterModule;
//# sourceMappingURL=newsletter.module.js.map