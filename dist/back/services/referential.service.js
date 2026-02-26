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
exports.ReferentialService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const shared_service_1 = require("../../shared/shared-service");
const app_language_entity_1 = require("../entities/app-language.entity");
const app_type_entity_1 = require("../entities/app-type.entity");
const app_value_entity_1 = require("../entities/app-value.entity");
const app_error_1 = require("../models/app-error");
const app_type_dto_1 = require("../models/dto/app-type-dto");
const app_value_dto_1 = require("../models/dto/app-value-dto");
const base_search_requests_1 = require("../models/requests/base-search-requests");
const generic_response_1 = require("../models/responses/generic-response");
const languages_responses_1 = require("../models/responses/languages-responses");
const base_service_1 = require("./base-service");
const back_cache_manager_1 = require("./tools/back-cache-manager");
const logger_service_1 = require("./tools/logger.service");
let ReferentialService = class ReferentialService extends base_service_1.ApplicationBaseService {
    constructor(appValuesRepository, appTypesRepository, appLanguagesRepository, appLogger) {
        super();
        this.appValuesRepository = appValuesRepository;
        this.appTypesRepository = appTypesRepository;
        this.appLanguagesRepository = appLanguagesRepository;
        this.appLogger = appLogger;
    }
    getAllAppTypes(conditions) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new app_type_dto_1.GetAppTypesResponse();
            try {
                const appTypes = yield this.appTypesRepository.find(conditions);
                if (appTypes) {
                    response.appTypes = appTypes.map((x) => x.toDto());
                    this.sortAppTypes(response.appTypes);
                }
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    getAppValues(conditions, ofTypeCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new app_value_dto_1.GetAppValuesResponse();
            try {
                if (!conditions) {
                    conditions = {};
                }
                let appTypeId;
                if (ofTypeCode) {
                    const appType = yield this.appTypesRepository.findOne({
                        where: { code: ofTypeCode },
                        select: ['id'],
                    });
                    if (appType && appType.id) {
                        appTypeId = appType.id;
                    }
                }
                if (appTypeId) {
                    if (!conditions.where) {
                        conditions.where = {};
                    }
                    conditions.where.appTypeId = appTypeId;
                }
                const appValues = yield this.appValuesRepository.find(conditions);
                if (appValues) {
                    response.appValues = appValues.map((x) => x.toDto());
                }
                if (!conditions.order) {
                    this.sortAppValues(response.appValues);
                }
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    getOneAppValue(code, ofTypeCode) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new app_value_dto_1.GetAppValueResponse();
            try {
                const getValuesResponse = yield this.getAllAppValues([code], ofTypeCode);
                if (!getValuesResponse.success) {
                    throw new app_error_1.AppErrorWithMessage(getValuesResponse.message);
                }
                if ((_a = getValuesResponse.appValues) === null || _a === void 0 ? void 0 : _a.length) {
                    response.appValue = getValuesResponse.appValues[0];
                }
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    getAllAppValues(codes, ofTypeCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new app_value_dto_1.GetAppValuesResponse();
            try {
                let appTypeId;
                const conditions = { where: {} };
                if (ofTypeCode) {
                    const appType = yield this.appTypesRepository.findOne({
                        where: { code: ofTypeCode },
                        select: ['id'],
                    });
                    if (appType && appType.id) {
                        appTypeId = appType.id;
                    }
                }
                if (appTypeId) {
                    conditions.where.appTypeId =
                        appTypeId;
                }
                if (codes && codes.length > 0) {
                    conditions.where.code = (0, typeorm_2.In)(codes);
                }
                const appValues = yield this.appValuesRepository.find(conditions);
                if (appValues) {
                    response.appValues = appValues.map((x) => x.toDto());
                }
                response.appValues = this.filterAppValues(response.appValues);
                this.sortAppValues(response.appValues);
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    getOneAppType(id, payload, includeDisabled) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new app_type_dto_1.GetAppTypeResponse();
            try {
                const relations = [
                    'appValues',
                    'appValues.translations',
                    'translations',
                ];
                const appType = yield this.appTypesRepository.findOne({
                    where: { id: id },
                    relations: relations,
                });
                if (!appType) {
                    throw new app_error_1.AppError('app type not found !');
                }
                response.appType = appType.toDto();
                if (!shared_service_1.SharedService.userIsAdmin(payload) || !includeDisabled) {
                    this.filterAppTypes([response.appType]);
                }
                this.sortAppTypes([response.appType]);
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    getTypeValues(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new app_type_dto_1.GetAppTypeResponse();
            try {
                if (!request.appTypeCode) {
                    throw new app_error_1.AppError('You must specify a type code !');
                }
                const relations = ['appValues'];
                if (request.includeTranslations === 'true') {
                    relations.push('appValues.translations', 'translations');
                }
                const appType = yield this.appTypesRepository.findOne({
                    where: { code: request.appTypeCode },
                    relations: relations,
                });
                if (!appType) {
                    throw new app_error_1.AppError('app type not found !');
                }
                response.appType = appType.toDto();
                if (request.alsoDisabled !== 'true') {
                    this.filterAppTypes([response.appType]);
                }
                if (request.orderby) {
                    response.appType.appValues.sort((a, b) => {
                        if (a[request.orderby] === b[request.orderby]) {
                            return 0;
                        }
                        if (request.order === 'asc') {
                            return a[request.orderby] > b[request.orderby] ? 1 : -1;
                        }
                        else {
                            return a[request.orderby] > b[request.orderby] ? -1 : 1;
                        }
                    });
                }
                else {
                    this.sortAppTypes([response.appType]);
                }
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    getMultipleTypeValues(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new app_type_dto_1.GetAppTypesResponse();
            try {
                if (!request.appTypesCodes) {
                    throw new app_error_1.AppError('You must specify a type code !');
                }
                const appTypeCodes = request.appTypesCodes.split(',');
                if (!(appTypeCodes === null || appTypeCodes === void 0 ? void 0 : appTypeCodes.length)) {
                    throw new app_error_1.AppError('You must specify a type code !');
                }
                const findOptions = base_search_requests_1.BaseSearchRequest.getDefaultFindOptions(request);
                findOptions.where = { code: (0, typeorm_2.In)(appTypeCodes) };
                findOptions.relations = ['appValues'];
                if (request.includeTranslations === 'true') {
                    findOptions.relations.push('appValues.translations', 'translations');
                }
                const appTypes = yield this.appTypesRepository.find(findOptions);
                for (const appType of appTypes) {
                    if (appType)
                        response.appTypes.push(appType.toDto());
                }
                this.filterAppTypes(response.appTypes);
                if (!request.orderby) {
                    this.sortAppTypes(response.appTypes);
                }
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    insertOrUpdateAppType(appTypeDto, includeAppValues, includeTranslations) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new app_type_dto_1.GetAppTypeResponse();
            try {
                if (!appTypeDto.code) {
                    throw new app_error_1.AppError('app type code must be set !');
                }
                const relations = [];
                if (includeAppValues) {
                    relations.push('appValues');
                    if (includeTranslations) {
                        relations.push('appValues.translations', 'translations');
                    }
                }
                let appType = yield this.appTypesRepository.findOne({
                    where: { code: appTypeDto.code },
                    relations: relations,
                });
                if (!appType) {
                    appType = new app_type_entity_1.AppType();
                }
                else {
                    appTypeDto.id = appType.id;
                }
                if ((_a = appTypeDto.appValues) === null || _a === void 0 ? void 0 : _a.length) {
                    for (const appValueDto of appTypeDto.appValues) {
                        if (!appValueDto.code) {
                            appValueDto.appType = appTypeDto;
                            appValueDto.code =
                                shared_service_1.SharedService.generateAppValueCode(appValueDto);
                            delete appValueDto.appType;
                        }
                    }
                }
                appType.fromDto(appTypeDto, includeAppValues);
                appType = yield this.appTypesRepository.save(appType);
                response.appType = appType.toDto();
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    insertOrUpdateAppValue(appValueDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new app_value_dto_1.GetAppValueResponse();
            try {
                if (!appValueDto.code && appValueDto.id) {
                    throw new app_error_1.AppError('app value code must be set !');
                }
                if (!appValueDto.label) {
                    throw new app_error_1.AppError('app value label must be set !');
                }
                let appValue;
                if (!appValueDto.code) {
                    if (!appValueDto.appType && appValueDto.appTypeId) {
                        const appType = yield this.appTypesRepository.findOne({
                            where: { id: appValueDto.appTypeId },
                        });
                        appValueDto.appType = appType.toDto();
                    }
                    appValueDto.code =
                        shared_service_1.SharedService.generateAppValueCode(appValueDto);
                }
                appValue = yield this.appValuesRepository.findOne({
                    where: { code: appValueDto.code },
                });
                if (!appValue) {
                    appValue = new app_value_entity_1.AppValue();
                }
                else if (appValue.id) {
                    appValueDto.id = appValue.id;
                }
                appValue.fromDto(appValueDto);
                appValue = yield this.appValuesRepository.save(appValue);
                response.appValue = appValue.toDto();
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    createOrUpdateTypeWithValues(typeCode, typeLabel, values, removeOldValues) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appType = new app_type_dto_1.AppTypeDto();
                appType.code = typeCode;
                appType.label = typeLabel;
                const appTypeResponse = yield this.insertOrUpdateAppType(appType, false, false);
                if (appTypeResponse.success) {
                    for (const appValue of values) {
                        const appValueDto = new app_value_dto_1.AppValueDto();
                        appValueDto.label = appValue.label;
                        appValueDto.appTypeId = appTypeResponse.appType.id;
                        appValueDto.order = appValue.order;
                        appValueDto.code = appValue.code;
                        appValueDto.enabled = true;
                        yield this.insertOrUpdateAppValue(appValueDto);
                        appValue.code = appValueDto.code;
                    }
                    if (removeOldValues) {
                        const appValuesToRemove = [];
                        const appValuesResponse = yield this.getAllAppValues(null, appTypeResponse.appType.code);
                        if (appValuesResponse.success) {
                            for (const appValue of appValuesResponse.appValues) {
                                if (values
                                    .filter((x) => !!x.code)
                                    .map((x) => x.code)
                                    .indexOf(appValue.code) === -1) {
                                    appValuesToRemove.push(appValue.id);
                                }
                            }
                        }
                        if (appValuesToRemove.length > 0) {
                            yield this.appValuesRepository.delete(appValuesToRemove);
                        }
                    }
                }
                else
                    console.error(appTypeResponse.error);
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    getAllLanguages(conditions) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new languages_responses_1.GetLanguagesResponse();
            try {
                let appLanguages = yield back_cache_manager_1.BackCacheManager.getValue('cacheAllAppLanguages');
                if (!appLanguages) {
                    appLanguages = yield this.appLanguagesRepository.find(conditions);
                    if (appLanguages) {
                        yield back_cache_manager_1.BackCacheManager.setValue('cacheAllAppLanguages', appLanguages);
                    }
                }
                else {
                    for (let index = 0; index < appLanguages.length; index++) {
                        const appLanguageEntity = appLanguages[index];
                        appLanguages[index] = new app_language_entity_1.AppLanguage();
                        appLanguages[index].id = appLanguageEntity.id;
                        appLanguages[index].icon = appLanguageEntity.icon;
                        appLanguages[index].label = appLanguageEntity.label;
                        appLanguages[index].code = appLanguageEntity.code;
                    }
                }
                if (!appLanguages) {
                    appLanguages = [];
                }
                response.languages = appLanguages.map((x) => x.toDto());
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    createOrUpdateLanguage(language) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new languages_responses_1.GetLanguageResponse();
            try {
                let languageEntity = yield this.appLanguagesRepository.findOne({
                    where: { code: language.code },
                });
                if (!languageEntity) {
                    languageEntity = new app_language_entity_1.AppLanguage();
                }
                else {
                    language.id = languageEntity.id;
                }
                languageEntity.fromDto(language);
                languageEntity = yield this.appLanguagesRepository.save(languageEntity);
                response.language = languageEntity.toDto();
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    removeAppValues(ids, codes) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                if (!(ids === null || ids === void 0 ? void 0 : ids.length) && !(codes === null || codes === void 0 ? void 0 : codes.length)) {
                    throw new app_error_1.AppError('Invalid args !');
                }
                let appValuesToRemove = [];
                if (ids === null || ids === void 0 ? void 0 : ids.length) {
                    appValuesToRemove = ids;
                }
                else if (codes === null || codes === void 0 ? void 0 : codes.length) {
                    const appValues = yield this.appValuesRepository.find({
                        where: { code: (0, typeorm_2.In)(codes) },
                        select: ['id'],
                    });
                    appValuesToRemove = appValues.map((x) => x.id);
                }
                if (appValuesToRemove.length) {
                    yield this.appValuesRepository.delete(appValuesToRemove);
                }
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    disableAppValues(ids, codes) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                if (!(ids === null || ids === void 0 ? void 0 : ids.length) && !(codes === null || codes === void 0 ? void 0 : codes.length)) {
                    throw new app_error_1.AppError('Invalid args !');
                }
                let appValuesToUpdate = [];
                if (ids === null || ids === void 0 ? void 0 : ids.length) {
                    appValuesToUpdate = yield this.appValuesRepository.find({
                        where: { id: (0, typeorm_2.In)(ids) },
                    });
                }
                else if (codes === null || codes === void 0 ? void 0 : codes.length) {
                    appValuesToUpdate = yield this.appValuesRepository.find({
                        where: { code: (0, typeorm_2.In)(codes) },
                    });
                }
                if (appValuesToUpdate.length) {
                    for (const appValue of appValuesToUpdate) {
                        appValue.enabled = false;
                        yield this.appValuesRepository.save(appValue);
                    }
                }
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    filterAppValues(appValues) {
        if (!(appValues === null || appValues === void 0 ? void 0 : appValues.length)) {
            return [];
        }
        return appValues.filter((x) => !!x.enabled);
    }
    filterAppTypes(appTypes) {
        if (!(appTypes === null || appTypes === void 0 ? void 0 : appTypes.length)) {
            return;
        }
        for (const appType of appTypes) {
            appType.appValues = this.filterAppValues(appType.appValues);
        }
    }
    sortAppTypes(appTypes) {
        var _a;
        if (!(appTypes === null || appTypes === void 0 ? void 0 : appTypes.length)) {
            return;
        }
        for (const appType of appTypes) {
            if ((_a = appType.appValues) === null || _a === void 0 ? void 0 : _a.length) {
                this.sortAppValues(appType.appValues);
            }
        }
    }
    sortAppValues(appValues) {
        appValues.sort((a, b) => {
            if (a.order === b.order)
                return 0;
            if (a.order > b.order)
                return 1;
            if (a.order < b.order)
                return -1;
        });
    }
};
ReferentialService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(app_value_entity_1.AppValue)),
    __param(1, (0, typeorm_1.InjectRepository)(app_type_entity_1.AppType)),
    __param(2, (0, typeorm_1.InjectRepository)(app_language_entity_1.AppLanguage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        logger_service_1.AppLogger])
], ReferentialService);
exports.ReferentialService = ReferentialService;
//# sourceMappingURL=referential.service.js.map