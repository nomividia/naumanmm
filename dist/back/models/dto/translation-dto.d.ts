import { AppTypeDto } from './app-type-dto';
import { AppValueDto } from './app-value-dto';
import { LanguageDto } from './language-dto';
import { UserDto } from './user-dto';
export declare class TranslationDto {
    id?: string;
    entityField: string;
    languageId: string;
    language: LanguageDto;
    value: string;
    userId?: string;
    user?: UserDto;
    appValueId?: string;
    appValue?: AppValueDto;
    appTypeId?: string;
    appType?: AppTypeDto;
}
