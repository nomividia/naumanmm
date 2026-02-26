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
exports.GDriveService = exports.GDriveDownloadFileResponse = exports.GDriveUploadFileResponse = void 0;
const common_1 = require("@nestjs/common");
const nextalys_node_helpers_1 = require("nextalys-node-helpers");
const path = require("path");
const environment_1 = require("../../environment/environment");
const app_error_1 = require("../../models/app-error");
const generic_response_1 = require("../../models/responses/generic-response");
const base_service_1 = require("../../services/base-service");
const gdrive_responses_1 = require("./gdrive-responses");
const google_api_1 = require("nextalys-node-helpers/dist/google-api");
class GDriveUploadFileResponse extends generic_response_1.GenericResponse {
}
exports.GDriveUploadFileResponse = GDriveUploadFileResponse;
class GDriveDownloadFileResponse extends generic_response_1.GenericResponse {
}
exports.GDriveDownloadFileResponse = GDriveDownloadFileResponse;
let GDriveService = class GDriveService extends base_service_1.ApplicationBaseService {
    downloadFile(fileId, targetFileName, targetFolder) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new GDriveDownloadFileResponse();
            try {
                const creds = yield google_api_1.BaseGoogleApi.getCredentials();
                const opts = Object.assign({}, creds);
                opts.fileId = fileId;
                const fileInfoResponse = yield nextalys_node_helpers_1.GDriveHelpers.getFileInfo(opts);
                const ext = fileInfoResponse.data.fileExtension;
                if (!targetFolder)
                    targetFolder = environment_1.Environment.ApiBasePath;
                targetFileName += '.' + ext;
                opts.target = path.join(targetFolder, targetFileName);
                yield nextalys_node_helpers_1.GDriveHelpers.downloadFile(opts);
                response.targetFileName = targetFileName;
                response.targetFullPath = opts.target;
                response.mimeType = fileInfoResponse.data.mimeType;
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    deleteFile(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                const creds = yield google_api_1.BaseGoogleApi.getCredentials();
                const opts = Object.assign({}, creds);
                opts.fileId = fileId;
                const deleteResponse = yield nextalys_node_helpers_1.GDriveHelpers.deleteFile(opts);
                response.success = deleteResponse.status >= 200 && deleteResponse.status < 300;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    getFilesInFolder(folderId, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new gdrive_responses_1.GetGDriveFilesResponse();
            try {
                const creds = yield google_api_1.BaseGoogleApi.getCredentials();
                const opts = Object.assign({}, creds);
                opts.folderId = folderId;
                opts.pageSize = pageSize;
                const filesResponse = yield nextalys_node_helpers_1.GDriveHelpers.listFiles(opts);
                if (filesResponse.status === 200) {
                    response.files = filesResponse.data.files;
                    response.success = true;
                }
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    getOrCreateFolderInGDrive(folderName, parent, create) {
        return __awaiter(this, void 0, void 0, function* () {
            const creds = yield google_api_1.BaseGoogleApi.getCredentials();
            const opts = Object.assign({}, creds);
            opts.folderName = folderName;
            opts.parentId = parent;
            let fileResponse;
            if (create)
                fileResponse = yield nextalys_node_helpers_1.GDriveHelpers.createFolderIfNotExists(opts);
            else
                fileResponse = yield nextalys_node_helpers_1.GDriveHelpers.getFolderByName(opts);
            if (fileResponse.status === 404)
                throw new app_error_1.AppError('Impossible de créer ou récupérer le répertoire ' + folderName);
            return fileResponse.data.id;
        });
    }
    uploadFile(file, targetName, targetFolderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new GDriveUploadFileResponse();
            try {
                let gDriveFileToDelete = null;
                const filesResponse = yield this.getFilesInFolder(targetFolderId, 100);
                if (!filesResponse.success)
                    return response;
                for (const gDriveFile of filesResponse.files) {
                    if (gDriveFile.name === targetName) {
                        gDriveFileToDelete = gDriveFile;
                        break;
                    }
                }
                let creds;
                if (gDriveFileToDelete) {
                    creds = yield google_api_1.BaseGoogleApi.getCredentials();
                    const deleteOptions = Object.assign({}, creds);
                    deleteOptions.fileId = gDriveFileToDelete.id;
                    yield nextalys_node_helpers_1.GDriveHelpers.deleteFile(deleteOptions);
                }
                creds = yield google_api_1.BaseGoogleApi.getCredentials();
                const uploadOptions = Object.assign({}, creds);
                uploadOptions.file = file;
                uploadOptions.targetFolderId = targetFolderId;
                uploadOptions.targetName = targetName;
                const uploadResponse = yield nextalys_node_helpers_1.GDriveHelpers.uploadToGoogleDrive(uploadOptions);
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
        });
    }
    copyFile(fileId, targetParentId, newName) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new GDriveUploadFileResponse();
            try {
                const creds = yield google_api_1.BaseGoogleApi.getCredentials();
                const copyOptions = Object.assign({}, creds);
                copyOptions.fileId = fileId;
                copyOptions.targetParentId = targetParentId;
                copyOptions.newName = newName;
                const copyResponse = yield nextalys_node_helpers_1.GDriveHelpers.copyGDriveFile(copyOptions);
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
        });
    }
    searchFilesByName(searchQuery, nameExact, mimeType, parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new gdrive_responses_1.GetGDriveFilesResponse();
            try {
                const creds = yield google_api_1.BaseGoogleApi.getCredentials();
                const opts = Object.assign({}, creds);
                opts.name = searchQuery;
                opts.nameExact = nameExact;
                opts.mimeType = mimeType;
                opts.parentId = parentId;
                const filesResponse = yield nextalys_node_helpers_1.GDriveHelpers.searchFilesByName(opts);
                if (filesResponse.status === 200) {
                    response.files = filesResponse.data.files;
                    response.success = true;
                }
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
};
GDriveService = __decorate([
    (0, common_1.Injectable)()
], GDriveService);
exports.GDriveService = GDriveService;
//# sourceMappingURL=gdrive.service.js.map