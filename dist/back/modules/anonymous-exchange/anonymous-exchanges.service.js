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
exports.AnonymousExchangesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nextalys_node_helpers_1 = require("nextalys-node-helpers");
const typeorm_2 = require("typeorm");
const app_file_entity_1 = require("../../entities/app-file.entity");
const environment_1 = require("../../environment/environment");
const app_error_1 = require("../../models/app-error");
const base_model_service_1 = require("../../services/base-model.service");
const file_service_1 = require("../../services/tools/file.service");
const candidate_applications_service_1 = require("../candidates-application/candidate-applications.service");
const anonymous_exchange_dto_1 = require("./anonymous-exchange.dto");
const anonymous_exchange_entity_1 = require("./anonymous-exchange.entity");
let AnonymousExchangesService = class AnonymousExchangesService extends base_model_service_1.ApplicationBaseModelService {
    constructor(repository, candidateApplicationService, fileService) {
        super();
        this.repository = repository;
        this.candidateApplicationService = candidateApplicationService;
        this.fileService = fileService;
        this.modelOptions = {
            getManyResponse: anonymous_exchange_dto_1.GetAnonymousExchangesForCandidateApplicationResponse,
            getOneResponse: anonymous_exchange_dto_1.GetAnonymousExchangeForCandidateApplicationResponse,
            getManyResponseField: 'exchanges',
            getOneResponseField: 'exchange',
            getManyRelations: ['consultant', 'candidateApplication', 'file'],
            getOneRelations: ['consultant', 'candidateApplication'],
            repository: this.repository,
            entity: anonymous_exchange_entity_1.AnonymousExchange,
            archiveField: 'archived',
            archiveFieldValue: true,
        };
    }
    handleFileAndSaveExchange(anonymousExchangeDto, filesToHandle) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new anonymous_exchange_dto_1.GetAnonymousExchangeForCandidateApplicationResponse();
            try {
                const exchange = new anonymous_exchange_entity_1.AnonymousExchange();
                exchange.fromDto(anonymousExchangeDto);
                exchange.file = new app_file_entity_1.AppFile();
                const privateFolder = this.fileService.joinPaths(environment_1.Environment.CandidateApplicationsDirectory, anonymousExchangeDto.id);
                if (!(yield nextalys_node_helpers_1.FileHelpers.fileExists(privateFolder))) {
                    yield nextalys_node_helpers_1.FileHelpers.createDirectory(privateFolder);
                }
                for (const fileWrapper of filesToHandle) {
                    if (!fileWrapper.file) {
                        continue;
                    }
                    const filePath = this.fileService.joinPaths(privateFolder, fileWrapper.file.physicalName);
                    yield this.fileService.moveFileDtoFromTemp(fileWrapper.file, filePath);
                    yield nextalys_node_helpers_1.FileHelpers.renameFile(this.fileService.getTempFilePath(fileWrapper.file), filePath);
                    exchange.file.fileType = fileWrapper.file.fileType;
                    exchange.file.name = fileWrapper.file.name;
                    exchange.file.physicalName = filePath;
                    exchange.file.mimeType = fileWrapper.file.mimeType;
                }
                const saveResponse = yield this.repository.save(exchange);
                response.exchange = saveResponse.toDto();
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    serveFile(res, fileId, exchangeGuid) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findApplicationWithExchangeGuid = yield this.candidateApplicationService.findOne({
                    where: { guidExchange: exchangeGuid },
                    relations: [
                        'anonymousExchanges',
                        'anonymousExchanges.file',
                    ],
                });
                if (!findApplicationWithExchangeGuid.success) {
                    throw new app_error_1.AppErrorWithMessage(findApplicationWithExchangeGuid.message);
                }
                const findFile = (_a = findApplicationWithExchangeGuid.candidateApplication.anonymousExchanges.find((x) => { var _a; return ((_a = x.file) === null || _a === void 0 ? void 0 : _a.id) === fileId; })) === null || _a === void 0 ? void 0 : _a.file;
                if (!findFile.id) {
                    throw new app_error_1.AppErrorWithMessage('Unable to find file');
                }
                yield this.setResponse(findFile, res, findFile.mimeType);
            }
            catch (error) {
                throw new app_error_1.AppErrorWithMessage(error);
            }
        });
    }
    get(physicalName) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield nextalys_node_helpers_1.FileHelpers.readFile(physicalName, false));
        });
    }
    setResponse(file, res, contentType) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.get(file.physicalName);
            if (data) {
                res.header('Content-Type', contentType);
                res.header('Content-Disposition', `inline; filename="${file.name}"`);
                res.status(common_1.HttpStatus.OK).send(data);
            }
            else {
                res.status(common_1.HttpStatus.NOT_FOUND).send('Fichier introuvable');
            }
        });
    }
};
AnonymousExchangesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(anonymous_exchange_entity_1.AnonymousExchange)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        candidate_applications_service_1.CandidateApplicationService,
        file_service_1.FileService])
], AnonymousExchangesService);
exports.AnonymousExchangesService = AnonymousExchangesService;
//# sourceMappingURL=anonymous-exchanges.service.js.map