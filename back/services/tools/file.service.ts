import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FastifyReply } from 'fastify';
import { FileHelpers } from 'nextalys-node-helpers';
import * as path from 'path';
import { Repository } from 'typeorm';
import { AppFile } from '../../entities/app-file.entity';
import { Environment } from '../../environment/environment';
import { AppFileDto } from '../../models/dto/app-file-dto';
import {
    GetFileResponse,
    GetFilesResponse,
} from '../../models/responses/file-responses';
import { ApplicationBaseModelService } from '../base-model.service';

@Injectable()
export class FileService extends ApplicationBaseModelService<
    AppFile,
    AppFileDto,
    GetFileResponse,
    GetFilesResponse
> {
    constructor(
        @InjectRepository(AppFile)
        private readonly filesRepository: Repository<AppFile>,
    ) {
        super();
        this.modelOptions = {
            getManyResponse: GetFilesResponse,
            getOneResponse: GetFileResponse,
            getManyResponseField: 'files',
            getOneResponseField: 'file',
            repository: this.filesRepository,
            entity: AppFile,
            archiveField: 'disabled',
            archiveFieldValue: true,
        };
    }

    joinPaths(...paths: string[]) {
        return path.join(...paths);
    }

    async moveFileDtoFromTemp(fileDto: AppFileDto, newPath: string) {
        const folder = path.join(Environment.UploadedFilesTempDirectory);
        if (!(await FileHelpers.fileExists(folder)))
            await FileHelpers.createDirectory(folder);
        const response = await FileHelpers.renameFile(
            path.join(folder, fileDto.physicalName),
            newPath,
        );
        if (response.success) {
        }
        return { ...response, file: fileDto };
    }

    getTempFilePath(fileDto: AppFileDto) {
        const folder = path.join(Environment.UploadedFilesTempDirectory);
        return path.join(folder, fileDto.physicalName);
    }

    async handleFileUpload(
        oldEntity: { id?: string },
        dto: { id?: string },
        field: string,
        target: string,
    ) {
        try {
            const oldEntityField = (oldEntity as any)[field];
            const newEntityField = (dto as any)[field];
            const oldEntityFieldId = (oldEntity as any)[field + 'Id'];
            let response: { success: boolean; error?: any } = { success: true };
            if (!oldEntityField && newEntityField) {
                // await AppLogger.loggerInstance.log('handleFileUpload - nouveau et pas d\'ancien', field);
                // Si nouveau et pas d'ancien
                if (!(await FileHelpers.fileExists(target)))
                    await FileHelpers.createDirectory(target);
                response = await FileHelpers.renameFile(
                    path.join(
                        Environment.UploadedFilesTempDirectory,
                        newEntityField.physicalName,
                    ),
                    path.join(target, newEntityField.physicalName),
                );
            } else if (
                oldEntityField &&
                newEntityField &&
                oldEntityField.id !== newEntityField.id
            ) {
                // await AppLogger.loggerInstance.log('handleFileUpload - nouveau et ancien et différent', field);
                const newFileOutput = path.join(
                    target,
                    newEntityField.physicalName,
                );
                response = await FileHelpers.renameFile(
                    path.join(
                        Environment.UploadedFilesTempDirectory,
                        newEntityField.physicalName,
                    ),
                    newFileOutput,
                );
                if (oldEntityFieldId)
                    await this.filesRepository.delete(oldEntityFieldId);
                const filePathToRemove = path.join(
                    target,
                    oldEntityField.physicalName,
                );
                // Si nouveau et ancien et différent
                if (
                    filePathToRemove !== newFileOutput &&
                    (await FileHelpers.fileExists(filePathToRemove))
                ) {
                    // await AppLogger.loggerInstance.log('handleFileUpload - nouveau et ancien et différent - REMOVING FILE ' + filePathToRemove, field);
                    await FileHelpers.removeFile(filePathToRemove);
                }
            } else if (oldEntityFieldId && !newEntityField) {
                // await AppLogger.loggerInstance.log('handleFileUpload - ancien et pas nouveau', field);
                // Si ancien et pas nouveau
                const filePathToRemove = path.join(
                    target,
                    oldEntityField.physicalName,
                );
                if (await FileHelpers.fileExists(filePathToRemove))
                    await FileHelpers.removeFile(filePathToRemove);
                await this.filesRepository.delete(oldEntityFieldId);
            } else {
                // await AppLogger.loggerInstance.log('handleFileUpload - other case - ELSE', field);
            }
            return response;
        } catch (err) {
            console.log('🚀 ~ handleFileUpload ~ err', err);
        }
    }

    async deleteFileUpload(
        entity: { id?: string },
        field: string,
        target: string,
    ) {
        const EntityField = (entity as any)[field];
        await FileHelpers.removeFile(
            path.join(target, EntityField.physicalName),
        );
        await this.filesRepository.delete(EntityField);
    }

    async removeFilesWithoutId(nullsFieldName: string[]) {
        const where = {};
        if (!nullsFieldName || !nullsFieldName.length) return;
        nullsFieldName.forEach((fieldName) => {
            where[fieldName] = null;
        });

        const response = await this.filesRepository.find({ where });
        if (response && response.length > 0) {
            for (const file of response) {
                if (
                    file.physicalName &&
                    (await FileHelpers.fileExists(file.physicalName))
                )
                    await FileHelpers.removeFile(file.physicalName);
            }
            await this.filesRepository.delete(response.map((x) => x.id));
        }
    }

    /**
     * @param response express response
     * @param filePath file path
     * @param contentType ex : application/vnd.openxmlformats-officedocument.spreadsheetml.sheet | application/json | application/json | image/jpeg | text/plain | application/octet-stream
     * @param contentDisposition attachment; filename="" | inline | attachment
     */
    async serveFileFromApi(
        response: FastifyReply,
        filePath: string,
        contentType: string,
        contentDisposition?: 'inline' | 'attachment' | string,
        ignoreInterceptor?: boolean,
    ) {
        const fileContent = (await FileHelpers.readFile(
            filePath,
            false,
        )) as Buffer;
        if (ignoreInterceptor) {
            response.header(
                'access-control-expose-headers',
                'nxs-ignore-interceptor',
            );
            response.header('nxs-ignore-interceptor', 'true');
        }
        if (fileContent) {
            response.header('Content-Type', contentType);
            if (contentDisposition)
                response.header('Content-Disposition', contentDisposition);
            response.status(HttpStatus.OK).send(fileContent);
        } else {
            response.status(HttpStatus.NOT_FOUND).send('Fichier introuvable');
        }
    }
}
