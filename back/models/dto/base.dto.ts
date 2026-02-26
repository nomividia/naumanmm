import { ApiPropertyOptional } from '@nestjs/swagger';
export abstract class BaseDto {
    @ApiPropertyOptional()
    id?: string;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    creationDate?: Date;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    modifDate?: Date;

    @ApiPropertyOptional()
    disabled?: boolean;
}
