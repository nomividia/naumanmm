"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterTemplatesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const app_common_module_1 = require("../../shared/app-common.module");
const newsletter_template_entity_1 = require("./newsletter-template.entity");
const newsletter_templates_controller_1 = require("./newsletter-templates.controller");
const newsletter_templates_service_1 = require("./newsletter-templates.service");
let NewsletterTemplatesModule = class NewsletterTemplatesModule {
};
NewsletterTemplatesModule = __decorate([
    (0, common_1.Module)({
        imports: [app_common_module_1.AppCommonModule, typeorm_1.TypeOrmModule.forFeature([newsletter_template_entity_1.NewsletterTemplate])],
        controllers: [newsletter_templates_controller_1.NewsletterTemplatesController],
        providers: [newsletter_templates_service_1.NewsletterTemplatesService],
        exports: [newsletter_templates_service_1.NewsletterTemplatesService],
    })
], NewsletterTemplatesModule);
exports.NewsletterTemplatesModule = NewsletterTemplatesModule;
//# sourceMappingURL=newsletter-templates.module.js.map