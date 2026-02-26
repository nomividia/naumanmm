import { LanguageDto } from '../dto/language-dto';
import { GenericResponse } from './generic-response';
export declare class GetLanguagesResponse extends GenericResponse {
    languages: LanguageDto[];
}
export declare class GetLanguageResponse extends GenericResponse {
    language: LanguageDto;
}
