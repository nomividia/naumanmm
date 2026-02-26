import { GenericResponse } from '../responses/generic-response';
import { AppTypeDto } from './app-type-dto';
import { TranslationDto } from './translation-dto';
export declare class AppValueDto {
    id?: string;
    label: string;
    order?: number;
    code: string;
    appType: AppTypeDto;
    appTypeId: string;
    enabled: boolean;
    translations?: TranslationDto[];
}
export declare class GetAppValuesResponse extends GenericResponse {
    appValues: AppValueDto[];
}
export declare class GetAppValueResponse extends GenericResponse {
    appValue: AppValueDto;
}
export declare class MultipleAppValuesRequest {
    ids?: string[];
    codes?: string[];
}
