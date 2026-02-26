import { GenericResponse } from '../../models/responses/generic-response';
import { BaseController } from '../../shared/base.controller';
import { GetKeyValueResponse, GetKeyValuesRequest, GetKeyValuesResponse, KeyValueDto } from './key-value-dto';
import { KeyValueService } from './key-value.service';
export declare class KeyValueController extends BaseController {
    private keyValueService;
    constructor(keyValueService: KeyValueService);
    getAll(request: GetKeyValuesRequest): Promise<GetKeyValuesResponse>;
    saveKeyValue(dto: KeyValueDto): Promise<GetKeyValueResponse>;
    deleteKeyValues(ids: string): Promise<GenericResponse>;
}
