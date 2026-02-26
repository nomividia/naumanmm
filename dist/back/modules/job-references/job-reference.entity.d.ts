import { Address } from '../../entities/address.entity';
import { AppValue } from '../../entities/app-value.entity';
import { AppBaseEntity } from '../../entities/base-entity';
import { CandidateJob } from '../candidates/candidate-jobs.entity';
import { JobReferenceDto } from './job-reference-dto';
export declare class JobReference extends AppBaseEntity {
    email?: string;
    phone?: string;
    addresses?: Address[];
    jobRefFunctionId: string;
    jobRefFunction?: AppValue;
    otherFunction?: string;
    candidateAcceptContact: boolean;
    candidateJobs?: CandidateJob[];
    isPrivatePerson: boolean;
    isCompany: boolean;
    privatePersonFirstName?: string;
    privatePersonLastName?: string;
    companyName?: string;
    note?: string;
    customerHasBeenCreated: boolean;
    contactFullName?: string;
    toDto(): JobReferenceDto;
    fromDto(dto: JobReferenceDto): void;
}
