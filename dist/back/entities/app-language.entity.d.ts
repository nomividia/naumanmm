import { LanguageDto } from '../models/dto/language-dto';
export declare class AppLanguage {
    id: string;
    code: string;
    label: string;
    icon: string;
    toDto(): LanguageDto;
    fromDto(dto: LanguageDto): void;
}
