import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CacheManager } from '../../../shared/cache-manager';
import { AppErrorWithMessage } from '../../models/app-error';
import { GenericResponse } from '../../models/responses/generic-response';
import { ApplicationBaseModelService } from '../../services/base-model.service';
import { BackCacheManager } from '../../services/tools/back-cache-manager';
import {
    GetKeyValueResponse,
    GetKeyValuesResponse,
    KeyValueDto,
} from './key-value-dto';
import { KeyValue } from './key-value.entity';

const appKeyValuesKey = 'appKeyValues';

@Injectable()
export class KeyValueService extends ApplicationBaseModelService<
    KeyValue,
    KeyValueDto,
    GetKeyValueResponse,
    GetKeyValuesResponse
> {
    private cacheEnabled = false;

    constructor(
        @InjectRepository(KeyValue)
        private readonly repository: Repository<KeyValue>,
    ) {
        super();

        this.modelOptions = {
            getManyResponse: GetKeyValuesResponse,
            getOneResponse: GetKeyValueResponse,
            getManyResponseField: 'keyValues',
            getOneResponseField: 'keyValue',
            repository: this.repository,
            entity: KeyValue,
        };

        BackCacheManager.init();
    }

    async getMultipleKeyValues(keys: string[]) {
        if (this.cacheEnabled) {
            return await CacheManager.getDataFromCache<KeyValueDto>(
                keys,
                appKeyValuesKey,
                'key',
                (keysToLoad: string[]) =>
                    this.findAll({ where: { key: In(keysToLoad) } }),
                'keyValues',
                '1',
                6,
            );
        } else {
            const dbResponse = await this.findAll({ where: { key: In(keys) } });
            if (dbResponse.success) {
                return dbResponse.keyValues;
            }
        }

        return [];
    }

    async getKeyValue(key: string) {
        const response = await this.getMultipleKeyValues([key]);

        if (response && response.length > 0) {
            return response[0].value;
        }

        return null;
    }

    async saveKeyValue(key: string, value: any, frontEditable = true) {
        let keyValue: KeyValueDto = { key, frontEditable: frontEditable };
        const keyValueResponse = await this.findOne({ where: { key } });

        if (keyValueResponse.keyValue) {
            keyValue = keyValueResponse.keyValue;
        }

        if (!!value && typeof value !== 'string' && typeof value !== 'number') {
            value = JSON.stringify(value);
        }

        keyValue.value = value;
        keyValue.frontEditable = frontEditable;

        return await this.createOrUpdate(keyValue);
    }

    async createOrUpdate(
        keyValueDto: KeyValueDto,
    ): Promise<GetKeyValueResponse> {
        let response = new GetKeyValueResponse();

        try {
            if (!keyValueDto.id) {
                const keyValueResponse = await this.findOne({
                    where: { key: keyValueDto.key },
                });

                if (keyValueResponse.keyValue) {
                    throw new AppErrorWithMessage(
                        'Un enregistrement existe déjà avec cette clé !',
                    );
                }
            }

            response = await super.createOrUpdate(keyValueDto);

            await CacheManager.removeFromCache<KeyValueDto>(
                [keyValueDto.key],
                appKeyValuesKey,
                'key',
            );
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    public async delete(ids: string[]) {
        if (!ids || ids.length === 0) {
            return new GenericResponse(true);
        }

        const results = await this.findAll({ where: { id: In(ids) } });

        await CacheManager.removeFromCache<KeyValueDto>(
            results.keyValues.map((x) => x.key),
            appKeyValuesKey,
            'key',
        );

        return await super.delete(ids);
    }
}
