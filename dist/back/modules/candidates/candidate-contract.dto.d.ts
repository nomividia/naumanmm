import { AppValueDto } from '../../models/dto/app-value-dto';
import { CandidateDto } from './candidate-dto';
export declare class CandidateContractDto {
    id?: string;
    creationDate?: Date;
    modifDate?: Date;
    candidateId?: string;
    candidate?: CandidateDto;
    contractType?: AppValueDto;
    contractTypeId?: string;
}
