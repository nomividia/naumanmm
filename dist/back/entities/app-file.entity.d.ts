import { AppFileType } from '../../shared/shared-constants';
import { AppFileDto } from '../models/dto/app-file-dto';
import { BaseFile } from './base-file.entity';
export declare class AppFile extends BaseFile {
    externalId?: string;
    fileType?: AppFileType;
    externalFilePath?: string;
    toDto(): AppFileDto;
    fromDto(dto: AppFileDto): void;
}
