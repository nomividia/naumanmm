import { AppImageDto } from '../dto/app-image-dto';
import { BaseSearchResponse } from './base-search-responses';
import { GenericResponse } from './generic-response';
export declare class GetAppImageResponse extends GenericResponse {
    image: AppImageDto;
}
export declare class GetAppImagesResponse extends BaseSearchResponse {
    images: AppImageDto[];
}
declare class ResizeImageOptions {
    width?: number;
    height?: number;
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
    position?: string;
    toBuffer?: boolean;
}
export declare class ResizeAppImageRequest {
    image: AppImageDto;
    options: ResizeImageOptions;
}
export {};
