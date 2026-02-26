import { GDriveMimeType } from "nextalys-node-helpers";
import { GenericResponse } from "../../models/responses/generic-response";
import { ApplicationBaseService } from "../../services/base-service";
import { GetGDriveFilesResponse } from "./gdrive-responses";
export declare class GDriveUploadFileResponse extends GenericResponse {
    targetFileName: string;
    targetFolderId: string;
    uploadedFileId: string;
}
export declare class GDriveDownloadFileResponse extends GenericResponse {
    targetFileName: string;
    targetFullPath: string;
    mimeType: string;
}
export declare class GDriveService extends ApplicationBaseService {
    downloadFile(fileId: string, targetFileName: string, targetFolder?: string): Promise<GDriveDownloadFileResponse>;
    deleteFile(fileId: string): Promise<GenericResponse>;
    getFilesInFolder(folderId: string, pageSize: number): Promise<GetGDriveFilesResponse>;
    getOrCreateFolderInGDrive(folderName: string, parent: string, create: boolean): Promise<string>;
    uploadFile(file: string, targetName: string, targetFolderId: string): Promise<GDriveUploadFileResponse>;
    copyFile(fileId: string, targetParentId?: string, newName?: string): Promise<GDriveUploadFileResponse>;
    searchFilesByName(searchQuery: string, nameExact: boolean, mimeType?: GDriveMimeType, parentId?: string): Promise<GetGDriveFilesResponse>;
}
