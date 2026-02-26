import { AppValueDto } from '../../../models/dto/app-value-dto';
import { CandidateDto } from '../candidate-dto';
export declare class CandidateCurrentJobDto {
    id?: string;
    candidateId?: string;
    candidate?: CandidateDto;
    currentJobId?: string;
    currentJob?: AppValueDto;
}
