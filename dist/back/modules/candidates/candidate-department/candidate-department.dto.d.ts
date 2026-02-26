import { BaseDto } from '../../../models/dto/base.dto';
import { CandidateApplicationDto } from '../../candidates-application/candidate-application-dto';
import { CandidateDto } from '../candidate-dto';
export declare class CandidateDepartmentDto extends BaseDto {
    candidateId?: string;
    candidate?: CandidateDto;
    candidateApplicationId?: string;
    candidateApplication?: CandidateApplicationDto;
    department: string;
}
