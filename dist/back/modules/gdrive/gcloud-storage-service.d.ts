import { File as GCloudFile, GetFilesOptions } from '@google-cloud/storage';
import { NxsGCloudResponse } from 'nextalys-node-helpers/dist/google-cloud-storage';
import { GenericResponse } from '../../models/responses/generic-response';
import { ApplicationBaseService } from '../../services/base-service';
export declare class NxsAppGetFileResponse extends GenericResponse {
    file: GCloudFile;
}
export declare class NxsAppGetFileMetaResponse extends GenericResponse {
    fileMeta: any;
}
export declare class GCloudStorageService extends ApplicationBaseService {
    private bucketName;
    private init;
    downloadFile(fileToDownload: string, destFile: string): Promise<NxsAppGetFileResponse>;
    uploadFile(fileToUpload: string, targetFolder?: string, outputFilename?: string): Promise<NxsAppGetFileResponse>;
    deleteFile(fileToDelete: string): Promise<NxsGCloudResponse>;
    listFiles(opts?: GetFilesOptions): Promise<import("nextalys-node-helpers/dist/google-cloud-storage").NxsListFilesResponse>;
    getFileMeta(fileName: string): Promise<NxsAppGetFileMetaResponse>;
    copyFile(srcFileName: string, destFileName: string): Promise<NxsAppGetFileResponse>;
    createMainBucketIfNotExists(): Promise<void>;
}
