import {
    Column,
    Entity,
    Generated,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
} from 'typeorm';
import {
    CandidateAllergiesEnum,
    JobHousedEnum,
} from '../../../shared/shared-constants';
import { Address } from '../../entities/address.entity';
import { AppLanguage } from '../../entities/app-language.entity';
import { AppValue } from '../../entities/app-value.entity';
import { AppBaseEntity } from '../../entities/base-entity';
import { CandidatePresentation } from '../../entities/candidate-presentation.entity';
import { NoteItem } from '../../entities/note-item.entity';
import { User } from '../../entities/user.entity';
import { CandidateApplication } from '../candidates-application/candidate-application.entity';
import { Interview } from '../interviews/interview.entity';
import { JobOffer } from '../job-offers/job-offer.entity';
import { CandidateChildren } from './candidate-children/candidate-children.entity';
import { CandidateContract } from './candidate-contract.entity';
import { CandidateCountry } from './candidate-country/candidate-country.entity';
import { CandidateCurrentJob } from './candidate-current-jobs/candidate-current-jobs.entity';
import { CandidateDepartment } from './candidate-department/candidate-department.entity';
import { CandidateDto } from './candidate-dto';
import { CandidateFile } from './candidate-file.entity';
import { CandidateJob } from './candidate-jobs.entity';
import { CandidateLanguage } from './candidate-language/candidate-language.entity';
import { CandidateLicence } from './candidate-licences/candidate-licences.entity';
import { CandidatePet } from './candidate-pets/candidate-pet.entity';
import { CandidateReadonlyProperty } from './candidate-readonly/candidate-readonly-property.entity';

@Entity({ name: 'candidates' })
export class Candidate extends AppBaseEntity {
    @Column('varchar', { name: 'firstName', nullable: true, length: 130 })
    firstName: string;

    @Column('varchar', { name: 'lastName', nullable: true, length: 130 })
    lastName: string;

    @Column('varchar', { name: 'nickName', nullable: true, length: 130 })
    nickName: string;

    // @ManyToMany(() => AppFile, { cascade: true, onUpdate: 'CASCADE' })
    // @JoinTable({ name: 'candidates_files' })
    // files: AppFile[];

    @Column('varchar', { name: 'genderId', nullable: true, length: 36 })
    genderId: string;

    @ManyToOne(() => AppValue)
    @JoinColumn({ name: 'genderId' })
    gender?: AppValue;

    @Column('date', { name: 'birthDate', nullable: true })
    birthDate: Date;

    // @Column('varchar', { name: 'professionId', nullable: true, length: 36 })
    // professionId: string;
    // @ManyToOne(() => AppValue)
    // @JoinColumn({ name: 'professionId' })
    // profession?: AppValue;

    @Column('varchar', { name: 'phone', nullable: true, length: 30 })
    phone: string;

    @Column('varchar', { name: 'phoneSecondary', nullable: true, length: 30 })
    phoneSecondary: string;

    @Column('varchar', { name: 'email', length: 255, nullable: true })
    email: string;

    @Column('text', {
        name: 'additionalEmails',
        nullable: true,
        transformer: {
            to: (value: string[]): string | null =>
                value?.length ? JSON.stringify(value) : null,
            from: (value: string): string[] =>
                value ? JSON.parse(value) : [],
        },
    })
    additionalEmails: string[];

    @Column('varchar', { name: 'nationality', nullable: true })
    nationality: string;

    @Column('varchar', {
        name: 'relationshipStatusId',
        nullable: true,
        length: 36,
    })
    relationshipStatusId: string;

    @ManyToOne(() => AppValue)
    @JoinColumn({ name: 'relationshipStatusId' })
    relationshipStatus?: AppValue;

    @Column('text', { name: 'skills', nullable: true })
    skills: string;

    @Column('boolean', { name: 'inCouple', nullable: false, default: 0 })
    inCouple: boolean;

    @Column('varchar', { name: 'isJobHoused', nullable: true, length: 30 })
    isJobHoused: JobHousedEnum;

    @Column('boolean', { name: 'hasLicenceDriver', nullable: true })
    hasLicenceDriver: boolean;

    @ManyToOne(() => AppLanguage)
    @JoinColumn({ name: 'languageId' })
    language?: AppLanguage;

    @Column('varchar', { name: 'languageId', length: 36, nullable: true })
    languageId?: string;

    @Column('int', { name: 'dependentChildren', nullable: true })
    dependentChildren: number;

    @Column('boolean', { name: 'animal', nullable: true })
    animal: boolean;

    @Column('boolean', { name: 'isAvailable', nullable: true, default: 0 })
    isAvailable: boolean;

    @OneToMany(() => Address, (addresses) => addresses.candidate, {
        cascade: true,
    })
    addresses?: Address[];

    @Column('varchar', {
        name: 'candidateStatusId',
        nullable: true,
        length: 36,
    })
    candidateStatusId?: string;

    @ManyToOne(() => AppValue)
    @JoinColumn({ name: 'candidateStatusId' })
    candidateStatus?: AppValue;

    @Column('varchar', {
        name: 'placedJobOfferId',
        nullable: true,
        length: 36,
    })
    placedJobOfferId?: string;

    @ManyToOne(() => JobOffer, { nullable: true })
    @JoinColumn({ name: 'placedJobOfferId' })
    placedJobOffer?: JobOffer;

    @OneToMany(
        () => CandidateApplication,
        (candidateApplications) => candidateApplications.candidate,
        { cascade: true, onDelete: 'SET NULL' },
    )
    candidateApplications?: CandidateApplication[];

    @OneToMany(() => CandidateJob, (candidateJobs) => candidateJobs.candidate, {
        cascade: true,
    })
    candidateJobs?: CandidateJob[];

    @Column('varchar', { name: 'contractTypeId', nullable: true, length: 36 })
    contractTypeId: string;

    @ManyToOne(() => AppValue)
    @JoinColumn({ name: 'contractTypeId' })
    contractType?: AppValue;

    @Column('varchar', {
        name: 'contractTypeAskedId',
        nullable: true,
        length: 36,
    })
    contractTypeAskedId: string;

    @ManyToOne(() => AppValue)
    @JoinColumn({ name: 'contractTypeAskedId' })
    contractTypeAsked?: AppValue;

    @Column('varchar', {
        name: 'workingTimeTypeId',
        nullable: true,
        length: 36,
    })
    workingTimeTypeId: string;

    @ManyToOne(() => AppValue)
    @JoinColumn({ name: 'workingTimeTypeId' })
    workingTimeType?: AppValue;

    @OneToMany(() => CandidateFile, (file) => file.candidate, { cascade: true })
    files?: CandidateFile[];

    @Column('int', { name: 'note', nullable: true })
    note?: number;

    @OneToMany(() => NoteItem, (noteItems) => noteItems.candidate, {
        cascade: true,
    })
    noteItems?: NoteItem[];

    @OneToMany(
        () => CandidateLicence,
        (candidateLicence) => candidateLicence.candidate,
        { cascade: true },
    )
    candidateLicences?: CandidateLicence[];

    @OneToMany(() => Interview, (interview) => interview.candidate)
    interviews?: Interview[];

    @OneToMany(
        () => CandidateLanguage,
        (candidateLanguages) => candidateLanguages.candidate,
        { cascade: true },
    )
    candidateLanguages?: CandidateLanguage[];

    @OneToMany(
        () => CandidateChildren,
        (candidateChildrens) => candidateChildrens.candidate,
        { cascade: true },
    )
    candidateChildrens?: CandidateChildren[];

    @Column('varchar', { name: 'partnerFirstName', nullable: true, length: 30 })
    partnerFirstName: string;

    @Column('varchar', { name: 'partnerLastName', nullable: true, length: 30 })
    partnerLastName: string;

    @Column('date', { name: 'partnerBirthDate', nullable: true })
    partnerBirthDate: Date;

    @Column('varchar', { name: 'partnerGenderId', nullable: true, length: 36 })
    partnerGenderId: string;

    @ManyToOne(() => AppValue)
    @JoinColumn({ name: 'partnerGenderId' })
    partnerGender?: AppValue;

    @Column('varchar', { name: 'partnerEmail', nullable: true, length: 255 })
    partnerEmail?: string;

    @Column('varchar', { name: 'partnerPhone', nullable: true, length: 30 })
    partnerPhone?: string;

    @Column('datetime', {
        name: 'lastCandidateMessageSendedDate',
        nullable: true,
    })
    lastCandidateMessageSendedDate: Date;

    @Column('boolean', {
        name: 'hasNoChildren',
        nullable: true,
        default: false,
    })
    hasNoChildren?: boolean;

    @OneToMany(
        () => CandidateReadonlyProperty,
        (candidateReadonlyProperties) => candidateReadonlyProperties.candidate,
        { cascade: true },
    )
    candidateReadonlyProperties?: CandidateReadonlyProperty[];

    @Column('boolean', { name: 'isOnPost', nullable: true, default: 0 })
    isOnPost?: boolean;

    @ManyToOne(() => User, (consultant) => consultant.candidates, {
        cascade: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'consultantId' })
    consultant?: User;

    @Column('varchar', { name: 'consultantId', length: 36, nullable: true })
    consultantId?: string;

    @Column('int', { name: 'jobAdderContactId', nullable: true })
    jobAdderContactId?: number;


    @Column('boolean', { name: 'isVehicle', nullable: true, default: false })
    isVehicle?: boolean;

    @OneToMany(() => CandidatePet, (candidatePets) => candidatePets.candidate, {
        cascade: true,
    })
    candidatePets?: CandidatePet[];

    @OneToMany(
        () => CandidatePresentation,
        (presentations) => presentations.candidate,
        { cascade: true },
    )
    presentations?: CandidatePresentation[];

    @OneToMany(
        () => CandidateContract,
        (candidateContracts) => candidateContracts.candidate,
        { cascade: true },
    )
    candidateContracts?: CandidateContract[];

    @OneToMany(
        () => CandidateCountry,
        (candidateCountries) => candidateCountries.candidate,
        { cascade: true },
    )
    candidateCountries?: CandidateCountry[];

    @OneToMany(
        () => CandidateDepartment,
        (candidateDepartment) => candidateDepartment.candidate,
        { cascade: true },
    )
    candidateDepartments?: CandidateDepartment[];

    @Column('boolean', {
        name: 'manuallyCompleted',
        nullable: true,
        default: false,
    })
    manuallyCompleted?: boolean;

    @Column('boolean', {
        name: 'mailSentAfterMigration',
        nullable: false,
        default: false,
    })
    mailSentAfterMigration: boolean;

    @OneToOne(() => User, (user) => user.candidate)
    associatedUser: User;

    @OneToMany(
        () => CandidateCurrentJob,
        (candidateCurrentJob) => candidateCurrentJob.candidate,
        { cascade: true },
    )
    candidateCurrentJobs?: CandidateCurrentJob[];

    @Column('boolean', { name: 'globalMobility', default: false })
    globalMobility?: boolean;

    @Column('boolean', {
        name: 'hasManyTravel',
        nullable: true,
        default: false,
    })
    hasManyTravel: boolean;

    @Column('boolean', {
        name: 'referencesValidated',
        nullable: true,
        default: null,
    })
    referencesValidated?: boolean;

    @Column('enum', {
        name: 'allergy',
        nullable: true,
        enum: CandidateAllergiesEnum,
        enumName: 'CandidateAllergiesEnum',
    })
    allergy?: CandidateAllergiesEnum;

    @Column('boolean', {
        name: 'newsletterUnsubscribed',
        nullable: false,
        default: 0,
    })
    newsletterUnsubscribed: boolean;

    @Generated('uuid')
    @Column('varchar', {
        name: 'newsletterUnsubscribedGuid',
        nullable: true,
        length: 36,
    })
    newsletterUnsubscribedGuid?: string;

    @Column('boolean', { name: 'allowed_to_work_us', nullable: true })
    allowed_to_work_us?: boolean;

    @Column('boolean', { name: 'require_sponsorship_us', nullable: true })
    require_sponsorship_us?: boolean;

    public toDto(): CandidateDto {
        return {
            id: this.id,
            firstName: this.capitalize(this.firstName) ?? this.firstName,
            lastName: this.lastName?.toUpperCase() ?? this.lastName,
            nickName: this.nickName?.toUpperCase() ?? this.nickName,
            genderId: this.genderId,
            gender: this.gender?.toDto(),
            birthDate: this.birthDate,
            addresses: this.addresses
                ? this.addresses.map((x) => x.toDto())
                : undefined,
            phone: this.phone,
            phoneSecondary: this.phoneSecondary,
            email: this.email,
            additionalEmails: this.additionalEmails ?? [],
            nationality: this.nationality,
            skills: this.skills,
            inCouple: this.inCouple,
            isJobHoused: this.isJobHoused,
            hasLicenceDriver: this.hasLicenceDriver,
            languageId: this.languageId,
            language: this.language ? this.language.toDto() : null,
            dependentChildren: this.dependentChildren,
            animal: this.animal,
            isAvailable: this.isAvailable,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            relationshipStatusId: this.relationshipStatusId,
            relationshipStatus: this.relationshipStatus?.toDto(),
            candidateStatusId: this.candidateStatusId,
            candidateStatus: this.candidateStatus?.toDto(),
            placedJobOfferId: this.placedJobOfferId,
            placedJobOffer: this.placedJobOffer?.toDto(),
            candidateApplications: this.candidateApplications
                ? this.candidateApplications.map((x) => x.toDto())
                : undefined,
            contractTypeAskedId: this.contractTypeAskedId,
            contractTypeAsked: this.contractTypeAsked?.toDto(),
            workingTimeTypeId: this.workingTimeTypeId,
            workingTimeType: this.workingTimeType?.toDto(),
            files: this.files ? this.files.map((x) => x.toDto()) : undefined,
            noteItems: this.noteItems
                ? this.noteItems.map((x) => x.toDto())
                : undefined,
            note: this.note,
            candidateLicences: this.candidateLicences
                ? this.candidateLicences.map((x) => x.toDto())
                : undefined,
            candidateJobs: this.candidateJobs
                ? this.candidateJobs.map((x) => x.toDto())
                : undefined,
            interviews: this.interviews
                ? this.interviews.map((x) => x.toDto())
                : undefined,
            candidateLanguages: this.candidateLanguages
                ? this.candidateLanguages.map((x) => x.toDto())
                : undefined,
            candidateChildrens: this.candidateChildrens
                ? this.candidateChildrens.map((x) => x.toDto())
                : undefined,
            partnerFirstName: this.partnerFirstName,
            partnerLastName: this.partnerLastName,
            partnerGenderId: this.partnerGenderId,
            partnerGender: this.partnerGender?.toDto(),
            partnerBirthDate: this.partnerBirthDate,
            lastCandidateMessageSendedDate: this.lastCandidateMessageSendedDate,
            hasNoChildren: this.hasNoChildren,
            candidateReadonlyProperties: this.candidateReadonlyProperties
                ? this.candidateReadonlyProperties.map((x) => x.toDto())
                : undefined,
            isOnPost: this.isOnPost,
            consultantId: this.consultantId,
            consultant: this.consultant?.toDto(),
            disabled: this.disabled,
            jobAdderContactId: this.jobAdderContactId,
            isVehicle: this.isVehicle,
            candidatePets: this.candidatePets
                ? this.candidatePets.map((x) => x.toDto())
                : undefined,
            candidateContracts: this.candidateContracts
                ? this.candidateContracts.map((x) => x.toDto())
                : undefined,
            candidateCountries: this.candidateCountries
                ? this.candidateCountries.map((x) => x.toDto())
                : undefined,
            candidateDepartments: this.candidateDepartments
                ? this.candidateDepartments.map((x) => x.toDto())
                : undefined,
            manuallyCompleted: this.manuallyCompleted,
            mailSentAfterMigration: this.mailSentAfterMigration,
            associatedUser: this.associatedUser?.toDto(false),
            candidateCurrentJobs: this.candidateCurrentJobs
                ? this.candidateCurrentJobs.map((x) => x.toDto())
                : undefined,
            globalMobility: this.globalMobility,
            hasManyTravel: this.hasManyTravel,
            referencesValidated: this.referencesValidated,
            allergy: this.allergy,
            newsletterUnsubscribed: this.newsletterUnsubscribed,
            newsletterUnsubscribedGuid: this.newsletterUnsubscribedGuid,
            partnerEmail: this.partnerEmail,
            partnerPhone: this.partnerPhone,
            allowed_to_work_us: this.allowed_to_work_us,
            require_sponsorship_us: this.require_sponsorship_us,
        };
    }

    public fromDto(dto: CandidateDto) {
        this.id = dto.id;
        this.firstName = dto.firstName;
        this.lastName = dto.lastName;
        this.nickName = dto.nickName;
        this.genderId = dto.genderId;
        this.birthDate = dto.birthDate;
        // this.professionId = dto.professionId;
        this.phone = dto.phone;
        this.email = dto.email;
        this.additionalEmails = dto.additionalEmails ?? [];
        this.nationality = dto.nationality;
        this.relationshipStatusId = dto.relationshipStatusId;
        this.skills = dto.skills;
        this.inCouple = dto.inCouple;
        this.isJobHoused = dto.isJobHoused;
        this.hasLicenceDriver = dto.hasLicenceDriver;
        this.languageId = dto.languageId;
        this.dependentChildren = dto.dependentChildren;
        this.animal = dto.animal;
        this.isAvailable = dto.isAvailable;
        this.phoneSecondary = dto.phoneSecondary;
        this.candidateStatusId = dto.candidateStatusId;
        this.placedJobOfferId = dto.placedJobOfferId;
        this.contractTypeAskedId = dto.contractTypeAskedId;
        this.workingTimeTypeId = dto.workingTimeTypeId;
        this.note = dto.note;
        this.partnerFirstName = dto.partnerFirstName;
        this.partnerLastName = dto.partnerLastName;
        this.partnerBirthDate = dto.partnerBirthDate;
        this.partnerGenderId = dto.partnerGenderId;
        this.lastCandidateMessageSendedDate =
            dto.lastCandidateMessageSendedDate;
        this.hasNoChildren = dto.hasNoChildren;
        this.isOnPost = dto.isOnPost;
        this.consultantId = dto.consultantId;
        this.disabled = dto.disabled;
        this.jobAdderContactId = dto.jobAdderContactId;
        this.isVehicle = dto.isVehicle;
        this.manuallyCompleted = dto.manuallyCompleted;
        this.mailSentAfterMigration = dto.mailSentAfterMigration;
        this.globalMobility = dto.globalMobility;
        this.hasManyTravel = dto.hasManyTravel;
        this.referencesValidated = dto.referencesValidated;
        this.allergy = dto.allergy;
        this.newsletterUnsubscribed = dto.newsletterUnsubscribed;
        this.newsletterUnsubscribedGuid = dto.newsletterUnsubscribedGuid;
        this.partnerEmail = dto.partnerEmail;
        this.partnerPhone = dto.partnerPhone;
        this.allowed_to_work_us = dto.allowed_to_work_us;
        this.require_sponsorship_us = dto.require_sponsorship_us;

        if (dto.creationDate) {
            this.creationDate = dto.creationDate;
        }

        if (dto.language) {
            const language = new AppLanguage();
            language.fromDto(dto.language);
            this.language = language;
            this.languageId = language.id;
        }

        if (dto.addresses) {
            this.addresses = [];

            for (const address of dto.addresses) {
                const addrEntity = new Address();
                addrEntity.fromDto(address);
                this.addresses.push(addrEntity);
            }
        }

        if (dto.candidateJobs) {
            this.candidateJobs = [];

            for (const cjob of dto.candidateJobs) {
                const cjobToCreate = new CandidateJob();
                cjobToCreate.fromDto(cjob);
                this.candidateJobs.push(cjobToCreate);
            }
        }

        if (dto.files) {
            this.files = [];

            for (const file of dto.files) {
                const fileToCreate = new CandidateFile();
                fileToCreate.fromDto(file);
                this.files.push(fileToCreate);
            }
        }
        if (dto.noteItems) {
            this.noteItems = [];

            for (const note of dto.noteItems) {
                const noteToCreate = new NoteItem();
                noteToCreate.fromDto(note);
                this.noteItems.push(noteToCreate);
            }
        }

        if (dto.candidateLicences) {
            this.candidateLicences = [];

            for (const cl of dto.candidateLicences) {
                const clToCreate = new CandidateLicence();
                clToCreate.fromDto(cl);
                this.candidateLicences.push(clToCreate);
            }
        }

        if (dto.candidateLanguages) {
            this.candidateLanguages = [];

            for (const cl of dto.candidateLanguages) {
                const clToCreate = new CandidateLanguage();
                clToCreate.fromDto(cl);
                this.candidateLanguages.push(clToCreate);
            }
        }

        if (dto.candidateChildrens) {
            this.candidateChildrens =
                dto.candidateChildrens.map<CandidateChildren>((x) => {
                    const candidateChildren = new CandidateChildren();
                    candidateChildren.fromDto(x);
                    return candidateChildren;
                });
        }

        if (dto.candidateReadonlyProperties) {
            this.candidateReadonlyProperties = [];

            for (const item of dto.candidateReadonlyProperties) {
                const candidateReadonlyProperty =
                    new CandidateReadonlyProperty();
                candidateReadonlyProperty.fromDto(item);
                this.candidateReadonlyProperties.push(
                    candidateReadonlyProperty,
                );
            }
        }

        if (dto.candidatePets) {
            this.candidatePets = dto.candidatePets.map<CandidatePet>((x) => {
                const candidatePet = new CandidatePet();
                candidatePet.fromDto(x);
                return candidatePet;
            });
        }

        if (dto.candidateContracts) {
            this.candidateContracts = [];

            for (const candidateContractDto of dto.candidateContracts) {
                const candidateContract = new CandidateContract();
                candidateContract.fromDto(candidateContractDto);
                this.candidateContracts.push(candidateContract);
            }
        }

        if (dto.candidateCountries) {
            this.candidateCountries =
                dto.candidateCountries.map<CandidateCountry>((x) => {
                    const candidateCountry = new CandidateCountry();
                    candidateCountry.fromDto(x);
                    return candidateCountry;
                });
        }

        if (dto.candidateDepartments) {
            this.candidateDepartments =
                dto.candidateDepartments.map<CandidateDepartment>((x) => {
                    const candidateDepartment = new CandidateDepartment();
                    candidateDepartment.fromDto(x);
                    return candidateDepartment;
                });
        }

        if (dto.candidateCurrentJobs) {
            this.candidateCurrentJobs = [];

            for (const currentJob of dto.candidateCurrentJobs) {
                const currentJobToCreate = new CandidateCurrentJob();
                currentJobToCreate.fromDto(currentJob);
                this.candidateCurrentJobs.push(currentJobToCreate);
            }
        }

        if (!this.id) {
            this.id = undefined;
        }
    }

    private capitalize = (value: string) => {
        if (!value) {
            return value;
        }

        value = value.toLowerCase();

        return value.charAt(0).toUpperCase() + value.slice(1);
    };
}
