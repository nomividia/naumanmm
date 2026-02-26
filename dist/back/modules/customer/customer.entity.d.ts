import { Address } from '../../entities/address.entity';
import { AppValue } from '../../entities/app-value.entity';
import { AppBaseEntity } from '../../entities/base-entity';
import { CustomerDto } from './customer.dto';
export declare class Customer extends AppBaseEntity {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    addresses?: Address[];
    dateOfContact?: Date;
    isPrivatePerson: boolean;
    isCompany: boolean;
    companyName?: string;
    customerFunctionId?: string;
    customerFunction?: AppValue;
    contactFullName?: string;
    toDto(): CustomerDto;
    fromDto(dto: CustomerDto): void;
}
