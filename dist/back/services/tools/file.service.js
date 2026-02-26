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
exports.FileService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nextalys_node_helpers_1 = require("nextalys-node-helpers");
const path = require("path");
const typeorm_2 = require("typeorm");
const app_file_entity_1 = require("../../entities/app-file.entity");
const environment_1 = require("../../environment/environment");
const file_responses_1 = require("../../models/responses/file-responses");
const base_model_service_1 = require("../base-model.service");
let FileService = class FileService extends base_model_service_1.ApplicationBaseModelService {
    constructor(filesRepository) {
        super();
        this.filesRepository = filesRepository;
        this.modelOptions = {
            getManyResponse: file_responses_1.GetFilesResponse,
            getOneResponse: file_responses_1.GetFileResponse,
            getManyResponseField: 'files',
            getOneResponseField: 'file',
            repository: this.filesRepository,
            entity: app_file_entity_1.AppFile,
            archiveField: 'disabled',
            archiveFieldValue: true,
        };
    }
    joinPaths(...paths) {
        return path.join(...paths);
    }
    moveFileDtoFromTemp(fileDto, newPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const folder = path.join(environment_1.Environment.UploadedFilesTempDirectory);
            if (!(yield nextalys_node_helpers_1.FileHelpers.fileExists(folder)))
                yield nextalys_node_helpers_1.FileHelpers.createDirectory(folder);
            const response = yield nextalys_node_helpers_1.FileHelpers.renameFile(path.join(folder, fileDto.physicalName), newPath);
            if (response.success) {
            }
            return Object.assign(Object.assign({}, response), { file: fileDto });
        });
    }
    getTempFilePath(fileDto) {
        const folder = path.join(environment_1.Environment.UploadedFilesTempDirectory);
        return path.join(folder, fileDto.physicalName);
    }
    handleFileUpload(oldEntity, dto, field, target) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const oldEntityField = oldEntity[field];
                const newEntityField = dto[field];
                const oldEntityFieldId = oldEntity[field + 'Id'];
                let response = { success: true };
                if (!oldEntityField && newEntityField) {
                    if (!(yield nextalys_node_helpers_1.FileHelpers.fileExists(target)))
                        yield nextalys_node_helpers_1.FileHelpers.createDirectory(target);
                    response = yield nextalys_node_helpers_1.FileHelpers.renameFile(path.join(environment_1.Environment.UploadedFilesTempDirectory, newEntityField.physicalName), path.join(target, newEntityField.physicalName));
                }
                else if (oldEntityField &&
                    newEntityField &&
                    oldEntityField.id !== newEntityField.id) {
                    const newFileOutput = path.join(target, newEntityField.physicalName);
                    response = yield nextalys_node_helpers_1.FileHelpers.renameFile(path.join(environment_1.Environment.UploadedFilesTempDirectory, newEntityField.physicalName), newFileOutput);
                    if (oldEntityFieldId)
                        yield this.filesRepository.delete(oldEntityFieldId);
                    const filePathToRemove = path.join(target, oldEntityField.physicalName);
                    if (filePathToRemove !== newFileOutput &&
                        (yield nextalys_node_helpers_1.FileHelpers.fileExists(filePathToRemove))) {
                        yield nextalys_node_helpers_1.FileHelpers.removeFile(filePathToRemove);
                    }
                }
                else if (oldEntityFieldId && !newEntityField) {
                    const filePathToRemove = path.join(target, oldEntityField.physicalName);
                    if (yield nextalys_node_helpers_1.FileHelpers.fileExists(filePathToRemove))
                        yield nextalys_node_helpers_1.FileHelpers.removeFile(filePathToRemove);
                    yield this.filesRepository.delete(oldEntityFieldId);
                }
                else {
                }
                return response;
            }
            catch (err) {
                console.log('🚀 ~ handleFileUpload ~ err', err);
            }
        });
    }
    deleteFileUpload(entity, field, target) {
        return __awaiter(this, void 0, void 0, function* () {
            const EntityField = entity[field];
            yield nextalys_node_helpers_1.FileHelpers.removeFile(path.join(target, EntityField.physicalName));
            yield this.filesRepository.delete(EntityField);
        });
    }
    removeFilesWithoutId(nullsFieldName) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {};
            if (!nullsFieldName || !nullsFieldName.length)
                return;
            nullsFieldName.forEach((fieldName) => {
                where[fieldName] = null;
            });
            const response = yield this.filesRepository.find({ where });
            if (response && response.length > 0) {
                for (const file of response) {
                    if (file.physicalName &&
                        (yield nextalys_node_helpers_1.FileHelpers.fileExists(file.physicalName)))
                        yield nextalys_node_helpers_1.FileHelpers.removeFile(file.physicalName);
                }
                yield this.filesRepository.delete(response.map((x) => x.id));
            }
        });
    }
    serveFileFromApi(response, filePath, contentType, contentDisposition, ignoreInterceptor) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileContent = (yield nextalys_node_helpers_1.FileHelpers.readFile(filePath, false));
            if (ignoreInterceptor) {
                response.header('access-control-expose-headers', 'nxs-ignore-interceptor');
                response.header('nxs-ignore-interceptor', 'true');
            }
            if (fileContent) {
                response.header('Content-Type', contentType);
                if (contentDisposition)
                    response.header('Content-Disposition', contentDisposition);
                response.status(common_1.HttpStatus.OK).send(fileContent);
            }
            else {
                response.status(common_1.HttpStatus.NOT_FOUND).send('Fichier introuvable');
            }
        });
    }
};
FileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(app_file_entity_1.AppFile)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FileService);
exports.FileService = FileService;
//# sourceMappingURL=file.service.js.map