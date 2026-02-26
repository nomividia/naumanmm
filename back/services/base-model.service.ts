import { List } from 'linqts';
import {
    FindManyOptions,
    FindOneOptions,
    getManager,
    Repository,
} from 'typeorm';
import { IQuery } from 'typeorm-linq-repository';
import { BaseSearchResponse } from '../models/responses/base-search-responses';
import { GenericResponse } from '../models/responses/generic-response';
import { ApplicationBaseService } from './base-service';

interface LinqRelation<X> {
    include: (x: X) => any;
    child?: LinqRelation<any>;
}

interface ModelOptions<X, Y, Z> {
    entity: new () => X;
    repository: Repository<X>;
    getOneResponse: new () => Y;
    getManyResponse: new () => Z;
    getManyResponseField: string;
    getOneResponseField: string;
    getManyRelations?: string[];
    getOneRelations?: string[];
    getOneRelationsLinq?: LinqRelation<X>[];
    getManyRelationsLinq?: LinqRelation<X>[];
    archiveField?: string;
    archiveFieldValue?: boolean;
}

export interface LinqQueryWrapper<X> {
    query: IQuery<X, X, X>;
    relations?: LinqRelation<X>[];
}

export interface LinqMultipleQueryWrapper<X> {
    query: IQuery<X, X[], X>;
    relations?: LinqRelation<X>[];
}

export abstract class ApplicationBaseModelService<
    X extends {
        id: string | number;
        toDto: (...args: any) => any;
        fromDto: (dto: XDTO) => any;
    } = undefined,
    XDTO extends { id?: string | number } = undefined,
    Y extends GenericResponse = undefined,
    Z extends BaseSearchResponse = undefined,
> extends ApplicationBaseService {
    public modelOptions: ModelOptions<X, Y, Z>;

    constructor() {
        super();
    }

    public getRepository() {
        return this.modelOptions?.repository;
    }

    private checkModelOptions() {
        if (
            !this.modelOptions ||
            !this.modelOptions.entity ||
            !this.modelOptions.getManyResponseField ||
            !this.modelOptions.getOneResponseField
        ) {
            console.error(
                'Please initialize model options to use ApplicationBaseModelService - modelOptions',
                this.modelOptions,
                this.constructor.name,
            );
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

    private getLinqRelationsFromArray(
        query: IQuery<X, any, any>,
        relations: LinqRelation<X>[],
    ) {
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

    private async baseFindOne(
        conditions: FindOneOptions<X> | LinqQueryWrapper<X>,
        useDefaultRelations: boolean,
        ...toDtoParameters: any[]
    ) {
        if (!this.checkModelOptions()) {
            return null;
        }

        const response = new this.modelOptions.getOneResponse();

        try {
            if (!conditions) {
                conditions = {};
            }
            let entity: X;
            const useNewLinqRepo = !!(conditions as any).query;

            if (useNewLinqRepo) {
                conditions = conditions as LinqQueryWrapper<X>;
                conditions.query = this.getLinqRelationsFromArray(
                    conditions.query,
                    conditions.relations,
                );
                if (useDefaultRelations)
                    conditions.query = this.getLinqRelationsFromArray(
                        conditions.query,
                        this.modelOptions.getOneRelationsLinq,
                    );
                entity = await conditions.query.toPromise();
            } else {
                const relations: string[] = [];
                if (
                    useDefaultRelations &&
                    this.modelOptions.getOneRelations?.length
                )
                    relations.push(
                        ...new List(this.modelOptions.getOneRelations)
                            .Distinct()
                            .ToArray(),
                    );
                conditions = conditions as FindOneOptions<X>;
                if (!conditions.relations) conditions.relations = [];
                conditions.relations = new List([
                    ...conditions.relations,
                    ...relations,
                ])
                    .Distinct()
                    .ToArray();
                entity = await this.modelOptions.repository.findOne(conditions);
            }

            if (entity) {
                response[this.modelOptions.getOneResponseField] = entity.toDto(
                    ...toDtoParameters,
                );
            }

            response.success = true;
        } catch (err) {
            response.handleError(err);
        }
        return response;
    }

    async findOneWithoutRelations(
        conditions?: FindOneOptions<X> | LinqQueryWrapper<X>,
        ...toDtoParameters: any[]
    ): Promise<Y> {
        return await this.baseFindOne(conditions, false, ...toDtoParameters);
    }

    async findOne(
        conditions?: FindOneOptions<X> | LinqQueryWrapper<X>,
        ...toDtoParameters: any[]
    ): Promise<Y> {
        return await this.baseFindOne(conditions, true, ...toDtoParameters);
    }

    async findAll(
        conditions?: FindManyOptions<X> | LinqMultipleQueryWrapper<X>,
        ...toDtoParameters: any
    ): Promise<Z> {
        if (!this.checkModelOptions()) {
            return null;
        }

        const response = new this.modelOptions.getManyResponse();

        try {
            if (!conditions) {
                conditions = {};
            }

            let entities: X[];
            const useNewLinqRepo = !!(conditions as any).query;
            if (useNewLinqRepo)
                response.filteredResults = await (
                    (conditions as any).query as IQuery<X, X[], X>
                ).count();
            else
                response.filteredResults =
                    await this.modelOptions.repository.count(
                        conditions as FindManyOptions<X>,
                    );

            if (response.filteredResults === 0) {
                response.success = true;
                return response;
            }

            if (useNewLinqRepo) {
                conditions = conditions as LinqMultipleQueryWrapper<X>;
                conditions.query = this.getLinqRelationsFromArray(
                    conditions.query,
                    conditions.relations,
                );
                conditions.query = this.getLinqRelationsFromArray(
                    conditions.query,
                    this.modelOptions.getManyRelationsLinq,
                );
                entities = await conditions.query.toPromise();
            } else {
                const relations: string[] = [];
                if (this.modelOptions.getManyRelations) {
                    relations.push(
                        ...new List(this.modelOptions.getManyRelations)
                            .Distinct()
                            .ToArray(),
                    );
                }
                conditions = conditions as FindManyOptions<X>;
                if (!conditions.relations) {
                    conditions.relations = [];
                }
                conditions.relations = new List([
                    ...conditions.relations,
                    ...relations,
                ])
                    .Distinct()
                    .ToArray();
                // console.log("🚀 ~ conditions.relations", conditions.relations)

                entities = await this.modelOptions.repository.find(conditions);
                // console.log("🚀 ~ entities", entities)
            }

            if (entities) {
                response[this.modelOptions.getManyResponseField] = entities.map(
                    (x) => x.toDto(...toDtoParameters),
                );
            }

            response.success = true;
        } catch (err) {
            response.handleError(err);
        }
        return response;
    }

    private async baseCreateOrUpdate(
        dto: XDTO,
        useDefaultRelations: boolean,
        ...toDtoParameters: any
    ): Promise<Y> {
        if (!this.checkModelOptions()) {
            return null;
        }

        const response = new this.modelOptions.getOneResponse();

        try {
            let entity: X;
            if (!!dto.id) {
                entity = await this.modelOptions.repository.findOne({
                    where: { id: dto.id },
                } as FindOneOptions<X>);
            }

            if (!entity) {
                entity = new this.modelOptions.entity();
            }

            try {
                (response as any).fieldsChangedForSave = [];
                for (const key in dto) {
                    if (Object.prototype.hasOwnProperty.call(dto, key)) {
                        if (dto[key] !== (entity as any)[key]) {
                            (response as any).fieldsChangedForSave.push(key);
                        }
                    }
                }
            } catch (error) {}

            entity.fromDto(dto);
            const entitySaved = await this.modelOptions.repository.save(
                entity as any,
            );

            entity = await this.modelOptions.repository.findOne({
                where: { id: entitySaved.id },
                relations: useDefaultRelations
                    ? this.modelOptions.getOneRelations
                    : [],
            } as FindOneOptions<X>);

            response[this.modelOptions.getOneResponseField] = entity.toDto(
                ...toDtoParameters,
            );

            response.success = true;
        } catch (err) {
            response.handleError(err);
        }
        return response;
    }

    async createOrUpdate(dto: XDTO, ...toDtoParameters: any): Promise<Y> {
        return await this.baseCreateOrUpdate(dto, true, ...toDtoParameters);
    }

    async createOrUpdateWithoutRelations(
        dto: XDTO,
        ...toDtoParameters: any
    ): Promise<Y> {
        return await this.baseCreateOrUpdate(dto, false, ...toDtoParameters);
    }

    public async delete(ids: string[]) {
        if (!this.checkModelOptions()) {
            return null;
        }

        const response = new GenericResponse();

        try {
            if (ids && ids.length > 0) {
                await this.modelOptions.repository.delete(ids);
            }
            response.success = true;
        } catch (err) {
            response.handleError(err);
        }
        return response;
    }

    public async archive(ids: string[]) {
        if (!this.checkModelOptions()) {
            return null;
        }

        const response = new GenericResponse();

        try {
            if (ids && ids.length > 0) {
                const tableName = getManager().getRepository(
                    this.modelOptions.entity,
                ).metadata.tableName;
                const query =
                    'UPDATE `' +
                    tableName +
                    '` SET `' +
                    this.modelOptions.archiveField +
                    '`=' +
                    (this.modelOptions.archiveFieldValue ? '1' : '0') +
                    ' WHERE id IN("' +
                    ids.join('","') +
                    '");';
                await getManager().query(query);
            }
            response.success = true;
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }
}
