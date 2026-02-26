import { ApiPropertyOptional } from '@nestjs/swagger';
import { AppFileType } from '../../../shared/shared-constants';
import { BaseFileDto } from './base-file.dto';

export class AppFileDto extends BaseFileDto {
    @ApiPropertyOptional()
    externalId?: string;

    @ApiPropertyOptional({ type: String })
    fileType?: AppFileType;

    @ApiPropertyOptional({ type: String })
    externalFilePath?: string;
}
