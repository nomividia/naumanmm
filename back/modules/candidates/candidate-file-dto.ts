import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppFileDto } from '../../models/dto/app-file-dto';
import { AppValueDto } from '../../models/dto/app-value-dto';
import { BaseSearchResponse } from '../../models/responses/base-search-responses';
import { GenericResponse } from '../../models/responses/generic-response';
import { CandidateDto } from './candidate-dto';

export class CandidateFileDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    public creationDate?: Date;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    public modifDate?: Date;

    @ApiPropertyOptional()
    fileId?: string;

    @ApiPropertyOptional({ type: () => AppFileDto })
    file?: AppFileDto;

    @ApiPropertyOptional()
    candidateId: string;

    @ApiPropertyOptional({ type: () => CandidateDto })
    candidate?: CandidateDto;

    @ApiPropertyOptional({ type: AppValueDto })
    fileType?: AppValueDto;

    @ApiPropertyOptional({ type: String })
    fileTypeId?: string;

    @ApiPropertyOptional()
    isMandatory?: boolean;
}

export class GetCandidateFileResponse extends GenericResponse {
    @ApiProperty({ type: () => CandidateDto })
    candidateFile: CandidateFileDto;
}

export class GetCandidatesFilesResponse extends BaseSearchResponse {
    @ApiProperty({ type: () => CandidateFileDto, isArray: true })
    candidatesFiles: CandidateFileDto[] = [];
}
