import { ApiProperty } from '@nestjs/swagger';
import { BaseFileDto } from './base-file.dto';

export class AppImageDto extends BaseFileDto {
    @ApiProperty()
    public width: number;

    @ApiProperty()
    public height: number;
}
