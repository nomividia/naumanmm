import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Post,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { FileFastifyInterceptor } from 'fastify-file-interceptor';
import { diskStorage } from 'multer';
import { MainHelpers } from 'nextalys-js-helpers';
import { FileHelpers } from 'nextalys-node-helpers';
import { ImageHelpers } from 'nextalys-node-helpers/dist/image-helpers';
import * as path from 'path';
import { In, Like } from 'typeorm';
import { RolesList } from '../../shared/shared-constants';
import { AppImage } from '../entities/app-image.entity';
import { Environment } from '../environment/environment';
import { AppError } from '../models/app-error';
import { AppImageDto } from '../models/dto/app-image-dto';
import { BaseSearchRequest } from '../models/requests/base-search-requests';
import {
    GetAppImageResponse,
    GetAppImagesResponse,
    ResizeAppImageRequest,
} from '../models/responses/app-image-responses';
import { GenericResponse } from '../models/responses/generic-response';
import { RolesGuard } from '../services/guards/roles-guard';
import { ImagesService } from '../services/images.service';
import { Roles } from '../services/roles.decorator';
import { BaseController } from '../shared/base.controller';

@Controller('image')
@ApiTags('image')
export class ImageController extends BaseController {
    constructor(private imagesService: ImagesService) {
        super();
    }

    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @Get()
    @ApiOperation({
        summary: 'get all images',
        operationId: 'getAllLibraryImages',
    })
    @ApiResponse({
        status: 200,
        description: 'get all images response',
        type: GetAppImagesResponse,
    })
    @HttpCode(200)
    async getAll(@Query() request: BaseSearchRequest) {
        const findOptions =
            BaseSearchRequest.getDefaultFindOptions<AppImage>(request);

        if (request.search) {
            findOptions.where = {
                name: Like('%' + request.search + '%'),
            };
        }

        return await this.imagesService.findAll(findOptions);
    }

    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @Post()
    @ApiOperation({ summary: 'upload image', operationId: 'uploadImage' })
    @ApiResponse({
        status: 200,
        description: 'upload image',
        type: GetAppImageResponse,
    })
    @HttpCode(200)
    @UseInterceptors(
        FileFastifyInterceptor('file', {
            storage: diskStorage({
                destination: (req: any, file: any, callback: any) => {
                    callback(null, Environment.PublicImagesFolder);
                },
                filename: async (req: any, file: any, cb: any) => {
                    // console.log(': FileController -> req', req.body.Guid);
                    //const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
                    // return cb(null, `${randomName}${extname(file.originalname)}`);
                    const imagesFolder = Environment.PublicImagesFolder;
                    const ext = MainHelpers.getFileExtension(file.originalname);
                    const fileNameWithoutExt =
                        MainHelpers.getFileWithoutExtension(file.originalname);
                    let fileName =
                        MainHelpers.formatToUrl(fileNameWithoutExt) + '.' + ext;
                    let counter = 2;

                    while (
                        await FileHelpers.fileExists(
                            path.join(imagesFolder, fileName),
                        )
                    ) {
                        fileName =
                            fileNameWithoutExt + '_' + counter + '.' + ext;
                        counter++;
                    }

                    return cb(null, `${fileName}`);
                },
            }),
        }),
    )
    async handleFileUpload(
        @UploadedFile()
        file: {
            filename: string;
            originalname: string;
            mimetype: string;
            destination: string;
            path: string;
            size: number;
        },
    ): Promise<GetAppImageResponse> {
        // const fullPath = path.join('.', file.path);
        // console.log(': FileController -> fullPath', fullPath);
        let response = new GetAppImageResponse();

        try {
            const appImage = new AppImageDto();

            appImage.mimeType = file.mimetype;
            appImage.name = file.filename;
            appImage.physicalName = file.filename;
            appImage.size = file.size;

            const info = await ImageHelpers.getImageInfo(file.path);

            appImage.width = info.width;
            appImage.height = info.height;

            response = await this.imagesService.createOrUpdate(appImage);
        } catch (err) {
            response.handleError(err);
        }

        if (!response.success) {
            throw new AppError('Unable to save image', 500);
        }

        // response.message = JSON.stringify({ filename: file.filename, originalname: file.originalname });
        return response;
    }

    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @Post('resizeImage')
    @ApiOperation({ summary: 'resizeImage', operationId: 'resizeImage' })
    @ApiResponse({
        status: 200,
        description: 'resizeImage',
        type: GetAppImageResponse,
    })
    @HttpCode(200)
    async resizeImage(@Body() request: ResizeAppImageRequest) {
        let response = new GetAppImageResponse();

        try {
            const imagesFolder = Environment.PublicImagesFolder;
            const filePath = path.join(
                imagesFolder,
                request.image.physicalName,
            );
            const output = filePath + '_resized';
            const resizeResponse = await ImageHelpers.resizeImage(
                filePath,
                request.options,
                output,
            );

            await FileHelpers.removeFile(filePath);

            const renameResponse = await FileHelpers.renameFile(
                output,
                filePath,
            );

            request.image.width = resizeResponse.width;
            request.image.height = resizeResponse.height;
            response = await this.imagesService.createOrUpdate(request.image);
        } catch (err) {
            response.handleError(err);
        }

        return response;
    }

    @UseGuards(RolesGuard)
    @Roles(RolesList.Admin)
    @ApiBearerAuth()
    @Delete()
    @ApiOperation({ summary: 'deleteImages', operationId: 'deleteImages' })
    @ApiResponse({
        status: 200,
        description: 'deleteImages',
        type: GenericResponse,
    })
    @HttpCode(200)
    async deleteImages(@Query('ids') ids: string): Promise<GenericResponse> {
        const imagesResponse = await this.imagesService.findAll({
            where: { id: In(ids.split(',')) },
        });
        const imagesFolder = Environment.PublicImagesFolder;

        if (imagesResponse.success) {
            for (const image of imagesResponse.images) {
                const filePath = path.join(imagesFolder, image.physicalName);
                await FileHelpers.removeFile(filePath);
            }
        }

        return await this.imagesService.delete(ids.split(','));
    }
}
