import { ApiProperty } from '@nestjs/swagger';
import { AppFileDto } from '../dto/app-file-dto';
import { BaseSearchResponse } from './base-search-responses';
import { GenericResponse } from './generic-response';

export class GetFileResponse extends GenericResponse {
    @ApiProperty()
    file: AppFileDto = null;
}

export class GetFilesResponse extends BaseSearchResponse {
    @ApiProperty({ type: () => AppFileDto, isArray: true })
    files: AppFileDto[] = [];
}
