import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AddressDto } from '../models/dto/address-dto';
import { CandidateApplication } from '../modules/candidates-application/candidate-application.entity';
import { Candidate } from '../modules/candidates/candidate.entity';
import { Customer } from '../modules/customer/customer.entity';
import { JobReference } from '../modules/job-references/job-reference.entity';
import { AppBaseEntity } from './base-entity';

@Entity('address')
export class Address extends AppBaseEntity {
    @Column('text', { name: 'line1', nullable: true })
    lineOne: string;

    @Column('text', { name: 'label', nullable: true })
    label?: string;

    @Column('text', { name: 'line2', nullable: true })
    lineTwo?: string;

    @Column('varchar', { name: 'department', nullable: true, length: 50 })
    department?: string;

    @Column('varchar', { name: 'postalCode', nullable: true, length: 10 })
    postalCode: string;

    /**
     * country code ISO 2
     */
    @Column('varchar', { name: 'country', nullable: true, length: 100 })
    country?: string;

    @Column('varchar', { name: 'city', nullable: true, length: 100 })
    city: string;

    @Column('varchar', { name: 'candidateId', nullable: true })
    candidateId: string;

    @Column('varchar', { name: 'customerId', nullable: true })
    customerId: string;

    @ManyToOne(() => Candidate, (candidate) => candidate.addresses, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'candidateId' })
    candidate?: Candidate;

    @ManyToOne(() => Customer, (customer) => customer.addresses, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'customerId' })
    customer?: Customer;

    @Column('varchar', { name: 'candidateApplicationId', nullable: true })
    candidateApplicationId: string;

    @ManyToOne(
        () => CandidateApplication,
        (candidateApplication) => candidateApplication.addresses,
        { onDelete: 'CASCADE' },
    )
    @JoinColumn({ name: 'candidateApplicationId' })
    candidateApplication?: CandidateApplication;

    @Column('varchar', { name: 'jobReferenceId', nullable: true, length: 36 })
    jobReferenceId?: string;

    @ManyToOne(() => JobReference, (jobReference) => jobReference.addresses, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'jobReferenceId' })
    jobReference?: JobReference;

    toDto(): AddressDto {
        return {
            id: this.id,
            lineOne: this.lineOne,
            lineTwo: this.lineTwo,
            postalCode: this.postalCode,
            department: this.department,
            city: this.city,
            country: this.country,
            candidateId: this.candidateId,
            customerId: this.customerId,
            label: this.label,
            candidateApplicationId: this.candidateApplicationId,
            jobReferenceId: this.jobReferenceId,
        };
    }

    fromDto(dto: AddressDto) {
        this.id = dto.id;
        this.lineOne = dto.lineOne;
        this.lineTwo = dto.lineTwo;
        this.department = dto.department;
        this.postalCode = dto.postalCode;
        this.city = dto.city;
        this.country = dto.country;
        this.candidateId = dto.candidateId;
        this.label = dto.label;
        this.customerId = dto.customerId;
        this.candidateApplicationId = dto.candidateApplicationId;
        this.jobReferenceId = dto.jobReferenceId;

        if (!dto.id) this.id = undefined;
    }
}
