"use strict";
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
exports.ApplicationBaseModelService = void 0;
const linqts_1 = require("linqts");
const typeorm_1 = require("typeorm");
const generic_response_1 = require("../models/responses/generic-response");
const base_service_1 = require("./base-service");
class ApplicationBaseModelService extends base_service_1.ApplicationBaseService {
    constructor() {
        super();
    }
    getRepository() {
        var _a;
        return (_a = this.modelOptions) === null || _a === void 0 ? void 0 : _a.repository;
    }
    checkModelOptions() {
        if (!this.modelOptions ||
            !this.modelOptions.entity ||
            !this.modelOptions.getManyResponseField ||
            !this.modelOptions.getOneResponseField) {
            console.error('Please initialize model options to use ApplicationBaseModelService - modelOptions', this.modelOptions, this.constructor.name);
            return false;
        }
        if (typeof this.modelOptions.archiveField === 'undefined') {
            this.modelOptions.archiveField = 'enabled';
        }
        if (typeof this.modelOptions.archiveFieldValue === 'undefined') {
            this.modelOptions.archiveFieldValue = false;
        }
        return true;
    }
    getLinqRelationsFromArray(query, relations) {
        if (!relations) {
            return query;
        }
        for (const relation of relations) {
            query = query.include(relation.include);
            if (relation.child) {
                query = query.thenInclude(relation.child.include);
            }
        }
        return query;
    }
    baseFindOne(conditions, useDefaultRelations, ...toDtoParameters) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.checkModelOptions()) {
                return null;
            }
            const response = new this.modelOptions.getOneResponse();
            try {
                if (!conditions) {
                    conditions = {};
                }
                let entity;
                const useNewLinqRepo = !!conditions.query;
                if (useNewLinqRepo) {
                    conditions = conditions;
                    conditions.query = this.getLinqRelationsFromArray(conditions.query, conditions.relations);
                    if (useDefaultRelations)
                        conditions.query = this.getLinqRelationsFromArray(conditions.query, this.modelOptions.getOneRelationsLinq);
                    entity = yield conditions.query.toPromise();
                }
                else {
                    const relations = [];
                    if (useDefaultRelations &&
                        ((_a = this.modelOptions.getOneRelations) === null || _a === void 0 ? void 0 : _a.length))
                        relations.push(...new linqts_1.List(this.modelOptions.getOneRelations)
                            .Distinct()
                            .ToArray());
                    conditions = conditions;
                    if (!conditions.relations)
                        conditions.relations = [];
                    conditions.relations = new linqts_1.List([
                        ...conditions.relations,
                        ...relations,
                    ])
                        .Distinct()
                        .ToArray();
                    entity = yield this.modelOptions.repository.findOne(conditions);
                }
                if (entity) {
                    response[this.modelOptions.getOneResponseField] = entity.toDto(...toDtoParameters);
                }
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    findOneWithoutRelations(conditions, ...toDtoParameters) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.baseFindOne(conditions, false, ...toDtoParameters);
        });
    }
    findOne(conditions, ...toDtoParameters) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.baseFindOne(conditions, true, ...toDtoParameters);
        });
    }
    findAll(conditions, ...toDtoParameters) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.checkModelOptions()) {
                return null;
            }
            const response = new this.modelOptions.getManyResponse();
            try {
                if (!conditions) {
                    conditions = {};
                }
                let entities;
                const useNewLinqRepo = !!conditions.query;
                if (useNewLinqRepo)
                    response.filteredResults = yield conditions.query.count();
                else
                    response.filteredResults =
                        yield this.modelOptions.repository.count(conditions);
                if (response.filteredResults === 0) {
                    response.success = true;
                    return response;
                }
                if (useNewLinqRepo) {
                    conditions = conditions;
                    conditions.query = this.getLinqRelationsFromArray(conditions.query, conditions.relations);
                    conditions.query = this.getLinqRelationsFromArray(conditions.query, this.modelOptions.getManyRelationsLinq);
                    entities = yield conditions.query.toPromise();
                }
                else {
                    const relations = [];
                    if (this.modelOptions.getManyRelations) {
                        relations.push(...new linqts_1.List(this.modelOptions.getManyRelations)
                            .Distinct()
                            .ToArray());
                    }
                    conditions = conditions;
                    if (!conditions.relations) {
                        conditions.relations = [];
                    }
                    conditions.relations = new linqts_1.List([
                        ...conditions.relations,
                        ...relations,
                    ])
                        .Distinct()
                        .ToArray();
                    entities = yield this.modelOptions.repository.find(conditions);
                }
                if (entities) {
                    response[this.modelOptions.getManyResponseField] = entities.map((x) => x.toDto(...toDtoParameters));
                }
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    baseCreateOrUpdate(dto, useDefaultRelations, ...toDtoParameters) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.checkModelOptions()) {
                return null;
            }
            const response = new this.modelOptions.getOneResponse();
            try {
                let entity;
                if (!!dto.id) {
                    entity = yield this.modelOptions.repository.findOne({
                        where: { id: dto.id },
                    });
                }
                if (!entity) {
                    entity = new this.modelOptions.entity();
                }
                try {
                    response.fieldsChangedForSave = [];
                    for (const key in dto) {
                        if (Object.prototype.hasOwnProperty.call(dto, key)) {
                            if (dto[key] !== entity[key]) {
                                response.fieldsChangedForSave.push(key);
                            }
                        }
                    }
                }
                catch (error) { }
                entity.fromDto(dto);
                const entitySaved = yield this.modelOptions.repository.save(entity);
                entity = yield this.modelOptions.repository.findOne({
                    where: { id: entitySaved.id },
                    relations: useDefaultRelations
                        ? this.modelOptions.getOneRelations
                        : [],
                });
                response[this.modelOptions.getOneResponseField] = entity.toDto(...toDtoParameters);
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    createOrUpdate(dto, ...toDtoParameters) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.baseCreateOrUpdate(dto, true, ...toDtoParameters);
        });
    }
    createOrUpdateWithoutRelations(dto, ...toDtoParameters) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.baseCreateOrUpdate(dto, false, ...toDtoParameters);
        });
    }
    delete(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.checkModelOptions()) {
                return null;
            }
            const response = new generic_response_1.GenericResponse();
            try {
                if (ids && ids.length > 0) {
                    yield this.modelOptions.repository.delete(ids);
                }
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    archive(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.checkModelOptions()) {
                return null;
            }
            const response = new generic_response_1.GenericResponse();
            try {
                if (ids && ids.length > 0) {
                    const tableName = (0, typeorm_1.getManager)().getRepository(this.modelOptions.entity).metadata.tableName;
                    const query = 'UPDATE `' +
                        tableName +
                        '` SET `' +
                        this.modelOptions.archiveField +
                        '`=' +
                        (this.modelOptions.archiveFieldValue ? '1' : '0') +
                        ' WHERE id IN("' +
                        ids.join('","') +
                        '");';
                    yield (0, typeorm_1.getManager)().query(query);
                }
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
}
exports.ApplicationBaseModelService = ApplicationBaseModelService;
//# sourceMappingURL=base-model.service.js.map