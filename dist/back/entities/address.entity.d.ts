import { AddressDto } from '../models/dto/address-dto';
import { CandidateApplication } from '../modules/candidates-application/candidate-application.entity';
import { Candidate } from '../modules/candidates/candidate.entity';
import { Customer } from '../modules/customer/customer.entity';
import { JobReference } from '../modules/job-references/job-reference.entity';
import { AppBaseEntity } from './base-entity';
export declare class Address extends AppBaseEntity {
    lineOne: string;
    label?: string;
    lineTwo?: string;
    department?: string;
    postalCode: string;
    country?: string;
    city: string;
    candidateId: string;
    customerId: string;
    candidate?: Candidate;
    customer?: Customer;
    candidateApplicationId: string;
    candidateApplication?: CandidateApplication;
    jobReferenceId?: string;
    jobReference?: JobReference;
    toDto(): AddressDto;
    fromDto(dto: AddressDto): void;
}
