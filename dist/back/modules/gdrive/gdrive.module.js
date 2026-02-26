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
exports.GDriveModule = void 0;
const common_1 = require("@nestjs/common");
const base_google_service_1 = require("../../services/base-google-service");
const events_handler_1 = require("../../services/tools/events-handler");
const app_common_module_1 = require("../../shared/app-common.module");
const file_module_1 = require("../file/file.module");
const gcloud_storage_service_1 = require("./gcloud-storage-service");
const gdrive_controller_1 = require("./gdrive.controller");
const gdrive_service_1 = require("./gdrive.service");
let GDriveModule = class GDriveModule {
    constructor(gCloudStorageService) {
        this.gCloudStorageService = gCloudStorageService;
        this.initialized = false;
        this.initializing = false;
        events_handler_1.EventsHandler.initGdriveModule.subscribe(() => {
            this.init();
        });
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.initialized || this.initializing)
                return;
            this.initializing = true;
            yield this.gCloudStorageService.createMainBucketIfNotExists();
            this.initialized = base_google_service_1.BaseGoogleService.initialized;
            this.initializing = false;
        });
    }
};
GDriveModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => app_common_module_1.AppCommonModule),
            (0, common_1.forwardRef)(() => file_module_1.FileModule),
        ],
        controllers: [
            gdrive_controller_1.GDriveController,
        ],
        providers: [
            gdrive_service_1.GDriveService,
            gcloud_storage_service_1.GCloudStorageService,
        ],
        exports: [
            gdrive_service_1.GDriveService,
            gcloud_storage_service_1.GCloudStorageService,
        ],
    }),
    __metadata("design:paramtypes", [gcloud_storage_service_1.GCloudStorageService])
], GDriveModule);
exports.GDriveModule = GDriveModule;
//# sourceMappingURL=gdrive.module.js.map