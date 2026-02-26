import { Repository } from 'typeorm';
import { AppImage } from '../entities/app-image.entity';
import { AppImageDto } from '../models/dto/app-image-dto';
import { GetAppImageResponse, GetAppImagesResponse } from '../models/responses/app-image-responses';
import { ApplicationBaseModelService } from './base-model.service';
export declare class ImagesService extends ApplicationBaseModelService<AppImage, AppImageDto, GetAppImageResponse, GetAppImagesResponse> {
    private readonly imagesRepository;
    constructor(imagesRepository: Repository<AppImage>);
}
