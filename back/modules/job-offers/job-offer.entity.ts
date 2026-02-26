import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AppValue } from '../../entities/app-value.entity';
import { AppBaseEntity } from '../../entities/base-entity';
import { User } from '../../entities/user.entity';
import { CandidateApplicationJobs } from '../candidate-application-jobs/candidates-application-jobs.entity';
import { Customer } from '../customer/customer.entity';
import { JobOfferDto } from './job-offer-dto';

@Entity({ name: 'job-offers' })
export class JobOffer extends AppBaseEntity {
    @Column('varchar', { name: 'title', nullable: false })
    title: string;

    @Column('varchar', {
        name: 'ref',
        unique: true,
        nullable: false,
        length: 50,
    })
    ref: string;

    @Column('text', { name: 'jobDescription', nullable: false })
    jobDescription: string;

    @Column('varchar', { name: 'city', nullable: true })
    city?: string;

    @Column('varchar', { name: 'country', nullable: true })
    country?: string;

    @Column('varchar', { name: 'countryCode', nullable: true })
    countryCode?: string;

    @Column('varchar', { name: 'consultantId', nullable: true, length: 36 })
    consultantId?: string;

    @ManyToOne(() => User, { cascade: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'consultantId' })
    consultant?: User;

    @Column('text', { name: 'salary', nullable: true })
    salary?: string;

    @Column('text', { name: 'publicLink', nullable: true })
    publicLink?: string;

    @Column('varchar', { name: 'jobId', nullable: true, length: 36 })
    jobId: string;

    @ManyToOne(() => AppValue)
    @JoinColumn({ name: 'jobId' })
    job?: AppValue;

    @Column('text', { name: 'taskResponsabilitiesDescription', nullable: true })
    taskResponsabilitiesDescription: string;

    @Column('text', { name: 'candidateProfileDescription', nullable: true })
    candidateProfileDescription: string;

    @Column('text', { name: 'conditionsDescription', nullable: true })
    conditionsDescription: string;

    @Column('boolean', { name: 'applyInCouple', nullable: true, default: 0 })
    applyInCouple: boolean;

    @Column('varchar', { name: 'contractTypeId', nullable: true, length: 36 })
    contractTypeId: string;

    @ManyToOne(() => AppValue)
    @JoinColumn({ name: 'contractTypeId' })
    contractType?: AppValue;

    @OneToMany(
        () => CandidateApplicationJobs,
        (candidateApplicationJobs) => candidateApplicationJobs.jobOffer,
    )
    candidateApplicationJobs?: CandidateApplicationJobs[];

    @Column('varchar', { name: 'customerId', nullable: true, length: 36 })
    customerId?: string;

    @ManyToOne(() => Customer, { cascade: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'customerId' })
    customer?: Customer;

    @Column('varchar', { name: 'stateId', nullable: true, length: 36 })
    stateId?: string;

    @ManyToOne(() => AppValue)
    @JoinColumn({ name: 'stateId' })
    state?: AppValue;

    public toDto(): JobOfferDto {
        return {
            id: this.id,
            title: this.title,
            jobDescription: this.jobDescription,
            ref: this.ref,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            city: this.city,
            country: this.country,
            countryCode: this.countryCode,
            consultantId: this.consultantId,
            consultant: this.consultant?.toDto(),
            salary: this.salary,
            publicLink: this.publicLink,
            jobId: this.jobId,
            job: this.job?.toDto(),
            taskResponsabilitiesDescription:
                this.taskResponsabilitiesDescription,
            candidateProfileDescription: this.candidateProfileDescription,
            conditionsDescription: this.conditionsDescription,
            applyInCouple: this.applyInCouple,
            contractTypeId: this.contractTypeId,
            contractType: this.contractType?.toDto(),
            candidateApplicationJobs: this.candidateApplicationJobs
                ? this.candidateApplicationJobs.map((x) => x.toDto())
                : [],
            disabled: this.disabled,
            customerId: this.customerId,
            customer: this.customer?.toDto(),
            stateId: this.stateId,
            state: this.state ? this.state.toDto() : undefined,
        };
    }

    public fromDto(dto: JobOfferDto) {
        this.id = dto.id;
        this.title = dto.title;
        this.jobDescription = dto.jobDescription;
        this.ref = dto.ref;
        this.city = dto.city;
        this.country = dto.country;
        this.countryCode = dto.countryCode;
        this.consultantId = dto.consultantId;
        this.salary = dto.salary;
        this.publicLink = dto.publicLink;
        this.jobId = dto.jobId;
        this.taskResponsabilitiesDescription =
            dto.taskResponsabilitiesDescription;
        this.candidateProfileDescription = dto.candidateProfileDescription;
        this.conditionsDescription = dto.conditionsDescription;
        this.applyInCouple = dto.applyInCouple;
        this.contractTypeId = dto.contractTypeId;
        this.disabled = dto.disabled;
        this.customerId = dto.customerId;
        this.stateId = dto.stateId;

        if (!this.id) {
            this.id = undefined;
        }
    }
}
