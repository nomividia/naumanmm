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
exports.KeyValueService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cache_manager_1 = require("../../../shared/cache-manager");
const app_error_1 = require("../../models/app-error");
const generic_response_1 = require("../../models/responses/generic-response");
const base_model_service_1 = require("../../services/base-model.service");
const back_cache_manager_1 = require("../../services/tools/back-cache-manager");
const key_value_dto_1 = require("./key-value-dto");
const key_value_entity_1 = require("./key-value.entity");
const appKeyValuesKey = 'appKeyValues';
let KeyValueService = class KeyValueService extends base_model_service_1.ApplicationBaseModelService {
    constructor(repository) {
        super();
        this.repository = repository;
        this.cacheEnabled = false;
        this.modelOptions = {
            getManyResponse: key_value_dto_1.GetKeyValuesResponse,
            getOneResponse: key_value_dto_1.GetKeyValueResponse,
            getManyResponseField: 'keyValues',
            getOneResponseField: 'keyValue',
            repository: this.repository,
            entity: key_value_entity_1.KeyValue,
        };
        back_cache_manager_1.BackCacheManager.init();
    }
    getMultipleKeyValues(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cacheEnabled) {
                return yield cache_manager_1.CacheManager.getDataFromCache(keys, appKeyValuesKey, 'key', (keysToLoad) => this.findAll({ where: { key: (0, typeorm_2.In)(keysToLoad) } }), 'keyValues', '1', 6);
            }
            else {
                const dbResponse = yield this.findAll({ where: { key: (0, typeorm_2.In)(keys) } });
                if (dbResponse.success) {
                    return dbResponse.keyValues;
                }
            }
            return [];
        });
    }
    getKeyValue(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.getMultipleKeyValues([key]);
            if (response && response.length > 0) {
                return response[0].value;
            }
            return null;
        });
    }
    saveKeyValue(key, value, frontEditable = true) {
        return __awaiter(this, void 0, void 0, function* () {
            let keyValue = { key, frontEditable: frontEditable };
            const keyValueResponse = yield this.findOne({ where: { key } });
            if (keyValueResponse.keyValue) {
                keyValue = keyValueResponse.keyValue;
            }
            if (!!value && typeof value !== 'string' && typeof value !== 'number') {
                value = JSON.stringify(value);
            }
            keyValue.value = value;
            keyValue.frontEditable = frontEditable;
            return yield this.createOrUpdate(keyValue);
        });
    }
    createOrUpdate(keyValueDto) {
        const _super = Object.create(null, {
            createOrUpdate: { get: () => super.createOrUpdate }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let response = new key_value_dto_1.GetKeyValueResponse();
            try {
                if (!keyValueDto.id) {
                    const keyValueResponse = yield this.findOne({
                        where: { key: keyValueDto.key },
                    });
                    if (keyValueResponse.keyValue) {
                        throw new app_error_1.AppErrorWithMessage('Un enregistrement existe déjà avec cette clé !');
                    }
                }
                response = yield _super.createOrUpdate.call(this, keyValueDto);
                yield cache_manager_1.CacheManager.removeFromCache([keyValueDto.key], appKeyValuesKey, 'key');
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    delete(ids) {
        const _super = Object.create(null, {
            delete: { get: () => super.delete }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (!ids || ids.length === 0) {
                return new generic_response_1.GenericResponse(true);
            }
            const results = yield this.findAll({ where: { id: (0, typeorm_2.In)(ids) } });
            yield cache_manager_1.CacheManager.removeFromCache(results.keyValues.map((x) => x.key), appKeyValuesKey, 'key');
            return yield _super.delete.call(this, ids);
        });
    }
};
KeyValueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(key_value_entity_1.KeyValue)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], KeyValueService);
exports.KeyValueService = KeyValueService;
//# sourceMappingURL=key-value.service.js.map