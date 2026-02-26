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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const candidate_entity_1 = require("../modules/candidates/candidate.entity");
const app_file_entity_1 = require("./app-file.entity");
const app_language_entity_1 = require("./app-language.entity");
const app_value_entity_1 = require("./app-value.entity");
const base_entity_1 = require("./base-entity");
const notification_entity_1 = require("./notification.entity");
const push_subscription_entity_1 = require("./push-subscription.entity");
const translation_entity_1 = require("./translation.entity");
const user_role_entity_1 = require("./user-role.entity");
let User = class User extends base_entity_1.AppBaseEntity {
    toDto(getPassword = false) {
        var _a, _b;
        return {
            id: this.id,
            userName: this.userName,
            mail: this.mail,
            disabled: this.disabled,
            presentation: this.presentation,
            password: getPassword ? this.password : undefined,
            pushSubscriptions: this.pushSubscriptions
                ? this.pushSubscriptions.map((x) => x.toDto())
                : [],
            roles: this.roles ? this.roles.map((x) => x.toDto()) : undefined,
            languageId: this.languageId,
            language: this.language ? this.language.toDto() : null,
            translations: this.translations
                ? this.translations.map((x) => x.toDto())
                : [],
            firstName: this.firstName,
            lastName: this.lastName,
            googleUserId: this.googleUserId,
            facebookUserId: this.facebookUserId,
            image: this.image ? this.image.toDto() : undefined,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            recoverToken: this.recoverToken,
            recoverTokenExpirationDate: this.recoverTokenExpirationDate,
            phone: this.phone,
            refreshToken: this.refreshToken,
            candidateId: this.candidateId,
            candidate: this.candidate ? this.candidate.toDto() : null,
            genderId: this.genderId,
            gender: (_b = (_a = this.gender) === null || _a === void 0 ? void 0 : _a.toDto()) !== null && _b !== void 0 ? _b : null,
            imageId: this.imageId,
            TOSAccepted: this.TOSAccepted,
            loginToken: this.loginToken,
        };
    }
    fromDto(dto) {
        this.userName = dto.userName;
        this.mail = dto.mail;
        this.id = dto.id;
        this.languageId = dto.languageId;
        this.presentation = dto.presentation;
        this.presentation = dto.presentation;
        this.firstName = dto.firstName;
        this.lastName = dto.lastName;
        this.googleUserId = dto.googleUserId;
        this.facebookUserId = dto.facebookUserId;
        this.imageId = dto.imageId;
        this.disabled = dto.disabled;
        this.recoverToken = dto.recoverToken;
        this.recoverTokenExpirationDate = dto.recoverTokenExpirationDate;
        this.phone = dto.phone;
        this.refreshToken = dto.refreshToken;
        this.candidateId = dto.candidateId;
        this.genderId = dto.genderId;
        this.TOSAccepted = dto.TOSAccepted;
        this.loginToken = dto.loginToken;
        if (dto.image) {
            const imageEntity = new app_file_entity_1.AppFile();
            imageEntity.fromDto(dto.image);
            this.image = imageEntity;
            this.imageId = this.image.id;
        }
        if (dto.roles) {
            this.roles = dto.roles.map((xDto) => {
                const userRole = new user_role_entity_1.UserRole();
                userRole.fromDto(xDto);
                return userRole;
            });
        }
        if (dto.translations) {
            this.translations = [];
            dto.translations.forEach((translationDto) => {
                const translation = new translation_entity_1.Translation();
                translation.fromDto(translationDto);
                this.translations.push(translation);
            });
        }
        if (!this.id)
            this.id = undefined;
    }
};
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'username', length: 60, unique: true }),
    __metadata("design:type", String)
], User.prototype, "userName", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'firstName', length: 250, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'lastName', length: 250, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'facebookUserId', length: 100, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "facebookUserId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'googleUserId', length: 100, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "googleUserId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'password', length: 70, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'mail',
        length: 255,
        nullable: true,
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "mail", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'phone', length: 50, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'phoneFix', length: 50, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phoneFix", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_role_entity_1.UserRole, (userRole) => userRole.users, {
        cascade: true,
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => push_subscription_entity_1.AppPushSubscription, (pushSubscription) => pushSubscription.user, { cascade: true, onUpdate: 'CASCADE' }),
    __metadata("design:type", Array)
], User.prototype, "pushSubscriptions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notification_entity_1.AppNotification, (appNotification) => appNotification.user, { cascade: true, onUpdate: 'CASCADE' }),
    __metadata("design:type", Array)
], User.prototype, "appNotifications", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_language_entity_1.AppLanguage),
    (0, typeorm_1.JoinColumn)({ name: 'languageId' }),
    __metadata("design:type", app_language_entity_1.AppLanguage)
], User.prototype, "language", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'languageId', length: 36, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "languageId", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'presentation', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "presentation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => translation_entity_1.Translation, (translation) => translation.user, {
        cascade: true,
        onUpdate: 'CASCADE',
    }),
    __metadata("design:type", Array)
], User.prototype, "translations", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_file_entity_1.AppFile, { onDelete: 'SET NULL', cascade: true }),
    (0, typeorm_1.JoinColumn)({ name: 'imageId' }),
    __metadata("design:type", app_file_entity_1.AppFile)
], User.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'imageId', length: 36, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "imageId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { name: 'recoverToken', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "recoverToken", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { name: 'recoverTokenExpirationDate', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "recoverTokenExpirationDate", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'refreshToken', length: 36, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "refreshToken", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => candidate_entity_1.Candidate, (candidate) => candidate.associatedUser, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'candidateId' }),
    __metadata("design:type", candidate_entity_1.Candidate)
], User.prototype, "candidate", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'candidateId', length: 36, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "candidateId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'genderId', nullable: true, length: 36 }),
    __metadata("design:type", String)
], User.prototype, "genderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_value_entity_1.AppValue),
    (0, typeorm_1.JoinColumn)({ name: 'genderId' }),
    __metadata("design:type", app_value_entity_1.AppValue)
], User.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'TOSAccepted', nullable: true, default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "TOSAccepted", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => candidate_entity_1.Candidate, (candidates) => candidates.consultant),
    __metadata("design:type", Array)
], User.prototype, "candidates", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'loginToken', length: 36, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "loginToken", void 0);
User = __decorate([
    (0, typeorm_1.Entity)({ name: 'users' })
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map