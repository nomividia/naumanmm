import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppImage } from '../entities/app-image.entity';
import { AppImageDto } from '../models/dto/app-image-dto';
import {
    GetAppImageResponse,
    GetAppImagesResponse,
} from '../models/responses/app-image-responses';
import { ApplicationBaseModelService } from './base-model.service';

@Injectable()
export class ImagesService extends ApplicationBaseModelService<
    AppImage,
    AppImageDto,
    GetAppImageResponse,
    GetAppImagesResponse
> {
    constructor(
        @InjectRepository(AppImage)
        private readonly imagesRepository: Repository<AppImage>,
    ) {
        super();
        this.modelOptions = {
            getManyResponse: GetAppImagesResponse as any,
            getOneResponse: GetAppImageResponse as any,
            getManyResponseField: 'images',
            getOneResponseField: 'image',
            repository: this.imagesRepository,
            entity: AppImage as any,
        };
    }
}
