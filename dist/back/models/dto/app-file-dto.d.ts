import { AppFileType } from '../../../shared/shared-constants';
import { BaseFileDto } from './base-file.dto';
export declare class AppFileDto extends BaseFileDto {
    externalId?: string;
    fileType?: AppFileType;
    externalFilePath?: string;
}
