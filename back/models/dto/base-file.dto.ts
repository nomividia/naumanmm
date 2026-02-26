import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseDto } from './base.dto';

export class BaseFileDto extends BaseDto {
    @ApiProperty()
    name: string;

    @ApiPropertyOptional()
    size?: number;

    @ApiProperty()
    mimeType: string;

    @ApiPropertyOptional()
    physicalName?: string;
}
