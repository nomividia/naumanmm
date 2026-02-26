import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppTypeDto } from './app-type-dto';
import { AppValueDto } from './app-value-dto';
import { LanguageDto } from './language-dto';
import { UserDto } from './user-dto';
export class TranslationDto {
    @ApiPropertyOptional()
    public id?: string;

    @ApiProperty()
    public entityField: string;

    @ApiProperty()
    languageId: string;

    @ApiProperty()
    language: LanguageDto;

    @ApiProperty()
    public value: string;

    //Entities
    @ApiPropertyOptional()
    public userId?: string;

    @ApiPropertyOptional({ type: () => UserDto })
    public user?: UserDto;

    @ApiPropertyOptional()
    public appValueId?: string;

    @ApiPropertyOptional({ type: () => AppValueDto })
    public appValue?: AppValueDto;

    @ApiPropertyOptional()
    public appTypeId?: string;

    @ApiPropertyOptional({ type: () => AppTypeDto })
    public appType?: AppTypeDto;
}
