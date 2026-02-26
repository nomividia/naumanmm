import { ApiProperty } from '@nestjs/swagger';
import { LanguageDto } from '../dto/language-dto';
import { GenericResponse } from './generic-response';

export class GetLanguagesResponse extends GenericResponse {
    @ApiProperty({ type: () => LanguageDto, isArray: true })
    languages: LanguageDto[] = [];
}

export class GetLanguageResponse extends GenericResponse {
    @ApiProperty()
    language: LanguageDto;
}
