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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const shared_constants_1 = require("../../../shared/shared-constants");
const shared_service_1 = require("../../../shared/shared-service");
const app_right_entity_1 = require("../../entities/app-right.entity");
const app_value_dto_1 = require("../../models/dto/app-value-dto");
const user_dto_1 = require("../../models/dto/user-dto");
const user_role_dto_1 = require("../../models/dto/user-role-dto");
const app_rights_service_1 = require("../app-rights.service");
const referential_service_1 = require("../referential.service");
const user_roles_service_1 = require("../user-roles.service");
const users_service_1 = require("../users.service");
const logger_service_1 = require("./logger.service");
let DatabaseService = class DatabaseService {
    constructor(usersService, userRoleService, appRightsService, referentialService, logger) {
        this.usersService = usersService;
        this.userRoleService = userRoleService;
        this.appRightsService = appRightsService;
        this.referentialService = referentialService;
        this.logger = logger;
    }
    seedDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createNewJobs();
        });
    }
    createNewJobs() {
        return __awaiter(this, void 0, void 0, function* () {
            const typesWithValues = [
                {
                    typeCode: shared_constants_1.AppTypes.JobCuisineCategoryCode,
                    typeLabel: 'Métiers de la cuisine',
                    values: [],
                    onlyInsertType: true,
                },
                {
                    typeCode: shared_constants_1.AppTypes.JobSpaCategoryCode,
                    typeLabel: 'Métiers du spa',
                    values: [],
                    onlyInsertType: true,
                },
                {
                    typeCode: shared_constants_1.AppTypes.JobAdministratifHotellerieCategoryCode,
                    typeLabel: 'Métiers Administratif Hôtellerie',
                    values: [],
                    onlyInsertType: true,
                },
            ];
            yield this.insertTypes(typesWithValues);
        });
    }
    createRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const cRole of Object.values(shared_constants_1.RolesList)) {
                const roleResponse = yield this.userRoleService.findOne({
                    where: { role: cRole },
                });
                if (!roleResponse.userRole) {
                    const newRole = new user_role_dto_1.UserRoleDto();
                    newRole.role = cRole;
                    newRole.label = newRole.role;
                    yield this.userRoleService.createOrUpdate(newRole);
                }
            }
        });
    }
    createAndAssociateRights(rightsWithRoles, removeAllRights, onlyCreate) {
        return __awaiter(this, void 0, void 0, function* () {
            if (removeAllRights) {
                yield this.appRightsService.rightRepository.query('DELETE FROM roles_rights');
                yield this.appRightsService.rightRepository.query('DELETE FROM app_rights');
            }
            const fullRolesList = [];
            for (const rightWrapper of rightsWithRoles) {
                for (const roleName of rightWrapper.roles) {
                    if (fullRolesList.indexOf(roleName) === -1)
                        fullRolesList.push(roleName);
                }
            }
            const rolesResponse = yield this.userRoleService.findAll({
                where: { role: (0, typeorm_1.In)(fullRolesList) },
                relations: ['rights'],
            });
            for (const rightWrapper of rightsWithRoles) {
                const rightResponse = yield this.appRightsService.findOne({
                    where: { code: rightWrapper.right.code },
                });
                let rightDto = rightResponse.appRight;
                if (!rightDto) {
                    const rightEntity = new app_right_entity_1.AppRight();
                    rightEntity.code = rightWrapper.right.code;
                    rightEntity.label = rightWrapper.right.label;
                    rightEntity.order = rightWrapper.right.order;
                    const saveResponse = yield this.appRightsService.createOrUpdate(rightEntity.toDto(false));
                    rightDto = saveResponse.appRight;
                }
                if (!onlyCreate) {
                    const rolesToUpdate = rolesResponse.userRoles.filter((x) => rightWrapper.roles.indexOf(x.role) !== -1);
                    if (rolesToUpdate.length > 0) {
                        for (const roleDto of rolesToUpdate) {
                            if (!roleDto.rights.some((x) => x.id === rightDto.id)) {
                                roleDto.rights.push(rightDto);
                                yield this.userRoleService.createOrUpdate(roleDto);
                            }
                        }
                    }
                }
            }
        });
    }
    insertTypes(typesWithValues) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!(typesWithValues === null || typesWithValues === void 0 ? void 0 : typesWithValues.length)) {
                return;
            }
            const appTypesResponse = yield this.referentialService.getAllAppTypes({
                relations: ['appValues'],
            });
            for (const typeWithValues of typesWithValues) {
                if (!typeWithValues.forceUpdate &&
                    !typeWithValues.onlyInsert &&
                    ((_a = appTypesResponse.appTypes) === null || _a === void 0 ? void 0 : _a.some((x) => x.code === typeWithValues.typeCode))) {
                    continue;
                }
                if (typeWithValues.onlyInsert) {
                    const appType = appTypesResponse.appTypes.find((x) => x.code === typeWithValues.typeCode);
                    if (!appType)
                        return;
                    for (const appValue of typeWithValues.values) {
                        const newAppValue = new app_value_dto_1.AppValueDto();
                        newAppValue.appType = appType;
                        newAppValue.appTypeId = appType.id;
                        newAppValue.code = appValue.code;
                        newAppValue.label = appValue.label;
                        newAppValue.order = appValue.order;
                        if (!newAppValue.code) {
                            newAppValue.code =
                                shared_service_1.SharedService.generateAppValueCode(newAppValue);
                        }
                        if (!appType.appValues.some((x) => x.code === newAppValue.code)) {
                            console.log('adding new app value : ' + newAppValue.code);
                            yield this.referentialService.insertOrUpdateAppValue(newAppValue);
                        }
                    }
                }
                else {
                    yield this.referentialService.createOrUpdateTypeWithValues(typeWithValues.typeCode, typeWithValues.typeLabel, (typeWithValues === null || typeWithValues === void 0 ? void 0 : typeWithValues.onlyInsertType)
                        ? null
                        : typeWithValues.values, false);
                }
            }
        });
    }
    createDefaultTypes() {
        return __awaiter(this, void 0, void 0, function* () {
            const typesWithValues = [
                {
                    typeCode: shared_constants_1.AppTypes.UserCivilityCode,
                    typeLabel: 'Civilité',
                    values: [
                        { label: 'M', order: 1, code: shared_constants_1.UserCivilityCode.Male },
                        { label: 'Mme', order: 2, code: shared_constants_1.UserCivilityCode.Female },
                    ],
                    onlyInsert: true,
                },
                {
                    typeCode: shared_constants_1.AppTypes.ActivityLogCode,
                    typeLabel: 'Type',
                    values: [
                        {
                            label: 'Connexion',
                            order: 1,
                            code: shared_constants_1.ActivityLogCode.Login,
                        },
                        {
                            label: 'Déconnexion',
                            order: 2,
                            code: shared_constants_1.ActivityLogCode.Logout,
                        },
                        {
                            label: 'Connexion (auto)',
                            order: 3,
                            code: shared_constants_1.ActivityLogCode.RefreshToken,
                        },
                    ],
                    onlyInsert: true,
                },
                {
                    typeCode: shared_constants_1.AppTypes.ApplyStatusCode,
                    typeLabel: 'Statut de la candidature',
                    values: [
                        {
                            label: 'En attente',
                            order: 1,
                            code: shared_constants_1.ApplyStatus.Pending,
                        },
                        {
                            label: 'Acceptée',
                            order: 2,
                            code: shared_constants_1.ApplyStatus.Validated,
                        },
                        { label: 'Refusée', order: 3, code: shared_constants_1.ApplyStatus.Refused },
                        {
                            label: 'A trier',
                            order: 4,
                            code: shared_constants_1.ApplyStatus.ToBeSorted,
                        },
                    ],
                    onlyInsert: true,
                },
                {
                    typeCode: shared_constants_1.AppTypes.RelationshipStatusCode,
                    typeLabel: 'Situation Familiale',
                    values: [
                        {
                            label: 'Célibataire',
                            order: 1,
                            code: shared_constants_1.RelationshipStatus.Single,
                        },
                        {
                            label: 'En couple',
                            order: 2,
                            code: shared_constants_1.RelationshipStatus.InPairs,
                        },
                        {
                            label: 'En concubinage',
                            order: 3,
                            code: shared_constants_1.RelationshipStatus.InCohabiting,
                        },
                        {
                            label: 'Marié(e)',
                            order: 4,
                            code: shared_constants_1.RelationshipStatus.Married,
                        },
                        {
                            label: 'Divorcé(e)',
                            order: 5,
                            code: shared_constants_1.RelationshipStatus.Divorced,
                        },
                        {
                            label: 'Veuf(ve)',
                            order: 6,
                            code: shared_constants_1.RelationshipStatus.Widowed,
                        },
                    ],
                    onlyInsert: true,
                },
                {
                    typeCode: shared_constants_1.AppTypes.PersonGenderCode,
                    typeLabel: 'Civilité',
                    values: [
                        { label: 'Femme', order: 1, code: shared_constants_1.PersonGender.Female },
                        { label: 'Homme', order: 2, code: shared_constants_1.PersonGender.Male },
                    ],
                    onlyInsert: true,
                },
                {
                    typeCode: shared_constants_1.AppTypes.ContractTypeCode,
                    typeLabel: 'Type de contrat',
                    values: [
                        {
                            label: 'CDD Temps plein',
                            order: 1,
                            code: shared_constants_1.ContractType.CDD_FullTime,
                        },
                        {
                            label: 'CDD Temps partiel',
                            order: 2,
                            code: shared_constants_1.ContractType.CDD_HalfTime,
                        },
                        {
                            label: 'CDI Temps plein',
                            order: 3,
                            code: shared_constants_1.ContractType.CDI_FullTime,
                        },
                        {
                            label: 'CDI Temps partiel',
                            order: 4,
                            code: shared_constants_1.ContractType.CDI_HalfTime,
                        },
                        {
                            label: 'Freelance',
                            order: 5,
                            code: shared_constants_1.ContractType.Freelance,
                        },
                    ],
                    onlyInsert: true,
                },
                {
                    typeCode: shared_constants_1.AppTypes.JobCategoryCode,
                    typeLabel: 'Métiers de maison',
                    values: [
                        { label: 'Responsable technique - maintenance', order: 61 },
                    ],
                    onlyInsert: true,
                },
                {
                    typeCode: shared_constants_1.AppTypes.JobYachtingCategoryCode,
                    typeLabel: 'Métiers du Yachting',
                    values: [
                        { label: 'Capitaine Superyacht', order: 1 },
                        { label: 'Capitaine de Yacht', order: 2 },
                        { label: 'Capitaine Junior de yacht', order: 3 },
                        { label: '1er 2eme et 3eme Officier/Chief Mate', order: 4 },
                        { label: 'Officier de Quart', order: 5 },
                        { label: 'Second', order: 6 },
                        { label: 'Bosco', order: 7 },
                        { label: 'Skipper', order: 8 },
                        { label: 'Matelot/Deckhand', order: 9 },
                        { label: 'Matelot Junior', order: 10 },
                        { label: 'Chef Ingénieur Illimité', order: 11 },
                        { label: 'Chef Ingénieur Y1', order: 12 },
                        { label: 'Chef Ingénieur Y2', order: 13 },
                        { label: 'Chef Ingénieur Y3', order: 14 },
                        { label: 'Chef Ingénieur Y4', order: 15 },
                        { label: '2nd Ingénieur Illimité', order: 16 },
                        { label: '2nd Ingénieur (3000GT - 6000KW)', order: 17 },
                        { label: '2nd Ingénieur (3000GT - 3000KW)', order: 18 },
                        { label: '2nd Ingénieur (500GT - 3000KW)', order: 19 },
                        { label: '3eme Ingénieur', order: 20 },
                        { label: '4eme Ingénieur', order: 21 },
                        { label: 'OOW Ingénieur (MEOL)', order: 22 },
                        { label: 'OOW Ingénieur (AEC)', order: 23 },
                        { label: 'Ingénieur Electrotechnique', order: 24 },
                        { label: 'Ingénieur Junior', order: 25 },
                        { label: 'Machiniste/Mécanicien', order: 26 },
                        { label: 'Graisseur', order: 27 },
                        { label: 'Purser Yacht', order: 28 },
                        { label: 'Chef Steward/ess Yacht', order: 29 },
                        { label: 'Manger Entretien Intérieur Yacht', order: 30 },
                        { label: 'Majordome sur Yacht', order: 31 },
                        { label: 'Couple sur Yacht', order: 32 },
                        { label: '2nd Steward/ess Yacht', order: 33 },
                        { label: 'Steward/ess Yacht', order: 34 },
                        { label: 'Lingèr(e) sur Yacht', order: 35 },
                        {
                            label: 'Steward(ess) Polyvalent(e) sur Yacht',
                            order: 36,
                        },
                        { label: 'Steward/ess Junior sur Yacht', order: 37 },
                        { label: 'Yacht Barman', order: 38 },
                        { label: 'Chef Exécutif sur Yacht', order: 39 },
                        { label: 'Chef Cuisinier sur Yacht', order: 40 },
                        { label: 'Sous-Chef sur Yacht', order: 41 },
                        { label: 'Cuisinièr(e) sur Yacht', order: 42 },
                        { label: 'Plongeur sur Yacht', order: 43 },
                        { label: 'Manager de Projet Yacht', order: 44 },
                        { label: 'Manager/Gestionnaire de Yacht', order: 45 },
                        { label: 'Pilote Hélicoptère Yacht', order: 46 },
                        {
                            label: "Décorateur & Architecte d'Intérieur Yacht",
                            order: 47,
                        },
                        { label: 'Nannie sur Yacht', order: 48 },
                        { label: 'Coach Personnel Yacht', order: 49 },
                        { label: 'Garde du Corps sur Yacht ', order: 50 },
                        { label: 'Personnel de Beauté sur Yacht', order: 51 },
                        { label: 'Personnel de Massage sur Yacht', order: 52 },
                    ],
                    onlyInsert: true,
                },
                {
                    typeCode: shared_constants_1.AppTypes.JobNannyCategoryCode,
                    typeLabel: "Métiers de Nanny et Gouvernante d'enfant",
                    values: [
                        { label: 'Nanny', order: 1 },
                        { label: "Gouvernant d'enfant", order: 2 },
                        { label: 'Aide Puéricultrice', order: 3 },
                        { label: 'Nanny / Employé(e) de maison', order: 4 },
                        { label: 'Tuteur / Tutrice', order: 5 },
                        { label: 'Babysitter / Fille au Paire', order: 6 },
                    ],
                    onlyInsert: true,
                },
                {
                    typeCode: shared_constants_1.AppTypes.CandidateStatusCode,
                    typeLabel: 'Statut des candidats',
                    values: [
                        {
                            label: 'À référencer',
                            order: 1,
                            code: shared_constants_1.CandidateStatus.ToBeReferenced,
                        },
                        {
                            label: 'En cours de référencement',
                            order: 2,
                            code: shared_constants_1.CandidateStatus.BeingReferenced,
                        },
                        {
                            label: 'Référencé',
                            order: 3,
                            code: shared_constants_1.CandidateStatus.Referenced,
                        },
                        {
                            label: 'Non selectionné',
                            order: 4,
                            code: shared_constants_1.CandidateStatus.NotSelected,
                        },
                        { label: 'Placé', order: 5, code: shared_constants_1.CandidateStatus.Placed },
                        {
                            label: 'En cours pour un poste précis',
                            order: 6,
                            code: shared_constants_1.CandidateStatus.InProcess,
                        },
                    ],
                    onlyInsert: true,
                },
                {
                    typeCode: shared_constants_1.AppTypes.FileCandidateStatusCode,
                    typeLabel: 'Statut des dossiers candidats',
                    values: [
                        {
                            label: 'Complet',
                            order: 1,
                            code: shared_constants_1.FileCandidateStatus.Complete,
                        },
                        {
                            label: 'Incomplet',
                            order: 2,
                            code: shared_constants_1.FileCandidateStatus.NotComplete,
                        },
                    ],
                    onlyInsert: true,
                },
                {
                    typeCode: shared_constants_1.AppTypes.ContractTimeType,
                    typeLabel: 'Type de durée de contrat',
                    values: [
                        {
                            label: 'Temps plein',
                            order: 1,
                            code: shared_constants_1.ContractTimeType.FullTime,
                        },
                        {
                            label: 'Mi-Temps',
                            order: 2,
                            code: shared_constants_1.ContractTimeType.HalfTime,
                        },
                        {
                            label: 'Sans préférence',
                            order: 3,
                            code: shared_constants_1.ContractTimeType.NoPreference,
                        },
                    ],
                    onlyInsert: true,
                },
                {
                    typeCode: shared_constants_1.AppTypes.LicenceTypeCode,
                    typeLabel: 'Type de permis',
                    values: [
                        { label: 'Voiture', order: 1, code: shared_constants_1.LicenceType.Car },
                        { label: 'Moto', order: 2, code: shared_constants_1.LicenceType.Motorbike },
                        { label: 'Bateau', order: 3, code: shared_constants_1.LicenceType.Boat },
                    ],
                    onlyInsert: true,
                },
                {
                    typeCode: shared_constants_1.AppTypes.CandidateFileType,
                    typeLabel: 'Type de fichier',
                    values: [
                        {
                            label: 'Photo professionnelle et souriante',
                            order: 1,
                            code: shared_constants_1.CandidateFileType.MainPhoto,
                        },
                        {
                            label: 'CV original',
                            order: 2,
                            code: shared_constants_1.CandidateFileType.MainResume,
                        },
                        {
                            label: 'CV (conjoint)',
                            order: 3,
                            code: shared_constants_1.CandidateFileType.PartnerResume,
                        },
                        {
                            label: "Carte d'identité ou Carte de séjour recto/verso",
                            order: 4,
                            code: shared_constants_1.CandidateFileType.IdentityCard,
                        },
                        {
                            label: 'Photo de moins de trois mois en tenue de travail',
                            order: 5,
                            code: shared_constants_1.CandidateFileType.PhotoWithWorkClothes,
                        },
                        {
                            label: 'Justificatif de domicile de moins de trois mois',
                            order: 6,
                            code: shared_constants_1.CandidateFileType.ProofOfAddress,
                        },
                        {
                            label: 'Licence de vol (recto/verso)',
                            order: 7,
                            code: shared_constants_1.CandidateFileType.FlightLicence,
                        },
                        {
                            label: 'Diplôme de mer (recto/verso)',
                            order: 8,
                            code: shared_constants_1.CandidateFileType.SeaDiploma,
                        },
                        {
                            label: 'Diplôme divers (recto/verso)',
                            order: 9,
                            code: shared_constants_1.CandidateFileType.VariousDiploma,
                        },
                        {
                            label: 'Relevé de point permis de conduire (que pour la France)',
                            order: 10,
                            code: shared_constants_1.CandidateFileType.DrivingPointStatementFR,
                        },
                        {
                            label: "Relevé d'information assurance (que pour la France)",
                            order: 11,
                            code: shared_constants_1.CandidateFileType.StatementInsuranceInformationFR,
                        },
                        {
                            label: 'Passeport',
                            order: 12,
                            code: shared_constants_1.CandidateFileType.Passport,
                        },
                        {
                            label: 'Carte vitale/National Numbers pour le UK',
                            order: 13,
                            code: shared_constants_1.CandidateFileType.NationalNumbers,
                        },
                        {
                            label: 'Les trois derniers certificats de travail',
                            order: 14,
                            code: shared_constants_1.CandidateFileType.LastThreeWorkCertificates,
                        },
                        {
                            label: 'Les trois dernières lettres de référence',
                            order: 15,
                            code: shared_constants_1.CandidateFileType.LastThreeLettersOfReference,
                        },
                        {
                            label: 'Photos de plats pour les postes de chefs seulement (3 photos minimum)',
                            order: 16,
                            code: shared_constants_1.CandidateFileType.PhotoOfDishes,
                        },
                        {
                            label: 'Extrait K bis pour les candidats en freelance',
                            order: 17,
                            code: shared_constants_1.CandidateFileType.ExtractFromKBis,
                        },
                        {
                            label: 'Divers test de recrutement / aptitude',
                            order: 18,
                            code: shared_constants_1.CandidateFileType.VariousRecruitmentTestOrSkills,
                        },
                        {
                            label: 'Permis voiture (recto/verso)',
                            order: 19,
                            code: shared_constants_1.CandidateFileType.CarLicence,
                        },
                        {
                            label: 'Permis moto (recto/verso)',
                            order: 20,
                            code: shared_constants_1.CandidateFileType.MotorbikeLicence,
                        },
                        {
                            label: 'Permis bateau (recto/verso)',
                            order: 21,
                            code: shared_constants_1.CandidateFileType.BoatLicence,
                        },
                        {
                            label: 'Casier judiciaire du pays de résidence et datant de moins de 3 mois',
                            order: 22,
                            code: shared_constants_1.CandidateFileType.CriminalRecord,
                        },
                        {
                            label: 'Fiches de paies (1ère et dernière du poste occupé à ce jour)',
                            order: 23,
                            code: shared_constants_1.CandidateFileType.SalarySheets,
                        },
                        {
                            label: 'Autre',
                            order: 24,
                            code: shared_constants_1.CandidateFileType.Other,
                        },
                    ],
                    onlyInsert: true,
                },
                {
                    typeCode: shared_constants_1.AppTypes.LevelLanguageCode,
                    typeLabel: 'Niveau de langue',
                    values: [
                        {
                            label: 'Maternelle',
                            order: 1,
                            code: shared_constants_1.LevelLanguage.Maternelle,
                        },
                        {
                            label: 'Scolaire',
                            order: 2,
                            code: shared_constants_1.LevelLanguage.Scolaire,
                        },
                        { label: 'Courant', order: 3, code: shared_constants_1.LevelLanguage.Courant },
                    ],
                    onlyInsert: true,
                },
                {
                    typeCode: shared_constants_1.AppTypes.CandidateContactVisioTypeCode,
                    typeLabel: 'Choix outils visioconférence',
                    values: [
                        {
                            label: 'Skype',
                            order: 1,
                            code: shared_constants_1.CandidateContactVisioType.Skype,
                        },
                        {
                            label: 'Zoom',
                            order: 2,
                            code: shared_constants_1.CandidateContactVisioType.Zoom,
                        },
                        {
                            label: 'WhatsApp',
                            order: 3,
                            code: shared_constants_1.CandidateContactVisioType.WhatsApp,
                        },
                        {
                            label: 'Teams',
                            order: 4,
                            code: shared_constants_1.CandidateContactVisioType.Teams,
                        },
                        {
                            label: 'Google Meet',
                            order: 5,
                            code: shared_constants_1.CandidateContactVisioType.GoogleMeet,
                        },
                    ],
                    onlyInsert: true,
                },
                {
                    typeCode: shared_constants_1.AppTypes.JobOfferStateCode,
                    typeLabel: "Status des offres d'emploi",
                    values: [
                        {
                            label: 'Activée',
                            order: 1,
                            code: shared_constants_1.JobOfferState.Activated,
                        },
                        {
                            label: 'Suspendue',
                            order: 2,
                            code: shared_constants_1.JobOfferState.Suspended,
                        },
                        { label: 'Fermée', order: 3, code: shared_constants_1.JobOfferState.Closed },
                    ],
                    onlyInsert: true,
                },
                {
                    typeCode: shared_constants_1.AppTypes.JobReferenceFunctionCode,
                    typeLabel: 'Fonctions possibles des références',
                    values: [
                        {
                            label: 'Particulier',
                            order: 1,
                            code: shared_constants_1.JobReferenceFunction.Particulier,
                        },
                        {
                            label: 'Assistante',
                            order: 2,
                            code: shared_constants_1.JobReferenceFunction.Assistante,
                        },
                        {
                            label: 'Family Office',
                            order: 3,
                            code: shared_constants_1.JobReferenceFunction.FamilyOffice,
                        },
                        {
                            label: 'House Manager',
                            order: 4,
                            code: shared_constants_1.JobReferenceFunction.HouseManager,
                        },
                        {
                            label: 'Capitaine',
                            order: 5,
                            code: shared_constants_1.JobReferenceFunction.Capitaine,
                        },
                        {
                            label: 'Autre',
                            order: 6,
                            code: shared_constants_1.JobReferenceFunction.Autre,
                        },
                    ],
                    onlyInsert: true,
                },
                {
                    typeCode: shared_constants_1.AppTypes.EmployerProfilCode,
                    typeLabel: 'Fonctions possibles des références',
                    values: [
                        {
                            label: 'Famille',
                            order: 1,
                            code: shared_constants_1.EmployerProfil.Famille,
                        },
                        {
                            label: 'Particulier',
                            order: 2,
                            code: shared_constants_1.EmployerProfil.Particulier,
                        },
                        {
                            label: 'Personne agée',
                            order: 3,
                            code: shared_constants_1.EmployerProfil.OldPerson,
                        },
                        {
                            label: 'Family Office',
                            order: 4,
                            code: shared_constants_1.EmployerProfil.FamilyOffice,
                        },
                        { label: 'Autre', order: 5, code: shared_constants_1.EmployerProfil.Autre },
                    ],
                    onlyInsert: true,
                },
                {
                    typeCode: shared_constants_1.AppTypes.NewsletterStateCode,
                    typeLabel: 'Statuts des newsletters',
                    values: [
                        {
                            label: 'Brouillon',
                            order: 1,
                            code: shared_constants_1.NewsletterState.Draft,
                        },
                        {
                            label: "En cours d'envoi",
                            order: 2,
                            code: shared_constants_1.NewsletterState.Sent,
                        },
                        {
                            label: 'Archivée',
                            order: 3,
                            code: shared_constants_1.NewsletterState.Archived,
                        },
                        {
                            label: 'Envoi planifié',
                            order: 4,
                            code: shared_constants_1.NewsletterState.Pending,
                        },
                        {
                            label: 'Envoyée',
                            order: 5,
                            code: shared_constants_1.NewsletterState.Sent_SendInBlue,
                        },
                    ],
                    onlyInsert: true,
                },
                {
                    typeCode: shared_constants_1.AppTypes.JobHotellerieCategoryCode,
                    typeLabel: 'Métiers de l’hôtellerie',
                    values: [],
                    onlyInsert: true,
                },
                {
                    typeCode: shared_constants_1.AppTypes.JobRetailCategoryCode,
                    typeLabel: 'Métiers du retail',
                    values: [],
                    onlyInsert: true,
                },
                {
                    typeCode: shared_constants_1.AppTypes.JobRestaurationCategoryCode,
                    typeLabel: 'Métiers de la restauration',
                    values: [],
                    onlyInsert: true,
                },
            ];
            yield this.insertTypes(typesWithValues);
        });
    }
    createDefaultLanguages() {
        return __awaiter(this, void 0, void 0, function* () {
            const languages = [
                {
                    code: shared_constants_1.LangageCodes.French,
                    label: 'Français',
                    icon: encodeURIComponent('🇫🇷'),
                },
                {
                    code: shared_constants_1.LangageCodes.English,
                    label: 'Anglais',
                    icon: encodeURIComponent('🇬🇧'),
                },
            ];
            for (const language of languages) {
                yield this.referentialService.createOrUpdateLanguage(language);
            }
        });
    }
    createDefaultUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createUser('nextalys', 'admin', 'contact@nextalys.com', [
                shared_constants_1.RolesList.Admin,
                shared_constants_1.RolesList.AdminTech,
            ]);
        });
    }
    createUser(userName, password, email, roles) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getUserResponse = yield this.usersService.findOne({
                    where: { userName: userName },
                });
                if (getUserResponse.success && !getUserResponse.user) {
                    yield this.logger.log(`Creating user ${userName} with roles : ${roles.join('/')}...`);
                    const adminUser = new user_dto_1.UserDto();
                    adminUser.userName = userName;
                    adminUser.password = password;
                    adminUser.mail = email;
                    const getLanguagesResponse = yield this.referentialService.getAllLanguages();
                    const languageFR = (_a = getLanguagesResponse === null || getLanguagesResponse === void 0 ? void 0 : getLanguagesResponse.languages) === null || _a === void 0 ? void 0 : _a.find((x) => x.code === shared_constants_1.LangageCodes.French);
                    if (languageFR === null || languageFR === void 0 ? void 0 : languageFR.id) {
                        adminUser.languageId = languageFR.id;
                    }
                    const userRoles = [];
                    if (roles) {
                        roles.forEach((role) => {
                            userRoles.push({
                                role: role,
                                label: role,
                                enabled: true,
                            });
                        });
                    }
                    adminUser.roles = userRoles;
                    const createUserResponse = yield this.usersService.createOrUpdate(adminUser, false, {
                        roles: roles,
                    });
                    if (createUserResponse.success)
                        yield this.logger.log(`user ${userName} successfully created !`);
                }
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    setInitialApplicationRights() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createAndAssociateRights([
                {
                    right: { code: 'TestDroit', label: 'Test droit' },
                    roles: ['admin', 'admin_tech'],
                },
                {
                    right: {
                        code: 'TestDroit_AdminTech',
                        label: 'Test droit AdminTech',
                    },
                    roles: ['admin_tech'],
                },
            ], false, true);
        });
    }
};
DatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        user_roles_service_1.UserRoleService,
        app_rights_service_1.AppRightsService,
        referential_service_1.ReferentialService,
        logger_service_1.AppLogger])
], DatabaseService);
exports.DatabaseService = DatabaseService;
//# sourceMappingURL=database.service.js.map