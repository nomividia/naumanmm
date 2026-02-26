import { FindManyOptions } from 'typeorm';
import { IQuery } from 'typeorm-linq-repository';
export declare class BaseSearchRequest {
    start?: number;
    length?: number;
    orderby?: string;
    order?: 'asc' | 'desc';
    search?: string;
    static getDefaultFindOptions<T>(request: BaseSearchRequest, orderbyExcepts?: string[]): FindManyOptions<T>;
    static getLinqOrderByMethod<T extends {
        id?: string;
    }>(orderby: string, order: 'ASC' | 'DESC', query: IQuery<T, T[], T>): IQuery<T, T[], T>;
    static getDefaultFindOptionsLinq<T extends {
        id?: string;
    }>(request: BaseSearchRequest, entityType: new () => T): IQuery<T, T[], T>;
}
