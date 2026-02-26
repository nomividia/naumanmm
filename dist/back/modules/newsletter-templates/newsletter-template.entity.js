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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterTemplate = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../entities/base-entity");
let NewsletterTemplate = class NewsletterTemplate extends base_entity_1.AppBaseEntity {
    toDto() {
        return {
            id: this.id,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            disabled: this.disabled,
            content: this.content,
            title: this.title,
            subject: this.subject,
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.creationDate = dto.creationDate;
        this.modifDate = dto.modifDate;
        this.disabled = dto.disabled;
        this.content = dto.content;
        this.title = dto.title;
        this.subject = dto.subject;
        if (!dto.id) {
            this.id = undefined;
        }
    }
};
__decorate([
    (0, typeorm_1.Column)('mediumtext', { name: 'content', nullable: false }),
    __metadata("design:type", String)
], NewsletterTemplate.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'title', nullable: false, length: 255 }),
    __metadata("design:type", String)
], NewsletterTemplate.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'subject', nullable: true, length: 100 }),
    __metadata("design:type", String)
], NewsletterTemplate.prototype, "subject", void 0);
NewsletterTemplate = __decorate([
    (0, typeorm_1.Entity)({ name: 'newsletter-templates' })
], NewsletterTemplate);
exports.NewsletterTemplate = NewsletterTemplate;
//# sourceMappingURL=newsletter-template.entity.js.map