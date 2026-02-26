import { forwardRef, Module } from "@nestjs/common";
import { BaseGoogleService } from "../../services/base-google-service";
import { EventsHandler } from "../../services/tools/events-handler";
import { AppCommonModule } from "../../shared/app-common.module";
import { FileModule } from "../file/file.module";
import { GCloudStorageService } from "./gcloud-storage-service";
import { GDriveController } from "./gdrive.controller";
import { GDriveService } from "./gdrive.service";

@Module({
    imports: [
        forwardRef(() => AppCommonModule),
        forwardRef(() => FileModule),
    ],
    controllers: [
        GDriveController,
    ],
    providers: [
        GDriveService,
        GCloudStorageService,
    ],
    exports: [
        GDriveService,
        GCloudStorageService,
    ],
})
export class GDriveModule {
    initialized = false;
    initializing = false;
    constructor(private gCloudStorageService: GCloudStorageService) {
        EventsHandler.initGdriveModule.subscribe(() => {
            this.init();
        });
        this.init();
    }
    async init() {
        if (this.initialized || this.initializing)
            return;
        this.initializing = true;
        await this.gCloudStorageService.createMainBucketIfNotExists();
        this.initialized = BaseGoogleService.initialized;
        this.initializing = false;
    }
}