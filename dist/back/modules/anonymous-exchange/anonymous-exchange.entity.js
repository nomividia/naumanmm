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
exports.AnonymousExchange = void 0;
const typeorm_1 = require("typeorm");
const shared_constants_1 = require("../../../shared/shared-constants");
const app_file_entity_1 = require("../../entities/app-file.entity");
const base_entity_1 = require("../../entities/base-entity");
const user_entity_1 = require("../../entities/user.entity");
const candidate_application_entity_1 = require("../candidates-application/candidate-application.entity");
let AnonymousExchange = class AnonymousExchange extends base_entity_1.AppBaseEntity {
    toDto() {
        var _a, _b;
        return {
            id: this.id,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            messageContent: this.messageContent,
            seen: this.seen,
            senderType: this.senderType,
            candidateApplicationId: this.candidateApplicationId,
            candidateApplication: (_a = this.candidateApplication) === null || _a === void 0 ? void 0 : _a.toDto(),
            consultantId: this.consultantId,
            consultant: (_b = this.consultant) === null || _b === void 0 ? void 0 : _b.toDto(),
            file: this.file ? this.file.toDto() : undefined,
            fileId: this.fileId,
        };
    }
    fromDto(dto) {
        this.id = dto.id;
        this.messageContent = dto.messageContent;
        this.senderType = dto.senderType;
        this.candidateApplicationId = dto.candidateApplicationId;
        this.consultantId = dto.consultantId;
        this.fileId = dto.fileId;
        if (!this.id) {
            this.id = undefined;
        }
    }
};
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'candidateApplicationId',
        nullable: false,
        length: 36,
    }),
    __metadata("design:type", String)
], AnonymousExchange.prototype, "candidateApplicationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => candidate_application_entity_1.CandidateApplication, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'candidateApplicationId' }),
    __metadata("design:type", candidate_application_entity_1.CandidateApplication)
], AnonymousExchange.prototype, "candidateApplication", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'messageContent', nullable: false }),
    __metadata("design:type", String)
], AnonymousExchange.prototype, "messageContent", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'consultantId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], AnonymousExchange.prototype, "consultantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'consultantId' }),
    __metadata("design:type", user_entity_1.User)
], AnonymousExchange.prototype, "consultant", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'seen', nullable: false, default: 0 }),
    __metadata("design:type", Boolean)
], AnonymousExchange.prototype, "seen", void 0);
__decorate([
    (0, typeorm_1.Column)('enum', {
        name: 'senderType',
        nullable: false,
        enum: shared_constants_1.AnonymousMessageSenderType,
        enumName: 'AnonymousMessageSenderType',
    }),
    __metadata("design:type", String)
], AnonymousExchange.prototype, "senderType", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'fileId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], AnonymousExchange.prototype, "fileId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => app_file_entity_1.AppFile, { cascade: true }),
    (0, typeorm_1.JoinColumn)({ name: 'fileId' }),
    __metadata("design:type", app_file_entity_1.AppFile)
], AnonymousExchange.prototype, "file", void 0);
AnonymousExchange = __decorate([
    (0, typeorm_1.Entity)({ name: 'anonymous-exchanges' })
], AnonymousExchange);
exports.AnonymousExchange = AnonymousExchange;
//# sourceMappingURL=anonymous-exchange.entity.js.map