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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterTemplatesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const base_model_service_1 = require("../../services/base-model.service");
const newsletter_template_dto_1 = require("./newsletter-template.dto");
const newsletter_template_entity_1 = require("./newsletter-template.entity");
let NewsletterTemplatesService = class NewsletterTemplatesService extends base_model_service_1.ApplicationBaseModelService {
    constructor(repository) {
        super();
        this.repository = repository;
        this.modelOptions = {
            getManyResponse: newsletter_template_dto_1.GetNewsletterTemplatesResponse,
            getOneResponse: newsletter_template_dto_1.GetNewsletterTemplateResponse,
            getManyResponseField: 'newsletterTemplates',
            getOneResponseField: 'newsletterTemplate',
            getManyRelations: [],
            getOneRelations: [],
            repository: this.repository,
            entity: newsletter_template_entity_1.NewsletterTemplate,
            archiveField: 'disabled',
            archiveFieldValue: true,
        };
    }
};
NewsletterTemplatesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(newsletter_template_entity_1.NewsletterTemplate)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NewsletterTemplatesService);
exports.NewsletterTemplatesService = NewsletterTemplatesService;
//# sourceMappingURL=newsletter-templates.service.js.map