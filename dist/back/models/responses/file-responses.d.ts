import { AppFileDto } from '../dto/app-file-dto';
import { BaseSearchResponse } from './base-search-responses';
import { GenericResponse } from './generic-response';
export declare class GetFileResponse extends GenericResponse {
    file: AppFileDto;
}
export declare class GetFilesResponse extends BaseSearchResponse {
    files: AppFileDto[];
}
