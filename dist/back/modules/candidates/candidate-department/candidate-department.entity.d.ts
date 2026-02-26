import { AppBaseEntity } from '../../../entities/base-entity';
import { CandidateApplication } from '../../candidates-application/candidate-application.entity';
import { Newsletter } from '../../newsletter/newsletter.entity';
import { Candidate } from '../candidate.entity';
import { CandidateDepartmentDto } from './candidate-department.dto';
export declare class CandidateDepartment extends AppBaseEntity {
    candidateId?: string;
    candidate?: Candidate;
    candidateApplicationId?: string;
    candidateApplication?: CandidateApplication;
    department: string;
    newsletterId?: string;
    newsletter?: Newsletter;
    toDto(): CandidateDepartmentDto;
    fromDto(dto: CandidateDepartmentDto): void;
}
