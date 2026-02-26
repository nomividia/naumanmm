import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Address } from '../../entities/address.entity';
import { AppValue } from '../../entities/app-value.entity';
import { AppBaseEntity } from '../../entities/base-entity';
import { CustomerDto } from './customer.dto';

@Entity({ name: 'customer' })
export class Customer extends AppBaseEntity {
    @Column('varchar', { name: 'firstName', length: 40, nullable: true })
    firstName?: string;

    @Column('varchar', { name: 'lastName', length: 40, nullable: true })
    lastName?: string;

    @Column('varchar', { name: 'email', length: 40, nullable: true })
    email?: string;

    @Column('varchar', { name: 'phone', length: 40, nullable: true })
    phone?: string;

    @OneToMany(() => Address, (addresses) => addresses.customer, {
        cascade: true,
    })
    addresses?: Address[];

    @Column({ name: 'dateOfContact', nullable: true, type: 'datetime' })
    dateOfContact?: Date;

    @Column('bool', {
        name: 'isPrivatePerson',
        nullable: false,
        default: false,
    })
    isPrivatePerson: boolean;

    @Column('bool', { name: 'isCompany', nullable: false, default: true })
    isCompany: boolean;

    @Column('varchar', { name: 'companyName', length: 200, nullable: true })
    companyName?: string;

    @Column('varchar', {
        name: 'customerFunctionId',
        length: 50,
        nullable: true,
    })
    customerFunctionId?: string;

    @ManyToOne(() => AppValue)
    @JoinColumn({ name: 'customerFunctionId' })
    customerFunction?: AppValue;

    @Column('varchar', { name: 'contactFullName', length: 100, nullable: true })
    contactFullName?: string;

    toDto(): CustomerDto {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            addresses: this.addresses
                ? this.addresses.map((x) => x.toDto())
                : undefined,
            creationDate: this.creationDate,
            modifDate: this.modifDate,
            phone: this.phone,
            dateOfContact: this.dateOfContact,
            companyName: this.companyName,
            isCompany: this.isCompany,
            isPrivatePerson: this.isPrivatePerson,
            disabled: this.disabled,
            customerFunctionId: this.customerFunctionId,
            contactFullName: this.contactFullName,
            customerFunction: this.customerFunction
                ? this.customerFunction.toDto()
                : undefined,
        };
    }

    fromDto(dto: CustomerDto) {
        this.id = dto.id;
        this.firstName = dto.firstName;
        this.lastName = dto.lastName;
        this.email = dto.email;
        this.phone = dto.phone;
        this.dateOfContact = dto.dateOfContact;
        this.isCompany = dto.isCompany;
        this.isPrivatePerson = dto.isPrivatePerson;
        this.companyName = dto.companyName;
        this.disabled = dto.disabled;
        this.customerFunctionId = dto.customerFunctionId;
        this.contactFullName = dto.contactFullName;

        if (dto.addresses) {
            this.addresses = [];
            for (const address of dto.addresses) {
                const addrEntity = new Address();
                addrEntity.fromDto(address);
                this.addresses.push(addrEntity);
            }
        }

        if (!dto.id) {
            this.id = undefined;
        }
    }
}
