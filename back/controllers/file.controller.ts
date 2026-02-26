import {
    Controller,
    HttpCode,
    Post,
    UploadedFile,
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
import { extname } from 'path';
import { Environment } from '../environment/environment';
import { GenericResponse } from '../models/responses/generic-response';
import { BaseController } from '../shared/base.controller';

@Controller('file')
@ApiTags('file')
export class FileController extends BaseController {
    constructor() {
        super();
    }

    // TODO
    // @UseGuards(RolesGuard)
    // @Roles(RolesList.Admin)
    @ApiBearerAuth()
    @Post()
    @ApiOperation({ summary: 'upload file', operationId: 'upload' })
    @ApiResponse({
        status: 200,
        description: 'upload file',
        type: GenericResponse,
    })
    @HttpCode(200)
    @UseInterceptors(
        FileFastifyInterceptor('file', {
            storage: diskStorage({
                destination: (req: any, file: any, callback: any) => {
                    callback(null, Environment.UploadedFilesTempDirectory);
                },
                filename: (req: any, file: any, cb: any) => {
                    // console.log(': FileController -> req', req.body.Guid);
                    //const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
                    // return cb(null, `${randomName}${extname(file.originalname)}`);
                    return cb(
                        null,
                        `${MainHelpers.generateGuid()}${extname(
                            file.originalname,
                        )}`,
                    );
                },
            }),
        }),
    )
    handleFileUpload(
        @UploadedFile()
        file: {
            filename: string;
            originalname: string;
            mimetype: string;
            destination: string;
            path: string;
            size: number;
        },
    ): GenericResponse {
        // console.log("Log ~ file: file.controller.ts:46 ~ FileController ~ handleFileUpload ~ file", file);
        // const fullPath = path.join('.', file.path);
        // console.log(': FileController -> fullPath', fullPath);
        const response = new GenericResponse();

        response.success = true;
        response.message = JSON.stringify({
            filename: file.filename,
            originalname: file.originalname,
        });

        return response;
    }
}
