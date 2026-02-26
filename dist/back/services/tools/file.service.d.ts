import { FastifyReply } from 'fastify';
import { Repository } from 'typeorm';
import { AppFile } from '../../entities/app-file.entity';
import { AppFileDto } from '../../models/dto/app-file-dto';
import { GetFileResponse, GetFilesResponse } from '../../models/responses/file-responses';
import { ApplicationBaseModelService } from '../base-model.service';
export declare class FileService extends ApplicationBaseModelService<AppFile, AppFileDto, GetFileResponse, GetFilesResponse> {
    private readonly filesRepository;
    constructor(filesRepository: Repository<AppFile>);
    joinPaths(...paths: string[]): string;
    moveFileDtoFromTemp(fileDto: AppFileDto, newPath: string): Promise<{
        file: AppFileDto;
        success: boolean;
        error?: any;
    }>;
    getTempFilePath(fileDto: AppFileDto): string;
    handleFileUpload(oldEntity: {
        id?: string;
    }, dto: {
        id?: string;
    }, field: string, target: string): Promise<{
        success: boolean;
        error?: any;
    }>;
    deleteFileUpload(entity: {
        id?: string;
    }, field: string, target: string): Promise<void>;
    removeFilesWithoutId(nullsFieldName: string[]): Promise<void>;
    serveFileFromApi(response: FastifyReply, filePath: string, contentType: string, contentDisposition?: 'inline' | 'attachment' | string, ignoreInterceptor?: boolean): Promise<void>;
}
