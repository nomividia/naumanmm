import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Address } from '../../entities/address.entity';
import { AppValue } from '../../entities/app-value.entity';
import { AppBaseEntity } from '../../entities/base-entity';
import { CandidateJob } from '../candidates/candidate-jobs.entity';
import { JobReferenceDto } from './job-reference-dto';

@Entity({ name: 'job-references' })
export class JobReference extends AppBaseEntity {
    @Column('varchar', { name: 'email', length: 80, nullable: true })
    email?: string;

    @Column('varchar', { name: 'phone', length: 50, nullable: true })
    phone?: string;

    @OneToMany(() => Address, (address) => address.jobReference, {
        cascade: true,
    })
    addresses?: Address[];

    @Column('varchar', { name: 'jobRefFunctionId', nullable: true, length: 36 })
    jobRefFunctionId: string;

    @ManyToOne(() => AppValue)
    @JoinColumn({ name: 'jobRefFunctionId' })
    jobRefFunction?: AppValue;

    @Column('varchar', { name: 'otherFunction', length: 50, nullable: true })
    otherFunction?: string;

    @Column('bool', { name: 'candidateAcceptContact', default: false })
    candidateAcceptContact: boolean;

    @OneToMany(
        () => CandidateJob,
        (candidateJobs) => candidateJobs.jobReference,
    )
    candidateJobs?: CandidateJob[];

    @Column('bool', {
        name: 'isPrivatePerson',
        nullable: false,
        default: false,
    })
    isPrivatePerson: boolean;

    @Column('bool', { name: 'isCompany', nullable: false, default: true })
    isCompany: boolean;

    @Column('varchar', {
        name: 'privatePersonFirstName',
        length: 50,
        nullable: true,
    })
    privatePersonFirstName?: string;

    @Column('varchar', {
        name: 'privatePersonLastName',
        length: 50,
        nullable: true,
    })
    privatePersonLastName?: string;

    @Column('varchar', { name: 'companyName', length: 200, nullable: true })
    companyName?: string;

    @Column('text', { name: 'note', nullable: true })
    note?: string;

    @Column('bool', {
        name: 'customerHasBeenCreated',
        nullable: false,
        default: false,
    })
    customerHasBeenCreated: boolean;

    @Column('varchar', { name: 'contactFullName', length: 50, nullable: true })
    contactFullName?: string;

    public toDto(): JobReferenceDto {
        return {
            id: this.id,
            email: this.email,
            phone: this.phone,
            addresses: this.addresses
                ? this.addresses.map((x) => x.toDto())
                : undefined,
            jobRefFunctionId: this.jobRefFunctionId,
            jobRefFunction: this.jobRefFunction
                ? this.jobRefFunction.toDto()
                : undefined,
            otherFunction: this.otherFunction,
            candidateAcceptContact: this.candidateAcceptContact,
            isCompany: this.isCompany,
            isPrivatePerson: this.isPrivatePerson,
            companyName: this.companyName,
            privatePersonFirstName: this.privatePersonFirstName,
            privatePersonLastName: this.privatePersonLastName,
            note: this.note,
            disabled: this.disabled,
            customerHasBeenCreated: this.customerHasBeenCreated,
            contactFullName: this.contactFullName,
        };
    }

    fromDto(dto: JobReferenceDto) {
        this.id = dto.id;
        this.email = dto.email;
        this.phone = dto.phone;
        this.jobRefFunctionId = dto.jobRefFunctionId;
        this.otherFunction = dto.otherFunction;
        this.candidateAcceptContact = dto.candidateAcceptContact;
        this.isCompany = dto.isCompany;
        this.isPrivatePerson = dto.isPrivatePerson;
        this.privatePersonFirstName = dto.privatePersonFirstName;
        this.privatePersonLastName = dto.privatePersonLastName;
        this.companyName = dto.companyName;
        this.note = dto.note;
        this.disabled = dto.disabled;
        this.customerHasBeenCreated = dto.customerHasBeenCreated;
        this.contactFullName = dto.contactFullName;

        if (dto.addresses) {
            this.addresses = [];
            for (const address of dto.addresses) {
                const addrEntity = new Address();
                addrEntity.fromDto(address);
                this.addresses.push(addrEntity);
            }
        }

        if (!this.id) {
            this.id = undefined;
        }
    }
}
