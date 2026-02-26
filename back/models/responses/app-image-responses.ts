import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppImageDto } from '../dto/app-image-dto';
import { BaseSearchResponse } from './base-search-responses';
import { GenericResponse } from './generic-response';

export class GetAppImageResponse extends GenericResponse {
    @ApiProperty({ type: () => AppImageDto })
    image: AppImageDto = null;
}

export class GetAppImagesResponse extends BaseSearchResponse {
    @ApiProperty({ type: () => AppImageDto, isArray: true })
    images: AppImageDto[] = [];
}

class ResizeImageOptions {
    @ApiPropertyOptional()
    width?: number;

    @ApiPropertyOptional()
    height?: number;

    @ApiPropertyOptional({ type: String })
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';

    @ApiPropertyOptional()
    position?: string;

    @ApiPropertyOptional()
    toBuffer?: boolean;
}
export class ResizeAppImageRequest {
    @ApiProperty({ type: () => AppImageDto })
    image: AppImageDto = null;

    @ApiProperty({ type: () => ResizeImageOptions })
    options: ResizeImageOptions;
}
