import { AppValueDto } from '../models/dto/app-value-dto';
import { AppType } from './app-type.entity';
import { Translation } from './translation.entity';
export declare class AppValue {
    id: string;
    label: string;
    order?: number;
    enabled: boolean;
    code: string;
    appType?: AppType;
    appTypeId: string;
    translations: Translation[];
    toDto(): AppValueDto;
    fromDto(dto: AppValueDto): void;
}
