import { TranslationDto } from '../models/dto/translation-dto';
import { AppLanguage } from './app-language.entity';
import { AppType } from './app-type.entity';
import { AppValue } from './app-value.entity';
import { User } from './user.entity';
export declare class Translation {
    id: string;
    entityField: string;
    language: AppLanguage;
    languageId: string;
    value: string;
    user: User;
    userId: string;
    appValue?: AppValue;
    appValueId?: string;
    appType?: AppType;
    appTypeId?: string;
    toDto(): TranslationDto;
    fromDto(dto: TranslationDto): void;
}
