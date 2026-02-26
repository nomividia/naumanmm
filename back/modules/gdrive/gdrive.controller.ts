import { Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RolesList } from "../../../shared/shared-constants";
import { Environment } from "../../environment/environment";
import { GenericResponse } from "../../models/responses/generic-response";
import { RolesGuard } from "../../services/guards/roles-guard";
import { Roles } from "../../services/roles.decorator";
import { FileService } from "../../services/tools/file.service";
import { BaseController } from "../../shared/base.controller";
import { GetGDriveFilesResponse } from "./gdrive-responses";
import { GDriveService } from "./gdrive.service";
import { GCloudStorageService } from "./gcloud-storage-service";
import { MainHelpers } from "nextalys-js-helpers";
import { FastifyReply } from "fastify";

@Controller('gdrive')
@ApiTags('gdrive')
export class GDriveController extends BaseController {
    constructor(
        private gDriveService: GDriveService,
        private fileService: FileService,
        private gCloudStorageService: GCloudStorageService,

    ) {
        super();
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.AdminTech, RolesList.Admin)
    @Get('getGDriveFilesInFolder/:folderId/:pageSize')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'get all gdrive files in folder', operationId: 'getGDriveFilesInFolder' })
    @ApiResponse({ status: 200, description: 'GetGDriveFilesResponse', type: GetGDriveFilesResponse })
    @HttpCode(200)
    async getGDriveFilesInFolder(@Param('folderId') folderId: string, @Param('pageSize') pageSize: number): Promise<GetGDriveFilesResponse> {
        return await this.gDriveService.getFilesInFolder(folderId, pageSize);
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.AdminTech, RolesList.Admin)
    @Get('downloadGDriveFile/:fileId')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'download gdrive file', operationId: 'downloadGDriveFile' })
    @ApiResponse({ status: 200, description: 'file Response', type: GenericResponse })
    @HttpCode(200)
    async downloadGDriveFile(@Res() response: FastifyReply, @Param('fileId') fileId: string, @Query('returnBlob') returnBlob?: 'true' | 'false'): Promise<GenericResponse> {
        const downloadResponse = await this.gDriveService.downloadFile(fileId, fileId, returnBlob !== 'true' ? Environment.PublicFolder : Environment.UploadedFilesTempDirectory);
        if (returnBlob !== 'true') {
            response.status(HttpStatus.OK).send(downloadResponse);
            return;
        }
        await this.fileService.serveFileFromApi(response, downloadResponse.targetFullPath, downloadResponse.mimeType, 'attachment');
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.AdminTech, RolesList.Admin, RolesList.Candidate, RolesList.RH, RolesList.Consultant)
    @Get('downloadGloudStorageFile/:fileId')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'download gcloud storage file', operationId: 'downloadGloudStorageFile' })
    @ApiResponse({ status: 200, description: 'file Response', type: GenericResponse })
    @HttpCode(200)
    async downloadGloudStorageFile(@Res() response: FastifyReply, @Param('fileId') fileId: string, @Query('returnBlob') returnBlob?: 'true' | 'false'): Promise<GenericResponse> {
        let targetPath = returnBlob !== 'true' ? Environment.PublicFolder : Environment.UploadedFilesTempDirectory;
        if (!fileId) {
            this.sendResponseInternalServerError(response, 'Invalid args !', true);
            return;
        }
        const fileResponse = await this.fileService.findOne({ where: { id: fileId } });
        if (!fileResponse?.success) {
            this.sendResponseInternalServerError(response, fileResponse?.message, true);
            return;
        }
        if (!fileResponse?.file) {
            this.sendResponseNotFound(response, null, true);
            return;
        }
        if (!fileResponse.file.externalFilePath) {
            this.sendResponseNotFound(response, 'This file has not been uploaded to GCloud !', true);
            return;
        }
        targetPath = this.fileService.joinPaths(targetPath, MainHelpers.generateGuid());
        const downloadResponse = await this.gCloudStorageService.downloadFile(fileResponse.file.externalFilePath, targetPath);
        if (returnBlob !== 'true') {
            this.sendResponseOk(response, downloadResponse, true);
            return;
        }
        const fileMetaResponse = await this.gCloudStorageService.getFileMeta(fileResponse.file.externalFilePath);
        if (!fileMetaResponse?.success) {
            this.sendResponseInternalServerError(response, fileMetaResponse.message, true);
            return;
        }
        await this.fileService.serveFileFromApi(response, targetPath, fileMetaResponse.fileMeta.contentType, 'attachment');
    }


    @UseGuards(RolesGuard)
    @Roles(RolesList.AdminTech)
    @Post('deleteGDriveFile/:fileId')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'delete gdrive file', operationId: 'deleteGDriveFile' })
    @ApiResponse({ status: 200, description: 'GenericResponse', type: GenericResponse })
    @HttpCode(200)
    async deleteGDriveFile(@Param('fileId') fileId: string): Promise<GenericResponse> {
        return await this.gDriveService.deleteFile(fileId);
    }
}