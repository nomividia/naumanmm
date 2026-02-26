import {
    Column,
    Entity,
    Generated,
    JoinColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { Address } from '../../entities/address.entity';
import { AppFile } from '../../entities/app-file.entity';
import { AppValue } from '../../entities/app-value.entity';
import { AppBaseEntity } from '../../entities/base-entity';
import { AnonymousExchange } from '../anonymous-exchange/anonymous-exchange.entity';
import { CandidateApplicationJobs } from '../candidate-application-jobs/candidates-application-jobs.entity';
import { CandidateCountry } from '../candidates/candidate-country/candidate-country.entity';
import { CandidateDepartment } from '../candidates/candidate-department/candidate-department.entity';
import { Candidate } from '../candidates/candidate.entity';
import { CandidateApplicationDto } from './candidate-application-dto';

@Entity({ name: 'candidate-applications' })
export class CandidateApplication extends AppBaseEntity {
    @Column('varchar', { name: 'firstName', nullable: true, length: 60 })
    firstName: string;

    @Column('varchar', { name: 'lastName', nullable: true, length: 60 })
    lastName: string;

    @Column('varchar', { name: 'genderId', nullable: true, length: 36 })
    genderId: string;

    @ManyToOne(() => AppValue)
    @JoinColumn({ name: 'genderId' })
    gender?: AppValue;

    @Column('date', { name: 'birthDate', nullable: true })
    birthDate: Date;

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

    @Column('varchar', { name: 'partnerPhone', nullable: true, length: 255 })
    partnerPhone?: string;

    @Column('varchar', { name: 'professionId', nullable: true, length: 36 })
    professionId: string;

    @ManyToOne(() => AppValue)
    @JoinColumn({ name: 'professionId' })
    profession?: AppValue;

    @OneToMany(() => Address, (address) => address.candidateApplication, {
        cascade: true,
    })
    addresses?: Address[];

    @Column('varchar', { name: 'phone', nullable: true, length: 30 })
    phone: string;

    @Column('varchar', { name: 'phoneSecondary', nullable: true, length: 30 })
    phoneSecondary: string;

    @Column('varchar', { name: 'email', length: 255, nullable: true })
    email: string;

    @Column('text', { name: 'skills', nullable: true })
    skills: string;

    @Column('varchar', {
        name: 'relationshipStatusId',
        nullable: true,
        length: 36,
    })
    relationshipStatusId: string;

    @ManyToOne(() => AppValue)
    @JoinColumn({ name: 'relationshipStatusId' })
    relationshipStatus?: AppValue;

    @Column('varchar', { name: 'applyStatusId', nullable: true, length: 36 })
    applyStatusId: string;

    @ManyToOne(() => AppValue)
    @JoinColumn({ name: 'applyStatusId' })
    applyStatus?: AppValue;

    @Column('varchar', { name: 'photoFileId', nullable: true, length: 36 })
    photoFileId?: string;

    @ManyToOne(() => AppFile, { cascade: true })
    @JoinColumn({ name: 'photoFileId' })
    photoFile?: AppFile;

    @Column('varchar', { name: 'mainResumeFileId', nullable: true, length: 36 })
    mainResumeFileId?: string;

    @ManyToOne(() => AppFile, { cascade: true })
    @JoinColumn({ name: 'mainResumeFileId' })
    mainResumeFile?: AppFile;

    @Column('varchar', {
        name: 'partnerResumeFileId',
        nullable: true,
        length: 36,
    })
    partnerResumeFileId?: string;

    @ManyToOne(() => AppFile, { cascade: true })
    @JoinColumn({ name: 'partnerResumeFileId' })
    partnerResumeFile?: AppFile;

    @Column('boolean', { name: 'inCouple', nullable: false, default: 0 })
    inCouple: boolean;

    @Column('boolean', {
        name: 'spontaneousApplication',
        nullable: false,
        default: 0,
    })
    spontaneousApplication: boolean;

    @Column('varchar', { name: 'candidateId', nullable: true, length: 36 })
    candidateId?: string;

    @ManyToOne(
        () => Candidate,
        (candidate) => candidate.candidateApplications,
        { onDelete: 'SET NULL' },
    )
    @JoinColumn({ name: 'candidateId' })
    candidate?: Candidate;

    @Column('boolean', { name: 'seen', nullable: false, default: 0 })
    seen?: boolean;

    @OneToMany(
        () => CandidateApplicationJobs,
        (candidateApplicationJobs) =>
            candidateApplicationJobs.candidateApplication,
        { cascade: true },
    )
    candidateApplicationJobs?: CandidateApplicationJobs[];

    @Column('text', { name: 'jobOfferLinkedRef', nullable: true })
    jobOfferLinkedRef?: string;

    @Column('boolean', {
        name: 'linkedToCandidate',
        nullable: false,
        default: false,
    })
    linkedToCandidate?: boolean;

    @Column('varchar', { name: 'guidExchange', nullable: true, unique: true })
    guidExchange?: string;

    @OneToMany(
        () => AnonymousExchange,
        (exchange) => exchange.candidateApplication,
        { cascade: true, onUpdate: 'CASCADE' },
    )
    public anonymousExchanges: AnonymousExchange[];

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

    @OneToMany(
        () => CandidateDepartment,
        (candidateDepartment) => candidateDepartment.candidateApplication,
        { cascade: true },
    )
    candidateDepartments?: CandidateDepartment[];

    @OneToMany(
        () => CandidateCountry,
        (candidateCountries) => candidateCountries.candidateApplication,
        { cascade: true },
    )
    candidateCountries?: CandidateCountry[];

    @Column('boolean', { name: 'allowed_to_work_us', nullable: true })
    allowed_to_work_us?: boolean;

    @Column('boolean', { name: 'require_sponsorship_us', nullable: true })
    require_sponsorship_us?: boolean;

    @Column('datetime', { name: 'usTermsAcceptedAt', nullable: true })
    usTermsAcceptedAt?: Date;

    @Column('varchar', { name: 'usTermsVersion', nullable: true, length: 20 })
    usTermsVersion?: string;

    // @Column('datetime', { name: 'lastCandidateMessageSendedDate', nullable: true })
    // lastCandidateMessageSendedDate: Date;

    public toDto(): CandidateApplicationDto {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            genderId: this.genderId,
            gender: this.gender?.toDto(),
            birthDate: this.birthDate,
            partnerFirstName: this.partnerFirstName,
            partnerLastName: this.partnerLastName,
            partnerGenderId: this.partnerGenderId,
            partnerGender: this.partnerGender?.toDto(),
            partnerBirthDate: this.partnerBirthDate,
            professionId: this.professionId,
            profession: this.profession?.toDto(),
            relationshipStatusId: this.relationshipStatusId,
            relationshipStatus: this.relationshipStatus?.toDto(),
            phone: this.phone,
            email: this.email,
            skills: this.skills,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            applyStatusId: this.applyStatusId,
            applyStatus: this.applyStatus?.toDto(),
            inCouple: this.inCouple,
            phoneSecondary: this.phoneSecondary,
            address: !!this.addresses ? this.addresses?.[0] : undefined,
            spontaneousApplication: this.spontaneousApplication,
            candidateId: this.candidateId,
            photoFile: this.photoFile ? this.photoFile.toDto() : undefined,
            photoFileId: this.photoFileId,
            mainResumeFile: this.mainResumeFile
                ? this.mainResumeFile.toDto()
                : undefined,
            mainResumeFileId: this.mainResumeFileId,
            partnerResumeFile: this.partnerResumeFile
                ? this.partnerResumeFile.toDto()
                : undefined,
            partnerResumeFileId: this.partnerResumeFileId,
            seen: this.seen,
            candidateApplicationJobs: this.candidateApplicationJobs
                ? this.candidateApplicationJobs.map((x) => x.toDto())
                : undefined,
            disabled: this.disabled,
            jobOfferLinkedRef: this.jobOfferLinkedRef,
            linkedToCandidate: !!this.linkedToCandidate,
            candidate: this.candidate ? this.candidate.toDto() : null,
            guidExchange: this.guidExchange,
            // lastCandidateMessageSendedDate: this.lastCandidateMessageSendedDate,
            anonymousExchanges: this.anonymousExchanges
                ? this.anonymousExchanges.map((x) => x.toDto())
                : undefined,
            newsletterUnsubscribed: this.newsletterUnsubscribed,
            newsletterUnsubscribedGuid: this.newsletterUnsubscribedGuid,
            candidateDepartments: this.candidateDepartments
                ? this.candidateDepartments.map((x) => x.toDto())
                : undefined,
            partnerEmail: this.partnerEmail,
            partnerPhone: this.partnerPhone,
            candidateCountries: this.candidateCountries
                ? this.candidateCountries.map((x) => x.toDto())
                : undefined,
            allowed_to_work_us: this.allowed_to_work_us,
            require_sponsorship_us: this.require_sponsorship_us,
            usTermsAcceptedAt: this.usTermsAcceptedAt,
            usTermsVersion: this.usTermsVersion,
        };
    }

    public fromDto(dto: CandidateApplicationDto) {
        this.id = dto.id;
        this.linkedToCandidate = !!dto.linkedToCandidate;
        this.firstName = dto.firstName;
        this.lastName = dto.lastName;
        this.genderId = dto.genderId;
        this.birthDate = dto.birthDate;
        this.partnerFirstName = dto.partnerFirstName;
        this.partnerLastName = dto.partnerLastName;
        this.partnerBirthDate = dto.partnerBirthDate;
        this.partnerGenderId = dto.partnerGenderId;
        this.professionId = dto.professionId;
        this.relationshipStatusId = dto.relationshipStatusId;
        this.phone = dto.phone;
        this.email = dto.email;
        this.skills = dto.skills;
        this.applyStatusId = dto.applyStatusId;
        this.inCouple = dto.inCouple;
        this.phoneSecondary = dto.phoneSecondary;
        this.spontaneousApplication = dto.spontaneousApplication;
        this.candidateId = dto.candidateId;
        this.mainResumeFileId = dto.mainResumeFileId;
        this.photoFileId = dto.photoFileId;
        this.partnerResumeFileId = dto.partnerResumeFileId;
        this.seen = dto.seen;
        this.disabled = dto.disabled;
        this.creationDate = dto.creationDate;
        this.jobOfferLinkedRef = dto.jobOfferLinkedRef;
        this.guidExchange = dto.guidExchange;
        this.partnerEmail = dto.partnerEmail;
        this.partnerPhone = dto.partnerPhone;

        this.allowed_to_work_us = dto.allowed_to_work_us;
        this.require_sponsorship_us = dto.require_sponsorship_us;
        this.usTermsAcceptedAt = dto.usTermsAcceptedAt;
        this.usTermsVersion = dto.usTermsVersion;

        // this.lastCandidateMessageSendedDate = dto.lastCandidateMessageSendedDate;

        if (dto.photoFile) {
            const appFile = new AppFile();
            appFile.fromDto(dto.photoFile);
            this.photoFile = appFile;
        }

        if (dto.mainResumeFile) {
            const appFile = new AppFile();
            appFile.fromDto(dto.mainResumeFile);
            this.mainResumeFile = appFile;
        }

        if (dto.partnerResumeFile) {
            const appFile = new AppFile();
            appFile.fromDto(dto.partnerResumeFile);
            this.partnerResumeFile = appFile;
        }

        // console.log("🚀 ~ file: candidate-application.entity.ts ~ line 130 ~ CandidateApplication ~ fromDto ~ dto.address", this.address)
        if (dto.address) {
            this.addresses = [];
            const address = new Address();
            address.fromDto(dto.address);
            this.addresses.push(address);
        }

        if (dto.candidateApplicationJobs) {
            this.candidateApplicationJobs = [];
            dto.candidateApplicationJobs.forEach(
                (candidateApplicationJobsDto) => {
                    const candidateApplicationJobs =
                        new CandidateApplicationJobs();
                    candidateApplicationJobs.fromDto(
                        candidateApplicationJobsDto,
                    );
                    this.candidateApplicationJobs.push(
                        candidateApplicationJobs,
                    );
                },
            );
        }

        if (dto.anonymousExchanges) {
            this.anonymousExchanges = [];
            dto.anonymousExchanges.forEach((anonymousExchangesDto) => {
                const anonymousExchanges = new AnonymousExchange();
                anonymousExchanges.fromDto(anonymousExchangesDto);
                this.anonymousExchanges.push(anonymousExchanges);
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

        if (dto.candidateCountries) {
            this.candidateCountries =
                dto.candidateCountries.map<CandidateCountry>((x) => {
                    const candidateCountry = new CandidateCountry();
                    candidateCountry.fromDto(x);
                    return candidateCountry;
                });
        }

        if (!this.id) {
            this.id = undefined;
        }
    }
}
