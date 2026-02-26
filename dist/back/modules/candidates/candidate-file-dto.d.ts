import { AppFileDto } from '../../models/dto/app-file-dto';
import { AppValueDto } from '../../models/dto/app-value-dto';
import { BaseSearchResponse } from '../../models/responses/base-search-responses';
import { GenericResponse } from '../../models/responses/generic-response';
import { CandidateDto } from './candidate-dto';
export declare class CandidateFileDto {
    id?: string;
    creationDate?: Date;
    modifDate?: Date;
    fileId?: string;
    file?: AppFileDto;
    candidateId: string;
    candidate?: CandidateDto;
    fileType?: AppValueDto;
    fileTypeId?: string;
    isMandatory?: boolean;
}
export declare class GetCandidateFileResponse extends GenericResponse {
    candidateFile: CandidateFileDto;
}
export declare class GetCandidatesFilesResponse extends BaseSearchResponse {
    candidatesFiles: CandidateFileDto[];
}
