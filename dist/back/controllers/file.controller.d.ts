import { GenericResponse } from '../models/responses/generic-response';
import { BaseController } from '../shared/base.controller';
export declare class FileController extends BaseController {
    constructor();
    handleFileUpload(file: {
        filename: string;
        originalname: string;
        mimetype: string;
        destination: string;
        path: string;
        size: number;
    }): GenericResponse;
}
