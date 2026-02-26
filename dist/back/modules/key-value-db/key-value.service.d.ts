import { Repository } from 'typeorm';
import { GenericResponse } from '../../models/responses/generic-response';
import { ApplicationBaseModelService } from '../../services/base-model.service';
import { GetKeyValueResponse, GetKeyValuesResponse, KeyValueDto } from './key-value-dto';
import { KeyValue } from './key-value.entity';
export declare class KeyValueService extends ApplicationBaseModelService<KeyValue, KeyValueDto, GetKeyValueResponse, GetKeyValuesResponse> {
    private readonly repository;
    private cacheEnabled;
    constructor(repository: Repository<KeyValue>);
    getMultipleKeyValues(keys: string[]): Promise<KeyValueDto[]>;
    getKeyValue(key: string): Promise<string>;
    saveKeyValue(key: string, value: any, frontEditable?: boolean): Promise<GetKeyValueResponse>;
    createOrUpdate(keyValueDto: KeyValueDto): Promise<GetKeyValueResponse>;
    delete(ids: string[]): Promise<GenericResponse>;
}
