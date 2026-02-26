"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.GDriveController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shared_constants_1 = require("../../../shared/shared-constants");
const environment_1 = require("../../environment/environment");
const generic_response_1 = require("../../models/responses/generic-response");
const roles_guard_1 = require("../../services/guards/roles-guard");
const roles_decorator_1 = require("../../services/roles.decorator");
const file_service_1 = require("../../services/tools/file.service");
const base_controller_1 = require("../../shared/base.controller");
const gdrive_responses_1 = require("./gdrive-responses");
const gdrive_service_1 = require("./gdrive.service");
const gcloud_storage_service_1 = require("./gcloud-storage-service");
const nextalys_js_helpers_1 = require("nextalys-js-helpers");
let GDriveController = class GDriveController extends base_controller_1.BaseController {
    constructor(gDriveService, fileService, gCloudStorageService) {
        super();
        this.gDriveService = gDriveService;
        this.fileService = fileService;
        this.gCloudStorageService = gCloudStorageService;
    }
    getGDriveFilesInFolder(folderId, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.gDriveService.getFilesInFolder(folderId, pageSize);
        });
    }
    downloadGDriveFile(response, fileId, returnBlob) {
        return __awaiter(this, void 0, void 0, function* () {
            const downloadResponse = yield this.gDriveService.downloadFile(fileId, fileId, returnBlob !== 'true' ? environment_1.Environment.PublicFolder : environment_1.Environment.UploadedFilesTempDirectory);
            if (returnBlob !== 'true') {
                response.status(common_1.HttpStatus.OK).send(downloadResponse);
                return;
            }
            yield this.fileService.serveFileFromApi(response, downloadResponse.targetFullPath, downloadResponse.mimeType, 'attachment');
        });
    }
    downloadGloudStorageFile(response, fileId, returnBlob) {
        return __awaiter(this, void 0, void 0, function* () {
            let targetPath = returnBlob !== 'true' ? environment_1.Environment.PublicFolder : environment_1.Environment.UploadedFilesTempDirectory;
            if (!fileId) {
                this.sendResponseInternalServerError(response, 'Invalid args !', true);
                return;
            }
            const fileResponse = yield this.fileService.findOne({ where: { id: fileId } });
            if (!(fileResponse === null || fileResponse === void 0 ? void 0 : fileResponse.success)) {
                this.sendResponseInternalServerError(response, fileResponse === null || fileResponse === void 0 ? void 0 : fileResponse.message, true);
                return;
            }
            if (!(fileResponse === null || fileResponse === void 0 ? void 0 : fileResponse.file)) {
                this.sendResponseNotFound(response, null, true);
                return;
            }
            if (!fileResponse.file.externalFilePath) {
                this.sendResponseNotFound(response, 'This file has not been uploaded to GCloud !', true);
                return;
            }
            targetPath = this.fileService.joinPaths(targetPath, nextalys_js_helpers_1.MainHelpers.generateGuid());
            const downloadResponse = yield this.gCloudStorageService.downloadFile(fileResponse.file.externalFilePath, targetPath);
            if (returnBlob !== 'true') {
                this.sendResponseOk(response, downloadResponse, true);
                return;
            }
            const fileMetaResponse = yield this.gCloudStorageService.getFileMeta(fileResponse.file.externalFilePath);
            if (!(fileMetaResponse === null || fileMetaResponse === void 0 ? void 0 : fileMetaResponse.success)) {
                this.sendResponseInternalServerError(response, fileMetaResponse.message, true);
                return;
            }
            yield this.fileService.serveFileFromApi(response, targetPath, fileMetaResponse.fileMeta.contentType, 'attachment');
        });
    }
    deleteGDriveFile(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.gDriveService.deleteFile(fileId);
        });
    }
};
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.Admin),
    (0, common_1.Get)('getGDriveFilesInFolder/:folderId/:pageSize'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'get all gdrive files in folder', operationId: 'getGDriveFilesInFolder' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'GetGDriveFilesResponse', type: gdrive_responses_1.GetGDriveFilesResponse }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('folderId')),
    __param(1, (0, common_1.Param)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], GDriveController.prototype, "getGDriveFilesInFolder", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.Admin),
    (0, common_1.Get)('downloadGDriveFile/:fileId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'download gdrive file', operationId: 'downloadGDriveFile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'file Response', type: generic_response_1.GenericResponse }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('fileId')),
    __param(2, (0, common_1.Query)('returnBlob')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], GDriveController.prototype, "downloadGDriveFile", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.AdminTech, shared_constants_1.RolesList.Admin, shared_constants_1.RolesList.Candidate, shared_constants_1.RolesList.RH, shared_constants_1.RolesList.Consultant),
    (0, common_1.Get)('downloadGloudStorageFile/:fileId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'download gcloud storage file', operationId: 'downloadGloudStorageFile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'file Response', type: generic_response_1.GenericResponse }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('fileId')),
    __param(2, (0, common_1.Query)('returnBlob')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], GDriveController.prototype, "downloadGloudStorageFile", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.AdminTech),
    (0, common_1.Post)('deleteGDriveFile/:fileId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'delete gdrive file', operationId: 'deleteGDriveFile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'GenericResponse', type: generic_response_1.GenericResponse }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('fileId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GDriveController.prototype, "deleteGDriveFile", null);
GDriveController = __decorate([
    (0, common_1.Controller)('gdrive'),
    (0, swagger_1.ApiTags)('gdrive'),
    __metadata("design:paramtypes", [gdrive_service_1.GDriveService,
        file_service_1.FileService,
        gcloud_storage_service_1.GCloudStorageService])
], GDriveController);
exports.GDriveController = GDriveController;
//# sourceMappingURL=gdrive.controller.js.map