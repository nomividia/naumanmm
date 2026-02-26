import { Injectable } from "@nestjs/common";
import {
    GDriveGetFileOptions, GDriveHelpers, GDriveDeleteFileOptions, GDriveListFilesOptions,
    GDriveFolderOptions, GDriveFileResponse, GDriveFile, GDriveUploadOptions, GoogleApiOptions, GdriveCopyFileOptions, GDriveSearchFileOptions, GDriveMimeType
} from "nextalys-node-helpers";
import * as path from 'path';
import { Environment } from "../../environment/environment";
import { AppError } from "../../models/app-error";
import { GenericResponse } from "../../models/responses/generic-response";
import { ApplicationBaseService } from "../../services/base-service";
import { GetGDriveFilesResponse } from "./gdrive-responses";
import { BaseGoogleApi } from "nextalys-node-helpers/dist/google-api";

export class GDriveUploadFileResponse extends GenericResponse {
    targetFileName: string;
    targetFolderId: string;
    uploadedFileId: string;
}
export class GDriveDownloadFileResponse extends GenericResponse {
    targetFileName: string;
    targetFullPath: string;
    mimeType: string;
}
@Injectable()
export class GDriveService extends ApplicationBaseService {

    public async downloadFile(fileId: string, targetFileName: string, targetFolder?: string): Promise<GDriveDownloadFileResponse> {
        const response = new GDriveDownloadFileResponse();
        try {
            const creds = await BaseGoogleApi.getCredentials();
            const opts: GDriveGetFileOptions = Object.assign({}, creds);
            opts.fileId = fileId;
            const fileInfoResponse = await GDriveHelpers.getFileInfo(opts);
            const ext = fileInfoResponse.data.fileExtension;
            if (!targetFolder)
                targetFolder = Environment.ApiBasePath;
            targetFileName += '.' + ext;
            opts.target = path.join(targetFolder, targetFileName);
            await GDriveHelpers.downloadFile(opts);
            response.targetFileName = targetFileName;
            response.targetFullPath = opts.target;
            response.mimeType = fileInfoResponse.data.mimeType;
            response.success = true;
        }
        catch (err) {
            response.handleError(err);
        }
        return response;
    }

    public async deleteFile(fileId: string): Promise<GenericResponse> {
        const response = new GenericResponse();
        try {
            const creds = await BaseGoogleApi.getCredentials();
            const opts: GDriveDeleteFileOptions = Object.assign({}, creds);
            opts.fileId = fileId;
            const deleteResponse = await GDriveHelpers.deleteFile(opts);
            response.success = deleteResponse.status >= 200 && deleteResponse.status < 300;
        }
        catch (err) {
            response.handleError(err);
        }
        return response;
    }
    public async getFilesInFolder(folderId: string, pageSize: number): Promise<GetGDriveFilesResponse> {
        const response = new GetGDriveFilesResponse();
        try {
            const creds = await BaseGoogleApi.getCredentials();
            const opts: GDriveListFilesOptions = Object.assign({}, creds);
            opts.folderId = folderId;
            opts.pageSize = pageSize;
            const filesResponse = await GDriveHelpers.listFiles(opts);
            if (filesResponse.status === 200) {
                response.files = filesResponse.data.files;
                response.success = true;
            }
        }
        catch (err) {
            response.handleError(err);
        }
        return response;
    }

    public async getOrCreateFolderInGDrive(folderName: string, parent: string, create: boolean): Promise<string> {
        const creds = await BaseGoogleApi.getCredentials();
        const opts: GDriveFolderOptions = Object.assign({}, creds);
        opts.folderName = folderName;
        opts.parentId = parent;
        let fileResponse: GDriveFileResponse;
        if (create)
            fileResponse = await GDriveHelpers.createFolderIfNotExists(opts);
        else
            fileResponse = await GDriveHelpers.getFolderByName(opts);
        if (fileResponse.status === 404)
            throw new AppError('Impossible de créer ou récupérer le répertoire ' + folderName);
        return fileResponse.data.id;
    }

    public async uploadFile(file: string, targetName: string, targetFolderId: string) {
        const response = new GDriveUploadFileResponse();
        try {

            let gDriveFileToDelete: GDriveFile = null;
            const filesResponse = await this.getFilesInFolder(targetFolderId, 100);
            if (!filesResponse.success)
                return response;
            for (const gDriveFile of filesResponse.files) {
                if (gDriveFile.name === targetName) {
                    gDriveFileToDelete = gDriveFile;
                    break;
                }
            }
            let creds: GoogleApiOptions;
            if (gDriveFileToDelete) {
                creds = await BaseGoogleApi.getCredentials();
                const deleteOptions: GDriveDeleteFileOptions = Object.assign({}, creds);
                deleteOptions.fileId = gDriveFileToDelete.id;
                await GDriveHelpers.deleteFile(deleteOptions);
            }
            creds = await BaseGoogleApi.getCredentials();
            const uploadOptions: GDriveUploadOptions = Object.assign({}, creds);
            uploadOptions.file = file;
            uploadOptions.targetFolderId = targetFolderId;
            uploadOptions.targetName = targetName;
            const uploadResponse = await GDriveHelpers.uploadToGoogleDrive(uploadOptions);
            response.success = uploadResponse.status === 200;
            if (response.success && uploadResponse.data) {
                response.message = uploadResponse.data.id;
                response.targetFileName = targetName;
                response.targetFolderId = targetFolderId;
                response.uploadedFileId = uploadResponse.data.id;
            }
        }
        catch (err) {
            response.handleError(err);
        }
        return response;
    }
    public async copyFile(fileId: string, targetParentId?: string, newName?: string) {
        const response = new GDriveUploadFileResponse();
        try {
            const creds = await BaseGoogleApi.getCredentials();
            const copyOptions: GdriveCopyFileOptions = Object.assign({}, creds);
            copyOptions.fileId = fileId;
            copyOptions.targetParentId = targetParentId;
            copyOptions.newName = newName;
            const copyResponse = await GDriveHelpers.copyGDriveFile(copyOptions);
            response.success = copyResponse.status === 200;
            if (response.success && copyResponse.data) {
                response.message = copyResponse.data.id;
                response.targetFolderId = targetParentId;
                response.uploadedFileId = copyResponse.data.id;
            }
        }
        catch (err) {
            response.handleError(err);
        }
        return response;
    }

    public async searchFilesByName(searchQuery: string, nameExact: boolean, mimeType?: GDriveMimeType, parentId?: string): Promise<GetGDriveFilesResponse> {
        const response = new GetGDriveFilesResponse();
        try {
            const creds = await BaseGoogleApi.getCredentials();
            const opts: GDriveSearchFileOptions = Object.assign({}, creds);
            opts.name = searchQuery;
            opts.nameExact = nameExact;
            opts.mimeType = mimeType;
            opts.parentId = parentId;

            const filesResponse = await GDriveHelpers.searchFilesByName(opts);
            if (filesResponse.status === 200) {
                response.files = filesResponse.data.files;
                response.success = true;
            }
        }
        catch (err) {
            response.handleError(err);
        }
        return response;
    }
}