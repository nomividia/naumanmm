import { GenericResponse } from "../../models/responses/generic-response";
import { FileService } from "../../services/tools/file.service";
import { BaseController } from "../../shared/base.controller";
import { GetGDriveFilesResponse } from "./gdrive-responses";
import { GDriveService } from "./gdrive.service";
import { GCloudStorageService } from "./gcloud-storage-service";
import { FastifyReply } from "fastify";
export declare class GDriveController extends BaseController {
    private gDriveService;
    private fileService;
    private gCloudStorageService;
    constructor(gDriveService: GDriveService, fileService: FileService, gCloudStorageService: GCloudStorageService);
    getGDriveFilesInFolder(folderId: string, pageSize: number): Promise<GetGDriveFilesResponse>;
    downloadGDriveFile(response: FastifyReply, fileId: string, returnBlob?: 'true' | 'false'): Promise<GenericResponse>;
    downloadGloudStorageFile(response: FastifyReply, fileId: string, returnBlob?: 'true' | 'false'): Promise<GenericResponse>;
    deleteGDriveFile(fileId: string): Promise<GenericResponse>;
}
