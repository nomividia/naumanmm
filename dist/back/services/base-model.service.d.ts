import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
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
export declare abstract class ApplicationBaseModelService<X extends {
    id: string | number;
    toDto: (...args: any) => any;
    fromDto: (dto: XDTO) => any;
} = undefined, XDTO extends {
    id?: string | number;
} = undefined, Y extends GenericResponse = undefined, Z extends BaseSearchResponse = undefined> extends ApplicationBaseService {
    modelOptions: ModelOptions<X, Y, Z>;
    constructor();
    getRepository(): Repository<X>;
    private checkModelOptions;
    private getLinqRelationsFromArray;
    private baseFindOne;
    findOneWithoutRelations(conditions?: FindOneOptions<X> | LinqQueryWrapper<X>, ...toDtoParameters: any[]): Promise<Y>;
    findOne(conditions?: FindOneOptions<X> | LinqQueryWrapper<X>, ...toDtoParameters: any[]): Promise<Y>;
    findAll(conditions?: FindManyOptions<X> | LinqMultipleQueryWrapper<X>, ...toDtoParameters: any): Promise<Z>;
    private baseCreateOrUpdate;
    createOrUpdate(dto: XDTO, ...toDtoParameters: any): Promise<Y>;
    createOrUpdateWithoutRelations(dto: XDTO, ...toDtoParameters: any): Promise<Y>;
    delete(ids: string[]): Promise<GenericResponse>;
    archive(ids: string[]): Promise<GenericResponse>;
}
export {};
