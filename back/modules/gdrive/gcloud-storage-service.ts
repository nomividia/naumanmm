import { File as GCloudFile, GetFilesOptions } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { BaseGoogleApi } from 'nextalys-node-helpers/dist/google-api';
import {
    GCloudStorageHelpers,
    GCloudStorageHelpersOptions,
    NxsGCloudResponse,
} from 'nextalys-node-helpers/dist/google-cloud-storage';
import { GenericResponse } from '../../models/responses/generic-response';
import { BaseGoogleService } from '../../services/base-google-service';
import { ApplicationBaseService } from '../../services/base-service';

export class NxsAppGetFileResponse extends GenericResponse {
    file: GCloudFile;
}

export class NxsAppGetFileMetaResponse extends GenericResponse {
    fileMeta: any;
}

@Injectable()
export class GCloudStorageService extends ApplicationBaseService {
    private bucketName = 'mmi-main-bucket';

    private async init() {
        const creds: GCloudStorageHelpersOptions =
            await BaseGoogleApi.getCredentials();
        creds.exceptionPropagation = true;
        GCloudStorageHelpers.init(creds);
    }

    public async downloadFile(fileToDownload: string, destFile: string) {
        const response = new NxsAppGetFileResponse();

        try {
            await this.init();
            const downloadFileResponse =
                await GCloudStorageHelpers.downloadFile(
                    this.bucketName,
                    fileToDownload,
                    destFile,
                );
            response.success = downloadFileResponse.success;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    public async uploadFile(
        fileToUpload: string,
        targetFolder?: string,
        outputFilename?: string,
    ) {
        const response = new NxsAppGetFileResponse();

        try {
            await this.init();
            const uploadFileResponse = await GCloudStorageHelpers.uploadFile(
                this.bucketName,
                fileToUpload,
                targetFolder,
                outputFilename,
            );
            response.file = uploadFileResponse.file as any;
            response.success = uploadFileResponse.success;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    public async deleteFile(fileToDelete: string) {
        let response: NxsGCloudResponse = { success: false };

        try {
            await this.init();
            response = await GCloudStorageHelpers.deleteFile(
                this.bucketName,
                fileToDelete,
            );
        } catch (err) {
            response.error = err;
        }

        return response;
    }

    public async listFiles(opts?: GetFilesOptions) {
        await this.init();

        return await GCloudStorageHelpers.listFiles(this.bucketName, opts);
    }

    public async getFileMeta(fileName: string) {
        const response = new NxsAppGetFileMetaResponse();

        try {
            await this.init();
            const getFileMetaResponse = await GCloudStorageHelpers.getFileMeta(
                this.bucketName,
                fileName,
            );
            response.fileMeta = getFileMetaResponse.meta;
            response.success =
                getFileMetaResponse.success && !!getFileMetaResponse.meta;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }
    public async copyFile(srcFileName: string, destFileName: string) {
        const response = new NxsAppGetFileResponse();
        try {
            await this.init();
            const copyFileResponse = await GCloudStorageHelpers.copyFile(
                this.bucketName,
                srcFileName,
                destFileName,
            );
            response.file = copyFileResponse.file as any;
            response.success = copyFileResponse.success;
        } catch (err) {
            response.handleError(err);
        }
        return response;
    }

    async createMainBucketIfNotExists() {
        if (!BaseGoogleService.initialized) return;
        await this.init();
        const getBucketResponse = await GCloudStorageHelpers.getBucket(
            this.bucketName,
        );
        if (
            !getBucketResponse.success ||
            !getBucketResponse.bucket ||
            !getBucketResponse.meta
        ) {
            await GCloudStorageHelpers.createBucket(
                this.bucketName,
                'EUROPE-WEST1',
                'STANDARD',
            );
        }
    }
}
