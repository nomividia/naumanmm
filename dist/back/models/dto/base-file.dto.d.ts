import { BaseDto } from './base.dto';
export declare class BaseFileDto extends BaseDto {
    name: string;
    size?: number;
    mimeType: string;
    physicalName?: string;
}
