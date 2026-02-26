import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LanguageDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiProperty()
    label: string;

    @ApiProperty()
    code: string;

    @ApiPropertyOptional()
    icon?: string;
}
