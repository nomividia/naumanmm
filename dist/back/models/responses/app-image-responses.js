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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResizeAppImageRequest = exports.GetAppImagesResponse = exports.GetAppImageResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
const app_image_dto_1 = require("../dto/app-image-dto");
const base_search_responses_1 = require("./base-search-responses");
const generic_response_1 = require("./generic-response");
class GetAppImageResponse extends generic_response_1.GenericResponse {
    constructor() {
        super(...arguments);
        this.image = null;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => app_image_dto_1.AppImageDto }),
    __metadata("design:type", app_image_dto_1.AppImageDto)
], GetAppImageResponse.prototype, "image", void 0);
exports.GetAppImageResponse = GetAppImageResponse;
class GetAppImagesResponse extends base_search_responses_1.BaseSearchResponse {
    constructor() {
        super(...arguments);
        this.images = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => app_image_dto_1.AppImageDto, isArray: true }),
    __metadata("design:type", Array)
], GetAppImagesResponse.prototype, "images", void 0);
exports.GetAppImagesResponse = GetAppImagesResponse;
class ResizeImageOptions {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], ResizeImageOptions.prototype, "width", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], ResizeImageOptions.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String }),
    __metadata("design:type", String)
], ResizeImageOptions.prototype, "fit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ResizeImageOptions.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], ResizeImageOptions.prototype, "toBuffer", void 0);
class ResizeAppImageRequest {
    constructor() {
        this.image = null;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => app_image_dto_1.AppImageDto }),
    __metadata("design:type", app_image_dto_1.AppImageDto)
], ResizeAppImageRequest.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => ResizeImageOptions }),
    __metadata("design:type", ResizeImageOptions)
], ResizeAppImageRequest.prototype, "options", void 0);
exports.ResizeAppImageRequest = ResizeAppImageRequest;
//# sourceMappingURL=app-image-responses.js.map