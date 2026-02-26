import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import {
    ActivityLogCode,
    ApplyStatus,
    AppTypes,
    CandidateContactVisioType,
    CandidateFileType,
    CandidateStatus,
    ContractTimeType,
    ContractType,
    EmployerProfil,
    FileCandidateStatus,
    JobOfferState,
    JobReferenceFunction,
    LangageCodes,
    LevelLanguage,
    LicenceType,
    NewsletterState,
    PersonGender,
    RelationshipStatus,
    RolesList,
    UserCivilityCode,
} from '../../../shared/shared-constants';
import { SharedService } from '../../../shared/shared-service';
import { AppRight } from '../../entities/app-right.entity';
import { AppRightDto } from '../../models/dto/app-right-dto';
import { AppValueDto } from '../../models/dto/app-value-dto';
import { LanguageDto } from '../../models/dto/language-dto';
import { UserDto } from '../../models/dto/user-dto';
import { UserRoleDto } from '../../models/dto/user-role-dto';
import { AppRightsService } from '../app-rights.service';
import { ReferentialService } from '../referential.service';
import { UserRoleService } from '../user-roles.service';
import { UsersService } from '../users.service';
import { AppLogger } from './logger.service';

@Injectable()
export class DatabaseService {
    constructor(
        private usersService: UsersService,
        private userRoleService: UserRoleService,
        private appRightsService: AppRightsService,
        private referentialService: ReferentialService,
        private logger: AppLogger,
    ) {}
    public async seedDatabase() {
        // await this.createDefaultLanguages();
        // await this.createDefaultTypes();
        // await this.createRoles();
        // await this.createDefaultUsers();
        await this.createNewJobs();
    }

    private async createNewJobs() {
        const typesWithValues: {
            typeCode: string;
            typeLabel: string;
            values: { label: string; order: number; code?: string }[];
            forceUpdate?: boolean;
            onlyInsert?: boolean;
            onlyInsertType?: boolean;
        }[] = [
            // {
            //     typeCode: AppTypes.JobCategoryCode,
            //     typeLabel: 'Métiers de maison',
            //     values: [
            //         { label: "Formation couple gardiens/employés", order: 63 },
            //         { label: "Formation employé de maison", order: 64 },
            //         { label: "Formation nanny", order: 65 },
            //     ],
            //     onlyInsert: true,
            // },

            // {
            //     typeCode: AppTypes.JobHotellerieCategoryCode,
            //     typeLabel: 'Métiers de l’hôtellerie',
            //     values: [
            //     ],
            //     onlyInsertType: true,
            // },
            // {
            //     typeCode: AppTypes.JobRetailCategoryCode,
            //     typeLabel: 'Métiers du retail',
            //     values: [
            //     ],
            //     onlyInsertType: true,
            // },
            // {
            //     typeCode: AppTypes.JobRestaurationCategoryCode,
            //     typeLabel: 'Métiers de la restauration',
            //     values: [
            //     ],
            //     onlyInsertType: true,
            // },

            {
                typeCode: AppTypes.JobCuisineCategoryCode,
                typeLabel: 'Métiers de la cuisine',
                values: [],
                onlyInsertType: true,
            },
            {
                typeCode: AppTypes.JobSpaCategoryCode,
                typeLabel: 'Métiers du spa',
                values: [],
                onlyInsertType: true,
            },
            {
                typeCode: AppTypes.JobAdministratifHotellerieCategoryCode,
                typeLabel: 'Métiers Administratif Hôtellerie',
                values: [],
                onlyInsertType: true,
            },
        ];
        await this.insertTypes(typesWithValues);
    }

    private async createRoles() {
        for (const cRole of Object.values(RolesList)) {
            const roleResponse = await this.userRoleService.findOne({
                where: { role: cRole },
            });
            if (!roleResponse.userRole) {
                const newRole = new UserRoleDto();
                newRole.role = cRole;
                newRole.label = newRole.role;
                await this.userRoleService.createOrUpdate(newRole);
            }
        }
    }

    private async createAndAssociateRights(
        rightsWithRoles: {
            roles: string[];
            right: { label: string; code: string; order?: number };
        }[],
        removeAllRights: boolean,
        onlyCreate: boolean,
    ) {
        if (removeAllRights) {
            await this.appRightsService.rightRepository.query(
                'DELETE FROM roles_rights',
            );
            await this.appRightsService.rightRepository.query(
                'DELETE FROM app_rights',
            );
        }
        const fullRolesList: string[] = [];
        for (const rightWrapper of rightsWithRoles) {
            for (const roleName of rightWrapper.roles) {
                if (fullRolesList.indexOf(roleName) === -1)
                    fullRolesList.push(roleName);
            }
        }
        const rolesResponse = await this.userRoleService.findAll({
            where: { role: In(fullRolesList) },
            relations: ['rights'],
        });
        for (const rightWrapper of rightsWithRoles) {
            const rightResponse = await this.appRightsService.findOne({
                where: { code: rightWrapper.right.code },
            });
            let rightDto: AppRightDto = rightResponse.appRight;
            if (!rightDto) {
                const rightEntity = new AppRight();
                rightEntity.code = rightWrapper.right.code;
                rightEntity.label = rightWrapper.right.label;
                rightEntity.order = rightWrapper.right.order;
                const saveResponse = await this.appRightsService.createOrUpdate(
                    rightEntity.toDto(false),
                );
                rightDto = saveResponse.appRight;
            }
            if (!onlyCreate) {
                const rolesToUpdate = rolesResponse.userRoles.filter(
                    (x) => rightWrapper.roles.indexOf(x.role) !== -1,
                );
                if (rolesToUpdate.length > 0) {
                    for (const roleDto of rolesToUpdate) {
                        if (!roleDto.rights.some((x) => x.id === rightDto.id)) {
                            roleDto.rights.push(rightDto);
                            await this.userRoleService.createOrUpdate(roleDto);
                        }
                    }
                }
            }
        }
    }

    private async insertTypes(
        typesWithValues: {
            typeCode: string;
            typeLabel: string;
            values: { label: string; order: number; code?: string }[];
            forceUpdate?: boolean;
            onlyInsert?: boolean;
            onlyInsertType?: boolean;
        }[],
    ) {
        if (!typesWithValues?.length) {
            return;
        }
        const appTypesResponse = await this.referentialService.getAllAppTypes({
            relations: ['appValues'],
        });
        for (const typeWithValues of typesWithValues) {
            if (
                !typeWithValues.forceUpdate &&
                !typeWithValues.onlyInsert &&
                appTypesResponse.appTypes?.some(
                    (x) => x.code === typeWithValues.typeCode,
                )
            ) {
                continue;
            }
            if (typeWithValues.onlyInsert) {
                const appType = appTypesResponse.appTypes.find(
                    (x) => x.code === typeWithValues.typeCode,
                );
                if (!appType) return;
                for (const appValue of typeWithValues.values) {
                    const newAppValue = new AppValueDto();
                    newAppValue.appType = appType;
                    newAppValue.appTypeId = appType.id;
                    newAppValue.code = appValue.code;
                    newAppValue.label = appValue.label;
                    newAppValue.order = appValue.order;
                    if (!newAppValue.code) {
                        newAppValue.code =
                            SharedService.generateAppValueCode(newAppValue);
                    }
                    if (
                        !appType.appValues.some(
                            (x) => x.code === newAppValue.code,
                        )
                    ) {
                        console.log(
                            'adding new app value : ' + newAppValue.code,
                        );
                        await this.referentialService.insertOrUpdateAppValue(
                            newAppValue,
                        );
                    }
                }
            } else {
                await this.referentialService.createOrUpdateTypeWithValues(
                    typeWithValues.typeCode,
                    typeWithValues.typeLabel,
                    typeWithValues?.onlyInsertType
                        ? null
                        : typeWithValues.values,
                    false,
                );
            }
        }
    }

    private async createDefaultTypes() {
        // if (Environment.EnvName !== 'development')
        //     return;
        const typesWithValues: {
            typeCode: string;
            typeLabel: string;
            values: { label: string; order: number; code?: string }[];
            forceUpdate?: boolean;
            onlyInsert?: boolean;
        }[] = [
            {
                typeCode: AppTypes.UserCivilityCode,
                typeLabel: 'Civilité',
                values: [
                    { label: 'M', order: 1, code: UserCivilityCode.Male },
                    { label: 'Mme', order: 2, code: UserCivilityCode.Female },
                ],
                onlyInsert: true,
            },
            {
                typeCode: AppTypes.ActivityLogCode,
                typeLabel: 'Type',
                values: [
                    {
                        label: 'Connexion',
                        order: 1,
                        code: ActivityLogCode.Login,
                    },
                    {
                        label: 'Déconnexion',
                        order: 2,
                        code: ActivityLogCode.Logout,
                    },
                    {
                        label: 'Connexion (auto)',
                        order: 3,
                        code: ActivityLogCode.RefreshToken,
                    },
                ],
                onlyInsert: true,
            },
            {
                typeCode: AppTypes.ApplyStatusCode,
                typeLabel: 'Statut de la candidature',
                values: [
                    {
                        label: 'En attente',
                        order: 1,
                        code: ApplyStatus.Pending,
                    },
                    {
                        label: 'Acceptée',
                        order: 2,
                        code: ApplyStatus.Validated,
                    },
                    { label: 'Refusée', order: 3, code: ApplyStatus.Refused },
                    {
                        label: 'A trier',
                        order: 4,
                        code: ApplyStatus.ToBeSorted,
                    },
                ],
                onlyInsert: true,
            },
            {
                typeCode: AppTypes.RelationshipStatusCode,
                typeLabel: 'Situation Familiale',
                values: [
                    {
                        label: 'Célibataire',
                        order: 1,
                        code: RelationshipStatus.Single,
                    },
                    {
                        label: 'En couple',
                        order: 2,
                        code: RelationshipStatus.InPairs,
                    },
                    {
                        label: 'En concubinage',
                        order: 3,
                        code: RelationshipStatus.InCohabiting,
                    },
                    {
                        label: 'Marié(e)',
                        order: 4,
                        code: RelationshipStatus.Married,
                    },
                    {
                        label: 'Divorcé(e)',
                        order: 5,
                        code: RelationshipStatus.Divorced,
                    },
                    {
                        label: 'Veuf(ve)',
                        order: 6,
                        code: RelationshipStatus.Widowed,
                    },
                ],
                onlyInsert: true,
            },
            {
                typeCode: AppTypes.PersonGenderCode,
                typeLabel: 'Civilité',
                values: [
                    { label: 'Femme', order: 1, code: PersonGender.Female },
                    { label: 'Homme', order: 2, code: PersonGender.Male },
                ],
                onlyInsert: true,
            },
            {
                typeCode: AppTypes.ContractTypeCode,
                typeLabel: 'Type de contrat',
                values: [
                    {
                        label: 'CDD Temps plein',
                        order: 1,
                        code: ContractType.CDD_FullTime,
                    },
                    {
                        label: 'CDD Temps partiel',
                        order: 2,
                        code: ContractType.CDD_HalfTime,
                    },
                    {
                        label: 'CDI Temps plein',
                        order: 3,
                        code: ContractType.CDI_FullTime,
                    },
                    {
                        label: 'CDI Temps partiel',
                        order: 4,
                        code: ContractType.CDI_HalfTime,
                    },
                    {
                        label: 'Freelance',
                        order: 5,
                        code: ContractType.Freelance,
                    },
                ],
                onlyInsert: true,
            },
            {
                typeCode: AppTypes.JobCategoryCode,
                typeLabel: 'Métiers de maison',
                values: [
                    // { label: "Intendant Général - Régisseur - House manager", order: 9 },
                    // { label: "Majordome - Maître d'hôtel - Huissier", order: 8 },
                    // { label: "Valet de Chambre - Groom", order: 14 },
                    // { label: "Gouvernante", order: 2 },
                    // { label: "Chef Cuisinier", order: 4 },
                    // { label: "Jardinier", order: 15 },
                    // { label: "Chef jardinier", order: 11 },
                    // { label: "Lingère", order: 16 },
                    // { label: "Femme de ménage - de chambre", order: 17 },
                    // { label: "Cuisinière - Femme de ménage", order: 18 },
                    // { label: "Homme à tout faire", order: 1 },
                    // { label: "Couple de domestique", order: 19 },
                    // { label: "Couple de Gardien", order: 3 },
                    // { label: "Personnel de maison pour événement", order: 20 },
                    // { label: "Tuteur - Professeur privé", order: 21 },
                    // { label: "Gouvernante de l'enfance", order: 7 },
                    // { label: "Nannie - Nounou", order: 5 },
                    // { label: "Nannie - Nounou Mobile", order: 6 },
                    // { label: "Assitante maternelle - Nourrice", order: 22 },
                    // { label: "Babysitter", order: 23 },
                    // { label: "Chauffeur de Maître", order: 10 },
                    // { label: "Pilote de Jet Privé", order: 24 },
                    // { label: "Capitaine de Yacht - Voilier", order: 25 },
                    // { label: "Pilote d'hélicoptère", order: 26 },
                    // { label: "Hôtesse - Stewart Jet Privé", order: 27 },
                    // { label: "Skipper - Equipage de Yacht - Voilier", order: 28 },
                    // { label: "Chef de la sécurité", order: 29 },
                    // { label: "Garde du corps", order: 30 },
                    // { label: "Garde du corps mobile", order: 31 },
                    // { label: "Garde de propriété", order: 32 },
                    // { label: "Gestionnaire collection automobile privé", order: 33 },
                    // { label: "Assistant(e) personnel(le)", order: 13 },
                    // { label: "Gestionnaire de propriété", order: 34 },
                    // { label: "Dogsitter", order: 35 },
                    // { label: "Secrétaire particulier", order: 36 },
                    // { label: "Personnel de bureau privé", order: 37 },
                    // { label: "Gestionnaire collection art privé", order: 38 },
                    // { label: "Personal shopper", order: 39 },
                    // { label: "Gardien de propriété équestre", order: 40 },
                    // { label: "Auxiliaire de vie - Dame de compagnie", order: 41 },
                    // { label: "Personnel de massage et manucure", order: 42 },
                    // { label: "Coiffeur personnel", order: 43 },
                    // { label: "Personnel et employé hôtel de luxe et Palace", order: 44 },
                    // { label: "Coach sportif", order: 45 },
                    // { label: "Professeur de golf", order: 46 },
                    // { label: "Professeur de tennis", order: 47 },
                    // { label: "Moniteur de ski privé", order: 48 },
                    // { label: "Professeur de yoga - Pilate", order: 49 },
                    // { label: "Gardien de chasse", order: 50 },
                    // { label: "Autres", order: 51 },
                    // { label: "Nutritionniste", order: 57 },
                    // { label: "Professeur de ski", order: 58 },
                    // { label: "Sommelier", order: 59 },
                    // { label: "Voiturier", order: 60 },
                    { label: 'Responsable technique - maintenance', order: 61 },
                ],
                onlyInsert: true,
            },
            {
                typeCode: AppTypes.JobYachtingCategoryCode,
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
                typeCode: AppTypes.JobNannyCategoryCode,
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
                typeCode: AppTypes.CandidateStatusCode,
                typeLabel: 'Statut des candidats',
                values: [
                    {
                        label: 'À référencer',
                        order: 1,
                        code: CandidateStatus.ToBeReferenced,
                    },
                    {
                        label: 'En cours de référencement',
                        order: 2,
                        code: CandidateStatus.BeingReferenced,
                    },
                    {
                        label: 'Référencé',
                        order: 3,
                        code: CandidateStatus.Referenced,
                    },
                    {
                        label: 'Non selectionné',
                        order: 4,
                        code: CandidateStatus.NotSelected,
                    },
                    { label: 'Placé', order: 5, code: CandidateStatus.Placed },
                    {
                        label: 'En cours pour un poste précis',
                        order: 6,
                        code: CandidateStatus.InProcess,
                    },
                ],
                onlyInsert: true,
            },
            {
                typeCode: AppTypes.FileCandidateStatusCode,
                typeLabel: 'Statut des dossiers candidats',
                values: [
                    {
                        label: 'Complet',
                        order: 1,
                        code: FileCandidateStatus.Complete,
                    },
                    {
                        label: 'Incomplet',
                        order: 2,
                        code: FileCandidateStatus.NotComplete,
                    },
                ],
                onlyInsert: true,
            },
            {
                typeCode: AppTypes.ContractTimeType,
                typeLabel: 'Type de durée de contrat',
                values: [
                    {
                        label: 'Temps plein',
                        order: 1,
                        code: ContractTimeType.FullTime,
                    },
                    {
                        label: 'Mi-Temps',
                        order: 2,
                        code: ContractTimeType.HalfTime,
                    },
                    {
                        label: 'Sans préférence',
                        order: 3,
                        code: ContractTimeType.NoPreference,
                    },
                ],
                onlyInsert: true,
            },
            {
                typeCode: AppTypes.LicenceTypeCode,
                typeLabel: 'Type de permis',
                values: [
                    { label: 'Voiture', order: 1, code: LicenceType.Car },
                    { label: 'Moto', order: 2, code: LicenceType.Motorbike },
                    { label: 'Bateau', order: 3, code: LicenceType.Boat },
                ],
                onlyInsert: true,
            },
            {
                typeCode: AppTypes.CandidateFileType,
                typeLabel: 'Type de fichier',
                values: [
                    {
                        label: 'Photo professionnelle et souriante',
                        order: 1,
                        code: CandidateFileType.MainPhoto,
                    },
                    {
                        label: 'CV original',
                        order: 2,
                        code: CandidateFileType.MainResume,
                    },
                    {
                        label: 'CV (conjoint)',
                        order: 3,
                        code: CandidateFileType.PartnerResume,
                    },
                    {
                        label: "Carte d'identité ou Carte de séjour recto/verso",
                        order: 4,
                        code: CandidateFileType.IdentityCard,
                    },
                    {
                        label: 'Photo de moins de trois mois en tenue de travail',
                        order: 5,
                        code: CandidateFileType.PhotoWithWorkClothes,
                    },
                    {
                        label: 'Justificatif de domicile de moins de trois mois',
                        order: 6,
                        code: CandidateFileType.ProofOfAddress,
                    },
                    {
                        label: 'Licence de vol (recto/verso)',
                        order: 7,
                        code: CandidateFileType.FlightLicence,
                    },
                    {
                        label: 'Diplôme de mer (recto/verso)',
                        order: 8,
                        code: CandidateFileType.SeaDiploma,
                    },
                    {
                        label: 'Diplôme divers (recto/verso)',
                        order: 9,
                        code: CandidateFileType.VariousDiploma,
                    },
                    {
                        label: 'Relevé de point permis de conduire (que pour la France)',
                        order: 10,
                        code: CandidateFileType.DrivingPointStatementFR,
                    },
                    {
                        label: "Relevé d'information assurance (que pour la France)",
                        order: 11,
                        code: CandidateFileType.StatementInsuranceInformationFR,
                    },
                    {
                        label: 'Passeport',
                        order: 12,
                        code: CandidateFileType.Passport,
                    },
                    {
                        label: 'Carte vitale/National Numbers pour le UK',
                        order: 13,
                        code: CandidateFileType.NationalNumbers,
                    },
                    {
                        label: 'Les trois derniers certificats de travail',
                        order: 14,
                        code: CandidateFileType.LastThreeWorkCertificates,
                    },
                    {
                        label: 'Les trois dernières lettres de référence',
                        order: 15,
                        code: CandidateFileType.LastThreeLettersOfReference,
                    },
                    {
                        label: 'Photos de plats pour les postes de chefs seulement (3 photos minimum)',
                        order: 16,
                        code: CandidateFileType.PhotoOfDishes,
                    },
                    {
                        label: 'Extrait K bis pour les candidats en freelance',
                        order: 17,
                        code: CandidateFileType.ExtractFromKBis,
                    },
                    {
                        label: 'Divers test de recrutement / aptitude',
                        order: 18,
                        code: CandidateFileType.VariousRecruitmentTestOrSkills,
                    },
                    {
                        label: 'Permis voiture (recto/verso)',
                        order: 19,
                        code: CandidateFileType.CarLicence,
                    },
                    {
                        label: 'Permis moto (recto/verso)',
                        order: 20,
                        code: CandidateFileType.MotorbikeLicence,
                    },
                    {
                        label: 'Permis bateau (recto/verso)',
                        order: 21,
                        code: CandidateFileType.BoatLicence,
                    },
                    {
                        label: 'Casier judiciaire du pays de résidence et datant de moins de 3 mois',
                        order: 22,
                        code: CandidateFileType.CriminalRecord,
                    },
                    {
                        label: 'Fiches de paies (1ère et dernière du poste occupé à ce jour)',
                        order: 23,
                        code: CandidateFileType.SalarySheets,
                    },
                    {
                        label: 'Autre',
                        order: 24,
                        code: CandidateFileType.Other,
                    },
                ],
                // forceUpdate: true,
                onlyInsert: true,
            },
            {
                typeCode: AppTypes.LevelLanguageCode,
                typeLabel: 'Niveau de langue',
                values: [
                    {
                        label: 'Maternelle',
                        order: 1,
                        code: LevelLanguage.Maternelle,
                    },
                    {
                        label: 'Scolaire',
                        order: 2,
                        code: LevelLanguage.Scolaire,
                    },
                    { label: 'Courant', order: 3, code: LevelLanguage.Courant },
                ],
                // forceUpdate: true,
                onlyInsert: true,
            },
            {
                typeCode: AppTypes.CandidateContactVisioTypeCode,
                typeLabel: 'Choix outils visioconférence',
                values: [
                    {
                        label: 'Skype',
                        order: 1,
                        code: CandidateContactVisioType.Skype,
                    },
                    {
                        label: 'Zoom',
                        order: 2,
                        code: CandidateContactVisioType.Zoom,
                    },
                    {
                        label: 'WhatsApp',
                        order: 3,
                        code: CandidateContactVisioType.WhatsApp,
                    },
                    {
                        label: 'Teams',
                        order: 4,
                        code: CandidateContactVisioType.Teams,
                    },
                    {
                        label: 'Google Meet',
                        order: 5,
                        code: CandidateContactVisioType.GoogleMeet,
                    },
                ],
                // forceUpdate: true,
                onlyInsert: true,
            },
            {
                typeCode: AppTypes.JobOfferStateCode,
                typeLabel: "Status des offres d'emploi",
                values: [
                    {
                        label: 'Activée',
                        order: 1,
                        code: JobOfferState.Activated,
                    },
                    {
                        label: 'Suspendue',
                        order: 2,
                        code: JobOfferState.Suspended,
                    },
                    { label: 'Fermée', order: 3, code: JobOfferState.Closed },
                ],
                onlyInsert: true,
            },
            {
                typeCode: AppTypes.JobReferenceFunctionCode,
                typeLabel: 'Fonctions possibles des références',
                values: [
                    {
                        label: 'Particulier',
                        order: 1,
                        code: JobReferenceFunction.Particulier,
                    },
                    {
                        label: 'Assistante',
                        order: 2,
                        code: JobReferenceFunction.Assistante,
                    },
                    {
                        label: 'Family Office',
                        order: 3,
                        code: JobReferenceFunction.FamilyOffice,
                    },
                    {
                        label: 'House Manager',
                        order: 4,
                        code: JobReferenceFunction.HouseManager,
                    },
                    {
                        label: 'Capitaine',
                        order: 5,
                        code: JobReferenceFunction.Capitaine,
                    },
                    {
                        label: 'Autre',
                        order: 6,
                        code: JobReferenceFunction.Autre,
                    },
                ],
                onlyInsert: true,
            },
            {
                typeCode: AppTypes.EmployerProfilCode,
                typeLabel: 'Fonctions possibles des références',
                values: [
                    {
                        label: 'Famille',
                        order: 1,
                        code: EmployerProfil.Famille,
                    },
                    {
                        label: 'Particulier',
                        order: 2,
                        code: EmployerProfil.Particulier,
                    },
                    {
                        label: 'Personne agée',
                        order: 3,
                        code: EmployerProfil.OldPerson,
                    },
                    {
                        label: 'Family Office',
                        order: 4,
                        code: EmployerProfil.FamilyOffice,
                    },
                    { label: 'Autre', order: 5, code: EmployerProfil.Autre },
                ],
                onlyInsert: true,
            },
            {
                typeCode: AppTypes.NewsletterStateCode,
                typeLabel: 'Statuts des newsletters',
                values: [
                    {
                        label: 'Brouillon',
                        order: 1,
                        code: NewsletterState.Draft,
                    },
                    {
                        label: "En cours d'envoi",
                        order: 2,
                        code: NewsletterState.Sent,
                    },
                    {
                        label: 'Archivée',
                        order: 3,
                        code: NewsletterState.Archived,
                    },
                    {
                        label: 'Envoi planifié',
                        order: 4,
                        code: NewsletterState.Pending,
                    },
                    {
                        label: 'Envoyée',
                        order: 5,
                        code: NewsletterState.Sent_SendInBlue,
                    },
                ],
                // forceUpdate: true,
                onlyInsert: true,
            },
            {
                typeCode: AppTypes.JobHotellerieCategoryCode,
                typeLabel: 'Métiers de l’hôtellerie',
                values: [],
                onlyInsert: true,
            },
            {
                typeCode: AppTypes.JobRetailCategoryCode,
                typeLabel: 'Métiers du retail',
                values: [],
                onlyInsert: true,
            },
            {
                typeCode: AppTypes.JobRestaurationCategoryCode,
                typeLabel: 'Métiers de la restauration',
                values: [],
                onlyInsert: true,
            },
        ];
        await this.insertTypes(typesWithValues);
    }

    private async createDefaultLanguages() {
        const languages: LanguageDto[] = [
            {
                code: LangageCodes.French,
                label: 'Français',
                icon: encodeURIComponent('🇫🇷'),
            },
            {
                code: LangageCodes.English,
                label: 'Anglais',
                icon: encodeURIComponent('🇬🇧'),
            },
        ];
        for (const language of languages) {
            await this.referentialService.createOrUpdateLanguage(language);
        }
    }

    private async createDefaultUsers() {
        await this.createUser('nextalys', 'admin', 'contact@nextalys.com', [
            RolesList.Admin,
            RolesList.AdminTech,
        ]);
    }

    private async createUser(
        userName: string,
        password: string,
        email: string,
        roles?: string[],
    ) {
        try {
            const getUserResponse = await this.usersService.findOne({
                where: { userName: userName },
            });
            if (getUserResponse.success && !getUserResponse.user) {
                await this.logger.log(
                    `Creating user ${userName} with roles : ${roles.join(
                        '/',
                    )}...`,
                );
                const adminUser = new UserDto();
                adminUser.userName = userName;
                adminUser.password = password;
                adminUser.mail = email;
                // const getValuesResponse = await this.referentialService.getAllAppValues({ where: { code: 'fr' } });
                // console.log(': DatabaseService -> createUser -> getValuesResponse', getValuesResponse);
                // if (getValuesResponse && getValuesResponse.appValues.length > 0) {
                //     adminUser.languageId = getValuesResponse.appValues[0].id;
                // }

                const getLanguagesResponse =
                    await this.referentialService.getAllLanguages();
                const languageFR = getLanguagesResponse?.languages?.find(
                    (x) => x.code === LangageCodes.French,
                );
                // console.log(': DatabaseService -> createUser -> getLanguagesResponse', getLanguagesResponse);
                if (languageFR?.id) {
                    adminUser.languageId = languageFR.id;
                }
                const userRoles: UserRoleDto[] = [];
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
                const createUserResponse =
                    await this.usersService.createOrUpdate(adminUser, false, {
                        roles: roles,
                    } as any);
                if (createUserResponse.success)
                    await this.logger.log(
                        `user ${userName} successfully created !`,
                    );
            }
        } catch (err) {
            console.error(err);
        }
    }

    private async setInitialApplicationRights() {
        await this.createAndAssociateRights(
            [
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
            ],
            false,
            true,
        );
    }
}
