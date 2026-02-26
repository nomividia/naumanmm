import { BaseSearchRequest } from '../models/requests/base-search-requests';
import { GetAppImageResponse, GetAppImagesResponse, ResizeAppImageRequest } from '../models/responses/app-image-responses';
import { GenericResponse } from '../models/responses/generic-response';
import { ImagesService } from '../services/images.service';
import { BaseController } from '../shared/base.controller';
export declare class ImageController extends BaseController {
    private imagesService;
    constructor(imagesService: ImagesService);
    getAll(request: BaseSearchRequest): Promise<GetAppImagesResponse>;
    handleFileUpload(file: {
        filename: string;
        originalname: string;
        mimetype: string;
        destination: string;
        path: string;
        size: number;
    }): Promise<GetAppImageResponse>;
    resizeImage(request: ResizeAppImageRequest): Promise<GetAppImageResponse>;
    deleteImages(ids: string): Promise<GenericResponse>;
}
