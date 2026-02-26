import { AppImageDto } from '../models/dto/app-image-dto';
import { BaseFile } from './base-file.entity';
export declare class AppImage extends BaseFile {
    width: number;
    height: number;
    toDto(): AppImageDto;
    fromDto(dto: AppImageDto): void;
}
