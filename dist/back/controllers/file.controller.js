"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const fastify_file_interceptor_1 = require("fastify-file-interceptor");
const multer_1 = require("multer");
const nextalys_js_helpers_1 = require("nextalys-js-helpers");
const path_1 = require("path");
const environment_1 = require("../environment/environment");
const generic_response_1 = require("../models/responses/generic-response");
const base_controller_1 = require("../shared/base.controller");
let FileController = class FileController extends base_controller_1.BaseController {
    constructor() {
        super();
    }
    handleFileUpload(file) {
        const response = new generic_response_1.GenericResponse();
        response.success = true;
        response.message = JSON.stringify({
            filename: file.filename,
            originalname: file.originalname,
        });
        return response;
    }
};
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'upload file', operationId: 'upload' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'upload file',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseInterceptors)((0, fastify_file_interceptor_1.FileFastifyInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, callback) => {
                callback(null, environment_1.Environment.UploadedFilesTempDirectory);
            },
            filename: (req, file, cb) => {
                return cb(null, `${nextalys_js_helpers_1.MainHelpers.generateGuid()}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", generic_response_1.GenericResponse)
], FileController.prototype, "handleFileUpload", null);
FileController = __decorate([
    (0, common_1.Controller)('file'),
    (0, swagger_1.ApiTags)('file'),
    __metadata("design:paramtypes", [])
], FileController);
exports.FileController = FileController;
//# sourceMappingURL=file.controller.js.map