"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GCloudStorageService = exports.NxsAppGetFileMetaResponse = exports.NxsAppGetFileResponse = void 0;
const common_1 = require("@nestjs/common");
const google_api_1 = require("nextalys-node-helpers/dist/google-api");
const google_cloud_storage_1 = require("nextalys-node-helpers/dist/google-cloud-storage");
const generic_response_1 = require("../../models/responses/generic-response");
const base_google_service_1 = require("../../services/base-google-service");
const base_service_1 = require("../../services/base-service");
class NxsAppGetFileResponse extends generic_response_1.GenericResponse {
}
exports.NxsAppGetFileResponse = NxsAppGetFileResponse;
class NxsAppGetFileMetaResponse extends generic_response_1.GenericResponse {
}
exports.NxsAppGetFileMetaResponse = NxsAppGetFileMetaResponse;
let GCloudStorageService = class GCloudStorageService extends base_service_1.ApplicationBaseService {
    constructor() {
        super(...arguments);
        this.bucketName = 'mmi-main-bucket';
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const creds = yield google_api_1.BaseGoogleApi.getCredentials();
            creds.exceptionPropagation = true;
            google_cloud_storage_1.GCloudStorageHelpers.init(creds);
        });
    }
    downloadFile(fileToDownload, destFile) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new NxsAppGetFileResponse();
            try {
                yield this.init();
                const downloadFileResponse = yield google_cloud_storage_1.GCloudStorageHelpers.downloadFile(this.bucketName, fileToDownload, destFile);
                response.success = downloadFileResponse.success;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    uploadFile(fileToUpload, targetFolder, outputFilename) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new NxsAppGetFileResponse();
            try {
                yield this.init();
                const uploadFileResponse = yield google_cloud_storage_1.GCloudStorageHelpers.uploadFile(this.bucketName, fileToUpload, targetFolder, outputFilename);
                response.file = uploadFileResponse.file;
                response.success = uploadFileResponse.success;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    deleteFile(fileToDelete) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = { success: false };
            try {
                yield this.init();
                response = yield google_cloud_storage_1.GCloudStorageHelpers.deleteFile(this.bucketName, fileToDelete);
            }
            catch (err) {
                response.error = err;
            }
            return response;
        });
    }
    listFiles(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.init();
            return yield google_cloud_storage_1.GCloudStorageHelpers.listFiles(this.bucketName, opts);
        });
    }
    getFileMeta(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new NxsAppGetFileMetaResponse();
            try {
                yield this.init();
                const getFileMetaResponse = yield google_cloud_storage_1.GCloudStorageHelpers.getFileMeta(this.bucketName, fileName);
                response.fileMeta = getFileMetaResponse.meta;
                response.success =
                    getFileMetaResponse.success && !!getFileMetaResponse.meta;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    copyFile(srcFileName, destFileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new NxsAppGetFileResponse();
            try {
                yield this.init();
                const copyFileResponse = yield google_cloud_storage_1.GCloudStorageHelpers.copyFile(this.bucketName, srcFileName, destFileName);
                response.file = copyFileResponse.file;
                response.success = copyFileResponse.success;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    createMainBucketIfNotExists() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!base_google_service_1.BaseGoogleService.initialized)
                return;
            yield this.init();
            const getBucketResponse = yield google_cloud_storage_1.GCloudStorageHelpers.getBucket(this.bucketName);
            if (!getBucketResponse.success ||
                !getBucketResponse.bucket ||
                !getBucketResponse.meta) {
                yield google_cloud_storage_1.GCloudStorageHelpers.createBucket(this.bucketName, 'EUROPE-WEST1', 'STANDARD');
            }
        });
    }
};
GCloudStorageService = __decorate([
    (0, common_1.Injectable)()
], GCloudStorageService);
exports.GCloudStorageService = GCloudStorageService;
//# sourceMappingURL=gcloud-storage-service.js.map