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
exports.ImagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const app_image_entity_1 = require("../entities/app-image.entity");
const app_image_responses_1 = require("../models/responses/app-image-responses");
const base_model_service_1 = require("./base-model.service");
let ImagesService = class ImagesService extends base_model_service_1.ApplicationBaseModelService {
    constructor(imagesRepository) {
        super();
        this.imagesRepository = imagesRepository;
        this.modelOptions = {
            getManyResponse: app_image_responses_1.GetAppImagesResponse,
            getOneResponse: app_image_responses_1.GetAppImageResponse,
            getManyResponseField: 'images',
            getOneResponseField: 'image',
            repository: this.imagesRepository,
            entity: app_image_entity_1.AppImage,
        };
    }
};
ImagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(app_image_entity_1.AppImage)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ImagesService);
exports.ImagesService = ImagesService;
//# sourceMappingURL=images.service.js.map