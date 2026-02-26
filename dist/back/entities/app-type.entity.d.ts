import { AppTypeDto } from '../models/dto/app-type-dto';
import { AppValue } from './app-value.entity';
import { Translation } from './translation.entity';
export declare class AppType {
    id: string;
    label: string;
    code: string;
    appValues: AppValue[];
    translations: Translation[];
    toDto(): AppTypeDto;
    fromDto(dto: AppTypeDto, mapAppValues: boolean): void;
}
