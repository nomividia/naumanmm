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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const fastify_file_interceptor_1 = require("fastify-file-interceptor");
const multer_1 = require("multer");
const nextalys_js_helpers_1 = require("nextalys-js-helpers");
const nextalys_node_helpers_1 = require("nextalys-node-helpers");
const image_helpers_1 = require("nextalys-node-helpers/dist/image-helpers");
const path = require("path");
const typeorm_1 = require("typeorm");
const shared_constants_1 = require("../../shared/shared-constants");
const environment_1 = require("../environment/environment");
const app_error_1 = require("../models/app-error");
const app_image_dto_1 = require("../models/dto/app-image-dto");
const base_search_requests_1 = require("../models/requests/base-search-requests");
const app_image_responses_1 = require("../models/responses/app-image-responses");
const generic_response_1 = require("../models/responses/generic-response");
const roles_guard_1 = require("../services/guards/roles-guard");
const images_service_1 = require("../services/images.service");
const roles_decorator_1 = require("../services/roles.decorator");
const base_controller_1 = require("../shared/base.controller");
let ImageController = class ImageController extends base_controller_1.BaseController {
    constructor(imagesService) {
        super();
        this.imagesService = imagesService;
    }
    getAll(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOptions = base_search_requests_1.BaseSearchRequest.getDefaultFindOptions(request);
            if (request.search) {
                findOptions.where = {
                    name: (0, typeorm_1.Like)('%' + request.search + '%'),
                };
            }
            return yield this.imagesService.findAll(findOptions);
        });
    }
    handleFileUpload(file) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = new app_image_responses_1.GetAppImageResponse();
            try {
                const appImage = new app_image_dto_1.AppImageDto();
                appImage.mimeType = file.mimetype;
                appImage.name = file.filename;
                appImage.physicalName = file.filename;
                appImage.size = file.size;
                const info = yield image_helpers_1.ImageHelpers.getImageInfo(file.path);
                appImage.width = info.width;
                appImage.height = info.height;
                response = yield this.imagesService.createOrUpdate(appImage);
            }
            catch (err) {
                response.handleError(err);
            }
            if (!response.success) {
                throw new app_error_1.AppError('Unable to save image', 500);
            }
            return response;
        });
    }
    resizeImage(request) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = new app_image_responses_1.GetAppImageResponse();
            try {
                const imagesFolder = environment_1.Environment.PublicImagesFolder;
                const filePath = path.join(imagesFolder, request.image.physicalName);
                const output = filePath + '_resized';
                const resizeResponse = yield image_helpers_1.ImageHelpers.resizeImage(filePath, request.options, output);
                yield nextalys_node_helpers_1.FileHelpers.removeFile(filePath);
                const renameResponse = yield nextalys_node_helpers_1.FileHelpers.renameFile(output, filePath);
                request.image.width = resizeResponse.width;
                request.image.height = resizeResponse.height;
                response = yield this.imagesService.createOrUpdate(request.image);
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    deleteImages(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const imagesResponse = yield this.imagesService.findAll({
                where: { id: (0, typeorm_1.In)(ids.split(',')) },
            });
            const imagesFolder = environment_1.Environment.PublicImagesFolder;
            if (imagesResponse.success) {
                for (const image of imagesResponse.images) {
                    const filePath = path.join(imagesFolder, image.physicalName);
                    yield nextalys_node_helpers_1.FileHelpers.removeFile(filePath);
                }
            }
            return yield this.imagesService.delete(ids.split(','));
        });
    }
};
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'get all images',
        operationId: 'getAllLibraryImages',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'get all images response',
        type: app_image_responses_1.GetAppImagesResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_search_requests_1.BaseSearchRequest]),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "getAll", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'upload image', operationId: 'uploadImage' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'upload image',
        type: app_image_responses_1.GetAppImageResponse,
    }),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseInterceptors)((0, fastify_file_interceptor_1.FileFastifyInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, callback) => {
                callback(null, environment_1.Environment.PublicImagesFolder);
            },
            filename: (req, file, cb) => __awaiter(void 0, void 0, void 0, function* () {
                const imagesFolder = environment_1.Environment.PublicImagesFolder;
                const ext = nextalys_js_helpers_1.MainHelpers.getFileExtension(file.originalname);
                const fileNameWithoutExt = nextalys_js_helpers_1.MainHelpers.getFileWithoutExtension(file.originalname);
                let fileName = nextalys_js_helpers_1.MainHelpers.formatToUrl(fileNameWithoutExt) + '.' + ext;
                let counter = 2;
                while (yield nextalys_node_helpers_1.FileHelpers.fileExists(path.join(imagesFolder, fileName))) {
                    fileName =
                        fileNameWithoutExt + '_' + counter + '.' + ext;
                    counter++;
                }
                return cb(null, `${fileName}`);
            }),
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "handleFileUpload", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('resizeImage'),
    (0, swagger_1.ApiOperation)({ summary: 'resizeImage', operationId: 'resizeImage' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'resizeImage',
        type: app_image_responses_1.GetAppImageResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [app_image_responses_1.ResizeAppImageRequest]),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "resizeImage", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(shared_constants_1.RolesList.Admin),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(),
    (0, swagger_1.ApiOperation)({ summary: 'deleteImages', operationId: 'deleteImages' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'deleteImages',
        type: generic_response_1.GenericResponse,
    }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "deleteImages", null);
ImageController = __decorate([
    (0, common_1.Controller)('image'),
    (0, swagger_1.ApiTags)('image'),
    __metadata("design:paramtypes", [images_service_1.ImagesService])
], ImageController);
exports.ImageController = ImageController;
//# sourceMappingURL=image.controller.js.map